module.exports = function(grunt) {

  grunt.initConfig({
  concat: {
        options: {
          separator: ';'
        },
        dist: {
          src: ['src/**/*.js'],
          dest: 'js/app.js'
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

  grunt.registerTask('default', ['jshint']);

};
