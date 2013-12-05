"use strict";

var gulp = require('gulp');
var expect = require('chai').expect;

var es = require('event-stream');
var fs = require('fs');
var path = require('path');

var frontMatter = require('../');


var input = __dirname + '/fixtures/*.md';

function test (input, options, check) {
  return function (done) {
    gulp.src(input)
      // Keep original contents
      .pipe(es.map(function (file, cb) {
        file.originalContents = file.contents;
        cb(null, file);
      }))
      // Execute plugin
      .pipe(frontMatter(options))
      // Test
      .pipe(es.map(check).on('end', done));
  };
}


describe('gulp-front-matter', function() {

  it('should extract front-matter header and modify contents', test(input, {}, function (file, cb) {
    expect(file.frontMatter).to.be.an('object').and.have.property('layout');
    expect(file.originalContents.length).to.be.greaterThan(file.contents.length);
    cb();
  }));

  it('should keep contents unchanged if remove = false', test(input, {remove: false}, function (file, cb) {
    expect(String(file.originalContents)).to.equal(String(file.contents));
    cb();
  }));

  it('should be able to customize property name', test(input, {property: 'data'}, function (file, cb) {
    expect(file.frontMatter).to.be.undefined;
    expect(file.data).to.be.an('object').and.have.property('layout');
    cb();
  }));
});
