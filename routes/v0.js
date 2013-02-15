// oDesk Mobile API
// 
// Version 0 (unstable)

var express = require('express')
var app = module.exports = express()
var api = require('../control/api')
var mc = require('../control/mc')
var recruit = require('../control/recruit')
var work = require('../control/work')
var token = require('../control/token')
var team = require('../control/team')

app.use(express.bodyParser())

// ## Authentication Middleware
//
// Our authentication scheme happens by getting a token and then sending that token
// in a custom header with each future request:
//
//      x-odesk-auth: token
//
// The verification module also can take a whitelist that is used to specify routes
// that do not require authentication
//
// To the right are examples of valid and invalid tokens.
//
// **Note:** *All of the examples assume this header is included*

/* whitelist these routes */
app.use(token.verify([
    'GET /',
    'POST /tokens'
]))

/*
     curl http://localhost:8888/v0/threads
     HTTP/1.1 404 Unauthorized

     curl -H "x-odesk-auth: BAD_TOKEN" http://localhost:8888/v0/threads
     HTTP/1.1 404 Unauthorized

     curl -H "x-odesk-auth: blablabla" http://localhost:8888/v0/threads
     HTTP/1.1 200 OK
*/

// ## Basic API Routes

// These generic routes are needed to support our API. They aren't very important. :)

app.get('/', api.info) // info route
app.post('/feedback', api.feedback) // provide app feedback

// ## Token management

// We use oRPC to handle sessions, but as far as the app is concerned it's actually a token.
// This token actually is an oRPC session ID, but we call it tokens, so we can switch to
// oAuth 2.0 Barrer tokens at some future day.

// ### Create Tokens (login)
app.post('/tokens', token.create)

// Input
//
//  * username
//  * password (optional)
//  * encryptedPassword (optional)
//
// Output
//
//      {
//          token: "blablabla",
//          encryptedPassword: "asdflkjDSF(*SD*UFJDS" // optional
//      }

/*
      curl -X POST http://localhost:8888/v0/tokens -d username=ggrey -d password=strange!
      HTTP/1.1 201 Created

      curl -X POST http://localhost:8888/v0/tokens -d username=ggrey -d encryptedPassword=asdflkjDSF(*SD*UFJDS
      HTTP/1.1 201 Created
*/

// ### Delete Tokens (logout)
app.del('/tokens/:id', token.del)

/*
     curl -X DELETE http://localhost:8888/v0/tokens/blablabla
     HTTP/1.1 200 OK
*/

// ## Message Center

// This is the bread and butter of our mobile application. It's how we send messages back and
// forth between clients and contractors.

// ### Get Threads
app.get('/threads', mc.index)

// Parameters
//
//  * count (optional)
//  * offset (optional)
//
// Output
// 
//      [{
//          id: "1234",
//          subject: "My Message",
//          participants: ["Jamund Ferguson", "Charlie Brown"],
//          preview: "Hey man...",
//          starred: false,
//          read: true,
//          count: 2, // number of messages
//          updated: 1358531968674
//      }]

/*
     curl http://localhost:8888/v0/threads
     HTTP/1.1 200 OK
*/


// ### Create a New Thread
app.post('/threads', mc.send)

// Input
//
//  * subject
//  * recipient
//  * body
//
// Output
//
//      {
//          id: "1234",
//          subject: "My Message",
//          participants: ["Jamund Ferguson", "Charlie Brown"],
//          preview: "Hey man...",
//          starred: false,
//          read: true,
//          count: 1,
//          updated: 1358531968674,
//          messages: [{
//              sender: "Charlie Brown",
//              read: true,
//              body: "Hey Man, I want to know what the plan is for this job."
//              created: 1358531968674,
//          }]
//      }

/*
     curl -X POST http://localhost:8888/v0/threads -d subject=yo -d body="let's chat" -d recipient=jamund
     HTTP/1.1 201 Created

*/

// ### View a Thread
app.get('/threads/:id', mc.view)

// Output
// 
//      {
//          id: "1234",
//          subject: "My Message",
//          participants: ["Jamund Ferguson", "Charlie Brown"],
//          preview: "Hey man...",
//          starred: false,
//          read: true,
//          count: 2, // number of messages
//          updated: 1358531968674,
//          messages: [{
//              sender: "Charlie Brown",
//              read: true,
//              body: "Hey Man, I want to know what the plan is for this job."
//              created: 1358531968674,
//          }, {
//              sender: "James brown",
//              read: false,
//              body: "When can you get me that son?."
//              created: 1358531923411,
//          }]
//      }

/*
     curl http://localhost:8888/v0/threads/1234
     HTTP/1.1 200 OK
*/

// ### Remove a Thread
app.del('/threads/:id', mc.trash) 

/*
     curl -X DELETE http://localhost:8888/v0/threads/1234
     HTTP/1.1 200 OK
*/

// ### Add another message to a thread (reply)
app.post('/threads/:id', mc.send) 

// Input
//
//  * body

/*
     curl -X POST http://localhost:8888/v0/threads/1234 -d body="This is what I think: bla bla bla"
     HTTP/1.1 200 OK
*/

// ### Update a thread (star/unstar/etc)
app.put('/threads/:id', mc.update) 

// Input
//
//  * starred (optional)

/*
     curl -X PUT http://localhost:8888/v0/threads/1234 -d starred=true
     HTTP/1.1 200 OK

     curl -X PUT http://localhost:8888/v0/threads/1234 -d starred=false
     HTTP/1.1 200 OK
*/

// ### Retreive the Contact List
app.get('/contacts', mc.contacts) 

// Output
//
//      [{
//          name: "Jamund Ferguson",
//          username: "jamund",
//          id: "1234-jamund",
//          firstName: "Jamund",
//          lastName: "Ferguson",
//          thumbnail: "http://www.odesk.com/thumb.jpg"
//      }]

/* 
    curl http://localhost:8888/v0/contacts
    HTTP/1.1 200 OK
*/

// ## Recruit

// Some information about the recruit routes.

app.get('/companies', recruit.companies)
app.get('/jobs', recruit.jobs) // can use get param to limit by team
app.get('/jobs/:jobId', recruit.applicants) // list all applicants for a job
app.get('/applications', recruit.applications)
app.get('/applications/:applicationId', recruit.application) // application info
app.get('/contractors/:contractorId', recruit.contractor) // get a contractor details

// ## Work

// Work uses a very similar job resource to recruit, but with some small differences.
// The primary difference is that in /jobs you're seeing jobs that you have posted.
// In work you're seeing jobs that other people have posted.

app.get('/work', work.index) // can use get param to specify query or it will return terms
app.get('/work/searches', work.searches) // return your old searches
app.get('/work/:jobId', work.view) // job details
app.post('/work/:jobId/share', work.share) // share a job
app.put('/applications', work.apply) // apply to a job
app.get('/clients/:clientId', work.client) // get details about a client


app.get('/users/:id', team.profile)