const SyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight")

module.exports = (eleventyConfig) => {
    // Plugins
    eleventyConfig.addPlugin(SyntaxHighlightPlugin);

    // Path-throughs
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