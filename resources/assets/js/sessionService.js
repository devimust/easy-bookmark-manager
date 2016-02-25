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
