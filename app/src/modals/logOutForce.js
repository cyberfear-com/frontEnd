define(['react','app'], function (React,app) {
	return React.createClass({

		componentWillUnmount: function() {
		},
		componentDidMount: function() {
			this.handleClick('SubmitPass');
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
				case 'logOut':
					app.auth.logout();
					break;
                case 'downloadToken':
                   // var tokenAes = toAesToken(keyA, token);
                   // var tokenAesHash = SHA512(tokenAes);

                    var name=app.user.get('email');
                    var toFile=app.user.get('downloadToken');

                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:attachment/plain;charset=utf-8,' + toFile);
                    element.setAttribute('download', name+'.key');

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
			return (
				<div className="modal fade" id="logoutModal">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title">Update Completed.</h4>
							</div>
							<div className="modal-body">
							<p>
							Your account was successfully updated.<br/><br/>
                                Please download user token, which will help you to reset your password. You also, can download it later in settings panel. Under Password tab.
                                <br/>Please log back in.
								</p>

							</div>
							<div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={this.handleClick.bind(this, 'downloadToken')}>Download Token</button>
								<button type="button" className="white-btn" onClick={this.handleClick.bind(this, 'logOut')}>Sign Out</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});