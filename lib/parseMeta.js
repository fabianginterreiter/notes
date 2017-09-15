var titleRegExp = new RegExp("([^\\r\\n]*)\\r?\\n=+\\r?\\n");
// only for German characters
var tagsRegExp = /(#[a-zA-Z0-9üÜäÄöÖß_]+)/g;

module.exports = (result, data) => {
  var matches = data.match(titleRegExp);
  if (matches && matches.length) {
    result.title = matches[1];
  }

  result.tags = [];

  var tagsMatches = data.match(tagsRegExp);
  if (tagsMatches) {
    tagsMatches.forEach((tag) => result.tags.push(tag.substring(1)));
  }
}
