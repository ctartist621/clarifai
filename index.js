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
      cb(err, formatSingleResult(body))
    }
  });
}

function Clarifai (opts) {
  this.id = opts.id
  this.secret = opts.secret
}

module.exports = Clarifai