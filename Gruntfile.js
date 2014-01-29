module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      production: {
        options: {
        },
        files: {
          'style.min.css': 'style.scss'
        }
      }
    },
    sass: {
      development: {
        options: {
          bundleExec: true,
          style: 'expanded',
          lineNumbers: true
        },
        files: {
          'style.css': 'style.scss'
        }
      }
    },
    watch: {
      scss: {
        files: ['style.scss'],
        tasks: ['build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['sass', 'cssmin']);
};
