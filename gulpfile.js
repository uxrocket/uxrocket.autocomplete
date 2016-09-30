/**
 * @author Bilal Cinarli
 */

"use strict";

var gulp     = require("gulp"),
    pkg      = require('./package.json'),
    uxrocket = require('./uxrocket.json'),
    p        = require('gulp-load-plugins')(),
    connect  = require('gulp-connect');

var banner = [
    "/*! UX Rocket <%= uxrocket.name %> \n" +
    " *  <%= pkg.description %> \n" +
    " *  @author <%= pkg.author %> \n" +
    "<% pkg.contributors.forEach(function(contributor) { %>" +
    " *          <%= contributor.name %> <<%=contributor.email %>> (<%=contributor.url %>)\n" +
    "<% }) %>" +
    " *  @version <%= uxrocket.version %> \n" +
    " *  @build <%= date %> \n" +
    " */\n"
].join('');

var tasks = {
    mocha: function() {
        return gulp.src(uxrocket.paths.test + 'index.html')
            .pipe(p.mochaPhantomjs());
    },

    sass: function() {
        return gulp.src(uxrocket.paths.lib + "**/*.scss")
            .pipe(p.sourcemaps.init())
            .pipe(p.sass({
                outputStyle: "expanded"
            }))
            .pipe(p.autoprefixer({
                browsers: ['last 3 versions']
            }))
            .pipe(p.rename(uxrocket.registry + '.css'))
            .pipe(gulp.dest(uxrocket.paths.dist))
            .pipe(p.sass({
                outputStyle: "compressed"
            })).on("error", p.notify.onError("Error: <%= error.message %>"))
            .pipe(p.autoprefixer({
                browsers: ['last 3 versions']
            }))
            .pipe(p.rename(uxrocket.registry + '.min.css'))
            .pipe(p.header(banner, {pkg: pkg, uxrocket: uxrocket, date: new Date()}))
            .pipe(p.sourcemaps.write('./'))
            .pipe(p.notify('Sass styles completed'))
            .pipe(gulp.dest(uxrocket.paths.dist));
    },

    csslint: function() {
        return gulp.src(uxrocket.paths.dist + uxrocket.registry + '.css')
            .pipe(p.csslint())
            .pipe(p.csslint.reporter());
    },

    lint: function() {
        return gulp.src(uxrocket.paths.lib + "**/*.js")
            .pipe(p.jshint()).on("error", p.notify.onError("Error: <%= error.message %>"))
            .pipe(p.jshint.reporter("default"))
            .pipe(p.notify('JSHint completed'));
    },

    scripts: function() {
        return gulp.src(uxrocket.paths.lib + "**/*.js")
            .pipe(p.rename(uxrocket.registry + '.js'))
            .pipe(gulp.dest(uxrocket.paths.dist))
            .pipe(p.uglify()).on("error", p.notify.onError("Error: <%= error.message %>"))
            .pipe(p.header(banner, {pkg: pkg, uxrocket: uxrocket, date: new Date()}))
            .pipe(p.rename(uxrocket.registry + '.min.js'))
            .pipe(p.notify('Script file uglified'))
            .pipe(gulp.dest(uxrocket.paths.dist));
    },

    connect: function() {
        connect.server({
            livereload: true,
            port:       3030
        });
    },

    reload: {
        styles: function() {
            return gulp.src(uxrocket.paths.dist + '**/*.css')
                .pipe(p.notify({message: 'Styles Reloaded', onLast: true}))
                .pipe(p.connect.reload());
        },

        scripts: function() {
            return gulp.src(config.paths.scripts + '**/*.js')
                .pipe(p.notify({message: 'Scripts Reloaded', onLast: true}))
                .pipe(p.connect.reload());
        }
    }
};

gulp.task('connect', tasks.connect);
gulp.task('sass', tasks.sass);
gulp.task('csslint', tasks.csslint);
gulp.task('lint', tasks.lint);
gulp.task('scripts', tasks.scripts);
gulp.task('mocha', tasks.mocha);

gulp.task('watch', ['csslint', 'sass', 'lint', 'scripts', 'mocha'], function() {
    gulp.watch(uxrocket.paths.lib + '**/*.scss', ['sass'], function() {
        return tasks.reload.styles();
    });
    gulp.watch(uxrocket.paths.dist + '**/*.css', ['csslint']);
    gulp.watch(uxrocket.paths.lib + '**/*.js', ['lint', 'scripts', 'mocha'], function() {
        return tasks.reload.scripts();
    });
});

gulp.task('default', ['connect', 'watch']);