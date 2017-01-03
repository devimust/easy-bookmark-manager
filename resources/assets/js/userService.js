(function () {

    var userService = function ($location, $http) {

        var service = {

            getDetails: function () {
                return $http
                    .get(API_URL + 'user')
                    .then(function (response) {
                        return response.data;
                    });
            },

            getShareInfo: function () {
                return $http
                    .get(API_URL + 'user/shareInfo')
                    .then(function (response) {
                        return response.data;
                    });
            },

            updateDetails: function (data) {
                return $http
                    .put(API_URL + 'user?' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            checkLoginStatus: function () {
                return $http
                    .get(API_URL + 'user/status?')
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

        return service;

    };

    angular.module('bookmarksApp')
        .service('userService', ['$location', '$http', userService]);

}());
