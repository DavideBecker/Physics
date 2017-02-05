'use strict';

var gulp            = require('gulp'),
    path            = require('path'),
    colors          = require('colors'),
    sequence        = require('run-sequence'),
    gutil           = require('gulp-util'),
    clean           = require('gulp-clean'),

    eslint          = require('gulp-eslint'),

    sass            = require('gulp-sass'),
    cssnano         = require('gulp-cssnano'),
    sourcemaps      = require('gulp-sourcemaps'),
    autoprefixer    = require('gulp-autoprefixer'),

    uglify          = require('gulp-uglify'),
    include         = require('gulp-include'),

    imagemin        = require('gulp-imagemin')

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

var eslintErrorSeverity = ['none', 'Warning'.warn, 'FATAL'.error];

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

function fixedLength(str, len) {
    return str + Array(len).join(' ').slice(-len + str.length);
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

gulp.task('scripts:lint', function() {
    gulp.src(src.js + '**')
        .pipe(eslint({
            fix: false,
            useEslintrc: true
        }))
        .pipe(eslint.result((result) => {
            if(result.messages.length) {
                console.log('');
                console.log('    ESLint result for', result.filePath);
                console.log('    # Warnings: ', result.warningCount);
                console.log('    # Errors:   ', result.errorCount);
                result.messages.forEach(function(err) {
                    console.log(
                        '    ' +
                        fixedLength(err.ruleId ? err.ruleId : '', 20).info +
                        fixedLength('Line ' + err.line + ':' + err.column, 16).verbose +
                        fixedLength(eslintErrorSeverity[err.severity], 10) + ' ' + err.message);
                });
            }
        }))
})

gulp.task('scripts', ['scripts:lint'], function() {
    gulp.src(src.js + src.jsMain)
        .pipe(sourcemaps.init())
        .pipe(include({
            includePaths: [
                path.join(__dirname, 'src', 'scripts'),
            ]
        }))
            .on('error', console.log)
        .pipe(gulp.dest(dist.js))
        //.pipe(sourcemaps.write('./'))
        .pipe(uglify().on('error', function(err) {
            console.log('\n    ' + err.toString().replace(new RegExp('\n', 'g'), '\n    '));
        }))
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
