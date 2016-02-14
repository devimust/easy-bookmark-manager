(function () {

	var logoutController = function ($scope, $location, userService) {
		userService.clearModel();

		$location.path('/login');
	};

	angular.module('bookmarksApp')
		.controller('logoutController',
		['$scope', '$location', 'userService', logoutController]);

}());
