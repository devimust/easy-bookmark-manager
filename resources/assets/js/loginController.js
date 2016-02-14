(function () {

	var loginController = function ($scope, $location, userService) {

		$scope.viewReady = false;
		$scope.busyProcessing = false;
		$scope.loginData = {};
		$scope.errorMessage = '';
		$scope.goodMessage = '';

		$scope.user = userService.getModel();
		$scope.$watch('user', function () {
			userService.setModel($scope.user);
		});

		if ($scope.user.userId !== '' && $scope.user.userToken !== '') {
			$location.path('/');
			return;
		}

		$scope.viewReady = true;

		$scope.submitLogin = function () {

			$scope.busyProcessing = true;
			$scope.errorMessage = '';
			$scope.goodMessage = '';

			userService
				.login($scope.loginData)
				.then(function (response) {
					if (response.result != 'ok') {
						$scope.errorMessage = response.message;
						$scope.busyProcessing = false;
						userService.clearModel();
						return;
					}
					userService.setModel(response.data);
					$scope.goodMessage = 'Hold on...';
					var gotoAddAfterLogin = localStorage.getItem('gotoAddAfterLogin');
					if (gotoAddAfterLogin) {
						localStorage.removeItem('gotoAddAfterLogin');
						$location.path('/bookmark/add');
						return;
					}
					$location.path('/');
				});

		};
	};

	angular.module('bookmarksApp')
		.controller('loginController',
		['$scope', '$location', 'userService', loginController]);

}());
