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
    
    if (file.isBuffer()) {
      content = frontMatter(String(file.contents));

      // _.clone(file) throws an error in the actual gulp version
      // file = _.clone(file);
      file[options.property] = content.attributes;
      if (options.remove) {
        file.contents = new Buffer(content.body);
      } else {
        file.contents = new Buffer(content);
      }
    } else {
      // stream
      // @ToDo implement the stream handling 
      return cb(new Error('gulp-front-matter: Cannot get the front matter in a stream'), file);
    }

    // try {
    //   content = frontMatter(String(file.contents));
    // } catch (e) {
    //   return cb(e);
    // }

    // file = _.clone(file);
    // file[options.property] = content.attributes;
    // if (options.remove) {
    //   file.contents = new Buffer(content.body);
    // }

    cb(null, file);
  });
};
