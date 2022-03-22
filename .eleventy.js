const UserConfig = require("@11ty/eleventy/src/UserConfig");
const SyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const PostCSSPlugin = require("eleventy-plugin-postcss");

const { format } = require("date-fns");

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
    config.addPassthroughCopy("favicon.ico");
    config.addPassthroughCopy("src/fonts/**/*.ttf");

    // Filters
    config.addFilter("formatDate", (date, formatStr) => format(date, formatStr));
    config.addFilter("htmlDateString", (date) => format(date, "yyyy-MM-dd"));
    config.addFilter("readableDateString", (date) => format(date, "MMMM dd, yyyy"));

    // Custom collections
    config.addCollection("tagList", require("./src/_11ty/create-taglist"));

    return {
            dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
        }
    }
}