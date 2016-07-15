module.exports = function(grunt) {
  'use strict';

  // Just set shell commands for running different types of tests
  grunt.initConfig({
    unit_cmd: 'mocha',
    unit_args: '-A -u exports --recursive -t 10000 ./test/test-*.js',
    unit: '<%= unit_cmd %> <%= unit_args %>',

    istanbul_cmd: 'istanbul cover --dir cov-unit',
    unit_cover: '<%= istanbul_cmd %> <%= unit_cmd %> -- <%= unit_args %>'
  });

  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['fh:default']);

};
