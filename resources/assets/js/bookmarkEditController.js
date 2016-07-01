(function () {

    var bookmarkEditController = function ($scope, $location, $routeParams, $http, $interval, userService,
                                           bookmarkService, $window) {

        $scope.viewReady = false;
        $scope.errorMessage = '';
        $scope.goodMessage = '';
        $scope.globalGoodMessage = '';
        $scope.globalErrorMessage = '';
        $scope.newItem = false;
        $scope.fromWindow = false;
        $scope.canViewSnippet = false;
        $scope.categories = [];
        $scope.busyWithAction = false;
        $scope.duplicates = [];

        $scope.bookmark = {
            favourite: false,
            title: $routeParams.title || '',
            link: $routeParams.link || '',
            snippet: '',
            category: '',
            tags: []
        };

        this.run = function () {

            bookmarkService
                .fetchCategories()
                .then(function (response) {
                    if (response.result == 'ok') {
                        $scope.categories = response.data.categories;
                    }
                });

            if ($scope.newItem) {
                bookmarkService
                    .checkDuplicates($scope.bookmark)
                    .then(function (response) {
                        if (response.result == 'ok') {
                            if (typeof response.data !== 'undefined') {
                                $scope.duplicates = response.data.bookmarks;
                            }
                        }
                    });
            } else {
                bookmarkService
                    .fetchBookmark($routeParams.bookmarkId || '')
                    .then(function (response) {
                        $scope.globalErrorMessage = '';
                        if (response.result != 'ok') {
                            $scope.globalErrorMessage = response.message;
                            $scope.viewReady = false;
                            return;
                        }

                        $scope.bookmark = response.data.bookmark;
                        var snippet = $scope.bookmark.snippet || '';
                        if (snippet !== '') {
                            $scope.canViewSnippet = true;
                        }

                    });

            }

            $scope.viewReady = true;

        };

        $scope.checkStatus = function () {
            if (
                typeof $routeParams.bookmarkId == 'undefined' ||
                $routeParams.bookmarkId === ''
            ) {
                $scope.newItem = true;
            }

            // hide header if opened from window
            if ($routeParams.window == 1) {
                $scope.fromWindow = true;
            }
        };

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
                    $scope.globalGoodMessage = 'Deleted, redirecting...';
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

                    var interval;

                    if ($scope.newItem && $scope.fromWindow == 1) {
                        $scope.goodMessage = 'Created, closing...';
                        interval = $interval(function () {
                            $interval.cancel(interval);
                            window.close();
                        }, 1000);
                        return;
                    }

                    $scope.goodMessage = 'Created';
                    interval = $interval(function () {
                        $interval.cancel(interval);
                        $location.path('/bookmark/edit/' + response.data.bookmark.id);
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

        $scope.checkStatus();

        var that = this;

        userService
            .checkLoginStatus()
            .then(function (response) {
                $scope.errorMessage = '';
                if (response.result != 'ok') {
                    if ($scope.newItem && $scope.fromWindow) {
                        $scope.globalErrorMessage = 'No session found, please login via the browser.';
                        return;
                    }

                    $scope.globalErrorMessage = response.message;
                    $window.location = '/login';

                    return;
                }
                that.run();
            });

    };

    angular.module('bookmarksApp')
        .controller('bookmarkEditController',
        ['$scope', '$location', '$routeParams', '$http', '$interval', 'userService', 'bookmarkService',
            '$window', bookmarkEditController]);

}());
