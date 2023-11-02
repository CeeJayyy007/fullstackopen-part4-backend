const _ = require("lodash");

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  // receive an array of blogs as a parameter
  return 1;
};

// define function totalLikes
const totalLikes = (blogs) => {
  // receive an array of blogs as a parameter
  // return the total sum of likes in all of the blog posts
  // if the array is empty, return 0

  const sumOfLikes = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(sumOfLikes, 0);
};

// define function favoriteBlog
const favoriteBlog = (blogs) => {
  // receive an array of blogs as a parameter
  // return the blog with the most likes
  const mostLikedBlog = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  }, blogs[0]);

  const blogData = {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes,
  };

  return blogData;
};

// define function mostBlogs
const mostBlogs = (blogs) => {
  // count the occurences of each author
  const authorCounts = _.countBy(blogs, "author");

  // get the name of the author with the most blogs
  const maxAuthorName = _.maxBy(
    Object.keys(authorCounts),
    (author) => authorCounts[author]
  );

  // create an object with the author name and the number of blogs
  const authorBlogCount = {
    author: maxAuthorName,
    blogs: authorCounts[maxAuthorName],
  };

  return authorBlogCount;
};

// define function mostLikes
const mostLikes = (blogs) => {
  // Group blogs by author and sum likes
  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  // Find the author with the most likes
  const mostLikedAuthor = Object.entries(likesByAuthor).reduce(
    (max, [author, likes]) => {
      return likes > max.likes ? { author, likes } : max;
    },
    { author: "", likes: 0 }
  );

  return mostLikedAuthor;
};

// export the functions
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
