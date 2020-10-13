define(['react', 'app'], function (React, app) {
	return React.createClass({

		componentWillUnmount: function () {},
		componentDidMount: function () {
			//this.handleClick('SubmitPass');
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			//app.user.set({id:10});
			switch (action) {
				case 'Ok':
					$('#infoModal').modal('hide');
					break;
			}
		},
		render: function () {
			return React.createElement(
				'div',
				{ className: 'modal fade', id: 'infoModal' },
				React.createElement(
					'div',
					{ className: 'modal-dialog modal-dialog-centered' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'modal-header' },
								React.createElement('h4', { className: 'modal-title', id: 'infoModHead' })
							),
							React.createElement(
								'div',
								{ className: 'modal-body' },
								React.createElement('p', { id: 'infoModBody' })
							),
							React.createElement(
								'div',
								{ className: 'modal-footer' },
								React.createElement(
									'button',
									{ type: 'button', className: 'dark-btn w-100 py-2', onClick: this.handleClick.bind(this, 'Ok') },
									'OK'
								)
							)
						)
					)
				)
			);
		}

	});
});