var User = require('../model/user')
exports.profile = function(req, res) {
    User.get(req.params.id, function(err, data) {
        if (err) return res.json(500, err)
        if (!data) return res.json({error: "Could not find anyone"})
        res.json(data)
    })
}