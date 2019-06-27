'use strict';

const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const newer = require('gulp-newer'); // измененные файлы

const fileinclude = require('gulp-file-include');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');

const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const gulpIf = require('gulp-if');

const browserSync = require('browser-sync').create();

// const spritesmith = require('gulp.spritesmith'); //png-sprite
// var imagesNormalizer = require('gulp-retina-sprites-normalizer'); //png-sprite

// var mmq = require('gulp-merge-media-queries');

// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

//-----html------
gulp.task('html', function () {
  return gulp.src(['src/pages/**/*.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      }))
      .pipe(gulp.dest('build'));
});


//-----styles------
gulp.task('styles', function () {
  // const postcssOptions = [require('autoprefixer'), require('cssnano')];
  const postcssOptions = [autoprefixer, cssnano];

  return gulp.src('src/scss/main.scss')
      .pipe(sass())
      .pipe(postcss(postcssOptions))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('build/css'));
});

gulp.task('styles-dev', function () {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'));
});


//-----script------
gulp.task('script', function () {
  return gulp.src('src/js/main.js')
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'));
});


//-----images------
gulp.task('images', function () {
  return gulp.src(['src/images/**/*.{png,jpg,gif}'], {since: gulp.lastRun('images')})
      .pipe(newer('build/images'))
      .pipe(imagemin())
      .pipe(gulp.dest('build/images'));
});

gulp.task('images-dev', function () {
  return gulp.src(['src/images/**/*.{png,jpg,gif}'], {since: gulp.lastRun('images')})
      .pipe(newer('build/images'))
      .pipe(gulp.dest('build/images'));
});

gulp.task('images-svg', function () {
  return gulp.src(['src/images/**/*.svg'], {since: gulp.lastRun('images')})
      .pipe(newer('build/images'))
      .pipe(gulp.dest('build/images'));
});


//-----sprites------
gulp.task('spritesvg', function () {
  return gulp.src('src/images/sprites/svg/**/*.svg')
      .pipe(cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
      }))
      .pipe(svgSprite({
        mode: {
          symbol: {
            dest: '.',
            sprite: 'sprite.svg',
            render: {
              scss: {
                dest: '_sprite_svg.scss',
                template: 'src/scss/_dev/_spritesvgtemp.scss'
              }
            }
          }
        },
        shape: {
          dimension: {
            maxWidth: 32,
            maxHeight: 32
          }
        }
      }))
      .pipe(gulpIf('*.scss', gulp.dest('src/scss/_dev'), gulp.dest('build/images')));
});

gulp.task('spritesvgbg', function () {
  return gulp.src('src/images/sprites/svg-bg/**/*.svg')
    .pipe(svgSprite({
      shape: {
        spacing: {
          padding: 5
        }
      },
      mode: {
        css: {
          dest: ".",
          layout: "diagonal",
          sprite: 'sprite-bg.svg',
          bust: false,
          render: {
            scss: {
              dest: "_sprite_svg-bg.scss",
              template: "src/scss/_dev/_spritesvgtemp_bg.scss"
            }
          }
        }
      },
      variables: {
        mapname: "icons"
      }
    }))
    .pipe(gulpIf('*.scss', gulp.dest('src/scss/_dev'), gulp.dest('build/images')));
});

// gulp.task('sprite', function() {
//     imagesNormalizer.ImagesPadding.prototype.retinaSrcFilter = '*2x.png'; // default: **/*2x.png
//     imagesNormalizer.ImagesPadding.prototype.retinaFileSuffix = '@2x.png'; // default: @2x.png
//
//     return gulp.src('images/sprite/*.png')
//         .pipe(imagesNormalizer())
//         .pipe(
//             spritesmith(
//                 {
//                     cssName: '_sprite.scss',
//                     algorithm: 'binary-tree',
//                     cssTemplate: 'scss/_spritetemp.scss',
//                     padding: 4,
//                     imgName: 'sprite.png',
//                     imgPath: "../images/sprite.png",
//                     retinaSrcFilter: 'images/sprite/*@2x.png',
//                     retinaImgName: 'sprite@2x.png',
//                     retinaImgPath: "../images/sprite@2x.png"
//                 }
//             )
//         )
//         .pipe(gulpIf('*.scss', gulp.dest('scss'), gulp.dest('../build/images')));
// });


//-----clear build------
gulp.task('clear', function () {
  return del(['build']);
});

gulp.task('serve', function () {
    browserSync.init({
        server: 'build'
    });

    browserSync.watch('build/**/*.*').on('change', browserSync.reload)
});

gulp.task('build', gulp.series(
    'clear',
    'spritesvg',
    'spritesvgbg',
    gulp.parallel('html', 'styles', 'script', 'images', 'images-svg')
));

gulp.task('watch', function () {
  gulp.watch('src/pages/*.html', gulp.series('html'));
  gulp.watch('src/temp/**/*.html', gulp.series('html'));
  gulp.watch('src/scss/**/*.*', gulp.series('styles-dev'));
  gulp.watch('src/js/**/*.*', gulp.series('script'));
  gulp.watch('src/images/**/*.{png,jpg,gif}', gulp.series('images-dev'));
  gulp.watch('src/images/**/*.svg', gulp.series('images-svg'));
});

gulp.task('dev', gulp.series(
    'clear',
    'spritesvg',
    'spritesvgbg',
    gulp.parallel('html', 'styles-dev', 'script', 'images-dev', 'images-svg', 'watch', 'serve')
));
