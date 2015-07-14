var should = require('chai').should();
var thingiverse = require('./config');

describe('Testing user endpoints…', function() {
  var user = 'tvapi';
  var url  = '/users/' + user;

  it('GET ' + url, function(done) {
    thingiverse.get(url, function(error, response) {
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
      // if array isn't empty, test first object
      if (response.length) {
        response[0].should.be.an('object');
        response[0].should.have.property('id');
        response[0].should.have.property('name');
      }
      done();
    });
  });

  it('PATCH ' + url, function(done) {
    var name = 'TV' + Date.now();
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
  
  after(function(done) {
    // reset firstname
    thingiverse.patch(url, {
      first_name: 'Thingiverse'
    }, function(error, response) {
      if (error) throw error;
      done();
    });
  });
});
