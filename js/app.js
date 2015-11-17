var app = angular.module("app", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/all.html'
    })
    .when('/samples', {
        templateUrl: 'views/samples.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});
