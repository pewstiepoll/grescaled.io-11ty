const UserConfig = require("@11ty/eleventy/src/UserConfig");
const SyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const PostCSSPlugin = require("eleventy-plugin-postcss");

/**
 * Eleventy configuration function
 * @param {UserConfig} config 
 * @returns {Object}
 */
module.exports = (config) => {
    // Plugins
    config.addPlugin(PostCSSPlugin);
    config.addPlugin(SyntaxHighlightPlugin);

    // Path-throughs
    config.addPassthroughCopy("src/fonts/**/*.ttf");

    return {
            dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
        }
    }
}