define(function(require) {
	var Backbone = require('backbone')
	
	return Backbone.View.extend({
	  el: '#content',

	  template: require('text!../../template/newMessage.html'),
	  
	  initialize: function() {
	    this.render();
	  },
	  
	  render: function() {
	    this.$el.html(_.template(this.template, {name:'Ziaul'}));
	    return this;
	  }

	});
})