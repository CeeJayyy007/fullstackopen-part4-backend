const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/bloglist");
const User = require("../models/user");

beforeEach(async () => {
  // delete all blogs and users at start
  await Promise.all([Blog.deleteMany({}), User.deleteMany({})]);

  // create initial users
  const userPromises = helper.initialUsers.map((user) =>
    api.post("/api/users").send(user)
  );
  await Promise.all(userPromises);

  // login initial user
  const loginResponse = await api.post("/api/login").send({
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  });

  // get token from login response
  const token = loginResponse.body.token;

  // create initial blogs
  const blogPromises = helper.initialBlogs.map((blog) =>
    api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...blog, userId: loginResponse.body.id })
  );
  await Promise.all(blogPromises);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("verify that the unique identifier property is named id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("addition of a new blog post", () => {
  let token = null;
  let loginResponse = null;

  beforeEach(async () => {
    loginResponse = await api.post("/api/login").send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    });

    token = loginResponse.body.token;
  });

  test("a valid blog post can be added", async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Kelvin Philips",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...newBlog, userId: loginResponse.body.id })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const title = blogsAtEnd.map((b) => b.title);

    expect(title).toContain("New blog post for testing");
  }, 10000);

  test("likes = 0 if likes property is missing", async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Kelvin Philips",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...newBlog, userId: loginResponse.body.id })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("respond with 400 Bad request if title or url missing", async () => {
    const newBlog = {
      author: "Kelvin Philips",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...newBlog, userId: loginResponse.body.id })
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("respond with 401 Unauthorized if token is missing", async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Kelvin Philips",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };

    const result = await api
      .post("/api/blogs")
      .send({ ...newBlog, userId: loginResponse.body.id })
      .expect(401);

    expect(result.body.error).toContain("jwt must be provided");
  });

  test("update likes of a blog post", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 6,
    };

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ...newBlog, userId: loginResponse.body.id })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];

    expect(updatedBlog.likes).toBe(6);
  });

  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const title = blogsAtEnd.map((b) => b.title);

    expect(title).not.toContain(blogToDelete.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
