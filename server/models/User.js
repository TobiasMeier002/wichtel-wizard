class User {

  userid;
  email;
  password;
  surname;
  lastname;
  confirmUri;
  emailConfirmed;
  bcrypt;

  constructor() {
    this.bcrypt = require('bcrypt');
    this.db = require('../config/db');
  }

  findByEmail(email, callback) {
    this.db.query('SELECT * FROM users WHERE email = ?', [email], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result[0]);
    });
  }

  findByConfirmUri(confirmUri, callback) {
    this.db.query('SELECT * FROM users WHERE confirmUri = ?', [confirmUri], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result[0]);
    });
  }

  confirm(userid, callback){
    this.db.query('UPDATE users SET emailConfirmed = 1 where userid = ?', [userid], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result[0]);
    });
  }

  async create(callback) {
    // Hash password
    const salt = await this.bcrypt.genSalt(10);
    const hashedPassword = await this.bcrypt.hash(this.password, salt);
    const crypto = require('crypto');
    this.confirmUri = crypto.randomUUID();
    this.emailConfirmed = false;
      this.db.query('INSERT INTO users SET ?', { email: this.email, password: hashedPassword, surname: this.surname, lastname: this.lastname, emailConfirmed: this.emailConfirmed, confirmUri: this.confirmUri }, function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          const { sendConfirmationEmail } = require('../utils/mailer');
          if(this.password && this.password != "") {
            sendConfirmationEmail(result);
          }          
          callback(null, result.insertId);
        }
      });
  }

  newId(base) {
    return [
      Math.random,
      function () { return (newId.last ? windowId.last + Math.random() : Math.random()) },
      Math.random,
      Date.now,
      Math.random
    ].map(function (fn) {
      return fn().toString(base || (16 + (Math.random() * 20))).substr(-8);
    }).join('-');
  }
}

module.exports = { User };