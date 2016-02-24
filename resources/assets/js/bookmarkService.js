(function () {

    var bookmarkService = function ($location, $http, userService) {

        var service = {

            fetchCategoriesAndTags: function () {
                return $http
                    .get(API_URL + 'bookmarks/categories-and-tags')
                    .then(function (response) {
                        return response.data;
                    });
            },

            fetchCategories: function () {
                //var user = userService.getModel();
                return $http
                    .get(API_URL + 'categories') //?' + $.param(user))
                    .then(function (response) {
                        return response.data;
                    });
            },
            //
            //fetchTags: function () {
            //    var user = userService.getModel();
            //    return $http
            //        .get(API_URL + 'tags?' + $.param(user))
            //        .then(function (response) {
            //            return response.data;
            //        });
            //},

            //fetchBookmarks: function () {
            //    //var user = userService.getModel();
            //    return $http
            //        .get(API_URL + 'bookmarks?' + $.param(user))
            //        .then(function (response) {
            //            return response.data;
            //        });
            //},

            fetchFilteredBookmarks: function (categories, tags, search, page, limit) {
                //var user = userService.getModel();
                return $http
                    .get(API_URL +
                        'bookmarks?' +
                        //$.param(user) +
                        'categories=' + categories +
                        '&tags=' + tags +
                        '&search=' + search +
                        '&page=' + page +
                        '&limit=' + limit
                )
                    .then(function (response) {
                        return response.data;
                    });
            },

            fetchBookmark: function (bookmarkId) {
                //var user = userService.getModel();
                return $http
                    .get(API_URL + 'bookmark/' + bookmarkId) // + '?' + $.param(user))
                    .then(function (response) {
                        return response.data;
                    });
            },

            createBookmark: function (data) {
                //var user = userService.getModel();
                return $http
                    .put(API_URL + 'bookmark/create?' + $.param(data)) // + $.param(user) + '&' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            checkDuplicates: function (data) {
                //var user = userService.getModel();
                return $http
                    .get(API_URL + 'bookmarks/duplicates?' + $.param(data)) // + $.param(user) + '&' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            updateBookmark: function (bookmarkId, data) {
                //var user = userService.getModel();
                return $http
                    .put(API_URL + 'bookmark/' + bookmarkId + '?' + $.param(data)) //+ $.param(user) + '&' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            deleteBookmark: function (bookmarkId, data) {
                //var user = userService.getModel();
                return $http
                    .delete(API_URL + 'bookmark/' + bookmarkId + '?' + $.param(data)) //bookmarkId + '?' + $.param(user) + '&' + $.param(data))
                    .then(function (response) {
                        return response.data;
                    });
            },

            importBookmarks: function (data) {
                //var user = userService.getModel();

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
        ['$location', '$http', 'userService', bookmarkService]);

}());
