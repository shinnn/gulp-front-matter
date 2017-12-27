# gulp-front-matter

[![npm version](http://img.shields.io/npm/v/gulp-front-matter.svg)](https://www.npmjs.com/package/gulp-front-matter)
[![Build Status](https://travis-ci.org/shinnn/gulp-front-matter.svg?branch=master)](https://travis-ci.org/shinnn/gulp-front-matter)
[![Build status](https://ci.appveyor.com/api/projects/status/uklpp61n71y0pvr2/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/gulp-front-matter/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/gulp-front-matter.svg)](https://coveralls.io/r/shinnn/gulp-front-matter)

## Information

<table>
<tr>
<td>Package</td><td>gulp-front-matter</td>
</tr>
<tr>
<td>Description</td>
<td>Extract `YAML Front-Matter` header from files, removes it from `contents` and add a new `frontMatter` property to file object.</td>
</tr>
<tr>
<td>Node Version</td>
<td>≥ 4</td>
</tr>
</table>

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install gulp-front-matter
```

## Usage

```javascript
const gulp = require('gulp');
const frontMatter = require('gulp-front-matter');

gulp.task('blog-posts', () => {
  return gulp.src('./posts/*.md')
    .pipe(frontMatter({ // optional configuration
      property: 'frontMatter', // property added to file object
                               // also works with deep property selectors
                               // e.g., 'data.foo.bar'
      remove: true // should we remove front-matter header?
    }))
    .pipe(…) // you may want to take a look at gulp-marked at this point
});
```

## LICENSE

[2-Clause BSD License](./LICENSE) © 2013 - 2015 Nicolas Chambrier, 2016 - 2017 Shinnosuke Watanabe
