module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
