// Import modules
const sensorService = require('../services/sensorService');

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
        console.error(`Error getting data: ${error}`);
        response.status(500).send({
            success:false,
            message:'Error in Get All Sensors Data API',
            error
        });
    }
};

/**
 * A controller function (API) that get all data from a specific sensor by its dev addr
 */
const getAllDataBySensorID = async (request, response) => {
    try {
        const sensor = request.params.id;
        if(!sensor){
            // If no sensor dev addr is provided, send a 404 response with a message
            return response.status(404).send({
                success:false,
                message:'Invalid Or Provide Sensor dev addr'
            });
        }

        // Retrieve sensor data by sensor dev addr from the database
        const [data] = await sensorService.getAllDataBySensorIDFromDatabase(sensor);
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
        console.error(`Error getting data: ${error}`);
        response.status(500).send({
            success:false,
            message:'Error in Get All Data By Sensor ID API',
            error
        });
    }
};

/**
 * A controller function that add sensor data by sensor dev addr
 */
const addDataSensorByID = async (sensor, data) => {
    try {
        if (!sensor || !data) {
            // If no sensor dev addr or data are provided, throw the error
            throw new Error('Provide Sensor dev addr or Data');
        }

        var validSensorData;
        var validBatVoltage;
        if ( validSensorData = isValidSensorData(data)) {
            // Add the sensor data to the database
            await sensorService.addDataSensorToDatabase(sensor, data);
            console.log('Data added to database');
        }
        if ( validBatVoltage = isBatVoltageSensorData(data)) {
            var batV;
            if(data['Bat_V']) batV = data['Bat_V'];
            else if(data['BatV']) batV = data['BatV'];
            await sensorService.updateBatVoltageSensor(sensor,batV);
            console.log('Battery voltage sensor updated');
        } 
        if (!validSensorData && !validBatVoltage) {
            // If the data does contain invalid data, throw the error
            throw new Error('Invalid data format');
        }
    } catch (error) {
        // Log the error if adding data to the database fails
        console.error(`Data not added to database: ${error}`);
    }
};

/**
 * A function that validate if the data contains the required keys
 */
const isValidSensorData = (data) => {
    const requiredKeys = ['Hum_SHT', 'TempC_DS'];
    return requiredKeys.every(key => key in data);
};

/**
 * A function that validate if the data contains the required keys
 */
const isBatVoltageSensorData = (data) => {
    const requiredKeys = ['BatV', 'Bat_V'];
    return requiredKeys.some(key => key in data);
};

// Export the controller functions for use in other modules
module.exports = { getAllSensorsData, getAllDataBySensorID, addDataSensorByID};