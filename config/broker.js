// Load environment variables from .env file
require('dotenv').config();

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
      console.log(`Client Authenticated ${client.id}`);
      callback(null, true);
      return;
    }
    console.error(`Client Not Authenticated ${client.id}`);
    const error = new Error("Auth error");
    error.returnCode = 4;
    callback(error, null);
    return;
  }
  console.error(`Zero Auth ${client.id}`);
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
  console.log(`CLIENT_CONNECTED : MQTT Client ${(client ? client.id : client)} connected to aedes broker ${aedes.id}`)
})

// Event emitted when a client disconnects from the broker
aedes.on('clientDisconnect', function (client) {
  console.log(`CLIENT_DISCONNECTED : MQTT Client ${(client ? client.id : client)} disconnected from the aedes broker ${aedes.id}`)
})

// Event emitted when a client subscribes to a message topic
aedes.on('subscribe', function (subscriptions, client) {
  console.log(`TOPIC_SUBSCRIBED : MQTT Client ${(client ? client.id : client)} subscribed to topic: ${subscriptions.map(s => s.topic).join(',')} on aedes broker ${aedes.id}`)
})

// Event emitted when a client unsubscribes from a message topic
aedes.on('unsubscribe', function (subscriptions, client) {
  console.log(`TOPIC_UNSUBSCRIBED : MQTT Client ${(client ? client.id : client)} unsubscribed to topic: ${subscriptions.join(',')} from aedes broker ${aedes.id}`)
})

// Event emitted when a client publishes a message packet on the topic
aedes.on('publish', function (packet, client) {if (client) {
  console.log(`MESSAGE_PUBLISHED : MQTT Client ${(client ? client.id : 'AEDES BROKER_' + aedes.id)} has published message "${packet.payload}" on ${packet.topic} to aedes broker ${aedes.id}`)}
})

const startServer = () => {
  // Check if the Aedes broker is initialized
  if (aedes.id) {
    // Log that Aedes is initialized
    console.log(`Aedes initialized: id ${aedes.id}`);

    // Create a server to handle MQTT connections
    const server = require('net').createServer(aedes.handle);

    // Try to start the server and listen on the specified port
    server.listen(process.env.MQTT_PORT, () => {
      console.log(`MQTT broker started and listening on port ${process.env.MQTT_PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error(`Server error: ${error.message}`);
      console.log('Retrying in 5 seconds...');
      setTimeout(startServer, 5000); // Retry after 5 seconds
    });
  } else {
    console.error('Aedes not initialized');
    console.log('Retrying in 5 seconds...');
    setTimeout(startServer, 5000); // Retry after 5 seconds
  }
};

// Start the server for the first time
startServer();