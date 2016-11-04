<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['prefix' => 'api/v1/', 'middleware' => ['web']], function () {
    Route::get('user/status', 'Api\v1\UserController@loginStatus');
});

Route::group(['prefix' => 'api/v1/', 'middleware' => ['web', 'auth']], function () {
    Route::get('bookmarks', 'Api\v1\BookmarkController@index');
    Route::post('bookmark/create', 'Api\v1\BookmarkController@create');
    Route::get('bookmark/{id}', 'Api\v1\BookmarkController@edit');
    Route::put('bookmark/{id}', 'Api\v1\BookmarkController@update');
    Route::delete('bookmark/{id}', 'Api\v1\BookmarkController@delete');
    Route::post('bookmarks/import', 'Api\v1\BookmarkController@import');
    Route::get('bookmarks/export', 'Api\v1\BookmarkController@export');
    Route::get('bookmarks/duplicates', 'Api\v1\BookmarkController@duplicates');

    Route::get('bookmarks/categories-and-tags', 'Api\v1\BookmarkController@categoriesAndTags');
    Route::get('categories', 'Api\v1\BookmarkController@categories');
    Route::get('tags', 'Api\v1\BookmarkController@tags');

    Route::get('user', 'Api\v1\UserController@edit');
    Route::put('user', 'Api\v1\UserController@update');
});

Route::group(['middleware' => ['web']], function () {
    Route::get('/', 'PagesController@showIndex');
    Route::get('login', 'PagesController@showLogin');
    if (env('ENABLE_REGISTER') === true) {
        Route::get('register', 'PagesController@showRegister');
        if (env('ENABLE_REGISTER_MAIL') == true) {
            Route::post('auth/register', 'PagesController@register')->middleware('mail');
        } else {
            Route::post('auth/register', 'PagesController@register');
        }

    }
    Route::post('auth/login', 'PagesController@login');
    Route::get('auth/logout', 'PagesController@logout');

    Route::get('test', 'PagesController@test');

});

/**
 * User admin process
 */
if (env('ADMIN_ENABLED') === true) {
    Route::group(['prefix' => 'admin/', 'middleware' => ['web', 'auth']], function () {
        Route::get('users', 'UserAdminController@index');
    });

    Route::group(['prefix' => 'admin/', 'middleware' => ['web', 'auth']], function () {
        Route::get('user/create', 'UserAdminController@create');
        Route::post('user/store', 'UserAdminController@store');
        Route::get('user/{id}/edit', 'UserAdminController@edit');
        Route::put('user/{id}', 'UserAdminController@update');
        Route::delete('user/{id}', 'UserAdminController@destroy');
    });
}


