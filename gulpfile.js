/**
 * @author Bilal Cinarli
 */

"use strict";

var gulp = require("gulp"),
    pkg = require('./package.json'),
    isTravis = process.env.TRAVIS || false,

// utils
    header = require("gulp-header"),
    notify = require("gulp-notify"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),

// sass
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),

// lint
    jshint = require("gulp-jshint"),
    csslint = require("gulp-csslint"),

// testing
    mochaPhantomJs = require('gulp-mocha-phantomjs');

var paths = {
    lib     : 'lib/',
    dist    : 'dist/',
    test    : 'test/',
    examples: 'examples/'
};

var banner = [
    "/*! UX Rocket Autocomplete \n" +
    " *  <%= pkg.description %> \n" +
    " *  @author <%= pkg.author %> \n" +
    "<% pkg.contributors.forEach(function(contributor) { %>" +
    " *          <%= contributor.name %> <<%=contributor.email %>> (<%=contributor.url %>)\n" +
    "<% }) %>" +
    " *  @version <%= pkg.version %> \n" +
    " *  @build <%= date %> \n" +
    " */\n"
].join('');

var tasks = {
    mocha: function() {
        return gulp.src(paths.test + 'index.html')
            .pipe(mochaPhantomJs());
    },

    sass: function() {
        return gulp.src(paths.lib + "**/*.scss")
            .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: "expanded"
            }))
            .pipe(autoprefixer({
                browsers: ['last 5 versions']
            }))
            .pipe(rename('uxrocket.autocomplete.css'))
            .pipe(gulp.dest(paths.dist))
            .pipe(sass({
                outputStyle: "compressed"
            })).on("error", notify.onError("Error: <%= error.message %>"))
            .pipe(autoprefixer({
                browsers: ['last 5 versions']
            }))
            .pipe(rename('uxrocket.autocomplete.min.css'))
            .pipe(header(banner, {pkg: pkg, date: new Date()}))
            .pipe(sourcemaps.write('./'))
            .pipe(notify('Sass styles completed'))
            .pipe(gulp.dest(paths.dist));
    },

    csslint: function() {
        return gulp.src(paths.dist + "uxrocket.autocomplete.css")
            .pipe(csslint())
            .pipe(csslint.reporter());
    },

    lint: function() {
        return gulp.src(paths.lib + "**/*.js")
            .pipe(jshint()).on("error", notify.onError("Error: <%= error.message %>"))
            .pipe(jshint.reporter("default"))
            .pipe(notify('JSHint completed'));
    },

    scripts: function() {
        return gulp.src(paths.lib + "**/*.js")
            .pipe(rename('uxrocket.autocomplete.js'))
            .pipe(gulp.dest(paths.dist))
            .pipe(uglify()).on("error", notify.onError("Error: <%= error.message %>"))
            .pipe(header(banner, {pkg: pkg, date: new Date()}))
            .pipe(rename('uxrocket.autocomplete.min.js'))
            .pipe(notify('Script file uglified'))
            .pipe(gulp.dest(paths.dist));
    }
};

gulp.task('sass', tasks.sass);
gulp.task('csslint', tasks.csslint);
gulp.task('lint', tasks.lint);
gulp.task('scripts', tasks.scripts);
gulp.task('mocha', tasks.mocha);

gulp.task('watch', ['csslint', 'sass', 'lint', 'scripts', 'mocha'], function() {
    gulp.watch(paths.lib + '**/*.scss', ['sass']);
    gulp.watch(paths.dist + '**/*.css', ['csslint']);
    gulp.watch(paths.lib + '**/*.js', ['lint', 'scripts', 'mocha']);
});

gulp.task('default', ['watch']);
