(function(angular) {
    app.directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var rowTpl = '<tr ng-repeat="d in data" bls-row-child><td ng-repeat="c in cols" dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>';
        this.link = function(scope, element, attrs, ctrls) {
            var blsCompositeGridCtrl = ctrls[0];
            // debugger;
            blsCompositeGridCtrl.refreshDataGrid();
            var eleTpl = angular.element(rowTpl);
            scope.getTdTpl = function(col) {
                if (col.tpl != '') return col.tpl.replace('::field', "d[c.fieldName]");
            }
            $timeout(function() {
                element.siblings('table').find('tbody').append(eleTpl);
                $compile(eleTpl)(scope);
                $(element.siblings('table')[0]).colResizable({
                    fixed: true,
                    liveDrag: true,
                    postbackSafe: true,
                    partialRefresh: true,
                    // minWidth: 100
                });
            }, 0);
        };
        return {
            require: ['^blsCompositeGrid'],
            priority: -17,
            restrict: 'E',
            link: this.link,
            scope: true
        };
    }]).directive('dynamic', function($compile) {//compile dynamic html
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }).directive('blsRowChild', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var templateRow = '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}"><td ng-repeat="c in cols">{{d[c.fieldName]}}</td></tr>';
        var tplCaret = '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>';
        this.link = function(scope, element, attrs, ctrls, transclude) {
            var me = this;
            this.childs = [];
            var template = angular.element(tplCaret);
            scope.expand = false;
            scope.firstExpand = true;
            this.getRowsChilds = function(id, target) {
                var siblings = target.siblings('tr[parentId="' + id + '"]').toArray();
                me.childs = me.childs.concat(siblings);
                for (var i = 0; i < siblings.length; i++) {
                    me.childs.concat(getRowsChilds(angular.element(siblings[i]).data('blsId'), $(siblings[i])));
                };
                return me.childs;
            };
            var elmTpl = angular.element(templateRow);
            if (!angular.isDefined(attrs.level)) {
                scope.level = 0;
                element.data('dataLevel', scope.level);
            }
            $timeout(function() {
                this.toggle = function(id, target, expand) {
                    me.childs = [];
                    me.childs = me.getRowsChilds(id, target);
                    me.childs.forEach(function(child) {
                        expand ? $(child).show() : $(child).hide();
                    });
                }
                template.on('click', function(e) {
                    $log.debug('toggle row');
                    var $this = $(this);
                    if (scope.firstExpand) {
                        scope.firstExpand = false;
                        var childScope = scope.$new();
                        scope.getChildren()(scope.d).then(function(response) {
                            childScope.data = response.data;
                        });
                        childScope.level = scope.level + 1;
                        childScope.parentId = scope.$id;
                        elmTpl.insertAfter(element);
                        scope.$apply(function() {
                            $compile(elmTpl)(childScope);
                            scope.expand = !scope.expand;
                            me.toggle(scope.$id, $this.closest('tr'), scope.expand);
                        });
                    } else scope.$apply(function() {
                        scope.expand = !scope.expand;
                        me.toggle(scope.$id, $this.closest('tr'), scope.expand);
                    });
                });
                $compile(template)(scope);
                angular.element(element.find('td')[0]).prepend(template);
            }, 0);
        };
        return {
            require: ['^blsCompositeGrid'],
            priority: -16,
            restrict: 'A',
            link: this.link,
            scope: true
        };
    }]);
})(window.angular);