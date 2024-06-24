const sensorService = require('../services/sensorService');

// API

// GET ALL DATA FROM SENSORS
const getAllSensorsData = async (request, response) => {
    try {
        const [data] = await sensorService.getAllSensorsDataFromDatabase();
        if(!data){
            return response.status(404).send({
                success:false,
                message:'No Records found'
            });
        }
        response.status(200).send({
            success:true,
            message:'All Sensors Records',
            data : data
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            success:false,
            message:'Error in Get All Sensors Data API',
            error
        });
    }
};

// GET ALL DATA FROM SENSOR ID
const getAllDataBySensorID = async (request, response) => {
    try {
        const sensorId = request.params.id;
        if(!sensorId){
            return response.status(404).send({
                success:false,
                message:'Invalid Or Provide Sensor ID'
            });
        }

        const [data] = await sensorService.getAllDataBySensorIDFromDatabase(sensorId);
        if(!data){
            return response.status(404).send({
                success:false,
                message:'No Records found'
            });
        }
        response.status(200).send({
            success:true,
            message:'All Data Records From Sensor ID',
            sensorData : data
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            success:false,
            message:'Error in Get All Data By Sensor ID API',
            error
        });
    }
};

// ADD DATA SENSOR
const addDataSensorByID = async (request, response) => {
    try {
        const { sensorId, data } = request.body;
        if (!sensorId || !data) {
            return response.status(400).send({
            success: false,
            message: 'Invalid Or Provide Sensor ID or Data'
            });
        }

        await sensorService.addDataSensorToDatabase(sensorId, data);

        response.status(200).send({
            success: true,
            message: 'Data added successfully'
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            success: false,
            message: 'Error in Add Data Sensor API',
            error
        });
    }
};

module.exports = { getAllSensorsData, getAllDataBySensorID, addDataSensorByID};