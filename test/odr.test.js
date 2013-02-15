var assert = require('assert')
var odr = require('../engines/odr')
var resourceful  = require('resourceful')

describe('ODR', function() {
	describe('#constructor', function() {
		it('should fail without a Uri', function() {
			assert.throws(function() {
				new odr()
			})
		})
		it('should look like an engine', function() {
			var o = new odr({uri: 'test'})
			assert.ok(o.connection)
			assert.ok(o.cache)
		})
	})
	describe('#unused', function() {
		var Creature = resourceful.define('Creature')
		Creature.string('name')
		Creature.use(odr, {uri: 'test'})
		var c = new Creature()
		it('should not be able to sync', function() {
			assert.throws(function() {
				Creature.sync()
			}, /not available yet/)
		})
		it('should not be able to filter', function() {
			assert.throws(function() {
				Creature.filter()
			}, /not available yet/)
		})
		it('should not be able to destroy', function() {
			assert.throws(function() {
				Creature.destroy()
			}, /not available yet/)
		})
/*
		it('should not be able to save', function() {
			Creature.save('guy', {id: 'guy', name: 'fluffy'}, function(err) {console.log(err)})
			assert.throws(function() {
			}, /not available yet/)
		})
*/
	})
	describe('#get', function() {
		it('should be able to get, but not with a bad uri', function() {
			var Creature = resourceful.define('Creature')
			Creature.string('name')
			Creature.use(odr, {uri: 'test'})
			var c = new Creature({id: 'guy', name: 'fluffy'})
			assert.throws(function() {
				Creature.get('guy', function(err) {
					assert.ifError(err);
					done();	
				});
			}, /Invalid URI/)
		})
	})
})