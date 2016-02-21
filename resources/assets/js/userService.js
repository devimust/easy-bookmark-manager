(function () {

    var userService = function ($location, $http) {



        var service = {

            //model: {
            //    token: ''
            //},
            //
            //setModel: function (user) {
            //    this.model = user;
            //    //this.saveState();
            //},
            //
            //getModel: function () {
            //    //this.restoreState();
            //
            //    //if (this.model.token == '') {
            //    //    console.log('no model');
            //    //}
            //
            //    return this.model;
            //},
            //
            //clearModel: function () {
            //    this.model = {
            //        token: ''
            //    };
            //    //this.saveState();
            //},
            //
            //saveState: function () {
            //    if (typeof(Storage) === "undefined") {
            //        return;
            //    }
            //    localStorage.setItem('userService', angular.toJson(this.model));
            //},

            //resetAuthToken: function () {
            //    return $http
            //        .get(API_URL + 'user/resetAuthToken?'// + $.param(this.model))
            //        .then(function (response) {
            //            return response.data;
            //        });
            //},

            getDetails: function () {
                return $http
                    .get(API_URL + 'user')// + $.param(this.model))
                    .then(function (response) {
                        return response.data;
                    });
            },

            updateDetails: function (data) {
                return $http
                    .put(API_URL + 'user?' + $.param(data)) //+ $.param(this.model) + '&' +
                    .then(function (response) {
                        return response.data;
                    });
            },

            checkLoginStatus: function () {
                return $http
                    .get(API_URL + 'user/status?')// + $.param(this.model))
                    .then(function (response) {
                        return response.data;
                    });
            },

            //checkAuthToken: function () {
            //    return $http
            //        .get(API_URL + 'user/checkAuthToken?'// + $.param(this.model))
            //        .then(function (response) {
            //            return response.data;
            //        });
            //},
            //
            //login: function (data) {
            //    that = this;
            //    return $http
            //        .get(API_URL + 'user/login?' + $.param(data))
            //        .then(function (response) {
            //            // if (response.data.result == 'ok') {
            //            // that.setModel(response.data.data);
            //            // }
            //            return response.data;
            //        });
            //},
            //
            //restoreState: function () {
            //    // no local storage found
            //    if (typeof(Storage) === "undefined") {
            //        return;
            //    }
            //
            //    return;
            //    var localUser = localStorage.getItem('userService');
            //    if (localUser && typeof localUser !== 'undefined') {
            //        this.model = angular.fromJson(localUser);
            //    }
            //
            //}
        };

        return service;

    };

    angular.module('bookmarksApp')
        .service('userService', ['$location', '$http', userService]);

}());
