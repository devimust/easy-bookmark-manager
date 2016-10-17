(function () {

    var bookmarkViewController = function ($scope, $location, $http, userService, bookmarkService, sessionService, $interval, $timeout, $window, $filter) {

        $scope.categories = [];
        $scope.tags = [];
        $scope.bookmarks = [];
        $scope.viewReady = false;
        $scope.busyImporting = false;
        $scope.loadingBookmarks = true;
        $scope.badDataResponse = '';
        $scope.selectedCategories = [];
        $scope.selectedTags = [];
        $scope.bookmarkResults = {
            page: 1,
            maxPages: 0,
            limit: 10,
            totalCount: 0
        };
        $scope.maxCloudTagValue = 0;

        $scope.globalErrorMessage = '';
        $scope.globalGoodMessage = '';

        var filterTextTimeout;
        var session = sessionService.getModel();

        $scope.search = session.search;
        $scope.bookmarkResults.page = session.pageNo;

        this.run = function () {

            userService
                .checkLoginStatus()
                .then(function (response) {
                    $scope.errorMessage = '';
                    if (response.result != 'ok') {
                        $scope.globalErrorMessage = response.message;
                        $window.location = '/login';
                        return;
                    }

                    bookmarkService
                        .fetchCategoriesAndTags()
                        .then(function (response) {
                            if (response.result == 'ok') {
                                $scope.categories = response.data.categories;

                                for(var i = 5; i < $scope.categories.length; i++){
                                    $scope.categories[i].hidden = true;
                                }

                                // sort tags randomly
                                $scope.tags = response.data.tags.sort(function() {
                                    return 0.5 - Math.random();
                                });
                            }
                        });

                    $scope.fetchFilteredBookmarks();

                    $scope.viewReady = true;

                });
        };

        // Set all categories to be shown when clicking on load more link.
        $scope.loadMore = function () {
            for(var i = 5; i < $scope.categories.length; i++){
                $scope.categories[i].hidden = false;
            }
        };

        $scope.clearSearch = function () {
            $scope.search = '';
            $scope.searchKeyUp('');
            $('#searchText').val('');
        };

        $scope.fetchFilteredBookmarks = function () {
            $scope.bookmarks = null;
            $scope.loadingBookmarks = true;
            $scope.badDataResponse = '';

            bookmarkService
                .fetchFilteredBookmarks(
                    $scope.selectedCategories,
                    $scope.selectedTags,
                    $scope.search,
                    $scope.bookmarkResults.page,
                    $scope.bookmarkResults.limit
            )
                .then(function (response) {
                    $scope.loadingBookmarks = false;
                    if (response.result == 'ok') {
                        $scope.bookmarks = response.data.bookmarks;
                        $scope.bookmarkResults.maxPages = Math.ceil(response.data.totalCount / $scope.bookmarkResults.limit);
                        $scope.bookmarkResults.totalCount = response.data.totalCount;
                    } else {
                        $scope.badDataResponse = response.message;
                    }
                });
        };

        $scope.toggleTag = function (tag) {
            $scope.bookmarkResults.page = 1;
            tag.selected = !tag.selected;
            if ($scope.selectedTags.indexOf(tag.name) != -1) {
                $scope.selectedTags.splice($scope.selectedTags.indexOf(tag.name), 1);
            } else {
                $scope.selectedTags.push(tag.name);
            }
            $scope.fetchFilteredBookmarks();
        };

        $scope.calculateMaxCloudTagValue = function () {
            for (var i=0; i<$scope.tags.length; i++) {
                if (parseInt($scope.tags[i].count) > parseInt($scope.maxCloudTagValue)) {
                    $scope.maxCloudTagValue = $scope.tags[i].count;
                }
            }
        };

        $scope.getCloudClass = function (tag) {
            // Return more readable size if there are not many tags.
            if ($scope.tags.length < 6) {
                return 'tag1';
            }

            var maxVal = 5;
            var num = Math.ceil(tag.count * maxVal / $scope.maxCloudTagValue);

            return 'tag' + num;
        };

        $scope.toggleCategory = function (category) {
            $scope.bookmarkResults.page = 1;
            category.selected = !category.selected;
            if ($scope.selectedCategories.indexOf(category.name) != -1) {
                $scope.selectedCategories.splice($scope.selectedCategories.indexOf(category.name), 1);
            } else {
                $scope.selectedCategories.push(category.name);
            }
            $scope.fetchFilteredBookmarks();
        };

        $scope.searchKeyUp = function (search) {
            $scope.bookmarkResults.page = 1;
            if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
            }
            filterTextTimeout = $timeout(function () {
                $scope.search = search;
                session.search = search;
                sessionService.setModel(session);
                $scope.fetchFilteredBookmarks();
            }, 250); // delay 250 ms
        };

        $scope.newBookmark = function () {
            $location.path('/bookmark/add');
        };

        $scope.logout = function () {
            $window.location = '/auth/logout';
        };

        $scope.nextPage = function () {
            $scope.bookmarkResults.page++;
            session.pageNo = $scope.bookmarkResults.page;
            sessionService.setModel(session);
            $scope.fetchFilteredBookmarks();
        };

        $scope.prevPage = function () {
            $scope.bookmarkResults.page--;
            session.pageNo = $scope.bookmarkResults.page;
            sessionService.setModel(session);
            $scope.fetchFilteredBookmarks();
        };

        $scope.editUser = function () {
            $location.path('/user/edit');
        };

        $scope.editBookmark = function (event, bookmark) {
            event.stopPropagation();
            event.preventDefault();
            $location.path('/bookmark/edit/' + bookmark.id);
            return false;
        };

        $scope.gotoBookmark = function (event, bookmark) {
            event.stopPropagation();
            event.preventDefault();
            if (bookmark.link) {
                var win = window.open(bookmark.link, '_blank');
                win.focus();
            } else {
                $scope.editBookmark(event, bookmark);
            }
        };

        $scope.exportData = function () {
            $window.location = bookmarkService.getExportBookmarksUrl();
        };

        $scope.uploadFile = function (files) {
            $scope.busyImporting = true;
            $scope.globalErrorMessage = '';
            $scope.globalGoodMessage = '';

            var fd = new FormData();
            fd.append("bookmarkfile", files[0]);

            bookmarkService
                .importBookmarks(fd)
                .then(function (response) {
                    $scope.busyImporting = false;
                    if (response.result != 'ok') {
                        $scope.globalErrorMessage = response.message;
                        return;
                    }
                    $scope.globalGoodMessage = $filter('translate')('message.bookmark.import', {count : response.data.imported});
                    var interval = $interval(function () {
                        $interval.cancel(interval);
                        $window.location.reload();
                    }, 1500);
                });
        };

        this.run();

    };

    angular.module('bookmarksApp')
        .controller('bookmarkViewController',
        ['$scope', '$location', '$http', 'userService', 'bookmarkService', 'sessionService', '$interval', '$timeout', '$window', '$filter',
            bookmarkViewController]);

}());
