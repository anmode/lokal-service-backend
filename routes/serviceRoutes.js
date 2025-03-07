const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: POST /api/services (Protected)
router.post('/', authMiddleware, serviceController.createService);
router.get('/user', authMiddleware, serviceController.getUserServices);

// Route: GET /api/services (Public)
router.get('/', serviceController.getServices);


module.exports = router;
