app.controller("homeCtrl", function ($scope,$http) {
	var root = 'http://jsonplaceholder.typicode.com';
	$scope.fakeData=[];
	$http.get(root + '/posts').
		  success(function(data, status, headers, config) {
		   	$scope.fakeData=data;
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
	{'name':'hesdni','age':22,'prenom':'ez78eni'},
	{'name':'hesdni','age':22,'prenom':'Fezzeni'},
	{'name':'htedni','age':22,'prenom':'yr78zeni'},
	{'name':'redni','age':22,'prenom':'Fez78zeni'},
	{'name':'hgsdni','age':22,'prenom':'Fre8zeni'},
	{'name':'opusdni','age':44,'prenom':'sfz78zeni'},
	{'name':'jusdni','age':57,'prenom':'sfz78zeni'},
	{'name':'pusdni','age':78,'prenom':'sfz78zeni'},
	{'name':'lousdni','age':28,'prenom':'sfz78zeni'}]

	$scope.options={
		multiSelection:false,
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
				console.log('edit  : '+ row.userId);
			}
		},
		{
			title:'delete',
			glyphicon:'glyphicon glyphicon-remove',
			class:'btn-circle btn-danger btn-xs',
			action:function(row){
				//$scope.listPersons.
				console.log('delete  : '+ row.userId);
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
				selected:20,
				range:[20,50,100]
			}
		}
	};

});