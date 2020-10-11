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
				case 'Ok':
					$('#bitcoinModal').modal('hide');
					break;
			}
		},
		render: function () {
			return (
				<div className="modal fade" id="bitcoinModal">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="infoModHead"></h4>
							</div>
							<div className="modal-body">
							<p id="bitcoinModBody">
								<iframe id="coinbase_inline_iframe_ce6d05a94798d7ac6641a79b64225f42" src="https://www.coinbase.com/checkouts/ce6d05a94798d7ac6641a79b64225f42/inline?c=44434" style={{width:"460px",height:"350px",border:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.25)"}} allowtransparency="true" frameborder="0"></iframe>
								</p>

							</div>
							<div className="modal-footer">
								<button type="button" className="white-btn" onClick={this.handleClick.bind(this, 'Ok')}>OK</button>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});