module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    mocha: {
      index: ["test/index.html"]
    },

    jslint: {
      all: {
        src: ["conway.js", "options.js"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-mocha");
  grunt.loadNpmTasks("grunt-jslint");

  grunt.registerTask("default", ["mocha", "jslint"]);
};
