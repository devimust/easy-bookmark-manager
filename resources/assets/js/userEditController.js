(function () {

    var userEditController = function ($scope, $location, $http, $interval, userService) {

        $scope.errorMessage = '';
        $scope.goodMessage = '';
        $scope.busyWithAction = true;
        $scope.openFromWindow = false;

        $scope.profile = {
            name: '',
            email: '',
            theme: '',
            password1: '',
            password2: ''
            //passwordOld: ''
        };

        //var user = userService.getModel();
        //
        //if (user.userId === '' || user.userToken === '') {
        //  $location.path('/login');
        //  return false;
        //}

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
                    $scope.errorMessage = 'Your new password must be at least 5 characters';
                    return;
                }
                if ($scope.profile.password1.search(/[a-z]/i) < 0) {
                    $scope.errorMessage = 'Your new password must contain at least one letter';
                    return;
                }
                if ($scope.profile.password1.search(/[0-9]/) < 0) {
                    $scope.errorMessage = 'Your new password must contain at least one digit';
                    return;
                }
                if ($scope.profile.password1 != $scope.profile.password2) {
                    $scope.errorMessage = 'Both passwords must match';
                    return;
                }
                //if ($scope.profile.password1 == $scope.profile.passwordOld) {
                //    $scope.errorMessage = 'Your old and new passwords are the same';
                //    return;
                //}
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
                    $scope.goodMessage = 'Details updated.';
                    $scope.profile.password1 = '';
                    $scope.profile.password2 = '';
                    //$scope.profile.passwordOld = '';
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
        ['$scope', '$location', '$http', '$interval', 'userService', userEditController]);

}());
