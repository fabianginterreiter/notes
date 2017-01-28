var fs = require("fs"),
    path = require("path"),
    util = require("util");
	
var readFile = require('./lib/readFile');
	
var scan = require('./lib/scan');

var Notes = require('./lib/Notes');
	
var notes = new Notes(path.join(__dirname, "files"));
notes.init();

var express = require('express');
var app = express();

app.get('/api/all', function (req, res) {
  res.send(notes.getData());
});

app.get('/api/tags*', (req, res) => {
  res.send(notes.getTags(req.params[0]));
});

app.get('/api/categories*', (req, res) => {
  res.send(notes.getCategories(req.params[0]));
});

app.get('/api/notes*', (req, res) => {
  res.send(notes.getNotes(req.params[0], req.query.tag));
});

app.get('/api/note/*', (req, res) => {
  notes.getNote(req.params[0]).then((file) => res.send(file));
});

app.use(express.static('public'));

app.use('*', (req, res, next) => {
  if (req.params[0].endsWith('.md')) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))  
  } else {
    next();
  }
});

app.use(express.static('files'));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});
