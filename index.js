'use strict';

const frontMatter = require('front-matter');
const objectPath = require('object-path');
const PluginError = require('gulp-util/lib/PluginError');
const Transform = require('readable-stream/transform');
const tryit = require('tryit');
const VinylBufferStream = require('vinyl-bufferstream');

module.exports = function gulpFrontMatter(options) {
  options = Object.assign({property: 'frontMatter'}, options);

  if (typeof options.property !== 'string') {
    throw new PluginError('gulp-front-matter', new TypeError(
      options.property +
      ' is not a string. "property" option must be a string.'
    ));
  }

  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      const run = new VinylBufferStream((buf, done) => {
        let content;

        tryit(() => {
          content = frontMatter(String(buf), {filename: file.path});
          objectPath.set(file, options.property, content.attributes);
        }, err => {
          if (err) {
            err.message = err.stack.replace(/\n +at[\s\S]*/, '');
            const errorOption = {};
            if (file.path !== undefined) {
              errorOption.fileName = file.path;
            }
            done(new PluginError('gulp-front-matter', err, errorOption));
            return;
          }

          if (options.remove !== false) {
            done(null, new Buffer(content.body));
            return;
          }

          done(null, buf);
        });
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
