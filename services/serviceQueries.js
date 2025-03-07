const Service = require('../models/Service');
const mongoose = require('mongoose');

/**
 * Fetch services by tag within a certain distance using $geoNear.
 * @param {ObjectId} tagId       - The _id of the Tag document
 * @param {Number}  lat         - Latitude
 * @param {Number}  lon         - Longitude
 * @param {Number}  radiusMeters - Max distance in meters
 * @param {Number}  skip        - Documents to skip (for pagination)
 * @param {Number}  limit       - Documents per page
 * @returns {Object}            - { services: [], totalCount: number }
 */
async function getServicesByTagAndLocation(tagId, lat, lon, radiusMeters, skip, limit) {
  // Convert tagId to an ObjectId
  const tagObjectId = new mongoose.Types.ObjectId(String(tagId));

  const pipeline = [
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lon, lat] },
        distanceField: 'dist.calculated',
        maxDistance: radiusMeters, // e.g., 10000 for 10km
        // query: { tags: tagObjectId },
        spherical: true,
        key: 'location',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    {
      $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tagInfo',
      },
    },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  // Debug: log each stage result
  // for (let i = 1; i <= pipeline.length; i++) {
  //   try {
  //     const partialPipeline = pipeline.slice(0, i);
  //     const partialResult = await Service.aggregate(partialPipeline);
  //     console.log(`After stage ${i} (${JSON.stringify(pipeline[i - 1])}):`, partialResult);
  //   } catch (error) {
  //     console.error(`Error at stage ${i}:`, error);
  //   }
  // }

  const results = await Service.aggregate(pipeline);
  const facetData = results[0] || {};
  const services = facetData.data || [];
  const totalCountArray = facetData.totalCount || [];
  const totalCount = totalCountArray.length > 0 ? totalCountArray[0].count : 0;

  return { services, totalCount };
}

module.exports = {
  getServicesByTagAndLocation,
};
