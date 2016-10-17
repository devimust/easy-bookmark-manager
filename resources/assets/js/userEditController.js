(function () {

    var userEditController = function ($scope, $location, $http, $interval, userService, $filter) {

        $scope.errorMessage = '';
        $scope.goodMessage = '';
        $scope.busyWithAction = true;

        $scope.profile = {
            name: '',
            email: '',
            theme: '',
            password1: '',
            password2: ''
        };

        var theme = localStorage.getItem('theme') || 'bootstrap-yeti';
        $scope.profile.theme = theme;

        userService
            .getDetails()
            .then(function (response) {
                $scope.busyWithAction = false;
                if (response.result != 'ok') {
                    $scope.errorMessage = response.message;
                    return;
                }
                $scope.profile.name = response.data.user.name;
                $scope.profile.email = response.data.user.email;
            });

        $scope.updateUser = function () {
            $scope.errorMessage = '';
            $scope.goodMessage = '';

            if ($scope.profile.password1.length > 0) {
                if ($scope.profile.password1.length < 5) {
                    $scope.errorMessage = $filter('translate')('message.password.length');
                    return;
                }
                if ($scope.profile.password1.search(/[a-z]/i) < 0) {
                    $scope.errorMessage = $filter('translate')('message.password.oneLetter');
                    return;
                }
                if ($scope.profile.password1.search(/[0-9]/) < 0) {
                    $scope.errorMessage = $filter('translate')('message.password.oneDigit');
                    return;
                }
                if ($scope.profile.password1 != $scope.profile.password2) {
                    $scope.errorMessage = $filter('translate')('message.password.match');
                    return;
                }
            }

            $scope.busyWithAction = true;

            userService
                .updateDetails($scope.profile)
                .then(function (response) {
                    $scope.busyWithAction = false;
                    if (response.result != 'ok') {
                        $scope.errorMessage = response.message;
                        return;
                    }
                    $scope.goodMessage = $filter('translate')('message.password.updated');
                    $scope.profile.password1 = '';
                    $scope.profile.password2 = '';
                });
        };

        $scope.changeTheme = function (item) {
            localStorage.setItem('theme', item);
            $scope.profile.theme = item;
            $('.custom-css').remove();
            loadTheme();
        };

        $scope.cancelUpdate = function () {
            $scope.busyWithAction = true;
            $location.path('/');
        };
    };

    angular.module('bookmarksApp')
        .controller('userEditController',
        ['$scope', '$location', '$http', '$interval', 'userService', '$filter', userEditController]);

}());
