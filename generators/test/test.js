var path = require('path');
var helpers = require('yeoman-generator').test;


describe('WordPress generator', function() {

  var runGen;

  beforeEach(function() {
    console.log('before each');
    runGen = helpers
      .run(path.join(__dirname, '../app'))
      // .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('test1', function(done) {
    runGen.withOptions().on('end', function() {
      console.log('test1');
      done();
    });
  });
  
});
