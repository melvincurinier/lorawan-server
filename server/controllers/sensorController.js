const mysqldb = require('../config/mysql');

const getAllSensorsData = async (request, response) => {
    try {
        const data = await mysqldb.query('SELECT * FROM sensor_data');
        if(!data){
            return response.status(404).send({
                success:false,
                message:'No Records found'
            });
        }
        response.status(200).send({
            success:true,
            message:'All Sensors Records',
            data : data[0]
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

// GET ALL DATA FROM A SENSOR ID
const getAllDataBySensorID = async (request, response) => {
    try {
        const sensorId = request.params.id;
        if(!sensorId){
            return response.status(404).send({
                success:false,
                message:'Invalid Or Provide Sensor ID'
            });
        }

        const data = await mysqldb.query('SELECT * FROM sensor_data WHERE sensor_id=?', [sensorId]);
        if(!data){
            return response.status(404).send({
                success:false,
                message:'No Records found'
            });
        }
        response.status(200).send({
            success:true,
            message:'All Data Records From Sensor ID',
            sensorData : data[0]
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

module.exports = { getAllSensorsData, getAllDataBySensorID};