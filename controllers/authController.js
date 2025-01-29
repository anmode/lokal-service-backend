const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  const { tokenId } = req.body;
  console.log(tokenId);

  if (!tokenId) {
    return res.status(400).json({ message: 'Token ID is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = new User({
        email,
        name,
        profilePicture: picture,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during Google authentication:', error.message);
    res.status(400).json({ message: 'Invalid token' });
  }
};
