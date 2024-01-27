const express = require("express");
const router = express.Router();
const { Participant } = require("../models/Participant");

/**
 * @swagger
 * components:
 *  schemas:
 *    participant:
 *      type: object
 *      properties:
 *        participantid:
 *          type: integer
 *          description: id is auto incermented
 *          example: 0
 *        userid:
 *          type: integer
 *          description: foreign Key for user
 *          example: 1
 *        eventid:
 *          type: integer
 *          description: the event id
 *          example: 0
 *        giftwish:
 *          type: string
 *          description: Giftwisch
 *          example: One million dollars
 *
 * /api/participant/{participantid}/confirm:
 *  get:
 *    tags:
 *      - participant
 *    summary: confirm participation
 *    parameters:
 *      - in: path
 *        name: participantid
 *        required: true
 *        description: numeric id of the participant
 *        schema:
 *          type: integer
 *    responses:
 *      302:
 *        description: redirect to gui
 *
 *      500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 */

router.get("/:participantid/confirm", async (req, res) => {
  const participant = new Participant();
  participant.participantid = req.params.participantid;
  participant.confirm((err, result) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    } else {
      return res.redirect("http://localhost:3000/confirmed");
    }
  });
});

/**
 * @swagger
 * /api/participant/{participantid}/decline:
 *  get:
 *    tags:
 *      - participant
 *    summary: decline participation
 *    parameters:
 *      - in: path
 *        name: participantid
 *        required: true
 *        description: numeric id of the participant
 *        schema:
 *          type: integer
 *    responses:
 *      302:
 *        description: redirect to gui
 *
 *      500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 */

router.get("/:participantid/decline", async (req, res) => {
  const participant = new Participant();
  participant.participantid = req.params.participantid;
  participant.decline((err, result) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    } else {
      return res.redirect("http://localhost:3000/declined");
    }
  });
});

module.exports = router;
