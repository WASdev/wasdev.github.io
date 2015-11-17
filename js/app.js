var app = angular.module("app", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'MainController',
        templateUrl: 'views/all.html'
    })
    .when('/samples', {
        controller: 'MainController',
        templateUrl: 'views/samples.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});
