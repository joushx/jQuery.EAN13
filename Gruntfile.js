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
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      uses_defaults: ['src/**/*.js'],
    },
    qunit: {
      all: ['tests/**/*.html']
    },
    jquerymanifest: {
        options: {
            source: grunt.file.readJSON('package.json'),
            overrides: {
                name: "ean13",
                title: "jQuery EAN 13",
                author: {
                    name: "Johannes Mittendorfer",
                    url: "http://johannes-mittendorfer.com"
                },
                homepage: "https://github.com/joushx/jQuery.EAN13",
                demo: "http://demo.johannes-mittendorfer.com/jquery-ean13",
		docs: "https://github.com/joushx/jQuery.EAN13/blob/master/README.md"
            }
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-jquerymanifest');

  // Default task(s).
  grunt.registerTask('default', ['jshint','qunit','uglify','jquerymanifest']);

};
