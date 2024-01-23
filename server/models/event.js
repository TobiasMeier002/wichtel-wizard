class Event {

  db;
  eventid;
  name;
  creatoruserid;
  pricelimit;
  eventdate;
  status;

  constructor () {
    this.db = require('../config/db');
  }

  findbyID(eventid, callback) {
    this.db.query('SELECT * FROM events AS ev JOIN users AS us on AS.creatoruserid JOIN assignments on WHERE ev.eventid = ?', eventid, function (err, result) {
      if (err) callback(err, null);
      else callback(null, result[0]);
    });
  }

  create(callback) {
    this.db.query('INSERT INTO events SET ?', {name: this.name, creatoruserid: this.creatoruserid, pricelimit: this.pricelimit, eventdate: this.eventdate, status: this.status}, function (err, result) {
      if (err) {
        callback(err, null);
      }else {
        this.eventid = result.insertId;
        callback(null, this.eventid);
      }
    });
  }

  update(eventid, callback) {
    //TODO updaet Event
  }

  getAll(callback) {
    this.db.query('SELECT * from events', function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    })
  }

  addParticipant(participant, callback) {

    const User = require('./User');
    const user = new User;
    user.findByEmail(participant.email, (err, userfound) => {
      if (userfound) {
        this.db.query('INSERT INTO participants SET ?', { name: userfound.name, email: userfound.email, hasConfirmed: false}, function (err, result) {
          if (err) callback(err, null);
          else callback(null, result.insertId);
        });
      } else {
        //TODO: Add New User as Participant
      }
    });
  }
  
}

module.exports = { Event };