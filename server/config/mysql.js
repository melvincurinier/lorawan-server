const mysql = require('mysql2/promise');

const { coloredLog, coloredErrorLog } = require('../util/coloredLog');

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
        coloredLog('DATABASE >> Connected to server', 'red');
        connection.release();
    } catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            coloredErrorLog('DATABASE >> Database connection was closed', 'red');
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            coloredErrorLogr('DATABASE >> Database has too many connections', 'red');
        }
        if (error.code === 'ECONNREFUSED') {
            coloredErrorLog('DATABASE >> Database connection was refused', 'red');
        }
    }
}

checkConnection();

module.exports = mysqldb;
