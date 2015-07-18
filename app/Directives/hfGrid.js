app.directive('hfGrid', ['$log', '$templateRequest', '$compile', function($log, $templateRequest, $compile) {
    
    var ctrl = function($scope, $element, $log,$templateRequest, $compile) {
        $log.debug('in hfGrid');
        $scope.cols = [];
        $scope.rows = [];
        $scope.$on('hfGridEndDataLoadingEvent', function(e, cols, rows) {
            $log.debug('hfGridEndDataLoadingEvent intercepted');
            $scope.cols = cols;
            $scope.rows = rows;
            $templateRequest('templates/hfGridTpl.html').then(function(response) {
                $log.debug('start compile');
                tpl = response;
                // compile the html, then link it to the scope
                elem = $compile(tpl)($scope);
                // append the compiled template inside the element
                $element.html(elem);
            });
        });
    };
    return {
        controller: ctrl,
        replace: true,
        restrict: 'E',
            //templateUrl: 'templates/hfGridTpl.html'
    };
}]).directive('hfGridBody', ['$log', function($log) {
    var link = function(scope, element, attrs, ctrlGridBody) {
        $log.debug('link hfGrid Body');
        scope.source().then(function(res) {
            scope.$emit('hfGridStartDataLoadingEvent');
            $log.debug('dataSource => ', res.data);
            ctrlGridBody.initDataSource(res.data);
        });
    };
    var ctrl = function($scope, $element, $log) {
        $scope.cols = [];
        $scope.rows = [];
        this.initDataSource = function(data) {
            $log.debug('init Data Source called');
            $scope.rows = data;
            $scope.$emit('hfGridEndDataLoadingEvent', $scope.cols, $scope.rows);
        };
        this.setCols = function(cols) {
            $scope.cols = cols;
            $log.debug('settings cols => ', $scope.cols)
        };
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
        this.AddCol = function(col) {
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
        ctrlHfGridColumns.AddCol({
            title: attrs.title,
            field: attrs.field
        });
    };
    var ctrl = function($scope, $element, $log) {};
    return {
        require: '^hfGridColumns',
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