const express = require("express");

const healthRoutes = require("./routes/healthRoutes");
const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

