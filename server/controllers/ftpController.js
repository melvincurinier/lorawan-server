// Import modules
const fs = require('fs');
const { parse } = require('csv-parse');

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
        console.log('CSV file successfully processed');
        resolve(results);
      })
      // Event listener for errors
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${filePath}`, error);
        reject(error);
      });
  });
};

// Export the functions for use in other modules
module.exports = { parseCSV };
