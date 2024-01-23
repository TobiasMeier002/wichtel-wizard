class User {

  id;
  email;
  password;
  surname;
  lastname;
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

  async create(callback) {
    // Hash password
    const salt = await this.bcrypt.genSalt(10);
    const hashedPassword = await this.bcrypt.hash(this.password, salt);
    this.db.query('INSERT INTO users SET ?', { email: this.email, password: hashedPassword, surname: this.surname, lastname: this.lastname }, function (err, result) {
      if (err) callback(err, null);
      else callback(null, result.insertId);
    });
  }
}

module.exports = { User };