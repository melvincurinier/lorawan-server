require('dotenv').config();
require('./config/mysql');
require('./config/broker');

const express = require('express');
const mqtt = require('mqtt');
const { addDataSensorByID } = require('./controllers/sensorController');

const { coloredLog, coloredErrorLog } = require('./util/coloredLog');

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
    coloredLog(`SERVER >> Server running on port ${process.env.SERVER_PORT}`, 'green');
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
    coloredLog('SERVER >> Connected to MQTT broker', 'green');
    mqttClient.subscribe(topic, { qos: qos }, (error) => {
        if(!error) { 
            coloredLog(`SERVER >> Suscribed QoS ${qos} to MQTT broker topic : ${topic}`, 'green');
        } else {
            coloredErrorLog(`SERVER >> ${error}`, 'green');
        }
    });
});

mqttClient.on("message", (topic, message) => {
    const now = new Date().toLocaleTimeString();
    coloredLog(`SERVER >> MQTT Client Message ${now} - Topic: ${topic} - Message: ${message.toString()}`, 'green');

    try{
        const [ topicName, channel ] = topic.split('/');
        const data = JSON.parse(message.toString());
        
        addDataSensorByID(channel, data);

        coloredLog(`SERVER >> Data from channel ${channel} subscribed to ${topicName} added to database`, 'green');
    } catch (error) {
        coloredErrorLog(`SERVER >> Error processing Add Data Sensor to database: ${error}`, 'green');
    }
});

mqttClient.on('packetsend', (packet) => {
    if (packet.cmd === 'puback') {
        coloredLog('SERVER >> QoS 1 message acknowledged', 'green');
    }
});

mqttClient.on('error', (error) => {
    coloredErrorLog(`SERVER >> MQTT Client error: ${error}`, 'green');
    process.exit(1);
});