(function(angular) {
    app.directive('blsCompositeGrid', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var tpl = '<div class="panel panel-default">\
                        <table class="table table-hover table-striped table-bordered">\
                            <thead>\
                                <bls-header></bls-header>\
                            </thead>\
                            <tbody>\
                                <bls-rows></bls-rows>\
                            </tbody>\
                        </table>\
                    </div>';
        this.link = function(scope, element, attrs, ctrls) {
            $log.debug('Link => blsCompositeGrid');
            var eleTpl = angular.element(tpl);
            element.replaceWith(eleTpl);
            $compile(eleTpl)(scope);
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {}
        ];
        return {
            priority: 1,
            restrict: 'E',
            //link: this.link,
            replace: true,
            template: tpl,
            controller: controller,
            scope: {
                data: '=ngModel',
                cols: '=',
                getChildren: '&',
                totalItems:'='
            }
        };
    }])
})(window.angular);