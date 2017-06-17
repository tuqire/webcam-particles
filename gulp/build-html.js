import gulp from 'gulp';

gulp.task('build-html', () => {
	gulp.src(['src/html/*.html'])
		.pipe(gulp.dest('dest'));
});