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

// export the functions
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
