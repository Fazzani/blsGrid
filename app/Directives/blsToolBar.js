app.directive('blsToolBar', [function() {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        require: '^blsGrid', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="row">\
                       <div class="btn-toolbar pull-right col-xs-12" role="toolbar">\
					            										<div class="btn-group btn-group-sm pull-right ">\
								            										<button type="button" class="{{btnClass}}" aria-label="Right Align"><span class="fa fa-cog" aria-hidden="true"></span></button>\
								            										<button type="button" ng-click="clearUserData()" class="{{btnClass}}" aria-label="Right Align"><span class="fa fa-recycle" aria-hidden="true"></span></button>\
								            										<button type="button" ng-click="refresh()" class="{{btnClass}}" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
						            									</div>\
						            									<form action="" class="search-form pull-right col-md-2 col-xs-12">\
						                            <div class="form-group has-feedback">\
						                                <label for="search" class="sr-only">Search</label>\
						                                <input type="text" class="{{options.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.search.searchText">\
						                                <span class="glyphicon glyphicon-search form-control-feedback"></span>\
						                            </div>\
						                    	</form>\
            											</div>\
                 </div>',
        replace: true,
        transclude: true,
        controller: function($scope, $element, $document, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.clearUserData = function() {
                $scope.$emit('flushEvent');
            }
            $scope.refresh = function() {
                $scope.$emit('refreshEvent');
            }
           
        }
    };
}]);