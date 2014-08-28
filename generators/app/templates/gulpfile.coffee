'use strict';

gulp = require 'gulp'
$ = require('gulp-load-plugins')()
browserSync = require 'browser-sync'

config = 
  theme: '<%= themeName %>'
  src: 'src'

gulp.task 'browser-sync', ->
  browserSync
    files: config.theme + '/*'
    proxy: '192.168.33.10/' + config.theme + '/'
    notify: false

gulp.task 'bs-reload', ->
  browserSync.reload()

gulp.task 'sass', ->
  gulp.src 'src/style.scss'
    .pipe $.plumber()
    .pipe $.rubySass
      style: 'expanded'
    .pipe $.autoprefixer 'last 2 version', 'ie 8', 'ie 7'
    .pipe gulp.dest config.theme
    .pipe browserSync.reload
      stream: true

gulp.task 'default', ['browser-sync'], ->
  gulp.watch config.src + '/**/*', ['bs-reload']
  gulp.watch config.src + '/**/*.scss', ['sass', 'bs-reload']
