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


//    Route::get('user/login', 'Api\v1\UserController@login');
//    Route::get('user/logout', 'Api\v1\UserController@logout');
//    Route::get('user/token', 'Api\v1\UserController@token');
    Route::get('user/status', 'Api\v1\UserController@loginStatus');

});

Route::group(['prefix' => 'api/v1/', 'middleware' => ['web', 'auth']], function () {

    Route::get('bookmarks', 'Api\v1\BookmarkController@index');
    Route::post('bookmark/create', 'Api\v1\BookmarkController@create');
    Route::get('bookmark/{id}', 'Api\v1\BookmarkController@edit');
//    Route::get('bookmark/{id}/tags', 'Api\v1\BookmarkController@bookmarkTags');
    Route::put('bookmark/{id}', 'Api\v1\BookmarkController@update');
    Route::delete('bookmark/{id}', 'Api\v1\BookmarkController@delete');
    Route::post('bookmarks/import', 'Api\v1\BookmarkController@import');
    Route::get('bookmarks/duplicates', 'Api\v1\BookmarkController@duplicates');

    Route::get('bookmarks/categories-and-tags', 'Api\v1\BookmarkController@categoriesAndTags');
    Route::get('categories', 'Api\v1\BookmarkController@categories');
    Route::get('tags', 'Api\v1\BookmarkController@tags');

    Route::get('user', 'Api\v1\UserController@edit');
    Route::put('user', 'Api\v1\UserController@update');

});


Route::group(['middleware' => ['web']], function () {

    Route::get('/', 'PagesController@showIndex');

    //Route::get('auth/logout', 'Auth\AuthController@getLogout');

    Route::get('login', 'PagesController@showLogin');
    Route::post('auth/login', 'PagesController@login');
    Route::get('auth/logout', 'PagesController@logout');



});

/**
 * User admin process
 */
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


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

//Route::group(['middleware' => ['web']], function () {
//
////    Route::get('user/login', function() {
////        return view('auth.login');
////    });
////
////// Authentication routes...
////    Route::get('auth/login', 'Auth\AuthController@getLogin');
////    Route::post('auth/login', 'Auth\AuthController@postLogin');
////    Route::get('auth/logout', 'Auth\AuthController@getLogout');
////
////// Registration routes...
////    Route::get('auth/register', 'Auth\AuthController@getRegister');
////    Route::post('auth/register', 'Auth\AuthController@postRegister');
//
//});
