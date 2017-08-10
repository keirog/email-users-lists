'use strict';

// Third party modules/dependencies
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const istanbul = require('gulp-istanbul');
const apidoc = require('gulp-apidoc');


// Paths
const files =  {
    server: ['server.js'],
    mochaTests: ['./tests/**/*.js'],
    appSrc: ['./app/**/*.js'],
    fakery: ['./fakery/**/*.js']
};

const allJSFiles = files.appSrc
    .concat(files.mochaTests)
    .concat(files.server)
    .concat(files.fakery);

// Set Test environment
gulp.task('setTestEnv', function () {
    process.env.NODE_ENV = 'test';
});

// JSHint linting
gulp.task('lint', () => {

    return gulp.src(allJSFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Mocha tests with coverage
gulp.task('istanbul', () => {

    let instFiles = files.appSrc
        .concat(files.server);

      // Add istanbul when refactoring with ES7
    //gulp.src(instFiles)
        //.pipe(istanbul())
        //.pipe(istanbul.hookRequire())
        //.on('finish', () => {
            gulp.src(files.mochaTests)
                .pipe(mocha({ timeout: 10000 }))
                .once('error', function () {
                     process.exit(1);
                 })
                .once('end', function () {
                    process.exit();
                });
        //})
});

gulp.task('test', ['setTestEnv', 'lint', 'istanbul']);

gulp.task('apidoc', (done) => {
    apidoc({
        src: "app/",
        dest: "public/docs/users-lists/"
    }, done);
});

gulp.task('postinstall', ['apidoc']);
