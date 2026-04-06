module.exports = {
    layout: "comic.njk",
    eleventyComputed: {
        permalink: data => `/${data.slug}/`
    }
};
