(function () {

	var bookmarkEditController = function ($scope, $location, $routeParams, $http, $interval, userService, bookmarkService) {

		$scope.viewReady = false;
		$scope.errorMessage = '';
		$scope.goodMessage = '';
		$scope.globalGoodMessage = '';
		$scope.globalErrorMessage = '';
		$scope.newItem = false;
		$scope.canViewSnippet = false;
		$scope.categories = [];
		$scope.busyWithAction = false;
		$scope.openFromWindow = false;
		$scope.duplicateDomains = 0;

		$scope.bookmark = {
			favourite: false,
			title: $routeParams.title || '',
			link: $routeParams.link || '',
			snippet: '',
			category: '',
			tags: [],
			window: $routeParams.window || 0
		};

		var user = userService.getModel();

		if ($routeParams.window == 1) {
			$scope.openFromWindow = true;
		} else {
			//$scope.canViewSnippet = true;
		}

		if (user.userId === '' || user.userToken === '') {
			//window.location.href.split("#")[1]);
			if ($location.path() === '/bookmark/add') {
				localStorage.setItem('gotoAddAfterLogin', true);
			}
			$location.path('/login');
			return false;
		}

		if (
			typeof $routeParams.bookmarkId == 'undefined' ||
			$routeParams.bookmarkId === ''
		) {
			// $location.path('/');
			$scope.newItem = true;
		}

		// hide header if opened from window
		if ($routeParams.window == 1) {
			$('div.row.container-header').hide();
		}

		// @todo find better solution to complete the add bookmark process
		$scope.closeWindow = function () {
			window.close();
			//open(location, '_self').close();
		};

		$scope.cancelUpdate = function () {
			$scope.busyWithAction = true;
			$location.path('/');
		};

		$scope.enableSnippet = function () {
			$scope.canViewSnippet = true;
		};

		$scope.deleteBookmark = function () {
			$scope.busyWithAction = true;
			$scope.viewReady = false;
			bookmarkService
				.deleteBookmark($routeParams.bookmarkId || '', $scope.bookmark)
				.then(function (response) {
					$scope.errorMessage = '';
					if (response.result != 'ok') {
						$scope.errorMessage = response.message;
						$scope.viewReady = true;
						$scope.busyWithAction = false;
						return;
					}
					$scope.globalGoodMessage = 'Deleted, hold on...';
					var interval = $interval(function () {
						$interval.cancel(interval);
						$location.path('/');
					}, 1000);
				});
		};

		$scope.categorySelect = function (selected) {
			if (selected) {
				if (typeof selected.originalObject === 'object') {
					$scope.bookmark.category = selected.originalObject.name;
				} else {
					$scope.bookmark.category = selected.originalObject;
				}
			} else {
				$scope.bookmark.category = '';
			}
		};

		$scope.createBookmark = function () {
			$scope.busyWithAction = true;
			$scope.goodMessage = '';
			$scope.errorMessage = '';
			bookmarkService
				.createBookmark($scope.bookmark)
				.then(function (response) {
					$scope.errorMessage = '';
					if (response.result != 'ok') {
						$scope.errorMessage = response.message;
						$scope.busyWithAction = false;
						return;
					}
					$scope.goodMessage = 'Created';
					var interval = $interval(function () {
						$interval.cancel(interval);
						$location.path('/bookmark/edit/' + response.data.bookmarkId);
					}, 1000);
				});
		};

		$scope.updateBookmark = function (goBack) {
			$scope.busyWithAction = true;
			$scope.goodMessage = '';
			$scope.errorMessage = '';
			bookmarkService
				.updateBookmark($routeParams.bookmarkId || '', $scope.bookmark)
				.then(function (response) {
					$scope.errorMessage = '';
					if (response.result != 'ok') {
						$scope.errorMessage = response.message;
						$scope.busyWithAction = false;
						return;
					}
					$scope.bookmark = response.data.bookmark;
					$scope.goodMessage = 'Updated';
					$scope.busyWithAction = false;
					if (goBack) {
						$scope.busyWithAction = true;
						$location.path('/');
					}
				});
		};

		if (!$scope.newItem) {
			bookmarkService
				.fetchBookmark($routeParams.bookmarkId || '')
				.then(function (response) {
					$scope.globalErrorMessage = '';
					if (response.result != 'ok') {
						$scope.globalErrorMessage = response.message;
						var interval = $interval(function () {
							$interval.cancel(interval);
							$location.path('/');
						}, 2000);
						return;
					}
					$scope.viewReady = true;
					$scope.bookmark = response.data.bookmark;
					var snippet = $scope.bookmark.snippet || '';
					if (snippet !== '') {
						$scope.canViewSnippet = true;
					}
				});
		} else {
			bookmarkService
				.checkDuplicates($scope.bookmark)
				.then(function (response) {
					$scope.viewReady = true;
					$scope.globalErrorMessage = '';
					if (response.result != 'ok') {
						return;
					}
					$scope.duplicateDomains = response.data.totalCount;
				});
		}

		bookmarkService
			.fetchCategories()
			.then(function (response) {
				if (response.result == 'ok') {
					$scope.categories = response.data.categories;
				}
			});
	};

	angular.module('bookmarksApp')
		.controller('bookmarkEditController',
		['$scope', '$location', '$routeParams', '$http', '$interval', 'userService', 'bookmarkService', bookmarkEditController]);

}());
