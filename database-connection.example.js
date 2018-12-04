const { Client } = require('pg');
const connection = new Client({
  user: 'test',
  host: 'localhost',
  database: 'db',
  password: 'pw',
  port: 5432,
});

module.exports = connection;