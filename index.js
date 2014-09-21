var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var htmlJsStr = require('js-string-escape');

/**
 * "constants"
 */

var TEMPLATE_HEADER = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {';
var TEMPLATE_FOOTER = '}]);';
var DEFAULT_FILENAME = 'templates.js';
var DEFAULT_MODULE = 'templates';


/**
 * Add files to templateCache.
 */

function templateCacheFiles(root, base) {

  return function templateCacheFile(file, callback) {
    var template = '$templateCache.put("<%= url %>","<%= contents %>");';
    var url;

    file.path = path.normalize(file.path);

    /**
     * Rewrite url
     */

    if (typeof base === 'function') {
      url = path.join(root, base(file));
    } else {
      url = path.join(root, file.path.replace(base || file.base, ''));
    }

    /**
     * Normalize url (win only)
     */

    if (process.platform === 'win32') {
      url = url.replace(/\\/g, '/');
    }

    /**
     * Create buffer
     */

    file.contents = new Buffer(gutil.template(template, {
      url: url,
      contents: htmlJsStr(file.contents),
      file: file
    }));

    callback(null, file);

  };

}


/**
 * templateCache a stream of files.
 */

function templateCacheStream(root, base) {

  /**
   * Set relative base
   */

  if (typeof base !== 'function' && base && base.substr(-1) !== path.sep) {
    base += '/';
  }

  /**
   * templateCache files
   */

  return es.map(templateCacheFiles(root, base));

}


/**
 * Concatenates and registers AngularJS templates in the $templateCache.
 *
 * @param {string} [filename='templates.js']
 * @param {object} [options]
 */

function templateCache(filename, options) {

  /**
   * Prepare options
   */

  if (typeof filename === 'string') {
    options = options || {};
  } else {
    options = filename || {};
    filename = options.filename || DEFAULT_FILENAME;
  }

  /**
   * Build templateCache
   */

  return es.pipeline(
    templateCacheStream(options.root || '', options.base),
    concat(filename),
    header(TEMPLATE_HEADER, {
      module: options.module || DEFAULT_MODULE,
      standalone: options.standalone ? ', []' : ''
    }),
    footer(TEMPLATE_FOOTER)
  );

}


/**
 * Expose templateCache
 */

module.exports = templateCache;
