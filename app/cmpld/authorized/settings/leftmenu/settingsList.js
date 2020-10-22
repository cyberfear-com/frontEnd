define(['react', 'app'], function (React, app) {
	return React.createClass({
		//getInitialState : function() {
		//return {
		//	setings:{profile:'active'}
		//};
		//},
		handleClick: function (i) {
			if (!app.user.get("inProcess")) {
				this.props.updateAct(i);

				switch (i) {
					case 'Profile':
						Backbone.history.navigate("/settings/Profile", {
							trigger: true
						});
						break;
					case 'Layout':
						Backbone.history.navigate("/settings/Layout", {
							trigger: true
						});
						break;

					case 'Password':
						Backbone.history.navigate("/settings/Password", {
							trigger: true
						});
						break;
					case 'Disposable-Aliases':
						Backbone.history.navigate("/settings/Disposable-Aliases", {
							trigger: true
						});
						break;
					case 'Custom-Domain':
						Backbone.history.navigate("/settings/Custom-Domain", {
							trigger: true
						});
						break;
					case '2-Step':
						Backbone.history.navigate("/settings/2-Step", {
							trigger: true
						});
						break;
					case 'Contacts':
						Backbone.history.navigate("/settings/Contacts", {
							trigger: true
						});
						break;
					case 'WebDiv':
						Backbone.history.navigate("/settings/WebDiv", {
							trigger: true
						});
						break;
					case 'PGP-Keys':
						Backbone.history.navigate("/settings/PGP-Keys", {
							trigger: true
						});
						break;

					case 'Filter':
						Backbone.history.navigate("/settings/Filter", {
							trigger: true
						});
						break;
					case 'BlackList':
						Backbone.history.navigate("/settings/Black-List", {
							trigger: true
						});
						break;
					case 'Folders':
						Backbone.history.navigate("/settings/Folders", {
							trigger: true
						});
						break;

					case 'Security-Log':
						Backbone.history.navigate("/settings/Security-Log", {
							trigger: true
						});
						break;
					case 'Coupon':
						Backbone.history.navigate("/settings/Coupons", {
							trigger: true
						});
						break;

					case 'Plan':
						Backbone.history.navigate("/settings/Plan", {
							trigger: true
						});
						break;

					case 'Delete-Account':
						Backbone.history.navigate("/settings/Delete-Account", {
							trigger: true
						});
						break;

				}
			} else {

				$('#infoModHead').html("Active Process");
				$('#infoModBody').html("Please cancel or wait until process is finished before go to the next page.");
				$('#infoModal').modal('show');

				//todo add cancel button
				console.log('no');
			}
		},
		render: function () {
			return React.createElement(
				'div',
				{ className: this.props.classes.leftClass, id: 'leftSettingPanel' },
				React.createElement(
					'ul',
					{ className: 'nav-settings' },
					React.createElement(
						'li',
						{ className: this.props.activeLink.profile },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Profile') },
							'Profile ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.layout + " hidden" },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Layout') },
							'Layout ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.password },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Password') },
							'Password ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.auth },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, '2-Step') },
							'Google Auth / Yubikey ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.disposable },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Disposable-Aliases') },
							'Aliases / Disposable Emails ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.domain },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Custom-Domain') },
							'Custom Domain ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.folders },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Folders') },
							'Folders / Labels ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.pgp },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'PGP-Keys') },
							'PGP Keys ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.contacts },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Contacts') },
							'Contacts ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.spam },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Filter') },
							'Email Filter ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.blackList },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'BlackList') },
							'Black / White List ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.coupon },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Coupon') },
							'Coupons',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.plan },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Plan') },
							'Paid Plan Features',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					),
					React.createElement(
						'li',
						{ className: this.props.activeLink.delete },
						React.createElement(
							'a',
							{ className: 'list-link js-nav', onClick: this.handleClick.bind(this, 'Delete-Account') },
							'Delete Account ',
							React.createElement('i', { className: 'fa fa-chevron-right' })
						)
					)
				)
			);
		}

	});
});