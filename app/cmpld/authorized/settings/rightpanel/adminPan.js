define(['react', 'app', 'accounting'], function (React, app, accounting) {
	"use strict";

	return React.createClass({
		getInitialState: function () {
			return {
				lockEmail: true

			};
		},

		/**
   *
   * @param {string} action
   */
		handleClick: function (action) {
			switch (action) {
				case 'deleteAccount':

					break;
			}
		},
		render: function () {
			var rightClass = "Right col-xs-10 sRight";

			return React.createElement(
				'div',
				{ className: this.props.classes.rightClass, id: 'rightSettingPanel' },
				React.createElement(
					'div',
					{ className: 'col-md-6 col-sm-12 personal-info ' },
					React.createElement(
						'div',
						{ className: 'panel panel-danger' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'ul',
								{ className: 'nav nav-tabs tabbed-nav' },
								React.createElement(
									'li',
									{ role: 'presentation', className: 'active' },
									React.createElement(
										'a',
										null,
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Admin Panel'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'ion-trash-b' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-body' },
							React.createElement(
								'div',
								{ className: 'alert alert-warning', role: 'alert' },
								'All data including: emails, history of your account will be permanently destroyed. You will lose access and ability to receive new emails. ',
								React.createElement('br', null),
								React.createElement('br', null),
								' Available balace will be lost, as any record regarding your account will be destroyed. All existing email addresses will be held for retention to protect your privacy and prevent someone registering same email and receiving emails that may be addressed to you.'
							),
							React.createElement(
								'div',
								{ className: 'pull-right' },
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-danger', onClick: this.handleClick.bind(this, 'deleteAccount') },
									'Delete Account'
								)
							)
						)
					)
				)
			);
		}

	});
});