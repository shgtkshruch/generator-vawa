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
      'skip-install': true,
      'skip-install-message': true,
      'skip-vagrant': true,
      'skip-bundle': true
    };

    var prompts = {
      themeName: themeName,
      vagrantBox: vagrantBox
    };

    before(function(done) {
      helpers.testDirectory(path.join(__dirname, '.tmp'), function () {
        this.Gen = helpers.createGenerator('wordpress-vagrant-ansible-aws', ['../../app']);
        this.Gen.options = options;
        helpers.mockPrompt(this.Gen, prompts);
        done();
      }.bind(this));
    });

    it('creates expected files', function(done) {
      this.Gen.run({}, function() {
        assert.file([].concat(
          expected,
          'src/styles/style.scss',
          'Gemfile',
          'vagrant/Vagrantfile'
        ));
        assert.fileContent(expectedContent);
        done();
      });
    });
  });
});
