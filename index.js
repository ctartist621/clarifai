var _ = require('lodash')
var needle = require('needle')

var _array = function(str) {
  if (_.isArray(str)) {
    return str
  } else {
    return [str]
  }
}

var _encodeTagUrls = function (urls, lang) {
  var data = ''

  for (var url of _array(urls)) {
    data += encodeURI('url=' + url) + '&'
  }

  if (lang) {
    data += 'language=' + lang
  }

  return data
}

var _boundary = 'clarifai_multipart_boundary'

var _partForParameter = function(name, value) {
  var part = '--' + _boundary + '\r\nContent-Disposition: form-data; name="' + name + '"\r\n\r\n' + value + '\r\n'
  return new Buffer(part, 'utf8');
}

var _buildMultipart = function(buffers, lang) {
  // Build a multipart payload. We can't use needle's support for this because needle expects all
  // parts to have distinct names while Clarifai requires multiple parts to have the same name.
  var chunks = []

  for (var buffer of _array(buffers)) {
    var header = '--' + _boundary + '\r\n' +
      'Content-Disposition: form-data; name="encoded_data"; filename="data"\r\n' +
      'Content-Transfer-Encoding: binary\r\n' +
      'Content-Type: application/octet-stream\r\n\r\n'
    chunks.push(new Buffer(header, 'ascii'))
    chunks.push(buffer)
  }

  if (lang) {
    chunks.push(_partForParameter('language', lang))
  }

  chunks.push(new Buffer('--' + _boundary + '--\r\n', 'ascii'))

  return Buffer.concat(chunks)
}

var _parseErr = function(err, resp, body, cb) {
  if(err) {
    return cb(err)
  } else if((resp.statusCode !== 200 && resp.statusCode !== 201) || body.status_code === 'PARTIAL_ERROR') {
    return cb(body)
  } else {
    return cb(err, body)
  }
}

var _withAccessToken = function(_this, options) {
  return _.merge(options, { headers: { 'Authorization': _this.tokenType + ' ' + _this.accessToken }});
}

var _request = function(verb, type, data, options, _this, cb) {
  var url = 'https://api.clarifai.com'

  switch(type) {
    case 'feedback':
      url += '/v1/feedback/'
      break
    case 'info':
      url += '/v1/info/'
      break
    case 'tag':
      url += '/v1/tag/'
      break
    case 'token':
      url += '/v1/token/'
      break
    default:
      throw err('Request Type not defined')
  }

  needle.request(verb, url, data, _withAccessToken(_this, options), function(err, resp, body) {
    if (body.status_code === 'TOKEN_INVALID' || body.status_code === 'TOKEN_NONE') {
      _this.getAccessToken(function(err) {
        if(err) {
          return cb(err)
        } else {
          needle.request(verb, url, data, _withAccessToken(_this, options), function(err, resp, body) {
            _parseErr(err, resp, body, cb)
          })
        }
      })
    } else {
      _parseErr(err, resp, body, cb)
    }
  })
}

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

Clarifai.prototype.getAccessToken = function(cb) {
  var _this = this
  var data = {
    grant_type: 'client_credentials',
    client_id: this.id,
    client_secret: this.secret
  }

  _request('post', 'token', data, null, this, function(err, body) {
    _this.accessToken = body.access_token
    _this.expiresIn = body.expires_in
    _this.scope = body.scope
    _this.tokenType = body.token_type
    cb(err, _this.accessToken)
  })
}

Clarifai.prototype.addTags = function(docIds, tags, cb) {
  var data = ''
  data +='docids=' + _array(docIds).join(',')
  data +='&add_tags=' + _array(tags).join(',')

  _request('post', 'feedback', data, this.options, this, cb)
}

Clarifai.prototype.removeTags = function(docIds, tags, cb) {
  var data = ''
  data +='docids=' + _array(docIds).join(',')
  data +='&remove_tags=' + _array(tags).join(',')

  _request('post', 'feedback', data, this.options, this, cb)
}

Clarifai.prototype.addSimilarDocIds = function(docIds, otherIds, cb) {
  var data = ''
  data +='docids=' + _array(docIds).join(',')
  data +='&similar_docids=' + _array(otherIds).join(',')

  _request('post', 'feedback', data, this.options, this, cb)
}

Clarifai.prototype.addDissimilarDocIds = function(docIds, otherIds, cb) {
  var data = ''
  data +='docids=' + _array(docIds).join(',')
  data +='&dissimilar_docids=' + _array(otherIds).join(',')

  _request('post', 'feedback', data, this.options, this, cb)
}

Clarifai.prototype.associateSearchTerms = function(docIds, terms, cb) {
  var data = ''
  data +='docids=' + _array(docIds).join(',')
  data +='&search_click=' + _array(terms).join(',')

  _request('post', 'feedback', data, this.options, this, cb)
}

Clarifai.prototype.getAPIDetails = function(cb) {
  _request('get', 'info', null, this.options, this, function(err, body) {
    cb(err, body.results)
  })
}

Clarifai.prototype.tagFromUrls = function(type, urls, cb, lang) {
  var data = _encodeTagUrls(urls, lang)

  _request('post', 'tag', data, this.options, this, function(err, body) {
    if(err) {
      return cb(err)
    } else if (type === 'image') {
      return cb(err, formatImageResults(body))
    } else{
      return cb(err, formatVideoResults(body))
    }
  })
}

Clarifai.prototype.tagFromBuffers = function(type, buffers, cb, lang) {
  var data = _buildMultipart(buffers, lang)

  var options = _.cloneDeep(this.options || {})
  options.headers = options.headers || {}
  options.headers['Content-Type'] = 'multipart/form-data; boundary=' + _boundary
  options.headers['Content-Length'] = data.length

  _request('post', 'tag', data, options, this, function(err, body) {
    if (err) {
      return cb(err)
    } else if (type === 'image') {
      return cb(err, formatImageResults(body))
    } else {
      return cb(err, formatVideoResults(body))
    }
  })
}

function Clarifai (opts) {
  opts = opts || {
    id: process.env.CLARIFAI_ID,
    secret: process.env.CLARIFAI_SECRET
  }

  this.id = opts.id
  this.secret = opts.secret
  this.options = {}
}

module.exports = Clarifai