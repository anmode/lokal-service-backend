const Service = require('../models/Service');
const generateServiceId = require('../utils/generateServiceId');

exports.createService = async (req, res) => {
  const { serviceType, tags, description, location, contactNumber } = req.body;
  const userId = req.user.userId;

  if (!serviceType || !description || !location || !contactNumber) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const serviceId = await generateServiceId(userId);

    const service = new Service({
      _id: serviceId,
      userId,
      serviceType,
      tags,
      description,
      location,
      contactNumber,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getServices = async (req, res) => {
  const { serviceType, tags, location, page = 1, limit = 10 } = req.query;
  let filter = {};

  if (serviceType) filter.serviceType = serviceType;
  if (tags) filter.tags = { $in: tags.split(',') };
  if (location) filter.location = { $regex: location, $options: 'i' };

  try {
    const services = await Service.find(filter)
      .populate('userId', 'name profilePicture')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
