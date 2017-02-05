'use strict';

var gulp            = require('gulp'),
    path            = require('path'),
    sequence        = require('run-sequence'),

    gutil           = require('gulp-util'),
    clean           = require('gulp-clean'),

    sass            = require('gulp-sass'),
    cssnano         = require('gulp-cssnano'),
    sourcemaps      = require('gulp-sourcemaps'),
    autoprefixer    = require('gulp-autoprefixer'),

    uglify          = require('gulp-uglify'),
    include         = require('gulp-include'),

    imagemin        = require('gulp-imagemin')

var baseUrl = '';
var distUrl = 'app/assets/';
var vendorFolder = 'vendor';

var src = {
    'css': baseUrl + 'src/styles/',
    'js': baseUrl + 'src/scripts/',
    'img': baseUrl + 'src/images/**',

    'jsMain': 'engine.js',
    'cssMain': 'styles.sass'
}

var dist = {
    'css': baseUrl + distUrl + 'css/',
    'js': baseUrl + distUrl + 'js/',
    'img': baseUrl + distUrl + 'img/',
}

gulp.task('styles', function() {
    gulp.src(src.css + src.cssMain)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))

        .pipe(gulp.dest(dist.css))

    gulp.src(src.css + vendorFolder + '/**').pipe(gulp.dest(dist.css + vendorFolder));
})

gulp.task('scripts', function() {
    gulp.src(src.js + src.jsMain)
        .pipe(sourcemaps.init())
        .pipe(include({
            includePaths: [
                path.join(__dirname, 'src', 'scripts'),
            ]
        }))
            .on('error', console.log)
        .pipe(gulp.dest(dist.js))
        .pipe(sourcemaps.write('./'))
        .pipe(uglify())
        .pipe(gulp.dest(dist.js + 'engine.min.js'));

    gulp.src(src.js + vendorFolder + '/**').pipe(gulp.dest(dist.js + vendorFolder));
});

gulp.task('images', function() {
    gulp.src(src.img)
        .pipe(imagemin({
            progressive: true
        }))

        .pipe(gulp.dest(dist.img))
});

//Images aren't included here as even a few can easily impact performance
gulp.task('watch', function() {
    gulp.watch(src.css + '**', ['styles']);

    gulp.watch(src.js + '**', ['scripts']);

    gulp.watch(src.sprites, ['sprites']);
})

gulp.task('clean', function() {
    return gulp.src(baseUrl + distUrl)
        .pipe(clean());
})

gulp.task('default', function() {
    sequence('clean', ['styles', 'scripts', 'images']);
})
