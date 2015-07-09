'use strict';

app.directive("resizable", function($timeout) {
    return {
        link: function($scope, element, attrs) {
            $scope.$evalAsync(function() {
                $timeout(function() {
                    element.colResizable({
                        fixed: true,
                        liveDrag: true,
                        postbackSafe: true,
                        partialRefresh: true,
                        // minWidth: 100
                    });
                }, 3000);
            });
        },
        restrict: "CA",
        require: '^hfGrid'
    }
})
