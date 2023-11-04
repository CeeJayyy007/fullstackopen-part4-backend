// create blogs list router
const blogsRouter = require("express").Router();

// add blogs list model
const Blog = require("../models/bloglist");
const User = require("../models/user");

// get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

// add blog
blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  // get user from database
  const user = await User.findById(body.userId);

  const blog = new Blog({
    ...body,
    likes: body.likes || 0, // if likes property is missing, set it to 0
    user: user._id,
  });

  // if url or title is missing, return 400 Bad Request
  if (!blog.url || !blog.title) {
    return response.status(400).end();
  }

  // save blog to database
  const savedBlog = await blog.save();

  // add saved blog to user's blogs array
  user.blogs = user.blogs.concat(savedBlog._id);

  await user.save();

  response.status(201).json(savedBlog);
});

// update blog post
blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedNote = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  );

  response.json(updatedNote);
});

// delete blog post
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
