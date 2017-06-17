import gulp from 'gulp';

import './build-html';

gulp.task('watch-html', () => {
	gulp.watch('src/html/*.html', ['build-html']);
});