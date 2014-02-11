var es = require('event-stream');
var _ = require('lodash');
var frontMatter = require('front-matter');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-front-matter';

module.exports = function (options) {

  // Default options
  options = _.extend({
    property: 'frontMatter',
    remove:   true
  }, options || {});

  return es.map(function (file, cb) {
    var content;

    if (file.isBuffer()) {
      try {
        content = frontMatter(String(file.contents));
      } catch (e) {
        return cb(new gutil.PluginError(PLUGIN_NAME, e));
      }

      file[options.property] = content.attributes;
      if (options.remove) {
        file.contents = new Buffer(content.body);
      }
    } else if (file.isNull()) {
      return cb(null, file);
    } else  {
      // stream
      // @ToDo implement the stream handling 
      return cb(new gutil.PluginError(PLUGIN_NAME, 'gulp-front-matter: Cannot get the front matter in a stream'));
    }

    cb(null, file);
  });
};
