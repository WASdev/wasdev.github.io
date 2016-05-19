# GitHub Pages for wasdev.github.io

## Features
- This pages displayes all repositories from [github.com/wasdev](github.com/WASdev)
- It allows the user to use a custom filter in the 'Filer Repositories' box.
- It suggests a number of filters based on the prefix ie. selecting the 'Samples' filter box will filter the repositories to only show the repositories prefixed by 'sample'. These filter boxes have to be defined in the code, more details below.
- It also suggests filters based on #tags found in the descriptions of the repos. As more #tags are used, the app will automatically add a filter box for it.
- When one of these filters are selected, the URL changes. This is useful when linking a user to the page with a predefined filter.
- The user is able to sort the repos based on the last time they were updated.

## Style
The style is inherited from the [wasdev.net](http://wasdev.net/) and it's css files.
github.css is the css file that contains all the styling specific to this page.

## Scripting
The [wasdev.net](http://wasdev.net/) javascript is all contained in `js/wasdev/`
The scripting for this specific page was written using the [Angular](https://angularjs.org/) framework
The [GitHub API](https://developer.github.com/v3/) is called using the service in `js/services/github.js`
The rest of the logic is contained in the single controller, `js/controllers/MainController.js`
This is due to the small scope of the application.

## The Controller
The [GitHub API paginates](https://developer.github.com/v3/#pagination) its responses to HTTP requests. The maximum number of repos displayed per page is 100. Therefore we need to make multiple requesets in order to obtain all the repositores. This is performed in the `getAllGitHubData()` function, by parsing the HTTP response header to see if it refers to a following page. Once there are no more pages, we call the three functions, `generateFilters`, `generateTags` and `pushToArray`.

The primary functions within the controller deal with obtaining, parsing and formatting the list of repositories from the github organisation at [github.com/wasdev](github.com/wasdev)
