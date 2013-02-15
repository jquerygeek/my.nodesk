var php = require('./php')
var request = require('request')
var util = require('util')
var baseUrl = process.env.ORPC || 'http://dev08.odesk.com:26680/orpc/'

var Rpc = module.exports = function(ctx) {
    this._ctx = ctx
}

// key, arg1, arg2, arg3, .., cb
Rpc.prototype.makeCall = function(key) {    
    
    // split the 3 parts of the call
    var data = Array.prototype.slice.call(arguments, 1)
    var cb = data.pop()
    var self
    var context = this._ctx

    // populate the full data array
    data.unshift(context)
    data.unshift(key)
    data.unshift(self)

    this._call(null, key, null, data, cb)
}

// closely modeled after php version
Rpc.prototype._call = function(self, key, method, data, cb) {
  var url = baseUrl + key
  var serial = php.serialize(data)
  // console.log('URL: ' + url)
  // console.log(new Array(99).join('-') + '\n')
  // console.log('Post Data:\n', util.inspect(data))
  // console.log(new Array(99).join('-') + '\n')
  // console.log('Serialized Data:\n', serial)
  // console.log(new Array(99).join('-') + '\n')
  // console.log('JSON Data:\n', JSON.stringify(data))
  // console.log(new Array(99).join('-') + '\n')
  // console.log('curl -X POST ' + url + ' -d \'' + serial + '\'')
  // console.log(new Array(99).join('-') + '\n')
  request.post({url: url, body: serial}, function(err, res, body) {
    if (err) return cb(err)
    var data, deserialized
    // console.log('Status Code: ' + res.statusCode)
    // console.log('Headers:')
    // for (var key in res.headers) {
    //    console.log(' ' + key + ': ' + res.headers[key])
    // }
    // console.log('Response:')
    // console.log(body)

    if (res.statusCode !== 200) {
        err = new Error('Invalid Response')
    } else {
        // trying to deserialize
        try {
            deserialized = php.unserialize(body)
            err = deserialized[0]
            if (err !== '0') err = new Error('Invalid Response')
            data = deserialized[1]
        } catch(e) {
            err = new Error(body)
            err.status = 400 // unknown error, 500 is a problem for resourceful
        }
    }

    if (typeof data === 'string') err = new Error(data)
    if (err === '0') err = null
    if (err) err.status = err.status || res.statusCode // orpc engine uses this
    cb(err, data)
  })
}