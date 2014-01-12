# [gulp](https://github.com/wearefractal/gulp)-angular-templatecache [![Build Status](https://secure.travis-ci.org/miickel/gulp-angular-templatecache.png?branch=master)](http://travis-ci.org/miickel/gulp-angular-templatecache)

> Concatenates and registers AngularJS templates in the $templateCache.

*For more information about why this could be useful, please refer to this [introduction to $templateCache](http://www.thinkster.io/pick/puguRrgU4O/angularjs-templatecache).*


## Install

Install with [npm](https://npmjs.org/package/gulp-angular-templatecache)

```
npm install gulp-angular-templatecache --save-dev
```


## Example

```js
var gulp = require('gulp');
var templates = require('gulp-angular-templatecache');

gulp.task('default', function () {
	gulp.src('templates/**/*.html')
		.pipe(templates('templates.js'))
		.pipe(gulp.dest('public/templates'));
});
```

This concatenates all .html-files in the templates directory and outputs a JavaScript file (templates.js in this case).

The plugin produces spaghetti similar to the lines below.

```js
angular.module("templates", []).run([$templateCache,
  function($templateCache) {
    $templateCache.put("404.html", "<h2>Watthaphuck?!</h2><div class=\"alert alert-danger\"><p>The page you are looking for does not exist. Classic 404, homie!</p></div><img src=\"http://www.reactiongifs.com/wp-content/uploads/2013/10/tom-delonge-wtf1.gif\" class=\"img-responsive\"/>");
    
    // ... and the rest of your templates in a similar fashion
  }
]);

```
You can now include the generated .js-file and AngularJS will load and cache all your templates at once, using only one request. Profit!

## API

### gulp-angular-templatecache(filename, options)

#### filename

Type: `String`  
Required: `true`

Name of the JavaScript file gulp should write to.

#### options.root

Type: `String`  
Default: `''`

Sets the root used in output (e.g. $templateCache.put(path.join(root, filepath))...)

#### options.module

Type: `String`  
Default: `templates`

Sets the name of the Angular module used in output.

## License

MIT © [Mickel](http://mickel.me)

[![Analytics](https://ga-beacon.appspot.com/UA-46880034-1/gulp-angular-templatecache/readme?pixel)](https://github.com/igrigorik/ga-beacon)
