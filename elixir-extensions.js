var gulp = require('gulp');
var shell = require('gulp-shell');
var Elixir = require('laravel-elixir');
var del = require('del');
var jshint = require('gulp-jshint');

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
