// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  // receive an array of blogs as a parameter
  return 1;
};

// define function totalLikes
// eslint-disable-next-line no-unused-vars
const totalLikes = (blogs) => {
  // receive an array of blogs as a parameter
  // return the total sum of likes in all of the blog posts
  // if the array is empty, return 0

  const sumOfLikes = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(sumOfLikes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
