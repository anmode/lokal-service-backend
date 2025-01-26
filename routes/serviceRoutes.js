const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: POST /api/services (Protected)
router.post('/', authMiddleware, serviceController.createService);

// Route: GET /api/services (Public)
router.get('/', serviceController.getServices);


module.exports = router;
