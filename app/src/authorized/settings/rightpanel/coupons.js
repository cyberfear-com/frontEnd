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

			app.serverCall.ajaxRequest('RetrieveCoupData', {}, function (result) {
				console.log(result);
			})

		},

        /**
         *
         * @param {string} action
         * @param {string} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'show1Panel':

					break;

				case 'show2Panel':
					this.handleClick('resetYubiForm');

					break;

				case 'enableLink':
					var dfd = jQuery.Deferred();

					var post={};

					app.serverCall.ajaxRequest('requestInvLink', post, function (result) {
						console.log(result);
					})

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
									<a>
										<h3 className={this.props.tabs.Header}>Affiliate Dashboard</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-qrcode"></i></h3>
									</a>
								</li>
							</ul>
						</div>

							<div className={this.state.panel1Class}>
								<blockquote>
									<p>Using Google AUTH Since: <strong>{new Date(app.user.get("Factor2")['since'] * 1000).toLocaleDateString()}</strong></p>
								</blockquote>

							</div>



							<div className={this.state.panel2Class}>

								<div className="pull-right">
									<div className="form-group">
										<button type="button" className={"btn btn-primary "+this.state.button1Class} onClick={this.handleClick.bind(this, "enableLink")}>Generate Invitation Link</button>
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