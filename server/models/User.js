class User {
  userid;
  email;
  password;
  surname;
  lastname;
  confirmUri;
  emailConfirmed;

  constructor() {}

  //Find User by E-Mail Address
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

  // Find User by confimration GUUID
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

  //Find User by ID
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

  //Update Database during confirmation
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

  //Update User
  async update(callback) {
    const db = require("../config/db");
    //Check if User submitted a new Password
    if (typeof this.password != "undefined" && this.password != "") {
      //hash password with a salt
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } else {
      this.password = "";
    }
    // Generate Update statement including properties, which are submitted
    // Update is possible with the userid, or the email and confirmUri in case of registration during event invitation
    const updateStatement = `UPDATE users SET ${Object.keys(this)
      .filter((column) => this[column] != "")
      .map((column) => `${column} = ?`)
      .join(", ")} WHERE userid = ? or (confirmUri = ? and email = ?)`;
    const updateParams = [
      ...Object.values(this).filter((value) => value != ""),
      this.userid,
      this.confirmUri,
      this.email,
    ];
    // update record
    db.query(updateStatement, updateParams, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  //Get all events per user
  getEvents(callback) {
    const db = require("../config/db");
    //a view would be nicer, because of the long sql statement
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

  // create new user
  async create(callback) {
    const db = require("../config/db");
    //Hash Password if submitted
    var hashedPassword = "";
    if (this.password && this.password != "") {
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(this.password, salt);
    }
    //generate GUUID for e-mail confirmation or to identify user, if there is no password set
    const crypto = require("crypto");
    this.confirmUri = crypto.randomUUID();
    this.emailConfirmed = false;
    //Add new User to DB
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
          //if succesfull, the user will get an Confirm or Invitation Mail
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
                if (user[0].password != "" || user[0].password != null || !(typeof user[0].password == 'undefined')) {
                  //send confimration E-Mail if the user has registered at the login page
                  sendConfirmationEmail(user[0]);
                } else {
                  //send invitaion E-mail if the new user was added in an event
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
