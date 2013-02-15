var formatters = module.exports = {get: {}, post: {}, delete: {}, put: {}}

// get user
formatters.get.user = {
    key: 'Profile::GetProfileByKey',
}

// get threads
formatters.get.threads = {
    // see api/lib/mc/v1/controllers/TraysController.php -> listAction()
    key: 'MC::GetMC',
    formatter: function(doc) {
        return [doc.username, 'inbox', [doc.offset || 0, doc.limit || 10], null, null, null, true]
    },
    mapper: function(doc) {
        var inbox = doc.current_tray.threads;
        var peeps = []
        var data = []
        var name = ''
        for (var i in inbox) {
            data.push({
                id: inbox[i].id,
                starred: inbox[i].starred === '1',
                read: inbox[i].read === '1',
                subject: inbox[i].subject,
                participants: getParticipants(inbox[i].participants),
                created: parseInt(inbox[i].created_ts, 10)
            })
        }
        return data;
        
    }
}

formatters.post.message = {
    key: 'MC::ReplyConversation',
    formatter: function(doc) {
        return [doc.threadId, doc.username, doc.body]
    }
}

formatters.get.thread = {
    key: 'MC::GetThread',
    formatter: function(doc) {
        return [doc.id, doc.username, null, null, null, true]
        // return [doc.id, doc.username]
    },
    mapper: function(doc) {
        var thread = {
            id: doc.id,
            participants: getParticipants(doc.participants),
            subject: doc.subject,
            messages: getMessages(doc.posts),
            created: parseInt(doc.created_ts, 10),
            read: doc.read === '1',
            starred: doc.starred === '1',
            type: doc.type

        }
        return thread
    }
}

// get token
formatters.get.token = {
    key: 'SingleSignOn::GetSessionByID',
    formatter: function(id) {
        return [id, 'yes']
    },
    mapper: function(doc) {
        return {
            username: doc.session.user.uid
        }
    }
}

// post token
formatters.post.token = {
    key: 'SingleSignOn::Login',
    formatter: function(doc) {
        if (doc.encryptedPassword) {
            return [doc.username, doc.encryptedPassword]
        } else {
            return [doc.username, doc.password, null, 'yes']
        }
    },
    mapper: function(doc) {
        return {
            token: doc.session_id,
            encryptedPassword: doc.crypted_password
        }
    }
} 

// delete token
formatters.delete.token = {
    key: 'SingleSignOn::Logout'
}

function getParticipants(peeps) {
    var people = []
    var name = ""
    for (var i in peeps) {
        name = peeps[i].first_name + ' ' + peeps[i].last_name
        people.push(name) 
    }
    return people
}

function getMessages(msgs) {
    var messages = []
    for (var i in msgs) {
        messages.push({
            body: msgs[i].content,
            preview: msgs[i].preview,
            created: msgs[i].created_ts
        })
    }
    return messages
}
