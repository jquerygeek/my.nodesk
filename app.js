var express = require('express')
var port = process.argv[2] || 8888
var app = module.exports = express()
var stylus = require('stylus');
var nib = require('nib');
var VERSIONS = {'Mock': '/mock', 'Pre-Production': '/v0', 'Version 1': '/v1'};

// config stuff
app.use(express.compress())
app.use(express.favicon())
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.logger('dev')) // access log
app.use(app.router) // prioritize routes over public folder
app.use(express.static(__dirname + '/public')) // for the docs

// development only config
app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
    require('nodefly').profile('f9444a2979583cfe467eb450aafde78a', "dev app", {});
    app.use(require('stylus').middleware({
	  src: __dirname + '/public',
	  compile:  function compile(str, path) {
	    return stylus(str).use(nib()).set('warn', true)
	  }
	}));
})

// prod only config
app.configure('production', function(){
    app.use(express.errorHandler())
})

// the routes
//app.get('/', function(req, res) {
	//res.json(VERSIONS);
//})
for (var k in VERSIONS) {
	app.use(VERSIONS[k], require('./routes' + VERSIONS[k]))
}

// listen
app.listen(port);
console.log("no.desk server running at http://localhost:%d/", port)
