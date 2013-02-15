var docco = require('docco')

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'model/*.js', '*.js', 'control/*.js', 'engines/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    mochaTest: {
      files: ['test/**/*.test.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'        
      }
    },
    jshint: {
      options: {
        curly: false,
        asi: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        es5: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        jQuery: true
      }
    },
    docco: {
      routes: {
        src: ['routes/**/*.js'],
        output: 'public/docs/'
      }
    }
  })

  // see: https://github.com/DavidSouther/grunt-docco/blob/master/tasks/docco.js
  grunt.registerMultiTask('docco', 'Docco processor.', function() {
   var options = this.data,  
        _this = this,
        files = this.file.src,
        fdone = 0;
    var done = _this.async();
    files.forEach(function(file) {
      var files = grunt.file.expandFiles(file);
      docco.document(files, options, function(err, result, code){
        if(fdone++ === files.length) done();
      });
    });
  });

  grunt.registerTask('default', 'lint mochaTest')
  grunt.registerTask('test', 'mochaTest')
  grunt.registerTask('docs', 'docco')  
  grunt.loadNpmTasks('grunt-mocha-test')
}
