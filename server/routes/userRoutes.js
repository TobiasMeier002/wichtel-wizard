const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/User');

router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  }
  const user = new User();
  Object.assign(user, req.body)

  try {
    // Check if user already exists
    user.findByEmail(user.email, async (err, userfound) => {
      if (err) {
        return res.status(500).send('Error checking user');
      }

      if (userfound) {
        return res.status(409).send('User already exists');
      }

      // Create user in the database
      user.create(async (err, userId) => {
        if (err) {
          console.error("Registration Error:", err);
          return res.status(500).send('Internal server error');
        }
        return res.status(201).json({ userid: userId, message: 'Registration successful' });
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

router.get('/confirm/:confimrUri', async (req, res) => {
  const user = new User();
  user.findByConfirmUri(req.params.confimrUri, (err, userfound) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    if (!userfound) {
      return res.status(401).send('User not found');
    }
    user.confirm(userfound.userid, async (err, result) => {
      if (err) {
        return res.status(500).send('Server error');
      }
      return res.status(200).json(userfound);
    });    
  });
});

router.post('/login', async (req, res) => {
  const user = new User();
  user.password = req.body.password;
  user.email = req.body.email;

  if (!user.email || !user.password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    user.findByEmail(user.email, async (err, userfound) => {

      if (err) {
        return res.status(500).send('Server error');
      }

      if (!userfound) {
        return res.status(401).send('User not found');
      }

      if (userfound.emailConfirmed == 1) {
        // Compare submitted password with stored hash
        const isMatch = await bcrypt.compare(user.password, userfound.password);
        if (!isMatch) {
          return res.status(400).send('Invalid credentials');
        }
      } else {
        return res.status(200).json({confirmUri: userfound.confirmUri, message: 'confirmation needed'});
      }

      // Login successful, proceed with your login logic
      return res.status(200).json({ userid: userfound.userid, message: 'Login successful' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;