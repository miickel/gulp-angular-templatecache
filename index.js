var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var PluginError = gutil.PluginError;
var htmlJsStr = require('js-string-escape');

function templateCache(root) {
	return es.map(function(file, cb) {
		var template = '$templateCache.put("<%= url %>","<%= contents %>");';

		file.contents = new Buffer(gutil.template(template, {
			url: path.join(root, file.path.replace(file.base, '')),
			contents: htmlJsStr(file.contents),
			file: file
		}));

		cb(null, file);
	});
}

module.exports = function(filename, options) {
	if (!filename) {
		throw new PluginError('gulp-angular-templatecache', 'Missing filename option for gulp-angular-templatecache');
	}
	options = options || {};

	var templateHeader = 'angular.module("<%= module %>", []).run(["$templateCache", function($templateCache) {';
	var templateFooter = '}]);'

	return es.pipeline(
		templateCache(options.root || ''),
		concat(filename),
		header(templateHeader, {
			module: options.module || 'templates'
		}),
		footer(templateFooter)
	)
};
