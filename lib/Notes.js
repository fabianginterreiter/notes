"use strict"

var scan = require('./scan');
var readFile = require('./readFile');
var p = require("path");

class Notes {
  constructor(dir) {
    this.dir = dir;
    this.data = null;
  }

  init() {
    return scan(this.dir).then((data) => this.data = data);
  }

  getData() {
    return this.data;
  }

  _split(path) {
    var dirs = path.split('/');
    
    for (var index = dirs.length - 1; index >= 0; index--) {
      if (dirs[index].trim() === '' || dirs[index].trim() === '.') {
        dirs.splice(index, 1);
      }
    }

    return dirs;
  }

  _getCategory(d, dirs, index) {
    if (!dirs || dirs.length === 0) {
      return d;
    }

    var next = d.directories[dirs[index]];

    if (index < dirs.length - 1) {
      return this._getCategory(next, dirs, index + 1);
    } else {
      return next;
    }
  }

  _getTags(category, t2) {
    if (!category) {
      return [];
    }

    var tags = {};

    for (var key in category.files) {
      var file = category.files[key];

      if (!this._filterByTags(file.tags, t2)) {
        file.tags.forEach((tag) => {
          if (!tags[tag]) {
            tags[tag] = true;
          }
        })
      }
    };

    for (var key in category.directories) {
      var c = category.directories[key];

      this._getTags(c, t2).forEach((tag) => {
        if (!tags[tag]) {
          tags[tag] = true;
        }
      });
    };

    var result = [];
    for (var key in tags) {
      result.push(key);
    }
    return result;
  }

  getTags(path, tags) {
    var tags = tags ? tags.split(',') : [];

    return this._getTags(this._getCategory(this.data, this._split(path), 0), tags).sort();
  }

  _getCategories(category) {
    if (!category) {
      return [];
    }

    var result = [];

    for (var key in category.directories) {
      result.push(this._getCategories(category.directories[key]));
    };

    return {
      name: category.category,
      dir: category.dir,
      categories: result.sort((a, b) => {
        if (a.title > b.title)
          return 1;
        if (a.title < b.title)
          return -1;
        return 0;
      }),
      title: category.title
    };
  }

  getCategories(path) {
    return this._getCategories(this._getCategory(this.data, this._split(path), 0)).categories;
  }

  _filterByTags(tags, tags2) {
    if (tags2.length === 0) {
      return false;
    }

    console.log(tags2);
    for (var index2 = 0; index2 < tags2.length; index2++) {
      var tag = tags2[index2];

      var contains = false;
      for (var index = 0; index < tags.length; index++) {
        if (tags[index] === tag) {
          contains = true;
          break;
        }
      }

      if (!contains) {
        return true;
      }
    }

    return false;
  }

  _getNotes(category, tags) {
    if (!category) {
      return [];
    }

    var notes = [];

    for (var key in category.files) {
      var file = category.files[key];

      if (!this._filterByTags(file.tags, tags)) {
        notes.push(file);  
      }
    };

    for (var key in category.directories) {
      var c = category.directories[key];

      this._getNotes(c, tags).forEach((note) => {
        notes.push(note);
      });
    };

    return notes;
  }

  getNotes(path, tags) {
    var tags = tags ? tags.split(',') : [];

    return this._getNotes(this._getCategory(this.data, this._split(path), 0), tags).sort(function compare(a,b) {
      if (a.updated_at.getTime() < b.updated_at.getTime())
        return 1;
      if (a.updated_at.getTime() > b.updated_at.getTime())
        return -1;
      return 0;
    });
  }

  _getNote(category, file) {
    var file = category.files[file];

    return readFile(p.join(this.dir, file.file)).then((data) => {
      file.content = data
      return file;
    });
  }

  getNote(path) {
    var file = p.basename(path);
    var dir = p.dirname(path);

    return this._getNote(this._getCategory(this.data, this._split(dir), 0), file);
  }
}

module.exports = Notes;