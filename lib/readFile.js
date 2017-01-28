var fs = require("fs"),
    path = require("path"),
    util = require("util");

function readFile(file) {
  return new Promise((resolve, reject) => fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(data);
  }));
}

module.exports = readFile;