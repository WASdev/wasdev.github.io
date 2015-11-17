app.controller('MainController', ['$scope', 'github', function($scope, github) {

    github.success(function(data) {
        $scope.repos = data;
    });

}]);
