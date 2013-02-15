require.config({
  paths: {
    jquery: "lib/jqMobi.min",
    underscore: "http://underscorejs.org/underscore-min",
    backbone: "http://backbonejs.org/backbone",
    //backbone: "lib/backbone-min",
    text: "lib/text"
  },
  shim: {
    'jquery': {
        init: function() {
            window.jQuery = window.$;
        }
    },
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'underscore': {
        exports: '_'
    }
  }
});
 
define(function (require) {
 
  var AppRouter = require('router')
  new AppRouter()
 
});