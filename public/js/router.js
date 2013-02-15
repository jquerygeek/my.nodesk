
define(function (require) {
	var MessagesView = require('view/messages')

	return Backbone.Router.extend({
		initialize: function() {
	      Backbone.history.start();
	    },
	    routes: {
	      "": "newMessage"
	    },
	    newMessage: function() {
	    	var newMessage = new MessagesView();
	    }
	});
});