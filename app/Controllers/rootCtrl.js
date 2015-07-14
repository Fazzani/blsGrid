(function(angular) {
    'use strict';
    app.controller("rootCtrl", ['$scope', '$location', '$log', function($scope, $location, $log) {
        $scope.page = 'Index';
        $scope.getActiveMenu = function(path) {
            $log.debug($location.path());
            $log.debug($location.path() == path);
            if ($location.path() === path) {
                return "active"
            } else {
                return ""
            }
        }
    }]);
})(window.angular);