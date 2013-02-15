// oDesk Mobile API
// 
// Version Mock (Mock Data)

var express = require('express')
var app = module.exports = express()

// mod
var mc = require('../control/mc')
var api = require('../control/api')
var token = require('../control/token')

// models
var fake = require('../engines/fake')
var Token = require('../model/token')
var Thread = require('../model/thread')
var Message = require('../model/message')

/* forces models to use a fake engine */
app.use(function(req, res, next) {
    Token.use(fake)
    Thread.use(fake)
    Message.use(fake)
    next()
})

/* whitelist these routes */
app.use(token.verify([
    'GET /',
    'POST /tokens'
]))

// normal routes
app.get('/', api.info)
app.post('/tokens', token.create)
app.del('/tokens/:id', token.del)
app.get('/threads', mc.index)
app.post('/threads', echo)
app.get('/threads/:id', mc.view)
app.del('/threads/:id', mc.trash) 
app.post('/threads/:id', echo) 
app.put('/threads/:id', echo) 
app.get('/contacts', fakeContacts)

function echo(req, res) {
    res.json(req.body)
}

function fakeContacts(req, res) {
    res.json([{
          name: "Jamund Ferguson",
          username: "jamund",
          id: "1234-jamund",
          firstName: "Jamund",
          lastName: "Ferguson",
          thumbnail: "http://farm4.static.flickr.com/3448/3788850830_9029fd92df.jpg"
    }, {
          name: "Mamta Jain",
          username: "mamta",
          id: "1234-Mamta",
          firstName: "Mamta",
          lastName: "Jain",
          thumbnail: "http://2.bp.blogspot.com/-_nxQOv4-px4/TdyKyhs1hJI/AAAAAAAAAHA/cJKSn3sQiR4/s1600/blue_flower.preview_0.jpg"
    }])
}