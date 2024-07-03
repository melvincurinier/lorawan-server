const mysql = require('mysql2/promise');

const { logDatabase } = require('../util/coloredLog');

const mysqldb = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    waitForConnections: true,
    queueLimit: 0
});

async function checkConnection() {
    try{
        const connection = await mysqldb.getConnection();
        logDatabase('Database connection established', false);
        connection.release();
    } catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            logDatabase('Database connection was closed', true);
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            logDatabase('Database has too many connections', true);
        }
        if (error.code === 'ECONNREFUSED') {
            logDatabase('Database connection was refused', true);
        }
    }
}

checkConnection();

module.exports = mysqldb;
