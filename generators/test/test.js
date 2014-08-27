var path = require('path');
var helpers = require('yeoman-generator').test;

describe('WordPress generator', function() {

  var runGen;

  beforeEach(function() {
    console.log('before each');
    runGen = helpers
      .run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  describe('run test', function() {
    var expectedContent = [
      ['gulpfile.coffee', /SOURCE: 'tmp'/]
    ];

    var expected = [
      'package.json',
      '.gitignore'
    ];

    it('creates expected files', function() {
      runGen.withOptions().on('end', function() {
        assert.file(expected);
      });
    });

  });
  
});
