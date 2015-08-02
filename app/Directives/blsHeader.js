(function(angular) {
    app.directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var tpl = '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col)">\
                                        {{col|uppercase}}\
                            <i class="pull-left fa fa-sort" ng-class="glyphOrder(col)"></i>\
                        </th>\
                    </tr>';
        this.link = function(scope, element, attrs, ctrls) {
            // debugger;
            $log.debug('Link => blsHeader');
            var eleTpl = angular.element(tpl);
            $timeout(function() {
                element.siblings('table').find('thead').append(eleTpl);
                $log.debug('compiling blsHeader');
                $compile(eleTpl)(scope);
            }, 0);
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                $log.debug('controller: in init...');
                $scope.uniqueId = "blsHeader_" + $scope.id; //$scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
                $scope.storageIds = {
                    predicateId: 'prd_' + $scope.uniqueId,
                    reverseId: 'rvs_' + $scope.uniqueId,
                    itemsPerPageId: 'ipp_' + $scope.uniqueId,
                    colReorderDataKey: 'crdKey_' + $scope.uniqueId,
                    colResizeDataKey: 'crsKey_' + $scope.uniqueId
                };
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
                };
                $scope.saveUserData = function(data) {
                    if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                }
            }
        ];
        return {
            priority: -11,
            terminal: true,
            require: ['^?blsCompositeGrid', 'blsHeader'],
            restrict: 'E',
            link: this.link,
            controller: controller,
            scope:false
        };
    }]);
})(window.angular);