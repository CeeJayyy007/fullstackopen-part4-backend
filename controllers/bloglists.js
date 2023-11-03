// create blogs list router
const blogsRouter = require("express").Router();

// add blogs list model
const Blog = require("../models/bloglist");

// get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

// add blog
blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
