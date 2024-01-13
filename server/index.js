const cors = require('cors');
const path = require('path');
const express = require('express');
const mysql = require('mysql');
const fs = require('fs'); // Require the 'fs' module to set permissions
const port = process.env.PORT || 3000;

const app = express();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(cors());
app.set('port', port);

// Define the Unix socket path
const unixSocketPath = '/home/wichtelwizard/cnf/nodejs.sock';

// Check if the socket file already exists and remove it (optional)
if (fs.existsSync(unixSocketPath)) {
  fs.unlinkSync(unixSocketPath);
}

app.use(express.static(path.join(__dirname, '../client/build')));


console.log('logging the dir name', path.join(__dirname, '../client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
app.listen(unixSocketPath, () => {
  console.log(`Server is running on Unix socket at ${unixSocketPath}`);
});

app.get('/test', (req, res) => {
  const { table } = req.query;

  pool.query(`select * from ${table}`, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
});