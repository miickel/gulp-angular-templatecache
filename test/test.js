var assert = require('assert');
var gutil = require('gulp-util');
var templateCache = require('../index');

it('should build valid $templateCache from two html-files', function(cb) {
	var stream = templateCache('templates.js');

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		assert.equal(file.contents.toString('utf8'), 'angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n$templateCache.put("/template-b.html","<h1 id=\\"template-b\\">I\\\'m template B!</h1>");}]);');
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

it('should set proper template urls using options.root', function(cb) {
	var stream = templateCache('templates.js', {
		root: '/views'
	});

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		assert.equal(file.contents.toString('utf8'), 'angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("/views/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");}]);');
		cb();
	});

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
		contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
	}));

	stream.end();
});

it('should be able to create standalone module', function(cb) {
	var stream = templateCache('templates.js', {
		standalone: true
	});

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");}]);');
		cb();
	});

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
		contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
	}));

	stream.end();
});

it('defaults to templates.js if no filename is specified', function(cb) {
	var stream = templateCache();

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		cb();
	});

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
		contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
	}));

	stream.end();
});

it('can specify options as first parameter when no filename is specified', function(cb) {
	var stream = templateCache({
		standalone: true,
		root: '/views'
	});

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/views/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");}]);');
		cb();
	});

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
		contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
	}));

	stream.end();
});

it('can specify base in options', function(cb) {
	var stream = templateCache({
		standalone: true,
		root: '/views',
		base: '~/dev/projects/gulp-angular-templatecache'
	});

	stream.on('data', function(file) {
		assert.equal(file.path, '~/dev/projects/gulp-angular-templatecache/test/templates.js');
		assert.equal(file.relative, 'templates.js');
		assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/views/test/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");}]);');
		cb();
	});

	stream.write(new gutil.File({
		base: '~/dev/projects/gulp-angular-templatecache/test',
		path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
		contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
	}));

	stream.end();
});
