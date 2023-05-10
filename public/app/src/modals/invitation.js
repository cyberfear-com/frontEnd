define(['react'], function (React) {
	return React.createClass({

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'requestInvitation':
					requestInvitiation()
					break;
				case 'enterRequestInvitation':
					if(event.keyCode==13){
						requestInvitiation();
					}
					break;
			}
		},
		render: function () {

			return (
				<div className="modal fade bs-example-modal-sm" id="reqInvite" tabIndex="-1" role="dialog" aria-hidden="true">

					<div className="modal-dialog modal-md">
						<div className="modal-content" onKeyDown={this.handleClick.bind(this, 'enterRequestInvitation')}>
							<h4 className="dark-text form-heading">Request Invitation</h4>

							<div className="registration-form smart-form" id="request-invitiation">
								<div className="form-group">
										<input className="form-control input-lg" placeholder="Enter contact email"	name="email" id="inviteemail" type="text"/>
								</div>

								<div className="form-group">
									<button  id='reguser' className="dark-btn w-100 py-2 standard-button" type="button" onClick={this.handleClick.bind(this, 'requestInvitation')}>Submit</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				);
		}

	});
});