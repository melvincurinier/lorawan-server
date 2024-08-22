// Import the MySQL database configuration
const { mysqldb } = require('../config/mysql');

/**
 * A function that get all temperature and humidity sensor data from the database
 */
const getAllSensorsDataFromDatabase = async () => {
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
const getAllDataBySensorIDFromDatabase = async (sensor) => {
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
    // SQL query to insert new sensor data into the sensor_data table
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
    // SQL query to insert new sensor data into the sensor_data table
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
    const extSensorKeys = ['TempC_DS'];
    return extSensorKeys.find(key => key in data);
}

// Export the functions for use in other modules
module.exports = { getAllSensorsDataFromDatabase, getAllDataBySensorIDFromDatabase, addTempHumDataSensorToDatabase, addDoorDataSensorToDatabase, updateBatVoltageSensor };