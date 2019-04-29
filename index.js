var mapStream = require('map-stream');
var streamCombiner = require('stream-combiner');
var path = require('path');
var through2 = require('through2');
var lodashTemplate = require('lodash.template');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var jsesc = require('jsesc');

/**
 * "constants"
 */

var TEMPLATE_HEADER = 'angular.module(\'<%= module %>\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {';
var TEMPLATE_BODY = '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');';
var TEMPLATE_FOOTER = '}]);';

var DEFAULT_FILENAME = 'templates.js';
var DEFAULT_MODULE = 'templates';
var MODULE_TEMPLATES = {

  requirejs: {
    header: 'define([\'angular\'], function(angular) { \'use strict\'; return ',
    footer: '});'
  },

  browserify: {
    header: '\'use strict\'; module.exports = '
  },

  es6: {
    header: 'import angular from \'angular\'; export default ',
  },

  iife: {
    header: '(function(){\'use strict\';',
    footer: '})();'
  }

};

/**
 * Add files to templateCache.
 */

function templateCacheFiles(root, base, templateBody, transformUrl, escapeOptions) {

  return function templateCacheFile(file, callback) {
    if (file.processedByTemplateCache) {
      return callback(null, file);
    }

    if (file.stat && file.stat.isDirectory()) {
      return callback(null, file);
    }

    var template = templateBody || TEMPLATE_BODY;
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

    if (root === '.' || root.indexOf('./') === 0) {
      url = './' + url;
    }

    if (typeof transformUrl === 'function') {
      url = transformUrl(url);
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

    file.contents = Buffer.from(lodashTemplate(template)({
      url: url,
      contents: jsesc(file.contents.toString('utf8'), escapeOptions),
      file: file
    }));

    file.processedByTemplateCache = true;

    callback(null, file);

  };

}

/**
 * templateCache a stream of files.
 */

function templateCacheStream(root, base, templateBody, transformUrl, escapeOptions) {

  /**
   * Set relative base
   */

  if (typeof base !== 'function' && base && base.substr(-1) !== path.sep) {
    base += path.sep;
  }

  /**
   * templateCache files
   */

  return mapStream(templateCacheFiles(root, base, templateBody, transformUrl, escapeOptions));

}

/**
 * Wrap templateCache with module system template.
 */

function wrapInModule(moduleSystem) {
  var moduleTemplate = MODULE_TEMPLATES[moduleSystem];

  if (!moduleTemplate) {
    return through2.obj();
  }

  return streamCombiner(
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
   * Prepare header / footer
   */

  var templateHeader = 'templateHeader' in options ? options.templateHeader : TEMPLATE_HEADER;
  var templateFooter = 'templateFooter' in options ? options.templateFooter : TEMPLATE_FOOTER;

  /**
   * Build templateCache
   */

  return streamCombiner(
    templateCacheStream(options.root || '', options.base, options.templateBody, options.transformUrl, options.escapeOptions || {}),
    concat(filename),
    header(templateHeader, {
      module: options.module || DEFAULT_MODULE,
      standalone: options.standalone ? ', []' : ''
    }),
    footer(templateFooter, {
      module: options.module || DEFAULT_MODULE
    }),
    wrapInModule(options.moduleSystem)
  );

}


/**
 * Expose templateCache
 */

module.exports = templateCache;
