var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var fs = require('fs');
var each = require('each-async');
var boxChoices = [];

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
  },

  getVagrantBoxes: function() {
    if (!this.options['skip-install']) {
      var done = this.async();
      exec("vagrant box list | awk '{print $1}'", function(error, stdout, stderr) {
        stdout.split(/\n/).forEach(function(element, index, array) {
          if (element !== '') {
            boxChoices.push({name: element});
          }
        });
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        done();
      });
    }
  },

  askFor: function() {
    var done = this.async();
    var prompts = [{
      type: 'input',
      name: 'themeName',
      message: 'What yout theme name?',
      value: 'themeName'
    }, {
      type: 'list',
      name: 'vagrantBox',
      message: 'Which vagrant box do you use?',
      choices: boxChoices
    }];

    this.prompt(prompts, function(answers) {
      this.themeName = answers.themeName;
      this.vagrantBox = answers.vagrantBox;
      done();
    }.bind(this));
  },

  packageJSON: function() {
    this.copy('_package.json', 'package.json');
  },

  git: function() {
    this.copy('gitignore', '.gitignore');
  },

  gulp: function() {
    this.template('gulpfile.js', 'gulpfile.js');
  },

  app: function() {
    this.mkdir(this.themeName);
    this.template('style.scss', 'src/styles/style.scss');
  },

  vagrant: function() {
    this.template('Vagrantfile', 'vagrant/Vagrantfile');
  },

  ansible: function() {
    this.bulkDirectory('ansible', 'ansible');
  },

  install: function() {
    if (!this.options['skip-install']) {
      this.installDependencies({
        bower: false,
        npm: true,
        skipInstall: this.options['skip-install'],
        skipMessage: this.options['skip-install-message']
      });
    }
  }
});

