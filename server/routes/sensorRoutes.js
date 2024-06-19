const express = require('express');
const { getAllSensorsData } = require('../controllers/sensorController');

// router object
const router = express.Router();

// routes

// GET ALL SENSORS DATA
router.get('/getall', getAllSensorsData);

module.exports = router;