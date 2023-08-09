// eslint-disable-next-line no-undef
define(['react','app','validation',"ajaxQueue"], function (React,app,Validation,ajaxQueue) {
	return React.createClass({
        /**
         *
         * @returns {{compSafe: boolean, secondFactorInput: boolean, fac2Text: string, fac2Type: string}}
         */
		getInitialState: function () {
			return {
				compSafe:false,
				secondFactorInput:false,
				domainList: ["@mailum.com","@cyberfear.com","test@com.com"],
				domain:"@mailum.com",
				fac2Text:"",
				fac2Type:""

			};
		},

		componentWillUnmount: function() {
			createUserFormValidator = undefined;
		},

		componentDidMount: function() {
			createUserFormValidator = $("#loginUserForm").validate({
				highlight: function(element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				unhighlight: function(element) {
					$(element).closest('.form-group').removeClass('has-error');
					//$(element).closest('.form-group').addClass('has-success');

				},
				errorElement: 'span',
				errorClass: 'help-block pull-left',
				errorPlacement: function(error, element) {
					if(element.parent('.input-group').length) {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				}
			});
			$("#LoginForm_username").rules("add", {
				required: true,
				minlength: 2,
				maxlength: 200
			});


			$("#LoginUser_password").rules("add", {
				required: true,
				minlength: 4,
				maxlength: 80
			});

            if(app.defaults.get('dev')===true){
                this.handleClick('login');
            }
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleChange: function (action, event) {
			switch (action) {
				case 'enter2FacText':
					this.setState({
						fac2Text:event.target.value
					});
					break

			}
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			//app.user.set({id:10});

			switch(action) {
				case 'makePayment':
					$('#loginUser').modal('hide');
					break;

				case 'openDB':
					app.indexedDBWorker.showRecord('');


					break;
				case 'AddData':

					app.indexedDBWorker.addData('','');

					break;

				case 'DeleteStore':

					app.indexedDBWorker.deleteStore('');
					break;
				case 'RemoveOldData':
					app.indexedDBWorker.deleteRecord();

					console.log(app.indexedDBWorker);
					//var request = db.transaction(["user_1"], "readwrite")
					//	.objectStore("user_1")
					//	.delete(["777-44-4444"]);

					//request.onsuccess = function(event) {
					//	alert("Gone");
					//};

					break;


				case 'login':
					var thisComp=this;
					createUserFormValidator.form();

					if (createUserFormValidator.numberOfInvalids() == 0) {
						var email=$('#LoginForm_username').val();
						var password=$('#LoginUser_password').val();
						var factor2=this.state.fac2Text;


						app.indexedDBWorker.set({"allowedToUse":$('#computerSafe').is(':checked')});
						//app.userObjects.retrieveUserObject();

						app.auth.Login(email,password,factor2,function(result){
							if(result=='needGoogle'){
								thisComp.setState({
									secondFactorInput:true
								});

								thisComp.setState({
									fac2Type:1
								});
							}else if(result=='needYubi'){
								thisComp.setState({
									secondFactorInput:true
								});

								thisComp.setState({
									fac2Type:2
								});
							}else if(result=='noinet'){
								console.log('result');
							}
						});
					}
					break;
				case 'enterLogin':
					if(event.keyCode==13 || app.defaults.get("dev")){
						this.handleClick('login');
					}
					break;
				case 'forgotPassword':
					Backbone.history.navigate("forgotPassword", {
						trigger : true
					});
					$('#loginUser').modal('hide');
					$('#forgPass-modal').modal('show');

					break;
			}
		},
        /**
         *
         * @returns {JSX}
         */
		render: function () {
			return (
				<div className="modal fade" id="loginUser" tabIndex="-1" role="dialog" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered">
						<form className="modal-content" id="loginUserForm" onKeyDown={this.handleClick.bind(this, 'enterLogin')}>

							<button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
							<div className="row">
								<div className="col-12 text-center heading" style={{marginBottom: "20px"}}>
									<img src="img/password.svg" height="25"/><br/>
										LOGIN
								</div>
								<div className="col-12">

										<div className="form-group">
											<div className="input-group">
												<input type="text" name="email" id="LoginForm_username" className="form-control" defaultValue={app.defaults.get('userName')} placeholder="Email" maxLength="160"/>
													<span className="input-group-addon">@CYBERFEAR.COM</span>
											</div>
										</div>
										<div className="form-group">
											<input type="password" name="pP" id="LoginUser_password" className="form-control  input-lg" defaultValue={app.defaults.get('firstPassfield')} placeholder="Password"/>
										</div>
										<div className={"form-group " +(this.state.fac2Type==0?"hidden":"")}>
											<div className="input-group col-xs-12">
									<span className="input-group-addon">
										<i className={"fa fa-google fa-lg "+(this.state.fac2Type==1?"":"hidden")}></i>
										<img className={this.state.fac2Type==2?"":"hidden"} src="/img/yubi.png" width="20"/></span>
												<input type="text" className="form-control input-lg" placeholder="PIN" value={this.state.fac2Text} onChange={this.handleChange.bind(this, 'enter2FacText')}/>

											</div>

										</div>

										<button className="dark-btn w-100 py-2" type="button"
												style={{fontSize:"14px",fontFamily: 'Rodus-Square',padding: "9px 30px",width:"100%"}} onClick={this.handleClick.bind(this, 'login')}>LOGIN
										</button>

										<div className="text-center"
											 style={{fontSize:"16px",fontWeight:"700",marginTop:"10px"}}>
											<a style={{fontWeight:"700"}} onClick={this.handleClick.bind(this, 'forgotPassword')}>Forgot password?</a>
										</div>

								</div>
							</div>
						</form>
					</div>
				</div>


				);
		}

	});
});
