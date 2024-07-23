// Import the MySQL database configuration
const mysqldb = require('../config/mysql');

/**
 * A function that get all sensor data from the database
 */
const getAllSensorsDataFromDatabase = async () => {
    // SQL query to select all data from the sensor_data table
    const query = 'SELECT * FROM sensor_data';
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
 * A function that get all data by sensor ID from the database
 */
const getAllDataBySensorIDFromDatabase = async (sensorId) => {
    // SQL query to select data from the sensor_data table where the sensor ID matches
    const query = 'SELECT * FROM sensor_data WHERE sensor_dev_addr=?';
    try {
        // Execute the query with the sensor ID as a parameter and return the result
        const result = await mysqldb.query(query, [sensorId]);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that add sensor data to the database
 */
const addDataSensorToDatabase = async (sensorId, data) => {
    // SQL query to insert new sensor data into the sensor_data table
    const query = 'INSERT INTO sensor_data (sensor_dev_addr, tempC_SHT, hum_SHT, tempC_DS) VALUES (?, ?, ?, ?)';
    // Destructure the data object to extract individual data points
    const { TempC_SHT, Hum_SHT, TempC_DS } = data;
    // Create an array of values to be inserted
    const values = [sensorId, TempC_SHT, Hum_SHT, TempC_DS];
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

// Export the functions for use in other modules
module.exports = { getAllSensorsDataFromDatabase, getAllDataBySensorIDFromDatabase, addDataSensorToDatabase };