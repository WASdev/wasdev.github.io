/*!
 * download-overlay.js
 *
 * Copyright (c) Peter Yim & Lee Reamsnyder
 * 
 * Used to display the Terms and Conditions in an overlay for download
 * 
 * To enable an overlay term and condition page, use one of these css clases:
 * pn-dn-wlp-final, pn-dn-wlp-beta, pn-dn-wlp-ui-final, pn-dn-wlp-iwd-beta, pn-dn-wdt-beta, pn-dn-wamt-final
 * <a class="pn-dn-wlp-final" title="title_to_be_show_on_overlay" href="url_to_download_file">Download button text</a>
 *  OR
 * <a data-license="relative_path_to_licenses" title="title_to_be_show_on_overlay" data-terms="Text for just above the Accept buttons" href="url_to_download_file">Download button text</a>
 * 
 * 
 */ 

$(document).ready(function() {
	$('body').append('\
	<div id="pn-overlay-container" role="region" aria-labelledby="wasdev-title"> \
		<div id="pn-tc-form-wrap"> \
		<div id="pn-tc-form"> \
			<div style="clear:both"></div> \
			<table cellspacing="0" cellpadding="0" border="0" role="presentation" summary="" class="lotusTable blogsFixedTable"> \
			<tbody> \
			<tr class="lotusFirst"> \
				<!-- Entry title and info --> \
				<td class="min-h4-padding min-entry entryContentContainerTD blogsWrapText"> \
					<div class="ibm-anchor-pointer"><a name="download_license_wlp"></a></div><a id="download_license_wlp"></a> \
						<h4 id="wasdev-title" class="pn-h2"> \
							<span class="pn-tc-title">Agree to terms and download</span> \
						</h4> \
						<!-- User name, date, meta info --> \
						<!-- Entry content --> \
						<div id="css-entry"> \
							<p dir="ltr"> \
							Please review the license agreement for <span class="pn-tc-title"></span>. <label for="pn-lic-select">The license agreement is available in multiple languages</label>.</p> \
							<p dir="ltr"> \
							<select id="pn-lic-select" name="l" class="iform"> <!--LAP_LANG_OPTION_VALS --><option value="cs">Czech [cs]</option><option value="en" selected="selected">English [en]</option><option value="fr">French [fr]</option><option value="de">German [de]</option><option value="el">Greek [el]</option><option value="in">Indonesian [in]</option><option value="it">Italian [it]</option><option value="ja">Japanese [ja]</option><option value="ko">Korean [ko]</option><option value="lt">Lithuanian [lt]</option><option value="pl">Polish [pl]</option><option value="pt">Portuguese [pt]</option><option value="ru">Russian [ru]</option><option value="sl">Slovenian [sl]</option><option value="es">Spanish [es]</option><option value="zh">Simplified Chinese [zh]</option><option value="zh_TW">Traditional Chinese [zh_TW]</option><option value="tr">Turkish [tr] <!--END_LAP_LANG_OPTION_VALS --></option></select></p> \
							<p dir="ltr"> \
								&nbsp;</p> \
							<div dir="ltr"> \
							<iframe title="License" id="pn-lic" class="pn-tc-text-frame" width="100%" height="400px" src=""></iframe> \
							<p id="pn-download-terms-text"></p> \
							<p> \
								By clicking the "Accept and Download" button below you agree that you have had the opportunity to review the license and you agree to be bound by its terms. If you disagree, click "Cancel".</p> \
						</div> \
						<p dir="ltr" class="mts"> \
						<a id="pn-download-link" class="pn-btn pn-btn-ibm pn-size-tiny disabled" href="#">Retrieving license&hellip;</a> <a id="pn-download-cancel" style="margin-left: 30px; " href="#">Cancel</a></p> \
						<p dir="ltr"> \
						&nbsp;</p> \
						<div style="clear:both"></div> \
						<div style="clear:both;"></div> \
					</div> \
				</td> \
			</tr> \
			</tbody> \
			</table> \
		</div> \
		</div>\
	</div>');
	
	_resize_overlay = function() {
  		$('#pn-overlay-container').css( 'height', $(document).height() )
  	}
  	
	// style the overlay container
	_resize_overlay();
	
	// clicking the cancel button and the overlay area (note: excluding form area) closes the overlay
	$('#pn-download-cancel, #pn-overlay-container').click(function(e) {
		e.preventDefault();
		pn_license_reset();		
	});
	
	// the cancel click would get bubble down to the form. we don't want that if users click on anywhere in the
	// form, no cancellation. outside. we cancel the overlay
	$('#pn-tc-form-wrap').click(function(evt) {
		evt.stopPropagation();		
	});
	
	// clicking on the download button invokes the download
	$('#pn-download-link').click(function() {
		pn_agreeToLicense($(this).attr('href'));
		return false;
	});
	
	function pn_showLicense(anchor, path) {
		// grab the title attribute in anchor and apply it to the overlay heading
		var title = anchor.attr('title'),
			terms_text = anchor.attr('data-terms') || ''; // if undefined, set to empty string
		
		$('.pn-tc-title').text( title ? title : 'Download' );
		$('#pn-download-terms-text').text( terms_text );
		
		// grab the donwload link from anchor and apply it to the download button on the overlay page
		$('#pn-download-link').attr('href',anchor.attr('href'));
		
		// change the select onchange value 
		var select = $('#pn-lic-select');
		
		pn_licenseLanguageSelected(select[0], path); // default on overlay load
		
		// attach a change even to the select so that the t&c for the selected language is loaded
		select.change(function() {
			pn_licenseLanguageSelected(this, path);
		});
	
		// show overlay
		$('#pn-overlay-container').show();
		_place_modal();
	}
		
	// attach an onclick event on every anchor that has a download and requires t&c before download
	$('a[data-license], a.pn-dn-wlp-final, a.pn-dn-wlp-beta, a.pn-dn-wlp-ui-final, a.pn-dn-wlp-iwd-beta, a.pn-dn-wdt-beta, a.pn-dn-wamt-final').each(function(){ 
		$(this).click(function(evt) { 
			var anchor = $(this);
			var path = anchor.attr('data-license');
			
			// legacy hard-coded license file locations
			if ( ! path && anchor.hasClass('pn-dn-wlp-final')) {
				path = 'wlp/8.5/lafiles';
			} else if (anchor.hasClass('pn-dn-wlp-beta')) {
				path = 'wlp/8.5.next.beta2/lafiles';
			} else if (anchor.hasClass('pn-dn-wlp-ui-final')) {
				path = 'wlp-ui/tp3/lafiles';
			} else if (anchor.hasClass('pn-dn-wlp-iwd-beta')) {
				path = 'wlp-iwd/8.5.next.beta2/lafiles';
			} else if (anchor.hasClass('pn-dn-wdt-beta')) {
				path = 'wdt/next/lafiles';
			} else if (anchor.hasClass('pn-dn-wamt-final')) {
				path = 'wamt-config/tp/lafiles';
			}
			
			// Only show if you have a path
			path && pn_showLicense(anchor, path);
			
			// Use preventDefault instead of return false
			// allows the click to bubble up the DOM for other events, like analytics event tracking
			evt.preventDefault();
			
		});
	});
	
	// Until the iframe completes loading, keep the download button disabled.
	// When it completes, re-activate and update the text
	// Resolves #91649
	$('#pn-lic').on('load', function(){
		
		// Mozilla fires this as soon as the iframe appears.
		// Return if the src doesn't have public.dhe.ibm.com
		if ( this.src.indexOf('public.dhe.ibm.com') === -1 ) {
			return;
		}
		
		$('#pn-download-link')
			.removeClass('disabled')
			.text('Accept and download');
	});
	
	// global functions
	pn_licenseLanguageSelected = function(select, laFiles) { 
	   // disable the download button
	   // see #91649
	   $('#pn-download-link')
			.addClass('disabled')
			.html('Retrieving license&hellip;');
	   
	   document.getElementById("pn-lic").src = "//public.dhe.ibm.com/ibmdl/export/pub/software/websphere/wasdev/downloads/" + laFiles + "/" + select.value + ".html";
	}
	
	pn_agreeToLicense = function(download) {
	    
	    var loc = "//public.dhe.ibm.com/ibmdl/export/pub/software/websphere/wasdev/downloads/" + download;
	    
	    // Need to tack on Stack Overflow campaign query strings
	    // The 2 query params are S_PKG and S_TACT
	    // resolves #107268
	    if ( window.location.search ) {
	    
        var validQueryParams = ['S_PKG', 'S_TACT'];

	      // split the query string into an array of params
	      // reject any values that aren't S_PKG=something or S_TACT=else
	      var queryList = $.map( window.location.search.slice(1).split('&'), function(str) {
	        return $.inArray( str.split('=').shift(), validQueryParams ) !== -1 ? str : null;
	      });
	      
	      loc = loc + '?' + queryList.join('&');
	    }
	    
	    // Download the linked file
	    window.open("//public.dhe.ibm.com/ibmdl/export/pub/software/websphere/wasdev/downloads/" + download, "_self");
	    
	    pn_license_reset();
  	}
  	
  	pn_license_reset = function() {
  		$('#pn-overlay-container').hide();
  	}
  	
  	_place_modal = function() {
  		var modal = $('#pn-tc-form-wrap').css({'top': 'auto', 'bottom': 'auto'}), // resets positions
  			scrollTop = $(window).scrollTop(),
  			doc_height = $(document).height(),
  			modal_height = modal.height(),
  			top = 50,
  			property = 'top',
  			val = scrollTop + top;
  		
  		// Issue 1: modal is too big for the entire document. Rare.
  		if ( (modal_height + top) > doc_height ) {
  			/* Ugly but effective solution: Make document bigger */
  			$('body').css('min-height',  modal_height + top*2 + 'px');
  			_resize_overlay();
  		}
  		
  		// Issue 2: Modal can fit in entire document, but will appear below doc if placed from top of window position
  		if ( ( scrollTop + top*2 + modal_height) > doc_height ) {
  		
  			// Solution: set from the bottom
  			property = 'bottom';
  			val = top;
  		}
  		
  		// And place the modal
  		modal.css(property, val);
  		
  	}
});
