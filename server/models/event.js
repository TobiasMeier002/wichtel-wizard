class Event {

  db;
  eventid;
  name;
  creatoruserid;
  pricelimit;
  eventdate;
  status;

  constructor() {
    this.db = require('../config/db');
  }

  findbyID(eventid, callback) {
    this.db.query('SELECT * FROM events AS ev JOIN users AS us on AS.creatoruserid JOIN assignments on WHERE ev.eventid = ?', eventid, function (err, result) {
      if (err) callback(err, null);
      else callback(null, result[0]);
    });
  }

  create(callback) {
    this.db.query('INSERT INTO events SET ?', { name: this.name, creatoruserid: this.creatoruserid, pricelimit: this.pricelimit, eventdate: this.eventdate, status: this.status }, function (err, result) {
      if (err) {
        callback(err, null);
      } else {
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

  getbyID(callback) {
    this.db.query('SELECT * from events WHERE eventid = ?', this.eventid, function (err, result) {
      if (err) {
        callback(err, null);
      } else if (!result[0]) {
        callback("Event not found", null)
      } else {
        callback(null, result[0]);
      }
    })
  }

  addParticipant(user, callback) {
    user.findByEmail(participant.email, (err, userfound) => {
      if (userfound) {
        this.db.query('INSERT INTO participants SET ?', { eventid: this.eventid, participantid: userfound.userid, hasConfirmed: false }, function (err, result) {
          if (err) callback(err, null);
          else callback(null, result.insertId);
        });
      } else {
        user.create( (err, usercreated) => {
          if (err) {
            callback(err, null);
          } else {
            this.db.query('INSERT INTO participants SET ?', { eventid: this.eventid, participantid: usercreated.userid, hasConfirmed: false }, function (err, result) {
              if (err) {
                callback(err, null);
              } else {
                const { sendInvitationEmail } = require('../utils/mailer');
                sendInvitationEmail(result);
                callback(null, result.insertId);
              }
            });
          }
        });
      }
    });
  }

}

module.exports = { Event };