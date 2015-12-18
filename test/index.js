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
    client.tagImagesFromUrls(url, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('docId')
      resp.should.have.property('tags').with.length.above(0)
      done()
    })
  });

  it('should tag an image from a url in another language', function(done) {
    var url = 'http://www.clarifai.com/img/metro-north.jpg'
    client.tagImagesFromUrls(url, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('docId')
      resp.should.have.property('tags').with.length.above(0)
      done()
    }, 'es')
  });

  it('should tag multiple images from a set of urls', function(done) {
    var urls = [
      'http://www.clarifai.com/img/metro-north.jpg',
      'http://www.clarifai.com/img/metro-north.jpg',
      'http://www.clarifai.com/img/metro-north.jpg'
    ]

    client.tagImagesFromUrls(urls, function(err, resp) {
      should.not.exist(err)
      resp.should.have.length(3)
      resp[0].should.have.property('docId')
      resp[0].should.have.property('tags').with.length.above(0)
      done()
    })
  });

});