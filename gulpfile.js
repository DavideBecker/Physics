'use strict';

var gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    fs              = require('fs'),
    del             = require('del'),

    sass            = require('gulp-sass'),
    cssnano         = require('gulp-cssnano'),
    sourcemaps      = require('gulp-sourcemaps'),
    autoprefixer    = require('gulp-autoprefixer'),

    uglify          = require('gulp-uglify'),
    neuter          = require('gulp-neuter'),
    jshint          = require('gulp-jshint'),

    imagemin        = require('gulp-imagemin')

var baseUrl = '';
var distUrl = 'app/assets/';
var vendorFolder = 'vendor';

var src = {
    'css': baseUrl + 'src/styles/',
    'js': baseUrl + 'src/scripts/',
    'img': baseUrl + 'src/images/**',

    'jsMain': 'scripts.js',
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
        //.pipe(jshint({
        //    lookup: false
        //}))
        .pipe(neuter(src.jsMain, '/js.map', {
            basePath: src.js,
            template: "{%= src %}"
        }))
        //.pipe(uglify())

        .pipe(gulp.dest(dist.js));

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
    del(baseUrl + distUrl);
})

gulp.task('default', ['clean', 'styles', 'scripts', 'images', 'sprites'])
