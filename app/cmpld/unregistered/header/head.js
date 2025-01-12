define(['react', 'app'], function (React, app) {
	return React.createClass({

		componentDidMount: function () {
			var thisComp = this;
			app.user.on("change:onlineStatus", function () {
				thisComp.forceUpdate();
			});
		},

		handleClick: function (i) {
			$(".navbar-toggle").click();

			switch (i) {

				case 'restartQue':
					app.serverCall.restartQue();
					break;

				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;

				case 'login':
					$('#loginUser').modal('show');
					break;

				case 'signUp':
					$('#createAccount-modal').modal('show');
					break;

			}
		},
		//forceUpdate: function (){


		//}.

		componentDidUpdate: function () {

			$('[data-toggle="popover-hover"]').popover({ trigger: "hover", container: 'body', html: true });
		},

		render: function () {
			//console.log(this);

			if (app.user.get("onlineStatus") == 'offline') {
				var offlineClass = "";
			} else {
				var offlineClass = "hidden";
			}

			return React.createElement(
				'nav',
				{ className: 'navbar navbar-fixed-top navbar-default authnavigation', id: 'menus' },
				React.createElement(
					'div',
					{ className: 'navbar-header' },
					React.createElement(
						'button',
						{ className: 'navbar-toggle collapsed', type: 'button', 'data-toggle': 'collapse',
							'data-target': '#navbarResponsive1', 'aria-controls': 'navbarResponsive',
							'aria-expanded': 'false', 'aria-label': 'Toggle navigation' },
						'MENU'
					),
					React.createElement(
						'a',
						{ className: 'navbar-brand', onClick: this.handleClick.bind(this, 'inbox') },
						React.createElement('img', { className: 'logoname', src: '/img/logo/logo.svg', alt: '' })
					),
					React.createElement(
						'div',
						{ className: "pull-right " + offlineClass, id: 'connectionError' },
						React.createElement(
							'button',
							{ className: 'btn btn-default button-noborder', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'The system experienced a connection problem. Please reload the page. If the problem persists, please contact us.', 'data-original-title': 'Connection Error', onClick: this.handleClick.bind(this, 'restartQue') },
							React.createElement('i', { className: 'fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red' })
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'collapse navbar-collapse', id: 'navbarResponsive1' },
					React.createElement(
						'ul',
						{ className: 'nav navbar-nav navbar-right menus' },
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ href: '/features.html' },
								'Premium Features'
							)
						),
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ className: 'nav-link dark-btn-menu', href: '/index.html#login' },
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
						)
					),
					React.createElement(
						'div',
						{ className: "pull-right " + offlineClass, id: 'connectionError' },
						React.createElement(
							'button',
							{ className: 'btn btn-default button-noborder', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'The system experienced a connection problem. Please reload the page. If the problem persists, please contact us.', 'data-original-title': 'Connection Error', onClick: this.handleClick.bind(this, 'restartQue') },
							React.createElement('i', { className: 'fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red' })
						)
					)
				)
			);
		}
	});
});