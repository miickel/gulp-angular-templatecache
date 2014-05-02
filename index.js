var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var htmlJsStr = require('js-string-escape');

function templateCache(root, base, prefixVar) {
  if (base && base.substr(-1) !== path.sep) {
    base += '/';
  }

  return es.map(function(file, callback) {
    var template = '$templateCache.put(<%= prefixVar %>"<%= url %>","<%= contents %>");';
    var url = path.join(root, file.path.replace(base || file.base, ''));

    if (process.platform === 'win32') {
      url = url.replace(/\\/g, '/');
    }

    file.contents = new Buffer(gutil.template(template, {
      url: url,
      prefixVar: prefixVar ? prefixVar + "+" : "",
      contents: htmlJsStr(file.contents),
      file: file
    }));

    callback(null, file);
  });
}

module.exports = function(filename, options) {
  if (typeof filename === 'string') {
    options = options || {};
  } else {
    options = filename || {};
    filename = options.filename || 'templates.js';
  }

  var templateHeader = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache"<%= injectString %>, function($templateCache<%= injectVar %>) {';
  var templateFooter = '}]);';

  return es.pipeline(
    templateCache(options.root || '', options.base, options.var),
    concat(filename),
    header(templateHeader, {
      module: options.module || 'templates',
      standalone: options.standalone ? ', []' : '',
      injectString: options.var ? ', "' + options.var + '"' : '',
      injectVar: options.var ? ', ' + options.var : ''
    }),
    footer(templateFooter)
  );
};
