module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        files: {
          'dist/jquery-ean13.min.js': ['dist/jquery-ean13.js'],
          'dist/ean13.min.js': ['dist/ean13.js'],
        }
      }
    },
    coffeelint: {
      app: ['dist/<%= pkg.name %>.coffee'],
      options: {
        'max_line_length': {
          'level': 'ignore'
        },
        'arrow_spacing':{
          'level': 'warn'
        },
        'line_endings':{
          'level': 'warn'
        },
        'no_empty_param_list':{
          'level': 'warn'
        }
      }
    },
    qunit: {
      all: ['tests/tests-js.html', 'tests/tests-jquery.html'],
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
    },
    coffee:{
      compile: {
        options: {
          bare: true
        },
        files: {
          'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>.coffee',
          'dist/ean13.js': 'dist/ean13.coffee'
        }
      }
    },
    usebanner: {
      taskName: {
        options: {
          position: 'top' || 'bottom',
          banner: '/*\n* Copyright (c) <%= grunt.template.today("yyyy") %> Johannes Mittendorfer (http://johannes-mittendorfer.com)\n* Licensed under the MIT License (LICENSE.txt).\n*\n* Version <%= pkg.version %>\n* Build <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n',
          linebreak: true || false
        },
        files: {
          src: ['dist/*.js']
        }
      }
    },
    includes: {
      files: {
        src: ['src/jquery-ean13.coffee','src/ean13.coffee'], // Source files
        dest: 'dist', // Destination directory
        flatten: true,
        cwd: '.',
        options: {
          silent: true,
        }
      }
    },
    clean: ["dist"]
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-jquerymanifest');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean','includes','coffeelint','coffee','uglify','usebanner','qunit','jquerymanifest']);
  grunt.registerTask('test', ['clean','includes','coffeelint','coffee','uglify','qunit']);

};
