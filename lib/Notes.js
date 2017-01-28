"use strict"

var scan = require('./scan');

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
}

module.exports = Notes;