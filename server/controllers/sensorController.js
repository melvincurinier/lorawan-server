const sensorService = require('../services/sensorService');
const { logServer } = require('../util/coloredLog');

/**
 * A controller function (API) that get all data from sensors
 */
const getAllSensorsData = async (request, response) => {
    try {
        // Retrieve all sensor data from the database
        const [data] = await sensorService.getAllSensorsDataFromDatabase();
        if(!data){
            // If no data is found, send a 404 response with a message
            return response.status(404).send({
                success:false,
                message:'No Records found'
            });
        }
        // Send a 200 response with the retrieved data
        response.status(200).send({
            success:true,
            message:'All Sensors Records',
            data : data
        });
    } catch (error) {
        // Log the error and send a 500 response with an error message
        logServer(error, true);
        response.status(500).send({
            success:false,
            message:'Error in Get All Sensors Data API',
            error
        });
    }
};

/**
 * A controller function (API) that get all data from a specific sensor by its ID
 */
const getAllDataBySensorID = async (request, response) => {
    try {
        const sensorId = request.params.id;
        if(!sensorId){
            // If no sensor ID is provided, send a 404 response with a message
            return response.status(404).send({
                success:false,
                message:'Invalid Or Provide Sensor ID'
            });
        }

        // Retrieve sensor data by sensor ID from the database
        const [data] = await sensorService.getAllDataBySensorIDFromDatabase(sensorId);
        if(!data){
            // If no data is found, send a 404 response with a message
            return response.status(404).send({
                success:false,
                message:'No Records found'
            });
        }
        // Send a 200 response with the retrieved data
        response.status(200).send({
            success:true,
            message:'All Data Records From Sensor ID',
            sensorData : data
        });
    } catch (error) {
        // Log the error and send a 500 response with an error message
        logServer(error, true);
        response.status(500).send({
            success:false,
            message:'Error in Get All Data By Sensor ID API',
            error
        });
    }
};

/**
 * A controller function (No API) that add sensor data by sensor ID
 */
const addDataSensorByID = async (sensorId, data) => {
    try {
        if (!sensorId || !data) {
            // If no sensor ID or data are provided, throw the error
            throw new Error('Invalid Or Provide Sensor ID or Data');
        }
        // Add the sensor data to the database
        await sensorService.addDataSensorToDatabase(sensorId, data);
        logServer(`Data added to database`, false);
    } catch (error) {
        // Log the error if adding data to the database fails
        logServer(error, true);
        logServer('Data not added to database', true);
    }
};

// Export the controller functions for use in other modules
module.exports = { getAllSensorsData, getAllDataBySensorID, addDataSensorByID};