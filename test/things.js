var should = require('chai').should();
var thingiverse = require('./config');

describe('Testing thing endpoints…', function() {
  var thing = 259005; // 4-8-8-4 Big Boy Locomotive
  var url  = '/things/' + thing;

  it('GET ' + url, function(done) {
    thingiverse.get(url, function(error, response) {
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
      // if array isn't empty, test first object
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
