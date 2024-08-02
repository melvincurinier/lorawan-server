// Load environment variables from .env file
require('dotenv').config();

// Import module
const { logBroker } = require('../util/coloredLog');

/**
 * A function that authenticate the client to the aedes broker
 */
function authenticateClient(client, username, password, callback){
  // Convert password to string if it exists
  let passwordToString = '';
  if(password) passwordToString = password.toString();

  // Check if authentication details are provided in environment variables
  if (process.env.AEDES_AUTH_USERNAME && process.env.AEDES_AUTH_PASSWORD) {
    // Authenticate the client
    if (username === process.env.AEDES_AUTH_USERNAME && passwordToString === process.env.AEDES_AUTH_PASSWORD) {
      logBroker(`Client Authenticated ${client.id}`, false);
      callback(null, true);
      return;
    }
    logBroker(`Client Not Authenticated ${client.id}`, false);
    const error = new Error("Auth error");
    error.returnCode = 4;
    callback(error, null);
    return;
  }
  logBroker(`Zero Auth ${client.id}`, false);
  callback(null, true);
  return;
}

// Initialize the Aedes MQTT broker with configuration options
const aedes = require('aedes')({
  id: process.env.AEDES_ID,
  authenticate: (client, username, password, callback) => {
    authenticateClient(client, username, password, callback);
  }
});

// Event emitted when a client connects to the broker
aedes.on('client', function (client) {
  logBroker(`CLIENT_CONNECTED : MQTT Client ${(client ? client.id : client)} connected to aedes broker ${aedes.id}`, false)
})

// Event emitted when a client disconnects from the broker
aedes.on('clientDisconnect', function (client) {
  logBroker(`CLIENT_DISCONNECTED : MQTT Client ${(client ? client.id : client)} disconnected from the aedes broker ${aedes.id}`, false)
})

// Event emitted when a client subscribes to a message topic
aedes.on('subscribe', function (subscriptions, client) {
  logBroker(`TOPIC_SUBSCRIBED : MQTT Client ${(client ? client.id : client)} subscribed to topic: ${subscriptions.map(s => s.topic).join(',')} on aedes broker ${aedes.id}`, false)
})

// Event emitted when a client unsubscribes from a message topic
aedes.on('unsubscribe', function (subscriptions, client) {
  logBroker(`TOPIC_UNSUBSCRIBED : MQTT Client ${(client ? client.id : client)} unsubscribed to topic: ${subscriptions.join(',')} from aedes broker ${aedes.id}`, false)
})

// Event emitted when a client publishes a message packet on the topic
aedes.on('publish', function (packet, client) {if (client) {
  logBroker(`MESSAGE_PUBLISHED : MQTT Client ${(client ? client.id : 'AEDES BROKER_' + aedes.id)} has published message "${packet.payload}" on ${packet.topic} to aedes broker ${aedes.id}`, false)}
})

// Check if the Aedes broker is initialized
if(!aedes.id){
  logBroker('Aedes not initialized', false);
  return;
}

// Log that Aedes is initialized
logBroker(`Aedes initialized: id ${aedes.id}`,false);

// Create a TCP server to handle MQTT connections
const server = require('net').createServer(aedes.handle);

// Start the server and listen on the specified port
server.listen(process.env.MQTT_PORT, () => {
  logBroker(`MQTT broker started and listening on port ${process.env.MQTT_PORT}`, false);
});