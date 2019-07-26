'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const rename = require('gulp-rename');
const debug = require('gulp-debug');
const util = require('gulp-util');

const fileinclude = require('gulp-file-include');

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mmq = require('gulp-merge-media-queries');

const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');

const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
// const spritesmith = require('gulp.spritesmith'); //png-sprite
// var imagesNormalizer = require('gulp-retina-sprites-normalizer'); //png-sprite

const browserSync = require('browser-sync').create();

// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
util.env.type = 'production';


gulp.task('html', function () {
    return gulp.src(['src/pages/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest('build'));
});


gulp.task('styles', function () {
    let postcssOptions = [autoprefixer, cssnano];
    let postcssOptionsDev = [autoprefixer];

    return gulp.src('src/scss/*.scss')
        .pipe(gulpIf(util.env.type === 'development', sourcemaps.init()))
        .pipe(sass())
        .pipe(mmq())
        .pipe(gulpIf(util.env.type !== 'development', postcss(postcssOptions), postcss(postcssOptionsDev)))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpIf(util.env.type === 'development', sourcemaps.write()))
        .pipe(gulp.dest('build/css'));
});


gulp.task('script', function () {
    return gulp.src('src/js/main.js')
        .pipe(rigger())
        .pipe(gulpIf(util.env.type !== 'development', uglify()))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/js'));
});


gulp.task('images', function () {
    return gulp.src('src/images/**/*.{png,jpg,gif}')
        // .pipe(newer('build/images'))
        .pipe(gulpIf(util.env.type !== 'development', imagemin()))
        .pipe(debug({title: 'images'}))
        .pipe(gulp.dest('build/images'));
});


gulp.task('images:svg', function () {
    return gulp.src('src/images/**/*.svg')
        .pipe(newer('build/images'))
        .pipe(debug({title: 'images:svg'}))
        .pipe(gulp.dest('build/images'));
});


//-----sprites------
gulp.task('spritesvg', function () {
    return gulp.src('src/sprites/svg/**/*.svg')
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
    return gulp.src('src/sprites/svg-bg/**/*.svg')
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
//     return gulp.src('sprites/sprite/*.png')
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


// gulp.task('fonts', function () {
//     return gulp.src('src/fonts/**/*.*')
//         .pipe(gulp.dest('build/fonts'));
// });


gulp.task('clear', function () {
    return del(['build']);
});


gulp.task('serve', function () {
    browserSync.init({
        server: 'build'
    });

    browserSync.watch('build/**/*.*').on('change', browserSync.reload)
});


gulp.task('set-dev-node-env', function(done) {
    util.env.type = 'development';
    done();
});


gulp.task('build', gulp.series(
    'clear',
    gulp.parallel('html', 'script', 'styles', 'spritesvg', 'spritesvgbg', 'images', 'images:svg')
));

gulp.task('watch', function () {
    gulp.watch('src/temp/**/*.html', gulp.series('html'));
    gulp.watch('src/pages/*.html', gulp.series('html'));
    gulp.watch('src/scss/**/*.*', gulp.series('styles'));
    gulp.watch('src/js/main.js', gulp.series('script'));
    gulp.watch('src/images/**/*.{png,jpg,gif}', gulp.series('images'));
    gulp.watch('src/images/**/*.svg', gulp.series('images:svg'));
    // gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
});

gulp.task('dev', gulp.series(
    'set-dev-node-env',
    'build',
    gulp.parallel('watch', 'serve')
));