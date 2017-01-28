var stat = require('./stat');
var fs = require("fs"),
    path = require("path"),
    util = require("util");
var read = require('./read');

function scan(root, dir) {
  var result = {
    files: {},
    directories: {}
  };

  if (!dir) {
    dir = '/';
  }

  result.dir = dir;

  result.category = path.basename(dir);

  var p = path.join(root, dir);

  return new Promise((resolve, reject) => fs.readdir(p, (err, list) => {
    if (err) {
      return reject(err);
    }

    var promises = [];

    list.forEach((file) => {
      var filepath = path.join(root, dir, file);

      promises.push(stat(filepath).then((stat) => {
        if (stat.isDirectory()) {
          return scan(root, path.join(dir, file)).then((r) => result.directories[file] = r);
        } else {
          if (path.extname(file) !== '.md') {
            return Promise.resolve(true);
          }

          return read(filepath).then((r) => {
            r.created_at = stat.birthtime;
            r.updated_at = stat.mtime;
            r.file = path.join(dir, path.basename(file, '.md'));

            result.files[path.basename(file, '.md')] = r            
          });
        }
      }))
    });

    return Promise.all(promises).then(() => resolve(result));
  }));
}

module.exports = scan;