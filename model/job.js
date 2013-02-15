var resourceful = require('resourceful')
var Job = module.exports = resourceful.define('job')
var odr = require('../engines/odr')

Job.use(odr, {uri: 'http://dbs04:9000'});
Job.string('id', {default: ''})
Job.string('clientId', {default: ''})
Job.string('description', {default: 'yuck'})
Job.string('title', {default: 'title-yo'})
Job.number('total', {default: 0})
Job.number('hires', {default: 0})
Job.number('active', {default: 0})
Job.bool('inviteOnly', {default: false})
Job.number('created', {default: 0}) // timestamp
