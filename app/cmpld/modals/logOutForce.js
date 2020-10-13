define(['react', 'app'], function (React, app) {
	return React.createClass({

		componentWillUnmount: function () {},
		componentDidMount: function () {
			this.handleClick('SubmitPass');
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			//app.user.set({id:10});
			switch (action) {
				case 'logOut':
					app.auth.logout();
					break;
				case 'downloadToken':
					// var tokenAes = toAesToken(keyA, token);
					// var tokenAesHash = SHA512(tokenAes);

					var name = app.user.get('email');
					var toFile = app.user.get('downloadToken');

					var element = document.createElement('a');
					element.setAttribute('href', 'data:attachment/plain;charset=utf-8,' + toFile);
					element.setAttribute('download', name + '.key');

					element.style.display = 'none';
					document.body.appendChild(element);

					element.click();

					// window.open('data:attachment/csv;charset=utf-8,' + encodeURI(toFile));


					document.body.removeChild(element);

					break;
			}
		},
		/**
   *
   * @returns {JSX}
   */
		render: function () {
			return React.createElement(
				'div',
				{ className: 'modal fade', id: 'logoutModal' },
				React.createElement(
					'div',
					{ className: 'modal-dialog' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'div',
							{ className: 'modal-header' },
							React.createElement(
								'h4',
								{ className: 'modal-title' },
								'Update Completed.'
							)
						),
						React.createElement(
							'div',
							{ className: 'modal-body' },
							React.createElement(
								'p',
								null,
								'Your account was successfully updated.',
								React.createElement('br', null),
								React.createElement('br', null),
								'Please download user token, which will help you to reset your password. You also, can download it later in settings panel. Under Password tab.',
								React.createElement('br', null),
								'Please log back in.'
							)
						),
						React.createElement(
							'div',
							{ className: 'modal-footer' },
							React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-success', onClick: this.handleClick.bind(this, 'downloadToken') },
								'Download Token'
							),
							React.createElement(
								'button',
								{ type: 'button', className: 'white-btn', onClick: this.handleClick.bind(this, 'logOut') },
								'Sign Out'
							)
						)
					)
				)
			);
		}

	});
});