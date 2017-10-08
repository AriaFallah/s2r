// gulpfile.js

const gulp = require('gulp')
const babel = require('gulp-babel')

gulp.task('server', () =>
  gulp.src('server.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/'))
)

gulp.task('utils', () =>
  gulp.src('utils/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/utils'))
)

gulp.task('default', ['server', 'utils'])
