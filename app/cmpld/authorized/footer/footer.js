define(['react'], function (React) {
	return React.createClass({
		handleClick: function (i) {
			switch (i) {
				case 'terms':
					Backbone.history.navigate("/TermsAndConditions", {
						trigger: true
					});
					break;
				case 'privacy':
					Backbone.history.navigate("/PrivacyPolicy", {
						trigger: true
					});
					break;
				case 'canary':
					Backbone.history.navigate("/Canary", {
						trigger: true
					});
					break;
				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;

				//default:
				//default code block
			}
		},
		render: function () {

			return React.createElement(
				'div',
				{ className: 'footer' },
				React.createElement(
					'div',
					{ className: 'text-align-center' },
					React.createElement(
						'span',
						{ className: 'txt-color-white' },
						'CyberFear \xA9 2023 - '
					),
					React.createElement(
						'a',
						{ href: '/terms.html', target: '_blank' },
						React.createElement(
							'span',
							{ className: 'txt-color-black' },
							'ToS'
						)
					),
					React.createElement(
						'a',
						{ href: 'privacy.html', target: '_blank' },
						React.createElement(
							'span',
							{ className: 'txt-color-black' },
							'Privacy Policy'
						)
					)
				)
			);
		}

	});
});