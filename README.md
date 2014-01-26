# gulp-angular-templatecache [![Build Status](https://secure.travis-ci.org/miickel/gulp-angular-templatecache.png?branch=master)](http://travis-ci.org/miickel/gulp-angular-templatecache)

> Concatenates and registers AngularJS templates in the `$templateCache`.


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

### filename (String)

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


## Changes

> This plugin uses Semantic Versioning 2.0.0

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

MIT © [Mickel](http://mickel.me)

[![Analytics](https://ga-beacon.appspot.com/UA-46880034-1/gulp-angular-templatecache/readme?pixel)](https://github.com/igrigorik/ga-beacon)
