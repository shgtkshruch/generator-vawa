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
    if (!this.options['skip-vagrant']) {
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
    this.template('gulpfile.coffee', 'gulpfile.coffee');
  },

  app: function() {
    this.mkdir(this.themeName);
    this.template('style.scss', 'src/styles/style.scss');
    this.copy('Gemfile', 'Gemfile');
  },

  vagrant: function() {
    this.template('Vagrantfile', 'vagrant/Vagrantfile');
  },

  ansible: function () {
    var files = fs.readdirSync(this.sourceRoot() + '/ansible');

    each(files, function (file, i, next) {
      var dest = file.replace(/__/g, '/');

      if (!/group_vars|playbook/.test(dest)) {
        dest = 'roles/' + dest;
      }

      this.bulkCopy('ansible/' + file, 'ansible/' + dest);
      next();
    }.bind(this), function (err) {
      if (err) throw err;
    });
  },

  install: function() {
    if (!this.options['skip-install']) {
      this.installDependencies({
        skipInstall: this.options['skip-install'],
        skipMessage: this.options['skip-install-message']
      });
    }
  },

  end: function() {
    if (!this.options['skip-bundle']) {
      this.spawnCommand('bundle', ['install', '--path', 'vendor/bundle']);
    }
    if (!this.options['skip-vagrant']) {
      this.spawnCommand('vagrant', ['up', 'pro', '--provider=aws'], {cwd: this.destinationRoot() + '/vagrant'});
    }
  }

});

