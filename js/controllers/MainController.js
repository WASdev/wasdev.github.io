/*Adam Fielding's angular controller for the github repo page */
angular.module('app')
    .controller('MainController', ['$scope', 'github', '$location', function($scope, github, $location) {

        repos = [];
        pageNumber = 1;
        repoLocation = "https://api.github.com/orgs/WASdev/repos";

        //set the filter to the variable in the Url
        var path = $location.path();
        $scope.myFilter = path.slice(1);
        var test = 0;

       //set the url path to the filter
        $scope.click = function(filter) {
            $location.path(filter);
        };

        // set the filter to the path of the url
        $scope.$on('$locationChangeSuccess', function(event) {
            var path = $location.path();
            $scope.myFilter = path.slice(1);
            console.log($scope.myFilter);
        });

        //sorting function and variables
        $scope.sortType = '-repositoryData.pushed_at'
        $scope.reverseSort = false

        $scope.changeSortType = function(sortType) {
            $scope.sortType = sortType;
        }

        $scope.changeOrder = function() {
            $scope.reverseSort = !$scope.reverseSort;
        }

        //code for filtering based on tags in the repository

        //array holding the unique filters generated from the tags and the prefixes
        $scope.arrayOfFilters = [];
        //arrays used to hold the filters until they are pushed into the data array by index
        arrayOfPrefixes = [];
        arrayOfTags = [];

        //array holding the repo data and each repos filters
        $scope.arrayOfFiltersAndData = [];
        //array holding the arrayOfFiltersAndData
        $scope.masterArrayOfFiltersAndData = [];

        // code for filtering based on prefix in the repository name
        generateFilters = function() {
            angular.forEach(repos, function(repo, index) {
                //get the prefix
                var firstPeriodLocation = repo.name.indexOf(".");
                var prefix = repo.name.substr(0, firstPeriodLocation);

                //change the prefixes to more user readable names
                switch (prefix) {
                    case "sample":
                        prefix = "samples";
                        break;
                    case "ci":
                        prefix = "continuous integration";
                        break;
                    case "lib":
                        prefix = "libraries";
                        break;
                    case "tool":
                        prefix = "tools";
                        break;
                    }

            //Add all prefixes to array of prefixes, to then later be pushed to arrayOfFiltersAndData
            arrayOfPrefixes.push(prefix);
            //if the prefix is unique, add to array of prefixes
            if ($scope.arrayOfFilters.indexOf(prefix) == -1)
                $scope.arrayOfFilters.push(prefix);
            });
        }

        //code for filtering based on tags in the repository
        generateTags = function() {
            angular.forEach(repos, function(repo, index) {
                //split the descriptions into individual words
                if (repo.description==undefined){
                  repo.description == null;
                }
                if ((repo.description!==null) && (repo.description!==undefined)){
                var arrayOfWords = repo.description.split(' ');}

                angular.forEach(arrayOfWords, function(word, wordIndex) {
                    //check each word to see if it begins with a hash
                    if ((word.indexOf("#") > -1) || (word.indexOf("docker") > -1)) {
                        //push to array containing all the tags
                        arrayOfTags[index] = word;

                        //push the tag to the array of filters, only if unique
                        if ($scope.arrayOfFilters.indexOf(word) == -1) {
                            $scope.arrayOfFilters.push(word);
                        }
                    }
                });
                arrayOfWords = [];
            });
        }


        //code for creating the arrayOfFilteresAndData Object, used by the directives
        pushToArray = function() {
            angular.forEach(arrayOfPrefixes, function(prefix, index) {
                var tags = [];
                //add prefix to tags
                tags.push(prefix);
                //if tag is not null, add to tags
                if (arrayOfTags[index] != null) {
                    tags.push(arrayOfTags[index])
                }

                arrayOfFilteresAndData = {tags: tags, repositoryData: repos[index]};

                //add to master array
                $scope.masterArrayOfFiltersAndData.push(arrayOfFilteresAndData);
            });
        }

        getNumOfRepos = function() {
          angular.forEach(repos, function(repo, index))
          {
            test++;
          }
        }
        //getting the data
        getAllGitHubData = function() {
            url = repoLocation + "?per_page=100&page=" + pageNumber;
            if (location.search == "?test")
            {
              url = "https://raw.githubusercontent.com/BillyD73/billyd73.github.io/master/test.json";
            }
            if (location.search == "?official")
            {
              url = "https://raw.githubusercontent.com/BillyD73/billyd73.github.io/master/official.json";
            }
            github.getGitHubData(url, function(response) {
                repos = repos.concat(response.data);
                if (location.search == null)
                {
                if (response.headers('link').indexOf("next") >= 0){
                  // indexOf just returns the letter position of the string as a number "this is a test" str.indexOf("is") =
                    pageNumber = pageNumber + 1;
                    getAllGitHubData();
                }
               else {
                    generateFilters();
                    generateTags();
                    pushToArray();
                    /////////////////////////////////////////////////

                }
            }
            else {
              generateFilters();
              generateTags();
              pushToArray();

            }
          });
        }

        getAllGitHubData();
        getNumOfRepos();
        alert(test);




}]);
