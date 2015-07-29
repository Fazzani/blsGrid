app.directive('blsRow', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
    var templateRow = '<tr ng-repeat="d in data" parentId="{{parentId}}" bls-row func="getChildren" level="{{level}}"><td ng-repeat="c in cols">{{d[c]}}</td></tr>';
    var tplCaret = '<i class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>';
    this.controller = function($scope, $element, $attrs) {
        $scope.getExpandClass = function() {
            return $scope.expand ? 'fa-caret-down' : 'fa-caret-right';
        }
    };
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
                    $log.debug(childScope);
                    // debugger;
                    childScope.data = scope.$eval(attrs.func)(scope.d);
                    childScope.level = scope.level + 1;
                    childScope.parentId = scope.$id;
                    // childScope.cols = scope.$parent.cols;
                    // childScope.getChildren = scope.$eval(attrs.func);
                    // debugger;
                    scope.$apply(function() {
                        elmTpl.insertAfter(element);
                        $compile(elmTpl)(childScope);
                        $log.debug(elmTpl.scope());
                    });
                }
            });
            $compile(template)(scope);
            angular.element(element.find('td')[0]).prepend(template);
        }, 0);
        // transclude(         
        //     function injectLinkedClone( clone ) {
        //         var template=angular.element('<td><i class="fa fa-caret-right"></i></td>');
        //         element.prepend(template).append( clone );
        //     });
    };
    // Runs during compile
    return {
        priority: -10,
        restrict: 'A',
        link: this.link,
        // controller: controller
        //transclude: true
        //template:'<td class="fa fa-caret-right"></td>'
        // compile:this.link,
        // compile: function(elem,attr){
        //     attr
        //     $log.debug('compiling blsRow...');
        // }
    };
}]);