module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [ 'Gruntfile.js', 'public/src/**/*.js' ]
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'public/src/*.js', 'public/tmp/*.js' ],
        dest: 'public/dist/app.js'
      }
    },
    uglify: {
     options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        files: {
          'public/dist/app.min.js': 'public/dist/app.js'
        }
      }
    },
    html2js: {
      options: {
        base: 'public/src',
        module: 'CST.templates'
      },
      dist: {
        src: [ 'public/src/templates/*.html' ],
        dest: 'public/tmp/templates.js'
      }
    },
    clean: {
      temp: {
        src: [ 'public/tmp' ]
      }
    }, 
    watch: {
      dev: {
        files: [ 'Gruntfile.js', 'public/src/**/*.js', 'public/src/**/*.html'],
        tasks: [ 'jshint', 'html2js:dist', 'concat:dist', 'clean:temp' ],
        options: {
          atBegin: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('dev', [ 'watch:dev' ]);
};