import gulp from 'gulp';

import './server';
import './js-tasks';
import './hbs-tasks';

gulp.task('default', ['server']);
gulp.task('watch', ['watch-js', 'watch-hbs']);
gulp.task('build', ['build-js', 'build-hbs']);
