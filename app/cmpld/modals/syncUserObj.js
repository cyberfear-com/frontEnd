define(['react', 'app'], function (React, app) {
	return React.createClass({

		componentWillUnmount: function () {},
		componentDidMount: function () {

			app.userObjects.on('change', function () {
				this.forceUpdate();
			}.bind(this));
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			//app.user.set({id:10});

			//switch(i) {
			//case 'SubmitPass':
			//	break;

			//}
		},

		/**
   *
   * @returns {JSX}
   */
		render: function () {
			return React.createElement(
				'div',
				{ className: 'modal fade', id: 'userObjSync' },
				React.createElement(
					'div',
					{ className: 'modal-dialog modal-dialog-centered' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'div',
							{ className: 'modal-header' },
							React.createElement(
								'h4',
								{ className: 'modal-title', id: 'userSyncTitle' },
								'Fetching User Data'
							)
						),
						React.createElement(
							'div',
							{ className: 'modal-body' },
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'div',
									{ className: 'bs-example', 'data-example-id': 'progress-bar-with-label' },
									app.userObjects.get("modalText"),
									React.createElement(
										'div',
										{ className: 'progress' },
										React.createElement(
											'div',
											{ className: 'progress-bar', role: 'progressbar', 'aria-valuenow': '60', 'aria-valuemin': '0', 'aria-valuemax': '100',
												style: { width: app.userObjects.get("modalpercentage") + "%" } },
											app.userObjects.get("modalpercentage"),
											'%'
										)
									)
								)
							)
						)
					)
				)
			);
		}

	});
});