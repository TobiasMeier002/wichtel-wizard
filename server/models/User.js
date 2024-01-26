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
    const hashedPassword = "";
    if (this.password && this.password != "") {
      // Hash password
      const salt = await this.bcrypt.genSalt(10);
      hashedPassword = await this.bcrypt.hash(this.password, salt);
    }    
    const crypto = require('crypto');
    this.confirmUri = crypto.randomUUID();
    this.emailConfirmed = false;
      this.db.query('INSERT INTO users SET ?', { email: this.email, password: hashedPassword, surname: this.surname, lastname: this.lastname, emailConfirmed: this.emailConfirmed, confirmUri: this.confirmUri }, function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          const { sendConfirmationEmail, sendInvitationEmail } = require('../utils/mailer');
          if(this.password && this.password != "") {
            sendConfirmationEmail(this.email);
          } else {
            sendInvitationEmail(this.email);
          }          
          callback(null, result.insertId);
        }
      });
  }
}

module.exports = { User };