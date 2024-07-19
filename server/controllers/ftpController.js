// Import modules
const fs = require('fs');
const { parse } = require('csv-parse');
const ftpService = require('../services/ftpService');
const { logFTP } = require('../util/coloredLog');

const addSocomecDataFromStream = async (stream) => {
  const data = await parseCSV(stream);
  try {
    if (!data) {
        // If no data are provided, throw the error
        throw new Error('Provide Sensor ID or Data');
    }
    if (!isValidSocomecData(data[0])) {
      // If the data does contain invalid data, throw the error
      throw new Error('Invalid data format');
    }
    
    // Add the sensor data to the database
    for(const row of data){
      await ftpService.addSocomecDataToDatabase(row);
    }
    logFTP(`Data added to database`, false);
  } catch (error) {
      // Log the error if adding data to the database fails
      logFTP(error, true);
      logFTP('Data not added to database', true);
  } finally {
    fs.unlink(stream, (error) => {
      if (error) {
        logFTP(`Error deleting file: ${error}`, true);
        return;
      }
      logFTP('File deleted', false);
    });
  }
};

/**
 * A function that parse a CSV file and return the data.
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []; // Array to hold the parsed data

    // Create a readable stream from the CSV file
    fs.createReadStream(filePath, 'utf-8')
      // Pipe the stream through the CSV parser with the specified options
      .pipe(parse({ 
        delimiter: ',', // Comma as the column delimiter
        columns: true, // Use the first row as header to generate object keys
        record_delimiter: ',\r\n', // Define the line delimiter
        relax_column_count: true, // Discard inconsistent columns
        skip_empty_lines: true, // Ignore empty lines in the CSV file
      }))
      // Event listener for each data row
      .on('data', (row) => {
        results.push(row);
      })
      // Event listener for the end of the stream
      .on('end', () => {
        logFTP('CSV file successfully processed', false);
        resolve(results);
      })
      // Event listener for errors
      .on('error', (error) => {
        logFTP(`Error reading CSV file: ${filePath}\nError: ${error}`, true);
        reject(error);
      });
  });
};

/**
 * A function that validate if the data contains the required keys
 */
const isValidSocomecData = (data) => {
  const requiredKeys = ['Data Key', 'Local DateTime', 'Value'];
  return requiredKeys.every(key => key in data);
};

// Export the functions for use in other modules
module.exports = { addSocomecDataFromStream };
