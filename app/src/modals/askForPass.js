define(['react','app'], function (React,app) {


	return React.createClass({

		componentDidMount: function() {
            $('#askforPass').on('shown.bs.modal', function () {
                $('#askPasInput').focus();
                //$( "#askPasSub" ).trigger( "click" ); //todo remove for dev
            });

			$('#askforPass').on('hide.bs.modal', function (event) {
				//console.log('off');
				$('#askPasSub').off('click');
			});
			//$('#askPasInput').focus();

		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
				case 'cancel':
					$('#askforPass').modal('hide');
					break;
				case 'enterPass':
					if(event.keyCode==13){
						$( "#askPasSub" ).trigger( "click" );
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
				<div className="modal fade" id="askforPass" onKeyDown={this.handleClick.bind(this, 'enterPass')}>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<button type="button" className="close float-right" data-dismiss="modal" onClick={this.handleClick.bind(this, 'cancel')} id="askPasCancel">
								<span aria-hidden="true">&times;</span>
							</button>
							<div className="row">

								<div className="col-12 text-center heading" style={{marginBottom: "20px"}}>
									<img src="img/password.svg" height="25"/><br/>
									<h8 id="askPassHeader">Provide Second Password</h8>
								</div>
								<div className="form-group">

									<div className="form-group">
										<input type="password" id="askPasInput"  className="form-control" placeholder="password"/>
									</div>
                                    <div id="infoPass"></div>
								</div>

							<div className="modal-footer">
								<button type="button" className="dark-btn w-100 py-2" autoFocus id="askPasSub">Submit</button>
							</div>
							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});