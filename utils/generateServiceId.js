const Service = require('../models/Service');

/**
 * Generates the next service ID for a given user.
 * @param {String} userId - The UUID of the user.
 * @returns {String} - The generated service ID.x
 */
const generateServiceId = async (userId) => {
  const latestService = await Service.findOne({ userId })
    .sort({ createdAt: -1 })
    .exec();

  let counter = 1;

  if (latestService && latestService._id.startsWith(userId)) {
    const latestCounter = parseInt(latestService._id.split('-').pop(), 10);
    counter = latestCounter + 1;
  }

  if (counter > 999) {
    throw new Error('Maximum number of services reached for this user.');
  }

  const counterPadded = String(counter).padStart(3, '0');
  const serviceId = `${userId}-${counterPadded}`;

  return serviceId;
};

module.exports = generateServiceId;
