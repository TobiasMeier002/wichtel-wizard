const mysql2 = require('mysql2');
require('dotenv').config();

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  // if (err) throw err;
  console.log("Connected to database!");
});

module.exports = connection;