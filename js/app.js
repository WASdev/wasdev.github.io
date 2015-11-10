angular.module('app', [])
.controller('gitHubDataController', ['$scope', '$http', function($scope, $http) {

		$http.get("https://api.github.com/orgs/WASdev/repos?per_page=1000")
			.success(function(data) {
				$scope.repoData = data;
		});
}]);
