/*Adam Fielding's http service calling the GitHub API for the github repo page */

app.factory('github', ['$http', function($http) {
  return $http.get('https://api.github.com/users/adamfielding/repos?per_page=100', { cache: true})
  //https://api.github.com/orgs/WASdev/repos?per_page=100
            //success may be deprecated, see $http service docs
            .success (function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
