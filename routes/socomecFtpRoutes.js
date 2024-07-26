// Import modules
const express = require('express');
const { getAllSocomecData, getAllDataBySocomecCircuit } = require('../controllers/socomecFtpController');

// Router
const router = express.Router();

// Routes

// Route to get all socomec data
// This route will handle GET requests to '/socomec'
router.get('/socomec', getAllSocomecData);

// Route to get all data from a specific circuit by its name
// This route will handle GET requests to '/socomec/:circuit'
router.get('/socomec/:circuit', getAllDataBySocomecCircuit);

// Export the router for use in the server
module.exports = router;