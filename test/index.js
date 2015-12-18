var should = require('chai').should(),
    Clarifai = require('../index'),
    client

if (process.env.CIRCLECI) {
  client = new Clarifai({
    id: process.env.CLARIFAI_ID,
    secret: process.env.CLARIFAI_SECRET,
  })
} else {
  client = new Clarifai(require('../testCreds.json'))
}

describe('#Authentication', function() {
  it('should authenticate and save an access token', function(done) {
    client.getAccessToken(function(err, resp) {
      should.not.exist(err)
      client.accessToken.should.be.a('string')
      resp.should.be.a('string')
      done()
    })
  })
})

describe('#Tagging', function() {
  describe('#Images', function() {
    it('should tag an image from a url', function(done) {
      var url = 'http://www.clarifai.com/img/metro-north.jpg'
      client.tagImagesFromUrls(url, function(err, resp) {
        should.not.exist(err)
        resp.should.have.property('docId')
        resp.should.have.property('docIdStr')
        resp.should.have.property('tags').with.length.above(0)
        resp.tags[0].should.have.property('class')
        resp.tags[0].should.have.property('conceptId')
        resp.tags[0].should.have.property('probability')
        done()
      })
    });

    it('should tag an image from a url in another language', function(done) {
      var url = 'http://www.clarifai.com/img/metro-north.jpg'
      client.tagImagesFromUrls(url, function(err, resp) {
        should.not.exist(err)
        resp.should.have.property('docId')
        resp.should.have.property('docIdStr')
        resp.should.have.property('tags').with.length.above(0)
        resp.tags[0].should.have.property('class')
        resp.tags[0].should.have.property('conceptId')
        resp.tags[0].should.have.property('probability')
        done()
      }, 'es')
    });

    it('should tag multiple images from a set of urls', function(done) {
      var urls = [
        'http://www.clarifai.com/img/metro-north.jpg',
        'http://www.clarifai.com/img/metro-north.jpg',
      ]

      client.tagImagesFromUrls(urls, function(err, resp) {
        should.not.exist(err)
        resp.should.have.length(3)
        resp[0].should.have.property('docId')
        resp[0].should.have.property('docIdStr')
        resp[0].should.have.property('tags').with.length.above(0)
        resp[0].tags[0].should.have.property('class')
        resp[0].tags[0].should.have.property('conceptId')
        resp[0].tags[0].should.have.property('probability')
        done()
      })
    });
  });

  describe.skip('#Videos', function() {
    it('should tag a video from a url', function(done) {
      this.timeout(20000);
      var url = 'https://archive.org/download/test-mpeg/test-mpeg.mpg'
      client.tagVideosFromUrls(url, function(err, resp) {
        should.not.exist(err)
        resp.should.have.property('docId')
        resp.should.have.property('docIdStr')
        resp.should.have.property('timestamps').with.length.above(0)
        resp.timestamps[0].should.have.property('timestamp')
        resp.timestamps[0].should.have.property('tags').with.length.above(0)
        resp.timestamps[0].tags[0].should.have.property('class')
        resp.timestamps[0].tags[0].should.have.property('conceptId')
        resp.timestamps[0].tags[0].should.have.property('probability')
        done()
      })
    });

    it('should tag an video from a url in another language', function(done) {
      var url = 'https://archive.org/download/test-mpeg/test-mpeg.mpg'
      this.timeout(20000);
      client.tagVideosFromUrls(url, function(err, resp) {
        should.not.exist(err)
        resp.should.have.property('docId')
        resp.should.have.property('docIdStr')
        resp.should.have.property('timestamps').with.length.above(0)
        resp.timestamps[0].should.have.property('timestamp')
        resp.timestamps[0].should.have.property('tags').with.length.above(0)
        resp.timestamps[0].tags[0].should.have.property('class')
        resp.timestamps[0].tags[0].should.have.property('conceptId')
        resp.timestamps[0].tags[0].should.have.property('probability')
        done()
      }, 'es')
    });

    it('should tag multiple videos from a set of urls', function(done) {
      this.timeout(60000);
      var urls = [
        'https://archive.org/download/test-mpeg/test-mpeg.mpg',
        'https://archive.org/download/test-mpeg/test-mpeg.mpg',
      ]
      client.tagVideosFromUrls(urls, function(err, resp) {
        should.not.exist(err)
        resp.should.have.length(3)
        resp[0].should.have.property('docId')
        resp[0].should.have.property('docIdStr')
        resp[0].should.have.property('timestamps').with.length.above(0)
        resp[0].timestamps[0].should.have.property('timestamp')
        resp[0].timestamps[0].should.have.property('tags').with.length.above(0)
        resp[0].timestamps[0].tags[0].should.have.property('class')
        resp[0].timestamps[0].tags[0].should.have.property('conceptId')
        resp[0].timestamps[0].tags[0].should.have.property('probability')
        done()
      })
    });
  });
});

describe('#Information', function() {
  it('should get current API Details', function(done) {
    client.getAPIDetails(function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('max_image_size')
      resp.should.have.property('default_language')
      resp.should.have.property('max_video_size')
      resp.should.have.property('max_image_bytes')
      resp.should.have.property('min_image_size')
      resp.should.have.property('default_model')
      resp.should.have.property('max_video_bytes')
      resp.should.have.property('max_video_duration')
      resp.should.have.property('max_batch_size')
      resp.should.have.property('max_video_batch_size')
      resp.should.have.property('min_video_size')
      resp.should.have.property('api_version')
      done()
    })
  });
});

describe('#Feedback', function() {
  it('should add tags or give positive feedback for tags to a docid', function(done) {
    var docIds = ['78c742b9dee940c8cf2a06f860025141']
    var tags = ['car','dashboard','driving']
    client.addTags(docIds, tags, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('status_code').with.string('OK')
      resp.should.have.property('status_msg')
      done()
    })
  });

  it('should remove tags or give negative feedback for tags to a docid', function(done) {
    var docIds = ['78c742b9dee940c8cf2a06f860025141']
    var tags = ['sky','clean','red']
    client.removeTags(docIds, tags, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('status_code').with.string('OK')
      resp.should.have.property('status_msg')
      done()
    })
  });

  it('should add similar docids for a given docid', function(done) {
    var docIds = ['78c742b9dee940c8cf2a06f860025141']
    var similarIds = ['fc957ec10abcc0f4507475827626200a']
    client.addSimilarDocIds(docIds, similarIds, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('status_code').with.string('OK')
      resp.should.have.property('status_msg')
      done()
    })
  });

  it('should add dissimilar docids for a given docid', function(done) {
    var docIds = ['78c742b9dee940c8cf2a06f860025141']
    var dissimilarIds = ['acd57ec10abcc0f4507475827626785f']
    client.addDissimilarDocIds(docIds, dissimilarIds, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('status_code').with.string('OK')
      resp.should.have.property('status_msg')
      done()
    })
  });

  it('should associate search tags for which the input docids were clicked', function(done) {
    var docIds = ['78c742b9dee940c8cf2a06f860025141']
    var terms = ['cat']
    client.associateSearchTerms(docIds, terms, function(err, resp) {
      should.not.exist(err)
      resp.should.have.property('status_code').with.string('OK')
      resp.should.have.property('status_msg')
      done()
    })
  });
});