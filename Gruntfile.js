module.exports = function(grunt) {

  grunt.registerTask('watch', [ 'watch' ]);
  grunt.registerTask('default', [
    'concat:scripts',
    'concat:libraries',
    'less',
    'browserify'
  ]);
  grunt.registerTask('serve', [
    'concat:scripts',
    'concat:libraries',
    'less',
    'browserify',
    'watch',
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
          separator: ''
        },
        src: [
          'public/js/import.js','public/js/components/*.js', 'public/js/partials/*.js', 'public/js/pages/*.js', 'public/js/app-wrapper.js'
        ],
        dest: 'public/js/scripts.js'
      },
      libraries: {
        options: {
          separator: ''
        },
        src: [
            'public/libraries/jquery/jquery.min.js',
            'public/libraries/babel/browser.min.js',
            'public/libraries/remarkable/remarkable.min.js',

        ],
        dest: 'public/libraries/libraries.js'
      },
    },
    browserify: {
      dist: {
        files: {
          'public/js/main.js': ['public/js/scripts.js']
        },
        options: {
          transform: [
            [
              'babelify', { 'presets': ['es2015'] }
            ]
          ]
        },
      }
    },
    watch: {
      js: {
        files: ['public/js/import.js', 'public/js/components/*.js', 'public/js/partials/*.js', 'public/js/pages/*.js', 'public/js/app-wrapper.js'],
        tasks: ['concat:scripts', 'browserify'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['public/css/components/*.less', 'public/css/utility/*.less'],
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
  grunt.loadNpmTasks('grunt-browserify');
};
