'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const sourcemap = require('gulp-sourcemaps');

const del = require('del');
const newer = require('gulp-newer'); // измененные файлы
const imagemin = require('gulp-imagemin');
// const autoprefixer = require('gulp-autoprefixer');
const svgSprite = require('gulp-svg-sprite');
var cheerio = require('gulp-cheerio');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');

const spritesmith = require('gulp.spritesmith'); //sprite
var imagesNormalizer = require('gulp-retina-sprites-normalizer'); //sprite

var rigger = require('gulp-rigger');
var fileinclude = require('gulp-file-include');
var mmq = require('gulp-merge-media-queries');
var uglify = require('gulp-uglify');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('html', function() {
    return gulp.src(['*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('../build'));
});

gulp.task('styles', function () {
    return gulp.src('scss/style.scss')
        .pipe(sourcemap.init())
        .pipe(sass())
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(mmq({
            log: true
        }))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('../build/css'));
});

gulp.task('styleslibs', function () {
    return gulp.src('scss/libs/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../build/css/libs'));
});

gulp.task('script', function () {
    return gulp.src('js/main.js')
        .pipe(rigger())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../build/js'));
});

gulp.task('scriptlibs', function () {
    return gulp.src('js/libs/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../build/js/libs'));
});

// gulp.task('fonts', function () {
//     return gulp.src('fonts/**/*.*')
//         .pipe(gulp.dest('../build/fonts'));
// });

gulp.task('clear', function () {
    return del('../build/images/*.*, ../build/js/**/*.js,  ../build/css, ../build/**/*.html, ../build/fonts/**/*.*');
});

gulp.task('images', function () {
    return gulp.src(['images/*.*'], {since: gulp.lastRun('images')})
        .pipe(newer('../build/images'))
        .pipe(imagemin())
        .pipe(gulp.dest('../build/images'));
});

gulp.task('images-content', function () {
    return gulp.src('images/content/**/*.*', {since: gulp.lastRun('images')})
        .pipe(newer('../build/images'))
        .pipe(imagemin())
        .pipe(gulp.dest('../build/images/content'));
});

gulp.task('sprite', function() {
    imagesNormalizer.ImagesPadding.prototype.retinaSrcFilter = '*2x.png'; // default: **/*2x.png
    imagesNormalizer.ImagesPadding.prototype.retinaFileSuffix = '@2x.png'; // default: @2x.png

    return gulp.src('images/sprite/*.png')
        .pipe(imagesNormalizer())
        .pipe(
            spritesmith(
                {
                    cssName: '_sprite.scss',
                    algorithm: 'binary-tree',
                    cssTemplate: 'scss/_spritetemp.scss',
                    padding: 4,
                    imgName: 'sprite.png',
                    imgPath: "../images/sprite.png",
                    retinaSrcFilter: 'images/sprite/*@2x.png',
                    retinaImgName: 'sprite@2x.png',
                    retinaImgPath: "../images/sprite@2x.png"
                }
            )
        )
        .pipe(gulpIf('*.scss', gulp.dest('scss'), gulp.dest('../build/images')));
});

gulp.task('spritesvg', function () {
    return gulp.src('images/svg/**/*.svg')
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
                            template: 'scss/_spritesvgtemp.scss'
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
        .pipe(gulpIf('*.scss', gulp.dest('scss'), gulp.dest('../build/images')));
});

gulp.task('spritesvgbg', function () {
    return gulp.src('images/svg-bg/**/*.svg')
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
                            template: "scss/_spritesvgtemp_bg.scss"
                        }
                    }
                }
            },
            variables: {
                mapname: "icons"
            }
        }))
        .pipe(gulpIf('*.scss', gulp.dest('scss'), gulp.dest('../build/images')));
});

gulp.task('build', gulp.series (
    'clear',
    'sprite',
    'spritesvg',
    'spritesvgbg',
    gulp.parallel('html', 'styles', 'styleslibs', 'script', 'scriptlibs', 'images', 'images-content'/*, 'fonts'*/)));

gulp.task('watch', function () {
    gulp.watch('scss/**/*.*', gulp.series('styles'));
    gulp.watch('*.html', gulp.series('html'));
    gulp.watch('temp/**/*.*', gulp.series('html'));
    gulp.watch('js/**/*.*', gulp.series('script'));
    gulp.watch('js/libs/*.*', gulp.series('scriptlibs'));
    gulp.watch('images/**/*.*', gulp.series('images'));
    // gulp.watch('fonts/**/*.*', gulp.series('fonts'));
});

gulp.task('dev', gulp.series('build', 'watch'));
