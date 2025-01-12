define(['react'], function (React) {
	return React.createClass({
		handleClick: function (i) {
			switch (i) {
				case 'login':
					$('#loginUser').modal('show');
					break;

				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;
				case 'requestInvitation':
					$('#reqInvite').modal('show');
					break;
				case 'signUp':
					$('#createAccount-modal').modal('show');
					break;
				case "donate":
					$('html, body').animate({
						scrollTop: $("#donateUs").offset().top
					}, 1000);

					break;

			}
		},
		render: function () {

			return React.createElement(
				'nav',
				{ className: 'navbar', id: 'menu' },
				React.createElement(
					'div',
					{ className: 'container-fluid' },
					React.createElement(
						'div',
						{ className: 'navbar-header' },
						React.createElement(
							'button',
							{ className: 'navbar-toggle collapsed', type: 'button', 'data-toggle': 'collapse',
								'data-target': '#navbarResponsive', 'aria-controls': 'navbarResponsive',
								'aria-expanded': 'false', 'aria-label': 'Toggle navigation' },
							'MENU'
						),
						React.createElement(
							'a',
							{ className: 'navbar-brand', href: 'index.html' },
							React.createElement('img', { src: 'img/logo.svg', className: 'logo' })
						)
					),
					React.createElement(
						'div',
						{ className: 'collapse navbar-collapse', id: 'navbarResponsive' },
						React.createElement(
							'ul',
							{ className: 'nav navbar-nav navbar-right' },
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: 'features.html' },
									'About'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ onClick: this.handleClick.bind(this, 'reportBug') },
									'Contact Us'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: 'pricing.html' },
									'Pricing'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ className: 'nav-link dark-btn-menu', onClick: this.handleClick.bind(this, 'login') },
									'Login'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ className: 'nav-link white-btn-menu', href: 'https://mailum.com/mailbox/#signup' },
									'Sign Up'
								)
							),
							React.createElement(
								'li',
								{ className: 'visible-xs-block' },
								React.createElement(
									'button',
									{ className: 'navbar-toggle collapsed', type: 'button', 'data-toggle': 'collapse',
										'data-target': '#navbarResponsive', 'aria-controls': 'navbarResponsive',
										'aria-expanded': 'false', 'aria-label': 'Toggle navigation' },
									'X'
								)
							)
						)
					)
				)
			);
		}

	});
});