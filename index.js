var _ = require('lodash')
var needle = require('needle')

var formatImageResults = function(body) {
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
      docIdStr: result.docid_str,
      tags: tags
    }
    return ret
  })

  if (results.length < 2) {
    results = _.first(results)
  }
  return results
}

var formatVideoResults = function(body) {
  var results = body.results
  results = _.map(results, function(result) {
    var tagResults = _.zip(result.result.tag.timestamps, result.result.tag.classes, result.result.tag.concept_ids, result.result.tag.probs)
    var timestamps = _.map(tagResults, function(tag) {
      var timeStampResults = _.zip(tag[1], tag[2], tag[3])
      return {
        timestamp: tag[0],
        tags: _.map(timeStampResults, function(tsResult) {
          return {
            class: tsResult[0],
            conceptId: tsResult[1],
            probability: tsResult[2]
          }
        })
      }
    })
    var ret = {
      docId: result.docid,
      docIdStr: result.docid_str,
      timestamps: timestamps
    }
    return ret
  })

  if (results.length < 2) {
    results = _.first(results)
  }
  return results
}

Clarifai.prototype.headers = function() {
  return { 'Authorization': this.tokenType + ' ' + this.accessToken }
}

Clarifai.prototype.getAccessToken = function(cb) {
  var _this = this
  needle.post('https://api.clarifai.com/v1/token/', {
    grant_type: 'client_credentials',
    client_id: this.id,
    client_secret: this.secret
  }, function(err, resp, body) {
    _this.accessToken = body.access_token
    _this.expiresIn = body.expires_in
    _this.scope = body.scope
    _this.tokenType = body.token_type
    _this.options = { headers: _this.headers() }
    cb(err, body)
  })
}

Clarifai.prototype.addTags = function(docIds, tags, cb) {
  var data = ""
  data +="docids=" + docIds.join(',')
  data +="&add_tags=" + tags.join(',')

  var _this = this
  needle.post('https://api.clarifai.com/v1/feedback/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, body)
    }
  });
}

Clarifai.prototype.removeTags = function(docIds, tags, cb) {
  var data = ""
  data +="docids=" + docIds.join(',')
  data +="&remove_tags=" + tags.join(',')

  var _this = this
  needle.post('https://api.clarifai.com/v1/feedback/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, body)
    }
  });
}

Clarifai.prototype.addSimilarDocIds = function(docIds, otherIds, cb) {
  var data = ""
  data +="docids=" + docIds.join(',')
  data +="&similar_docids=" + otherIds.join(',')

  var _this = this
  needle.post('https://api.clarifai.com/v1/feedback/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, body)
    }
  });
}

Clarifai.prototype.addDissimilarDocIds = function(docIds, otherIds, cb) {
  var data = ""
  data +="docids=" + docIds.join(',')
  data +="&dissimilar_docids=" + otherIds.join(',')

  var _this = this
  needle.post('https://api.clarifai.com/v1/feedback/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, body)
    }
  });
}

Clarifai.prototype.associateSearchTerms = function(docIds, terms, cb) {
  var data = ""
  data +="docids=" + docIds.join(',')
  data +="&search_click=" + terms.join(',')

  var _this = this
  needle.post('https://api.clarifai.com/v1/feedback/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, body)
    }
  });
}

Clarifai.prototype.getAPIDetails = function(cb) {
  var _this = this
  needle.get('https://api.clarifai.com/v1/info/', this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImageFromUrl(url, cb)
      })
    } else {
      cb(err, body.results)
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

  var _this = this
  needle.post('https://api.clarifai.com/v1/tag/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagImagesFromUrls(urls, cb, lang)
      })
    } else {
      cb(err, formatImageResults(body))
    }
  });
}

Clarifai.prototype.tagVideosFromUrls = function(urls, cb, lang) {
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

  var _this = this
  needle.post('https://api.clarifai.com/v1/tag/', data, this.options, function(err, resp, body) {
    if (body.status_code == 'TOKEN_INVALID' || body.status_code == 'TOKEN_NONE') {
      _this.getAccessToken(function(err, resp) {
        _this.tagVideosFromUrls(urls, cb, lang)
      })
    } else {
      cb(err, formatVideoResults(body))
    }
  });
}

function Clarifai (opts) {
  this.id = opts.id
  this.secret = opts.secret
}

module.exports = Clarifai