var gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  jade = require('gulp-jade'),
  connect = require('gulp-connect'),
  plumber = require('gulp-plumber'),
  less = require('gulp-less'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sources = {
    coffee: "src/coffee/**/*.coffee",
    jade: 'src/jade/**/*.jade',
    docs: "src/jade/*.jade",
    less: "src/less/**/*.less",
    style: "src/less/style.less",
    overwatch: "./out/**/*.*"
  },
  destinations = {
    js: "./out/js/",
    docs: "./out/",
    css: "./out/css/",
    dist: "./dist/"
  };
/*SERVER TASK*/
gulp.task('reload', function(event) {
  return gulp.src(sources.overwatch)
    .pipe(connect.reload());
});
gulp.task('serve', ['build'], function(event) {
  connect.server({
    root: destinations.docs,
    port: 1987,
    livereload: true
  });
  // sets up a livereload that watches for any changes in the root
  gulp.watch(sources.overwatch, ['reload']);
});
/*COFFEE TASK*/
gulp.task('coffee:compile', function(event) {
  return gulp.src(sources.coffee)
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest(destinations.js));
});
/*COFFEE WATCH TASK FOR DEVELOPMENT*/
gulp.task('coffee:watch', function(event) {
  gulp.watch(sources.coffee, ['coffee:compile']);
});
/*LESS TASK*/
gulp.task('less:compile', function(event) {
  return gulp.src(sources.style)
    .pipe(plumber())
    .pipe(less({
      compress: true
    }))
    .pipe(gulp.dest(destinations.css));
});
/*LESS WATCH TASK FOR DEVELOPMENT*/
gulp.task('less:watch', function(event) {
  gulp.watch(sources.less, ['less:compile']);
});
/*JADE TASK*/
gulp.task('jade:compile', function(event) {
  return gulp.src(sources.docs)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(destinations.docs));
});
/*JADE WATCH TASK FOR DEVELOPMENT*/
gulp.task('jade:watch', function(event){
  gulp.watch(sources.jade, ['jade:compile']);
});
gulp.task('build', ['jade:compile', 'less:compile', 'coffee:compile']);
/*DEFAULT TASK*/
gulp.task('default', ["serve", "jade:watch", "less:watch", "coffee:watch"]);
