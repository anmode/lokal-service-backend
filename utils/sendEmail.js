const transporterPromise = require('../config/mailer');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const { EMAIL_FROM, NODE_ENV } = process.env;

async function sendEmail(to, subject, text, html) {
  try {
    const transporter = await transporterPromise;

    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Message sent: ${info.messageId}`);

    if (NODE_ENV !== 'production') {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// sendEmail(
//   'recipient@example.com',
//   'Test Email',
//   'Hello! This is a test email.',
//   '<h1>Hello!</h1><p>This is a test email.</p>'
// );
