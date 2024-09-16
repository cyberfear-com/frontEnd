define(['react', 'app', 'accounting'], function (React, app, accounting) {
	return React.createClass({
		getInitialState: function () {
			return {

				firstPanelClass: "panel-body",
				firstTab: "active",

				secondTab: "",
				secondPanelClass: "panel-body hidden",

				detailVisible: "",
				detailButtonVisible: "",
				//editDisabled:true,
				editDisabled: true,

				editPlanButtonClass: "",
				saveButtonClass: "hidden",
				toPay: 0,
				forPlan: "",

				mobileViewClass: "visible-xs",
				desktopViewClass: "hidden-xs",

				cancelEditClass: "hidden",

				GBpayNow: "",
				GBprice: 0,
				boxBy: "",
				boxSize: 0,
				newboxSize: 0,
				boxWarning: false,
				boxButtonText: "",

				dompayNow: "",
				cDomain: 0,
				domBy: "",
				domWarning: false,
				Domprice: 0,
				domButtonText: "",

				alpayNow: "",
				aliases: 0,
				alprice: 0,
				newaliases: 0,
				alButtonText: "",
				alWarning: false,

				currentServiceCost: 0,

				paidThisMonth: 0,
				balance: 0,
				cycleStart: '',
				cycleEnd: '',
				monthlyCharge: 0,
				bitcoinPay: "hidden",
				paypalPay: "hidden",
				monthChargeClass: "hidden",
				planSelector: 1,
				howMuch: 0,
				paymentVersion: 0,
				currentPlan: 0,
				setWarning: false,
				paym: "",
				stripeId: ""
			};
		},

		handleClick: async function (i) {
			switch (i) {
				case 'upgradeMember':
					var thisComp = this;
					thisComp.setState({
						toPay: app.user.get("userPlan")['yearSubscr'] / 100 + app.user.get("userPlan")['balance'],
						forPlan: "UpgradeToYear",
						howMuch: 1
					});
					thisComp.handleClick('showSecond');
					break;

				case 'setGB':
					var thisComp = this;
					//if save
					if (this.state.boxButtonText == 'Save') {

						var post = {
							'howMuch': thisComp.state.boxSize,
							'planSelector': 'bSize'
						};

						app.serverCall.ajaxRequest('savePlan', post, function (result) {

							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								thisComp.presetValues();
								thisComp.setState({
									boxBy: "",
									boxButtonText: ""
								});
							} else if (result['response'] == "fail" && result['data'] == "insBal") {} else if (result['response'] == "fail" && result['data'] == "failToSave") {}
						});
					}

					if (this.state.boxButtonText == 'Pay Now') {

						thisComp.setState({
							toPay: this.state.GBpayNow,
							forPlan: "Mail Storage",
							howMuch: thisComp.state.boxSize
						});
						thisComp.handleClick('showSecond');
					}
					//if pay


					break;

				case 'setDom':

					var thisComp = this;
					//if save
					if (this.state.domButtonText == 'Save') {
						console.log(this.state.cDomain);

						var post = {
							'howMuch': thisComp.state.cDomain,
							'planSelector': 'cDomain'
						};

						app.serverCall.ajaxRequest('savePlan', post, function (result) {

							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								//thisComp.handleClick('showFirst');

								thisComp.presetValues();
								thisComp.setState({
									domBy: "",
									domButtonText: ""
								});
							} else if (result['response'] == "fail" && result['data'] == "insBal") {

								//	$('#infoModHead').html("Insufficient Funds");
								//	$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
								//	$('#infoModal').modal('show');

							} else if (result['response'] == "fail" && result['data'] == "failToSave") {
								//	app.notifications.systemMessage('tryAgain');
							}
						});
					}

					if (this.state.domButtonText == 'Pay Now') {
						thisComp.setState({
							toPay: this.state.dompayNow,
							forPlan: "Custom Domain",
							howMuch: thisComp.state.cDomain
						});
						thisComp.handleClick('showSecond');
					}
					//if pay


					break;

				case 'setAl':

					var thisComp = this;
					//if save
					if (this.state.alButtonText == 'Save') {

						var post = {
							'howMuch': thisComp.state.aliases,
							'planSelector': 'alias'
						};

						app.serverCall.ajaxRequest('savePlan', post, function (result) {

							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								//thisComp.handleClick('showFirst');

								thisComp.presetValues();
								thisComp.setState({
									alBy: "",
									alButtonText: ""
								});
							} else if (result['response'] == "fail" && result['data'] == "insBal") {

								//	$('#infoModHead').html("Insufficient Funds");
								//	$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
								//	$('#infoModal').modal('show');

							} else if (result['response'] == "fail" && result['data'] == "failToSave") {
								//	app.notifications.systemMessage('tryAgain');
							}
						});
					}

					if (this.state.alButtonText == 'Pay Now') {

						//console.log(app.user.get("userId"))
						thisComp.setState({
							toPay: this.state.alpayNow,
							forPlan: "Email Aliases",
							howMuch: thisComp.state.aliases
						});
						thisComp.handleClick('showSecond');
					}
					//if pay

					break;

				case 'renew':
					var thisComp = this;
					location.href = "https://mailum.com/mailbox/#login";
					//Backbone.Router().navigate("https://mailum.com/mailbox/#login", {
					//	trigger : true
					//	});

					/*
     						thisComp.setState({
     							toPay:app.user.get("userPlan")['renewAmount'],
     							forPlan:"Subscription Renewal",
     							howMuch:1
     						});*/

					//	thisComp.handleClick('showSecond');

					break;

				case "payEnough":
					var thisComp = this;
					thisComp.setState({
						toPay: app.user.get("userPlan")['priceFullProrated'] + app.user.get("userPlan")['balance'],
						forPlan: "Missing Balance",
						howMuch: 1
					});
					thisComp.handleClick('showSecond');

					break;

				case 'showFirst':

					this.setState({
						firstPanelClass: "panel-body",
						firstTab: "active",

						secondTab: "",
						secondPanelClass: "panel-body hidden",

						editDisabled: true,
						cancelEditClass: "hidden",

						editPlanButtonClass: "",
						saveButtonClass: "hidden",
						paym: ''

					});

					break;

				case 'showSecond':
					this.setState({
						firstPanelClass: "panel-body hidden",
						firstTab: "",

						secondTab: "active",
						secondPanelClass: "panel-body"
					});
					break;

				case "stripe":

					this.setState({
						paym: 'stripe',
						location: "plan",
						email: app.user.get('loginEmail')
					}, async function () {
						await app.stripeCheckOut.start(this);
						await app.stripeCheckOut.checkout(this);
					});

					break;
				case "payPal":
					var thisComp = this;

					thisComp.setState({
						paym: 'paypal'
					});

					var my_script = thisComp.new_script();

					var self = this;
					my_script.then(function () {
						//self.setState({'status': 'done'});
						paypal.Buttons({
							style: {
								shape: 'rect',
								color: 'gold',
								layout: 'vertical',
								label: 'paypal'

							},
							createOrder: function (data, actions) {
								return actions.order.create({
									purchase_units: [{
										amount: {
											value: thisComp.state.toPay
										},
										custom_id: app.user.get("userId"),
										description: thisComp.state.forPlan + "_" + thisComp.state.howMuch
									}],
									application_context: {
										shipping_preference: 'NO_SHIPPING'
									}
								});
							},
							onApprove: function (data, actions) {
								return actions.order.capture().then(function (details) {
									//alert('Transaction completed by ' + details.payer.name.given_name + '!');
									alert('Thank you.');
									thisComp.handleClick.bind(thisComp, 'showFirst');
								});
							}
						}).render('#paypal-button-container');
					}).catch(function () {
						//self.setState({'status': 'error'});
					});

					break;

				case 'showDetail':
					this.setState({
						detailVisible: "",
						detailButtonVisible: "hidden"
						//firstPanelClass:"panel-body hidden",
						//secondPanelClass:"panel-body"
					});
					break;

				case 'pay':
					//$('#bitcoinModal').modal('show');

					break;

			}
		},

		async stripeHandleSubmit(e) {
			console.log('her55');
			e.preventDefault();
			app.stripeCheckOut.setLoading(true);

			var elements = app.stripeCheckOut.get("elements");
			var stripe = app.stripeCheckOut.get("stripe");

			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Make sure to change this to your payment completion page
					return_url: "https://cyber.com/index.html"
				},
				redirect: "if_required"

			});

			try {
				if (paymentIntent.status === "succeeded") {
					console.log('paid2');
					app.stripeCheckOut.showMessage('Payment was accepted. Please wait to be redirected');
					this.handleClick('showFirst');
				}
			} catch (error) {}

			// This point will only be reached if there is an immediate error when
			// confirming the payment. Otherwise, your customer will be redirected to
			// your `return_url`. For some payment methods like iDEAL, your customer will
			// be redirected to an intermediate site first to authorize the payment, then
			// redirected to the `return_url`.
			// console.log(error);
			try {
				if (error.type === "card_error" || error.type === "validation_error") {
					app.stripeCheckOut.showMessage(error.message);
				} else {
					app.stripeCheckOut.showMessage("An unexpected error occured.");
				}
			} catch (error) {}
			app.stripeCheckOut.setLoading(false);
		},

		new_script: function () {
			return new Promise(function (resolve, reject) {
				var script = document.createElement('script');
				script.src = 'https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD';
				script.addEventListener('load', function () {
					resolve();
				});
				script.addEventListener('error', function (e) {
					reject(e);
				});
				document.body.appendChild(script);
			});
		},

		getPlansDataPost: function () {

			var post = {
				'planSelector': this.state.planSelector,
				'howMuch': this.state.howMuch
			};
			return post;
		},

		handleChange: function (i, event) {
			var thisComp = this;
			switch (i) {
				case "changeGB":

					thisComp.setState({
						showButton: true,
						planSelector: 'bSize',
						howMuch: event.target.value,
						boxSize: event.target.value
					}, function () {
						this.calculateNewPrice(function (result) {});
					});
					break;
				case "changeDomain":

					thisComp.setState({
						planSelector: 'cDomain',
						howMuch: event.target.value,
						cDomain: event.target.value
					}, function () {
						this.calculateNewPrice(function (result) {});
					});

					break;

				case "changeAl":

					thisComp.setState({
						planSelector: 'alias',
						howMuch: event.target.value,
						aliases: event.target.value
					}, function () {
						this.calculateNewPrice(function (result) {});
					});

					break;

				//this.calculateNewPrice();
			}
		},

		componentWillUnmount: function () {
			app.user.off("change:userPlan");
		},
		calculateNewPrice: function () {
			var thisComp = this;
			var post = this.getPlansDataPost();

			app.serverCall.ajaxRequest('calculatePrice', post, function (result) {
				if (result['response'] == "success") {

					if (thisComp.state.planSelector == "bSize") {
						if (result['data']['warning'] == "mailbox2small") {
							thisComp.setState({
								boxWarning: true
							});
							//console.log('sdsd');
						} else {
							thisComp.setState({
								boxWarning: false
							});
						}
						if (result['data']['oldPriceYear'] > result['data']['newPriceYear']) {
							thisComp.setState({
								boxButtonText: "Save",
								GBprice: accounting.formatMoney(result['data']['oldPriceYear'] - result['data']['newPriceYear']),
								boxBy: "Plan will be decresed by",
								GBpayNow: ""
							});
						} else if (result['data']['oldPriceYear'] == result['data']['newPriceYear']) {
							thisComp.setState({
								boxButtonText: "",
								GBprice: accounting.formatMoney(result['data']['basePrice'] + result['data']['fullPrice']),
								boxBy: "",
								GBpayNow: ""
							});
						} else if (result['data']['oldPriceYear'] < result['data']['newPriceYear']) {

							if (result['data']['changedByMinusBalance'] <= 0) {
								thisComp.setState({
									boxButtonText: "Save",
									GBprice: accounting.formatMoney(result['data']['newPriceYear'] - result['data']['oldPriceYear']),
									boxBy: "Plan will be increased by",
									GBpayNow: ""
								});
							} else {
								thisComp.setState({
									boxButtonText: "Pay Now",
									GBprice: accounting.formatMoney(result['data']['newPriceYear'] - result['data']['oldPriceYear']),
									boxBy: "Plan will be increased by",
									GBpayNow: result['data']['minimumCharge']
								});
							}
						}
					}

					if (thisComp.state.planSelector == "cDomain") {

						if (result['data']['warning'] == "domain2small") {
							thisComp.setState({
								domWarning: true
							});
							//console.log('sdsd');
						} else {
							thisComp.setState({
								domWarning: false
							});
						}
						if (result['data']['oldPriceYear'] > result['data']['newPriceYear']) {
							thisComp.setState({
								domButtonText: "Save",
								Domprice: accounting.formatMoney(result['data']['oldPriceYear'] - result['data']['newPriceYear']),
								domBy: "Plan will be decresed by",
								dompayNow: ""
							});
						} else if (result['data']['oldPriceYear'] == result['data']['newPriceYear']) {
							thisComp.setState({
								domButtonText: "",
								Domprice: accounting.formatMoney(result['data']['basePrice'] + result['data']['fullPrice']),
								domBy: "",
								dompayNow: ""
							});
						} else if (result['data']['oldPriceYear'] < result['data']['newPriceYear']) {

							if (result['data']['changedByMinusBalance'] <= 0) {
								thisComp.setState({
									domButtonText: "Save",
									Domprice: accounting.formatMoney(result['data']['newPriceYear'] - result['data']['oldPriceYear']),
									domBy: "Plan will be increased by",
									dompayNow: ""
								});
							} else {
								thisComp.setState({
									domButtonText: "Pay Now",
									Domprice: accounting.formatMoney(result['data']['newPriceYear'] - result['data']['oldPriceYear']),
									domBy: "Plan will be increased by",
									dompayNow: result['data']['minimumCharge']
								});
							}
						}
					}

					if (thisComp.state.planSelector == "alias") {

						if (result['data']['warning'] == "alias2small") {
							thisComp.setState({
								alWarning: true
							});
							//console.log('sdsd');
						} else {
							thisComp.setState({
								alWarning: false
							});
						}
						if (result['data']['oldPriceYear'] > result['data']['newPriceYear']) {
							thisComp.setState({
								alButtonText: "Save",
								alprice: accounting.formatMoney(result['data']['oldPriceYear'] - result['data']['newPriceYear']),
								alBy: "Plan will be decresed by",
								alpayNow: ""
							});
						} else if (result['data']['oldPriceYear'] == result['data']['newPriceYear']) {
							thisComp.setState({
								alButtonText: "",
								alprice: accounting.formatMoney(result['data']['basePrice'] + result['data']['fullPrice']),
								alBy: "",
								alpayNow: ""
							});
						} else if (result['data']['oldPriceYear'] < result['data']['newPriceYear']) {

							if (result['data']['changedByMinusBalance'] <= 0) {
								thisComp.setState({
									alButtonText: "Save",
									alprice: accounting.formatMoney(result['data']['newPriceYear'] - result['data']['oldPriceYear']),
									alBy: "Plan will be increased by",
									alpayNow: ""
								});
							} else {
								thisComp.setState({
									alButtonText: "Pay Now",
									alprice: accounting.formatMoney(result['data']['newPriceYear'] - result['data']['oldPriceYear']),
									alBy: "Plan will be increased by",
									alpayNow: result['data']['minimumCharge']
								});
							}
						}
					}
				}
			});
		},

		presetValues: function () {

			var thisComp = this;

			var def = $.Deferred();

			app.userObjects.loadUserPlan(function () {
				def.resolve();
			});

			def.done(function () {

				//	console.log(app.user.get("userPlan"));
				var currentPlan = app.user.get("userPlan");
				var decodedPlan = currentPlan['planData'];

				var timeEnd = new Date(currentPlan['cycleEnd'] * 1000);
				var timeStart = new Date(currentPlan['cycleStart'] * 1000);

				var dateStarted = new Date(currentPlan['created'] * 1000).getTime();
				var goodOld = new Date(2015, 11, 19).getTime();

				var amount = 2;
				if (goodOld > dateStarted) {
					amount = 5;
				}

				if (app.user.get("userPlan")['pastDue'] == 1 && app.user.get("userPlan")['priceFullProrated'] > 0) {

					thisComp.setState({ setWarning: true });
				} else {
					thisComp.setState({ setWarning: false });
				}

				thisComp.setState({

					boxSize: decodedPlan['bSize'],
					cDomain: decodedPlan['cDomain'],
					aliases: decodedPlan['alias'],

					GBprice: 0,
					boxBy: "",
					GBpayNow: "",

					newboxSize: 0,
					boxWarning: false,
					boxButtonText: "",

					domBy: "",
					domWarning: false,
					Domprice: 0,
					domButtonText: "",

					alprice: 0,
					newaliases: 0,
					alButtonText: "",
					alWarning: false,
					alBy: "",
					alButtonText: "",

					dispEmails: decodedPlan['dispos'],

					pgpStrength: decodedPlan['pgpStr'],
					attSize: decodedPlan['attSize'],
					importPGP: decodedPlan['pgpImport'],
					contacts: decodedPlan['contactList'],
					delaySend: decodedPlan['delaySend'],
					sendLimits: decodedPlan['sendLimits'],
					recipPerMail: decodedPlan['recipPerMail'],
					folderExpiration: decodedPlan['folderExpire'],
					secLog: decodedPlan['secLog'],
					filtEmail: decodedPlan['filter'],
					claimAmount: amount,
					//isAlrdClaimed:currentPlan['creditUsed'],
					isAlrdClaimed: true,

					cycleEnd: timeEnd.toLocaleDateString(),
					cycleStart: timeStart.toLocaleDateString()
				});

				// setTimeout(function(){
				//     thisComp.calculateNewPrice();
				// },100);

			});
		},

		componentDidMount: function () {
			var thisComp = this;

			this.presetValues();
			app.user.on("change:userPlan", function () {
				this.setState({
					"boxButtonText": "",
					"domButtonText": "",
					"alButtonText": "",
					"boxBy": "",
					"GBpayNow": "",
					"dompayNow": "",
					"alpayNow": "",
					"domBy": "",
					"alBy": "",
					"boxWarning": "",
					"domWarning": "",
					"alWarning": "",
					"boxSize": app.user.get("userPlan")['planData']['bSize'],
					"cDomain": app.user.get("userPlan")['planData']['cDomain'],
					"aliases": app.user.get("userPlan")['planData']['alias']

				});
			}, this);
		},

		componentWillUnmount: function () {
			app.user.off("change:userPlan");
		},

		accountDataTable: function () {

			var options = [];
			var toP = accounting.formatMoney(app.user.get("userPlan")['priceFullProrated'] + app.user.get("userPlan")['balance'], '$', 2);
			var paid = [];

			/*  if(app.user.get("userPlan")['balance']<0){
         paid.push(<span key="sd1" className='txt-color-red'>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
         paid.push( <span  key="sd2"  className="pull-right txt-color-red">Account is past due.</span>);
     }else{
         paid.push(<span key="sd1" className=''>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
     }*/
			//

			//console.log(app.user.get("userPlan"));
			//console.log(app.user.get('balanceShort'));
			var ys = "";
			if (app.user.get("userPlan")['priceFullProrated'] > 0 && app.user.get("userPlan")['pastDue'] == 0) {
				ys = "Partialy PAID";
			}

			if (app.user.get("userPlan")['pastDue'] == 1) {
				ys = "UNPAID";
			} else {
				ys = "PAID";
			}

			//what button to show
			//if pastdue and alrdpaid=0 then renew
			//if pastdue and alrd paid then missing balance

			options.push(React.createElement(
				'tr',
				{ key: '1c' },
				React.createElement(
					'td',
					{ className: 'col-md-6' },
					React.createElement(
						'b',
						null,
						'Current Plan:'
					)
				),
				React.createElement(
					'td',
					null,
					'From: ',
					new Date(app.user.get("userPlan")['cycleStart'] * 1000).toLocaleDateString(),
					React.createElement('br', null),
					'Until: ',
					new Date(app.user.get("userPlan")['cycleEnd'] * 1000).toLocaleDateString()
				),
				React.createElement(
					'td',
					{ className: 'col-md-3' },
					'Status: ',
					React.createElement(
						'b',
						null,
						ys
					),
					React.createElement(
						'div',
						{ className: 'pull-right dialog_buttons' },
						React.createElement(
							'button',
							{ type: 'button', className: app.user.get("userPlan")['needFill'] ? "btn btn-primary pull-right" : "hidden", onClick: this.handleClick.bind(this, 'renew') },
							'Pay Missing Balance'
						),
						React.createElement(
							'button',
							{ type: 'button', className: app.user.get("userPlan")['needRenew'] ? "btn btn-primary pull-right" : "hidden", onClick: this.handleClick.bind(this, 'renew') },
							'Renew Plan'
						)
					)
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
						app.user.get("userPlan")['planSelected'] == 1 ? "Yearly" : "Monthly",
						' Cost:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['monthlyCharge'])
				),
				React.createElement('td', null)
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
						'Paid This Cycle:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['alrdPaid'])
				),
				React.createElement('td', null)
			));

			//if(app.user.get("userPlan")['balance']>0){
			options.push(React.createElement(
				'tr',
				{ key: '3a', className: app.user.get("userPlan")['balance'] == 0 ? "hidden" : "" },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Previous Unpaid Balance:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['balance'])
				),
				React.createElement('td', null)
			));

			options.push(React.createElement(
				'tr',
				{ key: '3b', className: app.user.get("userPlan")['currentPlanBalance'] == 0 ? "hidden" : "" },
				React.createElement(
					'td',
					null,
					React.createElement(
						'b',
						null,
						'Unused Credit:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['currentPlanBalance'])
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
						'Rewards:'
					)
				),
				React.createElement(
					'td',
					null,
					accounting.formatMoney(app.user.get("userPlan")['rewardCollected'], '$', 3)
				),
				React.createElement('td', null)
			));

			//}


			return options;
		},
		planTable: function () {
			var options = [];

			//Mailbox Size
			var boxDif = "";
			var bxS = this.state.newboxSize;

			if (this.state.newboxSize != this.state.boxSize) {
				boxDif = " => " + (bxS > 1000 ? bxS / 1000 + " Gb" : bxS + " MB");
			}
			options.push(React.createElement(
				'tr',
				{ key: '1' },
				React.createElement(
					'td',
					{ className: 'col-xs-5 no-right-padding' },
					React.createElement(
						'b',
						null,
						'Mailbox Size:'
					)
				),
				React.createElement(
					'td',
					{ className: 'col-xs-7' },
					app.user.get("userPlan")['planData']['bSize'] >= 1000 ? app.user.get("userPlan")['planData']['bSize'] / 1000 + " Gb" : app.user.get("userPlan")['planData']['bSize'] + " MB"
				)
			));

			options.push(React.createElement(
				'tr',
				{ key: '2', className: '' },
				React.createElement(
					'td',
					{ className: 'col-xs-5 no-right-padding' },
					React.createElement(
						'b',
						null,
						'Custom Domain:'
					)
				),
				React.createElement(
					'td',
					{ className: 'col-xs-7' },
					app.user.get("userPlan")['planData']['cDomain']
				)
			));

			var alDif = "";
			if (this.state.newaliases != this.state.aliases) {
				var alDif = " => " + this.state.newaliases;
			}
			options.push(React.createElement(
				'tr',
				{ key: '3', className: '' },
				React.createElement(
					'td',
					{ className: 'col-xs-5' },
					React.createElement(
						'b',
						null,
						'Custom Aliases:'
					)
				),
				React.createElement(
					'td',
					null,
					app.user.get("userPlan")['planData']['alias']
				)
			));

			return options;
		},
		render: function () {

			var classFullSettSelect = "col-xs-12";

			return React.createElement(
				'div',
				{ className: this.props.classes.rightClass, id: 'rightSettingPanel' },
				React.createElement(
					'div',
					{ className: 'col-lg-10 col-xs-12 personal-info ' },
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
									{ role: 'presentation', className: this.state.firstTab },
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'showFirst') },
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Features'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'ion-bag' })
										)
									)
								),
								React.createElement(
									'li',
									{ role: 'presentation', className: this.state.secondTab },
									React.createElement(
										'a',
										{ className: this.state.secondTab == "active" ? "" : "hidden" },
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Pay Now'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'fa fa-credit-card' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.firstPanelClass },
							React.createElement(
								'h3',
								{ className: app.user.get("userPlan")['pastDue'] !== 1 ? "txt-color-green" : "hidden" },
								'Please log in via ',
								React.createElement(
									'a',
									{ href: 'https://mailum.com/mailbox/#login' },
									'Mailum.com'
								),
								' to upgrade and access premium features.',
								React.createElement('br', null),
								React.createElement('br', null)
							),
							React.createElement(
								'h3',
								{ className: app.user.get("userPlan")['pastDue'] === 1 ? "txt-color-red" : "hidden" },
								'Pay your balance to send and receive emails. Your email functionality is limited to access to previous emails only. (You can refill your balance using our new site: ',
								React.createElement(
									'a',
									{ href: 'https://mailum.com/mailbox/#login' },
									'Mailum.com'
								),
								')'
							),
							React.createElement(
								'h3',
								{ className: app.user.get("userPlan")['needRenew'] ? "txt-color-red" : "hidden" },
								'Renew your service soon to avoid service interruption. Your email functionality will be limited to access to previous emails only.(You can refill your balance using our new site: ',
								React.createElement(
									'a',
									{ href: 'https://mailum.com/mailbox/#login' },
									'Mailum.com'
								)
							),
							React.createElement(
								'h3',
								{ className: 'pull-left' },
								'Account:'
							),
							React.createElement(
								'table',
								{ className: ' table table-hover table-striped datatable table-light' },
								this.accountDataTable()
							),
							React.createElement(
								'h3',
								{ className: 'pull-left' },
								'Your current plan have following features:'
							),
							React.createElement(
								'table',
								{ className: ' table table-hover table-striped datatable table-light' },
								this.planTable()
							),
							React.createElement(
								'h3',
								{ className: 'pull-left' },
								'Add/Remove features:'
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement(
								'span',
								{ className: 'col-lg-12' },
								'* - current Plan'
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement(
								'div',
								{ className: 'row' },
								React.createElement(
									'div',
									{ className: 'col-md-12 col-lg-4' },
									React.createElement(
										'div',
										{ className: 'panel panel-default' },
										React.createElement(
											'div',
											{ className: 'panel-body disable' },
											React.createElement(
												'h5',
												null,
												React.createElement(
													'b',
													null,
													'Mailbox Space'
												)
											),
											React.createElement(
												'div',
												{ className: 'form-horizontal margin-left-0' },
												React.createElement(
													'label',
													{ className: 'col-lg-7 col-sm-12 control-label' },
													'Set Space in GB:'
												),
												React.createElement(
													'div',
													{ className: 'col-lg-5 col-sm-12' },
													React.createElement(
														'select',
														{ className: 'form-control', value: this.state.boxSize, disabled: true, key: 'editor1' },
														React.createElement(
															'option',
															{ value: '1000' },
															app.user.get("userPlan")['planData']['bSize'] == 1000 ? "1 GB*" : "1 GB"
														),
														React.createElement(
															'option',
															{ value: '5000' },
															app.user.get("userPlan")['planData']['bSize'] == 5000 ? "5 GB*" : "5 GB"
														),
														React.createElement(
															'option',
															{ value: '10000' },
															app.user.get("userPlan")['planData']['bSize'] == 10000 ? "10 GB*" : "10 GB"
														),
														React.createElement(
															'option',
															{ value: '15000' },
															app.user.get("userPlan")['planData']['bSize'] == 15000 ? "15 GB*" : "15 GB"
														)
													)
												),
												React.createElement(
													'label',
													{ className: this.state.boxBy != "" ? "col-lg-7 col-sm-12 control-label" : "hidden" },
													this.state.boxBy,
													': '
												),
												React.createElement(
													'label',
													{ className: this.state.boxBy != "" ? "col-lg-5 col-sm-12 control-label text-align-left" : "hidden" },
													this.state.GBprice,
													' / Year'
												),
												React.createElement(
													'label',
													{ className: this.state.GBpayNow !== "" ? "col-lg-7 col-sm-12 control-label" : "hidden" },
													'Amount to pay now: '
												),
												React.createElement(
													'label',
													{ className: this.state.GBpayNow !== "" ? "col-lg-5 col-sm-12 control-label text-align-left" : "hidden" },
													'$',
													this.state.GBpayNow
												),
												React.createElement('div', { className: 'clearfix' }),
												React.createElement(
													'span',
													{ className: this.state.boxWarning ? "txt-color-red" : "hidden" },
													'Your current email box larger than requested size, please delete emails or increase the size'
												),
												React.createElement(
													'div',
													{ className: 'col-lg-12 margin-top-20 hidden' },
													React.createElement(
														'button',
														{ type: 'button', className: this.state.boxButtonText != "" && !this.state.boxWarning ? "btn btn-primary pull-right" : "hidden", onClick: this.handleClick.bind(this, 'setGB') },
														this.state.boxButtonText
													)
												)
											)
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'col-md-12 col-lg-4' },
									React.createElement(
										'div',
										{ className: 'panel panel-default' },
										React.createElement(
											'div',
											{ className: 'panel-body' },
											React.createElement(
												'h5',
												null,
												React.createElement(
													'b',
													null,
													'Custom Domain'
												)
											),
											React.createElement(
												'div',
												{ className: 'form-horizontal margin-left-0' },
												React.createElement(
													'label',
													{ className: 'col-lg-7 col-sm-12 control-label' },
													'Number Of Domains:'
												),
												React.createElement(
													'div',
													{ className: 'col-lg-5 col-sm-12' },
													React.createElement(
														'select',
														{ className: 'form-control', value: this.state.cDomain, disabled: true },
														React.createElement(
															'option',
															{ value: '0' },
															app.user.get("userPlan")['planData']['cDomain'] == 0 ? "0*" : "0"
														),
														React.createElement(
															'option',
															{ value: '1' },
															app.user.get("userPlan")['planData']['cDomain'] == 1 ? "1*" : "1"
														),
														React.createElement(
															'option',
															{ value: '2' },
															app.user.get("userPlan")['planData']['cDomain'] == 2 ? "2*" : "2"
														),
														React.createElement(
															'option',
															{ value: '3' },
															app.user.get("userPlan")['planData']['cDomain'] == 3 ? "3*" : "3"
														)
													)
												),
												React.createElement(
													'label',
													{ className: this.state.domBy != "" ? "col-lg-7 col-sm-12 control-label" : "hidden" },
													this.state.domBy,
													':'
												),
												React.createElement(
													'label',
													{ className: this.state.domBy != "" ? "col-lg-5 col-sm-12 control-label text-align-left" : "hidden" },
													this.state.Domprice,
													' / Year'
												),
												React.createElement(
													'label',
													{ className: this.state.dompayNow !== "" ? "col-lg-7 col-sm-12 control-label" : "hidden" },
													'Amount to pay now: '
												),
												React.createElement(
													'label',
													{ className: this.state.dompayNow !== "" ? "col-lg-5 col-sm-12 control-label text-align-left" : "hidden" },
													'$',
													this.state.dompayNow
												),
												React.createElement('div', { className: 'clearfix' }),
												React.createElement(
													'span',
													{ className: this.state.domWarning ? "txt-color-red" : "hidden" },
													'Your currently have more domain registered than new plan allowed, please remove unneeded  domain(s) or increase plan'
												),
												React.createElement(
													'div',
													{ className: 'col-lg-12 margin-top-20 hidden' },
													React.createElement(
														'button',
														{ type: 'button', className: this.state.domButtonText != "" && !this.state.domWarning ? "btn btn-primary pull-right" : "hidden", onClick: this.handleClick.bind(this, 'setDom') },
														this.state.domButtonText
													)
												)
											)
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'col-md-12 col-lg-4' },
									React.createElement(
										'div',
										{ className: 'panel panel-default' },
										React.createElement(
											'div',
											{ className: 'panel-body' },
											React.createElement(
												'h5',
												null,
												React.createElement(
													'b',
													null,
													'Custom Alias'
												)
											),
											React.createElement(
												'div',
												{ className: 'form-horizontal margin-left-0' },
												React.createElement(
													'label',
													{ className: 'col-lg-8 col-sm-12 control-label' },
													'Number of aliases:'
												),
												React.createElement(
													'div',
													{ className: 'col-lg-4 col-sm-12' },
													React.createElement(
														'select',
														{ className: 'form-control', value: this.state.aliases, disabled: true },
														React.createElement(
															'option',
															{ value: '0' },
															app.user.get("userPlan")['planData']['alias'] == 0 ? "0*" : "0"
														),
														React.createElement(
															'option',
															{ value: '1' },
															app.user.get("userPlan")['planData']['alias'] == 1 ? "1*" : "1"
														),
														React.createElement(
															'option',
															{ value: '5' },
															app.user.get("userPlan")['planData']['alias'] == 5 ? "5*" : "5"
														),
														React.createElement(
															'option',
															{ value: '10' },
															app.user.get("userPlan")['planData']['alias'] == 10 ? "10*" : "10"
														)
													)
												),
												React.createElement(
													'label',
													{ className: this.state.alBy != "" ? "col-lg-7 col-sm-12 control-label" : "hidden" },
													this.state.alBy,
													':'
												),
												React.createElement(
													'label',
													{ className: this.state.alBy != "" ? "col-lg-5 col-sm-12 control-label text-align-left" : "hidden" },
													this.state.alprice,
													' / Year'
												),
												React.createElement(
													'label',
													{ className: this.state.alpayNow !== "" ? "col-lg-7 col-sm-12 control-label" : "hidden" },
													'Amount to pay now: '
												),
												React.createElement(
													'label',
													{ className: this.state.alpayNow !== "" ? "col-lg-5 col-sm-12 control-label text-align-left" : "hidden" },
													'$',
													this.state.alpayNow
												),
												React.createElement(
													'span',
													{ className: this.state.alWarning ? "txt-color-red" : "hidden" },
													'Your currently have more aliases registered than plan you selected, please remove unneeded  aliase(s) or increase plan'
												),
												React.createElement(
													'div',
													{ className: 'col-lg-12 margin-top-20 hidden' },
													React.createElement(
														'button',
														{ type: 'button', className: this.state.alButtonText != "" && !this.state.alWarning ? "btn btn-primary pull-right" : "hidden", onClick: this.handleClick.bind(this, 'setAl') },
														this.state.alButtonText
													)
												)
											)
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.secondPanelClass },
							React.createElement(
								'h3',
								{ className: 'hidden' },
								'Payment'
							),
							React.createElement(
								'div',
								{ className: 'pull-right dialog_buttons', style: { lineHeight: "40px" } },
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-primary', onClick: this.handleClick.bind(this, 'payPal') },
									'Pay With PayPal'
								),
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-primary', form: 'crypF', onClick: this.handleClick.bind(this, 'showFirst') },
									'Pay With CoinPayments'
								),
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-primary', form: 'perfF', onClick: this.handleClick.bind(this, 'showFirst') },
									'Pay With Perfect Money'
								),
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-primary', onClick: this.handleClick.bind(this, 'stripe') },
									'Pay With stripe (Credit / Debit Card)'
								),
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-default', onClick: this.handleClick.bind(this, 'showFirst') },
									'Cancel'
								)
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement(
								'div',
								{ className: 'bold margin-top-20' },
								'Info: ',
								React.createElement(
									'i',
									{ className: '' },
									'It may take some time to reflect new balance after successfull payment. ',
									React.createElement('br', null),
									' If you pay with bitcoin, make sure you enter exact amount you are willing to pay, otherwise it may be marked as mispayment.'
								)
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement('div', { className: this.state.paym == "paypal" ? "" : "hidden", id: 'paypal-button-container' }),
							React.createElement(
								'div',
								{ className: this.state.paym == "stripe" ? "" : "hidden", id: 'stripe-container' },
								React.createElement(
									'form',
									{ id: 'payment-form' },
									React.createElement('div', { id: 'payment-element' }),
									React.createElement(
										'button',
										{ id: 'submit' },
										React.createElement('div', { className: 'spinner hidden', id: 'spinner' }),
										React.createElement(
											'span',
											{ id: 'button-text' },
											'Pay now'
										)
									),
									React.createElement('div', { id: 'payment-message', className: 'hidden' })
								)
							)
						)
					)
				),
				React.createElement(
					'form',
					{ className: 'hidden', id: 'perfF', action: 'https://perfectmoney.com/api/step1.asp', method: 'POST', target: '_blank' },
					React.createElement('input', { type: 'hidden', name: 'PAYEE_ACCOUNT', value: app.defaults.get('perfectMecrh') }),
					React.createElement('input', { type: 'hidden', name: 'PAYEE_NAME', value: 'Cyber Fear' }),
					React.createElement('input', { type: 'hidden', name: 'PAYMENT_AMOUNT', value: this.state.toPay }),
					React.createElement('input', { type: 'hidden', name: 'PAYMENT_UNITS', value: 'USD' }),
					React.createElement('input', { type: 'hidden', name: 'STATUS_URL', value: 'https://cyberfear.com/api/PerfectPaidstatus' }),
					React.createElement('input', { type: 'hidden', name: 'PAYMENT_URL', value: 'https://cyberfear.com/api/Pe' }),
					React.createElement('input', { type: 'hidden', name: 'PAYMENT_URL_METHOD', value: 'POST' }),
					React.createElement('input', { type: 'hidden', name: 'NOPAYMENT_URL', value: 'https://cyberfear.com/api/Pe' }),
					React.createElement('input', { type: 'hidden', name: 'NOPAYMENT_URL_METHOD', value: 'LINK' }),
					React.createElement('input', { type: 'hidden', name: 'SUGGESTED_MEMO', value: '' }),
					React.createElement('input', { type: 'hidden', name: 'userId', value: app.user.get("userId") }),
					React.createElement('input', { type: 'hidden', name: 'paymentFor', value: this.state.forPlan }),
					React.createElement('input', { type: 'hidden', name: 'howMuch', value: this.state.howMuch }),
					React.createElement('input', { type: 'hidden', name: 'BAGGAGE_FIELDS', value: 'userId paymentFor howMuch' })
				),
				React.createElement(
					'form',
					{ className: 'hidden', id: 'crypF', action: 'https://www.coinpayments.net/index.php', method: 'post', target: '_blank', ref: 'crypto' },
					React.createElement('input', { type: 'hidden', name: 'cmd', value: '_pay_simple' }),
					React.createElement('input', { type: 'hidden', name: 'reset', value: '1' }),
					React.createElement('input', { type: 'hidden', name: 'first_name', value: 'anonymous' }),
					React.createElement('input', { type: 'hidden', name: 'last_name', value: 'anonymous' }),
					React.createElement('input', { type: 'hidden', name: 'email', value: 'anonymous@cyberfear.com' }),
					React.createElement('input', { type: 'hidden', name: 'merchant', value: app.defaults.get('coinMecrh') }),
					React.createElement('input', { type: 'hidden', name: 'item_amount', value: this.state.howMuch }),
					React.createElement('input', { type: 'hidden', name: 'item_name', value: this.state.forPlan }),
					React.createElement('input', { type: 'hidden', name: 'item_desc', value: this.state.forPlan }),
					React.createElement('input', { type: 'hidden', name: 'custom', value: app.user.get("userId") }),
					React.createElement('input', { type: 'hidden', name: 'currency', value: 'USD' }),
					React.createElement('input', { type: 'hidden', name: 'amountf', value: this.state.toPay }),
					React.createElement('input', { type: 'hidden', name: 'want_shipping', value: '0' }),
					React.createElement('input', { type: 'hidden', name: 'success_url', value: 'https://cyberfear.com/api/Pe' }),
					React.createElement('input', { type: 'hidden', name: 'cancel_url', value: 'https://cyberfear.com/api/Pe' })
				)
			);
		}

	});
});