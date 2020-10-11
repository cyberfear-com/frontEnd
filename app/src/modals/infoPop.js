define(['react','app'], function (React,app) {
	return React.createClass({

		componentWillUnmount: function() {
		},
		componentDidMount: function() {
			//this.handleClick('SubmitPass');
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
				case 'Ok':
					$('#infoModal').modal('hide');
					break;
			}
		},
		render: function () {
			return (
				<div className="modal fade" id="infoModal">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
                            <div className="row">

							<div className="modal-header">
								<h4 className="modal-title" id="infoModHead"></h4>
							</div>
							<div className="modal-body">
							<p id="infoModBody">

								</p>

							</div>
							<div className="modal-footer">
								<button type="button" className="dark-btn w-100 py-2" onClick={this.handleClick.bind(this, 'Ok')}>OK</button>
							</div>
						</div>
					</div>
                    </div>
				</div>
				);
		}

	});
});