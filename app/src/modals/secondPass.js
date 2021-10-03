define(['react','app'], function (React,app) {
	return React.createClass({

		componentWillUnmount: function() {
		},

		componentDidMount: function() {
			//developers
			//app.user.set({"secondPassword":app.defaults.get('secondPassfield')});

            if(!app.user.get('oneStep')){
                if(app.defaults.get('dev')){
                    app.user.set({"secondPassword":app.globalF.makeDerived(app.defaults.get('secondPassfield'), app.user.get('salt'))});
                    this.handleClick('SubmitPass');
                }
            }

            $('#secondPass').on('shown.bs.modal', function () {
                $('#second_passField').focus();
            });



		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});
			switch(action) {
                case 'enterPass':
                    if(event.keyCode==13){
                        $( "#submitSecPass" ).trigger( "click" );
                    }
                    break;
				case 'SubmitPass':
					//console.log('dddd')

					if(app.defaults.get('dev')){
					//	app.user.set({"secondPassword":$('#second_pass').val()});
					}

					//app.user.set({"secondPassword":app.globalF.makeDerived($('#second_pass').val(), app.user.get('salt'))});
					$('#secondPass').modal('hide');

					break;

				case 'logOut':
					app.auth.logout();
					break;

                case 'forgotSecondPassword':

                    $('#secondPass').modal('hide');
                    $('#userObjSync').modal('hide');


                    Backbone.history.navigate("forgotSecret", {
                        trigger : true
                    });


                    break;
			}
		},

        /**
         *
         * @returns
         *
         */
		render: function () {
			return (
				<div className="modal fade" id="secondPass" onKeyDown={this.handleClick.bind(this, 'enterPass')}>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="row">
								<div className="col-12 text-center heading" style={{marginBottom: "20px"}}>
									<img src="img/secret.svg" height="25"/><br/>
									ENTER SECOND PASSWORD
								</div>
								<div className="form-group">

									<div className="form-group">
										<input type="password" id="second_passField" className="form-control" defaultValue={app.defaults.get('secondPassfield')} placeholder="password"/>
									</div>
								</div>

                                <div className="clearfix"></div>

								<button className="dark-btn w-100 py-2" type="button"
										style={{fontSize:"14px",fontFamily: 'Rodus-Square',padding: "9px 30px",width:"100%"}}  id="submitSecPass">LOGIN
								</button>
								<div className="text-center" style={{fontSize:"16px",fontWeight:"700",marginTop:"10px"}}>
									<a data-toggle="modal" data-target="#forgot-modal" data-dismiss="modal"
									   style={{fontWeight:"700"}} onClick={this.handleClick.bind(this, 'forgotSecondPassword')}>Forgot second password?</a>
								</div>
								<div className="text-center">
									<a style={{fontFamily: 'Rodus-Square',fontWeight:"700",fontSize:"12px"}}  onClick={this.handleClick.bind(this, 'logOut')}>SIGN
										OUT?</a>
								</div>


							</div>
						</div>
					</div>
				</div>
				);
		}

	});
});
