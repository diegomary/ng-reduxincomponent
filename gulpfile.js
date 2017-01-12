var gulp          = require('gulp');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var browserSync   = require('browser-sync').create();
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');

// Where our files are located
var jsFiles   = "src/js/**/*.js";
var htmlFiles = "src/**/*.html";
var cssFiles = "src/css/**/*.css";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('browserify',  function(cb) {
  return browserify('./src/js/app.js')
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)
      .bundle()

      .on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))

      // Start piping stream to tasks!
      .pipe(gulp.dest('./build/'));
});

gulp.task('html', function() {
  return gulp.src([htmlFiles], {
        base: 'src'
    })
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/'));
});
//


gulp.task('css',  function () {
        return gulp.src([cssFiles], {
            base: 'src'
        }).pipe(gulp.dest('./build'));
    });


gulp.task('uglify', ['browserify'], function() {
  return gulp.src("build/main.js")
  .pipe(uglify())
  .pipe(rename('main-min.js'))
.pipe(gulp.dest('./build/'));

});

// Some notes here task default will start after task browserify completes
// however, task uglify is bound to start when browserify ends.
// the html task has no problem of precedence and can run cuncurrently as well
// as the css task
gulp.task('default', ['browserify','uglify','html','css'], function() {

  browserSync.init(['./build/**/**.**'], {
    server: "./build",
    port: 4000,
    notify: false,
    ui: {
      port: 4001
    }
  });

  gulp.watch(htmlFiles, ['html']);
  gulp.watch(cssFiles, ['css']);
  gulp.watch(jsFiles, ['browserify']);
  // For production instead use
  //gulp.watch(jsFiles, ['browserify','uglify']);
  // And repace main.js with main-min.js in index.html

});
