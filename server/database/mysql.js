const mysql = require('mysql2/promise');
require('dotenv').config();

const mySQLpool = mysql.createPool({
    host:process.env.MYSQL_HOSTNAME,
    user:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DBNAME
});

module.exports = mySQLpool;