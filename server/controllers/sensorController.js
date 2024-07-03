const sensorService = require('../services/sensorService');
const { coloredErrorLog } = require('../util/coloredLog');

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
        coloredErrorLog(error, 'green');
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
        coloredErrorLog(error, 'green');
        response.status(500).send({
            success:false,
            message:'Error in Get All Data By Sensor ID API',
            error
        });
    }
};

// ADD DATA SENSOR
const addDataSensorByID = async (sensorId, data) => {
    try {
        if (!sensorId || !data) {
            console.log('Invalid Or Provide Sensor ID or Data');
            return;
        }
        await sensorService.addDataSensorToDatabase(sensorId, data);
    } catch (error) {
        coloredErrorLog(`SERVER >> Error processing Add Data Sensor to database: ${error}`, 'green');
    }
};

module.exports = { getAllSensorsData, getAllDataBySensorID, addDataSensorByID};