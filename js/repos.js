$( document ).ready(processRepos);
var reposResponse;
var categories = {
  "sample" : { "image" :"product", "name" : "Samples", "show" : true },
  "ci" : { "image" : "admin-scripts", "name" : "Continuous Integration", "show" : true },
  "util" : { "image" : "osi", "name" : "Utilities", "show" : true },
  "lab" : { "image" : "", "name" : "Labs", "show" : false }
};

function loadRepos(response) {
  reposResponse = response;
}

function processRepos() {
  if (reposResponse.status = 200) {
    var repos = reposResponse.data;
    for (var i = 0; i < repos.length; i++) {
      var repo = repos[i];
      var category = repo.name.substr(0, repo.name.indexOf('.'));
    
      if (category != "wasdev") {
        if ( categories[category].show ) {
          if ( $( "#" + category ).length == 0) {
            var newCategory = $('<div id="' + category + '" class="pn-col-6-2">' +
              '<a class="pn-btn-action pn-category-filter mbm" data-filter="' + category + '" href="#category:' + category +'">' +
              '<i class="pn-btn-sprite pn-btn-sprite-' + categories[category].image + '"></i>' +
              categories[category].name +
              '</a>' +
	      '</div>');
              newCategory.appendTo( "#categories" );
          }

          var newElement = $( '<article class="pn-repo-item" data-category="all ' + category + '" data-tag="all">' + 
            '  <div class="pn-columns">' + 
            '    <div class="pn-col-6-4">' +
            '      <header class="pn-repo-header">' + 
            '        <h3><a href="' + repo.html_url + '">' + repo.name + '</a></h3>' + 
            '      </header>' + 
            '      <div class="pn-repo-content">' +
            '        <p>' + repo.description + '</p>' +
            '      </div>' +
            '    </div>' +
            '    <div class="pn-col-6-2">' +
            '      <div class="pn-repo-footer">' +
            '        <footer class="pn-post-meta pn-asset-meta">' +
            '          ' + new Date(repo.updated_at).toLocaleDateString() + 			
            '        </footer>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</article>');
          newElement.appendTo( "#pn-repo-listing" );
        }
      }
    }
    RepoFilter.init();
  }
}
