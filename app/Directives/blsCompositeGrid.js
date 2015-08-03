(function(angular) {
    app.directive('blsCompositeGrid', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var me = this;
        this.tpl = '<div class="panel panel-default">\
                        <table class="table table-hover table-striped table-bordered">\
                            <thead>\
                                <bls-header></bls-header>\
                            </thead>\
                            <tbody>\
                                <bls-rows></bls-rows>\
                            </tbody>\
                        </table>\
                        <div style="display:none" id="colsConfig" ng-transclude></div>\
                        <div class="footer">\
                            <pagination class="col-md-10 col-xs-8" total-items="totalItems" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
                            <div class="pagerList col-md-2 col-xs-4">\
                                <select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
                            </div>\
                        </div>\
                    </div>';
        this.link = function(scope, element, attrs, ctrls) {
            // $log.debug('Link => blsCompositeGrid');
            // var eleTpl = angular.element(me.tpl);
            // element.replaceWith(eleTpl);
            // $compile(eleTpl)(scope.$new());
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                $scope.uniqueId = "blsContainer_" + $scope.id; //$scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
                $scope.storageIds = {
                    predicateId: 'prd_' + $scope.uniqueId,
                    reverseId: 'rvs_' + $scope.uniqueId,
                    itemsPerPageId: 'ipp_' + $scope.uniqueId,
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
                this.setCols = function(cols) {
                    $scope.cols = cols;
                }
                this.refreshDataGrid = function() {
                    if (angular.isDefined($scope.funcAsync)) {
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
                $scope.saveUserData = function(data) {
                    if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                }
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
                cols: '=',
                getChildren: '&',
                options: '=',
                totalItems: '='
            }
        };
    }])
})(window.angular);