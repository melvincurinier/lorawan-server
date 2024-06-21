require('dotenv').config();
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);

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

module.exports = { aedes };

