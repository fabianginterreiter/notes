var assert = require('assert');
var read = require('../lib/read');
var path = require("path");

describe('Test Read File Information', function() {
  describe('Test Getting file info', function() {
    it('Should return information of file', function(done) {
      var file = path.join(__dirname, 'files', 'test.md');
      read(file).then((result) => {
        assert.equal(file, result.file);
        //assert.equal('test.md', result.basename);
        //assert.equal('Test', result.title);

        done();
      });
    });
  });
});