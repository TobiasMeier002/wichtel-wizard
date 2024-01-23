module.exports = class User{

  id;
  email;
  password;
  surname;
  lastname;

  constructor(){
    this.db = require('../config/db');
  }

  findUserByEmail(email, callback) {
    this.db.query('SELECT * FROM users WHERE email = ?', [email], function (err, result) {
      if (err) callback(err, null);
      else callback(null, result[0]);
    });
  }

  async createUser(callback) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    db.query('INSERT INTO users SET ?', {email: this.email, password: hashedPassword, surname: this.surname, lastname: this.lastname}, function (err, result) {
      if (err) callback(err, null);
      else callback(null, result.insertId);
    });
  }

}