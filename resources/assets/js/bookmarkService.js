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
        .service('bookmarkService',
        ['$location', '$http', bookmarkService]);

}());
