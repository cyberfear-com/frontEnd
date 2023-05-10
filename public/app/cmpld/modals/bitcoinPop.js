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
				case 'Ok':
					$('#bitcoinModal').modal('hide');
					break;
			}
		},
		render: function () {
			return React.createElement(
				'div',
				{ className: 'modal fade', id: 'bitcoinModal' },
				React.createElement(
					'div',
					{ className: 'modal-dialog' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'div',
							{ className: 'modal-header' },
							React.createElement('h4', { className: 'modal-title', id: 'infoModHead' })
						),
						React.createElement(
							'div',
							{ className: 'modal-body' },
							React.createElement(
								'p',
								{ id: 'bitcoinModBody' },
								React.createElement('iframe', { id: 'coinbase_inline_iframe_ce6d05a94798d7ac6641a79b64225f42', src: 'https://www.coinbase.com/checkouts/ce6d05a94798d7ac6641a79b64225f42/inline?c=44434', style: { width: "460px", height: "350px", border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }, allowtransparency: 'true', frameborder: '0' })
							)
						),
						React.createElement(
							'div',
							{ className: 'modal-footer' },
							React.createElement(
								'button',
								{ type: 'button', className: 'white-btn', onClick: this.handleClick.bind(this, 'Ok') },
								'OK'
							)
						)
					)
				)
			);
		}

	});
});