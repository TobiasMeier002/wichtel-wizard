class Event {
  eventid;
  name;
  creatoruserid;
  pricelimit;
  eventdate;
  status;

  constructor() {}
  
  //Find Event by ID
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

  //create new event
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
          db.query(
            "SELECT * from events WHERE eventid = ?",
            [this.eventid],
            (err, eventdetails) => {
              if (err) {
                callback(err, null);
              } else {
                callback(null, eventdetails[0]);
              }
            }
          );
        }
      }
    );
  }

  //update event
  update(callback) {
    const db = require("../config/db");
    // prepare Statement, all values must be submitted
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

  //returns all events
  getAll(callback) {
    const db = require("../config/db");
    db.query("SELECT * from events", function (err, result) {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }

  //returns a singlie event by id
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

  //adding a user as a participant to en event
  //if the participant is not registered as user, a new user without details will be created
  addParticipant(user, callback) {
    const db = require("../config/db");
    //gets the event
    db.query(
      "SELECT * FROM events where eventid = ?",
      [this.eventid],
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          Object.assign(this, result[0]);
        }
        //set the eventname globally for callback functions
        const eventName = this.name;
        //if the user is already registered add to event as participant and send an email
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
                  //send invitation email
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
            //if the user is not found, create user, add participant and send invitations
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
                            callback(null, result.insertId);
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

  //get all participant by Event ID
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

  //Start an event, assign wichtel
  start(callback) {
    const db = require("../config/db");
    const eventid = this.eventid;
    //get the participants
    db.query(
      "SELECT * FROM participants WHERE status = 'accepted' AND eventid = ?",
      [eventid],
      (err, result) => {
        //assign the secret santas wit the static method
        const assignment = Event.prototype.assignWichtelis(result);
        const insertKeys = ["participantid", "eventid", "wichtelsTo"];
        //generate assignments insert statment 
        const insertStatement = `INSERT INTO assignments (giverid, eventid, receiverid) VALUES ${assignment
          .map(() => "(?)")
          .join(", ")}`;
        const values = assignment.map((a) =>
          insertKeys.map((k) => a[k]).flat()
        );
        db.query(insertStatement, values, (err, result) => {
          if (err) {
            console.log(err);
            callback(err, null);
          } else {
            db.query(
              "UPDATE events SET status = 'assigned' WHERE eventid = ?",
              [eventid],
              (err, result) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, "Wichtel assigned");
                }
              }
            );
          }
        });
      }
    );
  }

  //assigns a secret santa, can also be used static
  assignWichtelis(participants) {
    for (const participant of participants) {
      try {
        // filter the candidate list for candidates which already has a secret santa and is not itseld
        const wichtelCandidates = participants.filter(
          (u) => u !== participant && !u.hasWichteli
        );
        //select random participant from the candidate list
        const wichtelIndex = Math.floor(
          Math.random() * wichtelCandidates.length
        );
        const wichtel = wichtelCandidates[wichtelIndex];
        //assign the canidate to his secret santa, set the filter to true
        wichtel.hasWichteli = true;
        participant.wichtelsTo = wichtel.participantid;
        // for debug purpose
        console.log(
          `${participant.participantid} \t-->\t${wichtel.participantid}`
        );
      } catch (error) {
        //there will be an error, if the last candidate hits himself, therefore a reshuffle is necessary
        console.log(
          `${participant.participantid}\t-->\t${participant.participantid} isn't allowed --> reshuffle`
        );
        //reset the filter attribute
        participants.forEach((p) => (p.hasWichteli = false));
        //start recurse
        Event.prototype.assignWichtelis(participants); // Recursive reshuffle
        return participants; // Stop further processing in the current iteration
      }
    }
    //return the valid secret santa assignment list
    return participants;
  }
}

module.exports = { Event };
