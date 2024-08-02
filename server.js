// Load environment variables from .env file
require('dotenv').config();

// Import modules
const express = require('express');
const mqtt = require('mqtt');
const { addDataSensorByID } = require('./controllers/sensorController');
const { checkDbConnection } = require('./config/mysql');

// Function to start the Express server
const startServer = () => {
  return new Promise((resolve, reject) => {
    // Rest object (Express application instance)
    const app = express();

    // Middlewares
    app.use(express.json());

    // Error handling middleware
    app.use((error, request, response, next) => {
      console.error(error.stack); // Log the error stack trace
      response.status(500).send('Internal Server Error'); // Send a 500 response with a message
    });

    // Use the sensor routes for any routes starting with /api/v1
    app.use('/api/v1', require('./routes/sensorRoutes'), require('./routes/socomecFtpRoutes'));

    // Start the server and listen on the specified port
    const server = app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server ${process.env.SERVER_ID} running on port ${process.env.SERVER_PORT}`);
      resolve();
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error(`Express server error: ${error}`);
      console.log('Retrying in 5 seconds...');
      setTimeout(() => startServer().then(resolve).catch(reject), 5000); // Retry after 5 seconds
    });
  });
};

// Function to create the MQTT client
const createMQTTClient = () => {
  // MQTT client options
  const options = {
    clientId: process.env.SERVER_ID,
    username: process.env.AEDES_AUTH_USERNAME,
    password: process.env.AEDES_AUTH_PASSWORD,
    clean: false,
  };

  // Create a MQTT Client connected to the MQTT broker
  const mqttClient = mqtt.connect('mqtt://' + process.env.MQTT_HOSTNAME + ':' + process.env.MQTT_PORT, options);

  // MQTT topic and QoS level
  const topic = process.env.MQTT_TOPIC;
  const qos = parseInt(process.env.MQTT_QOS);

  // Event handler for successful connection to the MQTT broker
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topic, { qos: qos }, (error) => {
      if(!error) { 
        console.log(`Subscribed QoS ${qos} to MQTT broker topic: ${topic}`);
      } else {
        console.error(`Error subscribing: ${error}`);
      }
    });
  });

  // Event handler for incoming MQTT messages
  mqttClient.on("message", (topic, message) => {
    const now = new Date().toLocaleTimeString();
    console.log(`MQTT Client Message ${now} - Topic: ${topic} - Message: ${message.toString()}`, false);

    // Split the topic to extract the channel
    const [ topicName, channel ] = topic.split('/');

    // Parse the message as JSON
    const data = JSON.parse(message.toString());

    // Add the sensor data to the database
    addDataSensorByID(channel, data);
  });

  // Event handler for QoS 1 message acknowledgment
  mqttClient.on('packetsend', (packet) => {
    if (packet.cmd === 'puback') {
      console.log('QoS 1 message acknowledged');
    }
  });

  // Event handler for MQTT client errors
  mqttClient.on('error', (error) => {
    console.error(`MQTT Client error: ${error}`);
    console.log('Retrying in 5 seconds...');
    setTimeout(createMQTTClient, 5000); // Retry after 5 seconds
  });
};

// Start the Express server
startServer()
  .then(() => {
    // Start the MQTT client after the Express server is successfully started
    createMQTTClient();

    // Check the status of database connection
    checkDbConnection();
  })
  .catch((error) => {
    console.error(`Failed to start Express server: ${error}`);
  });


