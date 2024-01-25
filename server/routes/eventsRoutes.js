const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Event } = require("../models/Event");

/**
 * @swagger
 * components:
 *  schemas:
 *    event:
 *      type: object
 *      properties:
 *        eventid:
 *          type: integer
 *          description: id is auto incermented
 *          example: 0
 *        name:
 *          type: string
 *          description: the event name
 *          example: Weihnachtsfest Familie
 *        creatoruserid:
 *          type: integer
 *          description: the user id
 *          example: 0
 *        pricelimit:
 *          type: integer
 *          description: Maximum allowed value of the present
 *          example: 50
 *        eventdate:
 *          type: string
 *          description: event Date
 *          example: 2024-12-24
 *        status:
 *          type: string
 *          description: Event Status
 *          example: Created
 *
 * /api/events/register:
 *   post:
 *     tags:
 *      - events
 *     summary: Register a new event.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/event'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                eventid:
 *                  type: integer
 *                  description: Event ID
 *                  example: 1
 *                message:
 *                  type: string
 *                  description: Message
 *                  example: Event created Successfull
 *
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 */

router.post("/register", async (req, res) => {
  const event = new Event();
  Object.assign(evetnt, req.body);
  event.status = "created";

  event.create((err, eventid) => {
    if (err) {
      console.error("Event registration Error:", err);
      return res.status(500).send("Internal server error");
    }
    return res
      .status(201)
      .json({ eventid: eventid, message: "Event created Successfull" });
  });
});

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags:
 *      - events
 *     summary: get all events
 *     responses:
 *       200:
 *         description: All registered Events
 *         content:
 *           application/json:
 *             schema:
 *               type:  array
 *               items:
 *                $ref: '#/components/schemas/event'
 *
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 */

router.get("/", async (req, res) => {
  const event = new Event();
  return event.getAll((err, events) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      return res.status(200).json(events);
    }
  });
});

/**
 * @swagger
 * /api/events/{eventid}:
 *   get:
 *     tags:
 *      - events
 *     summary: get a single event
 *     parameters:
 *       - in: path
 *         name: eventid
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: the requested event Events
 *         content:
 *           application/json:
 *            schema:
 *              type:
 *                $ref: '#/components/schemas/event'
 *
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 */

router.get("/:eventid", async (req, res) => {
  const event = new Event();
  event.eventid = req.params.eventid;
  return event.getbyID((err, events) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    } else {
      return res.status(200).json(events);
    }
  });
});

router.post("/addParticipantbyEmail", async (req, res) => {
  const event = new Event();
  const participant = new User();
  event.eventid = req.body.eventid;
  participant.email = req.body.email;
  event.addParticipant(participant, async (err, message) => {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      return res.status(200).json({ message: message });
    }
  });
});

router.get("/:eventid/start", async (req, res) => {
  const event = new Event();
  Event.eventid = req.params.eventid;
  event.start((err, message) => {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      return res.status(200).json({ message: message });
    }
  });
});

//UpdateEvent
router.post("/", async (req, res) => {
  const event = new Event();
  event.eventid = req.body.eventid;
  event.name = req.body.name;
  event.pricelimit = req.body.pricelimit;
  event.eventdate = req.body.eventdate;

  event.update((err, message) => {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      return res.status(200).json({ message: message });
    }
  });
});

module.exports = router;
