var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var htmlJsStr = require('js-string-escape');

function templateCache(root, base) {
	if (base && base.substr(-1) != path.sep)
		base += path.sep

	return es.map(function(file, cb) {
		var template = '$templateCache.put("<%= url %>","<%= contents %>");';
		var url = path.join(root, file.path.replace(base || file.base, ''));

		if (process.platform === 'win32') {
			url = url.replace(/\\/g, '/');
		}

		file.contents = new Buffer(gutil.template(template, {
			url: url,
			contents: htmlJsStr(file.contents),
			file: file
		}));

		cb(null, file);
	});
}

module.exports = function(filename, options) {
	if (typeof filename === 'string') {
		options = options || {};
	} else {
		options = filename || {};
		filename = options.filename || 'templates.js';
	}

	var templateHeader = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {';
	var templateFooter = '}]);';

	return es.pipeline(
		templateCache(options.root || '', options.base),
		concat(filename),
		header(templateHeader, {
			module: options.module || 'templates',
			standalone: options.standalone ? ', []' : ''
		}),
		footer(templateFooter)
	);
};
