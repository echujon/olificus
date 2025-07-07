module.exports = function(eleventyConfig) {
    // This tells Eleventy to copy the entire 'images' folder as-is to the output
    eleventyConfig.addPassthroughCopy("images");
  };
  