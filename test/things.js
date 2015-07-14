// allow pretty colors in the console
var colors = require('colors');
// tell chai we want to use the BDD (should) syntax http://chaijs.com/api/bdd/
var should = require('chai').should();
// load the thingiverse instance from config.js
var thingiverse = require('./config');

// for the describe() and it() syntax docs, see http://mochajs.org/#getting-started
describe('Testing ' + 'thing'.cyan + ' endpoints…', function() {
  var thing = 925620; // tvapi's first thing's id
  var url  = '/things/' + thing;

  it('GET ' + url, function(done) {
    thingiverse.get(url, function(error, response) {
      // if error object is not null, throw an error (will fail the test)
      if (error) throw error;
      // ensure response object has a property "id" that equals the variable thing
      response.should.have.property('id', thing);
      // b/c the operation is async, let mocha know we're done
      done();
    });
  });

  it('GET ' + url + '/images', function(done) {
    this.timeout(20000); // this endpoint is slow, so up the timeout time
    thingiverse.get(url + '/images', function(error, response) {
      if (error) throw error;
      response.should.be.an('array');
      // if array isn't empty, test first object in the array
      if (response.length) {
        response[0].should.be.an('object');
        response[0].should.have.property('id');
        response[0].should.have.property('name');
      }
      done();
    });
  });

  // Template
  // it('METHOD ' + url, function(done) {
  //   thingiverse.method(url, function(error, response) {
  //     if (error) throw error;
  //     done();
  //   });
  // });
});
