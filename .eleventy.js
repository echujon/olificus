module.exports = function(eleventyConfig) {
    // This tells Eleventy to copy the entire 'images' folder as-is to the output
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("_headers");

    // Add comic collection
    eleventyConfig.addCollection("comic", function(collectionApi) {
        return collectionApi.getFilteredByGlob("comic/**/*.md").sort((a, b) => {
            return b.date - a.date; // Sort by date, newest first
        });
    });

    // Add filter to extract first image from content
    eleventyConfig.addFilter("extractFirstImage", function(content) {
        const match = content.match(/<img[^>]+src="([^">]+)"/);
        return match ? match[1] : '';
    });

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
  