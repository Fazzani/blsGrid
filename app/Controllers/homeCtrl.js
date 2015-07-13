(function(angular) {
    'use strict';
    app.controller("homeCtrl", function($scope, $http, $filter, $timeout, $log) {
        var root = 'http://jsonplaceholder.typicode.com';
        var rootUrl = 'http://localhost:3000/posts';
        $scope.fakeData = [];
        $scope.loadDataFun = $http.get('http://localhost:3000/posts', {
            dataType: 'json',
            data: '',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "X-Testing": "testing",
                'JsonStub-User-Key': '9b0c8e63-914c-44bf-a7b9-79d70e7510fa',
                'JsonStub-Project-Key': 'fa7febb9-c680-4114-9088-09e474b9d002'
            }
        });
        $scope.model = {
            totalItems: 0,
            data: {}
        };
        $scope.query = function(pageIndex, pageLength, searchedText, orderBy, order) {
            var url = rootUrl + "?_start=" + pageIndex + "&_end=" + pageLength;
            if (angular.isDefined(searchedText) && searchedText!=="") url += "&q=" + searchedText;
            if (angular.isDefined(orderBy)) {
                url += '&_sort=' + orderBy;
                url += '&_order=' + (order == 0 ? 'DESC' : 'ASC');
            }
            $log.debug('url=> ' + url);
            return $http.get(url, {
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Testing': 'testing',
                    'JsonStub-User-Key': '9b0c8e63-914c-44bf-a7b9-79d70e7510fa',
                    'JsonStub-Project-Key': 'fa7febb9-c680-4114-9088-09e474b9d002'
                }
            }).then(function(response) {
                $scope.model.totalItems = response.headers()['x-total-count'];
                $scope.model.data = response.data;
            }, function(errors) {
                $log.error(errors);
            });
        };
        $scope.loadDataFun.success(function(data, status, headers, config) {
            $timeout(function() {
                $scope.fakeData = data;
            }, 0);
        }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        //clearUserDataEvent
        $scope.clearUserData = function() {
            $scope.$broadcast('flushEvent');
        }
        if ($scope.page == 'Index') $scope.page = 'home';
        $scope.options = {
            multiSelection: true,
            colDef: {
                'userId': {
                    displayName: 'User Id'
                },
                'body': {
                    displayName: 'Content'
                }
            },
            search: {
                searchText: '',
                searchClass: 'form-control'
            },
            actions: [{
                title: 'edit',
                glyphicon: 'glyphicon glyphicon-edit',
                class: 'btn-circle btn-info btn-xs',
                action: function(row) {
                    $log.info('edit  : ' + row.id);
                    var obj = $filter('filter')($scope.fakeData, {
                        id: row.id
                    })[0];
                    $log.info(obj);
                    $scope.fakeData.slice($scope.fakeData.indexOf(obj), 1);
                    // $scope.fakeData.push(row);
                }
            }, {
                title: 'delete',
                glyphicon: 'glyphicon glyphicon-remove',
                class: 'btn-circle btn-danger btn-xs',
                action: function(row) {
                    //$scope.listPersons.
                    $log.info('delete  : ' + row.id);
                    var obj = $filter('filter')($scope.fakeData, {
                        id: row.id
                    })[0];
                    $log.info(obj);
                    $scope.fakeData.slice($scope.fakeData.indexOf(obj), 1);
                    //$scope.fakeData.slice($scope.fakeData.indexOf(row),1);
                }
            }],
            pagination: {
                pageLength: 20,
                pageIndex: 0,
                pager: {
                    nextTitle: 'Suivant',
                    perviousTitle: 'Précédent',
                    maxSize: 5
                },
                itemsPerPage: {
                    prefixStorage: 'ipp_', //itemsPerPage
                    selected: 20,
                    range: [20, 50, 100]
                }
            }
        };
    });
})(window.angular);