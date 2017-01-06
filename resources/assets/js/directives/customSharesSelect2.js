(function () {

    var customSharesSelect2 = function ($timeout, bookmarkService, userService, $filter) {

        // return {
        //     restrict: 'EA',

        //     scope: {
        //         controlshares: '=sharessattribute',
        //         //newitem: '=newitemattribute'
        //     },

        //     replace: false,

        //     template:'hello world 2 :)'
        // };

        return {

            restrict: 'EA',

            scope: {
                controlshares: '=sharessattribute',
                newitem: '=newitemattribute'
            },

            // template:'hello world 2 :)',

            replace: false,

            link: function($scope, el) {

                var loaded = 0;
                var data = [];

                var that = this;

                this.initSelect2 = function (el, data) {
                    $(el).siblings('.loading-text').hide();

                    $(el).select2({
                        placeholder: $filter('translate')('bookmark.sharesplaceholder'),
                        allowClear: true,
                        tags: true,
                        data: data
                    });
                };

//                 $scope.$watch("newitem", function (value) {

//                     // that.initSelect2(el, data);

// console.log('a');

//                     if (value && data.length === 0) {
// console.log('a1');
//                         userService
//                             .getShareInfo()
//                             .then(function (response) {
//                                 $scope.errorMessage = '';
//                                 if (response.result == 'ok' && response.data.canShare == 'yes') {
//                                     $scope.canShare = true;
//                                     $scope.canShareWith = response.data.shareWith;

//                                     for (var i=0; i<response.data.shareWith.length; i++){
//                                         var tagName = response.data.shareWith[i].name;
//                                         data.push({
//                                             id: tagName,
//                                             text: tagName,
//                                             selected: false
//                                         });
//                                     }
//                                 }
// console.log('a2');
//                                 // Init select2 on current directive element.
//                                 that.initSelect2(el, data);
//                             });

//                         // bookmarkService
//                         //     .fetchTags()
//                         //     .then(function (response) {
//                         //         if (response.result == 'ok') {
//                         //             for (var i=0; i<response.data.tags.length; i++){
//                         //                 var tagName = response.data.tags[i].name;
//                         //                 data.push({
//                         //                     id: tagName,
//                         //                     text: tagName,
//                         //                     selected: false
//                         //                 });
//                         //             }
//                         //         }

//                         //         // Init select2 on current directive element.
//                         //         that.initSelect2(el, data);
//                         //     });
//                         // that.initSelect2(el, data);
//                     }
//                 });

//                 $scope.$watch("controltags", function (value) {
//                     var val = value || null;

//                     console.log('b', value);

//                     // Only once async data comes back and data
//                     // has never been populated.
//                     loaded++;

//                     // The first watch iteration is to check initial state. Once loaded in parent controller
//                     // this watch should iterate for a second time. Not the best solution so this needs work.
//                     if (loaded > 1 && data.length === 0) {

// console.log('b1');

//                         userService
//                             .getShareInfo()
//                             .then(function (response) {
//                                 $scope.errorMessage = '';
//                                 if (response.result == 'ok' && response.data.canShare == 'yes') {
//                                     $scope.canShare = true;
//                                     $scope.canShareWith = response.data.shareWith;
// console.log('b2');
//                                     for (var i=0; i<response.data.shareWith.length; i++){
//                                         var tagName = response.data.shareWith[i].name;
//                                         data.push({
//                                             id: tagName,
//                                             text: tagName,
//                                             selected: false
//                                         });
//                                     }
//                                 }
//                                 // Init select2 on current directive element.
//                                 that.initSelect2(el, data);
//                             });




//                         // bookmarkService
//                         //     .fetchTags()
//                         //     .then(function (response) {
//                         //         var i;

//                         //         // Convert source data structure.
//                         //         for (i=0; i<val.length; i++) {
//                         //             data.push({
//                         //                 id: val[i],
//                         //                 text: val[i],
//                         //                 selected: true
//                         //             });
//                         //         }

//                         //         if (response.result == 'ok') {
//                         //             for (i=0; i<response.data.tags.length; i++){
//                         //                 var tagName = response.data.tags[i].name;

//                         //                 var found = false;
//                         //                 for (var j=0; j<data.length; j++) {
//                         //                     if (data[j].text == tagName) {
//                         //                         found = true;
//                         //                         break;
//                         //                     }
//                         //                 }

//                         //                 // The tag was not found in the original list of tags for the bookmark.
//                         //                 if (!found) {
//                         //                     data.push({
//                         //                         id: tagName,
//                         //                         text: tagName,
//                         //                         selected: false
//                         //                     });
//                         //                 }
//                         //             }
//                         //         }

//                         //         // Init select2 on current directive element.
//                         //         that.initSelect2(el, data);

//                         //     });

//                     }
//                 });

            }
        };
    };

    angular.module('bookmarksApp').
        directive('customSharesSelect2', [ '$timeout', 'bookmarkService', 'userService', '$filter', customSharesSelect2 ]);

    // angular.module('bookmarksApp').
    //     directive('customSharesSelect2', [ function() {
    //         return {
    //             restrict : "E",
    //             transclude:true,
    //             template:'hello world :)'
    //         };
    //     } ]);


}());
