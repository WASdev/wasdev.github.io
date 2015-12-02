// --------------------------
//  Catch console.log errors 
//  You're welcome, everyone
// --------------------------
if (typeof console == "undefined") {
    window.console = {
        log: function () {}
    };
}

(function(w,$){

if ( ! $ ) return;

  // ------------------------------------------------------------------
  // Google Analytics Events tracking
  // add attributes data-analytics-category="something" and data-analytics-action=""
  // 
  // Optional attributes: data-analytics-label (str), data-analytics-value (int), data-analytics-nonInteraction (bool)
  // see: 
  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  // ------------------------------------------------------------------
  $('body').on('click', 'a[data-analytics-category][data-analytics-action]', function(e){
    
    if ( ! window.ga )
      return;
    
    // for links to external sources, we need a tiny delay
    // 200ms is about right for enough time
    // for the analytics push to happen before unload
    if (this.hostname && this.hostname !== location.hostname) {
      e.preventDefault();
      
      // setTimeout callback is called in the window scope, so cache the url now
      var url = this.href;
      
      setTimeout(function(){
        document.location = url;        
      },200);
    }
    
    var $el = $(this),
        data = {'hitType': 'event'}; // make a new object 
    
    // category (required string)
    data['eventCategory'] =  $el.attr('data-analytics-category');
    
    // action (required string)
    data['eventAction'] = $el.attr('data-analytics-action');
    
    // label (optional string)
    if ( $el.attr('data-analytics-label') )
      data['eventLabel'] = $el.attr('data-analytics-label');

    // value (optional int)
    if ( $el.attr('data-analytics-value') )
      data['eventValue'] = parseInt( $el.attr('data-analytics-value') );

    // You could have multiple trackers active
    // Send the event to each
    $.each( ga.getAll(), function(i, tracker){

      // push to each tracker by name
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#multipletrackers
      ga( tracker.get('name')+'.send', data );
      
    });
    
  });

  
  
  // ------------------------------------------------------------------
  // Basic function to allow one element to send focus to another
  // Example: Click a link to focus the global Search element
  // Usage: <a href="#" data-focus="id_of_element_to_focus">Search?</a>
  // ------------------------------------------------------------------

  $('a').filter('[data-focus]').on('click', function(e){
  
    e.preventDefault();
  
    var target = $(this).attr('data-focus');
  
    $('#' + target.replace('#','') ).first().focus();
  
  });
  
  
  // ------------------------------------------------------------------
  // Find external links in link lists (Docs) and add a class (see style.css)
  // resolves 94406
  // ------------------------------------------------------------------
  $('.pn-title-list').find('a').filter(function(){
    return this.hostname && this.hostname !== location.hostname;
  }).addClass('pn-external-link');
  
  
  
  // ------------------------------------------------------------------
  // Equalize arbitrary heights
  // Set .equal-height on the parent, and then .equalize on the appropriate children
  // Pro-tip: the ones with the background color are the ones to .equalize
  // ------------------------------------------------------------------
  
  $.fn.equalize_heights = function( children_selector ){
    if ( ! children_selector  )
      return;
    
    var min = 0;
    
    $(this).find( children_selector ).each( function(){
      var h = $(this).height();
      min = h > min ? h : min;
    }).css( 'min-height', min );
    
    return this;
  };
  
  $('.equal-height').equalize_heights('.equalize');
  

  // ------------------------------------------------------------------
  // Maintain proper fluid aspect ratios of embedded content
  // 
  // technique adopted from http://alistapart.com/article/creating-intrinsic-ratios-for-video
  //   and http://www.netmagazine.com/tutorials/create-fluid-width-videos
  // ------------------------------------------------------------------

  $('iframe[src*="youtube"], iframe[src*="vimeo"]')
    .not('.no-resize, .noresize') // fixes #95671
    .each(function(){
  
      var aspectRatio = this.height / this.width,
        $el = $(this);

      /*
        (1) wrap the element in the required wrapper element
        (2) add a class to the element too (simplifies the required CSS)
        (3) remove height/width attributes (to enable fluid layout)
        (4) remove style attributes to make sure people don't mess with it
      */
      $el.wrap('<div class="pn-fluid-embed-wrap"></div>') // (1)
        .addClass('pn-fluid-embed') // (2)
        .removeAttr('height') // (3)
        .removeAttr('width') // (3)
        .removeAttr('style'); // (4)
     
      /*
        The wrapper element class gives us a default aspect ratio of 16:9
        But let's set it based on the video's original aspect ratio
      */
      $el.parent().css('padding-bottom', (aspectRatio || 0.5625) * 100 + '%')

    });
  
  
  // ------------------------------------------------------------------
  // Add a label to <select>-driven dropdowns
  // No other good way to do this: WP core doesn't let you modify stock widgets that easily
  // ------------------------------------------------------------------
  
  $('.widget_archive').each(function(i){
    var $widget = $(this),
        id = 'pnext-archives-' + i,
        $select = $widget.find('select');
    
    if ( $select.length === 0 )
      return;

    // add ID to the select
    $select.attr('id', id);
    
    // wrap the title in a label
    $widget.find('h1, h2, h3, h4, h5, h6').first().html( function(j, old ) {
      return '<label for="'+ id +'">' + old + '</label>';
    });
  });
  
  
  // ------------------------------------------------------------------
  // Add a very generic title="" attribute to iframes, if absent
  // see: https://rptbp1.austin.ibm.com/ase/services/spscan/help/wcag20-tech-h64-frameHasTitle.htm
  // ------------------------------------------------------------------
  
  $(document).ready(function(){
    $('iframe').not('[title]').each(function(){
      var link = document.createElement('a')
      link.href = this.src;
      $(this).attr('title','Content from ' + link.hostname);
    });  
  });
  

  // ------------------------------------------------------------------
  // Add Bluemix campaign codes to any bluemix.net url
  // ------------------------------------------------------------------
  $(document).ready(function(){
    var slug = $.map( document.location.pathname.split('/'), function(segment){ return segment || null } )[0];
  
    var slug_exceptions = ['[href*="/docs"]',
                           '[href*="mailto"]',
                           '[href*="bluemixalchemy"]',
                           '[href*="regbar"]',
                           '[href*="mybluemix"]'
                          ];
    
    $('a[href*="bluemix.net"]').not(slug_exceptions.join(',')).each(function() {
    // $('a[href*="bluemix.net"]').not('[href*="/docs"]').not('[href*="mailto"]').not('[href*="bluemixalchemy"]').not('[href*="regbar"]').each(function(){
      var 
        newHref = this.origin + this.pathname,
        queryStringObj = {};
    
      // if there are already query parameters, store them
      if (this.search) {
        // ugh IE8 doesn't have [].map or [].reduce ( . _ .)
        $.each( decodeURIComponent(this.search).replace(/(^\?)/,'').split("&"), function(index, value) {
          var pair = value.split('=');
          queryStringObj[ pair[0] ] = pair[1];
        });
      }
    
      // add or modify the cm_mmc param
      queryStringObj['cm_mmc'] = 'developerWorks-_-dWdevcenter-_-'+ slug +'-_-lp';
    
      // convert the object into a query string and tack it on
      newHref += '?'+$.param(queryStringObj);
    
      // restore the #hash if there
      if (this.href.search(/#/) > -1) {
        // apparently need to account for empty hashes, like docs.bluemix.net/#
        newHref += '#' + this.hash.replace(/^#/,'');
      }
    
      $(this).attr('href', newHref);
    
    });
  });

  
})(window, window.jQuery)
