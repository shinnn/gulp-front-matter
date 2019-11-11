'use strict';

const matter = require('gray-matter');
const inspectWithKind = require('inspect-with-kind');
const objectPath = require('object-path');
const PluginError = require('plugin-error');
const {Transform} = require('stream');
const VinylBufferStream = require('vinyl-bufferstream');

const PROPERTY_ERROR = 'Expected `property` option to be a string';

module.exports = function gulpFrontMatter(...args) {
	const argLen = args.length;

	if (argLen > 1) {
		throw new PluginError('gulp-front-matter', `Expected 0 or 1 argument ([<Object>]), but got ${argLen} arguments.`);
	}

	const options = {property: 'frontMatter', ...args[0]};

	if (typeof options.property !== 'string') {
		throw new PluginError('gulp-front-matter', `${PROPERTY_ERROR}, but a non-string value ${
			inspectWithKind(options.property)
		} was provided.`);
	}

	return new Transform({
		objectMode: true,
		transform(file, enc, cb) {
			const run = new VinylBufferStream((buf, done) => {
				let content;

				try {
					content = matter(String(buf), {filename: file.path});
					objectPath.set(file, options.property, content.data);
				} catch (err) {
					err.message = err.stack.replace(/\n +at[\s\S]*/u, '');
					const errorOption = {};

					if (file.path !== undefined) {
						errorOption.fileName = file.path;
					}

					done(new PluginError('gulp-front-matter', err, errorOption));
					return;
				}

				if (options.remove !== false) {
					done(null, Buffer.from(content.content));
					return;
				}

				done(null, buf);
			});

			run(file, (err, contents) => {
				if (err) {
					this.emit('error', err);
				} else {
					file.contents = contents;
					this.push(file);
				}

				cb();
			});
		}
	});
};
