app.factory('github', ['$http', function($http) {
  return $http.get('https://api.github.com/orgs/WASdev/repos?per_page=100')
            //success may be deprecased, see $http service docs
            .success (function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
