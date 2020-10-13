define(['react', 'app'], function (React, app) {

	return React.createClass({

		componentDidMount: function () {
			$('#askforPass').on('shown.bs.modal', function () {
				$('#askPasInput').focus();
				//$( "#askPasSub" ).trigger( "click" ); //todo remove for dev
			});

			$('#askforPass').on('hide.bs.modal', function (event) {
				//console.log('off');
				$('#askPasSub').off('click');
			});
			//$('#askPasInput').focus();
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			//app.user.set({id:10});
			switch (action) {
				case 'cancel':
					$('#askforPass').modal('hide');
					break;
				case 'enterPass':
					if (event.keyCode == 13) {
						$("#askPasSub").trigger("click");
					}

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
				{ className: 'modal fade', id: 'askforPass', onKeyDown: this.handleClick.bind(this, 'enterPass') },
				React.createElement(
					'div',
					{ className: 'modal-dialog modal-dialog-centered' },
					React.createElement(
						'div',
						{ className: 'modal-content' },
						React.createElement(
							'button',
							{ type: 'button', className: 'close float-right', 'data-dismiss': 'modal', onClick: this.handleClick.bind(this, 'cancel'), id: 'askPasCancel' },
							React.createElement(
								'span',
								{ 'aria-hidden': 'true' },
								'\xD7'
							)
						),
						React.createElement(
							'div',
							{ className: 'row' },
							React.createElement(
								'div',
								{ className: 'col-12 text-center heading', style: { marginBottom: "20px" } },
								React.createElement('img', { src: 'img/password.svg', height: '25' }),
								React.createElement('br', null),
								React.createElement(
									'h8',
									{ id: 'askPassHeader' },
									'Provide Second Password'
								)
							),
							React.createElement(
								'div',
								{ className: 'form-group' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement('input', { type: 'password', id: 'askPasInput', className: 'form-control', placeholder: 'password' })
								),
								React.createElement('div', { id: 'infoPass' })
							),
							React.createElement(
								'div',
								{ className: 'modal-footer' },
								React.createElement(
									'button',
									{ type: 'button', className: 'dark-btn w-100 py-2', autoFocus: true, id: 'askPasSub' },
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