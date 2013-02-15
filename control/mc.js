var Thread = require('../model/thread')
var Message = require('../model/message')
function extend (a, b) { for (var x in b) a[x] = b[x]; return a; }

exports.index = function(req, res) {
    Thread.find(req.session, function(err, data) {
        if (err) return res.send(err.status, err.message)
        res.json(data)     
    })
}

exports.view = function(req, res) {
    Thread.find(extend({id: req.params.id}, req.session), function(err, data) {
        if (err) return res.send(err.status, err.message)
        res.json(data)     
    })
}

exports.update = function(req, res) {
    // whitelisting *must* happen in the model
    Thread.update(req.body, function(err, data) {
        if (err) return res.send(err.status, err.message)
        res.json(data)
    })
}

exports.send = function(req, res) {
    Message.create(extend({
        threadId: req.params.id,
        body: req.body.body,
    }, req.session), function(err, data) {
        if (err) return res.send(err.status, err.message)
        res.json(201, data)
    })   
}

exports.trash = function(req, res) {
    Thread.destroy(req.params.id, function(err, data) {
        if (err) res.send(err.status, err.message)
        res.json(200)
    })
}

exports.contacts = function(req, res) {
    
}