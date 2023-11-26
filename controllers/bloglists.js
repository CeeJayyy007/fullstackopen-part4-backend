const middleware = require("../utils/middleware");
const blogsRouter = require("express").Router();
const Blog = require("../models/bloglist");

// get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

// add blog
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    ...body,
    likes: body.likes || 0, // if likes property is missing, set it to 0
    user: user.id,
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
blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  ).populate("user", { username: 1, name: 1 });

  response.json(updatedBlog);
});

// delete blog post
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    // get blog post to delete
    const blog = await Blog.findById(request.params.id);

    if (user.id !== blog.user.toString()) {
      return response.status(401).json({ error: "unauthorized user request" });
    }

    // delete blog post
    await Blog.findByIdAndRemove(request.params.id);

    response.status(204).end();
  }
);

module.exports = blogsRouter;
