const mysql = require('mysql2/promise');

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
        console.log('DATABASE >> Connected to server');
        connection.release();
    } catch (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE >> Database connection was closed');
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE >> Database has too many connections');
        }
        if (error.code === 'ECONNREFUSED') {
            console.error('DATABASE >> Database connection was refused');
        }
    }
}

checkConnection();

module.exports = mysqldb;
