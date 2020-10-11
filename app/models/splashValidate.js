define([
	"app"
], function(app){

	var ValidateSplash = Backbone.Model.extend({

		url: '/feedback',

		defaults: {
			'email': '',
			'website': '',
			'feedback': ''
		},
		validate: function (attrs) {
			if (!attrs.email) {
				console.log('Please fill email field.');
				return 'Please fill email field.';
			}
			if (!attrs.feedback) {
				console.log('Please fill feedback field.');
				return 'Please fill feedback field.';
			}
		}

	});
	
	return ValidateSplash;
});