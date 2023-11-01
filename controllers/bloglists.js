// create blogs list router
const blogsRouter = require("express").Router();

// add blogs list model
const Blog = require("../models/bloglist");

// get all blogs
blogsRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

// add blog
blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
