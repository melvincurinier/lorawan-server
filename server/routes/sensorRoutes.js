const express = require('express');
const { getAllSensorsData, getAllDataBySensorID } = require('../controllers/sensorController');

// router object
const router = express.Router();

// routes

// GET ALL SENSORS DATA
router.get('/sensors', getAllSensorsData);

// GET ALL DATA FROM SENSOR ID
router.get('/sensors/:id', getAllDataBySensorID);

module.exports = router;