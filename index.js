'use strict';

var frontMatter = require('front-matter');
var through = require('through2');
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-front-matter';

module.exports = function(options) {
  options = options || {};

  var propertyName;
  if (options.property !== undefined) {
    if (typeof options.property !== 'string') {
      throw new TypeError(
        options.property +
        ' is not a string. "property" option must be a string.'
      );
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

    if (file.isBuffer()) {
      var content;

      try {
        content = frontMatter(String(file.contents));
      } catch (e) {
        cb(new PluginError(PLUGIN_NAME, e));
        return;
      }

      file[propertyName] = content.attributes;

      if (options.remove !== false) {
        file.contents = new Buffer(content.body);
      }

      cb(null, file);
      return;
    }

    cb(new PluginError(PLUGIN_NAME, 'Cannot get the front matter in a stream'));
  });
};
