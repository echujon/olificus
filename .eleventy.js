module.exports = function(eleventyConfig) {
    // This tells Eleventy to copy the entire 'images' folder as-is to the output
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("_headers");

    // Add comic collection
    eleventyConfig.addCollection("comic", function(collectionApi) {
        return collectionApi.getFilteredByGlob("comic/**/*.md").sort((a, b) => {
            // Sort by slug e.g. comic/s1/e1 < comic/s1/e2
            const slugA = a.data.slug || '';
            const slugB = b.data.slug || '';
            const matchA = slugA.match(/s(\d+)\/e(\d+)/i);
            const matchB = slugB.match(/s(\d+)\/e(\d+)/i);
            if (!matchA || !matchB) return 0;
            const seasonDiff = parseInt(matchA[1]) - parseInt(matchB[1]);
            if (seasonDiff !== 0) return seasonDiff;
            return parseInt(matchA[2]) - parseInt(matchB[2]);
        });
    });

    // Get previous comic (older) in collection
    eleventyConfig.addFilter("prevComic", function(collection, currentSlug) {
        const index = collection.findIndex(c => c.data.slug === currentSlug);
        return index > 0 ? collection[index - 1] : null;
    });

    // Get next comic (newer) in collection
    eleventyConfig.addFilter("nextComic", function(collection, currentSlug) {
        const index = collection.findIndex(c => c.data.slug === currentSlug);
        return index !== -1 && index < collection.length - 1 ? collection[index + 1] : null;
    });

    // Format slug into episode label e.g. "comic/s1/e2" -> "S1E2"
    eleventyConfig.addFilter("episodeLabel", function(slug) {
        if (!slug) return '';
        const match = slug.match(/s(\d+)\/e(\d+)/i);
        if (!match) return '';
        return `S${match[1]}E${match[2]}`;
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
  