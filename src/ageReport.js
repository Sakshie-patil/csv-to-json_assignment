const pool = require('./db');

async function ageDistribution() {
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

    console.log('Age-Group % Distribution:');
    for (const group in ageGroups) {
        const percent = ((ageGroups[group] / total) * 100).toFixed(2);
        console.log(`${group}: ${percent}%`);
    }

    process.exit();
}

ageDistribution();