// Load plugins

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    lr    = require('tiny-lr'),
    server = lr(),
    livereload = require('gulp-livereload'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    jshint = require('gulp-jshint'),
    express = require('express'),
    csslint = require('gulp-csslint');


// Task to minify all css files in the css directory
gulp.task('minify-css', function(){
  gulp.src('./css/*.css')
    .pipe(minifyCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest('./css/'));
});

// Task to minify all js files in the js directory
gulp.task('minify-js', function() {
  gulp.src('./js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./js/min/'));
});

// Task to optmize and minify images
gulp.task('minify-img', function() {
  return gulp.src('./img/**/*')
    .pipe((imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./img'));
});

// Task to optimize and minify svg
gulp.task('minify-svg', function(){
  gulp.src('./img/svg')
          .pipe(svgmin())
          .pipe(gulp.dest('./img/svg'));
});

// Task to run jshint and pipe output to terminal
gulp.task('jshint', function(){
  gulp.src('./js/*.js')
     .pipe(jshint())
     .pipe(jshint.reporter('jshint-stylish'));

});


// Use csslint without box-sizing or compatible vendor prefixes (these
// don't seem to be kept up to date on what to yell about)
gulp.task('csslint', function(){
  gulp.src('./css/*.css')
    .pipe(csslint({
          'compatible-vendor-prefixes': false,
          'box-sizing': false,
          'important': false
        }))
    .pipe(csslint.reporter());

});

// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./sass/app.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass({loadPath: ['./sass/'], style: "compact"}))
          .pipe(prefix())
          .pipe(gulp.dest('./css/'))
          .pipe(livereload(3000));
      }));
});

// static server function
//
function startServer() {
  var app = express();
  app.use(express.static(__dirname));
  app.listen(3000);
}

/*
   DEFAULT TASK

 • Process sass and lints outputted css
 • Outputted css is run through autoprefixer
 • Runs jshint on all js files in ./js/
 • Sends updates to any files in directory to browser for
   automatic reloading

*/
gulp.task('default', function(){
  startServer();
  gulp.watch(['*.html', './sass/*.scss'], function(event) {
    gulp.run('pre-process', 'csslint');
  });
});

gulp.task('production', function(){
    gulp.run('minify-css', 'minify-img', 'minify-svg');
});

