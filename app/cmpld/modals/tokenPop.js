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
					$('#tokenModal').modal('hide');

					Backbone.history.navigate("/mail/Inbox", {
						trigger: true
					});

					break;
				case 'downloadToken':

					var toFile = app.user.get('downloadToken');

					var element = document.createElement('a');
					element.setAttribute('href', 'data:attachment/plain;charset=utf-8,' + toFile);
					element.setAttribute('download', 'secretToken.key');

					element.style.display = 'none';
					document.body.appendChild(element);

					element.click();

					// window.open('data:attachment/csv;charset=utf-8,' + encodeURI(toFile));


					document.body.removeChild(element);

					/*       // var tokenAes = toAesToken(keyA, token);
            // var tokenAesHash = SHA512(tokenAes);
              var oMyBlob = new Blob([toFile], {type:'text/html'});
            var toFile=app.user.get('downloadToken');
              var a = document.createElement('a');
            a.href = window.URL.createObjectURL(oMyBlob);
              var name=app.user.get('email');
            a.download = 'secretToken.key';
              document.body.appendChild(a);
            a.click();
     */
					break;
				case 'login':
					$('#tokenModal').modal('hide');
					$('#loginUser').modal('show');
					break;
			}
		},
		render: function () {
			return React.createElement(
				'div',
				{ className: 'modal fade', id: 'tokenModal', 'data-backdrop': 'static' },
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
								'button',
								{ type: 'button', className: 'close float-right', 'data-dismiss': 'modal', onClick: this.handleClick.bind(this, 'Ok') },
								React.createElement(
									'span',
									{ 'aria-hidden': 'true' },
									'\xD7'
								)
							),
							React.createElement(
								'div',
								{ className: 'modal-header' },
								React.createElement('h4', { className: 'modal-title', id: 'tokenModHead' })
							),
							React.createElement(
								'div',
								{ className: 'text-center', style: { fontSize: "13px", fontFamily: 'Rodus-Square', fontWeight: "500", marginTop: "10px" } },
								React.createElement('p', { id: 'tokenModBody' })
							),
							React.createElement(
								'a',
								{ className: 'dark-btn w-100 py-2', style: { fontSize: "14px", fontFamily: 'Rodus-Square', padding: "9px 30px", width: "100%" }, download: 'secret.key', id: 'tokenFile', type: 'button', onClick: this.handleClick.bind(this, 'downloadToken') },
								' Download Token'
							),
							React.createElement(
								'div',
								{ className: 'text-left', style: { fontSize: "13px", fontFamily: 'Rodus-Square', fontWeight: "500", marginTop: "10px" } },
								React.createElement(
									'p',
									{ style: { marginTop: "50px" } },
									'Once downloaded, please log in.'
								)
							),
							React.createElement(
								'a',
								{ className: 'nav-link dark-btn-menu', onClick: this.handleClick.bind(this, 'login') },
								'Login'
							)
						)
					)
				)
			);
		}

	});
});