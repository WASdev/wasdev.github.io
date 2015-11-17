var app = angular.module("app", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/all', {
        controller: 'MainController',
        templateUrl: 'views/all.html'
    })
    .when('/devops', {
        controller: 'MainController',
        templateUrl: 'views/devops.html'
    })
    .otherwise({
        redirectTo: '/all'
    });
});
