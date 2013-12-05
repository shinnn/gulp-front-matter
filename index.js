var es = require('event-stream');
var _ = require('lodash');
var frontMatter = require('front-matter');

module.exports = function (options) {

  // Default options
  options = _.extend({
    property: 'frontMatter',
    remove:   true
  }, options || {});

  return es.map(function (file, cb) {
    var content;
    try {
      content = frontMatter(String(file.contents));
    } catch (e) {
      return cb(e);
    }

    file = _.clone(file);
    file[options.property] = content.attributes;
    if (options.remove) {
      file.contents = new Buffer(content.body);
    }

    cb(null, file);
  });
};
