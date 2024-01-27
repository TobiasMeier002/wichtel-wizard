const cors = require("cors");
const express = require("express");
const bodyparser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const participantRoutes = require("./routes/participantRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

//API Documentation definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wichtel Wizard Server API",
      version: "1.0.0",
      description: "API documentation for Wichtel Wizard Server API",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
//use only for development
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use(bodyparser.json());
//add user routes
app.use("/api", userRoutes);
//add event routes
app.use("/api/events", eventsRoutes);
//add participant routes
app.use("/api/participant", participantRoutes);
app.use(bodyparser.urlencoded({ extended: true }));

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(
    `App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`
  );
});
