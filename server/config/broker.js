require('dotenv').config({ path: '../.env' });

const { coloredLog } = require('../util/coloredLog');

const aedes = require('aedes')({
  concurrency: process.env.CONCURRENCY || 10000,
  queueLimit: process.env.QUEUE_LIMIT || 100,
  connectTimeout: process.env.CONNECTION_TIMEOUT || 30000,
  clean: false,
  authenticate: (client, username, password, callback) => {
    let passwordToString = '';
    if(password) passwordToString = password.toString();
    if (process.env.AEDES_AUTH_USERNAME && process.env.AEDES_AUTH_PASSWORD) {
      if (username === process.env.AEDES_AUTH_USERNAME && passwordToString === process.env.AEDES_AUTH_PASSWORD) {
        coloredLog(`BROKER >> Client Authenticated ${client.id}`, 'blue');
        callback(null, true);
        return;
      }
      coloredLog(`BROKER >> Client Not Authenticated ${client.id}`, 'blue');
      const error = new Error("Auth error");
      error.returnCode = 4;
      callback(error, null);
      return;
    }
    coloredLog(`BROKER >> Zero Auth ${client.id}`, 'blue');
    callback(null, true);
    return;
  }
});

// emitted when a client connects to the broker
aedes.on('client', function (client) {
  coloredLog(`BROKER >> CLIENT_CONNECTED : MQTT Client ${(client ? client.id : client)} connected to aedes broker ${aedes.id}`, 'blue')
})

// emitted when a client disconnects from the broker
aedes.on('clientDisconnect', function (client) {
  coloredLog(`BROKER >> CLIENT_DISCONNECTED : MQTT Client ${(client ? client.id : client)} disconnected from the aedes broker ${aedes.id}`, 'blue')
})

// emitted when a client subscribes to a message topic
aedes.on('subscribe', function (subscriptions, client) {
  coloredLog(`BROKER >> TOPIC_SUBSCRIBED : MQTT Client ${(client ? client.id : client)} subscribed to topic: ${subscriptions.map(s => s.topic).join(',')} on aedes broker ${aedes.id}`, 'blue')
})

// emitted when a client unsubscribes from a message topic
aedes.on('unsubscribe', function (subscriptions, client) {
  coloredLog(`BROKER >> TOPIC_UNSUBSCRIBED : MQTT Client ${(client ? client.id : client)} unsubscribed to topic: ${subscriptions.join(',')} from aedes broker ${aedes.id}`, 'blue')
})

// emitted when a client publishes a message packet on the topic
aedes.on('publish', function (packet, client) {if (client) {
  coloredLog(`BROKER >> MESSAGE_PUBLISHED : MQTT Client ${(client ? client.id : 'AEDES BROKER_' + aedes.id)} has published message "${packet.payload}" on ${packet.topic} to aedes broker ${aedes.id}`, 'blue')}
})

if(!aedes.id){
  coloredLog('BROKER >> Aedes not initialized', 'blue');
  return;
}

coloredLog(`BROKER >> Aedes initialized: id ${aedes.id}`,'blue');

const server = require('net').createServer(aedes.handle);

server.listen(process.env.MQTT_PORT, () => {
  coloredLog(`BROKER >> MQTT broker started and listening on port ${process.env.MQTT_PORT}`, 'blue');
});