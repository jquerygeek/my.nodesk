// inspired heavily by this module
// https://github.com/yawnt/resourceful-rest

var resourceful = require('resourceful');
var ODR = module.exports = function ODR(config) {
  if(!config || !config.uri) {
    throw new Error('Uri is required');
  }
  this.uri = config.uri.replace(/\/$/, '') + '/odr/';
  this.connection = require('request');
  this.cache = new resourceful.Cache(); // not sure if we really need this
}

// helpers
// presumably faster than doing them in two loops
function flattenAndConvert(docs, fn) {
    var k = [];
    for (var i in docs) {
        k.push(fn(docs[i]));
    }
    return k;
}

// mapping from ODR to our schema
function jobFromODR(doc) {
    var job = {
        id: doc.op_recno,
        clientId: doc.op_company_recno,
        description: doc.op_desc_digest,
        title: doc.op_title,
        total: parseInt(doc.op_tot_cand, 10) || 0, // or 0 to prevent null
        hires: parseInt(doc.op_tot_offers, 10) || 0, // or 0 to prevent null
        active: parseInt(doc.op_active_candidates, 10), // or 0 to prevent null
        created: new Date(doc.op_date_created).getTime(), // may need better checking?
        inviteOnly: doc.op_is_console_viewable === '1'
    };
    return job;
}

function contractorFromODR(doc) {
    var contractor = {
        name: doc.dev_full_name,
        description: doc.dev_blurb,
        thumbnail: doc.dev_portrait_100,
        skills: doc.skills.map(function(skill) { return skill.name;}),
        isPublic: doc.dev_profile_access
    }
    return contractor;
}

function getResource(res) {
    return ODR.RESOURCE_MAP[res.toLowerCase()]    
}

function getMapper(res) {
    return ODR.MODEL_MAP[res.toLowerCase()];
}

ODR.RESOURCE_MAP = {
    'job': 'opening',
    'contractor': 'profile',
}

ODR.MODEL_MAP = {
    'job':     jobFromODR,
    'contractor': contractorFromODR
}

ODR.prototype.protocol = 'ODR';

ODR.prototype.request = function(method) {
  var args = Array.prototype.slice.call(arguments, 1);
  var url  = args[0];
  var cb = args[1];
  console.time(url); // added a timer
  args[0] = {url: url, json: true}; // force JSON
  args[2] = function(err, res, body) { // hack for the timer
      console.timeEnd(url)
      cb(err, res, body);
  }
  return this.connection[method].apply(null, args);
}

ODR.prototype.get = function(id, cb) {  
  var parts = id.split("/");
  var resource = getResource(parts[0]);
  id = parts[1];
  var url  = this.uri + '/' + resource + '/f/' + id + '.json';
  this.request('get', url, function(err, res, body) {
    if (err) {
      err.status = res ? res.statusCode : 500;
      return cb(err);
    }
    cb(null, jobFromODR(body));
  });
}

// why the noop?
ODR.prototype.create = ODR.prototype.post = function(doc, cb) {
}

// find with a basic resource and an optional query
ODR.prototype.find = function(opts, cb) {
    var url  = this.uri + getResource(opts.resource) + '/f.json?q=' + opts.q;
    this.request('get', url, function(err, res, body) {
    if (err) {
      err.status = res.statusCode;
      return cb(err);
    }
    var docs = flattenAndConvert(body.doc, getMapper(opts.resource));
    cb(null, docs);
  });
}

// unused methods, required for interfacing with resourceful
;['sync','filter', 'destroy', 'save', 'update', 'load'].forEach(function(m) {
  ODR.prototype[m] = function() {
    throw new Error(m + ': not available yet');
  }
});
