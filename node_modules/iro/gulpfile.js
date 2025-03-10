const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imports = require('gulp-imports');
const formatter = require('gulp-esformatter');
const lec = require('gulp-line-ending-corrector');
const exec = require('child_process').exec;

gulp.task('build', function() {
  console.log('Concatenating...');
  gulp.src('src/color.js')
    .pipe(imports())
    .pipe(formatter({indent: {value: '  '}}))
    .pipe(lec())
    .pipe(rename({basename: 'iro'}))
    .pipe(gulp.dest('dist'));

  console.log('Testing...');
  exec(['node', 'test/basic.js'].join(' '),
    function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });  

  console.log('Minifying...');
  gulp.src('dist/iro.js')
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(lec())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});
