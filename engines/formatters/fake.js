var formatters = module.exports = {get: {}, post: {}, delete: {}, put: {}}

formatters.get.thread = {
    results: function() {
        return {
            id: "1234",
            subject: "My Message",
            participants: ["Jamund Ferguson", "Charlie Brown"],
            preview: "Hey man...",
            starred: false,
            read: true,
            count: 2, // number of messages
            updated: 1358531968674,
            messages: [{
                sender: "Charlie Brown",
                read: true,
                body: "Hey Man, I want to know what the plan is for this job.",
                created: 1358531968674
            }, {
                sender: "James brown",
                read: false,
                body: "When can you get me that son?.",
                created: 1358531923411
            }]
        }
    }
}

formatters.get.threads = {
    results: function() {
        return [{
            id: "1234",
            subject: "My Message",
            participants: ["Jamund Ferguson", "Charlie Brown"],
            preview: "Hey man...",
            starred: false,
            read: true,
            count: 2, // number of messages
            updated: 1358531968674
          }]
    }
}

formatters.post.message = {
    results: function() {
        return {}
    }
}

formatters.get.token = {
    results: function(id) {
        if (id !== 'odesk') return
        return {
            id: 'odesk',
            username: 'odesk'   
        }
    }
}

formatters.delete.thread = {
    results: function(id) {
        return {}
    }
}

formatters.delete.token = {
    results: function(id) {
        if (id !== 'odesk') return
        return {}
    }
}

formatters.post.token = {
    results: function(doc) {
        if (doc.username !== 'odesk' || doc.password !== 'test') return
        return {
            id: 'odesk',
            token: 'odesk',
            encryptedPassword: 'LKJSF*@(#HFOW*FYSD(FHDSKJLFHhalfhsdj'
        }
    }
}
