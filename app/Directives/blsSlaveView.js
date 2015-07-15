app.directive('blsSlaveView', ['$log', '$compile', '$templateCache', function($log, $compile, $templateCache) {
    this.link = function(scope, element, attrs) {
        scope.listData = [];
        $log.debug('in link function blsSlaveView --------------------------------');
        // console.dir(attrs);
        // var options = scope.$eval(attrs.blsSlaveView); //Options de type { func, templateUrl}
        //$log.debug();
        var res = scope.$parent.getSlaveView()(scope.$id);
        res.func.then(function(response) {
            //$scope.model.totalItems = response.headers()['x-total-count'];
            scope.listData = response.data;
            // $log.debug(response.data);
            var tpl=$templateCache.get(res.templateUrl);
            element.html(tpl).show();
            $compile(element.contents())(scope);
        }, function(errors) {
            $log.error(errors);
        });
    };
    // Runs during compile
    return {
        require: '^blsGrid', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: this.link
    };
}]);