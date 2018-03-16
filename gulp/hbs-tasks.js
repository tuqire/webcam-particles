const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');

const { src, dest, gitPortfolioOutput } = require('../config');

function compileHandlebars(compress = false) {
	const htmlPipe = gulp.src([`${src}/hbs/*.hbs`])
    .pipe(handlebars())
		.pipe(rename({
			extname: '.html'
		}))
    .pipe(htmlmin({
			collapseWhitespace: compress
		}))
    .pipe(gulp.dest('dest'));
	
	if (process.env.NODE_ENV === 'production') {
		htmlPipe
			.pipe(gulp.dest(`../${gitPortfolioOutput}`));
	}
}

gulp.task('build-hbs', () => {
	compileHandlebars(true);
});

gulp.task('dev-hbs', () => {
	compileHandlebars();
});

gulp.task('watch-hbs', () => {
	gulp.watch(`${src}/hbs/**/*.hbs`, ['dev-hbs']);
});
