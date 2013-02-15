var resourceful = require('resourceful')
var Contractor = module.exports = resourceful.define('Contractor')
var odr = require('../engines/odr')

Contractor.use(odr, {uri: 'http://dbs04:9000'});
Contractor.string('id', {default: ''})
Contractor.string('name', {default: ''})
Contractor.number('created', {default: 0}) // timestamp
