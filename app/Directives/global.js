'use strict';

app
.directive("resizable", function ($timeout) {
	return {
		link: function ($scope, element, attrs) 
	    {
	          	$scope.$evalAsync(function () {
	          		$timeout(function(){ 
	          			element.colResizable({
	          				fixed:true,
					        liveDrag:true,
					        postbackSafe: true,
					        partialRefresh: true,
					       // minWidth: 100
	        			});
	          		},800);
	            });
	      },
		restrict: "CA",
		require: '^hfGrid'
	}
})
.directive("panel", function () {
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
		transclude: true,
		scope: {
			source:'=ngModel',
			gridClass:'@', 
			options:'='
	},
	templateUrl : 'template/blsGrid/blsGrid.html',
	controller : function($scope, $filter, $timeout, $element, $log, localStorageService)
		{
			var defaultOptions = {
				multiSelection: true,
				search:{
					searchText: '', 
					searchClass: 'form-control'
				},
				pagination:{
					pageLength: 5,
					pageIndex: 1,
					pager:{
						nextTitle:'Suivant',
						perviousTitle: 'Précédent', 
						maxSize: 3
					},
					itemsPerPage:{
						prefixStorage: 'ipp_',//itemsPerPage storage prefix 
						selected: 10,
						range: [10,20]
					}
				}
			};
			$scope.options = angular.extend({}, defaultOptions, $scope.options);
			$scope.columns = [];
			$scope.isLoading = true;
			$scope.dataFilterSearch = $scope.data = [];
			$scope.offset = 0;
			$scope.filteredData = [];
			$scope.selectedRows = [];
			$scope.actionsEnabled = $scope.options.actions != null;
			$scope.uniqueId = $scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
			$scope.storageIds = {
				predicateId : 'prd_' + $scope.uniqueId,
				reverseId : 'rvs_' + $scope.uniqueId,
				itemsPerPageId : 'ipp_' + $scope.uniqueId
			};
			$scope.options.pagination.itemsPerPage.selected = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.selected;

			$scope.$watch('source.length', function(newVal, oldValue)
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
				$scope.reverse = localStorageService.get($scope.storageIds.reverseId);
				$scope.predicate = localStorageService.get($scope.storageIds.predicateId) || $scope.columns[0];
				$scope.pages = new Array(Math.ceil($scope.data.length / $scope.options.pagination.pageLength));

				if($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength)<1)
	    			$scope.options.pagination.pageLength = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.range[0];
				$scope.isLoading = false;
			});
			$scope.order = function(predicate) {
	    		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
	    		$scope.predicate = predicate;
	  			$scope.saveUserData({ key: $scope.storageIds.predicateId, val: $scope.predicate});
	  			$scope.saveUserData({ key: $scope.storageIds.reverseId, val: $scope.reverse });
	  		};
	  		$scope.glyphOrder = function(col){
	  			if(col != $scope.predicate)
	  				return '';
				$scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
	  			return $scope.reverse ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down';
	  		};
	  		$scope.toPage = function(page) {
	  			$scope.options.pagination.pageIndex = page;
	  			$scope.refreshOffset();
	  		}
	  		$scope.$watch('options.pagination.pageIndex', function(newValue, oldValue){
				$scope.refreshOffset();
	  		})
	  		$scope.refreshOffset = function(){
	  			$scope.offset = ($scope.options.pagination.pageIndex - 1) * $scope.options.pagination.pageLength;
	  		}
	  		$scope.updateRecordsCount = function(){
	  			$scope.saveUserData({key : $scope.storageIds.itemsPerPageId, val : $scope.options.pagination.itemsPerPage.selected});
	  			$scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
	  			$scope.dataFilterSearch = $filter('filter')($scope.data, $scope.options.search.searchText);
	  		}
	  		$scope.$watch('options.pagination.pageLength', function(newValue, oldValue){
				$scope.pages = new Array(Math.ceil($scope.dataFilterSearch.length / newValue));
	  		})
	  		$scope.$watch('options.search.searchText', function(newValue, oldValue){
	  			$scope.dataFilterSearch = $filter('filter')($scope.data, newValue);
	  		})
	  		$scope.$watch('dataFilterSearch.length', function(newValue, oldValue){
	  			$scope.pages = new Array(Math.ceil(newValue / $scope.options.pagination.pageLength));
	  		})
	  		$scope.saveUserData = function(data){
	  			if(localStorageService.isSupported) {
	  				localStorageService.set(data.key, data.val);
				}
	  		}
	  		$scope.toggleSelectedRow = function(data){
	  			if(!$scope.options.multiSelection)
	  			{
	  				$scope.selectedRows = [data];
	  			}
	  			else
	  			{
	      			if($scope.selectedRows.indexOf(data) > -1)
	      				$scope.selectedRows.splice($scope.selectedRows.indexOf(data), 1);
	      			else
	      				$scope.selectedRows.push(data);
	  			}
	  		}

	  		$scope.handleDrop = function (draggedData,
	  		                              targetElem) {

	  		  var swapArrayElements = function (array_object, index_a, index_b) {
	  		    var temp = array_object[index_a];
	  		    array_object[index_a] = array_object[index_b];
	  		    array_object[index_b] = temp;
	  		  };

	  		  var srcInd = $scope.columns.indexOf(draggedData);
	  		  var destInd = $scope.columns.indexOf($(targetElem).data('originalTitle'));
	  		  swapArrayElements($scope.columns, srcInd, destInd);

	  		};

	  		$scope.handleDrag = function (columnName) {

	  		  $scope.dragHead = columnName.replace(/["']/g, "");

	  		};
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
			<table class="{{gridClass}} column-resizable blsGrid resizable dragable" id="dragtable">\
	      			<thead>\
	        			<tr>\
	          				<th class="colHeader" ng-repeat="col in columns" data-original-title="{{col}}" ng-click="order(col)" style="cursor:move" draggable dragData="{{col}}" drop="handleDrop" drag="handleDrag" droppable dragImage="5">{{col|uppercase}}\
	          					<i ng-class="glyphOrder(col)" class="glyphicon pull-right"></i>\
	          				</th>\
	          				<th ng-if="actionsEnabled">Actions</th>\
	        			</tr>\
	      			</thead>\
	      			<tbody>\
	        				<tr ng-class="{\'info\':(selectedRows.indexOf(d)>=0)}" ng-click="toggleSelectedRow(d)" ng-repeat="d in filteredData = (data | filter:options.search.searchText| limitTo:options.pagination.pageLength:offset | orderBy:predicate:reverse)">\
	        					<td ng-repeat="a in columns">{{d[a]}}</td>\
	        					<td ng-if="actionsEnabled" class="center">\
	        						<a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="btn.action(d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
	        					</td>\
	        				</tr>\
	        			</tbody>\
	        			<tfoot>  <tr><td colspan="{{columns.length + (actionsEnabled?1:0)}}">\
	        				<pagination class="col-md-10 col-xs-8" total-items="data.length" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
							<div class="pagerList col-md-2 col-xs-4">\
									<select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
							</div>\
      					</td></tr>\
  						</tfoot>\
	    	</table>\
	 	</div>');
}]);

