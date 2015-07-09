app.controller("homeCtrl", function ($scope,$http,$filter,$timeout,$log) {
	var root = 'http://jsonplaceholder.typicode.com';
	$scope.fakeData=[];
	$http.get(root + '/posts').
		  success(function(data, status, headers, config) {
		  	$timeout(function(){ 
		   		$scope.fakeData=data;
		  	},100);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

	if($scope.page == 'Index')
		$scope.page = 'home';

	$scope.listPersons=[
	{'name':'heni','age':21, 'prenom':'mezzeni'},
	{'name':'riz', 'age':0},
	{'name':'téléphone', 'age':2},
	{'name':'ahmed','prenom':'high tech',  'age':5},
	{'name':'heni','age':21, 'prenom':'Fezzeni'},
	{'name':'heni','age':21, 'prenom':'aezzeni'},
	{'name':'heeni','age':6, 'prenom':'Fezrtzeni'},
	{'name':'heni','age':12, 'prenom':'sezzueni'},
	{'name':'heni','age':21, 'prenom':'rFezzeni'},
	{'name':'hertni','age':21, 'prenom':'Fezzeni'},
	{'name':'bfni','age':8, 'prenom':'kezsdzeni'},
	{'name':'poni','age':21, 'prenom':'bFezzeni'},
	{'name':'gusi','age':35,'prenom':'Fezzeni87'},
	{'name':'hbsdni','age':22,'prenom':'Fez78zeni'},
	{'name':'hesdni','age':55,'prenom':'ez78eni'},
	{'name':'hesdni','age':22,'prenom':'Fezzeni'},
	{'name':'htedni','age':75,'prenom':'yr78zeni'},
	{'name':'redni','age':11,'prenom':'Fez78zeni'},
	{'name':'hgsdni','age':22,'prenom':'Fre8zeni'},
	{'name':'opusdni','age':44,'prenom':'sfz78zeni'},
	{'name':'jusdni','age':57,'prenom':'sfz78zeni'},
	{'name':'pusdni','age':78,'prenom':'sfz78zeni'},
	{'name':'lousdni','age':28,'prenom':'sfz78zeni'}]

	$scope.options={
		multiSelection:false,
		colDef:{'userId': { displayName: 'User Id'}, 'body': { displayName: 'Content'}},
		search:{
			searchText:'', 
			searchClass:'form-control'
		},
		actions:[
		{
			title:'edit',
			glyphicon:'glyphicon glyphicon-edit',
			class:'btn-circle btn-info btn-xs',
			action:function(row){
				$log.info('edit  : '+ row.id);
				var obj = $filter('filter')($scope.fakeData, {id: row.id})[0];
				$log.info(obj);
				$scope.fakeData.slice($scope.fakeData.indexOf(obj),1);
				// $scope.fakeData.push(row);
			}
		},
		{
			title:'delete',
			glyphicon:'glyphicon glyphicon-remove',
			class:'btn-circle btn-danger btn-xs',
			action:function(row){
				//$scope.listPersons.
				$log.info('delete  : '+ row.id);
				var obj = $filter('filter')($scope.fakeData, {id: row.id})[0];
				$log.info(obj);
				$scope.fakeData.slice($scope.fakeData.indexOf(obj),1);
				//$scope.fakeData.slice($scope.fakeData.indexOf(row),1);
			}
		}
		
		],
		pagination:{
			pageLength:20,
			pageIndex:0,
			pager:{
				nextTitle:'Suivant',
				perviousTitle:'Précédent',
				maxSize:3
			},
			itemsPerPage:{
				prefixStorage:'ipp_',//itemsPerPage
				selected:20,
				range:[20,50,100]
			}
		}
	};

});