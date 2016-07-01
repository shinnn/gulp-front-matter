# gulp-front-matter 

[![NPM version](http://img.shields.io/npm/v/gulp-front-matter.svg)](https://www.npmjs.com/package/gulp-front-matter)
[![Build Status](http://img.shields.io/travis/shinnn/gulp-front-matter.svg)](http://travis-ci.org/shinnn/gulp-front-matter)
[![Build status](https://ci.appveyor.com/api/projects/status/uklpp61n71y0pvr2?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/gulp-front-matter)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/gulp-front-matter.svg)](https://coveralls.io/r/shinnn/gulp-front-matter)
[![Dependency Status](https://david-dm.org/shinnn/gulp-front-matter.svg)](https://david-dm.org/shinnn/gulp-front-matter)
[![devDependency Status](https://david-dm.org/shinnn/gulp-front-matter/dev-status.svg)](https://david-dm.org/shinnn/gulp-front-matter#info=devDependencies)

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

[Use npm.](https://docs.npmjs.com/cli/install)

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

## LICENSE (BSD 2-Clause)

> Copyright (c) 2013 - 2015, Nicolas Chambrier
> Copyright (c) 2016, Shinnosuke Watanabe
> All rights reserved.
>
> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
>
> 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
>
> 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
