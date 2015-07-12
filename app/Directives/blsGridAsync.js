(function(angular) {
  'use strict';
/**
 * BLS grid (sort, search, tree, pagination)
 * @param  {[type]} )            {                                                                return {                                      restrict: "E",        transclude: true,        scope: {            source: ' [description]
 * @param  {[type]} templateUrl: 'template/blsGrid/blsGrid.html' [description]
 * @param  {[type]} controller:  function($scope,                $filter,      $timeout, $element, $log,  localStorageService [description]
 * @return {[type]}              [description]
 */
app.directive("blsGridAsync", function() {
    return {
        restrict: "A",
        require:'^blsGrid',
        transclude: true,
        scope:true,
        controller: ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                $scope.options.pagination.itemsPerPage.selected = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.selected;
                $scope.$watchCollection('source', function(newVal, oldValue) {
                    $scope.isLoading = true;
                    if (newVal != oldValue) {
                        angular.forEach($scope.source, function(value, key) {
                            if ($scope.actionsEnabled) {
                                value.actions = $scope.options.actions;
                            }
                            $scope.data.push(value);
                            //if(key===0)
                            //  $scope.columns=Object.keys(value);
                            if ($scope.columns.length > 0) {
                                // angular.forEach(value,function(v, k){
                                // angular.forEach($scope.columns, function(vTmp, kTmp) {
                                //  console.log(vTmp);
                                //  console.log(k);
                                //          if(!(k in vTmp))
                                //              $scope.columns.push({id:k, displayName:k});
                                //      });
                                // });
                            } else {
                                angular.forEach(value, function(v, k) {
                                    if (k != 'actions' && $scope.actionsEnabled) $scope.columns.push({
                                        id: k,
                                        displayName: $scope.options.colDef[k] ? $scope.options.colDef[k].displayName : k
                                    });
                                });
                                if ($scope.actionsEnabled) $scope.columns.push({
                                    id: 'actions',
                                    displayName: 'Actions'
                                });
                                $scope.initResizableColumns();
                            }
                        });
                        $scope.reverse = localStorageService.get($scope.storageIds.reverseId);
                        $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.columns[0] == undefined ? "" : $scope.columns[0].id);
                        if ($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength) < 1) $scope.options.pagination.pageLength = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.range[0];
                        $scope.colOrderConfig = dropableService.initReorderColumns($scope.columns, $scope.data, $scope.storageIds.colReorderDataKey);
                        $log.debug('init colOrderConfig : ' + $scope.colOrderConfig);
                    }
                    $scope.isLoading = false;
                });
                $scope.init = function() {
                    $scope.columns = [];
                    $scope.data = [];
                    $scope.isLoading = true;
                    $log.debug('initialise BlsGridAcync');
                    $log.debug($scope.funcAsync({
                            pageIndex: $scope.options.pagination.pageLength,
                            pageLength: $scope.options.pagination.itemsPerPage.selected
                        }));
                    
                    if (angular.isDefined($scope.funcAsync)) {
                    	if(!$scope.funcAsync({
                            pageIndex: $scope.options.pagination.pageLength,
                            pageLength: $scope.options.pagination.itemsPerPage.selected
                        }))
                    		throw "the promise funcAsync must be declared declared correctly with two paramters {pageIndex, pageLength}";
                        $scope.funcAsync({
                            pageIndex: $scope.options.pagination.pageLength,
                            pageLength: $scope.options.pagination.pageLength + $scope.options.pagination.itemsPerPage.selected
                        }).then(function(d) {
                            $timeout(function() {
                                $scope.$apply(function() {
                                				$log.debug('d=>');
                                				$log.debug(d.headers()['x-total-count']);
                                    $scope.dataFilterSearch = $scope.source = d.data; //.slice(0,rdm+=10);
                                    $scope.isLoading = false;
                                });
                            }, 0);
                            return;
                        }, function(error) {
                            $log.error(error);
                            $scope.isLoading = false;
                        });
                    } else {
                         throw "the promise funcAsync parameter expected";
                    }
                    $scope.isLoading = false;
                }
                
                $scope.order = function(predicate) {
                    //$log.info('order function was called');
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
                $scope.glyphOrder = function(col) {
                    //$log.info('glyphOrder function was called');
                    if (col != $scope.predicate) return '';
                    $scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
                    return $scope.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
                };
                $scope.toPage = function(page) {
                    $scope.options.pagination.pageIndex = page;
                    $scope.refreshOffset();
                }
                $scope.$watch('options.pagination.pageIndex', function(newValue, oldValue) {
                    $scope.refreshOffset();
                })
                $scope.refreshOffset = function() {
                    $scope.offset = ($scope.options.pagination.pageIndex) * $scope.options.pagination.pageLength;
                }
                $scope.updateRecordsCount = function() {
                    $scope.saveUserData({
                        key: $scope.storageIds.itemsPerPageId,
                        val: $scope.options.pagination.itemsPerPage.selected
                    });
                    $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                    $scope.dataFilterSearch = $filter('filter')($scope.data, $scope.options.search.searchText);
                }
                $scope.$watch('options.search.searchText', function(newValue, oldValue) {
                    $scope.dataFilterSearch = $filter('filter')($scope.data, newValue);
                    $log.debug('options.search.searchText triggred => ' + $scope.dataFilterSearch.length);
                })
                $scope.saveUserData = function(data) {
                        if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                    }
                    //Clear User Data from the localStorage //Flush
                $scope.$on('flushEvent', function(data) {
                    $log.debug(localStorageService.keys());
                    $log.debug('clearUserDataEvent intercepted');
                    if (localStorageService.isSupported) {
                        localStorageService.clearAll();
                        localStorageService.remove('dragtable');
                    }
                });
                $scope.init();
            }
        ]
    }
});
})(window.angular);