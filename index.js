var _ = require('lodash')
var needle = require('needle')

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

function Clarifai (opts) {
  this.id = opts.id
  this.secret = opts.secret
}

module.exports = Clarifai