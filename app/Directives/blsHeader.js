(function(angular) {
    app.directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var tpl = '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col)" width="{{getColWidth($index)}}" allow-drag>\
                                        {{col.title|uppercase}}\
                            <i ng-if="col.sortable" class="pull-left fa " ng-class="glyphOrder(col)"></i><i ng-if="col.resize" class="resize"></i>\
                        </th>\
                    </tr>';
        this.link = {
            pre: function(scope, element, attrs, ctrls) {
                var blsCompositeGridCtrl = ctrls[0];
                var blsHeaderCtrl = ctrls[1];
                scope.refreshDataGrid = blsCompositeGridCtrl.refreshDataGrid;
                $log.debug('    Link => blsHeader');
                var eleTpl = angular.element(tpl);
                scope.getColWidth = function(index) {
                    //$log.debug('    get col colWidth of ', index);
                    if (blsCompositeGridCtrl.tableConfig.cols[index].width > 0) return blsCompositeGridCtrl.tableConfig.cols[index].width + 'px';
                }
                $timeout(function() {
                    element.siblings('table').find('thead').append(eleTpl);
                    $log.debug('    compiling blsHeader');
                    blsCompositeGridCtrl.initColConfig();
                    $compile(eleTpl)(scope);
                }, 0);
            }
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                me.resizeColData = null;
                me.resizePressed = false;
                $log.debug('    blsHeader controller: in init...');
                $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.cols[0] == undefined ? "" : $scope.cols[0].id);
                $scope.glyphOrder = function(col) {
                    if (!me.resizePressed) {
                        $log.debug('    glyphOrder function was called');
                        if (col.fieldName != $scope.predicate) return 'fa-sort';
                        $scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
                        return $scope.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
                    }
                };
                $scope.order = function(col) {
                    if (!me.resizePressed)
                        if (col.sortable) {
                            $log.debug('    order function was called');
                            $scope.reverse = ($scope.predicate === col.fieldName) ? !$scope.reverse : false;
                            $scope.predicate = col.fieldName;
                            $scope.saveUserData({
                                key: $scope.storageIds.predicateId,
                                val: $scope.predicate
                            });
                            $scope.saveUserData({
                                key: $scope.storageIds.reverseId,
                                val: $scope.reverse
                            });
                            $scope.refreshDataGrid();
                        }
                };
                $scope.resizeStart = function(e) {
                    var target = e.target ? e.target : e.srcElement;
                    if (target.classList.contains("resize")) {
                        start = target.parentNode;
                        me.resizePressed = true;
                        startX = e.pageX;
                        startWidth = target.parentNode.offsetWidth;
                        document.addEventListener('mousemove', drag);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                };

                function drag(e) {
                    if (me.resizePressed) {
                        start.width = startWidth + (e.pageX - startX);
                        //$log.debug('start.width == ', start.width);
                        me.resizeColData = {
                            index: angular.element(e.target).scope().$index,
                            width: start.width
                        };
                    }
                }
                $scope.resizeEnd = function(e) {
                    if (me.resizePressed) {
                        document.removeEventListener('mousemove', drag);
                        e.stopPropagation();
                        e.preventDefault();
                        me.resizePressed = false;
                        $scope.setColWidth(me.resizeColData.index, me.resizeColData.width);
                        me.resizeColData = null;
                    }
                };
            }
        ];
        return {
            priority: -20,
            require: ['^?blsCompositeGrid', 'blsHeader'],
            restrict: 'E',
            link: this.link,
            controller: controller
        };
    }]);
})(window.angular);