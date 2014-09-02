var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var fs = require('fs');
var boxChoices = [];

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
  },

  getVagrantBoxes: function() {
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

  ansible: function() {
    console.log('ansible');
    var _this = this;

    // get file list from ansible dir in sourceroot
    fs.readdir(this.sourceRoot() + '/ansible', function(err, files) {
      files.filter(function(file) {

        // remove dotfiles
        return file[0] !== '.'
      }).forEach(function(file) {

        // reame file ex. common__tasks__main.yml => common/tasks/main.yml
        dest = file.replace(/__/g, "/");

        // extract all in group_vars direcotry and playbook.yml
        if (dest.indexOf("group_vars") === -1 && dest.indexOf("playbook") === -1) {

         // add 'roles/' all files
         dest = 'roles/' + dest;
        }

        // copy all ansible files with directory
        _this.template('ansible/' + file, 'ansible/' + dest);
      });
    });
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
