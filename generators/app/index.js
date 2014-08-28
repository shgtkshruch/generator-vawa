var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option('coffee');
  },

  askFor: function() {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'themeName',
      message: 'What yout theme name?',
      value: 'themeName'
    }] 

    this.prompt(prompts, function(answers) {
      this.themeName = answers.themeName;

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

  end: function() {
    if (!this.options['skip-vagrant']) {
      this.spawnCommand('echo', ['vagrant up']);
    }
  }

});
