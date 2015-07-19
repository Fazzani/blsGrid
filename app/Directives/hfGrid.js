app.directive('hfGrid', ['$log', '$templateRequest', '$compile', function($log, $templateRequest, $compile) {
    var ctrl = function($scope, $element, $log, $templateRequest, $compile) {
        $log.debug('in hfGrid');
        $scope.cols = [];
        $scope.rows = [];
        $scope.uniqueId = 'hfGrid_' + $element[0].id;
        $scope.pagination = {};
        $scope.$on('hfGridEndDataLoadingEvent', function(e, cols, rows) {
            $log.debug('hfGridEndDataLoadingEvent intercepted');
            $scope.cols = cols;
            $scope.rows = rows;
            $templateRequest('templates/hfGridTpl.html').then(function(response) {
                $log.debug('start compile');
                // compile the html, then link it to the scope
                elem = $compile(response)($scope);
                // append the compiled template inside the element
                $element.html(elem);
            });
        });
        this.setPagination = function(pagination) {
            $scope.pagination = pagination;
        };
        // $scope.order = function(predicate) {
        //     $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        //     $scope.predicate = predicate;
        //     // $scope.saveUserData({
        //     //     key: $scope.storageIds.predicateId,
        //     //     val: $scope.predicate
        //     // });
        //     // $scope.saveUserData({
        //     //     key: $scope.storageIds.reverseId,
        //     //     val: $scope.reverse
        //     // });
        //     // refreshDataGrid();
        // };
        // $scope.glyphOrder = function(col) {
        //     //$log.info('glyphOrder function was called');
        //     if (col != $scope.predicate) return '';
        //     $scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
        //     return $scope.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
        // };
    };
    return {
        controller: ctrl,
        replace: true,
        restrict: 'E'
            //templateUrl: 'templates/hfGridTpl.html'
    };
}]).directive('hfGridBody', ['$log', function($log) {
    var link = function(scope, element, attrs, ctrlGridBody) {
        $log.debug('link hfGrid Body');
    };
    var ctrl = function($scope, $element, $log) {
        $scope.cols = [];
        $scope.rows = [];
        var me = this;
        this.setCols = function(cols) {
            $scope.cols = cols;
            $log.debug('settings cols => ', $scope.cols)
        };
        $scope.$on('hfGridPaginationChanged', function(e, pagination) {
            $log.debug('hfGridPaginationChanged intercepted');
            me.setPagination(pagination);
        });
        this.setPagination = function(pagination) {
            $scope.pagination = pagination;
            $scope.source()($scope.pagination.pageIndex, $scope.pagination.itemsPerPage, $scope.pagination.searchedText, $scope.pagination.orderBy, $scope.pagination.order).then(function(res) { //query: pageIndex, pageLength, searchedText, orderBy, order
                $scope.$emit('hfGridStartDataLoadingEvent'); //Fire Loading
                $log.debug('dataSource => ', res);
                $scope.rows = res.data;
                $scope.$emit('hfGridEndDataLoadingEvent', $scope.cols, $scope.rows);
            });
        }
    };
    return {
        require: 'hfGridBody',
        scope: {
            source: '&'
        },
        link: link,
        controller: ctrl,
        restrict: 'E',
    };
}]).directive('hfGridColumns', ['$log', function($log) {
    var link = function(scope, element, attrs, controllers) {
        var hfGridBodyCtrl = controllers[0];
        var hfGridColumnsCtrl = controllers[1];
        hfGridBodyCtrl.setCols(hfGridColumnsCtrl.getCols());
        $log.debug('link hfGridColumns');
        //controllers[1].initCols(ctrlhfGrid.sourceFunc);
    };
    var ctrl = function($scope, $element, $log) {
        var cols = [];
        this.addCol = function(col) {
            cols.push(col);
            $log.debug("columns : ", col);
        };
        this.getCols = function() {
            return cols;
        };
    };
    return {
        require: ['^hfGridBody', 'hfGridColumns'],
        link: link,
        controller: ctrl
    };
}]).directive('hfGridColumn', ['$log', function($log) {
    var link = function(scope, element, attrs, ctrlHfGridColumns) {
        $log.debug('link hfGridColumn');
        ctrlHfGridColumns.addCol({
            title: attrs.title,
            field: attrs.field,
            sortable: angular.isDefined(attrs.sortable),
            editable: angular.isDefined(attrs.editable),
            filterable: angular.isDefined(attrs.editable)
        });
    };
    var ctrl = function($scope, $element, $log) {};
    return {
        require: '^hfGridColumns',
        link: link,
        restrict: 'E',
        controller: ctrl
    };
}]).directive('hfGridSortable', ['$log', '$compile', function($log, $compile) {
    //<i ng-if="col.sortable" class="pull-left fa fa-sort " ng-class="glyphOrder(col.id)"></i>
    var link = {
        post: function(scope, element, attrs, hfGridSortableCtrl) {
            //init order user
            hfGridSortableCtrl.init();
            $log.debug('================>> Link hfGridSortable');
            var sortElement = angular.element('<i ng-if="col.sortable" class="pull-left fa fa-sort " ng-click="onSort(col)" ng-class="glyphOrder(col)"></i>');
            element.append($compile(sortElement)(scope));
        }
    };
    var ctrl = function($scope, $element, $log, localStorageService) {
        var orderByKey = '_orderBy';
        var orderKey = '_order';
        $scope.onSort = function(col) {
            $log.debug('sorting on ', col);
            $scope.pagination.order = col.field == $scope.pagination.orderBy ? !$scope.pagination.order : $scope.pagination.order;
            $scope.pagination.orderBy = col.field;
            saveUserData();
            $scope.$broadcast('hfGridPaginationChanged', $scope.pagination);
        };
        $scope.glyphOrder = function(col) {
            if (col.field != $scope.pagination.orderBy) return '';
            return $scope.pagination.order ? 'fa-sort-asc' : 'fa-sort-desc';
        };
        var saveUserData = function() {
            if (localStorageService.isSupported) {
                localStorageService.set($scope.uniqueId + orderByKey, $scope.pagination.orderBy);
                localStorageService.set($scope.uniqueId + orderKey, $scope.pagination.order);
            }
        };
        this.init = function() {
            if (localStorageService.isSupported) {
                $scope.pagination.orderBy = localStorageService.get($scope.uniqueId + orderByKey);
                $scope.pagination.order = localStorageService.get($scope.uniqueId + orderKey);
            }
        }
    };
    return {
        require: 'hfGridSortable',
        link: link,
        restrict: 'A',
        controller: ctrl
    };
}]).directive('hfPagination', ['$log', function($log) {
    var link = function(scope, element, attrs, ctrls) {
        $log.debug('in link hfPagination');
        var hfGridCtrl = ctrls[0];
        var hfGridBodyCtrl = ctrls[1];
        scope.pagination = {
            pageIndex: 1,
            searchedText: '',
            orderBy: 'id',
            order: 0
        };
        scope.pagination.itemsPerPage = scope.$eval(attrs.itemsPerPage);
        scope.pagination.range = scope.$eval(attrs.range);
        scope.pagination.totalItems = scope.$eval(attrs.totalItems);
        scope.pagination.maxSize = scope.$eval(attrs.maxSize);
        hfGridCtrl.setPagination(scope.pagination);
        hfGridBodyCtrl.setPagination(scope.pagination);
        attrs.$observe('totalItems', function(newVal, oldVal) {
            if (newVal != oldVal) {
                scope.pagination.totalItems = newVal;
                hfGridCtrl.setPagination(scope.pagination);
            }
        });
        $log.debug('pagination.totalItems => ', scope.pagination.totalItems);
    };
    var ctrl = function($scope, $element, $log) {
        $scope.$watch('pagination', function(newVal, oldVal) {
            if (newVal.pageIndex == oldVal.pageIndex) $scope.pagination.pageIndex = 1;
            $log.debug('pagination changed');
            $scope.$broadcast('hfGridPaginationChanged', $scope.pagination);
        }, true);
    };
    return {
        require: ['^hfGrid', '^hfGridBody'],
        link: link,
        restrict: 'E',
        controller: ctrl
    };
}]);
// .directive('hf-grid-footer', [function() {
//     var link = function(scope, element, attrs, ctrlhfGrid) {};
//     var ctrl = function($scope, $element, $log) {};
//     return {
//         require: '^hfGrid',
//         link: link,
//         restrict:'E',
//         controller: ctrl
//     };
// }])
//