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
            await sensorService.addTempHumDataSensorToDatabase(sensor, data);
            console.log('Data added to database');
        } else if ( validSensorData = isSensorDataDoor(data)) {
            await controlDoorSensor(sensor, data, time);
            console.log('Data added to database');
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
/**
 * A function that control door sensor requests
 */
const controlDoorSensor = async (sensor, data, time) => {
    const timestamp = convertTimeIntoSeconds(time.hour);

    // Check if the alarm indicates the door is open
    if(data['ALARM'] == 1){
        // Record the door's state as 'open' and store the timestamp of when it was opened
        doorSensors[sensor] = { state: 'open', timestamp: timestamp };
        console.log(`Sensor ${sensor} : door open at ${time.hour}`);
    } else if (data['ALARM'] == 0) { // Check if the alarm indicates the door is closed
        if (sensor in doorSensors && doorSensors[sensor].state == 'open') { // Check if the door was previously recorded as open
            // Calculate the duration the door was open
            // Add 2 seconds to account for alarm detection delay
            const duration = (timestamp - doorSensors[sensor].timestamp) + 2;
            console.log(`Sensor ${sensor} : door closed at ${time.hour}, open duration ${duration} seconds`);
            
            // Prepare the data to be saved in the database, including duration and current time
            const data = [duration, time];
            await sensorService.addDoorDataSensorToDatabase(sensor, data);

            // Update the door's state to 'closed' and reset the timestamp
            doorSensors[sensor] = { state: 'closed', timestamp: 0 };
        } else {
            console.log(`No opening recorded for door sensor ${sensor} before closing.`);
        }
    }
}

/**
 * A function that convert time into seconds
 */
function convertTimeIntoSeconds(timestamp) {
    const [ hours, minutes, seconds ] = timestamp.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * A function that validate if the data contains the temperature and humidity sensor keys
 */
const isSensorDataTempAndHum = (data) => {
    const requiredKeys = ['Hum_SHT', 'TempC_SHT'];
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