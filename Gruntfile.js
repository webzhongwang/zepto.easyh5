module.exports = function(grunt) {

	//加载所有任务
	require('load-grunt-tasks')(grunt);
	//config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//压缩JS
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				footer: '\n/*footer*/'
			},
			target: {
				files: {
					'dist/zepto.easyh5.min.js': ['src/*.js']
				}
				
			}
		},

		//压缩CSS
		cssmin: {
			options: {
				banner: '/*! 111<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			target: {
				files: {
					'dist/zepto.easyh5.min.css': ['src/*.css']
				}
			}
		},
	});

	//注册事件
	grunt.registerTask('dist',[
		'uglify:target',
		'cssmin:target'
	]);
};