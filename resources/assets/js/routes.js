(function () {

    var routes = function ($routeProvider, $locationProvider) {
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

        // reverting back to no prefix in url (somehow defaulted to using ! e.g. /#!/bookmark/add)
        $locationProvider.hashPrefix('');

        // use the HTML5 History API
        $locationProvider.html5Mode(false);
    };

    angular.module('bookmarksApp')
        .config(['$routeProvider', '$locationProvider', routes]);

}());
