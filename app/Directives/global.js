'use strict';

app.directive("panel", function () {
return {
	link: function (scope, element, attrs) {
		scope.dataSource = "directive";
	},
	restrict: "E",
	scope: true,
	template: function () {
		return angular.element(
		document.querySelector("#template")).html();
	},
	transclude: true
	}
}).directive("hfGrid", function () {
	return {
		restrict: "E",
		transclude:true,
		scope: {
			source:'=ngModel',
			gridClass:'@', 
			options:'='
	},
	templateUrl: 'template/blsGrid/blsGrid.html',
	controller:function($scope,$filter,$timeout){
			var defaultOptions={
				search:{
					searchText:'', 
					searchClass:'form-control'
				},
				pagination:{
					pageLength:5,
					pageIndex:1,
					pager:{
						nextTitle:'Suivant',
						perviousTitle:'Précédent', 
						maxSize:3
					},
					itemsPerPage:{
						selected:10,
						range:[10,20]
					}
				}
			};
			$scope.options = angular.extend({}, defaultOptions, $scope.options);
			$scope.columns=[];
			$scope.isLoading=true;
			$scope.dataFilterSearch = $scope.data=[];
			$scope.offset=0;
			$scope.filteredData =[];
			$scope.$watch('source.length',function(newVal, oldValue)
				{
					angular.forEach($scope.source, function(value, key){
						$scope.data.push(value);
						//if(key===0)
						//	$scope.columns=Object.keys(value);
						angular.forEach(value,function(v, k){
						if($scope.columns.indexOf(k)<0)
							$scope.columns.push(k);
						});
					});
					$scope.reverse = true;
					$scope.predicate = $scope.columns[0];
					$scope.pages = new Array(Math.ceil($scope.data.length/$scope.options.pagination.pageLength));
					if($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength)<1)
            						$scope.options.pagination.pageLength=$scope.options.pagination.itemsPerPage.range[0];
					$scope.isLoading=false;
				});
			
			$scope.order = function(predicate) {
	        			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
	        			$scope.predicate = predicate;
	      		};
	      		$scope.glyphOrder= function(col){
	      			if(col!=$scope.predicate)
	      				return '';
	      			return $scope.reverse? 'glyphicon-chevron-up':'glyphicon-chevron-down';
	      		};
	      		$scope.toPage=function  (page) {
	      			$scope.options.pagination.pageIndex=page;
	      			$scope.refreshOffset();
	      		}
	      		$scope.$watch('options.pagination.pageIndex', function(newValue, oldValue){
				$scope.refreshOffset();
	      		})
	      		$scope.refreshOffset=function(){
	      			$scope.offset=($scope.options.pagination.pageIndex-1) * $scope.options.pagination.pageLength;
	      		}
	      		$scope.updateRecordsCount=function(){
	      			$scope.options.pagination.pageLength=$scope.options.pagination.itemsPerPage.selected;
	      			$scope.dataFilterSearch = $filter('filter')($scope.data,$scope.options.search.searchText);
	      		}
	      		$scope.$watch('options.pagination.pageLength', function(newValue, oldValue){
				$scope.pages= new Array(Math.ceil($scope.dataFilterSearch.length/newValue));
	      		})
	      		$scope.$watch('options.search.searchText', function(newValue, oldValue){
	      			$scope.dataFilterSearch = $filter('filter')($scope.data,newValue);
	      		})
	      		$scope.$watch('dataFilterSearch.length', function(newValue, oldValue){
	      			$scope.pages= new Array(Math.ceil(newValue/$scope.options.pagination.pageLength));
	      		})
		}
	}
});


angular.module("bls_tpls", []).run(["$templateCache", function($templateCache) {
  $templateCache.put('template/blsGrid/blsGrid.html',
  	'<pre>pageLength = {{options.pagination.pageLength}} pageIndex : {{options.pagination.pageIndex}} offset = {{offset}} Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>\
		 <div class="bls-table-container">\
		 		<div class="row-fluid">\
		 				<form action="" class="search-form">\
		 		                		<div class="form-group has-feedback">\
		 		            				<label for="search" class="sr-only">Search</label>\
		 		            				<input type="text" class="{{options.search.searchClass}}" name="search" id="search" placeholder="search" ng-model="options.search.searchText">\
		 		              			<span class="glyphicon glyphicon-search form-control-feedback"></span>\
		 		            			</div>\
		 		            		</form>\
		 		 </div>\
			<div ng-class="{\'overlay\':isLoading}"><div ng-show="isLoading"><div class="double-bounce1"></div>  <div class="double-bounce2"></div></div></div>\
			<table class="{{gridClass}} blsGrid">\
	      			<thead>\
	        			<tr>\
	          				<th class="colHeader" ng-repeat="col in columns"  ng-click="order(col)">{{col|uppercase}}\
	          				<i ng-class="glyphOrder(col)" class="glyphicon pull-right"></i></th>\
	        			</tr>\
	      			</thead>\
	      			<tbody>\
	        				<tr ng-repeat="d in filteredData = (data | filter:options.search.searchText| limitTo:options.pagination.pageLength:offset | orderBy:predicate:reverse)">\
	        					<td ng-repeat="a in columns">{{d[a]}} </td>\
	        				</tr>\
	        			</tbody>\
	        			<tfoot>  <tr><td colspan="{{columns.length}}">\
	        				<pagination class="col-md-10 col-xs-8" total-items="data.length" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
							<div class="pagerList col-md-2 col-xs-4">\
									<select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
							</div>\
      					</td></tr>\
  						</tfoot>\
	    	</table>\
	 	</div>');
}]);