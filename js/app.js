var app = angular.module("app", []);

/*app.config(function ($routeProvider) {
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

/*app.filter('unique', function() {
    return function(collection,keyname) {
        var output = [],
        var keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) == -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});
*/
