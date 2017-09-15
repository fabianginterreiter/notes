var assert = require('assert');
var stat = require('../lib/stat');
var path = require("path");

describe('Test Getting file stats', function() {
  before(function() {
    // runs before all tests in this block
  });

  describe('Test Getting Stat from directory', function() {
    it('Should return stat for a directory', function(done) {
      stat(path.join(__dirname, 'files')).then((s) => {
        assert.equal(true, s.isDirectory());
        done();
      });
    });
  });

  describe('Test Getting Stat from file', function() {
    it('Should return stat for a file', function(done) {
      stat(path.join(__dirname, 'files', 'test.md')).then((s) => {
        assert.equal(false, s.isDirectory());
        //assert.equal(1485604136000, s.mtime.getTime());
        done();
      });
    });
  });
});