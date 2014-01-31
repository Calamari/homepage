module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    copy: {
      homepage: {
        src: 'js/homepage.js',
        dest: 'js/homepage.pre.js',
        options: {
          process: function(content) {
            return content.replace('$VERSION$', pkg.version);
          }
        }
      },
      dist: {
        src: ['js/**', 'style.min.css', 'images/**', 'index.html'],
        dest: 'dist/'
      }
    },
    cssmin: {
      production: {
        options: {
        },
        files: {
          'style.min.css': 'style.css'
        }
      }
    },
    sass: {
      development: {
        options: {
          bundleExec: true,
          style: 'expanded',
          lineNumbers: true,
          compass: true
        },
        files: {
          'style.css': 'style.scss'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'js/app.min.js': [
            'bower_components/jquery/jquery.min.js',
            'bower_components/tabular.js/tabular_browser.js',
            'bower_components/terminal/src/terminal.js',
            'bower_components/terminal/src/utils.js',
            'bower_components/terminal/src/type_script.js',
            'bower_components/terminal/src/commands.js',
            'js/homepage.pre.js',
            'js/initialization.js'
          ],
          'js/space_invaders.min.js': [
            'bower_components/space_invaders/spaceinvaders.js',
            'bower_components/space_invaders/highscore.js'
          ]
        }
      }
    },
    watch: {
      scss: {
        files: ['style.scss', 'js/*', 'index.html'],
        tasks: ['build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['sass', 'cssmin', 'copy:homepage', 'uglify', 'copy:dist']);
};
