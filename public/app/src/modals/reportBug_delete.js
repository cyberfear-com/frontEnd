define(['react'], function (React) {
	return React.createClass({
        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'reportBug':
					//requestInvitiation()
					console.log('ffff');

					break;
				case 'enterReportBug':
					if(event.keyCode==13){
						//requestInvitiation();
					}
					break;
			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {

			return (
				<div className="modal fade bs-example-modal-sm" id="reportBug-modal" tabIndex="-1" role="dialog" aria-hidden="true">
					<div className="modal-dialog modal-md">

						<div className="modal-content" onKeyDown={this.handleClick.bind(this, 'enterReportBug')}>
							<h4 className="dark-text form-heading">Contact US</h4>

							<form className="registration-form smart-form" id="report-form" action="api/submitBug" method="POST" target="_blank">

								<div className="form-group">
									<input className="hidden" type="name" name="name" placeholder="name" id="hname"/>
									<input type="email" name="email" className="form-control input-lg" placeholder="Please provide email address we can use to contact you"/>
								</div>


								<div className="form-group">

								<textarea className="form-control textarea-box placeholder" rows="5" name="comment" placeholder="Please explain problem (1000 max)"></textarea>
								</div>

								<div className="clearfix">
								</div>

								<div className="form-group">
									<button className="dark-btn w-100 py-2" type="submit"
											style={{fontSize:"14px",fontFamily: 'Rodus-Square',padding: "9px 30px",width:"100%"}}>Submit
									</button>

								</div>


							</form>
						</div>
					</div>
				</div>

				);
		}

	});
});