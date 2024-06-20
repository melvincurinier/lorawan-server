require('dotenv').config();
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const mqtt = require('mqtt');

server.listen(process.env.MQTT_PORT, () => {
  console.log('MQTT broker started and listened on port ' + process.env.MQTT_PORT);
});

const mqttClient = mqtt.connect('mqtt://' + process.env.MQTT_HOSTNAME + ':' + process.env.MQTT_PORT);

const topic = '#';

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe(topic, (err) => {
        if(err) { console.log(err); }
    });

    mqttClient.on("message", (topic, message) => {
        console.log(`MQTT Client Message.  Topic: ${topic}.  Message: ${message.toString()}`);
    });
});

aedes.on('publish', async (packet, client) => {
    const message = packet.payload.toString();
    // Process the message and perform database operations
    console.log(`Message received on some/topic: ${message}`);
});

module.exports = { aedes, mqttClient };

