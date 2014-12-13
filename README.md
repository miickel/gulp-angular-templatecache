# gulp-angular-templatecache

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://npmjs.org/package/gulp-angular-templatecache)
[![NPM version](http://img.shields.io/npm/v/gulp-angular-templatecache.svg?style=flat)](https://npmjs.org/package/gulp-angular-templatecache)
[![NPM version](http://img.shields.io/npm/dm/gulp-angular-templatecache.svg?style=flat)](https://npmjs.org/package/gulp-angular-templatecache)
[![Build Status](http://img.shields.io/travis/miickel/gulp-angular-templatecache.svg?style=flat)](http://travis-ci.org/miickel/gulp-angular-templatecache)
[![Dependency Status](http://img.shields.io/gemnasium/miickel/gulp-angular-templatecache.svg?style=flat)](https://gemnasium.com/miickel/gulp-angular-templatecache)

> Concatenates and registers AngularJS templates in the `$templateCache`.

<a href="#install">Install</a> |
<a href="#example">Example</a> |
<a href="#api">API</a> |
[Releases](https://github.com/miickel/gulp-angular-templatecache/releases) |
<a href="#license">License</a>

----


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

__Note:__ this plugin will __not__ create a new AngularJS module by default, but use a module called `templates`. If you would like to create a new module, set [options.standalone](https://github.com/miickel/gulp-angular-templatecache#standalone---boolean-standalonefalse) to `true`.


## API

gulp-angular-templatecache([filename](https://github.com/miickel/gulp-angular-templatecache#filename---string-filenametemplatesjs), [options](https://github.com/miickel/gulp-angular-templatecache#options))

---- 

### filename - {string} [filename='templates.js']

> Name to use when concatinating.

### options

#### root - {string} [root='']

> Prefix for template URLs.

#### module - {string} [module='templates']

> Name of AngularJS module.

#### standalone - {boolean} [standalone=false]

> Create a new AngularJS module, instead of using an existing.

#### base {string | function} [base=file.base]

> Override file base path.

#### moduleSystem {string} [moduleSystem]

> Wrap the templateCache in a module system. Currently supported systems: `RequireJS`, `Browserify`.

#### angularVar {string} [angularVar='angular']

> Changes the variable in which angular is saved (and, for which .module is called)
> e.g. ```angularVar = 'myAngular'``` changes the generated code to ```myAngular.module("templates").run(/* ... */);```

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
