module.exports = function(grunt) {

  grunt.registerTask('watch', [ 'watch' ]);
  grunt.registerTask('default', [
    'concat:app',
    'concat:vendor',
    'less'
  ]);
  grunt.registerTask('serve', [
    'concat:app',
    'concat:vendor',
    'less',
    'watch'
  ]);

  grunt.initConfig({
    concat: {
      app: {
        options: {
          separator: ';'
        },
        src: [
          'public/js/**/*.js',
        ],
        dest: 'public/js/scripts.js'
      },
      vendor: {
        options: {
          separator: ';'
        },
        src: [
            'public/libraries/*.js'
        ],
        dest: 'public/libraries/libraries.js'
      }
    },
    less: {
      style: {
        files: {
          "public/css/styles.css": "public/css/**/*.less"
        }
      }
    },
    watch: {
      js: {
        files: ['public/js/**/*.js'],
        tasks: ['concat:app'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['public/css/**/*.less'],
        tasks: ['less:style'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
