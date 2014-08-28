var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('WordPress generator', function() {

  describe('run test', function() {
    var themeName = 'my_wordpress_theme'

    var gulpExp = new RegExp('SOURCE: \'' + themeName + '\'');
    var themeExp = new RegExp('Theme Name: ' + themeName);

    var expectedContent = [
      ['gulpfile.coffee', gulpExp],
      [themeName + '/styles/style.scss', themeExp]
    ];

    var expected = [
      'package.json',
      '.gitignore',
      'gulpfile.coffee'
    ];

  
    var options = {
      'skip-vagrant': true
    };

    var runGen;

    beforeEach(function() {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it('creates expected files', function(done) {
      runGen.withOptions(options).withPrompt({themeName: themeName}).on('end', function() {
        assert.file([].concat(
          expected,
          themeName + '/styles/style.scss' 
        ));
        assert.fileContent(expectedContent);
        done();
      });
    });

  });
});
