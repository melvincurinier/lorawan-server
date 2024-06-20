require('dotenv').config();
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const mqtt = require('mqtt');

server.listen(process.env.MQTT_PORT, () => {
  console.log('BROKER >> MQTT broker started and running on port ' + process.env.MQTT_PORT);
});

// Log des connexions et déconnexions
aedes.on('client', (client) => {
    console.log(`BROKER >> Client connected: ${client.id}`);
});
  
aedes.on('clientDisconnect', (client) => {
    console.log(`BROKER >> Client disconnected: ${client.id}`);
});

const mqttClient = mqtt.connect('mqtt://' + process.env.MQTT_HOSTNAME + ':' + process.env.MQTT_PORT);

const topic = '#';

mqttClient.on('connect', () => {
    console.log('SERVER >> Connected to MQTT broker');

    mqttClient.subscribe(topic, (error) => {
        console.log('SERVER >> Suscribed to MQTT broker topic : ' + topic);
        if(error) { console.log(error); }
    });
});

mqttClient.on("message", (topic, message) => {
    const now = new Date().toLocaleTimeString();
    console.log(`SERVER >> MQTT Client Message ${now} - Topic: ${topic} - Message: ${message.toString()}`);
});



module.exports = { aedes, mqttClient };

