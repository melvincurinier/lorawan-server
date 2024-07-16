const fs = require('fs');
const { parse } = require('csv-parse');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath, 'utf-8')
      .pipe(parse({ 
        delimiter: ',', 
        columns: true,
        record_delimiter: ',\r',
        relax_column_count_more: true,
        skip_empty_lines: true
      }))
      .on('data', (row) => {
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
