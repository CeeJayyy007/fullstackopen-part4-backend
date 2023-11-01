const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/bloglists");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// connect to mongodb databse
const url = config.MONGODB_URI;

logger.info("connecting to", url);

// connect to db
mongoose
  .connect(url)
  // eslint-disable-next-line no-unused-vars
  .then((result) => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);

// use error handler middleware
app.use(middleware.errorHandler);

module.exports = app;
