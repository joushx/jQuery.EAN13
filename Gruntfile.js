module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*\n* Copyright (c) <%= grunt.template.today("yyyy") %> Johannes Mittendorfer (http://johannes-mittendorfer.com)\n* Licensed under the MIT License (LICENSE.txt).\n*\n* Version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
