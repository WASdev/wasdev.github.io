(function(w,$) {

var Pnext_Tree = {

  els: {
	trees : $('[role="tree"]'),
	doc: $(document),
  },
  
  atts: {
    disable_tab: { 'tabindex' : '-1' },
    enable_tab: { 'tabindex' : '0' }
  },
  
  classes: {
    toggle: 'is-open is-closed',
    closed: 'is-closed',
    open: 'is-open',
  },

  init: function(){
  
	var Tree = this;
	
  // Set up role="group" aria-labels
  // Fixes RPT issues in #108547
  this.els.trees.find('ul').each(function(){
    
    // Find the appropriate link
    var $group = $(this).attr('role','group');
    var $label_link_text = $group.parent() // parent <li>
      .find('a') // get all the anchors
      .first() // only want the first
      .text(); // nab the text
    
    $group.attr('aria-label', 'Children of ' + $label_link_text);
    
  });
  
	// Set up tabindexes for tree items
	// Open up the "current" path
	this.els.trees.each(function(){
	  var $tree = $(this);
	
	  // set all anchors out of the tab order
	  // fortune favors the bold, son
	  $tree.find('a').attr( Tree.atts.disable_tab );
	
	  // open up the current path
	  $tree
	    .find('.current_page_item, .current-cat').find('a').first().attr( Tree.atts.enable_tab ) // set lone tabbable link to current one
	    .parentsUntil(this, '.'+ Tree.classes.closed ).each( function(){
	      Tree.toggle( $(this), 'open', false ); // do NOT set tabindex on these
	    });
	    
	  // if you haven't set a current link to be the tabbable target, hit the 1st one
	  if ( ! $tree.find('[tabindex="0"]').length ) {
	    $tree.find('a').first().attr( Tree.atts.enable_tab );
	  }
	});
	
	
	// -------------------
	// Event listener for the <ins> togglers
	// -------------------
	this.els.doc.on('click.pnext.tree', 'ins.toggle', function(e){
	  Tree.toggle( $(this).closest('li'), '', true );
	});
	
	
	// ----------------------------------
	// Event listener for keyboard events
	// h/t: http://hanshillen.github.io/jqtest/#goto_tree
	// ----------------------------------
	this.els.doc.on('keydown.pnext.tree', 'a',  $.proxy(Tree.keydown, this) );
  
  },
  
  toggle: function( $li, dir, change_tab_target ) {
    
    dir = dir || ( $li.hasClass( this.classes.open ) ? 'close' : 'open' );
    
    $li.toggleClass( this.classes.toggle );
    
    $li.children('.toggle-wrap').find('a').attr('aria-expanded', function(idx, attr){
      return dir === 'open' ? 'true' : 'false';
    });
    
    // set the link as the new tab target
    change_tab_target && this.set_tab_target($li);
    
  },
  
  set_tab_target: function( $li ) {
    
    $li.closest( '[role="tree"]' ).find('a[tabindex="0"]').attr( this.atts.disable_tab );
    
    $li.find('a').first().attr( this.atts.enable_tab );
    
  },
  
  set_focus: function ($li) {
    
    this.set_tab_target( $li );
    
    $li.find('a').first().focus();
    
  },
  
  keydown: function(evt) {
	
	// bail on other keys
	// or if we're not on a tree
	var $bail = $.inArray( evt.keyCode, [37, 38, 39, 40] ) === -1 || $(evt.target).closest('[role="tree"]').length === 0;
		
	if ( $bail ) return;
	
	evt.preventDefault();
	
	// gather list items and statuses
	var $li = $(evt.target).closest('li');
	var $lis = $(evt.target).closest('[role="tree"]').find('li').not( '.' + this.classes.closed + ' li');
	var $li_index = $lis.index($li[0]);
	var $prev_li = $li_index > 0 ? $lis.eq( $li_index-1 ) : false;
	var $next_li = $li_index+1 < $lis.length ? $lis.eq( $li_index+1 ) : false;
	var isOpen = $li.hasClass( this.classes.open );
	var isClosed = $li.hasClass( this.classes.closed );
	var toggleable = isOpen || isClosed;
	
	
	// left: close it up (and stop)
	if ( evt.keyCode === 37 && toggleable && isOpen ) {
	  this.toggle( $li, 'close' );
	  return;
	}
	
	// right: open up! (and stop)
	if ( evt.keyCode === 39 && toggleable && isClosed ) {
	  this.toggle( $li, 'open' )
	  return;  
	}
	
	// up/left: do previous
	(evt.keyCode === 37 || evt.keyCode === 38) && $prev_li && $prev_li && this.set_focus( $prev_li );
	
	// down/right: do next
	(evt.keyCode === 39 || evt.keyCode === 40) && $next_li && $next_li && this.set_focus( $next_li );
		  
  }

}
  
Pnext_Tree.init();

})(window,window.jQuery)