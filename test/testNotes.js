var assert = require('assert');
var read = require('../lib/read');
var path = require("path");
var Notes = require('../lib/Notes');

describe('Test Notes', function() {
  describe('Test Initialization Notes', function() {
    it('Should return information of directory', function(done) {
      var notes = new Notes(path.join(__dirname, 'files'));

      notes.init().then(() => {
        console.log(notes.getData());
        assert.equal(1, notes.getData().files);
        done();
      });
    });
  });
});