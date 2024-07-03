require('dotenv').config();
require('./config/mysql');
require('./config/broker');

const express = require('express');
const mqtt = require('mqtt');
const { addDataSensorByID } = require('./controllers/sensorController');

const { logServer } = require('./util/coloredLog');

// rest object
const app = express();

// middlewares
app.use(express.json());

app.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('Something broke !');
})

// routes
app.use('/api/v1', require('./routes/sensorRoutes'));

app.listen(process.env.SERVER_PORT, () => {
    logServer(`Server running on port ${process.env.SERVER_PORT}`, false);
});

const clientId = 'mqtt_server';

const mqttClient = mqtt.connect('mqtt://' + process.env.MQTT_HOSTNAME + ':' + process.env.MQTT_PORT, {
    clientId,
    username: process.env.AEDES_AUTH_USERNAME,
    password: process.env.AEDES_AUTH_PASSWORD
});

const topic = process.env.MQTT_TOPIC;
const qos = parseInt(process.env.MQTT_QOS);

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

mqttClient.on("message", (topic, message) => {
    const now = new Date().toLocaleTimeString();
    logServer(`MQTT Client Message ${now} - Topic: ${topic} - Message: ${message.toString()}`, false);

    const [ topicName, channel ] = topic.split('/');
    const data = JSON.parse(message.toString());
    addDataSensorByID(channel, data);
    logServer(`Data from channel ${channel} subscribed to ${topicName} added to database`, false);
});

mqttClient.on('packetsend', (packet) => {
    if (packet.cmd === 'puback') {
        logServer('QoS 1 message acknowledged', false);
    }
});

mqttClient.on('error', (error) => {
    logServer(`MQTT Client error: ${error}`, true);
    process.exit(1);
});