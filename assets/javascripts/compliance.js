// Documentation: https://www.osano.com/cookieconsent/documentation/javascript-api/
window.addEventListener("load", function(){
	window.cookieconsent.initialise({
		compliance: {
		 'opt-in': '<div class="cc-compliance cc-highlight"></div>'
		},
		elements: {
			dismiss: '<a aria-label="dismiss cookie message" role="button" tabindex="0" class="cc-btn cc-dismiss" onClick="location.reload()">I consent!</a>',
		},
		"palette": {
		    "popup": {
		      "background": "#222"
		    },
		    "button": {
		      "background": "#670506;"
		    }
		},
	  	"content": {
		    "message": "In order for this website to work properly some cookies are being used. By continuing to use the website after being presented with cookie information you consent to such use.",
		    "dismiss": "I consent!",
		    "href": "/cookieinfo"
	  	}
	})
});


