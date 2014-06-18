var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var htmlJsStr = require('js-string-escape');

function templateCache(options) {
  var root = options.root || '', base = options.base;

  if (typeof base !== 'function' && base && base.substr(-1) !== path.sep) {
    base += '/';
  }

  var template    = '$templateCache.put("<%= url %>","<%= contents %>");';
  var prettyTemplate = '  $templateCache.put("<%= url %>",\n    "<%= contents %>"\n  );\n';

  return es.map(function(file, callback) {
    var url;

    file.path = path.normalize(file.path);

    if (typeof base === 'function') {
      url = path.join(root, base(file));
    } else {
      url = path.join(root, file.path.replace(base || file.base, ''));
    }

    if (process.platform === 'win32') {
      url = url.replace(/\\/g, '/');
    }

    if (options.pretty === true) {
      file.contents = new Buffer(gutil.template(prettyTemplate, {
        url: url,
        contents: htmlJsStr(file.contents).replace(/(\\r)?\\n/g, "\\n\" +\n    \""),
        file: file
      }));
    } else {
      file.contents = new Buffer(gutil.template(template, {
        url: url,
        contents: htmlJsStr(file.contents),
        file: file
      }));
    }

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

  var templateHeader = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {\n';
  var templateFooter = '\n}]);';

  return es.pipeline(
    templateCache(options),
    concat(filename),
    header(templateHeader, {
      module: options.module || 'templates',
      standalone: options.standalone ? ', []' : ''
    }),
    footer(templateFooter)
  );
};
