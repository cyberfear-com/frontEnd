define(['react','app','accounting'], function (React,app,accounting) {
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
				panel1Class:"", //goog enab
				button1Class:"",
				CouponHistory:"",
                invited:0,
                paid:0,
                reward:0,
				pendingReward:0,
                rewardPaid:0,
				alreadyAwarded:0

			};
		},

		panelsReset: function(){
			this.setState({
				nav1Class:"",
				nav2Class:"",

				panel1Class:"",

				button1Class:""

			});
		},

		CouponHistory: function () {

			var options = [];

			var paid=[];

			/*  if(app.user.get("userPlan")['balance']<0){
                  paid.push(<span key="sd1" className='txt-color-red'>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
                  paid.push( <span  key="sd2"  className="pull-right txt-color-red">Account is past due.</span>);
              }else{
                  paid.push(<span key="sd1" className=''>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
              }*/
			//


			options.push(<tr key="1a">
				<td className="col-md-6">
					<b>Your Unique Coupon:</b>
				</td>
				<td colSpan="2">{app.user.get("userPlan")['coupon']}</td>



			</tr>);

			options.push(<tr key="1b">
				<td className="col-md-6">
					<b>Invitation Link:</b>
				</td>
				<td>https://cyberfear.com/index.html#createUser/{app.user.get("userPlan")['coupon']}


				</td>
				<td><div className="pull-right dialog_buttons col-md-3">
					<button type="button" className="btn btn-primary pull-right" onClick={this.handleClick.bind(this, 'copyToClipboard')}>Copy Link</button>

				</div></td>

			</tr>);

			options.push(<tr key="2a">
				<td>
					<b>Registered using your link:</b>
				</td>
				<td colSpan="2">{this.state.invited}
				</td>

			</tr>);

			options.push(<tr key="2c">
				<td>
					<b>Registered and paid:</b>
				</td>
				<td>{this.state.paid}
				</td>
				<td></td>
			</tr>);

			//if(app.user.get("userPlan")['balance']>0){
			options.push(<tr key="3a">
				<td>
					<b>Current reward per account signup:</b>
				</td>
				<td>{accounting.formatMoney(this.state.reward[2])+" / "+accounting.formatMoney(this.state.reward[1])+" (month/year)"}
				</td>
				<td></td>
			</tr>);

			options.push(<tr key="3b">
				<td>
					<b>Total Reward:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['rewardCollected']+this.state.alreadyAwarded,'$',2)}
				</td>
				<td></td>
			</tr>);

			options.push(<tr key="3ba">
				<td>
					<b>Pending Reward:</b>
				</td>
				<td>{accounting.formatMoney(this.state.pendingReward,'$',2)}
				</td>
				<td></td>
			</tr>);

			options.push(<tr key="3c">
				<td>
					<b>Reward already paid:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['rewardPaid'],'$',2)}
				</td>
				<td></td>
			</tr>);


			//}


			return options;

		},

		whatToShow: function () {

				this.setState({
					nav1Class:"active",
					nav2Class:"",
					nav1Click:"show1Panel",
					nav2Click:"show2Panel",

					panel1Class:"",
					button1Class:""
				});

		},

		componentDidMount: function () {
			this.whatToShow();
			var thisComp=this;

			app.serverCall.ajaxRequest('RetrieveCoupData', {}, function (result) {
				//console.log(result);
				thisComp.setState({
                    invited:result['invited'],
                    paid:result['paid'],
                    reward:result['reward'],
					alreadyAwarded:result['totalAwarded'],
					pendingReward:result['pendingAward'],
                    rewardPaid:0
                });
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

				case "copyToClipboard":
					var $temp = $("<input>");
					$("body").append($temp);
					$temp.val('https://cyberfear.com/index.html#createUser/'+app.user.get("userPlan")['coupon']).select();
					document.execCommand("copy");
					$temp.remove();
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

								<table className=" table table-hover table-striped datatable table-light margin-top-20">
									{this.CouponHistory()}
								</table>

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


	});
});