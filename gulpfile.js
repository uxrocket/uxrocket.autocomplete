/**
 * @author Bilal Cinarli
 */

"use strict";

var gulp = require("gulp"),
    pkg = require('./package.json'),

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
    jshint = require("gulp-jshint");

var paths = {
    lib     : "./lib/",
    dist    : "./dist/",
    examples: "./examples/"
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
    sass: function() {
        return gulp.src(paths.lib + "**/*.scss")
            .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: "expanded"
            }))
            .pipe(autoprefixer({
                browsers: ['last 3 versions']
            }))
            .pipe(rename('uxrocket.autocomplete.css'))
            .pipe(gulp.dest(paths.dist))
            .pipe(sass({
                outputStyle: "compressed"
            })).on("error", notify.onError("Error: <%= error.message %>"))
            .pipe(autoprefixer({
                browsers: ['last 3 versions']
            }))
            .pipe(rename('uxrocket.autocomplete.min.css'))
            .pipe(header(banner, {pkg: pkg, date: now()}))
            .pipe(sourcemaps.write('./'))
            .pipe(notify('Sass styles completed'))
            .pipe(gulp.dest(paths.dist));
    },

    lint: function() {
        return gulp.src(paths.lib + "**/*.js")
            .pipe(jshint()).on("error", notify.onError("Error: <%= error.message %>"))
            .pipe(jshint.reporter("default"))
            .pipe(notify('JSHint completed'));
    },

    scripts: function() {
        return gulp.src(paths.lib + "**/*.js")
            .pipe(sourcemaps.init())
            .pipe(rename('uxrocket.autocomplete.js'))
            .pipe(gulp.dest(paths.dist))
            .pipe(uglify()).on("error", notify.onError("Error: <%= error.message %>"))
            .pipe(header(banner, {pkg: pkg, date: now()}))
            .pipe(rename('uxrocket.autocomplete.min.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(notify('Script file uglified'))
            .pipe(gulp.dest(paths.dist));
    }
};

var now = function() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()) + '-' + (d.getDay() < 10 ? '0' + d.getDay() : d.getDay());
};

gulp.task("sass", tasks.sass);
gulp.task("lint", tasks.lint);
gulp.task("scripts", tasks.scripts);

gulp.task("watch", ["sass", "lint"], function() {
    gulp.watch(paths.lib + "**/*.scss", ["sass"]);
    gulp.watch(paths.lib + "**/*.js", ["lint"]);
});

gulp.task("default", ["watch"]);