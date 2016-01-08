/*Adam Fielding's angular controller for the github repo page */

app.controller('MainController', ['$scope', 'github', function($scope, github) {

    github.success(function(data) {
        $scope.repos = data;

        $scope.click = function(filter) {
            $scope.myFilter = filter;
        };

        //sorting function and variables
        $scope.sortType = '-repositoryData.pushed_at'
        $scope.reverseSort = false

        $scope.changeSortType = function(sortType) {
            $scope.sortType = sortType;
        }

        $scope.changeOrder = function() {
            $scope.reverseSort = !$scope.reverseSort;
        }


        //style function
        $scope.selectedIndex = -1;

        $scope.select= function(i) {
            $scope.selectedIndex=i;
        };

        //code for filtering based on tags in the repository
        
        //create categories array
        $scope.arrayOfWords = [];
        $scope.arrayOfCategories = [];
        $scope.arrayOfTags = [];

        angular.forEach($scope.repos, function(repo, index) {
            //split the descriptions into individual words
            var x = repo.description.split(' ');
            $scope.arrayOfWords.push(x);
            angular.forEach($scope.arrayOfWords, function(wordArray, index) {

                //create array of tags in the description
                var descriptionTags = [];

                angular.forEach(wordArray, function(word, index) {
                    //check each word to see if it begins with a hash
                    if (word.indexOf("#") > -1) {

                        descriptionTags.push(word);

                        //push the word to a plain tag array, for use in next code block - only if unique
                        if ($scope.arrayOfTags.indexOf(word) == -1)
                        $scope.arrayOfTags.push(word);
                    }
                });

                //push the tag and the repo data to arrayOfCategories
                var array = {tags: descriptionTags, repositoryData: repo};

                //add to the Category Array
                $scope.arrayOfCategories.push(array);

            });
            //clear array of words
            $scope.arrayOfWords = [];
        });
        
        //code for filtering based on prefix in the repository name
        $scope.arrayOfPrefixes = [];
        $scope.arrayOfPrefixesAndData = [];
        
        angular.forEach($scope.repos, function(repo, index) {
            //get the prefix
            var firstPeriodLocation = repo.name.indexOf(".");
            var prefix = repo.name.substr(0, firstPeriodLocation);
            
            //push the prefix and data to an array
            var array = {prefixFilter: prefix, repositoryData: repo};
            $scope.arrayOfPrefixesAndData.push(array);

            //if the prefix is unique, add to array of prefixes
            if ($scope.arrayOfPrefixes.indexOf(prefix) == -1)
              $scope.arrayOfPrefixes.push(prefix);
        });
    });

}]);
