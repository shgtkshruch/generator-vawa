var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('WordPress generator', function() {

  describe('run test', function() {
    var themeName = 'my_wordpress_theme';
    var vagrantBox = 'wordpress_box';

    var gulpExp = new RegExp('theme: \'' + themeName + '\'');
    var themeExp = new RegExp('Theme Name: ' + themeName);
    var vagrantExp = new RegExp('dev.vm.box = "' +  vagrantBox);

    var expectedContent = [
      ['gulpfile.coffee', gulpExp],
      ['src/styles/style.scss', themeExp],
      ['vagrant/Vagrantfile', vagrantExp]
    ];

    var expected = [
      'package.json',
      '.gitignore',
      'gulpfile.coffee'
    ];
  
    var options = {
      'skip-vagrant': true
    };

    var my_prompts = {
      themeName: themeName,
      vagrantBox: vagrantBox
    }

    var runGen;

    beforeEach(function() {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it('creates expected files', function(done) {
      runGen.withOptions(options).withPrompt(my_prompts).on('end', function() {
        assert.file([].concat(
          expected,
          'src/styles/style.scss',
          'vagrant/Vagrantfile'
        ));
        assert.fileContent(expectedContent);
        done();
      });
    });

  });
});
