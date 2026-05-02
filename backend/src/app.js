const express = require("express");

const healthRoutes = require("./routes/healthRoutes");
const datasetRoutes = require("./routes/datasetRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");
const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/pipelines", pipelineRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

