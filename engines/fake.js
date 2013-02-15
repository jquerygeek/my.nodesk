// inspired heavily by this module
// https://github.com/yawnt/resourceful-rest

var resourceful = require('resourceful');
var formatters = require('./formatters/fake')
var Fake = module.exports = function Fake(config) {
  this.cache = new resourceful.Cache(); // not sure if we really need this
}

Fake.prototype.protocol = 'Fake';

Fake.prototype.request = function(err, data, cb) {
    process.nextTick(function() {
        cb(err, data)
    })
}

Fake.prototype.getFormatter = function(method, resource, list, opts) {
    var name = resource.toLowerCase()
    if (list) name += 's'
    var data = formatters[method][name] || {}
    return data;
}

Fake.prototype.save = function(id, doc, cb) {
  var formatter = this.getFormatter('post', doc.resource, false)
  var data = formatter.results(doc)
  var err = null
  if (!data) err = new Error('Invalid username and password') 
  this.request(err, data, cb)
}

// find with a basic resource and an optional query
Fake.prototype.find = function(opts, cb) {
  var formatter = this.getFormatter('get', opts.resource, !opts.id)
  var data = formatter.results()
  var err = null
  if (!data) err = new Error() 
  this.request(err, data, cb)
}

Fake.prototype.get = function(id, cb) {
  var split =  id.split('/');
  var formatter = this.getFormatter('get', split[0], false)
  var data = formatter.results(split[1])
  var err = null
  if (!data) err = new Error() 
  this.request(err, data, cb)
}

Fake.prototype.destroy = function(id, cb) {
  var split =  id.split('/');
  var formatter = this.getFormatter('delete', split[0], false)
  var data = formatter.results(split[1])
  var err = null
  if (!data) err = new Error() 
  this.request(err, data, cb)
}

// unused methods, required for interfacing with resourceful
;['sync', 'filter', 'create', 'post', 'update', 'load'].forEach(function(m) {
  Fake.prototype[m] = function() {
    throw new Error(m + ': not available yet');
  }
});
