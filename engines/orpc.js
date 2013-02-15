var resourceful = require('resourceful')
var formatters = require('./formatters/orpc')
var Rpc = require('../lib/rpc')
var rpc = new Rpc()
var ORPC = module.exports = function() {
  this.connection = rpc
  this.cache = new resourceful.Cache() // not sure if we really need this
}

function getKey(method, modelName, list) {
    var keys = formatters[method.toLowerCase()]
    if (!keys) throw new Error('Invalid Method Name: ' + method)
    var resource = modelName.toLowerCase()
    if (list) resource += 's'
    var key = keys[resource]
    if (!key) throw new Error('Invalid Model Name: ' + modelName)
    key.formatter = key.formatter || function() { return Array.prototype.slice.call(arguments) }
    key.mapper = key.mapper || function(val) { return val; }
    return key
}

function getResource(id) {
    var parts = id.split('/')
    return {
        modelName: parts[0],
        id: parts[1]
    }
}

ORPC.prototype.protocol = 'ORPC'

// key is the oRPC key
// data is an array of data
// cb is obvious
ORPC.prototype.request = function(key, args, cb) {
        
    // data is optionally a string
    if (!Array.isArray(args)) args = [args]    
    args.unshift(key);

    // timer hacks
    console.time(key)

    // would normally be data.push(cb)
    args.push(function(err, data) {
      console.timeEnd(key)
      cb(err, data)
    })
    
    return this.connection.makeCall.apply(this.connection, args)
}

ORPC.prototype.get = function(id, cb) {
  var resource = getResource(id)
  var key = getKey('get', resource.modelName)
  this.request(key.key, key.formatter(resource.id), function(err, data) {
    if (data) data = key.mapper(data)
    cb(err, data)
  })
}

ORPC.prototype.save = function(id, doc, cb) {
    var resource = getResource(id)
    var key = getKey('post', resource.modelName)
    this.request(key.key, key.formatter(doc), function(err, data) {
        if (data) data = key.mapper(data)
        cb(err, data || doc)
    })
}
    
ORPC.prototype.destroy = function(id, cb) {
    var resource = getResource(id)
    var key = getKey('delete', resource.modelName)
    this.request(key.key, resource.id, function(err, data) {
        if (data) data = key.mapper(data)
        cb(err, data)
    })
}

// find with a basic resource and an optional query
ORPC.prototype.find = function(opts, cb) {
  var key = getKey('get', opts.resource, !opts.id)
  this.request(key.key, key.formatter(opts), function(err, data) {
    if (data) data = key.mapper(data)
    cb(err, data)
  })
}

ORPC.prototype.update = function(opts, cb) {
  console.log('updating')
  var key = getKey('put', opts.resource, !opts.id)
  this.request(key.key, key.formatter(opts), function(err, data) {
    if (data) data = key.mapper(data)
    cb(err, data)
  })
}

// unused methods, required for interfacing with resourceful
;['sync', 'filter', 'load'].forEach(function(m) {
  ORPC.prototype[m] = function() {
    throw new Error(m + ': not available yet')
  }
})