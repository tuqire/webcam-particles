import gulp from 'gulp';
import handlebars from 'gulp-compile-handlebars';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';

import { src, dest, gitPortfolioOutput } from '../config';

function compileHandlebars(compress = false) {
	gulp.src([`${src}/hbs/*.hbs`])
    .pipe(handlebars())
		.pipe(rename({
			extname: '.html'
		}))
    .pipe(htmlmin({
			collapseWhitespace: compress
		}))
    .pipe(gulp.dest('dest'))
    .pipe(gulp.dest(`${gitPortfolioOutput}`));
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
