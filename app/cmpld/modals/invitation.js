define(['react'], function (React) {
	return React.createClass({

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			switch (action) {
				case 'requestInvitation':
					requestInvitiation();
					break;
				case 'enterRequestInvitation':
					if (event.keyCode == 13) {
						requestInvitiation();
					}
					break;
			}
		},
		render: function () {

			return React.createElement(
				'div',
				{ className: 'modal fade bs-example-modal-sm', id: 'reqInvite', tabIndex: '-1', role: 'dialog', 'aria-hidden': 'true' },
				React.createElement(
					'div',
					{ className: 'modal-dialog modal-md' },
					React.createElement(
						'div',
						{ className: 'modal-content', onKeyDown: this.handleClick.bind(this, 'enterRequestInvitation') },
						React.createElement(
							'h4',
							{ className: 'dark-text form-heading' },
							'Request Invitation'
						),
						React.createElement(
							'div',
							{ className: 'registration-form smart-form', id: 'request-invitiation' },
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement('input', { className: 'form-control input-lg', placeholder: 'Enter contact email', name: 'email', id: 'inviteemail', type: 'text' })
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'button',
									{ id: 'reguser', className: 'dark-btn w-100 py-2 standard-button', type: 'button', onClick: this.handleClick.bind(this, 'requestInvitation') },
									'Submit'
								)
							)
						)
					)
				)
			);
		}

	});
});