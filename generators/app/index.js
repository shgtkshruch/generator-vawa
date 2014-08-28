var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var vagrantBoxes;

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option('coffee');
  },

  getVagrantBoxes: function() {
    var done = this.async();
    exec("vagrant box list | awk '{print $1}'", function(error, stdout, stderr) {
      vagrantBoxes = stdout;
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      done();
    });
  },

  askFor: function() {
    var done = this.async();
    var boxChoices = [];

    vagrantBoxes.split(/\n/).forEach(function(element, index, array) {
      if (element !== '') {
        boxChoices.push({name: element});
      }
    });

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
    this.template('style.scss', 'src/styles/style.scss');
  },

  vagrant: function() {
    this.template('Vagrantfile', 'vagrant/Vagrantfile');
  },

  end: function() {
    if (!this.options['skip-vagrant']) {
      this.spawnCommand('echo', ['vagrant up']);
    }
  }

});
