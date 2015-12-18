var should = require('chai').should(),
    Clarifai = require('../index'),
    client = new Clarifai(require('../testCreds.json'))

describe('#Authentication', function() {
  it('should authenticate and save an access token', function(done) {
    client.getAccessToken(function(err, resp) {
      should.not.exist(err)
      resp.access_token.should.be.a('string')
      done()
    })
  })
})