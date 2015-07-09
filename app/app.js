var app = angular.module('app', ['bls_tpls', 'ui.bootstrap', 'LocalStorageModule']);
app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setStorageType('sessionStorage').setPrefix('').setNotify(true, true);
});