'use strict';

gulp = require 'gulp'
$ = require('gulp-load-plugins')()
browserSync = require 'browser-sync'

config = 
  SOURCE: 'my_wordpress_theme'

gulp.task 'browser-sync', ->
  browserSync
    files: config.SOURCE + '/*'
    proxy: '192.168.33.10/' + config.SOURCE + '/'
    notify: false

gulp.task 'bs-reload', ->
  browserSync.reload()

gulp.task 'sass', ->
  gulp.src 'src/style.scss'
    .pipe $.plumber()
    .pipe $.rubySass
      style: 'expanded'
    .pipe $.autoprefixer 'last 2 version', 'ie 8', 'ie 7'
    .pipe gulp.dest 'mytheme'
    .pipe browserSync.reload
      stream: true

gulp.task 'default', ['browser-sync'], ->
  gulp.watch config.SOURCE + '/**/*', ['bs-reload']
  gulp.watch 'src/*', ['sass', 'bs-reload']
