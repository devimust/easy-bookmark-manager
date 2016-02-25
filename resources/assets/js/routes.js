(function () {

    var routes = function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/views/bookmark-view.html',
                controller: 'bookmarkViewController'
            }).
            when('/bookmark/edit/:bookmarkId', {
                templateUrl: '/views/bookmark-edit.html',
                controller: 'bookmarkEditController'
            }).
            when('/bookmark/add', {
                templateUrl: '/views/bookmark-edit.html',
                controller: 'bookmarkEditController'
            }).
            when('/user/edit', {
                templateUrl: '/views/user-edit.html',
                controller: 'userEditController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    };

    angular.module('bookmarksApp')
        .config(['$routeProvider', routes]);

}());
