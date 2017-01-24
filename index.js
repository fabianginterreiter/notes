var fs = require("fs"),
    path = require("path"),
    util = require("util");
	
	
var titleRegExp = new RegExp("([^\\n]*)\\n=+\\n");
var tagsRegExp = /(#[a-zA-Z0-9_]+)/g;
	
var content;

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

function readFile(file) {
  return new Promise((resolve, reject) => fs.readFile(path.join(__dirname, 'files', file), 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(data);
  }));
}

function stat(file) {
  return new Promise((resolve, reject) => fs.stat(path.join(__dirname, 'files', file), (err, stat) => {
    if (err) {
      return reject(err);
    }

    resolve(stat);
  }));
}

function scan(dir) {
  var result = {
    files: {},
    directories: {}
  };

  if (!dir) {
    dir = '/';
  }

  result.dir = dir;

  result.category = path.basename(dir);

	return new Promise((resolve, reject) => fs.readdir(path.join(__dirname, 'files', dir), (err, list) => {
		if (err) {
			return reject(err);
		}

    var promises = [];

    list.forEach((file) => {
      var filepath = path.join(dir, file);

      promises.push(stat(filepath).then((stat) => {
        if (stat.isDirectory()) {
          return scan(filepath).then((r) => result.directories[file] = r);
        } else {
          return read(filepath).then((r) => {
            r.created_at = stat.birthtime;
            r.updated_at = stat.mtime;

            result.files[file] = r            
          });
        }
      }))
    });

    return Promise.all(promises).then(() => resolve(result));
	}));
}

var data = null;
scan().then((d) => (data = d));


var express = require('express');
var app = express();

app.get('/api/all', function (req, res) {
  res.send(data);
});

function getTags(category) {
  var tags = {};

  for (var key in category.files) {
    var file = category.files[key];
    file.tags.forEach((tag) => {
      if (!tags[tag]) {
        tags[tag] = true;
      }
    })
  };

  for (var key in category.directories) {
    var category = category.directories[key];

    getTags(category).forEach((tag) => {
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

function contains(tags, tag) {
  for (var index = 0; index < tags.length; index++) {
    if (tags[index] === tag) {
      return true;
    }
  }

  return false;
}

function getNotes(category, tag) {
  var notes = [];

  for (var key in category.files) {
    var file = category.files[key];

    if (!tag || (tag && contains(file.tags, tag))) {
      notes.push(file);  
    }
  };

  for (var key in category.directories) {
    var category = category.directories[key];

    getNotes(category, tag).forEach((note) => {
      notes.push(note);
    });
  };

  return notes;
}

function getCategories(category) {
  var result = [];

  for (var key in category.directories) {
    result.push(getCategories(category.directories[key]));
  };

  return {
    name: category.category,
    dir: category.dir,
    categories: result
  };
}

function getCategory(d, dirs, index) {
  if (!dirs || dirs.length === 0) {
    return d;
  }

  var next = d.directories[dirs[index]];

  if (index < dirs.length - 1) {
    return getCategory(next, dirs, index + 1);
  } else {
    return next;
  }
}

function getDirs(path) {
  var dirs = path.split('/');
  
  for (var index = dirs.length - 1; index >= 0; index--) {
    if (dirs[index].trim() === '' || dirs[index].trim() === '.') {
      dirs.splice(index, 1);
    }
  }

  return dirs;
}

function getNote(category, file) {
  var file = category.files[file];

  return readFile(file.file).then((data) => {
    file.content = data
    return file;
  });
}

app.get('/api/tags*', (req, res) => {
  res.send(getTags(getCategory(data, getDirs(req.params[0].trim()), 0)).sort());
});

app.get('/api/categories*', (req, res) => {
  res.send(getCategories(getCategory(data, getDirs(req.params[0].trim()), 0)).categories);
});

app.get('/api/notes*', (req, res) => {
  res.send(getNotes(getCategory(data, getDirs(req.params[0].trim()), 0), req.query.tag).sort(function compare(a,b) {
    if (a.updated_at.getTime() < b.updated_at.getTime())
      return 1;
    if (a.updated_at.getTime() > b.updated_at.getTime())
      return -1;
    return 0;
  }));
});

app.get('/api/note/*', (req, res) => {
  var file = path.basename(req.params[0]);
  getNote(getCategory(data, getDirs(path.dirname(req.params[0])), 0), file).then((file) => res.send(file));
});

app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});
