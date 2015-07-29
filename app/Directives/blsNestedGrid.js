(function(angular) {
    'use strict';
    app.directive("blsNestedGrid", function($compile, $templateCache, $templateRequest, $log) {
        var link = {
            post: function(scope, element, attrs, transclude) {}
        };
        return {
            restrict: "E",
            //link: link,
            replace: true,
            templateUrl: 'templates/blsNestedGrid.html',
            scope: {
                gridClass: '@',
                nestedDataFunc: '&',
                func: '&'
            },
            controller: ['$scope', '$element', '$log', '$timeout',
                function($scope, $element, $log, $timeout) {
                    var me = this;
                    this.formatData = function(data) {
                        $scope.source = data;
                        angular.forEach($scope.source, function(value, key) {
                            $scope.data.push(value);
                            if ($scope.columns.length == 0) {
                                angular.forEach(value, function(v, k) {
                                    $scope.columns.push({
                                        id: k,
                                        displayName: k
                                    });
                                });
                            }
                        });
                        $scope.columns.unshift({
                            id: 'collapse',
                            displayName: 'expand'
                        });
                    };
                    this.init = function() {
                        $scope.columns = [];
                        $scope.data = [];
                        $log.debug('initialise blsNestedGrid');
                        if ($scope.func && angular.isDefined($scope.func())) {
                            //if (!angular.isDefined($scope.func().then)) throw "func must a be promise!!";
                            var promise = $scope.func()(1, 10);
                            promise.then(function(res) {
                                $timeout(function() {
                                    $scope.$apply(function() {
                                        me.formatData(res.data);
                                    });
                                }, 0);
                                return;
                            }, function(error) {
                                $log.error(error);
                                $scope.isLoading = false;
                            });
                        }
                    };
                    this.addData = function(d) {
                        $scope.data.push(d);
                    };
                    this.getData = function() {
                        return $scope.data;
                    };
                    $log.info('im in blsNestedGrid');
                    me.init();
                }
            ]
        }
    });
})(window.angular);