const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('./models/User');
const { sendConfirmationEmail } = require('./utils/mailer');
const userRoutes = require('./routes/userRoutes');

const app = express();

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST_IP,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

app.use(cors());

app.use(bodyparser.json());
app.use('/api', userRoutes);
app.use(bodyparser.urlencoded({extended: true}));

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

// app.get('/test', (req, res) => {
//   const { table } = req.query;
//
//   pool.query(`select * from ${table}`, (err, results) => {
//     if (err) {
//       return res.send(err);
//     } else {
//       return res.send(results);
//     }
//   });
// });