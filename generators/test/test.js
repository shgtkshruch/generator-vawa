var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('WordPress generator', function() {


  describe('run test', function() {
    var themeName = 'my_wordpress_theme'
    var exp = new RegExp('SOURCE: \'' + themeName + '\'');
    var expectedContent = [
      ['gulpfile.coffee', exp]
    ];

    var expected = [
      'package.json',
      '.gitignore',
      'gulpfile.coffee'
    ];

    var runGen;

    beforeEach(function() {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it('creates expected files', function(done) {
      runGen.withOptions().withPrompt({themeName: themeName}).on('end', function() {
        assert.file(expected);
        assert.fileContent(expectedContent);
        done();
      });
    });

  });
  
});
