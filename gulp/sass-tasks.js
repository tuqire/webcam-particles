import gulp from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';

import config from '../config';
const { src, dest } = config;

function compileSass(compress = false) {
  gulp.src(`${src}/scss/**/*.scss`)
    .pipe(
      sass({
        outputStyle: compress ? 'compressed' : 'nested'
      })
      .on('error', sass.logError)
    )
		.pipe(rename({
			basename: 'main'
		}))
    .pipe(gulp.dest(`./${dest}/css`));
}

gulp.task('build-sass', () => {
	compileSass(true);
});

gulp.task('dev-sass', () => {
	compileSass();
});

gulp.task('watch-sass', () => {
  gulp.watch('src/scss/**/*.scss', ['dev-sass']);
});
