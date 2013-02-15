var resourceful = require('resourceful')
var User = module.exports = resourceful.define('user')
var orpc = require('../engines/orpc')

User.use(orpc);
User.string('id', {default: ''})
User.string('name', {default: ''})