var fs = require("fs"),
    path = require("path"),
    util = require("util");
	
var readFile = require('./lib/readFile');
	
var scan = require('./lib/scan');
	
var data = null;
scan(path.join(__dirname, "files")).then((d) => (data = d)).catch(console.log);

var express = require('express');
var app = express();

app.get('/api/all', function (req, res) {
  res.send(data);
});

function getTags(category) {
  if (!category) {
    return [];
  }

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
    var c = category.directories[key];

    getTags(c).forEach((tag) => {
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
  if (!category) {
    return [];
  }

  var notes = [];

  for (var key in category.files) {
    var file = category.files[key];

    if (!tag || (tag && contains(file.tags, tag))) {
      notes.push(file);  
    }
  };

  for (var key in category.directories) {
    var c = category.directories[key];

    getNotes(c, tag).forEach((note) => {
      notes.push(note);
    });
  };

  return notes;
}

function getCategories(category) {
  if (!category) {
    return [];
  }

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

  return readFile(path.join(__dirname, 'files', file.file + '.md')).then((data) => {
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
app.use(express.static('files'));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});
