var elixir = require('laravel-elixir');

require('./elixir-extensions')

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    // delete public files
    mix.remove([
        'public/css',
        'public/js',
        'public/fonts',
        'public/views'
    ]);

    // vendor fonts
    mix.copy('node_modules/bootstrap/dist/fonts', 'public/fonts');
    mix.copy('node_modules/font-awesome/fonts', 'public/fonts');

    // vendor styles
    mix
        .styles([
            'normalize.css/normalize.css',
            'font-awesome/css/font-awesome.min.css',
            'select2/dist/css/select2.min.css'
        ], 'public/css/vendor.css', 'node_modules')
        .sass('bootstrap-darkly.scss')
        .sass('bootstrap-sandstone.scss')
        .sass('bootstrap-united.scss')
        .sass('bootstrap-yeti.scss')
        .sass('bootstrap-default.scss');

    // vendor scripts
    mix
        .scripts([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-route/angular-route.min.js',
            'node_modules/select2/dist/js/select2.full.min.js',
            'node_modules/ace-editor-builds/src-min-noconflict/ace.js',
            'node_modules/ace-editor-builds/src-min-noconflict/theme-twilight.js'
        ], 'public/js/vendor.js', 'node_modules')


    // app styles
    mix
        .sass('main.scss')

    // app scripts
    mix
        .jshint('resources/assets/js/**/*.js')
        .scripts([
            'main.js',
            '' // include everything except main.js
        ], 'public/js/main.js');

    // app views
    mix.copy('resources/assets/views', 'public/views');

    // version js/css
    mix.version([
        'public/css/main.css',
        'public/js/main.js'
    ]);

});
