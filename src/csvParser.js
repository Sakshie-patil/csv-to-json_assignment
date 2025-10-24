// src/csvParser.js
const fs = require('fs');
const readline = require('readline');

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream });

    let headers = [];

    rl.on('line', line => {
      if (headers.length === 0) {
        headers = line.split(',').map(h => h.trim());
      } else {
        const values = line.split(',').map(v => v.trim());
        const record = {};

        headers.forEach((header, i) => {
          const keys = header.split('.');
          let current = record;
          keys.forEach((key, idx) => {
            if (idx === keys.length - 1) current[key] = values[i];
            else current[key] = current[key] || {};
            current = current[key];
          });
        });

        data.push(record);
      }
    });

    rl.on('close', () => resolve(data));
    rl.on('error', err => reject(err));
  });
}

module.exports = parseCSV;
