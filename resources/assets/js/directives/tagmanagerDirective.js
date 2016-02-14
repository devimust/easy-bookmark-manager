(function () {

	var tagManager = function () {

		return {

			restrict: 'E',

			scope: {tags: '='},

			templateUrl: '/views/tagmanager-directive.html',

			link: function ($scope, $element) {
				// FIXME: this is lazy and error-prone
				var input = angular.element($element.children()[1]);

				// This adds the new tag to the tags array
				$scope.add = function () {
					// somehow null value parsed
					if (!$scope.new_value) { // || $scope.new_value === ''
						$scope.new_value = "";
						return;
					}

					// valid hashtag (2+ chars starting with alphanumeric including underscores)
					var re = new RegExp('^[A-Za-z][A-Za-z0-9\\_]{1,}$');
					if (!re.test($scope.new_value)) {
						console.log('no matching...');
						return;
					}

					// if ($scope.new_value && $scope.new_value.length < 3) {
					// 	return;
					// }

					// tag not already used
					if ($scope.tags.indexOf($scope.new_value) !== -1) {
						return;
					}

					$scope.tags.push($scope.new_value);
					$scope.new_value = "";
				};

				// This is the ng-click handler to remove an item
				$scope.remove = function (idx) {
					$scope.tags.splice(idx, 1);
				};
			}
		};
	};

	angular.module('bookmarksApp').
		directive('tagManager', tagManager);

}());
