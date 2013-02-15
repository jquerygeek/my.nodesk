// oDesk Mobile API
// 
// Version 1 (TESTING)

var express = require('express')
var app = module.exports = express()
var mc = require('../control/mc')
var token = require('../control/token')
var orpc = require('../engines/orpc')
var Thread = require('../model/thread')
var Message = require('../model/message')

// # TEST ROUTE

/* whitelist these routes */
app.use(token.verify([
    'POST /tokens'
]))

// forcing models to use orpc for tests
app.use(function(req, res, next) {
    Thread.use(orpc)
    Message.use(orpc)
    next()
})
app.post('/tokens', token.create)
app.get('/threads', mc.index)
app.get('/threads/:id', mc.view)
app.post('/threads/:id', mc.send)
