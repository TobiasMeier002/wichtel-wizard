class Participant {
  participantid;
  userid;
  eventid;
  giftwish;
  status;

  constructor() {}
  //confirm participation
  confirm(callback) {
    const db = require("../config/db");
    db.query(
      "UPDATE participants SET status = 'accepted' WHERE participantid = ?",
      [this.participantid],
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, "Confirmed");
        }
      }
    );
  }
  //decline participation
  decline(callback) {
    const db = require("../config/db");
    db.query(
      "UPDATE participants SET status = 'declined' WHERE participantid = ?",
      [this.participantid],
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, "Confirmed");
        }
      }
    );
  }
}

module.exports = { Participant };
