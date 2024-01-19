const db = require('../config/db');

function createParticipant(newParticipant, callback) {
  db.query('INSERT INTO participants SET ?', newParticipant, function (err, result) {
    if (err) callback(err, null);
    else callback(null, result.insertId);
  });
}

module.exports = { createParticipant };