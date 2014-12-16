'use strict';

var frontMatter = require('front-matter');
var mapStream = require('map-stream');
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

  return mapStream(function(file, cb) {
    var content;

    if (file.isBuffer()) {
      try {
        content = frontMatter(String(file.contents));
      } catch (e) {
        return cb(new PluginError(PLUGIN_NAME, e));
      }

      file[propertyName] = content.attributes;
      if (options.remove !== false) {
        file.contents = new Buffer(content.body);
      }
    } else if (file.isNull()) {
      return cb(null, file);
    } else {
      // stream
      // @ToDo implement the stream handling
      return cb(new PluginError(PLUGIN_NAME, 'gulp-front-matter: Cannot get the front matter in a stream'));
    }

    cb(null, file);
  });
};
