class Event {
  eventid;
  name;
  creatoruserid;
  pricelimit;
  eventdate;
  status;

  constructor() {}

  findbyID(eventid, callback) {
    const db = require("../config/db");
    db.query(
      "SELECT * FROM events AS ev JOIN users AS us on AS.creatoruserid JOIN assignments on WHERE ev.eventid = ?",
      eventid,
      function (err, result) {
        if (err) callback(err, null);
        else callback(null, result[0]);
      }
    );
  }

  create(callback) {
    const db = require("../config/db");
    db.query(
      "INSERT INTO events SET ?",
      {
        name: this.name,
        creatoruserid: this.creatoruserid,
        pricelimit: this.pricelimit,
        eventdate: this.eventdate,
        status: this.status,
      },
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          this.eventid = result.insertId;
          db.query('SELECT * from events WHERE eventid = ?',[this.eventid], (err, eventdetails) => { 
            if (err) {
              callback(err,null);
            } else {
              callback(null, eventdetails[0]);
            }           
          });                    
        }
      }
    );
  }

  update(callback) {
    const db = require("../config/db");
    const updateStatement = `UPDATE events SET ${Object.keys(this)
      .map((column) => `${column} = ?`)
      .join(", ")} WHERE eventid = ?`;
    const updateParams = [...Object.values(this), this.eventid];
    db.query(updateStatement, updateParams, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  getAll(callback) {
    const db = require("../config/db");
    db.query("SELECT * from events", function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  getbyID(callback) {
    const db = require("../config/db");
    db.query(
      "SELECT * from events WHERE eventid = ?",
      this.eventid,
      function (err, result) {
        if (err) {
          callback(err, null);
        } else if (!result[0]) {
          callback("Event not found", null);
        } else {
          callback(null, result[0]);
        }
      }
    );
  }

  addParticipant(user, callback) {
    const db = require("../config/db");
    db.query(
      "SELECT * FROM events where eventid = ?",
      [this.eventid],
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          Object.assign(this, result[0]);
        }
        const eventName = this.name;
        user.findByEmail(user.email, (err, userfound) => {
          if (err) {
            callback(err, null);
          }
          if (userfound) {
            db.query(
              "INSERT INTO participants SET ?",
              {
                eventid: this.eventid,
                userid: userfound.userid,
                status: "invited",
              },
              function (err, result) {
                if (err) {
                  callback(err, null);
                } else {
                  const {
                    sendInvitationtoEventEmail,
                  } = require("../utils/mailer");
                  sendInvitationtoEventEmail(
                    userfound,
                    eventName,
                    result.insertId
                  );
                  callback(null, result.insertId);
                }
              }
            );
          } else {
            user.create((err, usercreated) => {
              if (err) {
                callback(err, null);
              } else {
                const userid = usercreated;
                db.query(
                  "INSERT INTO participants SET ?",
                  { eventid: this.eventid, userid: userid, status: "invited" },
                  function (err, result) {
                    if (err) {
                      callback(err, null);
                    } else {
                      db.query(
                        "SELECT * from users WHERE userid = ?",
                        [userid],
                        (err, usercreated) => {
                          if (err) {
                            callback(err, null);
                          } else {
                            const {
                              sendInvitationtoEventEmail,
                            } = require("../utils/mailer");
                            sendInvitationtoEventEmail(
                              usercreated[0],
                              eventName,
                              result.insertId
                            );
                            callback(null, usercreated[0]);
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
    );
  }

  getParticipantsbyEventID(callback) {
    const db = require("../config/db");
    db.query(
      "SELECT us.userid as userid, us.surname as surname, us.lastname as lastname, us.email as email, pa.participantid as participantid, pa.status as status from participants as pa INNER JOIN users as us on pa.userid = us.userid WHERE pa.eventid = ?",
      [this.eventid],
      (err, result) => {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, result);
        }
      }
    );
  }

  start(callback) {
    const db = require("../config/db");
  }
}

module.exports = { Event };
