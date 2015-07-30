(function(angular) {
    'use strict';
    app.controller("testCtrl", function($scope, $http, $filter, $timeout, $log) {
        $scope.data = [{
            id: '1',
            name: 'fazzani',
            firstName: 'heni',
            birthday: 1982,
            phone: '0667426422'
        }, {
            id: '2',
            name: 'fazzani2',
            firstName: 'heni',
            birthday: 1982,
            phone: '0667426422'
        }, {
            id: '3',
            name: 'fazzani3',
            firstName: 'heni',
            birthday: 1982,
            phone: '0667426422'
        }, {
            id: '4',
            name: 'fazzani4',
            firstName: 'heni',
            birthday: 1982,
            phone: '0667426422'
        }, {
            id: '5',
            name: 'fazzani5',
            firstName: 'heni',
            birthday: 1982,
            phone: '0667426422'
        }, {
            id: '6',
            name: 'fazzani',
            firstName: 'heni',
            birthday: 1980,
            phone: '0667426422'
        }];
        $scope.cols = ['id', 'name', 'firstName', 'birthday', 'phone'];
        $scope.getChildren = function(obj) {
            $log.debug('in getChildren...');
            var childs = angular.copy($scope.data.slice(obj.id - 1));
            angular.forEach($scope.cols, function(val, key) {
                angular.forEach(childs, function(v, k) {
                    childs[k][val] = childs[k][val] + '-' + obj.id;
                });
            });
            return childs;
        };
    });
})(window.angular);