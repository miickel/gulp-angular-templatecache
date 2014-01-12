var es = require('event-stream');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var htmlJsStr = require('js-string-escape');

module.exports = function(filename, options) {
	if (!filename) {
		throw new PluginError('gulp-angular-templatecache', 'Missing filename option for gulp-angular-templatecache');
	}
	options = options || {};
	options.root = options.root || '';
	options.module = options.module || 'templates';

	var buffer = [];

	function bufferFiles(file) {
		if (file.isNull()) {
			return;
		}
		if (file.isStream()) {
			return this.emit('error', new PluginError('gulp-angular-templatecache', 'Streaming not supported'));
		}

		buffer.push(file);
	}

	function templateCache(file) {
		var template = '$templateCache.put("<%= url %>","<%= contents %>");';

		return gutil.template(template, {
			url: path.join(options.root, file.path.replace(file.base, '')),
			contents: htmlJsStr(file.contents),
			file: file
		});
	}

	function endStream() {
		if (buffer.length === 0) {
			return this.emit('end');
		}

		var result = 'angular.module("' + options.module + '", []).run(["$templateCache", function($templateCache) {';
		result += buffer.map(templateCache).join('');
		result += '}]);';

		var resultPath = path.join(buffer[0].base, filename);

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
