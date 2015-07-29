(function(angular) {
    'use strict';
    app.directive("blsRows", function($compile, $log) {
        return {
            restrict: "A",
            require: ['^?blsNestedGrid'],
            scope: {
                data: '=ngModel',
                columns: '=',
                func: '&',
                config:'='
            },
            link: {
                pre: function(scope, iElem, iAttrs) {
                    console.log(name + ': pre link');
                    scope.$watch('data.length', function(newVal, oldVal){
                        $log.debug('newVal', newVal);
                        if(newVal!=oldVal){
                            //scope.data = newVal;
                            $log.debug('***********  start compile blsRows');
                            scope.tpl = angular.element('<tr ng-repeat="d in data" columns="columns" func="func()" config="config" bls-tr="d"></tr>');
                            // var newScope = scope.$new();
                            // newScope.d = scope.d;
                            // newScope.func = scope.func;
                            // newScope.columns = scope.columns;
                            // newScope.data = scope.data;
                            iElem.replaceWith(scope.tpl);
                            $compile(scope.tpl)(scope);
                        }
                    });
                }
            }
        }
    });
    app.directive("blsTr", function($compile, $templateRequest, $templateCache, $log) {
        var link = {
            pre: function(scope, element, attrs, ctrls) {
                var blsTrCtrl = ctrls[1];
                var blsNestedGridCtrl = ctrls[0];
                if (!scope.config) {
                    scope.config = {
                        level: 0,
                        collapsed: true,
                        loaded: false
                    };
                }
                else
                {
                    scope.config.level++;
                    scope.childConfig = {
                        level: scope.config.level+1,
                        collapsed: true,
                        loaded: false
                    };
                }
                $log.debug('config  ===== ',scope.config);
                scope.columns = scope.$parent.$parent.columns;
                scope.func = scope.$parent.$parent.func;
                scope.row.childs=[];
                $log.debug('**************************  start compile blsTr');
                scope.tpl = angular.element($templateCache.get('templates/blsTr.html'));
                element.replaceWith(scope.tpl);
                $compile(scope.tpl)(scope);
            }
        };
        return {
            restrict: "A",
            require: ['^?blsNestedGrid', 'blsTr'],
            link: link,
            // templateUrl:'templates/blsTr.html',
            // replace:true,
            scope: {
                row: '=blsTr',
                config:'='
            },
            controller: ['$scope', '$element', '$attrs', '$log', '$compile', '$templateCache', function($scope, $element, $attrs, $log, $compile, $templateCache) {
                $log.debug('row = ', $scope.row);
                $scope.expand = function(d, index) {
                    $log.debug('expanding data');
                    $scope.config.collapsed = !$scope.config.collapsed;
                    if (!$scope.config.loaded) {
                        $scope.config.loaded = true;
                        $scope.func()(d).then(function(res) {
                            $scope.row.childs.push(res.data);
                            // $log.debug('childs length : ', res.data);
                            //$scope.data.splice(index + 1, 0, res.data);
                            $scope.config.level++;
                        });
                    }
                }
                $scope.collpaseState = function(config) {
                    //$log.debug('in collpaseState ', config);
                    if (angular.isDefined(config)) {
                        return config.collapsed ? 'fa-caret-right' : 'fa-caret-down';
                    }
                }
            }]
        };
    });
})(window.angular);