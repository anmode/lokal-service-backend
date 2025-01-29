const Tag = require('../models/Tag');

/**
 * GET /tags
 * Returns tags grouped by the first alphabet letter.
 * Example response structure:
 * {
 *   A: ["apple", "amazon"],
 *   B: ["book", "blue"],
 *   ...
 * }
 */
exports.getAllTagsGrouped = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    const groupedByLetter = {};

    tags.forEach((tag) => {
      if (!tag.name || tag.name.length === 0) return;

      const firstLetter = tag.name[0].toUpperCase();
      if (!groupedByLetter[firstLetter]) {
        groupedByLetter[firstLetter] = [];
      }
      groupedByLetter[firstLetter].push(tag.name);
    });
    return res.status(200).json(groupedByLetter);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
