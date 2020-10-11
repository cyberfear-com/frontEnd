define(['react','app'], function (React,app) {
	return React.createClass({

		componentDidMount: function() {
			$('#dialogPop').on('hide.bs.modal', function (event) {
				$('#dialogOk').off('click');
			});

		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'cancel':
					$('#dialogPop').modal('hide');
					break;
			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			return (
				<div className="modal fade" id="dialogPop">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="dialogModHead"></h4>
							</div>
							<div className="modal-body">
								<p id="dialogModBody">
								</p>

							</div>
							<div className="modal-footer" id="popBut">
								<button type="button" className="dark-btn w-100 py-2" id="dialogOk">OK</button>
								<button type="button" className="white-btn" id="dialogCancel" onClick={this.handleClick.bind(this, 'cancel')}>Cancel</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});