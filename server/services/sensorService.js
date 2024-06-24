const mysqldb = require('../config/mysql');

// GET ALL DATA SENSORS
const getAllSensorsDataFromDatabase = async () => {
    const query = 'SELECT * FROM sensor_data';
    try {
        const result = await mysqldb.query(query);
        return result;
    } catch (error) {
        throw error;
    }
};

// GET ALL DATA SENSORS
const getAllDataBySensorIDFromDatabase = async (sensorId) => {
    const query = 'SELECT * FROM sensor_data WHERE sensor_id=?';
    const values = [sensorId];
    try {
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
};

// ADD DATA SENSOR TO DATABASE
const addDataSensorToDatabase = async (sensorId, data) => {
    const query = 'INSERT INTO sensor_data (sensor_id, tempC_SHT, hum_SHT, tempC_DS) VALUES (?, ?, ?, ?)';
    const { TempC_SHT, Hum_SHT, TempC_DS } = data;
    const values = [sensorId, TempC_SHT, Hum_SHT, TempC_DS];
    try {
        const result = await mysqldb.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = { getAllSensorsDataFromDatabase, getAllDataBySensorIDFromDatabase, addDataSensorToDatabase };