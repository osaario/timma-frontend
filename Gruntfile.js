module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/app.js',
        dest: 'js/app.min.js'
      }
    },
    less: {
      style: {
        files: {
          "styles/timma.css": "styles/less/**/*.less"
        }
      }
    },
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
      tasks: ['jshint'],
      js: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'browserify'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['styles/less/*.less'],
        tasks: ['less:style'],
        options: {
          livereload: true,
        }
      }

    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'browserify']);
  grunt.registerTask('build-release', ['jshint', 'browserify', 'uglify']);

};
