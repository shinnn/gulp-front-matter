'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var expect = require('chai').expect;

var mapStream = require('map-stream');
var path = require('path');
var stream = require('stream');

var frontMatter = require('..');

var input = path.join(__dirname, 'fixtures/*.md');

function test(input, options, check) {
  return function(done) {
    gulp.src(input)
      // Keep original contents
      .pipe(mapStream(function(file, cb) {
        file.originalContents = file.contents;
        cb(null, file);
      }))
      // Execute plugin
      .pipe(frontMatter(options))
      // Test
      .pipe(mapStream(check).on('end', done));
  };
}

describe('gulp-front-matter', function() {

  it('should extract front-matter header and modify contents', test(input, {}, function(file, cb) {
    expect(file.frontMatter).to.be.an('object').and.have.property('layout');
    expect(file.originalContents.length).to.be.greaterThan(file.contents.length);
    cb();
  }));

  it('should keep contents unchanged if remove = false', test(input, {remove: false}, function(file, cb) {
    expect(String(file.originalContents)).to.equal(String(file.contents));
    cb();
  }));

  it('should be able to customize property name', test(input, {property: 'data'}, function(file, cb) {
    expect(file).to.not.have.property('frontMatter');
    expect(file.data).to.be.an('object').and.have.property('layout');
    cb();
  }));

  it('should raise a plugin error for stream file', function(done) {
    var streamFile = new gutil.File({contents: new stream.Stream()});
    var fm = frontMatter()
      .on('error', function(err) {
        expect(err).to.be.an.instanceOf(gutil.PluginError);
        done();
      })
      .on('end', function() {
        done(new Error('Stream end without error'));
      });
    fm.write(streamFile);
    fm.end();
  });

  it('should get null file through', function(done) {
    var nullFile = new gutil.File();
    var fm = frontMatter()
      .on('data', function(file) {
        expect(file).to.be.equal(nullFile);
      })
      .on('end', done);
    fm.write(nullFile);
    fm.end();
  });
});
