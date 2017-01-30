var fs = require("fs"),
    path = require("path"),
    util = require("util");

var readFile = require('./readFile');

var titleRegExp = new RegExp("([^\\r\\n]*)\\r?\\n=+\\r?\\n");
// only for German characters
var tagsRegExp = /(#[a-zA-Z0-9üÜäÄöÖß_]+)/g;

function read(file) {
  return readFile(file).then((data) => {
    var matches = data.match(titleRegExp);
    
    var result = {
      
    };
    
    if (matches && matches.length) {
      result.title = matches[1];
    }
    
    var tagsMatches = data.match(tagsRegExp);
    
    result.tags = [];

    tagsMatches.forEach((tag) => result.tags.push(tag.substring(1)));

    result.file = file;
    result.basename = path.basename(file);
    
    return result;
  });
}

module.exports = read;