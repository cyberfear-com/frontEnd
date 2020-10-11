define(['react','app'], function (React,app) {
	return React.createClass({

		componentDidMount: function() {
			$('#dntInter').on('hide.bs.modal', function (e) {
				$('#dntOk').off('click');
			});

		},

		render: function () {
			return (
				<div className="modal fade" id="dntInter">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="dntModHead"></h4>
							</div>
							<div className="modal-body">
								<p id="dntModBody">
								</p>

							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary" id="dntOk">Cancel</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});