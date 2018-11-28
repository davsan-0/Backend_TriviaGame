var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '5432',
  user     : 'postgres',
  password : '',
  database : ''
});

connection.connect();
module.exports = connection;