
var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            dist: {
                options: {
                    paths: ['src/stylus'],
                    define: {"cdn_root" : "<%= pkg.deploy.prod.cdn_root %>"},
                    use: [
                        
                    ],
                    import: [      //  @import 'foo', 'bar/moo', etc. into every .styl file
                      
                    ]
                },
                files: {

                    'dist/css/<%= pkg.name %>.css': 'src/stylus/index.styl' // 1:1 compile
                }
            },
            dev: {
                options: {
                    paths: ['src/stylus'],
                    define: {"cdn_root" : "<%= pkg.deploy.dev.cdn_root %>"},
                    use: [
                        
                    ],
                    import: [      //  @import 'foo', 'bar/moo', etc. into every .styl file
                      
                    ]
                },
                files: {
                    'dev/css/<%= pkg.name %>.css': 'src/stylus/index.styl' // 1:1 compile

                }
            }

        },

        cssmin: {
          add_banner: {
            options: {
              banner: '/* minified vendor css file */'
            },
            files: {
              'dist/css/<%= pkg.name %>-vendors-min.css': ['dev/css/<%= pkg.name %>-vendors.css']
            }
          }
        },
        bower: {
          dev: {
            dest: 'src/vendor',
            js_dest: 'src/vendor/js',
            css_dest: 'src/vendor/css'
          }
        },

        concat: {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
          },
          dev: {
            // the files to concatenate
            files: {
                'dev/js/<%= pkg.name %>.js' : [
                   
                    'src/js/base.js',
                    'src/js/**/*.js'
                ],
                'dev/js/<%= pkg.name %>-vendors.js' : [
                    'src/vendor/js/**/*.js'
                ],
                'dev/css/<%= pkg.name %>-vendors.css' : [
                    'src/vendor/css/**/*.css'
                ]
            }
          },
          dist: {
                // the files to concatenate
                files: {
                    'dist/js/<%= pkg.name %>.js' : [

                        'src/js/base.js',
                        'src/js/**/*.js'
                    ],
                    'dist/js/<%= pkg.name %>-vendors.js' : [
                        'src/vendor/js/**/*.js'
                    ],
                    'dist/css/<%= pkg.name %>-vendors.css' : [
                        'src/vendor/css/**/*.css'
                    ]
                }
          }
        },
        uglify: {
            options: {
            // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['dev/js/<%= pkg.name %>.js'],
                    'dist/js/<%= pkg.name %>-vendors.min.js': ['dev/js/<%= pkg.name %>-vendors.js']
                }
            }
        },
        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'src/js/**/*.js' , 'app/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
            // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>' ,  '<%= stylus.dev.options.paths +"/**/*.styl" %>' , 'package.json' ],
            tasks: ['jshint' ,'stylus:dev' ,'concat:dev' ]
        }

    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-bower');



  

    grunt.registerTask('default', ['jshint', 'concat:dev','stylus:dev', 'watch']);
    grunt.registerTask('dev', ['jshint', 'stylus:dev', 'concat:dev', 'watch']);
    grunt.registerTask('dist', ['jshint', 'stylus:dist', 'concat:dist', 'uglify' , 'cssmin' ]);
    grunt.registerTask('dist:test', ['jshint', 'stylus:dist', 'concat:dist', 'uglify' , 'cssmin']);
    grunt.registerTask('bower-init', ['bower' ]);
  
   
};
