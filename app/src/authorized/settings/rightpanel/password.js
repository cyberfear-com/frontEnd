define(['react', 'app', 'ajaxQueue'], function (React, app, ajaxQueue) {
	"use strict";
	return React.createClass({
		getInitialState: function () {
			return {
				panel: {
					firstPanelClass: "panel-body",
					secondPanelClass: "panel-body hidden",
					firstTab: "active",
					secondTab: app.user.get("oneStep") ? "hidden" : ''
				},

				saveButton1Panel: {text: "Save", enabled: true, iClass: ""},
				saveButton2Panel: {text: "Save", enabled: true, iClass: "", onClick: "change2Pass"},


				password1input: {text: app.defaults.get("firstPassfield")},
				password1inputRepeat:app.defaults.get("firstPassfield"),

				password2input: {text: app.defaults.get("secondPassfield")},
				password2inputRepeat: {text: app.defaults.get("secondPassfield")},

				secAlertText: app.user.get("oneStep") ? "" : "hidden",

				paswordForm: {},
				secForm: {},
				button2Class: app.user.get("oneStep") ? "hidden" : "",
				button3Class: app.user.get("oneStep") ? "btn btn-default" : "hidden"

			};
		},
		componentWillUnmount: function () {
			//console.log('dismounted');
			//id="askPasSub">Submit</button>
			//id="askPasCancel">Cancel</button>
		},

		componentDidMount: function () {

			this.setState(
				{
					paswordForm: $("#passForm").validate(),
					secForm: $("#secForm").validate()
				});

			$("#newPass").rules("add", {
				required: true,
				minlength: 6,
				maxlength: 80
			});


			$("#newPassRep").rules("add", {
				required: true,
				minlength: 6,
				maxlength: 80,
				equalTo: '#newPass',
				messages: {
					required: 'Please enter your password one more time.',
					equalTo: 'Please enter the same password as above.'
				}
			});

			$("#newSecret").rules("add", {
				required: true,
				minlength: 6,
				maxlength: 80
			});


			$("#newSecretRep").rules("add", {
				required: true,
				minlength: 6,
				maxlength: 80,
				equalTo: '#newSecret',
				messages: {
					required: 'Please enter your password one more time.',
					equalTo: 'Please enter the same password as above.'
				}
			});


			//app.user.set({oneStep:true});
			//app.user.set({factor2Auth:true});

			//console.log(app.user);
			//this.handleClick('showSecond');
		},

        /**
         *
         * @param {string} testPass
         * @param {boolean} callback
         */
		checkIfFirstPassGood: function (testPass, callback) {
			var post = {};
            console.log(app.user.get("oneStep"));
			//post['Testpassword'] = testPass;

			if (app.user.get("oneStep")) {
				post['password'] = app.transform.SHA512(app.globalF.makeDerivedFancy(testPass, app.defaults.get('hashToken')));
				post['steps'] = 1;
			} else {
				post['password'] = app.transform.SHA512(testPass);
				post['steps'] = 2;

			}
			app.serverCall.ajaxRequest('checkPass', post, function (result) {

				if (result['response'] == "success") {
					callback(true);
				} else {
					callback(false);
				}
			});
		},


        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function (action, event) {
			switch (action) {
				case 'showFirst':
					this.setState(
						{
							panel: {
								firstPanelClass: "panel-body",
								secondPanelClass: "panel-body hidden",
								firstTab: "active",
								secondTab: app.user.get("oneStep") ? "hidden" : ''
							}
						});

					break;

				case 'showSecond':
					this.setState(
						{
							panel: {
								firstPanelClass: "panel-body hidden",
								secondPanelClass: "panel-body",
								firstTab: "",
								secondTab: "active"
							}
						});

					break;


                case 'downloadToken':
                    var toFile="";

                    app.globalF.checkSecondPass(function(){

                        var derivedKey= app.user.get('secondPassword');
                        console.log(derivedKey);
                        //console.log(salt);

                         app.generate.generateToken(derivedKey,function(tokenHash,tokenAes,tokenAesHash){
                         toFile=tokenAes;

                             var post={
                                 'tokenHash':tokenHash,
                                 'tokenAesHash':tokenAesHash
                             };

                             app.serverCall.ajaxRequest('updateSecretToken', post, function (result) {
                                 if (result['response'] == "success") {

                                     var element = document.createElement('a');
                                     element.setAttribute('href', 'data:attachment/plain;charset=utf-8,' + toFile);
                                     element.setAttribute('download', app.user.get('email')+'.key');

                                     element.style.display = 'none';
                                     document.body.appendChild(element);
                                     element.click();
                                     document.body.removeChild(element);

                                 } else if(result['response'] == "fail") {
                                     app.notifications.systemMessage('tryAgain');
                                 }
                             });


                         });





                    });



                    break;


                case 'enableSecondPass':
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body hidden",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active"
                        }
                    });

                    break;


				case 'change1Pass':

					//verify existing pass
					console.log(app.user.get('remeberPassword'));

					var paswordForm = this.state.paswordForm;
					paswordForm.form();

					var thisComp = this;
					if (paswordForm.numberOfInvalids() == 0) {
						$('#askPassHeader').html('Provide Original Password');

						$('#askforPass').modal('show');
						$('#askPasSub').on('click', function () {
							thisComp.handleClick('save1Pass', $('#askPasInput').val());
						});
					}
					break;

				case 'delete2Pass':

					var thisComp = this;

					this.checkIfFirstPassGood(event, function (result) {
						if (result) {

                            app.user.set({"password": app.transform.SHA512(event)});
                            app.user.set({"newPassword": app.transform.SHA512(app.globalF.makeDerivedFancy(event, app.defaults.get('hashToken')))});
                            app.user.set({"newSecondPassword":  app.globalF.makeDerived(event,app.user.get('salt'))});

							app.user.set({"oneStep": true});
							$('#askforPass').modal('hide');


							//console.log(app.user);

							app.userObjects.updateObjects('changeSecondPass','disableSecond',function(result){
								//restore copy of the object if failed to save
								if (result['response'] == "success") {
									if(result['data']=='saved'){

										thisComp.handleClick('resetSecondPanel');
										thisComp.handleClick('resetFirstPanel');
										thisComp.setState({
											secAlertText:'',
											button3Class:'btn btn-default',
											button2Class:'hidden'
										});


										app.user.set({"password":""});
                                        $('#askPasInput').val('')

										if(app.user.get("remeberPassword")){
											app.user.set({"secondPassword":app.user.get('newSecondPassword')});
										}else{
											app.user.set({"secondPassword":""});
										}


									}else if(result['data']=='newerFound'){
										//app.notifications.systemMessage('newerFnd');
									}



								}

								app.user.unset('newPassword');
								app.user.unset('newSecondPassword');


							});



						} else {

							app.notifications.systemMessage('wrngPass');
						}
					});

					break;

				case 'save1Pass':

					var thisComp = this;

                    var pass=event;
  					this.checkIfFirstPassGood(pass, function (result) {

						if (result) {
							$('#askforPass').modal('hide');

							//set new pass
							if (app.user.get("oneStep")) {

								//check with user pass field event

								app.user.set({"password": app.transform.SHA512(app.globalF.makeDerivedFancy(pass, app.defaults.get('hashToken')))});
								app.user.set({"newPassword": app.transform.SHA512(app.globalF.makeDerivedFancy(thisComp.state.password1input.text, app.defaults.get('hashToken')))});
								app.user.set({"newSecondPassword":  app.globalF.makeDerived(thisComp.state.password1input.text, app.user.get('salt'))});


							} else {
								app.user.set({"password":  app.transform.SHA512(pass)});
								//app.user.set({"newPassword": app.transform.SHA512(thisComp.state.password1input.text)});
								app.user.set({"newPassword": app.transform.SHA512(thisComp.state.password1input.text)});

							}

							//app.user.set({"firstPassChanged": true});

							app.userObjects.updateObjects('changePass','',function(result){
								//restore copy of the object if failed to save
								if (result['response'] == "success") {

									thisComp.handleClick('resetFirstPanel');


									app.user.set({"password":""});

									if(app.user.get("oneStep") && app.user.get("remeberPassword")){
										app.user.set({"secondPassword":app.user.get('newSecondPassword')});
									}else{
										app.user.set({"secondPassword":""});
									}

                                    $('#askPasInput').val('')
								}

								app.user.unset('newPassword');
								app.user.unset('newSecondPassword');


							});


							//app.userObjects.updateObjects();




						} else {
							app.notifications.systemMessage('wrngPass');
						}

					});


//$('#askforPass').modal('hide');

					break;

				case 'change2Pass':

					var pasword2Form = this.state.secForm;
					pasword2Form.form();

					var thisComp = this;
					if (pasword2Form.numberOfInvalids() == 0) {
						if (app.user.get("oneStep")) {
							$('#askPassHeader').html('Provide Original Password');
						} else {
							$('#askPassHeader').html('Provide Original Second Password');
						}

						$('#askforPass').modal('show');
						$('#askPasSub').on('click', function () {
							thisComp.handleClick('save2Pass', $('#askPasInput').val());
						});
					}

					break;
				case 'save2Pass':
					var thisComp = this;
                    console.log(event);

                    var pass= app.globalF.makeDerived(event, app.user.get('salt'))

					if (app.globalF.tryDecrypt(pass)) {

                       // enableSecond

                        var action="";
                        if(app.user.get("oneStep")){
                            app.user.set({"oneStep": false});
                            app.user.set({"password": app.transform.SHA512(app.globalF.makeDerivedFancy(event, app.defaults.get('hashToken')))});

                            app.user.set({"newPassword": app.transform.SHA512(event)});
                            app.user.set({"newSecondPassword": app.globalF.makeDerived(thisComp.state.password2input.text, app.user.get('salt'))});

                            action='enableSecond';
                        }else{
                            app.user.set({"newSecondPassword": app.globalF.makeDerived(thisComp.state.password2input.text, app.user.get('salt'))});
                        }

						$('#askforPass').modal('hide');

						//console.log('saving pass2');
						app.userObjects.updateObjects('changeSecondPass',action,function(result){
							//restore copy of the object if failed to save
							if (result['response'] == "success") {
								if(result['data']=='saved'){

									thisComp.setState({
										secAlertText:'hidden',
										button3Class:'hidden',
										button2Class:''
									});

								}else if(result['data']=='newerFound'){
									//app.notifications.systemMessage('newerFnd');

								}

								thisComp.handleClick('resetSecondPanel');

								app.user.set({"password":""});

								if(app.user.get("remeberPassword")){
									app.user.set({"secondPassword":app.user.get('newSecondPassword')});
								}else{
									app.user.set({"secondPassword":""});
								}

							}

							app.user.unset('newPassword');
							app.user.unset('newSecondPassword');


						});

					} else {
						if (app.user.get("oneStep")) {
							app.notifications.systemMessage('wrngPass');
						} else {
							app.notifications.systemMessage('wrngSecPass');
						}

					}
					break;

				case 'resetFirstPanel':
					this.setState({
						password1input: {text: ''},
						password1inputRepeat: ''

					});
					var validator = $("#passForm").validate();
					validator.resetForm();

					$("#newPass").removeClass("invalid");
					$("#newPass").removeClass("valid");

					$("#newPassRep").removeClass("invalid");
					$("#newPassRep").removeClass("valid");

					break;

				case 'resetSecondPanel':

					this.setState({
						password2input: {text: ''},
						password2inputRepeat: {text: ''}

					});
					var validator = $("#secForm").validate();
					validator.resetForm();

					$("#newSecret").removeClass("invalid");
					$("#newSecret").removeClass("valid");

					$("#newSecretRep").removeClass("invalid");
					$("#newSecretRep").removeClass("valid");

					if (app.user.get("oneStep")) {

						this.setState({

							panel: {
								firstPanelClass: "panel-body",
								secondPanelClass: "panel-body hidden",
								firstTab: "active",
								secondTab: "hidden"
							},
							secAlertText: app.user.get("oneStep") ? "" : "hidden"

						});
					}

					break;


				case 'disableSecondPass':

					var thisComp = this;

					$('#askPassHeader').html('Provide Original Second Password');
					$('#askPasInput').val(app.defaults.get('secondPassfield'));
					$('#askforPass').modal('show');

					$('#askPasSub').on('click', function () {
						console.log('check First');
						thisComp.handleClick('veryfyFirstPass', $('#askPasInput').val());
					});

					break;
				case 'veryfyFirstPass':
					var thisComp = this;

                    var pass= app.globalF.makeDerived(event, app.user.get('salt'))

					if (app.globalF.tryDecrypt(pass)) {
						$('#askforPass').modal('hide');

						setTimeout(function () {
							$('#askPassHeader').html('Provide First Password');
							$('#askPasInput').val(app.defaults.get('firstPassfield'));
							$('#askforPass').modal('show');
							$('#askPasSub').on('click', function () {
								console.log('check Second');
								//app.user.set({"oneStep": true});
								thisComp.handleClick('delete2Pass', $('#askPasInput').val());
							});
						}, 1000);


					} else {
						app.notifications.systemMessage('wrngSecPass');
					}
					break;



					break;

				//case 'tryAgain':
					//$.ajaxQueue.stop();
					//$.ajaxQueue.run();
				//	$.ajaxQueue.startNextRequest('tryAgain');
				//	break;

			}
		},
        /**
         *
         * @returns {JSX}
         */

		render: function () {

			return (
				<div className={this.props.classes.rightClass} id="rightSettingPanel">
					<div className="col-lg-7 col-xs-12 personal-info ">
						<div className="panel panel-default">
							<div className="panel-heading">
								<ul className="nav nav-tabs tabbed-nav">
									<li role="presentation" className={this.state.panel.firstTab}>
										<a onClick={this.handleClick.bind(this, 'showFirst')}>
											<h3 className={this.props.tabs.Header}>Password</h3>
											<h3 className={this.props.tabs.HeaderXS}><i className="ion-key"></i></h3>

										</a>
									</li>
									<li role="presentation" className={this.state.panel.secondTab}>
										<a onClick={this.handleClick.bind(this, 'showSecond')}>
											<h3 className={this.props.tabs.Header}>Second Password</h3>
											<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-lock"></i></h3>

										</a>
									</li>
								</ul>
							</div>


							<div className={this.state.panel.firstPanelClass}>
								<form id="passForm">
									<div className="form-group">
										<input type="password" name="fpass" className="form-control" id="newPass" placeholder="new password"
										onChange={this.handleChange.bind(this, 'changepass1')}
										value={this.state.password1input.text}
										/>
									</div>

									<div className="form-group">
										<input type="password" name="fpassrep" className="form-control" id="newPassRep" placeholder="repeat password"
										onChange={this.handleChange.bind(this, 'changepass1repeat')}
										value={this.state.password1inputRepeat}/>
									</div>

								</form>

								<div className="clearfix"></div>
                                <div className="pull-left dialog_buttons">
                                    <button type="button" className={this.state.button3Class} onClick={this.handleClick.bind(this, 'enableSecondPass')}>Enable Second Password</button>

                                    <button type="button" className="btn btn-success" onClick={this.handleClick.bind(this, 'downloadToken')}>Download Reset Token</button>
                                    <div className="clearfix"></div>
                                    <br/>
                                    <p>Note: If you changed your password, please download new reset token</p>

                                </div>
								<div className="pull-right dialog_buttons">

									<button type="button" className="btn btn-primary"
									disabled={!this.state.saveButton1Panel.enabled}
									onClick={this.handleClick.bind(this, 'change1Pass')}

									>Save</button>
									<button type="button" className="btn btn-default"
									onClick={this.handleClick.bind(this, "resetFirstPanel")}
									>Cancel</button>


								</div>
							</div>

							<div className={this.state.panel.secondPanelClass}>

								<div className={"alert alert-warning "+this.state.secAlertText} role="alert">
								Please enter second password, that will be used to encrypt your data.
								</div>
								<form id="secForm">
									<div className="form-group">

										<input type="password" name="spass" className="form-control" id="newSecret" placeholder="new secret phrase"
										onChange={this.handleChange.bind(this, 'changepass2')}
										value={this.state.password2input.text}

										/>
									</div>

									<div className="form-group">
										<input type="password" name="spassrep" className="form-control" id="newSecretRep" placeholder="repeat secret phrase"
										onChange={this.handleChange.bind(this, 'changepass2repeat')}
										value={this.state.password2inputRepeat.text}
										/>
									</div>

								</form>
								<div className="clearfix"></div>

								<button type="button" className={"col-xs-12 col-sm-6 "+this.state.button2Class} onClick={this.handleClick.bind(this, 'disableSecondPass')}>Disable Second Password</button>

                                <div className="clearfix"></div>
                                <br/>
                                <p>Note: If you changed or enabled/disabled your second password, please download new reset token</p>

								<div className="col-xs-12 col-sm-6 pull-right text-right dialog_buttons">

                                    <button type="button" className="btn btn-primary"
									disabled={!this.state.saveButton2Panel.enabled}
									onClick={this.handleClick.bind(this, this.state.saveButton2Panel.onClick)}

									>Save</button>
									<button type="button" className="btn btn-default"
									onClick={this.handleClick.bind(this, 'resetSecondPanel')}
									>Cancel</button>
								</div>
							</div>

						</div>
					</div>


					<div className="col-lg-5 col-xs-12 personal-info ">
						<div className="panel panel-default">
							<div className="panel-heading">
								<h3 className="panel-title personal-info-title">Help</h3>

							</div>

							<div className="panel-body">

								<p>
									<b>Password</b> - (6-80 characters) Strengthen the security of your account by regularly changing the strong password used to access your account. A strong password contains at least 16 characters including numbers and special characters. To help protect your account we recommend enabling two factor authentication using either Google Auth or YubiKey.
								</p>
								<p>
									<b>Second Password</b> - CyberFear offers the option to have two passwords protecting your account instead of a single password. We understand there are reasons why two passwords might not be considered as a better solution than a single password. Two factor authentication with Google Authenticator or a YubiKey can be enabled instead of or in addition to a second password.
								</p>


							</div>
						</div>
					</div>

				</div>
				);
		},
        handleChange: function (action, event) {
            switch (action) {
                case 'changepass1':
                    this.setState({
                        password1input: {
                            text: event.target.value
                        }
                    });

                    break;
                case 'changepass1repeat':
                    this.setState({
                        password1inputRepeat:  event.target.value
                    });
                    break;

                case 'changepass2':
                    this.setState({
                        password2input: {
                            text: event.target.value
                        }
                    });
                    break;
                case 'changepass2repeat':
                    this.setState({
                        password2inputRepeat: {
                            text: event.target.value
                        }
                    });
                    break;
            }
        },

	});
});