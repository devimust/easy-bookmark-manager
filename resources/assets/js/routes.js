(function () {

	var routes = function ($routeProvider) {
		$routeProvider.
			when('/login', {
				templateUrl: '/views/login.html',
				controller: 'loginController'
			}).
			when('/logout', {
				templateUrl: '/views/logout.html',
				controller: 'logoutController'
			}).
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
