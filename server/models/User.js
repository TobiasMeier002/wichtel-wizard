const db = require('../config/db');

function findUserByEmail(email, callback) {
  db.query('SELECT * FROM users WHERE email = ?', [email], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result[0]);
  });
}

function createUser(newUser, callback) {
  db.query('INSERT INTO users SET ?', newUser, function (err, result) {
    if (err) callback(err, null);
    else callback(null, result.insertId);
  });
}

module.exports = { findUserByEmail, createUser };