var gulp = require('gulp');
var shell = require('gulp-shell');
var Elixir = require('laravel-elixir');
var del = require('del');

var Task = Elixir.Task;

Elixir.extend('remove', function(path) {

    new Task('remove', function() {
        del(path);
        return gulp.src('');
    });

});
