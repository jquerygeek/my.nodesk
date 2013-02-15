var resourceful = require('resourceful')
var Message = module.exports = resourceful.define('message')
var webapi = require('../engines/webapi')
var uri = process.env.WEBAPI || 'https://dev08:26681'

Message.use(webapi, {uri:uri})
Message.string('threadId')
Message.string('body', {default: 'No Message'})
Message.string('username')

/*
var Thread = require('./Thread')
Thread.find({id: '868751', username: 'ggrey'}, function(err, doc) {
   console.log(doc)
})

Message.create({threadId: '868751', body: 'blablabla', username: 'ggrey'}, function() {
    console.log(arguments)
})

Message.on('error', function(err, doc) {
    console.log(err.value)
    console.log(err.validate)
})

Message.on('save', function() {
    console.log('Message saved')
})

Message.on('created', function() {
    console.log('Message created')
})
*/