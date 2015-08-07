(function(angular) {
    app.service('objectTableUtilService', [function() {
        //extend Array [+swap]
        Array.prototype.swap = function(new_index, old_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this; // for testing purposes
        }
    }]).directive('blsCompositeGrid', ['$log', '$compile', '$templateCache', '$timeout', 'objectTableUtilService', function($log, $compile, $templateCache, $timeout, objectTableUtilService) {
        var me = this;
        this.tpl = $templateCache.get('templates/blsCompositeGrid.html');
        this.link = function(scope, element, attrs, ctrls) {
            // $log.debug('Link => blsCompositeGrid');
            // var eleTpl = angular.element(me.tpl);
            // element.replaceWith(eleTpl);
            // $compile(eleTpl)(scope.$new());
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                $scope.isLoading = true;
                this.tableConfig = {};
                $scope.uniqueId = "blsContainer_" + $scope.$id; //$scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
                $scope.storageIds = {
                    predicateId: 'prd_' + $scope.uniqueId,
                    reverseId: 'rvs_' + $scope.uniqueId,
                    itemsPerPageId: 'ipp_' + $scope.uniqueId,
                    tableConfig: 'tblConfig_' + $scope.uniqueId,
                    colReorderDataKey: 'crdKey_' + $scope.uniqueId,
                    colResizeDataKey: 'crsKey_' + $scope.uniqueId
                };
                var defaultOptions = {
                    multiSelection: true,
                    //autoSaveReorderColumns: true,
                    search: {
                        searchText: '',
                        searchClass: 'form-control'
                    },
                    pagination: {
                        pageLength: 5,
                        pageIndex: 1,
                        pager: {
                            nextTitle: 'Suivant',
                            perviousTitle: 'Précédent',
                            maxSize: 3
                        },
                        itemsPerPage: {
                            prefixStorage: 'ipp_', //itemsPerPage storage prefix 
                            selected: 10, // default selected pageLength
                            range: [10, 20] //list pageLength
                        }
                    }
                };
                $scope.options = angular.extend({}, defaultOptions, $scope.options);
                if ($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength) < 1) $scope.options.pagination.pageLength = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.range[0];
                $scope.$watch('options.pagination.pageIndex', function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        $scope.options.pagination.pageIndex = newValue++;
                        me.refreshDataGrid();
                    }
                });
                $scope.updateRecordsCount = function() {
                        $scope.saveUserData({
                            key: $scope.storageIds.itemsPerPageId,
                            val: $scope.options.pagination.itemsPerPage.selected
                        });
                        $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                        me.refreshDataGrid();
                    }
                    //Reload ngModel by the Func
                this.refreshDataGrid = function() {
                    if (angular.isDefined($scope.funcAsync)) {
                        $scope.isLoading = true;
                        $scope.reverse = localStorageService.get($scope.storageIds.reverseId);
                        $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.cols[0] == undefined ? "" : $scope.cols[0].id);
                        $scope.funcAsync({
                            pageIndex: $scope.options.pagination.pageIndex,
                            pageLength: $scope.options.pagination.itemsPerPage.selected,
                            searchedText: $scope.options.search.searchText,
                            orderBy: $scope.predicate,
                            order: $scope.reverse
                        });
                    }
                }
                this.setCols = function(cols) {
                    $scope.cols = cols;
                    $scope.$emit('blsDataGrid_initedEvent');
                    me.initColConfig();
                }
                this.changeColumnsOrder = function(from, to) {
                    $scope.$applyAsync(function() {
                        $scope.data.swap(from, to);
                        $scope.cols.swap(from, to);
                        me.tableConfig.cols.swap(from, to);
                        $scope.saveUserData({
                            key: $scope.storageIds.tableConfig,
                            val: me.tableConfig
                        });
                    });
                }
                $scope.setColWidth = function(index, width) {
                    $log.debug('setColWidth => ', index, ' width = ', width);
                    me.tableConfig.cols[index].width = width;
                    $scope.saveUserData({
                        key: $scope.storageIds.tableConfig,
                        val: me.tableConfig
                    });
                }
                $scope.$watch('data', function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        if ($scope.cols.length > 0) {
                            $log.debug('init Table config');
                            me.initTableConfig();
                        }
                    }
                });
                //init columns disposition from the localStorage if exists else create new Object
                this.initColConfig = function() {
                        if (localStorageService.isSupported) me.tableConfig = localStorageService.get($scope.storageIds.tableConfig);
                        if (me.tableConfig == null) {
                            me.tableConfig = {
                                id: $scope.uniqueId,
                                cols: []
                            };
                            for (var i = 0; i <= $scope.cols.length - 1; i++) {
                                me.tableConfig.cols.push({
                                    index: i,
                                    width: -1
                                });
                            };
                            $scope.saveUserData({
                                key: $scope.storageIds.tableConfig,
                                val: me.tableConfig
                            });
                        }
                        me.refreshDataGrid();
                    }
                    //Swap data columns according to tableConfig 
                this.initTableConfig = function() {
                    for (var i = 0; i <= me.tableConfig.cols.length - 1; i++) {
                        if (i != me.tableConfig.cols[i].index) {
                            if (i > me.tableConfig.cols[i].index) continue;
                            $log.debug('swap form ', i, ' to => ', me.tableConfig.cols[i].index);
                            $scope.data.swap(i, me.tableConfig.cols[i].index);
                            $scope.cols.swap(i, me.tableConfig.cols[i].index);
                        }
                    }
                    $scope.isLoading = false;
                }
                $scope.saveUserData = function(data) {
                    if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                }
                $scope.$on('flushEvent', function(data) {
                    $log.debug(localStorageService.keys());
                    $log.debug('clearUserDataEvent intercepted => $scope.uniqueId : ', $scope.uniqueId);
                    if (localStorageService.isSupported) {
                        localStorageService.clearAll('^(.)+' + $scope.uniqueId + '$');
                    }
                });
                $scope.$on('refreshEvent', function(data) {
                    $log.debug('refreshEvent intercepted');
                    me.refreshDataGrid();
                });
                 $scope.$on('exportEvent', function(e,format) {
                    $log.debug('exportEvent intercepted to type : ', format);
                    $element.find('table').tableExport({type:format});
                });
            }
        ];
        return {
            restrict: 'E',
            // link: this.link,
            replace: true,
            transclude: true,
            template: this.tpl,
            controller: this.controller,
            scope: {
                data: '=ngModel',
                funcAsync: '&',
                getChildren: '&',
                options: '=',
                totalItems: '='
            }
        };
    }])
})(window.angular);