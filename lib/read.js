var fs = require("fs"),
    path = require("path"),
    util = require("util");

var readFile = require('./readFile'),
    parseMeta = require("./parseMeta");



function read(file) {
  return readFile(file).then((data) => {
    var result = {

    };

    parseMeta(result, data);

    result.file = file;
    result.basename = path.basename(file);

    return result;
  });
}

module.exports = read;
