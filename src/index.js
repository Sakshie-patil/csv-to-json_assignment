require('dotenv').config();
const express = require('express');
const parseCSV = require('./csvParser');
const pool = require('./db');

const app = express();
app.use(express.json());

const CSV_FILE_PATH = process.env.CSV_FILE_PATH;

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Helper: Insert data into DB
async function insertData(data) {
  if (!data || data.length === 0) return;

  const batchSize = 500;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const queryText = `
      INSERT INTO users(name, age, address, additional_info)
      VALUES ${batch.map((_, idx) => `($${idx*4+1}, $${idx*4+2}, $${idx*4+3}, $${idx*4+4})`).join(', ')}
      RETURNING id
    `;
    const values = batch.flatMap(u => {
      const name = `${u.name.firstName} ${u.name.lastName}`;
      const age = parseInt(u.age);
      const address = JSON.stringify(u.address || {});
      const additional_info = JSON.stringify(Object.fromEntries(
        Object.entries(u).filter(k => !['name', 'age', 'address'].includes(k))
      ));
      return [name, age, address, additional_info];
    });
    await pool.query(queryText, values);
  }
}

// API: Upload CSV & insert into DB (POST)
app.post('/upload-csv', async (req, res) => {
  try {
    const data = await parseCSV(CSV_FILE_PATH); // <-- await the Promise

    if (!data || !Array.isArray(data)) {
  return res.status(400).json({ success: false, message: 'CSV parsing failed or file empty' });
}

    await insertData(data);
    res.json({ success: true, message: `${data.length} records inserted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Age distribution
app.get('/age-distribution', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT age FROM users');
    const ageGroups = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0 };
    const total = rows.length;

    rows.forEach(r => {
      const age = r.age;
      if (age < 20) ageGroups['<20']++;
      else if (age <= 40) ageGroups['20-40']++;
      else if (age <= 60) ageGroups['40-60']++;
      else ageGroups['>60']++;
    });

    const distribution = {};
    for (const group in ageGroups) {
      distribution[group] = ((ageGroups[group] / total) * 100).toFixed(2) + '%';
    }

    console.log('Age distribution:', distribution);
    
    res.json(distribution);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
