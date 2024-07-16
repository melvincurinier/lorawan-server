const fs = require('fs');
const csv = require('csv-parser');



const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath, 'utf-8')
      .pipe(csv({ separator: ','}))
      .on('data', (row) => {
        delete row[''];
        results.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        console.log('Data:', results);
        resolve(results);
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${filePath}`, error);
        reject(error);
      });
  });
};

module.exports = { parseCSV };
