// Import the MySQL database configuration
const mysqldb = require('../config/mysql');

/**
 * A function that add sensor data to the database
 */
const addSocomecDataToDatabase = async (data) => {
    // SQL query to insert new sensor data into the sensor_data table
    const query = 'INSERT INTO socomec_data (data_key, date, value) VALUES (?, ?, ?)';
    // Create an array of values to be inserted
    const values = [data['Data Key'], data['Local DateTime'], data['Value']];
    try {
        // Execute the query with the values array and return the result
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

module.exports = { addSocomecDataToDatabase };