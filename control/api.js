var info = require('../package.json');

// helper function
function getPath(obj) {
	return obj.path;
}

// probably should turn this off in prod
exports.info = function(req, res) {
	var routes = res.app._router.map;
	res.json({
		routes: {
			'get': routes.get ? routes.get.map(getPath) : [],
			'delete': routes.delete ? routes.delete.map(getPath) : [],
			'post': routes.post ? routes.post.map(getPath) : [],
			'put': routes.put ? routes.put.map(getPath) : []
		}
	});

};

exports.feedback = function(){
	
};
