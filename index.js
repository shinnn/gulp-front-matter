'use strict';

var BufferStreams = require('bufferstreams');
var frontMatter = require('front-matter');
var PluginError = require('gulp-util').PluginError;
var through = require('through2');
var tryit = require('tryit');

module.exports = function gulpFrontMatter(options) {
  options = options || {};

  var propertyName;
  if (options.property !== undefined) {
    if (typeof options.property !== 'string') {
      throw new PluginError('gulp-front-matter', new TypeError(
        options.property +
        ' is not a string. "property" option must be a string.'
      ));
    }
    propertyName = options.property;
  } else {
    propertyName = 'frontMatter';
  }

  return through.obj(function gulpFrontMatterTransform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    function run(buf, done) {
      var content;

      tryit(function() {
        content = frontMatter(String(buf), {filename: file.path});
      }, function(err) {
        if (err) {
          err.message = err.stack.replace(/\n +at[\s\S]*/, '');
          err.fileName = file.path;
          done(new PluginError('gulp-front-matter', err));
          return;
        }

        file[propertyName] = content.attributes;
        if (options.remove !== false) {
          done(null, new Buffer(content.body));
          return;
        }

        done(null, buf);
      });
    }

    var self = this;

    if (file.isStream()) {
      file.contents = file.contents.pipe(new BufferStreams(function(none, buf, done) {
        run(buf, function(err, contents) {
          if (err) {
            self.emit('error', err);
            done(err);
          } else {
            done(null, contents);
            self.push(file);
          }
          cb();
        });
      }));
      return;
    }

    run(file.contents, function(err, contents) {
      if (err) {
        self.emit('error', err);
      } else {
        file.contents = contents;
        self.push(file);
      }
      cb();
    });
  });
};
