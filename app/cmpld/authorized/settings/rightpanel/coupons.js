define(['react', 'app', 'accounting'], function (React, app, accounting) {
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
		getInitialState: function () {
			return {
				nav1Class: "",
				nav2Class: "",
				panel1Class: "", //goog enab
				button1Class: "",
				CouponHistory: "",
				invited: 0,
				paid: 0,
				reward: 0,
				pendingReward: 0,
				discount: 0,
				rewardPaid: 0,
				alreadyAwarded: 0

			};
		},

		panelsReset: function () {
			this.setState({
				nav1Class: "",
				nav2Class: "",

				panel1Class: "",

				button1Class: ""

			});
		},

		CouponHistory: function () {

			var options = [];

			var paid = [];

			/*  if(app.user.get("userPlan")['balance']<0){
                  paid.push(<span key="sd1" className='txt-color-red'>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
                  paid.push( <span  key="sd2"  className="pull-right txt-color-red">Account is past due.</span>);
              }else{
                  paid.push(<span key="sd1" className=''>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
              }*/
			//


			options.push(React.createElement(
				'tr',
				{ key: '1a' },
				React.createElement(
					'td',
					{ className: 'col-md-6' },
					React.createElement(
						'b',
						null,
						'Your Unique Coupon:'
					)
				),
				React.createElement(
					'td',
					{ colSpan: '2' },
					app.user.get("userPlan")['coupon']
				)
			));

			options.push(React.createElement(
				'tr',
				{ key: '1b' },
				React.createElement(
					'td',
					{ className: 'col-md-6' },
					React.createElement(
						'b',
						null,
						'Invitation Link:'
					)
				),
				React.createElement(
					'td',
					null,
					'https://cyberfear.com/index.html#createUser/',
					app.user.get("userPlan")['coupon']
				),
				React.createElement(
					'td',
					null,
					React.createElement(
						'div',
						{ className: 'pull-right dialog_buttons col-md-3' },
						React.createElement(
							'button',
							{ type: 'button', className: 'btn btn-primary pull-right', onClick: this.handleClick.bind(this, 'copyToClipboard') },
							'Copy Link'
						)
					)
				)
			));

			options.push(React.createElement(
				'tr',
				{ key: '1c' },
				React.createElement(
					'td',
					{ className: 'col-md-6' },
					React.createElement(
						'b',
						null,
						'Discount for new user:'
					)
				),
				React.createElement(
					'td',
					null,
					this.state.discount,
					'%'
				)
			));

			options.push(React.createElement(
				'tr',
				{ key: '1d' },
				React.createElement(
					'td',
					{ className: 'col-md-6' },
					React.createElement(
						'b',
						null,
						'Reward for you:'
					)
				),
				React.createElement(
					'td',
					{ colSpan: '2' },
					this.state.reward,
					'%'
				)
			));

			options.push(React.createElement(
				'tr',
				{ key: '2a' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Registered using your link:'
					)
				),
				React.createElement(
					'td',
					{ colSpan: '2' },
					this.state.invited
				)
			));

			options.push(React.createElement(
				'tr',
				{ key: '2c' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Registered and paid:'
					)
				),
				React.createElement(
					'td',
					null,
					this.state.paid
				),
				React.createElement('td', null)
			));

			options.push(React.createElement(
				'tr',
				{ key: '3b' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Total Reward:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['rewardCollected'], '$', 2)
				),
				React.createElement('td', null)
			));
			//if(app.user.get("userPlan")['balance']>0){


			options.push(React.createElement(
				'tr',
				{ key: '3ba' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Pending Reward:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(this.state.pendingReward, '$', 2)
				),
				React.createElement('td', null)
			));

			options.push(React.createElement(
				'tr',
				{ key: '3c' },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Reward already paid:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['rewardPaid'], '$', 2)
				),
				React.createElement('td', null)
			));

			//}


			return options;
		},

		whatToShow: function () {

			this.setState({
				nav1Class: "active",
				nav2Class: "",
				nav1Click: "show1Panel",
				nav2Click: "show2Panel",

				panel1Class: "",
				button1Class: ""
			});
		},

		componentDidMount: function () {
			this.whatToShow();
			var thisComp = this;

			app.serverCall.ajaxRequest('RetrieveCoupData', {}, function (result) {
				//console.log(result);
				thisComp.setState({
					invited: result['invited'],
					paid: result['paid'],
					reward: result['reward'],
					alreadyAwarded: result['totalAwarded'],
					pendingReward: result['pendingAward'],
					discount: result['discount'],
					rewardPaid: 0
				});
			});
		},

		/**
   *
   * @param {string} action
   * @param {string} event
   */
		handleClick: function (action, event) {
			switch (action) {
				case 'show1Panel':

					break;

				case 'show2Panel':
					this.handleClick('resetYubiForm');

					break;

				case "copyToClipboard":
					var $temp = $("<input>");
					$("body").append($temp);
					$temp.val('https://cyberfear.com/index.html#createUser/' + app.user.get("userPlan")['coupon']).select();
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
			switch (action) {}
		},

		/**
   *
   * @returns {JSX}
   */
		render: function () {
			var classQRInputs = "col-xs-12 col-sm-8 col-md-9";
			var classQrDiv = "col-xs-12 col-sm-4 col-md-3";

			return React.createElement(
				'div',
				{ className: this.props.classes.rightClass, id: 'rightSettingPanel' },
				React.createElement(
					'div',
					{ className: 'col-lg-7 col-xs-12 personal-info ' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'ul',
								{ className: 'nav nav-tabs tabbed-nav' },
								React.createElement(
									'li',
									{ className: this.state.nav1Class },
									React.createElement(
										'a',
										null,
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Coupons'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'fa fa-qrcode' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.panel1Class },
							React.createElement(
								'table',
								{ className: ' table table-hover table-striped datatable table-light margin-top-20' },
								this.CouponHistory()
							)
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-5 col-xs-12 personal-info ' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'h3',
								{ className: 'panel-title personal-info-title' },
								'Help'
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-body' },
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Coupons serve 2 purposes:'
								),
								React.createElement('br', null),
								'- discount for new users',
								React.createElement('br', null),
								'- reward for you',
								React.createElement('br', null),
								React.createElement('br', null),
								React.createElement(
									'b',
									null,
									'Example:'
								),
								React.createElement('br', null),
								'You copy your coupon link and send it to your friend John.',
								React.createElement('br', null),
								'John clicks on your link and creates an account.',
								React.createElement('br', null),
								'John selects yearly subscription for $18.',
								React.createElement('br', null),
								'Thanks to your coupon, the price gets decreased by 10% which makes it $16.20 instead of $18.',
								React.createElement('br', null),
								'John saves $1.8. (10% of 18.00)',
								React.createElement('br', null),
								'You receive $3.24 reward. (20% of 16.20)',
								React.createElement('br', null),
								'CyberFear gains a new member.',
								React.createElement('br', null),
								React.createElement('br', null),
								'You can share your link with multiple people, it will always provide the discount and reward.',
								React.createElement('br', null),
								'You can withdraw your rewards when you like to.',
								React.createElement('br', null),
								React.createElement('br', null),
								'Payments made by crypto and Perfect Money are instantly available for withdrawal.',
								React.createElement('br', null),
								'Payments made by PayPal will be pending for 30 days before they can be withdrawn.',
								React.createElement('br', null),
								React.createElement(
									'b',
									null,
									'Minimum withdrawal: $10.00'
								),
								React.createElement('br', null)
							)
						)
					)
				)
			);
		}

	});
});