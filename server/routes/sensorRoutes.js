const express = require('express');
const { getAllSensorsData, getAllDataBySensorID} = require('../controllers/sensorController');

// router object
const router = express.Router();

// routes

// GET ALL SENSORS DATA
router.get('/getall', getAllSensorsData);

// GET ALL DATA FROM A SENSOR ID
router.get('/get/:id', getAllDataBySensorID);

module.exports = router;