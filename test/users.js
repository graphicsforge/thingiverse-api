// allow pretty colors in the console
var colors = require('colors');
// tell chai we want to use the BDD (should) syntax http://chaijs.com/api/bdd/
var should = require('chai').should();
// load the thingiverse instance from config.js
var thingiverse = require('./config');

// for the describe() and it() syntax docs, see http://mochajs.org/#getting-started
describe('Testing ' + 'user'.cyan + ' endpoints…', function() {
  var user = 'tvapi'; // user setup for testing
  var url  = '/users/' + user;

  it('GET ' + url, function(done) {
    thingiverse.get(url, function(error, response) {
      // if error object is not null, throw an error (will fail the test)
      if (error) throw error;
      // ensure response object has a property "name" that equals the variable user
      response.should.have.property('name', user);
      // b/c the operation is async, let mocha know we're done
      done();
    });
  });

  it('GET ' + url + '/things', function(done) {
    thingiverse.get(url + '/things', function(error, response) {
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

  it('PATCH ' + url, function(done) {
    var name = 'TV' + Date.now(); // set the new first name to something unique
    thingiverse.patch(url, {
      first_name: name
    }, function(error, response) {
      if (error) throw error;
      // ensure response object has a property "first_name" that equals the variable name
      response.should.have.property('first_name', name);
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
  
  // when all the tests are finished, the after() function will be called
  // we're going to use this opportunity to reset the first name (as we changed it above)
  after(function(done) {
    // reset firstname to default
    thingiverse.patch(url, {
      first_name: 'Thingiverse'
    }, function(error, response) {
      if (error) throw error;
      done();
    });
  });
});
