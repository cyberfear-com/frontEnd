define(['react','app','qrcode'], function (React,app,qrcode) {
	"use strict";
	return React.createClass({

        /**
         *
         * @returns {{
         * nav1Class: string,
         * nav2Class: string,
         * panel1Class: string,
         * panel2Class: string,
         * panel3Class: string,
         * panel4Class: string,
         * panel2Visible: string,
         * panel4Visible: string,
         * button1Class: string,
         * googlePin: string,
         * yubiPin: string
         * }}
         */
		getInitialState : function() {
			return {
				nav1Class:"",
				nav2Class:"",

				panel1Class:"hidden", //goog enab
				panel2Class:"hidden", //goog create
				panel3Class:"hidden", //yubi enab
				panel4Class:"hidden", //yubi create

				panel2Visible:"hidden",
				panel4Visible:"hidden",
				button1Class:"",
				googlePin:"",
				yubiPin:""
			};
		},

		panelsReset: function(){
			this.setState({
				nav1Class:"",
				nav2Class:"",

				panel1Class:"hidden",
				panel2Class:"hidden",
				panel3Class:"hidden",
				panel4Class:"hidden",
				panel2Visible:"hidden",
				panel4Visible:"hidden",
				button1Class:""

			});
		},


		whatToShow: function () {
			if(app.user.get("Factor2")['type']=="google"){
			//google present
				this.setState({
					nav1Class:"active",
					nav2Class:"hidden",
					nav1Click:"",
					nav2Click:"",

					panel1Class:"panel-body",
					panel2Class:"hidden",
					panel3Class:"hidden",
					panel4Class:"hidden",
					panel2Visible:"hidden",

					button1Class:"hidden"

				});

				//this.generateQr(this.state.secret);



			}else if(app.user.get("Factor2")['type']=="yubi"){
				//yubi present
				this.setState({

					nav1Class:"hidden",
					nav2Class:"active",
					nav1Click:"",
					nav2Click:"",

					panel1Class:"hidden",
					panel2Class:"hidden",
					panel3Class:"panel-body",
					panel4Class:"hidden",
					panel2Visible:"hidden",
					panel4Visible:"hidden",

					button1Class:"hidden",
					button2Class:"hidden"

				});
			}else{
				//if not selected

				this.setState({
					nav1Class:"active",
					nav2Class:"",
					nav1Click:"show1Panel",
					nav2Click:"show2Panel",

					panel1Class:"hidden",
					panel2Class:"panel-body",
					panel3Class:"hidden",
					panel4Class:"hidden",
					panel2Visible:"hidden",
					panel4Visible:"hidden",
					button1Class:""
				});
			}
		},

		componentDidMount: function () {
			this.whatToShow();
			var thisComp=this;

			this.setState({googleValidator: $("#googleForm").validate()});

            $("#gpin").rules("add", {
				required: true,
				number: true,
				minlength: 6,
				maxlength: 6,
				remote: {
					url: app.defaults.get('apidomain')+"/setup2FacV2",
					type: "post",
					data:{
						"secret":function(){
							return thisComp.state.secret
						},
						'fac2Type':'google',
						"verificationCode":function(){
							return thisComp.state.googlePin
						},
						'userToken':app.user.get("userLoginToken")
					}
				},
				messages: {
					remote: "Incorrect Pin"
				}
			});


			this.setState({yubiValidator: $("#yubiForm").validate()});
			$("#ypin").rules("add", {
				required: true,
				minlength: 44,
				maxlength: 60,
				// remote: {
				// 	url: app.defaults.get('apidomain')+"/setup2FacV2",
				// 	type: "post",
				// 	data:{
				// 		"secret":function(){
				// 			return thisComp.state.secret
				// 		},
				// 		'fac2Type':'yubi',
				// 		"verificationCode":function(){
				// 			return thisComp.state.yubiPin
				// 		},
				// 		'userToken':app.user.get("userLoginToken")
				// 	}
				// },
				messages: {
					remote: "Incorrect Pin"
				}
			});


		},

        /**
         *
         * @param {string} action
         * @param {string} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'show1Panel':
					this.handleClick('resetGoogleForm');
					//this.whatToShow();

					//this.setState({
					//	nav1Class:"active",
					//	panel2Class:"panel-body"
					//});

					break;

				case 'show2Panel':
					this.handleClick('resetYubiForm');


					//this.setState({
					//	nav1Class:"",
					//	nav2Class:"active",
					//	panel2Class:"hidden",
					//	panel4Class:"panel-body",
					//	button2Class:"",
					//	button1Class:"hidden"
					//});

					break;
				case 'confirmDisableGoogleAuth':

					var thisComp=this;
					$('#dialogModHead').html("Cancel Google 2-Factor");
					$('#dialogModBody').html(" Are you sure?");

					$('#dialogOk').on('click', function () {
						thisComp.handleClick('DisableGoogleAuth');
					});

					$('#dialogPop').modal('show');

					break;
				case 'confirmDisableYubiAuth':

					var thisComp=this;
					$('#dialogModHead').html("Cancel YubiKey 2-Factor");
					$('#dialogModBody').html("Are you sure?");

					$('#dialogOk').on('click', function () {
						thisComp.handleClick('DisableYubiAuth');
					});

					$('#dialogPop').modal('show');

					break;

				case 'DisableYubiAuth':
					var thisComp=this;
					app.user.set({"Factor2":{
						'type':'',
						'secret':'',
						'since':''
					}});

					app.userObjects.updateObjects('saveGoogleAuth','',function(result){

						if (result['response'] == "success") {
							if(result['data']=='saved'){

								thisComp.setState({
									secret:'',
									yubiPin:''
								});

								thisComp.whatToShow();

							}else if(result['data']=='newerFound'){
								app.notifications.systemMessage('newerFnd');
							}


						}

					});
					$('#dialogPop').modal('hide');



					break;



				case 'DisableGoogleAuth':

					var thisComp=this;
					app.user.set({"Factor2":{
						'type':'',
						'secret':'',
						'since':''
					}});


					$('#dialogPop').modal('hide');

					app.userObjects.updateObjects('saveGoogleAuth','',function(result){

						if (result['response'] == "success") {
							if(result['data']=='saved'){
								thisComp.whatToShow();

								thisComp.whatToShow();
								$('#qrcode').html('');

								thisComp.setState({
									secret:'',
									googlePin:''
								});

							}else if(result['data']=='newerFound'){
								app.notifications.systemMessage('newerFnd');
							}


						}

					});





					//app.userObjects.updateObjects();
					break;

				case 'EnableGoogleAuth':
					this.handleClick('resetGoogleForm');
					this.panelsReset();

					var secret =app.generate.makeQRSecret();
					this.setState({
						nav1Class:"active",
						panel2Class:"panel-body",
						panel2Visible:"",
						button1Class:"hidden",
						secret:secret
					});
					this.generateQr(secret);

					break;

				case 'resetGoogleForm':
					this.panelsReset();

					app.user.set({"Factor2":{
						'type':'',
						'secret':'',
						'since':''
					}});
					$('#qrcode').html('');

					this.setState({
						nav1Class:"active",
						panel2Class:"panel-body",
						panel2Visible:"hidden",
						button1Class:"",
						secret:'',
						googlePin:''
					});

					$("#gpin").removeClass("invalid");
					$("#gpin").removeClass("valid");

					var validator = $("#googleForm").validate();
					validator.resetForm();

					break;
				case 'saveNewGoogleAuth':

					var validator=this.state.googleValidator;
					validator.form();
					var thisComp=this;


					if (validator.numberOfInvalids() == 0)
					{

                        var post={
                            "secret":thisComp.state.secret,
                            'fac2Type':'google',
                            "verificationCode":thisComp.state.googlePin
                        };
                        app.serverCall.ajaxRequest('setup2Fac',post,function(result){
                            if(result===true){
                                app.user.set({"Factor2":{
                                    'type':'google',
                                    'secret':app.transform.to64str(thisComp.state.secret),
                                    'since':Math.round((new Date).getTime()/1000)
                                }});

                                app.userObjects.updateObjects('saveGoogleAuth','',function(result){

                                    if (result['response'] == "success") {
                                        if(result['data']=='saved'){

                                            thisComp.whatToShow();
                                            $('#qrcode').html('');

                                            thisComp.setState({
                                                secret:'',
                                                googlePin:''
                                            });

                                        }else if(result['data']=='newerFound'){

                                        }


                                    }

                                });

                            }

                        });

						$("#gpin").removeClass("invalid");
						$("#gpin").removeClass("valid");

						var validator = $("#googleForm").validate();
						validator.resetForm();
					}



					break;
				case 'saveNewYubiAuth':
					var validator=this.state.yubiValidator;
					validator.form();
					var thisComp=this;


					if (validator.numberOfInvalids() == 0)
					{
					app.user.set({"Fac2Changed":true});

					app.user.set({"Factor2":{
						'type':'yubi',
						'secret':app.transform.to64str(this.state.yubiPin.substring(0,12)),
						'since':Math.round((new Date).getTime()/1000)
					}});

						app.userObjects.updateObjects('saveGoogleAuth',thisComp.state.yubiPin,function(result){

							if (result['response'] == "success") {
								if(result['data']=='saved'){

									thisComp.whatToShow();
									//$('#qrcode').html('');

									thisComp.setState({
										secret:'',
										yubiPin:''
									});

								}else if(result['data']=='newerFound'){
									//app.notifications.systemMessage('newerFnd');
								}


							}

						});

					//app.userObjects.updateObjects();
					//this.whatToShow();
					}

					break;

				case 'EnableYubiKeyAuth':
					this.panelsReset();


					this.setState({
						nav2Class:"active",
						panel4Class:"panel-body",
						panel4Visible:"",
						button2Class:"hidden",
					});

					break;

				case 'resetYubiForm':
					this.panelsReset();

					app.user.set({"Factor2":{
						'type':'',
						'secret':'',
						'since':''
					}});
					$('#qrcode').html('');

					this.setState({
						nav2Class:"active",
						panel4Class:"panel-body",
						panel2Visible:"hidden",
						button2Class:"",
						yubiPin:""

					});

					$("#ypin").removeClass("invalid");
					$("#ypin").removeClass("valid");

					var validator = $("#yubiForm").validate();
					validator.resetForm();

					break;
			}


		},

        /**
         *
         * @param {sting} action
         * @param {object} event
         */
		handleChange: function (action, event) {
			switch (action) {
				case 'enterGCode':
					this.setState({
						googlePin:event.target.value
					});
					break
				case 'enterYCode':
					this.setState({
						yubiPin:event.target.value
					});
					break

				case 'preventEnter':
					if(event.keyCode==13){
						event.preventDefault();
					}
					break;

			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			var classQRInputs = "col-xs-12 col-sm-8 col-md-9";
			var classQrDiv = "col-xs-12 col-sm-4 col-md-3";

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">
				<div className="col-lg-7 col-xs-12 personal-info ">
					<div className="panel panel-default">
						<div className="panel-heading">

							<ul className="nav nav-tabs tabbed-nav">
								<li className={this.state.nav1Class}>
									<a onClick={this.handleClick.bind(this, this.state.nav1Click)}>
										<h3 className={this.props.tabs.Header}>Google Auth</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-qrcode"></i></h3>
									</a>
								</li>
								<li className={this.state.nav2Class}>
									<a onClick={this.handleClick.bind(this, this.state.nav2Click)}>
										<h3 className={this.props.tabs.Header}>YubiKey</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="ion-usb"></i></h3>
									</a>
								</li>
							</ul>
						</div>

							<div className={this.state.panel1Class}>
								<blockquote>
									<p>Using Google AUTH Since: <strong>{new Date(app.user.get("Factor2")['since'] * 1000).toLocaleDateString()}</strong></p>
								</blockquote>

								<div className="pull-right">
									<div className="form-group">
										<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, "confirmDisableGoogleAuth")}>Disable Google Auth</button>
									</div>
								</div>
							</div>



							<div className={this.state.panel2Class}>

								<div className="pull-right">
									<div className="form-group">
										<button type="button" className={"btn btn-primary "+this.state.button1Class} onClick={this.handleClick.bind(this, "EnableGoogleAuth")}>Enable Google Auth</button>
									</div>
								</div>

								<div className={this.state.panel2Visible}>
									<div className={classQrDiv}>
										<div className="form-group">
											<div id="qrcode" className="qrcode"></div>
										</div>
									</div>

									<div className={classQRInputs}>
										<div className="form-group">
											<input type="name" className="form-control" readOnly={true} value={this.state.secret}/>
										</div>
									</div>


									<form id="googleForm" onKeyDown={this.handleChange.bind(this, "preventEnter")}>

										<div className={classQRInputs}>
											<div className="form-group">
												<input name="verificationCode" id="gpin" type="text" className="form-control" value={this.state.googlePin}
												onChange={this.handleChange.bind(this, "enterGCode")} placeholder="enter code"/>
											</div>
										</div>
									</form>

									<div className="form-group">
									<div className="pull-right dialog_buttons">

										<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, "saveNewGoogleAuth")}>Save</button>

										<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, "resetGoogleForm")}>Cancel</button>
										</div>
									</div>

								</div>

							</div>
							
							<div className={this.state.panel3Class}>

								<blockquote>
									<p>Using YubiKey Since: <strong>{new Date(app.user.get("Factor2")['since'] * 1000).toLocaleDateString()}</strong></p>
								</blockquote>

								<div className="pull-right">
									<div className="form-group">
										<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, "confirmDisableYubiAuth")}>Disable YubiKey</button>
									</div>
								</div>

							</div>
						<div className={this.state.panel4Class}>
							<div className="pull-right">
								<div className="form-group">
									<button type="button" className={"btn btn-primary "+this.state.button2Class} onClick={this.handleClick.bind(this, "EnableYubiKeyAuth")}>Enable Yubikey</button>
								</div>
							</div>

							<div className={this.state.panel4Visible}>

								<form id="yubiForm" onKeyDown={this.handleChange.bind(this, "preventEnter")}>

									<div className={classQRInputs}>
										<div className="form-group">
											<input name="verificationCode" id="ypin" type="text" className="form-control" value={this.state.yubiPin}
											onChange={this.handleChange.bind(this, "enterYCode")} placeholder="enter code"/>
										</div>
									</div>
								</form>

								<div className="form-group">
									<div className="pull-right dialog_buttons">

										<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, "saveNewYubiAuth")}>Save</button>

										<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, "resetYubiForm")}>Cancel</button>
									</div>
								</div>

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
								<b>Google Authenticator</b> - Increase the security of your login with multi-factor authentication by Google Authenticator. After typing in your login password, you'll be prompted to enter the six digit code displayed in the Authenticator app on your mobile device. To begin the setup, be sure you are on the Google Auth tab and click on "Enable Google Auth" using the Authenticator app on your mobile device and scan the QR code displayed in your CyberFear settings.
							</p>
							<p>
								<b>YubiKey</b> - small usb key, that generates One Time Password in order to protect your account. Please note, that in order to verify a token, the system needs to make request on third party server, that potentially can disclose your login attempt. You can learn more at : https://www.yubico.com/start/
							</p>

						</div>
					</div>
				</div>

			</div>
			);
		},

        /**
         *
         * @param {string} secret
         */
		generateQr: function(secret){
			var qrcode = new QRCode("qrcode", {
				text: "otpauth://totp/"+app.user.get('loginEmail')+"?secret="+secret+"&issuer=CyberFear.com",
				width: 128,
				height: 128,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.M
			});
		}

	});
});