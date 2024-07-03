require('dotenv').config();
require('./config/mysql');
require('./config/broker');

const express = require('express');
const mqtt = require('mqtt');
const { addDataSensorByID } = require('./controllers/sensorController');

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
    console.log('SERVER >> Server running on port ' + process.env.SERVER_PORT);
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
    console.log('SERVER >> Connected to MQTT broker');
    mqttClient.subscribe(topic, { qos: qos }, (error) => {
        if(!error) { 
            console.log('SERVER >> Suscribed QoS ' + qos + ' to MQTT broker topic : ' + topic);
        } else {
            console.log('SERVER >> ' + error);
        }
    });
});

mqttClient.on("message", (topic, message) => {
    const now = new Date().toLocaleTimeString();
    console.log(`SERVER >> MQTT Client Message ${now} - Topic: ${topic} - Message: ${message.toString()}`);

    try{
        const [ topicName, channel ] = topic.split('/');
        const data = JSON.parse(message.toString());
        
        addDataSensorByID(channel, data);

        console.log('SERVER >> Data from channel ' + channel + ' subscribed to ' + topicName + ' added to database');
    } catch (error) {
        console.error('SERVER >> Error processing Add Data Sensor to database:', error);
    }
});

mqttClient.on('packetsend', (packet) => {
    if (packet.cmd === 'puback') {
        console.log('SERVER >> QoS 1 message acknowledged');
    }
});

mqttClient.on('error', (error) => {
    console.error('SERVER >> MQTT Client error:', error);
    process.exit(1);
});