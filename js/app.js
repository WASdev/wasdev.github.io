angular.module('app', [])
.controller(githubController, ['$scope', '$http', function($scope, $http) {

	var loadRepos = function () {
		$http.get("https://api.github.com/orgs/WASdev/repos?callback=loadRepos&per_page=1000")
			.success(function(data) {
				$scope.repoData = data;
			});
	}
}]);
