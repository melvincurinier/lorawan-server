// Import modules
const mysql = require('mysql2/promise');

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
async function checkDbConnection() {
    try{
        // Attempt to get a connection from the pool
        const connection = await mysqldb.getConnection();
        console.log('Database connection established', false);

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        // Handle specific connection errors and log appropriate messages
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error(`Database connection was closed: ${error}`);
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error(`Database has too many connections: ${error}`);
        } else if (error.code === 'ECONNREFUSED') {
            console.error(`Database connection was refused: ${error}`);
        }
    }
}

// Export the connection pool for use in other modules
module.exports = { mysqldb, checkDbConnection};
