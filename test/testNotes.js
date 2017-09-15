var assert = require('assert');
var read = require('../lib/read');
var path = require("path");
var Notes = require('../lib/Notes');

var notes = new Notes(path.join(__dirname, 'files'));

describe('Test Notes', function() {
  it('Should return information of directory', function(done) {
    notes.init().then(() => {
      assert.equal('test.md', notes.getData().files['test.md'].basename);
      assert.equal('Test', notes.getData().files['test.md'].title);
      assert.equal(3, notes.getData().files['test.md'].tags.length);

      assert.equal(3, notes.getTags('').length);
      done();
    });
  });

  it('Should return the categories', function() {
    var categories = notes.getCategories('');

    assert.equal(2, categories.length);

    assert.equal('Category with special Title', categories[0].title);
    assert.equal('sub', categories[1].title);
  });

  it('Should return an empty list', function() {
    var categories = notes.getCategories('sub');
    assert.equal(0, categories.length);
  });

});