app.directive('blsSlaveView', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
    this.link = function(scope, element, attrs) {
        element.bind('click', function(e) {
            scope.listData = [];
            $log.debug('in link function blsSlaveView --------------------------------');
            var res = scope.$parent.getSlaveView()(scope.$id);
            res.func.then(function(response) {
                //$scope.model.totalItems = response.headers()['x-total-count'];
                scope.listData = response.data;
                // $log.debug(response.data);
                var tpl = $templateCache.get(res.templateUrl);
                var contentTr = angular.element('<tr><td colspan="' + element.children().length + '">' + tpl + '</td></tr>');
                contentTr.insertAfter(element);
                $compile(contentTr)(scope);
            }, function(errors) {
                $log.error(errors);
            });
        });
    };
    // Runs during compile
    return {
        require: '^blsGrid', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: this.link
    };
}]);