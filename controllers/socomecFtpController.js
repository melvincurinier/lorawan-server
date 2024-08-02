// Import modules
const fs = require('fs');
const { parse } = require('csv-parse');
const ftpService = require('../services/socomecFtpService');
const path = require('path')

/**
 * A controller function (API) that get all data from circuits
 */
const getAllSocomecData = async (request, response) => {
  try {
      // Retrieve all socomec data from the database
      const [data] = await ftpService.getAllSocomecDataFromDatabase();
      if(!data){
          // If no data is found, send a 404 response with a message
          return response.status(404).send({
              success:false,
              message:'No Records found'
          });
      }
      // Send a 200 response with the retrieved data
      response.status(200).send({
          success:true,
          message:'All Socomec Records',
          data : data
      });
  } catch (error) {
      // Log the error and send a 500 response with an error message
      console.error(`Error getting data: ${error}`);
      response.status(500).send({
          success:false,
          message:'Error in Get All Socomec Data API',
          error
      });
  }
};

/**
* A controller function (API) that get all data from a specific circuit by its name
*/
const getAllDataBySocomecCircuit = async (request, response) => {
  try {
      const socomecCircuit = request.params.circuit;
      if(!socomecCircuit){
          // If no Socomec Circuit is provided, send a 404 response with a message
          return response.status(404).send({
              success:false,
              message:'Invalid Or Provide Socomec Circuit'
          });
      }

      // Retrieve data by Socomec Circuit from the database
      const [data] = await ftpService.getAllDataBySocomecCircuitFromDatabase(socomecCircuit);
      if(!data){
          // If no data is found, send a 404 response with a message
          return response.status(404).send({
              success:false,
              message:'No Records found'
          });
      }
      // Send a 200 response with the retrieved data
      response.status(200).send({
          success:true,
          message:'All Data Records From Socomec Circuit',
          circuitData : data
      });
  } catch (error) {
      // Log the error and send a 500 response with an error message
      console.error(`Error getting data: ${error}`);
      response.status(500).send({
          success:false,
          message:'Error in Get All Data By Socomec Circuit API',
          error
      });
  }
};

const addSocomecDataFromStream = async (stream) => {
  const data = await parseCSV(stream);
  try {
    if (!data) {
        // If no data are provided, throw the error
        throw new Error('Provide Sococec Circuit or Data');
    }
    if (!isValidSocomecData(data[0])) {
      // If the data does contain invalid data, throw the error
      throw new Error('Invalid data format');
    }
    
    // Add the socomec data to the database
    for(const row of data){
      await ftpService.addSocomecDataToDatabase(row);
    }
    console.log('Data added to database');
  } catch (error) {
      // Log the error if adding data to the database fails
      console.error(`Data not added to database: ${error}`);
  } finally {
    fs.unlink(stream, (error) => {
      if (error) {
        console.error(`Error deleting file: ${error}`);
        return;
      }
      console.log('File deleted');
    });
  }
};

/**
 * A function that parse a CSV file and return the data.
 */
const parseCSV = (filePath) => {
  const fileName = path.basename(filePath);
  const excludeDateTime = extractExcludeDateTime(fileName);
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
        if(row['Local DateTime'] != excludeDateTime) results.push(row);
      })
      // Event listener for the end of the stream
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(results);
      })
      // Event listener for errors
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${error}`);
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

/**
 * A function that extract the last date of the filename
 */
function extractExcludeDateTime(filename) {
  // Extract the part of the filename that contains the date and time
  const parts = filename.split('_');
  const date = parts[parts.length - 3]; // Date part
  const time = parts[parts.length - 2].replace(/-/g, ':'); // Time part 
  const excludeDateTime = date + 'T' + time;

  // Formatting to match the format used in the CSV data
  return excludeDateTime;
}


// Export the functions for use in other modules
module.exports = { getAllSocomecData, getAllDataBySocomecCircuit, addSocomecDataFromStream };
