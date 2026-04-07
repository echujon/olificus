module.exports = {
    eleventyComputed: {
        layout: data => data.slug ? "comic.njk" : undefined,
        permalink: data => data.slug ? `/${data.slug}/` : undefined
    }
};
