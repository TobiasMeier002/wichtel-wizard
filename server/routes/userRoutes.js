const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const { Event } = require('../models/Event');

router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  }

  const user = new User();
  user.lastname = req.body.lastname;
  user.surname = req.body.surname;
  user.password = req.body.password;
  user.email = req.body.email;

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
    user.confirm(userfound.userId, async (err, result) => {
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

router.post('/events/register', async (req, res) => {
  const event = new Event();
  event.creatoruserid = req.body.userid;
  event.name = req.body.name;
  event.pricelimit = req.body.pricelimit;
  event.eventdate = req.body.eventdate;
  event.status = 'created';

  event.create((err, eventid) => {
    if (err) {
      console.error("Event registration Error:", err);
      return res.status(500).send('Internal server error');
    }
    return res.status(200).json({ eventid: eventid, message: 'Event created Successfull' });
  });

});

router.get('/events', async (req, res) => {
  const event = new Event();
  return event.getAll((err, events) => {
    return res.status(200).json(events);
  });
});

router.get('/events/:eventid', async (req, res) => {
  const event = new Event();
  event.eventid = req.params.eventid;
  return event.getbyID((err, events) => {
    if (err) {
      return res.status(400).json(err);
    } else {
      return res.status(200).json(events);
    }
  });
});

router.post('/events/addParticipantbyEmail', async (req, res) => {
  const event = new Event();
  const participant = new User();
  event.eventid = req.body.eventid;
  participant.email = req.body.email;
  event.addParticipant(participant, async (err, message) => {
    if (err) {
      return res.status(500).send('Server error');
    } else {
      return res.status(200).json({ message: message });
    }
  });
});

router.get('/events/:eventid/start', async (req, res) => {
  const event = new Event();
  Event.eventid = req.params.eventid;
  event.start((err, message) => {
    if (err) {
      return res.status(500).send('Server error');
    } else {
      return res.status(200).json({ message: message });
    }
  })
});

//UpdateEvent
router.post('/events', async (req, res) => {
  const event = new Event();
  event.eventid = req.body.eventid;
  event.name = req.body.name;
  event.pricelimit = req.body.pricelimit;
  event.eventdate = req.body.eventdate;

  event.update((err, message) => {
    if (err) {
      return res.status(500).send('Server error');
    } else {
      return res.status(200).json({ message: message });
    }
  })
});

module.exports = router;