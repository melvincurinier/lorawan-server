require('dotenv').config();
const express = require('express');
const mysqldb = require('./config/mysql');
const { aedes, mqttClient } = require('./config/broker');

// rest object
const app = express();
const port = 8080;

// middlewares
app.use(express.json());

// routes
app.use('/api/v1', require('./routes/sensorRoutes'));

app.get('/test', (request, response) => {
    response.status(200).send('<h1>Nodejs server</h1>');
});

app.listen(port, () => {
    console.log('SERVER >> Server running on port ' + port);
});