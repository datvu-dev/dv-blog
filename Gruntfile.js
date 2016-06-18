module.exports = function(grunt) {

  grunt.registerTask('watch', [ 'watch' ]);
  grunt.registerTask('default', [
    'concat:scripts',
    'concat:libraries',
    'less'
  ]);
  grunt.registerTask('serve', [
    'concat:scripts',
    'concat:libraries',
    'less',
    'watch'
  ]);

  grunt.initConfig({
    less: {
      style: {
        files: {
          "public/css/styles.css": "public/css/styles.less"
        }
      }
    },
    concat: {
      scripts: {
        options: {
          separator: ';'
        },
        src: [
          'public/js/components/*.js',
        ],
        dest: 'public/js/scripts.js'
      },
      libraries: {
        options: {
          separator: ''
        },
        src: [
            'public/libraries/jquery/jquery.min.js',
            'public/libraries/react/react.min.js',
            'public/libraries/react/react-dom.min.js',
            'public/libraries/babel/browser.min.js',
            'public/libraries/remarkable/remarkable.min.js'
        ],
        dest: 'public/libraries/libraries.js'
      },
    },
    watch: {
      js: {
        files: ['public/js/components/*.js'],
        tasks: ['concat:scripts'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['public/css/styles.less','public/css/components/*.less', 'public/css/utility/*.less'],
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
