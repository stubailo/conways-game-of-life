module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    mocha: {
      index: ["test/index.html"]
    },

    jslint: {
      all: {
        src: ["js/conway.js", "js/options.js", "js/conway_utils.js"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-mocha");
  grunt.loadNpmTasks("grunt-jslint");

  grunt.registerTask("default", ["mocha", "jslint"]);
};
