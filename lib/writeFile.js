var fs = require("fs"),
    path = require("path"),
    util = require("util");

function writeFile(file, content) {
  return new Promise((resolve, reject) => fs.writeFile(file, content, 'utf8', (err) => {
    if (err) {
      return reject(err);
    }

    resolve();
  }));
}

module.exports = writeFile;
