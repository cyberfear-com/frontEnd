
define(['react','app'], function (React,app) {
	return React.createClass({

		componentDidMount: function() {

			app.versioning.on('change', function() {
				this.forceUpdate();
			}.bind(this));

		},

		handleClick: function(i,event) {
			switch(i) {
				case 'startUpdating':
					$(event.target).prop('disabled',true);
					$(event.target).prepend('<i class="fa fa-spin fa-refresh"></i> ');
					$('#cancelUpdate').toggleClass('hidden');
					$('#logoutUpdate').toggleClass('hidden');
					//console.log(event.target);
					app.versioning.updateV1();

				break;
				case 'cancelUpdate':

					$('#startUpdate').prop('disabled',false);
					$('#startUpdate').html('Continue');
					$('#cancelUpdate').toggleClass('hidden');
					$('#logoutUpdate').toggleClass('hidden');
					break;

			}


		},
		render: function () {
			var rightClass="Right col-xs-12 sRight";
		return (
			<div className={rightClass}>
				<div className="col-md-7 col-lg-8 col-sm-12 personal-info ">
					<div className="panel panel-default  panel-info">
						<div className="panel-heading">
							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className="active"><a><h3 className="panel-title personal-info-title">Update Account</h3></a></li>
							</ul>
						</div>
						<div className="panel-body">
							<div className="alert alert-info text-left">
							Notice:  Due to system system updates your account must be upgraded before continuing to your inbox.  The upgrade process may take several minutes to complete.  Please be patient during this process.  Do not click away from or reload the page during the upgrade. <span className="txt-color-red">Interrupting the process may render your account inaccessible.</span>  Thank you for your patience.
							</div>


							<div className="form-group">
							<div className="bs-example" data-example-id="progress-bar-with-label">
							{app.versioning.get("modalText")}
								<div className="progress">

									<div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width:app.versioning.get("modalpercentage")+"%"}}>
									{app.versioning.get("modalpercentage")}%
									</div>
								</div>
							</div>
								</div>
									<div className="form-group">
										<div className="pull-right">
											<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, 'startUpdating')} id="startUpdate">Update</button>
											<button type="button" className="btn btn-default hidden" id="cancelUpdate" onClick={this.handleClick.bind(this, 'cancelUpdate')}>Cancel</button>
											<button type="button" className="btn btn-default" id="logoutUpdate">Sign Out</button>
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