const express = require('express');
const { getAllSensorsData, getAllDataBySensorID } = require('../controllers/sensorController');

// Router
const router = express.Router();

// Routes

// Route to get all sensors data
// This route will handle GET requests to '/sensors'
router.get('/sensors', getAllSensorsData);

// Route to get all data from a specific sensor by its ID
// This route will handle GET requests to '/sensors/:id'
router.get('/sensors/:id', getAllDataBySensorID);

// Export the router for use in the server
module.exports = router;