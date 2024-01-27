class User {
  userid;
  email;
  password;
  surname;
  lastname;
  confirmUri;
  emailConfirmed;

  constructor() {}

  findByEmail(email, callback) {
    const db = require("../config/db");
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (err, result) {
        if (err) callback(err, null);
        else callback(null, result[0]);
      }
    );
  }

  findByConfirmUri(confirmUri, callback) {
    const db = require("../config/db");
    db.query(
      "SELECT * FROM users WHERE confirmUri = ?",
      [confirmUri],
      function (err, result) {
        if (err) callback(err, null);
        else callback(null, result[0]);
      }
    );
  }

  findById(callback) {
    const db = require("../config/db");
    db.query(
      "SELECT * FROM users WHERE userid = ?",
      [this.userid],
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result[0]);
        }
      }
    );
  }

  confirm(userid, callback) {
    const db = require("../config/db");
    db.query(
      "UPDATE users SET emailConfirmed = 1 where userid = ?",
      [userid],
      function (err, result) {
        if (err) callback(err, null);
        else callback(null, result[0]);
      }
    );
  }

  async update(callback) {
    const db = require("../config/db");
    if (typeof this.password != "undefined" && this.password != "") {
      console.log(this.password);
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } else {
      this.password = "";
    }
    const updateStatement = `UPDATE users SET ${Object.keys(this)
      .filter((column) => this[column] != "")
      .map((column) => `${column} = ?`)
      .join(", ")} WHERE userid = ?`;
    const updateParams = [
      ...Object.values(this).filter((value) => value != ""),
      this.userid,
    ];
    db.query(updateStatement, updateParams, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  getEvents(callback) {
    const db = require("../config/db");
    db.query(
      "SELECT ev.eventid AS eventid, ev.name AS Eventname, ev.eventdate as eventdate, ev.pricelimit as pricelimit, ev.status as eventstatus, pa.userid as userid, pa.giftwish as giftwish, pa.status as userstatus, ag.receiver_name as receiver_name, ag.giftwish as receiver_giftwish FROM events AS ev INNER JOIN participants AS pa ON ev.eventid = pa.eventid LEFT JOIN (SELECT a.giverid , CONCAT(`surname`, ' ', `lastname`) AS receiver_name, p.giftwish FROM assignments AS a INNER JOIN participants AS p on a.receiverid = p.participantid INNER JOIN users as u on p.userid = u.userid) AS ag on pa.participantid = ag.giverid where pa.userid = ?",
      [this.userid],
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
  }

  async create(callback) {
    const db = require("../config/db");
    var hashedPassword = "";
    if (this.password && this.password != "") {
      // Hash password
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(this.password, salt);
    }
    const crypto = require("crypto");
    this.confirmUri = crypto.randomUUID();
    this.emailConfirmed = false;
    db.query(
      "INSERT INTO users SET ?",
      {
        email: this.email,
        password: hashedPassword,
        surname: this.surname,
        lastname: this.lastname,
        emailConfirmed: this.emailConfirmed,
        confirmUri: this.confirmUri,
      },
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          db.query(
            "SELECT email, confirmUri FROM users where userid = ?",
            [result.insertId],
            (err, user) => {
              if (err) {
                callback(err, null);
              } else {
                const {
                  sendConfirmationEmail,
                  sendInvitationEmail,
                } = require("../utils/mailer");
                if (user[0].password && user[0].password != "") {
                  sendConfirmationEmail(user[0]);
                } else {
                  sendInvitationEmail(user[0]);
                }
                callback(null, result.insertId);
              }
            }
          );
        }
      }
    );
  }
}

module.exports = { User };
