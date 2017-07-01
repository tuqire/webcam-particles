const gulp = require('gulp');

require('./server');
require('./js-tasks');
require('./hbs-tasks');

gulp.task('default', ['server']);
gulp.task('watch', ['watch-js', 'watch-hbs']);
gulp.task('build', ['build-js', 'build-hbs']);
