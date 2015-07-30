app.directive('blsRowChild', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
    var templateRow = '<tr ng-repeat="d in data" parentId="{{parentId}}" bls-row-child func="getChildren" level="{{level}}"><td ng-repeat="c in cols">{{d[c]}}</td></tr>';
    var tplCaret = '<i class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>';
    this.link = function(scope, element, attrs, ctrls, transclude) {
        var elmTpl = angular.element(templateRow);
        if (!angular.isDefined(attrs.level)) {
            scope.level = 0;
            element.attr('level', scope.level);
        }
        $timeout(function() {
            var template = angular.element(tplCaret);
            scope.expand = false;
            scope.firstExpand = true;
            scope.$watch('expand', function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.expand = newVal;
                    var childs = $(element).siblings('tr[parentId="' + scope.$id + '"]');
                    if (scope.expand) {
                        childs.show();
                    } else childs.hide();
                }
            });
            template.on('click', function(e) {
                scope.$apply(function() {
                    scope.expand = !scope.expand;
                });
                if (scope.firstExpand) {
                    scope.firstExpand = false;
                    var childScope = scope.$new();
                    childScope.data = scope.getChildren()(scope.d);
                    childScope.level = scope.level + 1;
                    childScope.parentId = scope.$id;
                    $log.debug(childScope);
                    scope.$apply(function() {
                        elmTpl.insertAfter(element);
                        $compile(elmTpl)(childScope);
                    });
                }
            });
            $compile(template)(scope);
            angular.element(element.find('td')[0]).prepend(template);
        }, 0);
    };
    return {
        priority: -10,
        restrict: 'A',
        link: this.link
    };
}])
.directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
    var rowTpl = '<tr ng-repeat="d in data" bls-row-child><td ng-repeat="c in cols">{{d[c]}}</td></tr>';
    this.link = function(scope, element, attrs, ctrls) {
        var eleTpl = angular.element(rowTpl);
        $timeout(function() {
            scope.$apply(function() {
                element.siblings('table').find('tbody').append(eleTpl);
                $compile(eleTpl)(scope);
            });
        }, 0);
    };
    return {
        priority: 0,
        restrict: 'E',
        link: this.link,
        scope: {
            data: '=ngModel',
            cols: '=',
            getChildren: '&'
        }
    };
}]);