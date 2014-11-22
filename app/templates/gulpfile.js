var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

var config = {
  theme: '<%= themeName %>',
  src: './src'
};

gulp.task('browserSync', function () {
  browserSync({
    watchOptions: {
      debounceDelay: 0
    },
    server: {
      baseDir: config.theme,
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    notify: false,
    reloadDelay: 0
  });
});

gulp.task('sass', function () {
  gulp.src(config.src + '/styles/**/*.scss')
    .pipe($.plumber())
    .pipe($.filter('**/style.scss'))
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 version', 'ie 9', 'ie 8']
    }))
    .pipe(gulp.dest(config.dest + '/styles'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('coffee', function () {
  gulp.src(config.src + '/scripts/*.coffee')
    .pipe($.plumber())
    .pipe($.changed(config.theme, {extension: '.js'}))
    .pipe($.coffee())
    .pipe(gulp.dest(config.dest + '/scripts'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('php', function () {
  gulp.src(config.src + '/**/*.php')
    .pipe(gulp.dest(config.theme));
});

gulp.task('default', ['browserSync'], function () {
  gulp.watch(config.src + '/styles/*.scss', ['sass']);
  gulp.watch(config.src + '/scripts/*.coffee', ['coffee']);
});

gulp.task('build', ['php', 'sass', 'coffee']);

