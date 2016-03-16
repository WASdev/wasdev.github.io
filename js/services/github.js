/*Adam Fielding's http service calling the GitHub API for the github repo page */

angular.module('app')
    .service('github', ['$http', function($http) {

    this.getGitHubData = function(url, callback) {
        $http.get(url)
            .then(callback)
        }

}]);
