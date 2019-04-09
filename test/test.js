var path = require('path');
var assert = require('assert');
var Vinyl = require('vinyl');
var templateCache = require('../index');

describe('gulp-angular-templatecache', function () {


  it('should build valid $templateCache from multiple source-files', function (cb) {
    var stream = templateCache('templates.js');

    stream.on('data', function (file) {
      assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
      assert.equal(file.relative, 'templates.js');
      assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');\n$templateCache.put(\'/template-b.html\',\'<h1 id="template-b">I\\\'m template B!</h1>\');}]);');
      cb();
    });

    stream.write(new Vinyl({
      base: __dirname,
      path: __dirname + '/template-a.html',
      contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
    }));

    stream.write(new Vinyl({
      base: __dirname,
      path: __dirname + '/template-b.html',
      contents: new Buffer('<h1 id="template-b">I\'m template B!</h1>')
    }));

    stream.end();
  });

  it('should allow options as first parameter if no filename is specified', function (cb) {
    var stream = templateCache({
      standalone: true,
      root: '/views'
    });

    stream.on('data', function (file) {
      assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
      assert.equal(file.relative, 'templates.js');
      assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\', []).run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/views/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
      cb();
    });

    stream.write(new Vinyl({
      base: __dirname,
      path: __dirname + '/template-a.html',
      contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
    }));

    stream.end();
  });

  it('should ignore directories', function (cb) {
    var stream = templateCache();

    stream.on('data', function (file) {
      assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
      assert.equal(file.relative, 'templates.js');
      assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/directory/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
      cb();
    });

    stream.write(new Vinyl({
      base: __dirname,
      path: __dirname + '/directory',
      contents: null,
      stat: {
        isDirectory: () => true
      }
    }));

    stream.write(new Vinyl({
      base: __dirname,
      path: __dirname + '/directory/template-a.html',
      contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
    }));

    stream.end();
  });


  describe('options.root', function () {

    it('should set root', function (cb) {
      var stream = templateCache('templates.js', {
        root: '/views'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/views/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should preserve the "./" if there is one in front of the root', function (cb) {
      var stream = templateCache('templates.js', {
        root: './'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'./template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should preserve the "." if there is one in front of the root', function (cb) {
      var stream = templateCache('templates.js', {
        root: '.'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'./template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should preserve the root as is, if the root folder name start with a "." character', function (cb) {
      var stream = templateCache('templates.js', {
        root: '.root/'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'.root/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

  });


  describe('options.transformUrl', function () {

    it('should change the URL to the output of the function', function (cb) {
      var stream = templateCache('templates.js', {
        transformUrl: function(url) {
          return url.replace(/template/, 'tpl');
        }
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/tpl-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should set the final url, after any root option has been applied', function (cb) {
      var stream = templateCache('templates.js', {
        root: './views',
        transformUrl: function(url) {
          return '/completely/transformed/final';
        }
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/completely/transformed/final\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

  });


  describe('options.standalone', function () {

    it('should create standalone Angular module', function (cb) {
      var stream = templateCache('templates.js', {
        standalone: true
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\', []).run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

  });


  describe('options.filename', function () {

    it('should default to templates.js if not specified', function (cb) {
      var stream = templateCache();

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should set filename', function (cb) {
      var stream = templateCache({
        standalone: true,
        root: '/views',
        filename: 'foobar.js'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/foobar.js'));
        assert.equal(file.relative, 'foobar.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\', []).run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/views/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

  });


  describe('options.base', function () {

    it('should set base url', function (cb) {
      var stream = templateCache({
        standalone: true,
        root: '/views',
        base: path.resolve(__dirname, '..')
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\', []).run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/views/test/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should allow functions', function (cb) {
      var stream = templateCache({
        standalone: true,
        root: '/templates',
        base: function (file) {
          return '/all/' + file.relative;
        }
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\', []).run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/templates/all/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

  });


  describe('options.moduleSystem', function () {

    it('should support Browserify-style exports', function (cb) {
      var stream = templateCache('templates.js', {
        moduleSystem: 'Browserify',
        standalone: true
      });

      stream.on('data', function (file) {
        assert.equal(file.path, path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), '\'use strict\'; module.exports = angular.module(\'templates\', []).run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should support RequireJS-style exports', function (cb) {
      var stream = templateCache('templates.js', {
        moduleSystem: 'RequireJS'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'define([\'angular\'], function(angular) { \'use strict\'; return angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);});');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should support ES6-style exports', function (cb) {
      var stream = templateCache('templates.js', {
        moduleSystem: 'ES6'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'import angular from \'angular\'; export default angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

    it('should support IIFE-style exports', function (cb) {
      var stream = templateCache('templates.js', {
        moduleSystem: 'IIFE'
      });

      stream.on('data', function (file) {
        assert.equal(path.normalize(file.path), path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), '(function(){\'use strict\';angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'<h1 id="template-a">I\\\'m template A!</h1>\');}]);})();');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('<h1 id="template-a">I\'m template A!</h1>')
      }));

      stream.end();
    });

  });

  describe('options.templateHeader & options.templateFooter', function () {

    it('should override TEMPLATE_HEADER & TEMPLATE_FOOTER', function (cb) {
      var stream = templateCache('templates.js', {
        templateHeader: 'var template = "',
        templateFooter: '";'
      });

      stream.on('data', function (file) {
        assert.equal(file.path, path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'var template = "$templateCache.put(\'/template-a.html\',\'yoo\');";');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('yoo')
      }));

      stream.end();
    });

    it('should accept empty strings as header and footer', function (cb) {
      var stream = templateCache('templates.js', {
        templateHeader: '',
        templateFooter: ''
      });

      stream.on('data', function (file) { assert
        assert.equal(file.path, path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), '$templateCache.put(\'/template-a.html\',\'yoo\');');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('yoo')
      }));

      stream.end();
    });
  });

  describe('options.templateBody', function () {

    it('should override TEMPLATE_BODY', function (cb) {
      var stream = templateCache('templates.js', {
        templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');',
      });

      stream.on('data', function (file) {
        assert.equal(file.path, path.normalize(__dirname + '/templates.js'));
        assert.equal(file.relative, 'templates.js');
        assert.equal(file.contents.toString('utf8'), 'angular.module(\'templates\').run([\'$templateCache\', function($templateCache) {$templateCache.put(\'/template-a.html\',\'yoo\');}]);');
        cb();
      });

      stream.write(new Vinyl({
        base: __dirname,
        path: __dirname + '/template-a.html',
        contents: new Buffer('yoo')
      }));

      stream.end();
    });

  });


});
