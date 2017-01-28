var fs = require("fs"),
    path = require("path"),
    util = require("util");

function stat(file) {
  return new Promise((resolve, reject) => fs.stat(file, (err, stat) => {
    if (err) {
      console.log(err);
      return reject(err);
    }

    resolve(stat);
  }));
}

module.exports = stat;