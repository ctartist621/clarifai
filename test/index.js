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

describe('#Tagging', function() {
  it('should tag an image from a url', function(done) {
    var url = 'http://www.clarifai.com/img/metro-north.jpg'
    client.tagImageFromUrl(url, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('docId')
      resp.should.have.property('tags').with.length.above(0)
      done()
    })
  });
});