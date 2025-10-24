const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS || undefined,
    database: process.env.DB_NAME,
});

pool.connect()
    .then(client => {
        console.log('PostgreSQL pool connected');
        client.release();
    })
    .catch(err => console.error('PostgreSQL connection failed:', err));

pool.on('connect', () => console.log('Connected to PostgreSQL'));
pool.on('error', err => console.error('PostgreSQL connection error:', err));

module.exports = pool;