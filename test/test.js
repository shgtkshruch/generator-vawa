var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('vawa generator', function() {

  describe('run test', function() {
    var themeName = 'my_wordpress_theme';
    var vagrantBox = 'wordpress_box';

    var gulpExp = new RegExp('theme: \'' + themeName + '\'');
    var themeExp = new RegExp('Theme Name: ' + themeName);
    var vagrantExp = new RegExp('dev.vm.box = "' +  vagrantBox);

    var expectedContent = [
      ['gulpfile.js', gulpExp],
      ['src/styles/style.scss', themeExp],
      ['vagrant/Vagrantfile', vagrantExp]
    ];

    var expected = [
      'package.json',
      '.gitignore',
      'gulpfile.js'
    ];

    var ansible = [
      'ansible/roles/apache/handlers/main.yml',
      'ansible/roles/apache/tasks/main.yml',
      'ansible/roles/common/files/bash_profile',
      'ansible/roles/common/tasks/main.yml',
      'ansible/group_vars/all',
      'ansible/roles/ip/tasks/main.yml',
      'ansible/roles/mysql/files/my.cnf',
      'ansible/roles/mysql/tasks/main.yml',
      'ansible/roles/peco/files/config.json',
      'ansible/roles/peco/tasks/main.yml',
      'ansible/roles/php/tasks/main.yml',
      'ansible/roles/phpmyadmin/files/config.inc.php',
      'ansible/roles/phpmyadmin/tasks/main.yml',
      'ansible/playbook.yml',
      'ansible/roles/wordpress/tasks/main.yml',
      'ansible/roles/wordpress/templates/wp-config.php',
      'ansible/roles/wp-cli/tasks/main.yml',
      'ansible/roles/wp-cli/files/config.yml'
    ];

    var options = {
      'skip-install': true,
      'skip-install-message': true
    };

    var prompts = {
      themeName: themeName,
      vagrantBox: vagrantBox
    };

    before(function(done) {
      helpers.testDirectory(path.join(__dirname, '.tmp'), function () {
        this.vawa = helpers.createGenerator('vawa', ['../../app']);
        this.vawa.options = options;
        helpers.mockPrompt(this.vawa, prompts);
        done();
      }.bind(this));
    });

    it('creates expected files', function(done) {
      this.vawa.run({}, function() {
        assert.file([].concat(
          expected,
          'src/styles/style.scss',
          'vagrant/Vagrantfile',
          ansible
        ));
        assert.fileContent(expectedContent);
        done();
      });
    });
  });
});

