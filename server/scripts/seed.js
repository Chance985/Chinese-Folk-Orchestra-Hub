require('dotenv').config();

const { seedDatabase } = require('../src/db');

seedDatabase({ force: true });
console.log('SQLite database seeded for Chinese Folk Orchestra Hub.');
