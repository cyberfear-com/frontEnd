define(['react', 'app'], function (React, app) {
	return React.createClass({
		getInitialState: function () {
			return {
				newVersion: false
			};
		},

		componentDidMount: function () {
			var thisComp = this;
			app.user.on("change:timeLeft", function () {
				thisComp.forceUpdate();
			});

			app.user.on("change:onlineStatus", function () {
				thisComp.forceUpdate();
			});

			app.user.on("change:onlineStatus", function () {
				thisComp.forceUpdate();
			});

			app.user.on("change:pleaseUpdate", function () {
				if (app.user.get('pleaseUpdate')) {
					thisComp.setState({
						newVersion: true
					});
				}
				thisComp.forceUpdate();
			});
		},

		removeClassesActive: function () {
			$('#folderul>li').removeClass('active');
			$('#folderulcustom>li').removeClass('active');
		},

		handleClick: function (i) {

			switch (i) {

				case 'refreshBrowser':

					$('#dialogModHead').html("New Version Available");
					$('#dialogModBody').html("By clicking OK, system will refresh your browser and you will be asked to login again. <br/> Please finish your current task and click OK, or logout and hard refresh your browser");

					$('#dialogOk').on('click', function () {
						location.reload(true);
					});

					$('#dialogPop').modal('show');

					break;

				case 'restartQue':
					app.serverCall.restartQue();
					break;
				case 'gotoInbox':
					app.mixins.canNavigate(function (decision) {
						if (decision) {
							Backbone.history.navigate("/mail/Inbox", {
								trigger: true
							});
						}
					});

					break;

				case 'inbox':
					var thisComp = this;
					app.mixins.canNavigate(function (decision) {

						if (decision) {
							$('#mMiddlePanelTop').removeClass(' hidden-xs hidden-sm hidden-md');
							var folder = app.user.get('folders')[app.user.get('systemFolders')['inboxFolderId']]['name'];
							thisComp.removeClassesActive();
							//console.log($(event.target).attr('id'));

							Backbone.history.navigate("/mail/" + app.transform.from64str(folder), {
								trigger: true
							});
							app.user.set({ "resetSelectedItems": true });

							app.globalF.resetCurrentMessage();
							app.globalF.resetDraftMessage();

							thisComp.props.changeFodlerId(app.user.get('systemFolders')['inboxFolderId']);
							$('#' + app.user.get('systemFolders')['inboxFolderId']).parents('li').addClass('active');

							$('#mMiddlePanel').scrollTop(0);
							$('#selectAll>input').prop("checked", false);

							app.layout.display('viewBox');
						}
					});

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

				case 'settings':
					app.mixins.canNavigate(function (decision) {
						if (decision) {
							Backbone.history.navigate("/settings/Profile", {
								trigger: true
							});
						}
					});

					$(".navbar-toggle").click();
					break;

				case 'gotoPayment':
					app.mixins.canNavigate(function (decision) {
						if (decision) {
							Backbone.history.navigate("/settings/Plan", {
								trigger: true
							});
						}
					});
					$(".navbar-toggle").click();
					break;
				case 'logOut':
					app.auth.logout();

					//Backbone.history.navigate("/logOut", {
					//	trigger : true
					//});
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
				'div',
				{ className: 'container' },
				React.createElement(
					'nav',
					{ className: 'navbar navbar-fixed-top navbar-default authnavigation' },
					React.createElement(
						'div',
						{ className: 'navbar-header' },
						React.createElement(
							'button',
							{ type: 'button', className: 'navbar-toggle collapsed', 'data-toggle': 'collapse', 'data-target': '#stamp-navigation' },
							React.createElement(
								'span',
								{ className: 'sr-only' },
								'Toggle navigation'
							),
							React.createElement('span', { className: 'icon-bar' }),
							React.createElement('span', { className: 'icon-bar' }),
							React.createElement('span', { className: 'icon-bar' })
						),
						React.createElement(
							'div',
							{ className: 'navbar-toggle collapsed pull-right no-border' },
							React.createElement(
								'span',
								{ className: "pull-left badge expirationBadge " + (app.user.get('timeLeft') < 100 ? "bg-color-red " : "bg-color-blueLight ") + (app.user.get('sessionExpiration') == -1 ? "hidden" : ""), title: 'Session will expire in ' + app.user.get('timeLeft') + ' sec' },
								app.user.get('timeLeft')
							)
						),
						React.createElement(
							'div',
							{ className: "navbar-toggle collapsed pull-right newVersion no-border " + (this.state.newVersion ? "" : "hidden") },
							React.createElement(
								'button',
								{ className: 'btn btn-warning btn-xs', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'New version released. Please logout, and refresh browser', 'data-original-title': 'New Version', onClick: this.handleClick.bind(this, 'refreshBrowser') },
								'New Verison'
							)
						),
						React.createElement(
							'div',
							{ className: "navbar-toggle collapsed pull-right connectionError  no-border " + offlineClass },
							React.createElement(
								'button',
								{ className: 'button', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'The system experienced a connection problem. Please click here to reconnect. If the problem persists, please contact us.', 'data-original-title': 'Connection Error', onClick: this.handleClick.bind(this, 'restartQue') },
								React.createElement('i', { className: 'fa fa fa-bell vibrate fa-lg fa-fw txt-color-red' })
							)
						),
						React.createElement(
							'a',
							{ className: 'navbar-brand', onClick: this.handleClick.bind(this, 'inbox') },
							React.createElement('img', { className: 'logoname', src: '/img/logo/logo.svg', alt: '' })
						)
					),
					React.createElement(
						'div',
						{ className: 'navbar-collapse collapse', id: 'stamp-navigation' },
						React.createElement(
							'ul',
							{ className: 'nav navbar-nav pull-left' },
							React.createElement(
								'li',
								{ className: 'hidden' },
								React.createElement(
									'a',
									{ href: '/#reportBug', target: '_blank' },
									'Report Bug'
								)
							),
							React.createElement(
								'li',
								{ className: 'hidden-xs' },
								React.createElement(
									'a',
									{ onClick: this.handleClick.bind(this, 'gotoPayment') },
									'Premium Features'
								)
							)
						),
						React.createElement(
							'ul',
							{ className: 'nav navbar-nav desktop-menu pull-right' },
							React.createElement(
								'li',
								{ className: 'dropdown' },
								React.createElement(
									'a',
									{ href: '#', className: 'dropdown-toggle pull-left right-bar', 'data-toggle': 'dropdown', role: 'button', 'aria-expanded': 'false' },
									React.createElement(
										'span',
										{ className: "pull-left badge expirationBadge " + (app.user.get('timeLeft') < 100 ? "bg-color-red " : "bg-color-blueLight ") + (app.user.get('sessionExpiration') == -1 ? "hidden" : ""), title: 'Session will expire in ' + app.user.get('timeLeft') + ' sec' },
										app.user.get('timeLeft')
									),
									'\xA0Menu ',
									React.createElement('span', { className: 'caret' })
								),
								React.createElement(
									'ul',
									{ className: 'dropdown-menu', role: 'menu' },
									React.createElement(
										'li',
										null,
										React.createElement(
											'a',
											{ onClick: this.handleClick.bind(this, 'inbox') },
											React.createElement('i', { className: 'ion ion-ios-email-outline fa-fw' }),
											' Inbox'
										)
									),
									React.createElement(
										'li',
										null,
										React.createElement(
											'a',
											{ onClick: this.handleClick.bind(this, 'settings') },
											React.createElement('i', { className: 'ion ion-ios-settings-strong fa-2x text-inverse fa-fw' }),
											' Settings'
										)
									),
									React.createElement(
										'li',
										null,
										React.createElement(
											'a',
											{ href: '/index.html#contactUs', target: '_blank' },
											React.createElement('i', { className: 'ion ion-ios-help-outline fa-2x text-inverse fa-fw' }),
											' Help'
										)
									),
									React.createElement('li', { className: 'divider' }),
									React.createElement(
										'li',
										{ className: 'hidden-xs' },
										React.createElement(
											'a',
											{ onClick: this.handleClick.bind(this, 'logOut') },
											React.createElement('i', { className: 'ion ion-android-exit fa-fw' }),
											' Sign Out'
										)
									)
								)
							)
						),
						React.createElement(
							'ul',
							{ className: 'dropdown-menu hidden-lg hidden-md hidden-sm mobile-left', role: 'menu' },
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ onClick: this.handleClick.bind(this, 'inbox') },
									' Inbox'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ onClick: this.handleClick.bind(this, 'settings') },
									' Settings'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ href: '/index.html#contactUs', target: '_blank' },
									' Help'
								)
							)
						),
						React.createElement(
							'ul',
							{ className: 'dropdown-menu hidden-lg hidden-md hidden-sm mobile-right', role: 'menu' },
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ onClick: this.handleClick.bind(this, 'gotoPayment') },
									' Premium Features'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ onClick: this.handleClick.bind(this, 'logOut') },
									' Sign Out'
								)
							)
						),
						React.createElement(
							'div',
							{ className: "pull-right newVersion hidden-xs " + (this.state.newVersion ? "" : "hidden") },
							React.createElement(
								'button',
								{ className: 'btn btn-warning', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'New version is released. Please logout, and refresh you browser', 'data-original-title': 'New Version', onClick: this.handleClick.bind(this, 'refreshBrowser') },
								'New Verison Available'
							)
						),
						React.createElement(
							'div',
							{ className: "pull-right connectionError " + offlineClass },
							React.createElement(
								'button',
								{ className: 'btn btn-default button-noborder', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'The system experienced a connection problem. Please click here to reconnect. If the problem persists, please contact us.', 'data-original-title': 'Connection Error', onClick: this.handleClick.bind(this, 'restartQue') },
								React.createElement('i', { className: 'fa fa fa-bell vibrate fa-lg fa-fw txt-color-red' })
							)
						)
					)
				)
			);
		}
	});
});