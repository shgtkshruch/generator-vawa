var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option('coffee');
  },

  packageJSON: function() {
    this.copy('_package.json', 'package.json');
  },

  git: function() {
    this.copy('gitignore', '.gitignore');
  }

});
