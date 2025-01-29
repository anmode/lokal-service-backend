const express = require('express');
const router = express.Router();
const { getAllTagsGrouped } = require('../controllers/tagController');

// GET /tags -> group tags by first letter
router.get('/tags', getAllTagsGrouped);

module.exports = router;
