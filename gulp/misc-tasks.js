const gulp = require('gulp');
const flatten = require('gulp-flatten');
const changed = require('gulp-changed');
const rename = require('gulp-rename');

const { src, dest } = require('../config');

function moveFiles(compress = false) {
	gulp.src([`${src}/manifest/manifest.json`])
		.pipe(changed(`./${dest}/manifest`))
    .pipe(gulp.dest('dest'));

	gulp.src([`${src}/fonts/**/*.**`])
		.pipe(flatten())
		.pipe(changed(`./${dest}/fonts`))
    .pipe(gulp.dest(`./${dest}/fonts`));
}

gulp.task('build-misc', () => {
	moveFiles(true);
});

gulp.task('dev-misc', () => {
	moveFiles();
});

gulp.task('watch-misc', () => {
	gulp.watch(`${src}/fonts/**/*.**`, ['dev-misc']);
});
