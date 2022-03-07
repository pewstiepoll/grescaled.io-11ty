module.exports = (eleventyConfig) => {
    eleventyConfig.addPassthroughCopy("src/fonts/**/*.ttf");
    eleventyConfig.addPassthroughCopy("src/styles/**/*.css");

    return {
            dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
        }
    }
}