const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')

const { src, dest } = require('../config')

function compileSass (compress = false) {
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
    .pipe(gulp.dest(`./${dest}/css`))
}

gulp.task('build-sass', () => {
  compileSass(true)
})

gulp.task('dev-sass', () => {
  compileSass()
})

gulp.task('watch-sass', () => {
  gulp.watch('src/scss/**/*.scss', ['dev-sass'])
})
