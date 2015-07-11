app.directive('blsToolBar', [function() {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        require: '^blsGrid', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="row">\
                        <div class="btn-toolbar contaner-fluid" role="toolbar">\
		            									<div class="btn-group col-xs-8 col-md-8" >\
			            									<button type="button" ng-click="clearUserData()" class="btn btn-default" aria-label="Right Align"><span class="fa fa-cog" aria-hidden="true"></span></button>\
			            									<button type="button" ng-click="refresh()" class="btn btn-default" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
			            								</div>\
			            								<form action="" class="search-form col-xs-4 col-md-2 pull-right">\
			                            <div class="form-group has-feedback">\
			                                <label for="search" class="sr-only">Search</label>\
			                                <input type="text" class="{{options.search.searchClass}}" name="search" id="search" placeholder="search" ng-model="options.search.searchText">\
			                                <span class="glyphicon glyphicon-search form-control-feedback"></span>\
			                            </div>\
			                    </form>\
            									</div>\
                 </div>',
        replace: true,
        transclude: true,
        controller: function($scope) {
            $scope.clearUserData = function() {
                $scope.$emit('flushEvent');
            }
             $scope.refresh = function() {
                $scope.$emit('refreshEvent');
            }
        }
    };
}]);