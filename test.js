'use strict';

const gulpFrontMatter = require('.');
const File = require('vinyl');
const toReadableStream = require('to-readable-stream');
const test = require('tape');

test('gulp-front-matter', t => {
	t.plan(19);

	gulpFrontMatter()
	.on('error', t.fail)
	.on('data', file => {
		t.deepEqual(file, new File(), 'should read null file as it is.');
	})
	.end(new File());

	gulpFrontMatter()
	.on('error', t.fail)
	.on('data', ({contents, frontMatter}) => {
		t.deepEqual(frontMatter, [true], 'should add `frontMatter` property to the file.');
		t.deepEqual(contents, Buffer.from('Hi'), 'should remove front matter from a buffer.');
	})
	.end(new File({contents: Buffer.from('---\n- true\n---\nHi')}));

	gulpFrontMatter()
	.on('error', t.fail)
	.on('data', ({contents, frontMatter}) => {
		t.deepEqual(
			frontMatter,
			{},
			'should add `{}` to the `frontMatter` property when the buffer has no front matter.'
		);
		t.ok(
			contents.equals(Buffer.from('--Hello--')),
			'should not modify buffer which has no front matter.'
		);
	})
	.end(new File({contents: Buffer.from('--Hello--')}));

	gulpFrontMatter()
	.on('error', t.fail)
	.on('data', ({contents}) => {
		t.deepEqual(
			contents,
			Buffer.alloc(0),
			'should remove all the contents when the contents include nothing but front matter.'
		);
	})
	.end(new File({contents: Buffer.from('---\na: 1\n---\n')}));

	gulpFrontMatter()
	.on('error', t.fail)
	.on('data', file => {
		t.deepEqual(
			file.frontMatter,
			{a: 1},
			'should extract front matter data from a stream.'
		);
		file.contents
		.on('error', t.fail)
		.on('data', chunk => {
			t.ok(chunk.equals(Buffer.from('Hi')), 'should remove front matter from stream.');
		});
	})
	.end(new File({contents: toReadableStream('---\na: 1\n---\nHi')}));

	gulpFrontMatter({property: 'foo', remove: false})
	.on('error', t.fail)
	.on('data', file => {
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
			Buffer.from('---\n- false\n---\nHi'),
			'should not modify contents when `remove` option is disabled.'
		);
	})
	.end(new File({contents: Buffer.from('---\n- false\n---\nHi')}));

	gulpFrontMatter({property: 'data.foo'})
	.on('error', t.fail)
	.on('data', ({data}) => {
		t.deepEqual(
			data,
			{foo: [1]},
			'should change deep properties using `property.subproperty` option.'
		);
	})
	.end(new File({contents: Buffer.from('---\n- 1\n---\nHi')}));

	gulpFrontMatter()
	.on('error', ({fileName, message}) => {
		t.ok(
			/.*line.*column/u.test(message),
			'should emit a plugin error when it cannot parse front matter in a buffer as YAML.'
		);
		t.ok(/^foo(\\|\/)bar\.yaml$/.test(fileName), 'should include file name in the error.');
	})
	.end(new File({
		path: 'foo/bar.yaml',
		contents: Buffer.from('---\n:\n-{\n---')
	}));

	gulpFrontMatter()
	.on('error', err => {
		t.ok(
			/.*line.*column/u.test(err.message),
			'should emit a plugin error when it cannot parse front matter in a stream as YAML.'
		);
		t.notOk(
			'fileName' in err,
			'should not include file name in the error when the vinyl object doesn\'t have one.'
		);
	})
	.end(new File({contents: toReadableStream('---\n:\n-{\n---')}));

	const deepPropFile = new File({contents: Buffer.from('Hi')});
	deepPropFile.data = true;

	gulpFrontMatter({property: 'data.foo'})
	.on('error', err => {
		t.ok(
			/^TypeError.*true/u.test(err.message),
			'should emit a plugin error when it fails to set deep property.'
		);
	})
	.end(deepPropFile);

	t.throws(
		() => gulpFrontMatter({property: 1}),
		/Expected `property` option to be a string, but a non-string value 1 \(number\) was provided\./u,
		'should throw a plugin error when `property` option is not a string.'
	);

	t.throws(
		() => gulpFrontMatter({}, {}),
		/Expected 0 or 1 argument \(\[<Object>\]\), but got 2 arguments\./u,
		'should throw a plugin error when `property` option is not a string.'
	);
});
