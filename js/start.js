(function ($) {

	"use strict";

	/*---------------------------------------*/
	/*	NAVIGATION AND NAVIGATION VISIBLE ON SCROLL
	 /*---------------------------------------*/

	if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
		var msViewportStyle = document.createElement('style')
		msViewportStyle.appendChild(
			document.createTextNode(
				'@-ms-viewport{width:auto!important}'
			)
		)
		document.querySelector('head').appendChild(msViewportStyle)
	}


})(jQuery);