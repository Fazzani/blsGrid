'use strict';

app.directive("resizable", function($timeout) {
    return {
        link: function($scope, element, attrs) {
            console.log('init resizable..');
            console.log(element);
            $scope.$evalAsync(function() {
                $timeout(function() {
                    element.colResizable({
                        fixed: true,
                        liveDrag: true,
                        postbackSafe: true,
                        partialRefresh: false,
                        gripInnerHtml:"<div class='grip'></div>", 
                        draggingClass:"dragging", 
                        // minWidth: 100
                    });
                }, 1000);
            });
        },
        restrict: "CA",
        require: '^hfGrid'
    }
})
