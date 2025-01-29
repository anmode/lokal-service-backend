const Service = require('../models/Service');
const Tag = require('../models/Tag');
const generateServiceId = require('../utils/generateServiceId');
const { getServicesByTagAndLocation } = require('../services/serviceQueries');

exports.createService = async (req, res) => {
  const { serviceType, tags, description, location, contactNumber, category } = req.body;
  const userId = req.user.userId;

  if (!serviceType || !description || !location || !contactNumber) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const serviceId = await generateServiceId(userId);

    // Process tags: ensure each tag exists in the Tag collection
    let tagIds = [];
    if (tags && tags.length > 0) {
      tagIds = await Promise.all(tags.map(async (tagName) => {
        const formattedTagName = tagName.trim().toLowerCase();
        let tag = await Tag.findOne({ name: formattedTagName });
        if (!tag) {
          tag = new Tag({ name: formattedTagName });
          await tag.save();
        }

        return tag._id;
      }));
    }

    const service = new Service({
      _id: serviceId,
      userId,
      serviceType,
      tags: tagIds,
      description,
      location,
      contactNumber,
      category,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.getServices = async (req, res) => {
  try {
    const {
      tag,
      latitude,
      longitude,
      page = 1,
      limit = 10,
    } = req.query;

    if (!tag) {
      return res.status(400).json({ message: 'Tag parameter is required.' });
    }
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Both latitude and longitude are required for location filtering.'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: 'Invalid latitude or longitude values.' });
    }

    const normalizedTag = tag.trim().toLowerCase();
    const foundTag = await Tag.findOne({ name: normalizedTag });
    if (!foundTag) {
      return res.status(200).json({
        services: [],
        total: 0,
        page: parseInt(page, 10),
        pages: 0,
      });
    }

    const radiusInKm = 10;
    const radiusInMeters = radiusInKm * 1000;

    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const { services, totalCount } = await getServicesByTagAndLocation(
      foundTag._id,
      lat,
      lon,
      radiusInMeters,
      skip,
      parsedLimit
    );

    const totalPages = Math.ceil(totalCount / parsedLimit);

    return res.status(200).json({
      services,
      total: totalCount,
      page: parsedPage,
      pages: totalPages,
    });

  } catch (error) {
    console.error('Error fetching services:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

