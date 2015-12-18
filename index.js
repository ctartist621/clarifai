var _ = require('lodash')
var needle = require('needle')

var formatSingleResult = function(body) {
  var result = _.first(body.results)
  var tagResults = _.zip(result.result.tag.classes, result.result.tag.concept_ids, result.result.tag.probs)
  var tags = _.map(tagResults, function(tag) {
    return {
      class: tag[0],
      conceptId: tag[1],
      probability: tag[2]
    }
  })
  var ret = {
    docId: result.docid,
    tags: tags
  }
  return ret
}

var formatResults = function(body) {
  var results = body.results
  results = _.map(results, function(result) {
    var tagResults = _.zip(result.result.tag.classes, result.result.tag.concept_ids, result.result.tag.probs)
    var tags = _.map(tagResults, function(tag) {
      return {
        class: tag[0],
        conceptId: tag[1],
        probability: tag[2]
      }
    })
    var ret = {
      docId: result.docid,
      tags: tags
    }
    return ret
  })

  if (results.length < 2) {
    results = _.first(results)
  }
  return results
}


Clarifai.prototype.getAccessToken = function(cb) {
  _this = this
  needle.post('https://api.clarifai.com/v1/token/', {
    grant_type: 'client_credentials',
    client_id: this.id,
    client_secret: this.secret
  }, function(err, resp, body) {
    _this.accessToken = body.access_token
    _this.expiresIn = body.expires_in
    _this.scope = body.scope
    _this.tokenType = body.token_type
    console.log("Access Token :: " + _this.accessToken)
    cb(err, body)
  });
}

Clarifai.prototype.tagImageFromUrl = function(url, cb) {
  var data = {
    url: url
  }

  var options = {
    headers: { 'Authorization': this.tokenType + ' ' + this.accessToken }
  }
  _this = this

  needle.request('get', 'https://api.clarifai.com/v1/tag/', data, options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, formatResults(body))
    }
  });
}

Clarifai.prototype.tagImagesFromUrls = function(urls, cb, lang) {
  var data = ""

  if (!_.isArray(urls)) {
    urls = [urls]
  }

  for (var url of urls) {
    data += encodeURI("url=" + url) + "&"
  }

  if (lang) {
    data += "language=" + lang
  }

  var options = {
    headers: { 'Authorization': this.tokenType + ' ' + this.accessToken },
  }
  _this = this

  needle.post('https://api.clarifai.com/v1/tag/', data, options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, formatResults(body))
    }
  });
}

function Clarifai (opts) {
  this.id = opts.id
  this.secret = opts.secret
}

module.exports = Clarifai