// as the page loads, call these scripts
jQuery(document).ready(function($) {
	/*
	Responsive jQuery is a tricky thing.
	There's a bunch of different ways to handle
	it, so be sure to research and find the one
	that works for you best.
	*/
	
	/* getting viewport width */
	var responsive_viewport = $(window).width();
    var responsive_viewport_h = $(window).height();
    //console.log(responsive_viewport, responsive_viewport_h);

    $('.pn-top-menu-container > ul').before('<div id="button-menu"><a>Menu</a></div>');

        $('#button-menu').click(function() {
        	$(this).toggleClass('active');
            $('.pn-top-menu-container > ul').toggleClass('useeme');
            //$('.pn-search').toggleClass('useeme');
        });
	
	
	/* if is above or equal to 768px */
	if (responsive_viewport >= 768) {
		
	}
	
	/* off the bat large screen actions */
	if (responsive_viewport > 1030) {
	
	}
	
	
	// add all your scripts here
	
 
}); /* end of as page load scripts */