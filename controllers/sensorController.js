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
const addDataSensorByID = async (sensor, data, time) => {
    try {
        if (!sensor || !data) {
            // If no sensor dev addr or data are provided, throw the error
            throw new Error('Provide Sensor dev addr or Data');
        }

        var validSensorData;
        var validBatVoltage;
        if ( validSensorData = isSensorDataTempAndHum(data)) {
            // Add the sensor data to the database
            await sensorService.addDataSensorToDatabase(sensor, data);
            console.log('Data added to database');
        } else if ( validSensorData = isSensorDataDoor(data)) {
            await controlDoorSensor(sensor, data, time);
        }
        if ( validBatVoltage = isSensorDataBatVoltage(data)) {
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

const doorSensors = {};

const controlDoorSensor = (sensor, data, time) => {
    const timestamp = convertTimeIntoSeconds(time);
    if(data['ALARM'] == 1){
        doorSensors[sensor] = { state: 'open', timestamp: timestamp };
        console.log(`Sensor ${sensor} : door open at ${time}`);
    } else if (data['ALARM'] == 0) {
        if (sensor in doorSensors && doorSensors[sensor].state == 'open') {
            const duration = (timestamp - doorSensors[sensor].timestamp) + 2; // in seconds, +2 is for the alarm detection
            console.log(`Sensor ${sensor} : door closed at ${time}, open duration ${duration} seconds`);

            doorSensors[sensor] = { state: 'closed', timestamp: 0 };
        } else {
            console.log(`No opening recorded for door sensor ${sensor} before closing.`);
        }
    }
}

function convertTimeIntoSeconds(timestamp) {
    const [ hours, minutes, seconds ] = timestamp.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * A function that validate if the data contains the temperature and humidity sensor keys
 */
const isSensorDataTempAndHum = (data) => {
    const requiredKeys = ['Hum_SHT', 'TempC_DS'];
    return requiredKeys.every(key => key in data);
};

/**
 * A function that validate if the data contains the door sensor keys
 */
const isSensorDataDoor = (data) => {
    const requiredKeys = ['LAST_DOOR_OPEN_DURATION','DOOR_OPEN_TIMES', 'ALARM'];
    return requiredKeys.every(key => key in data);
};

/**
 * A function that validate if the data contains the bat voltage sensor key
 */
const isSensorDataBatVoltage = (data) => {
    const requiredKeys = ['BatV', 'Bat_V'];
    return requiredKeys.some(key => key in data);
};

// Export the controller functions for use in other modules
module.exports = { getAllSensorsData, getAllDataBySensorID, addDataSensorByID};