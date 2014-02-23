# gulp-angular-templatecache

> Concatenates and registers AngularJS templates in the `$templateCache`.

[![NPM version](https://badge.fury.io/js/gulp-angular-templatecache.png)](https://npmjs.org/package/gulp-angular-templatecache) [![Dependency Status](https://gemnasium.com/miickel/gulp-angular-templatecache.png)](https://gemnasium.com/miickel/gulp-angular-templatecache) [![Build Status](https://secure.travis-ci.org/miickel/gulp-angular-templatecache.png?branch=master)](http://travis-ci.org/miickel/gulp-angular-templatecache)

----
<a href="#install">Install</a> |
<a href="#example">Example</a> |
<a href="#api">API</a> |
[Releases](https://github.com/miickel/gulp-angular-templatecache/releases) |
<a href="#license">License</a>


## Install

Install with [npm](https://npmjs.org/package/gulp-angular-templatecache)

```
npm install gulp-angular-templatecache --save-dev
```


## Example

**gulpfile.js**

> Concatinate the contents of all .html-files in the templates directory and save to _public/templates.js_ (default filename).

```js
var templateCache = require('gulp-angular-templatecache');

gulp.task('default', function () {
	gulp.src('templates/**/*.html')
		.pipe(templateCache())
		.pipe(gulp.dest('public'));
});
```

**Result (_public/templates.js_)**

> Sample output (prettified).

```js
angular.module("templates").run([$templateCache,
  function($templateCache) {
	$templateCache.put("template1.html",
		// template1.html content (escaped)
	);
	$templateCache.put("template2.html",
		// template2.html content (escaped)
	);
	// etc.
  }
]);

```

Include this file in your app and AngularJS will use the $templateCache when available.


## API

gulp-angular-templatecache([filename](#filename), [options](#options))

---- 

### filename

> Name to use when concatinating.

Default: `templates.js`

----

### options

#### root (String)

> Prefix for template URLs.

Default: `''`

#### module (String)

> Name of AngularJS module.

Default: `templates`

#### standalone (Boolean)

> Create a new AngularJS module, instead of using an existing.

Default: `false`

#### base (String)

> Allows you to override file base path.

Default: file.base (file path of the current file being processed)


## Changes

> This plugin uses Semantic Versioning 2.0.0

### 1.1.0 and newer

See [Releases](https://github.com/miickel/gulp-angular-templatecache/releases)

### 1.0.0

> Cleaner code, more tests and improved documentation. Thoroughly used in development.

- adds
	- `options.standalone` (**breaking**)
- fixes
	- Windows support
- changes
	- `filename` now optional

### 0.3.0

- adds
	- `options.module`

### 0.2.0 and earlier

> Only used by mad men

![](http://media3.giphy.com/media/bAplZhiLAsNnG/giphy.gif)


## License

The MIT License (MIT)

Copyright (c) 2014 [Mickel](http://mickel.me)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![Analytics](https://ga-beacon.appspot.com/UA-46880034-1/gulp-angular-templatecache/readme?pixel)](https://github.com/igrigorik/ga-beacon)
