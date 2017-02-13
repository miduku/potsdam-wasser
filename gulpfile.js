var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  eslint = require('gulp-eslint'),
  header  = require('gulp-header'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  bower = require('gulp-bower'),
  notify = require('gulp-notify'),
  concat = require('gulp-concat'),
  package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

var config = {
  dir: {
    src: 'src',
    app: 'app/assets',
    bowerComp: 'bower_components'
  }
};

gulp.task('bower', function() {
  return bower()
      .pipe(gulp.dest(config.dir.bowerComp));
});

gulp.task('icons', function() {
  return gulp.src(config.dir.bowerComp + '/font-awesome/fonts/**.*')
      .pipe(gulp.dest(config.dir.app + '/fonts'));
});

gulp.task('comps', function() {
    return gulp.src([
        config.dir.bowerComp + '/jquery/dist/jquery.min.js',

        config.dir.bowerComp + '/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        config.dir.bowerComp + '/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
        config.dir.bowerComp + '/scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js',
        config.dir.bowerComp + '/scrollmagic/scrollmagic/minified/plugins/jquery.ScrollMagic.min.js',

        config.dir.bowerComp + '/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
        config.dir.bowerComp + '/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
        config.dir.bowerComp + '/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
        config.dir.bowerComp + '/scrollmagic/scrollmagic/uncompressed/plugins/jquery.ScrollMagic.js',

        config.dir.bowerComp + '/gsap/src/minified/TweenMax.min.js',

        config.dir.bowerComp + '/jquery-anchorscroll/jquery.anchorScroll.min.js'
      ])
      .pipe(gulp.dest(config.dir.app + '/components'))
});

gulp.task('css', function () {
  return gulp.src(config.dir.src + '/scss/style.scss')
      .pipe(sass({
        includePaths: [
          config.dir.src + '/scss',
          config.dir.bowerComp + '/vertical-rhythm-reset/dist',
          config.dir.bowerComp + '/font-awesome/scss'/*,
          config.dir.bowerComp + '/normalize-scss/sass'*/
        ]
      }).on('error', notify.onError(function (error) {
        return 'Error: ' + error.message;
      })))
      // .pipe(autoprefixer('last 4 version'))
      .pipe(gulp.dest(config.dir.app + '/css'))
      .pipe(cssnano())
      .pipe(rename({ suffix: '.min' }))
      .pipe(header(banner, { package : package }))
      .pipe(gulp.dest(config.dir.app + '/css'))
      .pipe(browserSync.stream());
});

gulp.task('js',function(){
  return gulp.src([
      config.dir.bowerComp + '/baseline/baseline.js',
      config.dir.src + '/js/index.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(eslint({
      configFile: '.eslintrc.json',
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
      .on('error', notify.onError(function (error) {
        return 'ESLint error: ' + error.message;
      }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(config.dir.app + '/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.app + '/js'))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('serve', ['css', 'js'], function() {

    browserSync.init({
      server: {
        baseDir: './app'
      }
    });

    gulp.watch(config.dir.src + '/scss/**/*.scss', ['css']);
    gulp.watch(config.dir.src + '/js/*.js', ['js']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

// gulp.task('bs-reload', function () {
//   browserSync.reload();
// });

gulp.task('default', ['bower', 'icons', 'comps', 'serve']);
