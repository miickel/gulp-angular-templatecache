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
var MODULE_TEMPLATES = {

  requirejs: {
    header: 'define([\'angular\'], function(angular) { \'use strict\'; return ',
    footer: '});'
  },

  browserify: {
    header: 'module.exports = '
  }

};

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
 * Wrap templateCache with module system template.
 */

function wrapInModule(moduleSystem) {
  var moduleTemplate = MODULE_TEMPLATES[moduleSystem];

  if (!moduleTemplate) {
    return gutil.noop();
  }

  return es.pipeline(
    header(moduleTemplate.header || ''),
    footer(moduleTemplate.footer || '')
  );

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
   * Normalize moduleSystem option
   */

  if (options.moduleSystem) {
    options.moduleSystem = options.moduleSystem.toLowerCase();
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
    footer(TEMPLATE_FOOTER),
    wrapInModule(options.moduleSystem)
  );

}


/**
 * Expose templateCache
 */

module.exports = templateCache;
