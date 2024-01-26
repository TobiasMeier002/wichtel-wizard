const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

/**
 * @swagger
 * components:
 *  schemas:
 *    user:
 *      type: object
 *      properties:
 *        userid:
 *          type: integer
 *          description: id is auto incermented
 *          example: 0
 *        email:
 *          type: string
 *          description: not null, email address
 *          example: john.doe@example.com
 *        password:
 *          type: string
 *          description: a secure password
 *          example: T!s!$aSecurePassw0rd
 *        surname:
 *          type: string
 *          description: the users surname
 *          example: John
 *        lastname:
 *          type: string
 *          description: lastname
 *          example: Doe
 *        emailConfirmed:
 *          type: boolean
 *          description: The User Email has to be confirmed
 *          example: true
 *        confirmUri:
 *          type: string
 *          description: GUUID
 *          example: ba8ad9b7-10f7-42f7-a066-0c10c63cf252
 *
 * /api/register:
 *   post:
 *     tags:
 *      - user
 *     summary: Register a new user.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                userid:
 *                  type: integer
 *                  description: User ID
 *                  example: 1
 *                message:
 *                  type: string
 *                  description: Message
 *                  example: Registration successful
 *
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 *
 *       400:
 *        description: Request body is missing
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Request body is missing
 *       409:
 *        description: User already exists
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: User already exists
 */

router.post("/register", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }
  const user = new User();
  Object.assign(user, req.body);

  try {
    // Check if user already exists
    user.findByEmail(user.email, async (err, userfound) => {
      if (err) {
        return res.status(500).send("Error checking user");
      }

      if (userfound) {
        return res.status(409).send("User already exists");
      }

      // Create user in the database
      user.create(async (err, userId) => {
        if (err) {
          console.error("Registration Error:", err);
          return res.status(500).send("Internal server error");
        }
        return res
          .status(201)
          .json({ userid: userId, message: "Registration successful" });
      });
    });
  } catch (error) {
    console.error(error);
    // Only send this response if none of the above responses have been sent
    if (!res.headersSent) {
      res.status(500).send("Internal server error");
    }
  }
});

/**
 * @swagger
 * /api/updateUser:
 *  post:
 *    tags:
 *      - user
 *    summary: Update User.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *    responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                userid:
 *                  type: integer
 *                  description: User ID
 *                  example: 1
 *                message:
 *                  type: string
 *                  description: Message
 *                  example: Update successful
 *
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 *
 *       400:
 *        description: Request body is missing
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Request body is missing
 */

router.post("/updateUser", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }
  const user = new User();
  Object.assign(user, req.body);

  try {
    // Create user in the database
    user.update(async (err, userId) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).send("Internal server error");
      }
      return res
        .status(200)
        .json({ userid: userId, message: "Update successful" });
    });
  } catch (error) {
    console.error(error);
    // Only send this response if none of the above responses have been sent
    if (!res.headersSent) {
      res.status(500).send("Internal server error");
    }
  }
});

/**
 * @swagger
 * /api/confirm/{confirmUri}:
 *   get:
 *     tags:
 *      - user
 *     summary: confirm email address
 *     parameters:
 *       - in: path
 *         name: confirmUri
 *         required: true
 *         description: GUUID which is generate by the system and send to the user per mail
 *         schema:
 *           confirmUri:
 *            type: string
 *
 *     responses:
 *       200:
 *         description: the requested event Events
 *         content:
 *           application/json:
 *            schema:
 *              properties:
 *                message:
 *                  type: string
 *                  description: confirm Message
 *                  example: E-Mail confirmed
 *
 *       401:
 *        description: User not found
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              description: Error message
 *              example: User not found
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              description: Error message
 *              example: Internal Server Error
 */

router.get("/confirm/:confimrUri", async (req, res) => {
  const user = new User();
  user.findByConfirmUri(req.params.confimrUri, (err, userfound) => {
    if (err) {
      return res.status(500).send("Internal Server error");
    }

    if (!userfound) {
      return res.status(401).send("User not found");
    }
    user.confirm(userfound.userid, async (err, result) => {
      if (err) {
        return res.status(500).send("Internal Server error");
      }
      return res.redirect("http://loclaohst:3000/userconfirmed/");
    });
  });
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *      - user
 *     summary: user login.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              email:
 *                type: string
 *                description: the users email address
 *                example: john.doe@mail.com
 *              password:
 *                type: string
 *                description: the users password
 *                example: T!s!$aSecurePassw0rd
 *     responses:
 *       209:
 *         description: confirmation needed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                confirmUri:
 *                  type: string
 *                  description: confirmation GUUID
 *                  example: ba8ad9b7-10f7-42f7-a066-0c10c63cf252
 *                message:
 *                  type: string
 *                  description: Message
 *                  example: confirmation needed
 *
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                userid:
 *                  type: integer
 *                  description: The Users ID
 *                  example: 1
 *                message:
 *                  type: string
 *                  description: Message
 *                  example: Login successful
 *
 *       500:
 *        description: Internal Server Error
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Internal Server Error
 *
 *       400:
 *        description: User or Credentials invalid
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: Email and password are required
 *       401:
 *        description: User not found
 *        content:
 *          plain/text:
 *            schema:
 *              type: string
 *              example: User not found
 */

router.post("/login", async (req, res) => {
  const user = new User();
  user.password = req.body.password;
  user.email = req.body.email;

  if (!user.email || !user.password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    user.findByEmail(user.email, async (err, userfound) => {
      if (err) {
        return res.status(500).send("Server error");
      }

      if (!userfound) {
        return res.status(401).send("User not found");
      }

      if (userfound.emailConfirmed == 1) {
        // Compare submitted password with stored hash
        const isMatch = await bcrypt.compare(user.password, userfound.password);
        if (!isMatch) {
          return res.status(400).send("Invalid credentials");
        }
      } else {
        return res.status(209).json({
          confirmUri: userfound.confirmUri,
          message: "confirmation needed",
        });
      }

      // Login successful, proceed with your login logic
      return res
        .status(200)
        .json({ userid: userfound.userid, message: "Login successful" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
