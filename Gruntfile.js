module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-obfuscator');

  grunt.initConfig({
    obfuscator: {
      files: ['controller.js',],
      entry: 'controller.js',
      out: 'controller.obfuscate.js',
      strings: true,
      root: __dirname
    }
  });

  grunt.registerTask('default', ['obfuscator']);

};
