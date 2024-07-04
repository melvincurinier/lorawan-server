const mysql = require('mysql2/promise');

const { logDatabase } = require('../util/coloredLog');

// Create a connection pool to the MySQL database
const mysqldb = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
});

/**
 * A function that check the database connection
 */
async function checkConnection() {
    try{
        // Attempt to get a connection from the pool
        const connection = await mysqldb.getConnection();

        logDatabase('Database connection established', false);

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        // Handle specific connection errors and log appropriate messages
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            logDatabase('Database connection was closed', true);
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            logDatabase('Database has too many connections', true);
        } else if (error.code === 'ECONNREFUSED') {
            logDatabase('Database connection was refused', true);
        }
    }
}

// Check the status of database connection
checkConnection();

// Export the connection pool for use in other modules
module.exports = mysqldb;
