const mysql = require('mysql2/promise');

const mysqldb = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    waitForConnections: true,
    queueLimit: 0
});

module.exports = mysqldb;
