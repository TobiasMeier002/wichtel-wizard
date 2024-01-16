const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../models/User');
const { sendConfirmationEmail } = require('../utils/mailer');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, user) => {
    if (err) return res.status(500).send('Server error');
    if (user) return res.status(409).send('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { Email: email, Password: hashedPassword };
    createUser(newUser, (err, userId) => {
      if (err) return res.status(500).send('Server error during user creation');
      sendConfirmationEmail(email);  // Assuming this function is defined in utils/mailer.js
      res.status(201).send('User created successfully');
    });
  });
});

module.exports = router;
