# LoRaWAN & FTP Server

This project is a LoRaWAN & FTP Server handling an MQTT broker for real-time data communication of the lora sensors and others data sent by FTP . It uses Express for the REST API, MySQL for data storage, Aedes as the MQTT broker, FTP-SRV as the FTP server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [MQTT Integration](#mqtt-integration)
- [Logging](#logging)
- [Error Handling](#error-handling)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MySQL server running
- MQTT broker (Aedes) installed

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

    List of depencies (to up-to-date):
    - `aedes`: 0.51.2
    - `dotenv`: 16.4.5
    - `express`: 4.19.2
    - `mqtt`: 5.7.1
    - `mysql2`: 3.10.1
    - `net`: 1.0.2
    - `nodemon`: 3.1.3
    - `csv-parse`: 5.5.6,
    - `ftp-srv`: 4.6.3,
    - `net`: 1.0.2,
    - `netmask`: 2.0.2,


3. Set up the environment variables by creating a `.env` file in the root directory:
    ```sh
    touch .env
    ```

4. Add the following environment variables to the `.env` file:
    ```env
    SERVER_PORT=8080
    SERVER_ID=your_server_id

    MYSQL_HOSTNAME=your_mysql_host
    MYSQL_PORT=3306
    MYSQL_USERNAME=your_mysql_username
    MYSQL_PASSWORD=your_mysql_password
    MYSQL_DBNAME=your_mysql_dbname

    MQTT_HOSTNAME=your_mqtt_host
    MQTT_PORT=1883
    MQTT_TOPIC=your_mqtt_topic
    MQTT_QOS=1

    AEDES_ID=your_aedes_id
    AEDES_AUTH_USERNAME=your_aedes_username
    AEDES_AUTH_PASSWORD=your_aedes_password
    CONCURRENCY=10000
    QUEUE_LIMIT=100
    CONNECTION_TIMEOUT=30000

    FTP_HOSTNAME=your_ftp_host
    FTP_PORT=21
    FTP_AUTH_USERNAME=your_ftp_username
    FTP_AUTH_PASSWORD=your_ftp_password
    ```

## Configuration

- `config/mysql.js`: Sets up the MySQL database connection.
- `config/ftp.js`: Sets up the FTP server.
- `config/broker.js`: Sets up the Aedes MQTT broker.

## Usage

1. Start the server:
    ```sh
    npm run server
    ```

2. The server will be running on the port specified in the `.env` file. You can now make requests to the API and publish/subscribe to the MQTT broker.

## API Endpoints

### GET `/api/v1/sensors`

Fetch all sensor data.

#### Response:
```json
{
    "success": true,
    "message": "All Sensors Records",
    "data": [...]
}
```

### GET `/api/v1/sensors/:id`

Fetch data for a specific sensor by its ID.

#### Response:
```json
{
    "success": true,
    "message": "All Data Records From Sensor ID",
    "sensorData": [...]
}
```

### GET `/api/v1/socomec`

Fetch all socomec data.

#### Response:
```json
{
    "success": true,
    "message": "All Socomec Records",
    "data": [...]
}
```

### GET `/api/v1/socomec/:circuit`

Fetch data for a specific circuit by its name.

#### Response:
```json
{
    "success": true,
    "message": "All Data Records From Socomec Circuit",
    "circuitData": [...]
}
```

## MQTT Integration

The server connects to an MQTT broker and subscribes to a topic. It listens for messages and processes sensor data in real-time.

### Example MQTT Message Handling

- Connects to the MQTT broker and subscribes to the specified topic.
- Logs incoming messages and adds sensor data to the database.

## Logging

The application uses colored logging to differentiate between log types:

- **Database Logs**: Green
- **Broker Logs**: Cyan
- **Server Logs**: Yellow
- **FTP Logs**: White
- **Error Logs**: Red

### Utility Functions:

- `logDatabase`: Logs database-related messages.
- `logBroker`: Logs broker-related messages.
- `logServer`: Logs server-related messages.
- `logFTP`: Logs FTP-related messages.

## Error Handling

The application includes middleware for handling errors and sending appropriate responses.

### Example:

```javascript
app.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('Internal Server Error');
});
```

## License

This project is licensed under the MIT License.

---

By following this guide, you should be able to set up and run a sensor network Server with a MQTT Broker project. If you encounter any issues, please refer to the documentation or raise an issue in the repository.