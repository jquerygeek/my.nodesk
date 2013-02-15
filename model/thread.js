var resourceful = require('resourceful')
var Thread = module.exports = resourceful.define('thread')
var webapi = require('../engines/webapi')
var uri = process.env.WEBAPI || 'https://dev08:26681'

Thread.use(webapi, {uri:uri})
Thread.string('subject', {default: 'No Subject'})
Thread.array('participants', {default: []})
Thread.array('messages', {default: []})
Thread.number('count', {default: 0})
Thread.bool('starred', {default: false})
Thread.bool('read', {default: false})

/*
Thread.create({id: '868751', messages: [{body: 'blablabla', username: 'ggrey' }]}, function() {
    console.log(arguments)
})

Thread.on('error', function(err, doc) {
    console.log(err.value)
    console.log(err.validate)
})

Thread.on('save', function() {
    console.log('Thread saved')
})

Thread.on('created', function() {
    console.log('Thread created')
})
*/