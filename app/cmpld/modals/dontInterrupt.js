define(['react', 'app'], function (React, app) {
	return React.createClass({

		componentDidMount: function () {
			$('#dntInter').on('hide.bs.modal', function (e) {
				$('#dntOk').off('click');
			});
		},

		render: function () {
			return React.createElement(
				'div',
				{ className: 'modal fade', id: 'dntInter' },
				React.createElement(
					'div',
					{ className: 'modal-dialog' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'div',
							{ className: 'modal-header' },
							React.createElement('h4', { className: 'modal-title', id: 'dntModHead' })
						),
						React.createElement(
							'div',
							{ className: 'modal-body' },
							React.createElement('p', { id: 'dntModBody' })
						),
						React.createElement(
							'div',
							{ className: 'modal-footer' },
							React.createElement(
								'button',
								{ type: 'button', className: 'btn btn-primary', id: 'dntOk' },
								'Cancel'
							)
						)
					)
				)
			);
		}

	});
});