var should = require('chai').should();
var Thingiverse = require('../');
var thingiverse = new Thingiverse(process.env.TOKEN);

describe('Testing user endpoints…', function() {
  var user = 'MakerBot';
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
  //   thingiverse.METHOD(url, function(error, response) {
  //     if (error) throw error;
  //     done();
  //   });
  // });
});
