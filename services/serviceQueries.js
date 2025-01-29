const Service = require('../models/Service');

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
  const pipeline = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        distanceField: 'dist.calculated',
        maxDistance: 8000,
        query: { tags: tagId },
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
      $unwind: {
        path: '$userInfo',
        preserveNullAndEmptyArrays: true,
      },
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
