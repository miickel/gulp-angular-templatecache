var path = require('path');
var assert = require('assert');
var gutil = require('gulp-util');
var templateCache = require('../index');

it('should build valid $templateCache from two html-files', function(cb) {
  var stream = templateCache('templates.js');

  stream.on('data', function(file) {
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates").run(["$templateCache", function($templateCache) {\n$templateCache.put("/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n$templateCache.put("/template-b.html","<h1 id=\\"template-b\\">I\\\'m template B!</h1>");\n}]);');
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
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates").run(["$templateCache", function($templateCache) {\n$templateCache.put("/views/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n}]);');
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
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {\n$templateCache.put("/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n}]);');
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
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
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

it('can set options using first parameter when no filename is specified', function(cb) {
  var stream = templateCache({
    standalone: true,
    root: '/views'
  });

  stream.on('data', function(file) {
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {\n$templateCache.put("/views/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n}]);');
    cb();
  });

  stream.write(new gutil.File({
    base: '~/dev/projects/gulp-angular-templatecache/test',
    path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
    contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
  }));

  stream.end();
});

it('can set filename in options', function(cb) {
  var stream = templateCache({
    standalone: true,
    root: '/views',
    filename: 'foobar.js'
  });

  stream.on('data', function(file) {
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/foobar.js'));
    assert.equal(file.relative, 'foobar.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {\n$templateCache.put("/views/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n}]);');
    cb();
  });

  stream.write(new gutil.File({
    base: '~/dev/projects/gulp-angular-templatecache/test',
    path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
    contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
  }));

  stream.end();
});

it('can override file base path in options', function(cb) {
  var stream = templateCache({
    standalone: true,
    root: '/views',
    base: '~/dev/projects/gulp-angular-templatecache'
  });

  stream.on('data', function(file) {
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {\n$templateCache.put("/views/test/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n}]);');
    cb();
  });

  stream.write(new gutil.File({
    base: '~/dev/projects/gulp-angular-templatecache/test',
    path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
    contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
  }));

  stream.end();
});


it('can provide a function to override file base path in options', function(cb) {
  var stream = templateCache({
    standalone: true,
    root: '/templates',
    base: function(file) {
      return '/all/' + file.relative;
    }
  });

  stream.on('data', function(file) {
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {\n$templateCache.put("/templates/all/template-a.html","<h1 id=\\"template-a\\">I\\\'m template A!</h1>");\n}]);');
    cb();
  });

  stream.write(new gutil.File({
    base: '~/dev/projects/gulp-angular-templatecache/test',
    path: '~/dev/projects/gulp-angular-templatecache/test/template-a.html',
    contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
  }));

  stream.end();
});

it('can output pretty format codes if option pretty was set to true', function(cb) {
  var stream = templateCache({ pretty: true });

  stream.on('data', function(file) {
    assert.equal(path.normalize(file.path), path.normalize('~/dev/projects/gulp-angular-templatecache/test/templates.js'));
    assert.equal(file.relative, 'templates.js');
    assert.equal(file.contents.toString('utf8'), 
      'angular.module("templates").run(["$templateCache", function($templateCache) {\n'+
      '  $templateCache.put("/template-a.html",\n'+
      '    "<h1 id=\\"template-a\\">I\\\'m template A!</h1>"\n'+
      '  );\n'+
      '\n'+
      '  $templateCache.put("/template-b.html",\n'+
      '    "<h1 id=\\"template-b\\">I\\\'m template B!</h1>"\n'+
      '  );\n'+
      '\n'+
      '}]);'
    );
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