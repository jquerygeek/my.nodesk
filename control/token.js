var HEADER_NAME = 'x-odesk-auth'
var Token = require('../model/token')
    
exports.create = function(req, res) {
    if (!req.body || !req.body.username) return res.json(400, {err: 'Please provide username and password'})
    Token.create({
        username: req.body.username,
        password: req.body.password,
        encryptedPassword: req.body.encryptedPassword
    }, function(err, data) {
        if (err) return res.json(401, {error: err.message})
        res.json(201, data)
    })
}

exports.del = function(req, res) {
    var token = req.params.id
    Token.destroy(token, function(err) {
        if (err) res.json(500, {error: 'Couldn\'t remove token'})
        res.send(200)
    })
}

// middlware (called before every request)
exports.verify = function(whitelist) {
    return function(req, res, next) {
        if (whitelist && ~whitelist.indexOf(req.method + ' ' + req.path)) return next()
        var token = req.headers[HEADER_NAME]
        if (!token) return res.json(401, {error: 'Unauthorized'})
        Token.get(token, function(err, data) {
            if (err) return res.json(401, {error: 'Unauthorized'})
            req.session = {
                username: data.username,
                sessionId: data.id
            }
            next()
        })
    }
}
