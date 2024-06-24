require('dotenv').config();
const express = require('express');
const mysqldb = require('./config/mysql');
const { aedes } = require('./config/broker');
const mqtt = require('mqtt');
const { addDataSensorByID } = require('./controllers/sensorController');

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

const mqttClient = mqtt.connect('mqtt://' + process.env.MQTT_HOSTNAME + ':' + process.env.MQTT_PORT);

const topic = '#';
const qos = 1;

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
        const [ clientId, sensorId, topicName ] = topic.split('/');
        const data = JSON.parse(message.toString());
        
        addDataSensorByID(sensorId, data);

        console.log('SERVER >> Data from sensor ' + sensorId + ' added to database');
    } catch (error) {
        console.error('SERVER >> Error processing Add Data Sensor to database:', error);
    }
});

mqttClient.on('packetsend', (packet) => {
    if (packet.cmd === 'puback') {
        console.log('SERVER >> QoS 1 message acknowledged');
    }
});

mqttClient.on('error', (err) => {
    console.error('SERVER >> Connection error:', err);
});