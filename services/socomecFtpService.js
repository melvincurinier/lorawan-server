// Import the MySQL database configuration
const mysqldb = require('../config/mysql');

/**
 * A function that get all socomec data from the database
 */
const getAllSocomecDataFromDatabase = async () => {
    // SQL query to select all data from the socomec_data table
    const query = 'SELECT * FROM socomec_data';
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
 * A function that get all data by socomec circuit from the database
 */
const getAllDataBySocomecCircuitFromDatabase = async (socomecCircuit) => {
    // SQL query to select data from the socomec_data table where the circuit name matches
    const query = `
        SELECT data.*
        FROM energetique_batiment.socomec_data data 
        INNER JOIN energetique_batiment.socomec_circuit circuit 
        ON data.data_key = circuit.data_key 
        WHERE circuit.name = ?;
    `;
    try {
        // Execute the query with the circuit name as a parameter and return the result
        const result = await mysqldb.query(query, [socomecCircuit]);
        return result;
    } catch (error) {
        // Throw an error if the query fails
        throw error;
    }
};

/**
 * A function that add socomec data to the database
 */
const addSocomecDataToDatabase = async (data) => {
    // SQL query to insert new socomec data into the socomec_data table
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

module.exports = { getAllSocomecDataFromDatabase, getAllDataBySocomecCircuitFromDatabase, addSocomecDataToDatabase };