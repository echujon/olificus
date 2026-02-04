module.exports = function(eleventyConfig) {
    // This tells Eleventy to copy the entire 'images' folder as-is to the output
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("_headers");
    return {
      dir: {
        input: ".",
        output: "_site",
        // The includes path is no longer relative to `input`
        // Eleventy will now look in the root for your includes folder
        includes: "_includes"
      },
      templateFormats: ["html", "md", "njk"],
      htmlTemplateEngine: "njk",
    };
  };
  