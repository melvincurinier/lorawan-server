// Load environment variables from .env file
require('dotenv').config();

// Initialize MySQL database connection
require('./config/mysql');

// Initialize MQTT broker
require('./config/broker');

// Initialize FTP server
require('./config/ftp');

// Import modules
const express = require('express');
const mqtt = require('mqtt');
const { addDataSensorByID } = require('./controllers/sensorController');
const { logServer } = require('./util/coloredLog');

// Rest object (Express application instance)
const app = express();

// middlewares
// Use JSON middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Error handling middleware
app.use((error, request, response, next) => {
    console.error(error.stack); // Log the error stack trace
    response.status(500).send('Internal Server Error'); // Send a 500 response with a message
})

// Use the sensor routes for any routes starting with /api/v1
app.use('/api/v1', require('./routes/sensorRoutes'), require('./routes/socomecFtpRoutes'));

// Start the server and listen on the specified port
app.listen(process.env.SERVER_PORT, () => {
    logServer(`Server ${process.env.SERVER_ID} running on port ${process.env.SERVER_PORT}`, false);
});

// MQTT client options
const options = {
    clientId: process.env.SERVER_ID,
    username: process.env.AEDES_AUTH_USERNAME,
    password: process.env.AEDES_AUTH_PASSWORD,
    clean: false,
}

// Create a MQTT Client connected to the MQTT broker
const mqttClient = mqtt.connect('mqtt://' + process.env.MQTT_HOSTNAME + ':' + process.env.MQTT_PORT, options);

// MQTT topic and QoS level
const topic = process.env.MQTT_TOPIC;
const qos = parseInt(process.env.MQTT_QOS);

// Event handler for successful connection to the MQTT broker
mqttClient.on('connect', () => {
    logServer('Connected to MQTT broker', false);
    mqttClient.subscribe(topic, { qos: qos }, (error) => {
        if(!error) { 
            logServer(`Suscribed QoS ${qos} to MQTT broker topic : ${topic}`, false);
        } else {
            logServer(`${error}`, true);
        }
    });
});

// Event handler for incoming MQTT messages
mqttClient.on("message", (topic, message) => {
    const now = new Date().toLocaleTimeString();
    logServer(`MQTT Client Message ${now} - Topic: ${topic} - Message: ${message.toString()}`, false);

    // Split the topic to extract the channel
    const [ topicName, channel ] = topic.split('/');

    // Parse the message as JSON
    const data = JSON.parse(message.toString());

    // Add the sensor data to the database
    addDataSensorByID(channel, data);
});

// Event handler for QoS 1 message acknowledgment
mqttClient.on('packetsend', (packet) => {
    if (packet.cmd === 'puback') {
        logServer('QoS 1 message acknowledged', false);
    }
});

// Event handler for MQTT client errors
mqttClient.on('error', (error) => {
    logServer(`MQTT Client error: ${error}`, true);
    process.exit(1); // Exit the process on error
});