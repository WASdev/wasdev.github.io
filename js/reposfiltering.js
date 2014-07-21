	var transitionSupport = false,
		transitionEnd = '',
		el = document.createElement('div'),
		transEndEventNames = {
		  'WebkitTransition' : 'webkitTransitionEnd',
		  'MozTransition'    : 'transitionend',
		  'OTransition'      : 'oTransitionEnd otransitionend', // Opera used both at one point
		  // Microsoft never supported prefixed transitions. IE10 is not prefixed.
		  'transition'       : 'transitionend'
		};
		
	for (name in transEndEventNames) {
		if (el.style[name] !== undefined) {
			transitionSupport = true;
			transitionEnd = transEndEventNames[name];
		}
	}

var RepoFilter = {
	
	// options
	o: {
		items_on_page: 100,
		paginate: false,
		prev_text: '&larr; Prev',
		next_text: 'Next &rarr;',
		supports_spinner: window.Modernizr && Modernizr.inputtypes && Modernizr.inputtypes.number,
		of_seperator: ' / ',
		filter_by_tag: false,
		filter_text: 'Filter by tag: '
	},
	
	// cache
	cache: {
		current_repo_filter: '',
		current_filter: [],
	},

	// elements
	el: {
          // setup in the init method
	},

	// some class strings we'll be using a lot
	classes: {
		active: 'active',
		hidden: 'hidden',
		transition_out: 'is-out',
		disabled: 'is-disabled',
		match: 'is-match'
	},
	
	init: function(){
		var self = this;

                this.el = {
		  container: $('#wasdev_repo_listing'),
		  cat_buttons: $('.pn-category-filter'),
		  show_all: $('.pn-category-filter-show-all'),
		  repos: $('.pn-repo-item'),
		  indicator: $('#pnext-repo-filter-indicator'),
		  all_tags: $('#all_repo_tags').find('li') // placed on the page by WP: because you need both the slug and the tag name. See repository.php
	        };
		
		// The primary filtering event listener
		// --------------------------------------------
		$(window).on('hashchange', function(){
		
			self.do_filter();
		
		});
		
		// Event listener on category filters
		//---------------------------------------------
		this.el.cat_buttons.on('click', function(e) {
			
			e.preventDefault();
			
			if ( ! $(this).hasClass( self.classes.active ) ) {
				self.update_hash( 'category', $(this).data('filter') );
			}

		});
		

		// Init tag filter
		// --------------------------------------------
		this.el.all_tags.length && this.tag_filter_init();


		// Init pagination
		// --------------------------------------------
		this.el.repos.length > this.o.items_on_page && this.paginate_init();
		
		
		// Load init
		// --------------------------------------------
		
		// if no hash, but pagination active, you need to kick it off on page 1
		if ( ! window.location.hash && this.o.paginate ) {
			window.location.replace( this.build_hash_str( 'page','1' ) );
		}
		
		// If there is a hash, run the filter
		window.location.hash && this.do_filter();
		
	}, 
	
	// ---------------------------------------------------------
	// Tag filtering INIT
	//   Builds tag filter
	//   Adds a "None" repo item because it's now possible to have zero matches
	//   Updates the cached list of repo items (to include the "none" item)
	// ---------------------------------------------------------
	tag_filter_init: function() {
		
		var self = this;
		
		// Set an option so we know this has happened
		this.o.filter_by_tag = true;
		
		// Build and insert tag filtering widget into the page
		this.build_tag_filter();
		
		// With 2 types of filtering, there's the possibility of no matches. Need to add a "none" item.
		this.el.no_matches_repo = $( document.createElement('article') )
			.addClass('pn-repo-item hidden is-out')
			.attr('id', 'no-repo-matches')
			.append( '<div class="pn-repo-header"><h3><strong>No matches!</strong></h3></div>\
						<div class="pn-repo-content">No assets matched that combination of filters</div>\
					  </div>' )
			.appendTo('.pn-repo-listing');
		
		// with a new item, need to re-query the list of repo items
		this.el.repos = $('.pn-repo-item');
		
	},

	// ---------------------------------------------------------
	// Helper function for tag filtering
	//   Builds tag filter and inserts into page
	// ---------------------------------------------------------	
	build_tag_filter: function() {
	
		var self = this,
			tags = this.el.all_tags,
			filter,
			filter_select;
			
		// Drop in the filter mechanism
		filter = $('#pnext-repo-tag-filter');
		
		filter
			.addClass('pn-nav-links')
			.append( this.o.filter_text );
		
		filter_select = $('<select id="filter_by_tag"></select>');
		
		// "None" option
		filter_select.append( '<option value="all">(none)</option>' );
		
		// All available tags
		tags.each( function(){
			filter_select.append( '<option value="'+ $(this)[0].id.split('asset_tag_').pop() +'">'+ $(this).text() +'</option>' )
		});
		
		// Drop it in the container
		filter_select.appendTo( filter );
		
		// Cache the filter select element
		this.el.tag_filter_select = filter_select;
		
		// Event listener for change on the filter element
		filter_select.on('change', function(){
			
			self.update_hash( 'tag', $(this).val() );
		
		});
	
	},
	

	// ---------------------------------------------------------
	// Pagination init
	//   Updates pagination options
	//	 Builds and inserts pagination controls
	//	 Adds event handlers
	// ---------------------------------------------------------
	paginate_init: function() {
		
		var self = this;
		
		// Update option to indicate we're using pagination
		this.o.paginate = true;
		
		// Creates the initial pages and runs the initial filter
		this.create_paginate_links();
		
		// Add event handler for "prev" button
		this.el.pagination_prev.on('click', function(e) {
			e.preventDefault();
			
			var prev_page = self.get_current_page() - 1; // prev_page will be zero if on page 1
			prev_page && self.update_hash( 'page', prev_page );
		});
		
		// Event handler for "next" button
		this.el.pagination_next.on('click', function(e){
			e.preventDefault();
			
			var next_page = self.get_current_page() + 1;
			( self.get_total_pages() - next_page >= 0 ) && self.update_hash( 'page', next_page );
		});
		
		// event handler for spinner/selector
		this.el.pagination_input.on('change', function(e){			
			e.preventDefault();
			self.update_hash( 'page', self.validate_page_number( this.value ) );
		});
		
	},

	// ---------------------------------------------------------
	// Create pagination links and insert into page
	// ---------------------------------------------------------	
	create_paginate_links: function() {
		
		// need a place to dump this
		var pagination_base = $('<div class="pn-repo-pagination cf pn-nav-links"></div>');
				
		// prev
		$('<a href="#" class="pn-repo-pagination-prev">'+ this.o.prev_text +'</a>').appendTo( pagination_base );
		
		// input/spinner
		if ( this.o.supports_spinner ) {
			$('<input class="pn-repo-pagination-spinner pn-repo-pagination-input" type="number" min="1" data-current="1" max="" step="1" value="1" />').appendTo( pagination_base );
		} else {
			// update_pagination_totals() fills in the options for this
			this.el.pagination_input = $('<select class="pn-repo-pagination-select pn-repo-pagination-input" data-current="1"></select>').appendTo( pagination_base );
		}
		
		// separator
		pagination_base.append( this.o.of_seperator );
		
		// counter/total pages
		$('<span class="pn-repo-pagination-total"></span>').appendTo( pagination_base )
		
		// next
		$('<a href="#" class="pn-repo-pagination-next">'+ this.o.next_text +'</a>').appendTo( pagination_base );

		// insert top pagination area
		pagination_base.appendTo('#pnext-repo-paginate-top');
		
		// insert bottom pagination area 
		pagination_base.clone().appendTo('#pn-repo-listing-footer');
		
		// cache these for later
		this.el.pagination_prev = $('.pn-repo-pagination-prev');
		this.el.pagination_input = $('.pn-repo-pagination-input');
		this.el.pagination_counter = $('.pn-repo-pagination-total');
		this.el.pagination_next = $('.pn-repo-pagination-next');
		
	},

	// ---------------------------------------------------------
	// Helper function: get current page (from the input)
	// ---------------------------------------------------------
	get_current_page: function() {		
		return parseInt( this.el.pagination_input.first().attr('data-current') );
	},

	// ---------------------------------------------------------
	// Helper function: get total number of pages (from the counter)
	// ---------------------------------------------------------	
	get_total_pages: function() {
		return parseInt( this.el.pagination_counter.first().text() );
	},
	
	// ---------------------------------------------------------
	// Helper function: build/update the hash value. 
	// Can pass it either the value that's changing directly , or it'll just figure it out
	// ---------------------------------------------------------	
	update_hash: function( key, val ) {
		// Update the hash
		// this will trigger the hashchange event
		window.location.hash = this.build_hash_str( key, val );
	},
	
	build_hash_str: function( key, val ) {
		var hash = '#';
		
		// Add active category
		hash += 'category:' + ( key === 'category' ? val : this.el.cat_buttons.filter('.active').first().attr('data-filter') );
		
		// And active tag
		if ( this.o.filter_by_tag ) hash += '_tag:' + ( key === 'tag' ? val : this.el.tag_filter_select.val() );
		
		// And the page number
		if ( this.o.paginate ) hash += '_page:' + (key === 'page' ? val : this.el.pagination_input.val() );
		
		return hash;
	},
	
	do_filter: function() { 

		if ( ! window.location.hash ) return;
		
		var self = this,
			hash = this._clean_up_hash( window.location.hash ),
			repo_filter = hash.split('_page')[0],
			page = parseInt( hash.split('_page:').pop() ),
			valid_page,
			matches = this.filter_repos_by_hash( repo_filter ); // get matches by cat/tag (at first)

		if (this.o.paginate) {
			
			// if filters have changed, update pagination counts on matched repos
			if ( repo_filter != this.cache.current_repo_filter ) {
				this.update_pagination_totals( matches );
				this.cache.current_repo_filter = repo_filter;
			}
			
			valid_page = this.validate_page_number( page );
			
			// page number might not be valid or might need to change
			if ( page != valid_page ) {
				
				// fix with the valid page number
				hash = hash.replace( /page:.+/, 'page:' + valid_page );

				// change the hash to the valid pagenum without adding to history
				window.location.replace('#'+hash);
			}
			
			// filter matches (again) by requested page number this time
			matches = this.filter_repos_by_hash( hash );
		}
		
		// Convert hash to associative object. Iterate over properties doing updates
		$.each( this.hash_to_obj(hash), function(key, val) {
			// Call the appropriate update function (eg update_category, update_page)
			self['update_'+ key](val);
		}); 
		
		// Hide and show the appropriate repositories
		this.show_repos( matches );
		this.hide_repos( this.el.repos.not( matches ) )
		
	},
	
	_clean_up_hash: function( hash ) {
		return hash.toString().replace('#','');
	},
	
	filter_repos_by_hash: function( hash ) {
	
		var matches = this.el.repos;
		
		// get an object from the string and iterate over its properties
		$.each( this.hash_to_obj(hash), function( key, val ) {
			// filter out and save the repos that match
			matches = matches.filter('[data-'+ key +'~="'+ val +'"]');
		});
		
		return matches.length ? matches : this.el.no_matches_repo;
	},
	
	// -------------------------------
	// Helper function: turns a hash into an object.
	// 	eg. output['category'] = 'category_name'
	// -------------------------------
	hash_to_obj: function(hash) {
		var hash = this._clean_up_hash( hash || window.location.hash),
			output = {};
			
		$.each( hash.split('_'), function(idx, part) {
			var arr = part.split(':');
			
			output[ arr[0] ] = arr.pop();
		});
		
		return output;
	},
	
	validate_page_number: function( page ) {
		
		// make sure it's a number
		page = parseInt(page);
		
		// reset to 1 if NaN
		if ( isNaN(page) || ! isFinite(page) ) page = 1;
		
		// set to "1" if below zero
		if ( page <= 0 ) page = 1;
		
		// or set to max if above the total # of pages 
		if ( page > this.get_total_pages() ) page = this.get_total_pages();
		
		return page;
		
	},

	update_pagination_totals: function( matches, page ) {
	
		var self = this,
			pages = 0;
		
		// reset all prior page counts on repos
		this.el.repos.attr('data-page', '0');
					
		// Update pagination`
		matches.each( function( idx, repo ) {
			
			// up the page number every X items
			if (idx % self.o.items_on_page === 0) pages++;
			
			// Set the page number
			$(repo).attr('data-page', pages);
			
		});
		
		// Update the total with that number
		this.el.pagination_counter.text( pages );
		
		if ( this.o.supports_spinner ) {
			// Just update the max of the spinner
			this.el.pagination_input.attr('max', pages);
		} else {
			// Repopulate with new options
			var options = [];
			for ( i = 1; i <= pages; i++ ) {
				options.push( '<option value="' + i + '">'+ i +'</option>');
			}
			this.el.pagination_input.html( options.join('') );
		}
			
	},
	
	update_category: function (category) {
		
		this.el.cat_buttons.removeClass( this.classes.active );
		
		var button = this.el.cat_buttons
			 .filter('[data-filter="'+ category +'"]');
                button = button.addClass( this.classes.active );
		
		this.el.indicator.text( button.text() );
	},
	
	update_tag: function( tag) {
		if ( ! this.o.filter_by_tag ) return;
		this.el.tag_filter_select.val(tag);
	},
	
	update_page: function( page ) {
	
		if ( ! this.o.paginate ) return;
		
		page = this.validate_page_number(page);
	
		// Set/remove disabled classes on prev/next
		this.el.pagination_prev[ page === 1 ? 'addClass' : 'removeClass' ]( this.classes.disabled );
		this.el.pagination_next[ page === this.get_total_pages() ? 'addClass' : 'removeClass' ]( this.classes.disabled );
		
		// Update current page counter
		this.el.pagination_input
			.attr('data-current', page)
			.val( page );
			
	},
	
	get_total_pages: function() {
		return parseInt( this.el.pagination_counter.first().text() );
	},
	
	show_repos: function( $els ) {
	
		var self = this;
		
		$els.each(function(){
			
			var $el = $(this);
			
			$el.removeClass( self.classes.hidden );
			$el[0].offsetWidth; // trigger reflow
			$el.removeClass( self.classes.transition_out );
		});
	
	},

	hide_repos: function( $els ) {
		
		var self = this;
		
		$els.each(function(){
			
			var $el = $(this);

			// only if it's not already hidden
			// don't want to attach another event listener
			if ( ! $el.hasClass( self.classes.hidden ) ) {
			
				var next = function next() {				
					$el.addClass( self.classes.hidden );
				}
			
				transitionSupport ? $el.one( transitionEnd, next ) : next();
			
				// will completely hide when finished
				$el.addClass( self.classes.transition_out );
			}
			
		});
		
	}
}
