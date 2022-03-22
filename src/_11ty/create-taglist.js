// this list should match the `filter` list in tags.njk
const excludedTags = ["all", "post", "posts"];

module.exports = function (collections) {
  let tagSet = new Set();

  collections.getAll().forEach((collection) => {
    if ("tags" in collection.data) {
      // Clean up tags from excluded items
      let tags = collection.data.tags.filter(
        (item) => !excludedTags.includes(item)
      );

      //   Add each tag to a set
      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  return [...tagSet];
};
