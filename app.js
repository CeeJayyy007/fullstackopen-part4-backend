const express = require("express");
const config = require("./utils/config");
require("express-async-errors");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/bloglists");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

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
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);

// use error handler middleware
app.use(middleware.errorHandler);

module.exports = app;
