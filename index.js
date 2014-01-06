var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var htmlJsStr = require('js-string-escape');

module.exports = function(filename, options) {
	if (!filename) {
		throw new PluginError('gulp-concat', 'Missing filename option for gulp-angular-templatecache');
	}
	options = options || {};
	options.root = options.root || '';

	var buffer = [];
	var firstFile;

	function bufferFiles(file) {
		if (file.isNull()) {
			return;
		}
		if (file.isStream()) {
			return this.emit('error', new PluginError('gulp-angular-templatecache', 'Streaming not supported'));
		}
		if (!firstFile) {
			firstFile = file;
		}

		buffer.push(file);
	}

	function endStream() {
		if (buffer.length === 0) {
			return this.emit('end');
		}

		var result = 'angular.module("templates", []).run(["$templateCache", function($templateCache) {';

		result += buffer.map(function(file) {
			var url = path.join(options.root, file.path.replace(file.base, ''));
			var template = '$templateCache.put("' + url + '","';
			template += htmlJsStr(file.contents);
			template += '");';
			return template;
		}).join('');

		result += '}]);';

		var resultPath = path.join(firstFile.base, filename);

		var templatesFile = new gutil.File({
			cwd: buffer[0].cwd,
			base: buffer[0].base,
			path: resultPath,
			contents: new Buffer(result)
		});

		this.emit('data', templatesFile);
		this.emit('end');
	}

	return es.through(bufferFiles, endStream);
};
