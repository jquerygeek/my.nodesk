var request = require('supertest')
var assert = require('assert')
var app = require('../routes/v0')

describe('GET /', function() {
	it('should give some json', function(done) {
		request(app)
			.get('/')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
    			assert.ok('routes' in res.body)
    			assert.ok('get' in res.body.routes)
    			assert.ok('post'in res.body.routes)
    			assert.ok('put' in res.body.routes)
                if (err) throw err
                done()
			})
	})
})

describe('authentication', function() {
    
    var Thread = require('../model/thread')
    var Token = require('../model/token')
    var server = request(app)
    var fake = {id: 'blablabla', username: 'ggrey', password: 'strange!', token: 'blablabla', encryptedPassword: 'blablabla'}

    // mock data for token and some mocked rou
    Token.use('memory')
    Token.create(fake)
    Token.create = function(data, cb) {
        Token.get(fake.id, function(err, data) {
            cb(null, data)
        })
    }

    // mock data for the thread calls
    Thread.use('memory')
    Thread.create({id: 'blablabla', subject: 'subject'})

    it('should usally check for auth header', function(done) {
        server
            .get('/threads')
            .expect(401)
            .end(function(err, res) {
                if (err) throw err
                done()
            })
    })
    it('does not always check for that auth header', function(done) {
        server
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err
                done()
            })    
    })
    it('should send a token', function(done) {
        server
            .post('/tokens')
            .type('form')
            .send({username: fake.username, password: fake.password})
            .expect(201)
            .expect(/token/)
            .end(function(err, data) {
                if (err) throw err
                done()
            })
    })
    it('should let you access when you have that special header set', function(done) {
        server
            .get('/threads')
            .set('x-odesk-auth', fake.id)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err
                done()
            })
    })
    it('should let you remove a token', function(done) {
        server
            .del('/tokens/' + fake.id)
            .set('x-odesk-auth', fake.id)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err
                done()
            })
    })
    it('should not let you use a removed token', function(done) {
        server
            .get('/threads')
            .set('x-odesk-auth', fake.id)
            .expect(401)
            .end(function(err, res) {
                if (err) throw err
                done()
            })
    })})