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

                var that = this;

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

                    if (value && data.length === 0) {

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
                                that.initSelect2(el, data);
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
                    if (loaded > 1 && data.length === 0) {

                        bookmarkService
                            .fetchTags()
                            .then(function (response) {
                                var i;

                                // Convert source data structure.
                                for (i=0; i<val.length; i++) {
                                    data.push({
                                        id: val[i],
                                        text: val[i],
                                        selected: true
                                    });
                                }

                                if (response.result == 'ok') {
                                    for (i=0; i<response.data.tags.length; i++){
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
                                that.initSelect2(el, data);

                            });

                    }
                });

            }
        };
    };

    angular.module('bookmarksApp').
        directive('customSelect2', [ '$timeout', 'bookmarkService', customSelect2 ]);

}());
