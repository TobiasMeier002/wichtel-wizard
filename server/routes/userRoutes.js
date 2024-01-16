const express = require('express');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../models/User');
const { sendConfirmationEmail } = require('../utils/mailer');
const router = express.Router();

router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  }

  const { email, password, surname, lastname } = req.body;

  try {
    // Check if user already exists
    findUserByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).send('Error checking user');
      }

      if (user) {
        return res.status(409).send('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in the database
      createUser({ Email: email, Password: hashedPassword, Surname: surname, Lastname: lastname }, (err, userId) => {
        if (err) {
          console.error("Registration Error:", err);
          return res.status(500).send('Internal server error');
        }

        // Send confirmation email
        sendConfirmationEmail(email);

        return res.status(201).json({ message: 'Registration successful' });
      });
    });
  } catch (error) {
    console.error(error);
    // Only send this response if none of the above responses have been sent
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    findUserByEmail(email, async (err, user) => {

      if (err) {
        return res.status(500).send('Server error');
      }

      if (!user) {
        return res.status(401).send('User not found');
      }

      // Compare submitted password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }

      // Login successful, proceed with your login logic
      res.status(200).json({ message: 'Login successful' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;