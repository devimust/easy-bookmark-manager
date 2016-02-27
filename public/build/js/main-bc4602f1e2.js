/*jshint scripturl:true*/

var API_URL = window.location.origin + '/api/v1/';

(function () {

    //angular.module("pingMod", [])
    //    .run(function ($http, $interval) {
    //        var TIME = 1000;
    //        function ping() {
    //            $http.get("/ping");
    //        }
    //        $interval(ping, TIME);
    //    });

    angular.module('bookmarksApp', ['ngRoute', 'angucomplete-alt', 'ui.ace']);

}());

$(function () {
    function generateBookmarkMe() {

        function extractDomain(url) {
            var domain;
            //find & remove protocol (http, ftp, etc.) and get domain
            if (url.indexOf("://") > -1) {
                domain = url.split('/')[2];
            } else {
                domain = url.split('/')[0];
            }
            //find & remove port number
            domain = domain.split(':')[0];
            return window.location.protocol + '//' + domain + '/';
        }

        var bookmarkMeText = '';
        bookmarkMeText += '(';
        bookmarkMeText += ' function() {';
        bookmarkMeText += ' 	l="' + extractDomain(window.location.href) + '#/bookmark/add?title="+encodeURIComponent(document.title)+"&link="+encodeURIComponent(window.location.href);';
        bookmarkMeText += ' 	var e=window.open(l+"&window=1","EasyBookmarkManager","location=0,links=0,scrollbars=0,toolbar=0,width=594,height=600");';
        bookmarkMeText += ' }';
        bookmarkMeText += ')()';

        $('a.bookmark-me-link').attr('href', 'javascript:' + encodeURIComponent(bookmarkMeText));
    }

    generateBookmarkMe();
});

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
                $('div.row.container-header h1 .hide-for-window').hide();
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

(function () {

    var bookmarkService = function ($location, $http) {

        var service = {

            fetchCategoriesAndTags: function () {
                return $http
                    .get(API_URL + 'bookmarks/categories-and-tags')
                    .then(function (response) {
                        return response.data;
                    });
            },

            fetchCategories: function () {
                return $http
                    .get(API_URL + 'categories')
                    .then(function (response) {
                        return response.data;
                    });
            },

            fetchTags: function () {
                return $http
                    .get(API_URL + 'tags')
                    .then(function (response) {
                        return response.data;
                    });
            },

            fetchFilteredBookmarks: function (categories, tags, search, page, limit) {
                return $http
                    .get(API_URL +
                        'bookmarks?' +
                        'categories=' + categories +
                        '&tags=' + tags +
                        '&search=' + search +
                        '&page=' + page +
                        '&limit=' + limit)
                    .then(function (response) {
                        return response.data;
                    });
            },

            fetchBookmark: function (bookmarkId) {
                return $http
                    .get(API_URL + 'bookmark/' + bookmarkId)
                    .then(function (response) {
                        return response.data;
                    });
            },

            createBookmark: function (data) {
                return $http
                    .post(API_URL + 'bookmark/create?' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            checkDuplicates: function (data) {
                return $http
                    .get(API_URL + 'bookmarks/duplicates?' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            updateBookmark: function (bookmarkId, data) {
                return $http
                    .put(API_URL + 'bookmark/' + bookmarkId + '?' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            deleteBookmark: function (bookmarkId, data) {
                return $http
                    .delete(API_URL + 'bookmark/' + bookmarkId + '?' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            importBookmarks: function (data) {
                return $http
                    .post(API_URL + 'bookmarks/import?', data, { //$.param(user), data, {
                        withCredentials: true,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    })
                    .then(function (response) {
                        return response.data;
                    });
            },

        };

        return service;
    };

    angular.module('bookmarksApp')
        .service('bookmarkService', ['$location', '$http', bookmarkService]);

}());

(function () {

    var bookmarkViewController = function ($scope, $location, $http, userService, bookmarkService, sessionService, $interval, $timeout, $window) {

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
                    $scope.globalGoodMessage = 'Imported ' + response.data.imported + ' record(s), reloading...';
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
        ['$scope', '$location', '$http', 'userService', 'bookmarkService', 'sessionService', '$interval', '$timeout', '$window',
            bookmarkViewController]);

}());

(function () {

    var filterByTags = function () {
        return function (items, tags, categories) {
            var filtered = [];

            (items || []).forEach(function (item) {

                var tagExist = false;
                (item.tags || []).forEach(function (itemTag) {
                    if (tags.indexOf(itemTag) != -1) {
                        tagExist = true;
                    }
                });

                var categoryExist = false;

                if (categories.indexOf(item.category) != -1) {
                    categoryExist = true;
                }

                if (categories.length === 0 && tags.length === 0) {
                    filtered.push(item);
                } else if (tags.length === 0 && categoryExist) {
                    filtered.push(item);
                } else if (categories.length === 0 && tagExist) {
                    filtered.push(item);
                } else if (categoryExist && tagExist) {
                    filtered.push(item);
                }

            });
            return filtered;
        };
    };

    var cut = function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    };

    angular.module('bookmarksApp')
        .filter('filterByTags', filterByTags);

    angular.module('bookmarksApp')
        .filter('cut', cut);

}());

(function () {

    var routes = function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/views/bookmark-view.html',
                controller: 'bookmarkViewController'
            }).
            when('/bookmark/edit/:bookmarkId', {
                templateUrl: '/views/bookmark-edit.html',
                controller: 'bookmarkEditController'
            }).
            when('/bookmark/add', {
                templateUrl: '/views/bookmark-edit.html',
                controller: 'bookmarkEditController'
            }).
            when('/user/edit', {
                templateUrl: '/views/user-edit.html',
                controller: 'userEditController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    };

    angular.module('bookmarksApp')
        .config(['$routeProvider', routes]);

}());

(function () {

    var sessionService = function () {

        var service = {

            model: {
                theme: '',
                search: '',
                pageNo: 1
            },

            setModel: function (data) {
                this.model = data;
            },

            getModel: function () {
                return this.model;
            },

            clearModel: function () {
                this.model = {
                    theme: '',
                    search: '',
                    pageNo: 1
                };
            }

        };

        return service;

    };

    angular.module('bookmarksApp')
        .service('sessionService', [sessionService]);

}());

(function () {

    var userEditController = function ($scope, $location, $http, $interval, userService) {

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

/*
 * angucomplete-alt
 * Autocomplete directive for AngularJS
 * This is a fork of Daryl Rowland's angucomplete with some extra features.
 * By Hidenari Nozaki
 */

/*! Copyright (c) 2014 Hidenari Nozaki and contributors | Licensed under the MIT license */

'use strict';

(function (root, factory) {
	if (typeof module !== 'undefined' && module.exports) {
		// CommonJS
		module.exports = factory(require('angular'));
	} else if (typeof define === 'function' && define.amd) {
		// AMD
		define(['angular'], factory);
	} else {
		// Global Variables
		factory(root.angular);
	}
}(window, function (angular) {

	angular.module('angucomplete-alt', []).directive('angucompleteAlt', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', '$interpolate', function ($q, $parse, $http, $sce, $timeout, $templateCache, $interpolate) {
		// keyboard events
		var KEY_DW  = 40;
		var KEY_RT  = 39;
		var KEY_UP  = 38;
		var KEY_LF  = 37;
		var KEY_ES  = 27;
		var KEY_EN  = 13;
		var KEY_TAB =  9;

		var MIN_LENGTH = 3;
		var MAX_LENGTH = 524288;  // the default max length per the html maxlength attribute
		var PAUSE = 500;
		var BLUR_TIMEOUT = 200;

		// string constants
		var REQUIRED_CLASS = 'autocomplete-required';
		var TEXT_SEARCHING = 'Searching...';
		var TEXT_NORESULTS = 'No results found';
		var TEMPLATE_URL = '/angucomplete-alt/index.html';

		// Set the default template for this directive
		$templateCache.put(TEMPLATE_URL,
			'<div class="angucomplete-holder" ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">' +
			'  <input id="{{id}}_value" name="{{inputName}}" ng-class="{\'angucomplete-input-not-empty\': notEmpty}" ng-model="searchStr" ng-disabled="disableInput" type="{{inputType}}" placeholder="{{placeholder}}" maxlength="{{maxlength}}" ng-focus="onFocusHandler()" class="{{inputClass}}" ng-focus="resetHideResults()" ng-blur="hideResults($event)" autocapitalize="off" autocorrect="off" autocomplete="off" ng-change="inputChangeHandler(searchStr)"/>' +
			'  <div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-show="showDropdown">' +
			'    <div class="angucomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
			'    <div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
			'    <div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}">' +
			'      <div ng-if="imageField" class="angucomplete-image-holder">' +
			'        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/>' +
			'        <div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div>' +
			'      </div>' +
			'      <div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>' +
			'      <div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div>' +
			'      <div ng-if="matchClass && result.description && result.description != \'\'" class="angucomplete-description" ng-bind-html="result.description"></div>' +
			'      <div ng-if="!matchClass && result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div>' +
			'    </div>' +
			'  </div>' +
			'</div>'
		);

		function link(scope, elem, attrs, ctrl) {
			var inputField = elem.find('input');
			var minlength = MIN_LENGTH;
			var searchTimer = null;
			var hideTimer;
			var requiredClassName = REQUIRED_CLASS;
			var responseFormatter;
			var validState = null;
			var httpCanceller = null;
			var dd = elem[0].querySelector('.angucomplete-dropdown');
			var isScrollOn = false;
			var mousedownOn = null;
			var unbindInitialValue;
			var displaySearching;
			var displayNoResults;

			elem.on('mousedown', function(event) {
				if (event.target.id) {
					mousedownOn = event.target.id;
					if (mousedownOn === scope.id + '_dropdown') {
						document.body.addEventListener('click', clickoutHandlerForDropdown);
					}
				}
				else {
					mousedownOn = event.target.className;
				}
			});

			scope.currentIndex = scope.focusFirst ? 0 : null;
			scope.searching = false;
			unbindInitialValue = scope.$watch('initialValue', function(newval) {
				if (newval) {
					// remove scope listener
					unbindInitialValue();
					// change input
					handleInputChange(newval, true);
				}
			});

			scope.$watch('fieldRequired', function(newval, oldval) {
				if (newval !== oldval) {
					if (!newval) {
						ctrl[scope.inputName].$setValidity(requiredClassName, true);
					}
					else if (!validState || scope.currentIndex === -1) {
						handleRequired(false);
					}
					else {
						handleRequired(true);
					}
				}
			});

			scope.$on('angucomplete-alt:clearInput', function (event, elementId) {
				if (!elementId || elementId === scope.id) {
					scope.searchStr = null;
					callOrAssign();
					handleRequired(false);
					clearResults();
				}
			});

			scope.$on('angucomplete-alt:changeInput', function (event, elementId, newval) {
				if (!!elementId && elementId === scope.id) {
					handleInputChange(newval);
				}
			});

			function handleInputChange(newval, initial) {
				if (newval) {
					if (typeof newval === 'object') {
						scope.searchStr = extractTitle(newval);
						callOrAssign({originalObject: newval});
					} else if (typeof newval === 'string' && newval.length > 0) {
						scope.searchStr = newval;
					} else {
						if (console && console.error) {
							console.error('Tried to set ' + (!!initial ? 'initial' : '') + ' value of angucomplete to', newval, 'which is an invalid value');
						}
					}

					handleRequired(true);
				}
			}

			// #194 dropdown list not consistent in collapsing (bug).
			function clickoutHandlerForDropdown(event) {
				mousedownOn = null;
				scope.hideResults(event);
				document.body.removeEventListener('click', clickoutHandlerForDropdown);
			}

			// for IE8 quirkiness about event.which
			function ie8EventNormalizer(event) {
				return event.which ? event.which : event.keyCode;
			}

			function callOrAssign(value) {
				if (typeof scope.selectedObject === 'function') {
					scope.selectedObject(value);
				}
				else {
					scope.selectedObject = value;
				}

				if (value) {
					handleRequired(true);
				}
				else {
					handleRequired(false);
				}
			}

			function callFunctionOrIdentity(fn) {
				return function(data) {
					return scope[fn] ? scope[fn](data) : data;
				};
			}

			function setInputString(str) {
				callOrAssign({originalObject: str});

				if (scope.clearSelected) {
					scope.searchStr = null;
				}
				clearResults();
			}

			function extractTitle(data) {
				// split title fields and run extractValue for each and join with ' '
				return scope.titleField.split(',')
					.map(function(field) {
						return extractValue(data, field);
					})
					.join(' ');
			}

			function extractValue(obj, key) {
				var keys, result;
				if (key) {
					keys= key.split('.');
					result = obj;
					for (var i = 0; i < keys.length; i++) {
						result = result[keys[i]];
					}
				}
				else {
					result = obj;
				}
				return result;
			}

			function findMatchString(target, str) {
				var result, matches, re;
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
				// Escape user input to be treated as a literal string within a regular expression
				re = new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
				if (!target) { return; }
				if (!target.match || !target.replace) { target = target.toString(); }
				matches = target.match(re);
				if (matches) {
					result = target.replace(re,
						'<span class="'+ scope.matchClass +'">'+ matches[0] +'</span>');
				}
				else {
					result = target;
				}
				return $sce.trustAsHtml(result);
			}

			function handleRequired(valid) {
				scope.notEmpty = valid;
				validState = scope.searchStr;
				if (scope.fieldRequired && ctrl && scope.inputName) {
					ctrl[scope.inputName].$setValidity(requiredClassName, valid);
				}
			}

			function keyupHandler(event) {
				var which = ie8EventNormalizer(event);
				if (which === KEY_LF || which === KEY_RT) {
					// do nothing
					return;
				}

				if (which === KEY_UP || which === KEY_EN) {
					event.preventDefault();
				}
				else if (which === KEY_DW) {
					event.preventDefault();
					if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
						initResults();
						scope.searching = true;
						searchTimerComplete(scope.searchStr);
					}
				}
				else if (which === KEY_ES) {
					clearResults();
					scope.$apply(function() {
						inputField.val(scope.searchStr);
					});
				}
				else {
					if (minlength === 0 && !scope.searchStr) {
						return;
					}

					if (!scope.searchStr || scope.searchStr === '') {
						scope.showDropdown = false;
					} else if (scope.searchStr.length >= minlength) {
						initResults();

						if (searchTimer) {
							$timeout.cancel(searchTimer);
						}

						scope.searching = true;

						searchTimer = $timeout(function() {
							searchTimerComplete(scope.searchStr);
						}, scope.pause);
					}

					if (validState && validState !== scope.searchStr && !scope.clearSelected) {
						scope.$apply(function() {
							callOrAssign();
						});
					}
				}
			}

			function handleOverrideSuggestions(event) {
				if (scope.overrideSuggestions &&
					!(scope.selectedObject && scope.selectedObject.originalObject === scope.searchStr)) {
					if (event) {
						event.preventDefault();
					}

					// cancel search timer
					$timeout.cancel(searchTimer);
					// cancel http request
					cancelHttpRequest();

					setInputString(scope.searchStr);
				}
			}

			function dropdownRowOffsetHeight(row) {
				var css = getComputedStyle(row);
				return row.offsetHeight +
					parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
			}

			function dropdownHeight() {
				return dd.getBoundingClientRect().top +
					parseInt(getComputedStyle(dd).maxHeight, 10);
			}

			function dropdownRow() {
				return elem[0].querySelectorAll('.angucomplete-row')[scope.currentIndex];
			}

			function dropdownRowTop() {
				return dropdownRow().getBoundingClientRect().top -
					(dd.getBoundingClientRect().top +
					parseInt(getComputedStyle(dd).paddingTop, 10));
			}

			function dropdownScrollTopTo(offset) {
				dd.scrollTop = dd.scrollTop + offset;
			}

			function updateInputField(){
				var current = scope.results[scope.currentIndex];
				if (scope.matchClass) {
					inputField.val(extractTitle(current.originalObject));
				}
				else {
					inputField.val(current.title);
				}
			}

			function keydownHandler(event) {
				var which = ie8EventNormalizer(event);
				var row = null;
				var rowTop = null;

				if (which === KEY_EN && scope.results) {
					if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
						event.preventDefault();
						scope.selectResult(scope.results[scope.currentIndex]);
					} else {
						handleOverrideSuggestions(event);
						clearResults();
					}
					scope.$apply();
				} else if (which === KEY_DW && scope.results) {
					event.preventDefault();
					if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
						scope.$apply(function() {
							scope.currentIndex ++;
							updateInputField();
						});

						if (isScrollOn) {
							row = dropdownRow();
							if (dropdownHeight() < row.getBoundingClientRect().bottom) {
								dropdownScrollTopTo(dropdownRowOffsetHeight(row));
							}
						}
					}
				} else if (which === KEY_UP && scope.results) {
					event.preventDefault();
					if (scope.currentIndex >= 1) {
						scope.$apply(function() {
							scope.currentIndex --;
							updateInputField();
						});

						if (isScrollOn) {
							rowTop = dropdownRowTop();
							if (rowTop < 0) {
								dropdownScrollTopTo(rowTop - 1);
							}
						}
					}
					else if (scope.currentIndex === 0) {
						scope.$apply(function() {
							scope.currentIndex = -1;
							inputField.val(scope.searchStr);
						});
					}
				} else if (which === KEY_TAB) {
					if (scope.results && scope.results.length > 0 && scope.showDropdown) {
						if (scope.currentIndex === -1 && scope.overrideSuggestions) {
							// intentionally not sending event so that it does not
							// prevent default tab behavior
							handleOverrideSuggestions();
						}
						else {
							if (scope.currentIndex === -1) {
								scope.currentIndex = 0;
							}
							scope.selectResult(scope.results[scope.currentIndex]);
							scope.$digest();
						}
					}
					else {
						// no results
						// intentionally not sending event so that it does not
						// prevent default tab behavior
						if (scope.searchStr && scope.searchStr.length > 0) {
							handleOverrideSuggestions();
						}
					}
				} else if (which === KEY_ES) {
					// This is very specific to IE10/11 #272
					// without this, IE clears the input text
					event.preventDefault();
				}
			}

			function httpSuccessCallbackGen(str) {
				return function(responseData, status, headers, config) {
					// normalize return obejct from promise
					if (!status && !headers && !config && responseData.data) {
						responseData = responseData.data;
					}
					scope.searching = false;
					processResults(
						extractValue(responseFormatter(responseData), scope.remoteUrlDataField),
						str);
				};
			}

			function httpErrorCallback(errorRes, status, headers, config) {
				// cancelled/aborted
				if (status === 0 || status === -1) { return; }

				// normalize return obejct from promise
				if (!status && !headers && !config) {
					status = errorRes.status;
				}
				if (scope.remoteUrlErrorCallback) {
					scope.remoteUrlErrorCallback(errorRes, status, headers, config);
				}
				else {
					if (console && console.error) {
						console.error('http error');
					}
				}
			}

			function cancelHttpRequest() {
				if (httpCanceller) {
					httpCanceller.resolve();
				}
			}

			function getRemoteResults(str) {
				var params = {},
					url = scope.remoteUrl + encodeURIComponent(str);
				if (scope.remoteUrlRequestFormatter) {
					params = {params: scope.remoteUrlRequestFormatter(str)};
					url = scope.remoteUrl;
				}
				if (!!scope.remoteUrlRequestWithCredentials) {
					params.withCredentials = true;
				}
				cancelHttpRequest();
				httpCanceller = $q.defer();
				params.timeout = httpCanceller.promise;
				$http.get(url, params)
					.success(httpSuccessCallbackGen(str))
					.error(httpErrorCallback);
			}

			function getRemoteResultsWithCustomHandler(str) {
				cancelHttpRequest();

				httpCanceller = $q.defer();

				scope.remoteApiHandler(str, httpCanceller.promise)
					.then(httpSuccessCallbackGen(str))
					.catch(httpErrorCallback);

				/* IE8 compatible
				 scope.remoteApiHandler(str, httpCanceller.promise)
				 ['then'](httpSuccessCallbackGen(str))
				 ['catch'](httpErrorCallback);
				 */
			}

			function clearResults() {
				scope.showDropdown = false;
				scope.results = [];
				if (dd) {
					dd.scrollTop = 0;
				}
			}

			function initResults() {
				scope.showDropdown = displaySearching;
				scope.currentIndex = scope.focusFirst ? 0 : -1;
				scope.results = [];
			}

			function getLocalResults(str) {
				var i, match, s, value,
					searchFields = scope.searchFields.split(','),
					matches = [];
				if (typeof scope.parseInput() !== 'undefined') {
					str = scope.parseInput()(str);
				}
				for (i = 0; i < scope.localData.length; i++) {
					match = false;

					for (s = 0; s < searchFields.length; s++) {
						value = extractValue(scope.localData[i], searchFields[s]) || '';
						match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
					}

					if (match) {
						matches[matches.length] = scope.localData[i];
					}
				}

				scope.searching = false;
				processResults(matches, str);
			}

			function checkExactMatch(result, obj, str){
				if (!str) { return false; }
				for(var key in obj){
					if(obj[key].toLowerCase() === str.toLowerCase()){
						scope.selectResult(result);
						return true;
					}
				}
				return false;
			}

			function searchTimerComplete(str) {
				// Begin the search
				if (!str || str.length < minlength) {
					return;
				}
				if (scope.localData) {
					scope.$apply(function() {
						getLocalResults(str);
					});
				}
				else if (scope.remoteApiHandler) {
					getRemoteResultsWithCustomHandler(str);
				} else {
					getRemoteResults(str);
				}
			}

			function processResults(responseData, str) {
				var i, description, image, text, formattedText, formattedDesc;

				if (responseData && responseData.length > 0) {
					scope.results = [];

					for (i = 0; i < responseData.length; i++) {
						if (scope.titleField && scope.titleField !== '') {
							text = formattedText = extractTitle(responseData[i]);
						}

						description = '';
						if (scope.descriptionField) {
							description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
						}

						image = '';
						if (scope.imageField) {
							image = extractValue(responseData[i], scope.imageField);
						}

						if (scope.matchClass) {
							formattedText = findMatchString(text, str);
							formattedDesc = findMatchString(description, str);
						}

						scope.results[scope.results.length] = {
							title: formattedText,
							description: formattedDesc,
							image: image,
							originalObject: responseData[i]
						};
					}

				} else {
					scope.results = [];
				}

				if (scope.autoMatch && scope.results.length === 1 &&
					checkExactMatch(scope.results[0],
						{title: text, desc: description || ''}, scope.searchStr)) {
					scope.showDropdown = false;
				} else if (scope.results.length === 0 && !displayNoResults) {
					scope.showDropdown = false;
				} else {
					scope.showDropdown = true;
				}
			}

			function showAll() {
				if (scope.localData) {
					processResults(scope.localData, '');
				}
				else if (scope.remoteApiHandler) {
					getRemoteResultsWithCustomHandler('');
				}
				else {
					getRemoteResults('');
				}
			}

			scope.onFocusHandler = function() {
				if (scope.focusIn) {
					scope.focusIn();
				}
				if (minlength === 0 && (!scope.searchStr || scope.searchStr.length === 0)) {
					scope.currentIndex = scope.focusFirst ? 0 : scope.currentIndex;
					scope.showDropdown = true;
					showAll();
				}
			};

			scope.hideResults = function() {
				if (mousedownOn &&
					(mousedownOn === scope.id + '_dropdown' ||
					mousedownOn.indexOf('angucomplete') >= 0)) {
					mousedownOn = null;
				}
				else {
					hideTimer = $timeout(function() {
						clearResults();
						scope.$apply(function() {
							if (scope.searchStr && scope.searchStr.length > 0) {
								inputField.val(scope.searchStr);
							}
						});
					}, BLUR_TIMEOUT);
					cancelHttpRequest();

					if (scope.focusOut) {
						scope.focusOut();
					}

					if (scope.overrideSuggestions) {
						if (scope.searchStr && scope.searchStr.length > 0 && scope.currentIndex === -1) {
							handleOverrideSuggestions();
						}
					}
				}
			};

			scope.resetHideResults = function() {
				if (hideTimer) {
					$timeout.cancel(hideTimer);
				}
			};

			scope.hoverRow = function(index) {
				scope.currentIndex = index;
			};

			scope.selectResult = function(result) {
				// Restore original values
				if (scope.matchClass) {
					result.title = extractTitle(result.originalObject);
					result.description = extractValue(result.originalObject, scope.descriptionField);
				}

				if (scope.clearSelected) {
					scope.searchStr = null;
				}
				else {
					scope.searchStr = result.title;
				}
				callOrAssign(result);
				clearResults();
			};

			scope.inputChangeHandler = function(str) {
				if (str.length < minlength) {
					cancelHttpRequest();
					clearResults();
				}
				else if (str.length === 0 && minlength === 0) {
					scope.searching = false;
					showAll();
				}

				if (scope.inputChanged) {
					str = scope.inputChanged(str);
				}
				return str;
			};

			// check required
			if (scope.fieldRequiredClass && scope.fieldRequiredClass !== '') {
				requiredClassName = scope.fieldRequiredClass;
			}

			// check min length
			if (scope.minlength && scope.minlength !== '') {
				minlength = parseInt(scope.minlength, 10);
			}

			// check pause time
			if (!scope.pause) {
				scope.pause = PAUSE;
			}

			// check clearSelected
			if (!scope.clearSelected) {
				scope.clearSelected = false;
			}

			// check override suggestions
			if (!scope.overrideSuggestions) {
				scope.overrideSuggestions = false;
			}

			// check required field
			if (scope.fieldRequired && ctrl) {
				// check initial value, if given, set validitity to true
				if (scope.initialValue) {
					handleRequired(true);
				}
				else {
					handleRequired(false);
				}
			}

			scope.inputType = attrs.type ? attrs.type : 'text';

			// set strings for "Searching..." and "No results"
			scope.textSearching = attrs.textSearching ? attrs.textSearching : TEXT_SEARCHING;
			scope.textNoResults = attrs.textNoResults ? attrs.textNoResults : TEXT_NORESULTS;
			displaySearching = scope.textSearching === 'false' ? false : true;
			displayNoResults = scope.textNoResults === 'false' ? false : true;

			// set max length (default to maxlength deault from html
			scope.maxlength = attrs.maxlength ? attrs.maxlength : MAX_LENGTH;

			// register events
			inputField.on('keydown', keydownHandler);
			inputField.on('keyup', keyupHandler);

			// set response formatter
			responseFormatter = callFunctionOrIdentity('remoteUrlResponseFormatter');

			// set isScrollOn
			$timeout(function() {
				var css = getComputedStyle(dd);
				isScrollOn = css.maxHeight && css.overflowY === 'auto';
			});
		}

		return {
			restrict: 'EA',
			require: '^?form',
			scope: {
				selectedObject: '=',
				disableInput: '=',
				initialValue: '=',
				localData: '=',
				remoteUrlRequestFormatter: '=',
				remoteUrlRequestWithCredentials: '@',
				remoteUrlResponseFormatter: '=',
				remoteUrlErrorCallback: '=',
				remoteApiHandler: '=',
				id: '@',
				type: '@',
				placeholder: '@',
				remoteUrl: '@',
				remoteUrlDataField: '@',
				titleField: '@',
				descriptionField: '@',
				imageField: '@',
				inputClass: '@',
				pause: '@',
				searchFields: '@',
				minlength: '@',
				matchClass: '@',
				clearSelected: '@',
				overrideSuggestions: '@',
				fieldRequired: '=',
				fieldRequiredClass: '@',
				inputChanged: '=',
				autoMatch: '@',
				focusOut: '&',
				focusIn: '&',
				inputName: '@',
				focusFirst: '@',
				parseInput: '&'
			},
			templateUrl: function(element, attrs) {
				return attrs.templateUrl || TEMPLATE_URL;
			},
			compile: function(tElement) {
				var startSym = $interpolate.startSymbol();
				var endSym = $interpolate.endSymbol();
				if (!(startSym === '{{' && endSym === '}}')) {
					var interpolatedHtml = tElement.html()
						.replace(/\{\{/g, startSym)
						.replace(/\}\}/g, endSym);
					tElement.html(interpolatedHtml);
				}
				return link;
			}
		};
	}]);

}));

(function () {

    var customSelect2 = function ($timeout, bookmarkService) {

        return {

            restrict: 'EA',

            scope: {
                controltags: '=tagsattribute',
                newitem: '=newitemattribute'
            },

            replace: false,

            link: function($scope, el) {

                var loaded = 0;
                var data = [];

                this.initSelect2 = function (el, data) {
                    $('.loading-tags').hide();

                    $(el).select2({
                        placeholder: 'Add tags...',
                        allowClear: true,
                        tags: true,
                        data: data
                    });
                };

                $scope.$watch("newitem", function (value) {

                    if (value && data.length == 0) {

                        bookmarkService
                            .fetchTags()
                            .then(function (response) {
                                if (response.result == 'ok') {
                                    for (var i=0; i<response.data.tags.length; i++){
                                        var tagName = response.data.tags[i].name;
                                        data.push({
                                            id: tagName,
                                            text: tagName,
                                            selected: false
                                        });
                                    }
                                }

                                // Init select2 on current directive element.
                                this.initSelect2(el, data);
                            });

                    }
                });

                $scope.$watch("controltags", function (value) {
                    var val = value || null;

                    // Only once async data comes back and data
                    // has never been populated.
                    loaded++;

                    // The first watch iteration is to check initial state. Once loaded in parent controller
                    // this watch should iterate for a second time. Not the best solution so this needs work.
                    if (loaded > 1 && data.length == 0) {

                        bookmarkService
                            .fetchTags()
                            .then(function (response) {

                                // Convert source data structure.
                                for (var i=0; i<val.length; i++) {
                                    data.push({
                                        id: val[i],
                                        text: val[i],
                                        selected: true
                                    });
                                }

                                if (response.result == 'ok') {
                                    for (var i=0; i<response.data.tags.length; i++){
                                        var tagName = response.data.tags[i].name;

                                        var found = false;
                                        for (var j=0; j<data.length; j++) {
                                            if (data[j].text == tagName) {
                                                found = true;
                                                break;
                                            }
                                        }

                                        // The tag was not found in the original list of tags for the bookmark.
                                        if (!found) {
                                            data.push({
                                                id: tagName,
                                                text: tagName,
                                                selected: false
                                            });
                                        }
                                    }
                                }

                                // Init select2 on current directive element.
                                this.initSelect2(el, data);

                            });

                    }
                });

            }
        };
    };

    angular.module('bookmarksApp').
        directive('customSelect2', [ '$timeout', 'bookmarkService', customSelect2 ]);

}());

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
                        return;
                    }

                    // if ($scope.new_value && $scope.new_value.length < 3) {
                    // return;
                    // }

                    // tag not already used
                    if ($scope.tags.indexOf($scope.new_value) !== -1) {
                        return;
                    }

                    var exists = false;
                    $scope.tags.forEach(function (item) {
                        if (item.toLowerCase() == $scope.new_value.toLowerCase()) {
                            exists = true;
                        }
                    });
                    if (exists) {
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

'use strict';

/**
 * Binds a ACE Editor widget
 */
angular.module('ui.ace', [])
	.constant('uiAceConfig', {})
	.directive('uiAce', ['uiAceConfig', function (uiAceConfig) {

		if (angular.isUndefined(window.ace)) {
			throw new Error('ui-ace need ace to work... (o rly?)');
		}

		/**
		 * Sets editor options such as the wrapping mode or the syntax checker.
		 *
		 * The supported options are:
		 *
		 *   <ul>
		 *     <li>showGutter</li>
		 *     <li>useWrapMode</li>
		 *     <li>onLoad</li>
		 *     <li>theme</li>
		 *     <li>mode</li>
		 *   </ul>
		 *
		 * @param acee
		 * @param session ACE editor session
		 * @param {object} opts Options to be set
		 */
		var setOptions = function(acee, session, opts) {

			// sets the ace worker path, if running from concatenated
			// or minified source
			if (angular.isDefined(opts.workerPath)) {
				var config = window.ace.require('ace/config');
				config.set('workerPath', opts.workerPath);
			}
			// ace requires loading
			if (angular.isDefined(opts.require)) {
				opts.require.forEach(function (n) {
					window.ace.require(n);
				});
			}
			// Boolean options
			if (angular.isDefined(opts.showGutter)) {
				acee.renderer.setShowGutter(opts.showGutter);
			}
			if (angular.isDefined(opts.useWrapMode)) {
				session.setUseWrapMode(opts.useWrapMode);
			}
			if (angular.isDefined(opts.showInvisibles)) {
				acee.renderer.setShowInvisibles(opts.showInvisibles);
			}
			if (angular.isDefined(opts.showIndentGuides)) {
				acee.renderer.setDisplayIndentGuides(opts.showIndentGuides);
			}
			if (angular.isDefined(opts.useSoftTabs)) {
				session.setUseSoftTabs(opts.useSoftTabs);
			}
			if (angular.isDefined(opts.showPrintMargin)) {
				acee.setShowPrintMargin(opts.showPrintMargin);
			}

			// commands
			if (angular.isDefined(opts.disableSearch) && opts.disableSearch) {
				acee.commands.addCommands([
					{
						name: 'unfind',
						bindKey: {
							win: 'Ctrl-F',
							mac: 'Command-F'
						},
						exec: function () {
							return false;
						},
						readOnly: true
					}
				]);
			}

			// Basic options
			if (angular.isString(opts.theme)) {
				acee.setTheme('ace/theme/' + opts.theme);
			}
			if (angular.isString(opts.mode)) {
				session.setMode('ace/mode/' + opts.mode);
			}
			// Advanced options
			if (angular.isDefined(opts.firstLineNumber)) {
				if (angular.isNumber(opts.firstLineNumber)) {
					session.setOption('firstLineNumber', opts.firstLineNumber);
				} else if (angular.isFunction(opts.firstLineNumber)) {
					session.setOption('firstLineNumber', opts.firstLineNumber());
				}
			}

			// advanced options
			var key, obj;
			if (angular.isDefined(opts.advanced)) {
				for (key in opts.advanced) {
					// create a javascript object with the key and value
					obj = { name: key, value: opts.advanced[key] };
					// try to assign the option to the ace editor
					acee.setOption(obj.name, obj.value);
				}
			}

			// advanced options for the renderer
			if (angular.isDefined(opts.rendererOptions)) {
				for (key in opts.rendererOptions) {
					// create a javascript object with the key and value
					obj = { name: key, value: opts.rendererOptions[key] };
					// try to assign the option to the ace editor
					acee.renderer.setOption(obj.name, obj.value);
				}
			}

			// onLoad callbacks
			angular.forEach(opts.callbacks, function (cb) {
				if (angular.isFunction(cb)) {
					cb(acee);
				}
			});
		};

		return {
			restrict: 'EA',
			require: '?ngModel',
			link: function (scope, elm, attrs, ngModel) {

				/**
				 * Corresponds the uiAceConfig ACE configuration.
				 * @type object
				 */
				var options = uiAceConfig.ace || {};

				/**
				 * uiAceConfig merged with user options via json in attribute or data binding
				 * @type object
				 */
				var opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

				/**
				 * ACE editor
				 * @type object
				 */
				var acee = window.ace.edit(elm[0]);

				/**
				 * ACE editor session.
				 * @type object
				 * @see [EditSession]{@link http://ace.c9.io/#nav=api&api=edit_session}
				 */
				var session = acee.getSession();

				/**
				 * Reference to a change listener created by the listener factory.
				 * @function
				 * @see listenerFactory.onChange
				 */
				var onChangeListener;

				/**
				 * Reference to a blur listener created by the listener factory.
				 * @function
				 * @see listenerFactory.onBlur
				 */
				var onBlurListener;

				/**
				 * Calls a callback by checking its existing. The argument list
				 * is variable and thus this function is relying on the arguments
				 * object.
				 * @throws {Error} If the callback isn't a function
				 */
				var executeUserCallback = function () {

					/**
					 * The callback function grabbed from the array-like arguments
					 * object. The first argument should always be the callback.
					 *
					 * @see [arguments]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments}
					 * @type {*}
					 */
					var callback = arguments[0];

					/**
					 * Arguments to be passed to the callback. These are taken
					 * from the array-like arguments object. The first argument
					 * is stripped because that should be the callback function.
					 *
					 * @see [arguments]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments}
					 * @type {Array}
					 */
					var args = Array.prototype.slice.call(arguments, 1);

					if (angular.isDefined(callback)) {
						scope.$evalAsync(function () {
							if (angular.isFunction(callback)) {
								callback(args);
							} else {
								throw new Error('ui-ace use a function as callback.');
							}
						});
					}
				};

				/**
				 * Listener factory. Until now only change listeners can be created.
				 * @type object
				 */
				var listenerFactory = {
					/**
					 * Creates a change listener which propagates the change event
					 * and the editor session to the callback from the user option
					 * onChange. It might be exchanged during runtime, if this
					 * happens the old listener will be unbound.
					 *
					 * @param callback callback function defined in the user options
					 * @see onChangeListener
					 */
					onChange: function (callback) {
						return function (e) {
							var newValue = session.getValue();

							if (ngModel && newValue !== ngModel.$viewValue &&
									// HACK make sure to only trigger the apply outside of the
									// digest loop 'cause ACE is actually using this callback
									// for any text transformation !
								!scope.$$phase && !scope.$root.$$phase) {
								scope.$evalAsync(function () {
									ngModel.$setViewValue(newValue);
								});
							}

							executeUserCallback(callback, e, acee);
						};
					},
					/**
					 * Creates a blur listener which propagates the editor session
					 * to the callback from the user option onBlur. It might be
					 * exchanged during runtime, if this happens the old listener
					 * will be unbound.
					 *
					 * @param callback callback function defined in the user options
					 * @see onBlurListener
					 */
					onBlur: function (callback) {
						return function () {
							executeUserCallback(callback, acee);
						};
					}
				};

				attrs.$observe('readonly', function (value) {
					acee.setReadOnly(!!value || value === '');
				});

				// Value Blind
				if (ngModel) {
					ngModel.$formatters.push(function (value) {
						if (angular.isUndefined(value) || value === null) {
							return '';
						}
						else if (angular.isObject(value) || angular.isArray(value)) {
							throw new Error('ui-ace cannot use an object or an array as a model');
						}
						return value;
					});

					ngModel.$render = function () {
						session.setValue(ngModel.$viewValue);
					};
				}

				// Listen for option updates
				var updateOptions = function (current, previous) {
					if (current === previous) return;
					opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

					opts.callbacks = [ opts.onLoad ];
					if (opts.onLoad !== options.onLoad) {
						// also call the global onLoad handler
						opts.callbacks.unshift(options.onLoad);
					}

					// EVENTS

					// unbind old change listener
					session.removeListener('change', onChangeListener);

					// bind new change listener
					onChangeListener = listenerFactory.onChange(opts.onChange);
					session.on('change', onChangeListener);

					// unbind old blur listener
					//session.removeListener('blur', onBlurListener);
					acee.removeListener('blur', onBlurListener);

					// bind new blur listener
					onBlurListener = listenerFactory.onBlur(opts.onBlur);
					acee.on('blur', onBlurListener);

					setOptions(acee, session, opts);
				};

				scope.$watch(attrs.uiAce, updateOptions, /* deep watch */ true);

				// set the options here, even if we try to watch later, if this
				// line is missing things go wrong (and the tests will also fail)
				updateOptions(options);

				elm.on('$destroy', function () {
					acee.session.$stopWorker();
					acee.destroy();
				});

				scope.$watch(function() {
					return [elm[0].offsetWidth, elm[0].offsetHeight];
				}, function() {
					acee.resize();
					acee.renderer.updateFull();
				}, true);

			}
		};
	}]);

//# sourceMappingURL=main.js.map
