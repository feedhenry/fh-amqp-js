module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    _test_runner: '_mocha',
    _istanbul: 'istanbul cover --dir',
    _unit_args: 'b -A -u exports -t 20000',
    unit: '<%= _test_runner %> <%= _unit_args %> --recursive ./test/unit/**/test*.js --exit',
    unit_cover: ['istanbul cover --dir cov-unit -- node_modules/.bin/_mocha <%= _unit_args %> --recursive ./test/unit/**/test*.js'],
    integrate:['<%= _test_runner %> ./test/integrate --exit'],
    accept:['<%= _test_runner %> ./test/accept --exit'],
    mochaTest: {
      all: ['./test/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['mochaTest', 'fh:default']);
};
