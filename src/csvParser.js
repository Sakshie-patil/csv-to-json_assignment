const fs = require('fs');

function parseCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8').trim();
    const lines = content.split('\n');
    const headers = lines[0].split(',');

    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, idx) => {
            const keys = header.split('.');
            let current = obj;
            keys.forEach((key, i) => {
                if (i === keys.length - 1) {
                    current[key] = values[idx];
                } else {
                    current[key] = current[key] || {};
                    current = current[key];
                }
            });
        });
        return obj;
    });

    return data;
}

module.exports = parseCSV;