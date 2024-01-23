const db = require('../config/db');
const { findUserByEmail, createUser } = require('../models/User');

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

function updateEvent(eventid, callback) {
  //TODO updaet Event
}

function getEvents(callback) {
  db.query('SELECT * from events', function (err, result) {
    if (err) callback(err, null);
    else callback(null, result);
  })
}

function addParticipant(participant, callback) {
  findUserByEmail(participant.email, (err, user) => {
    if (user) {
      db.query('INSERT INTO participants SET ?', { name: user.name, email: user.email, hasConfirmed: false}, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result.insertId);
      });
    }
  });
}

module.exports = { findEventbyID, createEvent, getEvents, addParticipant };