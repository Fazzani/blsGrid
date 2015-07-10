var app = angular.module('app', ['bls_tpls', 'ui.bootstrap', 'LocalStorageModule']);
app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setStorageType('sessionStorage').setPrefix('').setNotify(true, true);
}).filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i = 0,
            len = collection.length;
        for (; i < len; i++) {
            if (collection[i][propertyName] == propertyValue) {
                return collection[i];
            }
        }
        return null;
    }
}).filter('getIndexByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i = 0,
            len = collection.length;
        for (; i < len; i++) {
            if (collection[i][propertyName] == propertyValue) {
                return i;
            }
        }
        return null;
    }
});