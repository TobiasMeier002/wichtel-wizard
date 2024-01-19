const db = require('../config/db');

function findEventbyID(eventid, callback) {
  db.query('SELECT * FROM events AS ev JOIN users AS us on AS.creatoruserid JOIN assignments on WHERE ev.eventid = ?', [eventid], function (err, result) {
    if (err) callback(err, null);
    else callback(null, result[0]);
  });
}

function createEvent(newEvent, callback) {
  db.query('INSERT INTO events SET ?', newEvent, function (err, result) {
    if (err) callback(err, null);
    else callback(null, result.insertId);
  });
}

function getEvents() {
  DOMQuad.query('SELECT * from events', function (err, result) {
    if(err) callback(err, null);
    else callback(null, result);
  })
}

module.exports = { findEventbyID, createEvent, getEvents };