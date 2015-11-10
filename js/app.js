angular.module('app', [])
.controller('gitHubDataController', ['$scope', '$http', function($scope, $http) {

		$http.get("https://api.github.com/orgs/WASdev/repos")
			.success(function(data) {
				$scope.repoData = data;
		});
}]);
