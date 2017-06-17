import gulp from 'gulp';

import './server';
import './build-js';
import './build-html';
import './watch-js';
import './watch-html';

gulp.task('default', ['server']);
gulp.task('watch', ['watch-js', 'watch-html']);

gulp.task('build', ['build-js', 'build-html']);
