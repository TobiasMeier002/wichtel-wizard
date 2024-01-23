const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { createEvent, getEvents, addParticipant } = require('../models/event')
const { sendConfirmationEmail } = require('../utils/mailer');
const router = express.Router();

router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  }

  const { email, password, surname, lastname } = req.body;
  var user = new User();
  user = req.body;  
  try {
    console.log(typeof user);
    // Check if user already exists
    user.findUserByEmail(user.email, async (err, user) => {
      if (err) {
        return res.status(500).send('Error checking user');
      }

      if (user) {
        return res.status(409).send('User already exists');
      }      

      // Create user in the database
      user.createUser({ Email: email, Password: hashedPassword, Surname: surname, Lastname: lastname }, (err, userId) => {
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

router.post('/events/register', async (req, res) => {
  const { name, userid, pricelimit, eventdate} = req.body;

  if (!name || typeof name !== "string" || !pricelimit || typeof pricelimit !== "number" || !eventdate || !userid || typeof userid !== "number" ) {
    return res.status(400).send('name, pricelimit or date invalid');
  }
  createEvent({name: name, creatoruserid: userid, pricelimit: pricelimit, eventdate: eventdate, status: "created"}, (err, eventid) => {
    if (err) {
      console.error("Event registration Error:", err);
      return res.status(500).send('Internal server error');
    }

    return res.status(200).json({ eventid: eventid, message: 'Event created Successfull' });
  });

});

router.get('/events', async (req, res) => {
  return getEvents((err, events) => {
    return res.status(200).json(events);
  });
});

router.post('/events/addParticipantbyEmail', async (req, res) => {
  const { eventid, email} = req.body;
  return addParticipant({ eventid: eventid, email:email}, async (err, message) => {
    if(err) {
      return res.status(500).send('Server error');
    } else {
      return res.status(200).json(message);
    }
  });

});

module.exports = router;