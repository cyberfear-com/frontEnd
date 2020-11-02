define(['react','app'], function (React,app) {
	return React.createClass({

		componentWillUnmount: function() {
		},
		componentDidMount: function() {

			app.userObjects.on('change', function() {
				this.forceUpdate();
			}.bind(this));

		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {

		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			return (
				<div className="modal fade" id="userObjSync">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="userSyncTitle">Fetching User Data</h4>
							</div>
							<div className="modal-body">

								<div className="form-group">
									<div className="bs-example" data-example-id="progress-bar-with-label">
										{app.userObjects.get("modalText")}
										<div className="progress">

											<div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
												style={{width: app.userObjects.get("modalpercentage")+"%"}}>
											{app.userObjects.get("modalpercentage")}%
											</div>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});