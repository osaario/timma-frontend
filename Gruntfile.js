module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
     dist: {
       options: {
         transform: [["babelify", { "stage": 0 }]]
       },
      files: {
        'js/app.js': 'src/**/*.js'
      }
     }
   },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        esnext: true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['browserify']);

};