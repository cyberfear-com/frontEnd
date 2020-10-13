define(['react', 'app'], function (React, app) {
	return React.createClass({

		componentDidMount: function () {
			$('#dialogPop').on('hide.bs.modal', function (event) {
				$('#dialogOk').off('click');
			});
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			switch (action) {
				case 'cancel':
					$('#dialogPop').modal('hide');
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
				{ className: 'modal fade', id: 'dialogPop' },
				React.createElement(
					'div',
					{ className: 'modal-dialog' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'div',
							{ className: 'modal-header' },
							React.createElement('h4', { className: 'modal-title', id: 'dialogModHead' })
						),
						React.createElement(
							'div',
							{ className: 'modal-body' },
							React.createElement('p', { id: 'dialogModBody' })
						),
						React.createElement(
							'div',
							{ className: 'modal-footer', id: 'popBut' },
							React.createElement(
								'button',
								{ type: 'button', className: 'dark-btn w-100 py-2', id: 'dialogOk' },
								'OK'
							),
							React.createElement(
								'button',
								{ type: 'button', className: 'white-btn', id: 'dialogCancel', onClick: this.handleClick.bind(this, 'cancel') },
								'Cancel'
							)
						)
					)
				)
			);
		}

	});
});