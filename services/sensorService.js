// Import the MySQL database configuration
const { mysqldb } = require('../config/mysql');

/**
 * A function that get all temperature and humidity sensor data from the database
 */
const getAllTempHumSensorsDataFromDatabase = async () => {
    // SQL query to select all data from the sensor_data table
    const query = 'SELECT * FROM sensor_temp_hum_data';
    try {
        // Execute the query and return the result
        const result = await mysqldb.query(query);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that get all temperature and humidity data by sensor dev addr from the database
 */
const getAllTempHumDataBySensorIDFromDatabase = async (sensor) => {
    // SQL query to select data from the sensor_data table where the sensor dev addr matches
    const query = 'SELECT * FROM sensor_temp_hum_data WHERE sensor_dev_addr=?';
    try {
        // Execute the query with the sensor dev addr as a parameter and return the result
        const result = await mysqldb.query(query, [sensor]);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that add temperature and humidity sensor data to the database
 */
const addTempHumDataSensorToDatabase = async (sensor, data) => {
    // SQL query to insert new sensor data into the sensor data table
    const query = 'INSERT INTO sensor_temp_hum_data (sensor_dev_addr, tempC_SHT, hum_SHT, ext_value) VALUES (?, ?, ?, ?)';
    // Destructure the data object to extract individual data points
    const tempC_SHT = data['TempC_SHT'];
    const hum_SHT = data['Hum_SHT'];
    // Find the key of the external data sensor and extract it
    const ext_key = findExtSensorKey(data);
    const ext_value = data[ext_key];
    // Create an array of values to be inserted
    const values = [sensor, tempC_SHT, hum_SHT, ext_value];
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that add door sensor data to the database
 */
const addDoorDataSensorToDatabase = async (sensor, data) => {
    // SQL query to insert new sensor data into the sensor data table
    const query = 'INSERT INTO sensor_door_data (sensor_dev_addr, duration, date) VALUES (?, ?, ?)';
    // Destructure the data object to extract individual data points
    const duration = data[0];
    const date = data[1].date + ' ' + data[1].hour; // MySQL date format

    // Create an array of values to be inserted
    const values = [sensor, duration, date];
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that add delta pressure data to the database
 */
const addDeltaPressureSensorToDatabase = async (sensor, data) => {
    // SQL query to insert new sensor data into the sensor data table
    const query = 'INSERT INTO sensor_pressure_data (sensor_dev_addr, delta_pressure_pa) VALUES (?, ?)';
    // Destructure the data object to extract individual data points
    const delta_pressure = data['instantaneous_delta_pressure_pa'];

    // Create an array of values to be inserted
    const values = [sensor, delta_pressure];
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
}

/**
 * A function that update sensor battery voltage to the database
 */
const updateBatVoltageSensor = async (sensor, batV) => {
    // SQL query to update battery voltage sensor into the sensor table
    const query = 'UPDATE sensor SET battery_voltage = ? WHERE dev_addr = ?';
    // Create an array of values to be inserted
    const values = [batV, sensor];
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that find the external sensor key in the data
 */
const findExtSensorKey = (data) => {
    const extSensorKeys = ['TempC_DS', 'TempC1'];
    return extSensorKeys.find(key => key in data);
}

const getModelBySensorID = async (sensor) => {
    // SQL query to update battery voltage sensor into the sensor table
    const query = 'SELECT model FROM sensor WHERE dev_addr = ?';
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, [sensor]);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
}

// Export the functions for use in other modules
module.exports = { 
    getAllTempHumSensorsDataFromDatabase, 
    getAllTempHumDataBySensorIDFromDatabase, 
    addTempHumDataSensorToDatabase, 
    addDoorDataSensorToDatabase, 
    updateBatVoltageSensor,
    getModelBySensorID,
    addDeltaPressureSensorToDatabase
};