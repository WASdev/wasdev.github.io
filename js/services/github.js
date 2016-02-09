/*Adam Fielding's http service calling the GitHub API for the github repo page */

app.factory('github', ['$http', function($http) {
  return $http.get('https://api.github.com/orgs/WASdev/repos?per_page=100', { cache: true})
            //success may be deprecated, see $http service docs
            .success (function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
