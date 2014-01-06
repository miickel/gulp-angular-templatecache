var assert = require('assert');
var gutil = require('gulp-util');
var templateCache = require('./index');

it('should build valid $templateCache from two html-files', function(cb) {
	var stream = templateCache('templates.js');

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");$templateCache.put("/template-b.html","<h1 id=\\"template-b\\">I\\\'m template B!</h1>");}]);');
		cb();
	});

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
		contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
	}));

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-b.html',
		contents: new Buffer('<h1 id="template-b">I\'m template B!</h1>')
	}));

	stream.end();
});
