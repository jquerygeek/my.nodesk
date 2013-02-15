// inspired heavily by this module
// https://github.com/yawnt/resourceful-rest

var resourceful = require('resourceful');
var formatters = require('./formatters/webapi')
var WebAPI = module.exports = function WebAPI(config) {
  if(!config || !config.uri) {
    throw new Error('Uri is required');
  }
  this.uri = config.uri.replace(/\/$/, '');
  this.connection = require('request');
  this.cache = new resourceful.Cache(); // not sure if we really need this
}

WebAPI.prototype.protocol = 'WebAPI';

WebAPI.prototype.request = function(method, url, body, cb) {
  var opts = {url: this.uri + url, json: true, body: body}; // force JSON
  console.time(url)
  return this.connection[method].call(null, method, opts, function(err, res, body) {
     console.timeEnd(url)
     if (method === 'get' && res.statusCode !== 200) err = new Error(body)
     if (method === 'post' && res.statusCode !== 201) err = new Error(body)
     if (method === 'put' && res.statusCode !== 200) err = new Error(body)
     if (err) err.status = res.statusCode
     cb(err, body)      
  });
}

WebAPI.prototype.getFormatter = function(method, resource, list, opts) {
    var name = resource.toLowerCase()
    if (list) name += 's'
    var data = formatters[method][name] || {}
    return data;
}

WebAPI.prototype.save = function(id, doc, cb) {
  var formatter = this.getFormatter('post', doc.resource, false)
  this.request('post', formatter.url(doc), doc, function(err, data) {
    cb(err, data);
  });
}

// find with a basic resource and an optional query
WebAPI.prototype.find = function(opts, cb) {
  var formatter = this.getFormatter('get', opts.resource, !opts.id)
  this.request('get', formatter.url(opts), null, function(err, data) {
    if (!err) data = formatter.results(data)
    cb(err, data);
  });
}

// unused methods, required for interfacing with resourceful
;['sync', 'get', 'filter', 'destroy', 'create', 'post', 'update', 'load'].forEach(function(m) {
  WebAPI.prototype[m] = function() {
    throw new Error(m + ': not available yet');
  }
});
