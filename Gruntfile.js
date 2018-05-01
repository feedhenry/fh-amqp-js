module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    _test_runner: '_mocha',
    _istanbul: 'istanbul cover --dir',
    _unit_args: '--recursive -t 10000 ./test/unit',
    unit: '<%= _test_runner %> <%= _unit_args %>',
    unit_cover: '<%= _istanbul %> cov-unit <%= _test_runner %> -- <%= _unit_args %>',
    integrate:['<%= _test_runner %> ./test/integrate'],
    accept:['<%= _test_runner %> ./test/accept'],
    mochaTest: {
      all: ['./test/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['mochaTest', 'fh:default']);
};