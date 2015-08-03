(function(angular) {
    app.directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var tpl = '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col.fieldName)">\
                                        {{col.title|uppercase}}\
                            <i class="pull-left fa fa-sort" ng-class="glyphOrder(col.fieldName)"></i>\
                        </th>\
                    </tr>';
        this.link = {post:function(scope, element, attrs, ctrls) {
            var blsCompositeGridCtrl = ctrls[0];
            var blsHeaderCtrl = ctrls[1];
            scope.refreshDataGrid = blsCompositeGridCtrl.refreshDataGrid;
            // debugger;
            $log.debug('Link => blsHeader');
            var eleTpl = angular.element(tpl);
            $timeout(function() {
                element.siblings('table').find('thead').append(eleTpl);
                $log.debug('compiling blsHeader');
                $compile(eleTpl)(scope);
            }, 0);
        }};
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                $log.debug('controller: in init...');
                $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.cols[0] == undefined ? "" : $scope.cols[0].id);
                $scope.glyphOrder = function(col) {
                    $log.debug('glyphOrder function was called');
                    if (col != $scope.predicate) return '';
                    $scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
                    return $scope.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
                };
                $scope.order = function(predicate) {
                    $log.debug('order function was called');
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                    $scope.saveUserData({
                        key: $scope.storageIds.predicateId,
                        val: $scope.predicate
                    });
                    $scope.saveUserData({
                        key: $scope.storageIds.reverseId,
                        val: $scope.reverse
                    });
                    $scope.refreshDataGrid();
                };
            }
        ];
        return {
            priority: -20,
            require: ['^?blsCompositeGrid', 'blsHeader'],
            restrict: 'E',
            link: this.link,
            controller: controller,
            scope: false
        };
    }]);
})(window.angular);