var formatters = module.exports = {get: {}, post: {}, delete: {}, put: {}}

formatters.get.thread = {
    url: function(opts) {
        return '/api/mc/v2/threads/ggrey/' + opts.id + '.json?escape=html&session_id=' + opts.sessionId 
    },
    results: function(doc) {
        return {
            id: doc.thread.id,
            subject: doc.thread.subject,
            messages: doc.thread.posts.map(function(post) {
                return {
                    content: post.content,
                    username: post.sender_username
                }
            })
        }
    }
}

formatters.get.threads = {
    url: function(opts) {
        return '/api/mc/v2/trays/ggrey/inbox.json?session_id=' + opts.sessionId  
    },
    results: function(doc) {
        return doc.current_tray.threads.map(function(thread) {
            return {
                id: thread.id,
                starred: thread.starred === '1',
                read: thread.read === '1',
                participants: thread.participants.map(function(person) {
                    return person.first_name + ' ' + person.last_name
                }),
                subject: thread.subject,
                created: parseInt(thread.created_ts, 10)
            }
        })
    }
}

formatters.post.message = {
    url: function(opts) {
       return '/api/mc/v2/threads/ggrey/' + opts.threadId + '.json?escape=html&session_id=' + opts.sessionId 
    },
    results: function(doc) {
        return doc        
    }
}
