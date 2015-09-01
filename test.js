'use strict';

var frontMatter = require('./');
var File = require('vinyl');
var stringToStream = require('from2-string');
var test = require('tape');

test('gulp-front-matter', function(t) {
  t.plan(19);

  t.equal(frontMatter.name, 'gulpFrontMatter', 'should have a function name.');

  frontMatter()
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(file, new File(), 'should read null file as it is.');
  })
  .end(new File());

  frontMatter()
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(file.frontMatter, [true], 'should add `frontMatter` property to the file.');
    t.deepEqual(file.contents, new Buffer('Hi'), 'should remove front matter from a buffer.');
  })
  .end(new File({contents: new Buffer('---\n[true]---\nHi')}));

  frontMatter()
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(
      file.frontMatter,
      {},
      'should add `{}` to the `frontMatter` property when the buffer has no front matter.'
    );
    t.deepEqual(
      file.contents,
      new Buffer('--Hello--'),
      'should not modify buffer which has no front matter.'
    );
  })
  .end(new File({
    contents: new Buffer('--Hello--')
  }));

  frontMatter()
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(
      file.contents,
      new Buffer(''),
      'should remove all the contents when the contents include nothing but front matter.'
    );
  })
  .end(new File({
    contents: new Buffer('---\na: 1\n---\n')
  }));

  frontMatter()
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(
      file.frontMatter,
      {a: 1},
      'should extract front matter data from a stream.'
    );
    file.contents
    .on('error', t.fail)
    .on('data', function(chunk) {
      t.deepEqual(chunk, new Buffer('Hi'), 'should remove front matter from stream.');
    });
  })
  .end(new File({
    contents: stringToStream('---\na: 1\n---\nHi')
  }));

  frontMatter({property: 'foo', remove: false})
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(
      file.foo,
      [false],
      'should change property name using `property` option.'
    );
    t.notOk(
      'frontMatter' in file,
      'should not change `frontMatter` property when `property` option isn\'t the default value.'
    );
    t.deepEqual(
      file.contents,
      new Buffer('---\n- false\n---\nHi'),
      'should not modify contents when `remove` option is disabled.'
    );
  })
  .end(new File({contents: new Buffer('---\n- false\n---\nHi')}));

  frontMatter({property: 'data.foo'})
  .on('error', t.fail)
  .on('data', function(file) {
    t.deepEqual(
      file.data,
      {foo: [1]},
      'should change deep properties using `property.subproperty` option.'
    );
  })
  .end(new File({contents: new Buffer('---\n- 1\n---\nHi')}));

  frontMatter()
  .on('error', function(err) {
    t.ok(
      /.*line.*column/.test(err.message),
      'should emit a plugin error when it cannot parse front matter in a buffer as YAML.'
    );
    t.equal(err.fileName, 'foo/bar.yaml', 'should include file name in the error.');
  })
  .end(new File({
    path: 'foo/bar.yaml',
    contents: new Buffer('---\n:\n-{\n---')
  }));

  frontMatter()
  .on('error', function(err) {
    t.ok(
      /.*line.*column/.test(err.message),
      'should emit a plugin error when it cannot parse front matter in a stream as YAML.'
    );
    t.notOk(
      'fileName' in err,
      'should not include file name in the error when the vinyl object doesn\'t have one.'
    );
  })
  .end(new File({
    contents: stringToStream('---\n:\n-{\n---')
  }));

  var deepPropFile = new File({contents: new Buffer('Hi')});
  deepPropFile.data = true;

  frontMatter({property: 'data.foo'})
  .on('error', function(err) {
    t.ok(
      /TypeError.*true/.test(err.message),
      'should emit a plugin error when it fails to set deep property.'
    );
  })
  .end(deepPropFile);

  t.throws(
    frontMatter.bind(null, {property: 1}),
    /.*is not a string.*must be a string/,
    'should throw a plugin error when `property` option is not a string.'
  );
});
