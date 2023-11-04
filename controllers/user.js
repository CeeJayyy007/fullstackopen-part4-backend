// add bcrypt for password hashing
const bcrypt = require("bcrypt");

// create user router
const usersRouter = require("express").Router();

// add note model
const User = require("../models/user");

// create user
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

// get users
usersRouter.get("/", async (request, response) => {
  // populate the blogs field of the user object with the details of the blogs
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
