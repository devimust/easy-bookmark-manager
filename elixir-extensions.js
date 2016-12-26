var gulp = require('gulp');
var shell = require('gulp-shell');
var Elixir = require('laravel-elixir');
var del = require('del');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');

var Task = Elixir.Task;

Elixir.extend('remove', function(path) {

    new Task('remove', function() {
        del(path);
        return gulp.src('');
    });

});


Elixir.extend('jshint', function(path) {

    new Task('jshint', function() {
        return gulp.src(path)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

});

Elixir.extend('lang', function(path) {

    new Task('lang', function() {
        var lang = {
            en: require('./resources/lang/en.json'),
            fr: require('./resources/lang/en.json')
        }

        return gulp.src(path)
            .pipe(replace("'INSERT LANGUAGE OBJECT'", JSON.stringify(lang)))
            .pipe(gulp.dest('public/js'));
    })
    .watch(path);

});
