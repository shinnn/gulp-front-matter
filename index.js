'use strict';

var frontMatter = require('front-matter');
var objectPath = require('object-path');
var PluginError = require('gulp-util').PluginError;
var Transform = require('readable-stream/transform');
var tryit = require('tryit');
var VinylBufferStream = require('vinyl-bufferstream');

module.exports = function gulpFrontMatter(options) {
  options = options || {};

  var property;
  if (options.property !== undefined) {
    if (typeof options.property !== 'string') {
      throw new PluginError('gulp-front-matter', new TypeError(
        options.property +
        ' is not a string. "property" option must be a string.'
      ));
    }
    property = options.property;
  } else {
    property = 'frontMatter';
  }

  return new Transform({
    objectMode: true,
    transform: function gulpFrontMatterTransform(file, enc, cb) {
      var run = new VinylBufferStream(function(buf, done) {
        var content;

        tryit(function() {
          content = frontMatter(String(buf), {filename: file.path});
          objectPath.set(file, property, content.attributes);
        }, function(err) {
          if (err) {
            err.message = err.stack.replace(/\n +at[\s\S]*/, '');
            var errorOption = {};
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

      var self = this;

      run(file, function(err, contents) {
        if (err) {
          self.emit('error', err);
        } else {
          file.contents = contents;
          self.push(file);
        }
        cb();
      });
    }
  });
};
