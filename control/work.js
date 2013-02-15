var Job = require('../model/job')

exports.index = function(req, res) {
	Job.find(req.query, function(err, data) {
		if (err) return res.send(err);
		res.json(data);
	})
};

exports.view = function(req, res) {
	Job.get(req.params.jobId, function(err, data) {
		if (err) return res.send(err);
		res.json(data);
	})
	
};

exports.apply = function() {};
exports.searches = function() {};
exports.client = function() {};
exports.share = function() {};
