//(function () {
//
//    var customSelect2 = function () {
//
//        return {
//
//            restrict: 'AE',
//
//            scope: {tags: '='},
//
//            replace: false,
//
//            link: function ($scope, el) {
//
//                console.log('in link from customSelect2x');
//
//
//                console.log($scope.tags);
//
//                $scope.tags.forEach(function (item) {
//                    //    if (item.toLowerCase() == $scope.new_value.toLowerCase()) {
//                    //        exists = true;
//                    //    }
//                    console.log(item);
//                });
//
//                var data = [
//                    { id: 0, text: 'enhancement' },
//                    { id: 1, text: 'bug' },
//                    { id: 2, text: 'duplicate' },
//                    { id: 3, text: 'invalid', selected: true },
//                    { id: 4, text: 'wontfix' }
//                ];
//
//
//                //var exists = false;
//                //$scope.tags.forEach(function (item) {
//                //    if (item.toLowerCase() == $scope.new_value.toLowerCase()) {
//                //        exists = true;
//                //    }
//                //});
//                //if (exists) {
//                //    return;
//                //}
//                //
//                //$scope.tags.push($scope.new_value);
//                //$scope.new_value = "";
//
//                $(el).select2({
//                    placeholder: 'Add tags...',
//                    allowClear: true,
//                    tags: true,
//                    data: data
//                });
//            }
//        };
//    };
//
//    angular.module('bookmarksApp').
//        directive('customSelect2', customSelect2);
//
//}());
