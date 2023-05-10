define(['react', 'app','accounting'], function (React, app,accounting) {
	return React.createClass({
		getInitialState: function () {
			return {

				firstPanelClass: "panel-body",
				firstTab: "active",

				secondTab:"",
				secondPanelClass:"panel-body hidden",

				detailVisible: "",
				detailButtonVisible: "",
				//editDisabled:true,
				editDisabled: true,

				editPlanButtonClass:"",
				saveButtonClass:"hidden",
				toPay:0,
				forPlan:"",

				mobileViewClass: "visible-xs",
				desktopViewClass: "hidden-xs",

				cancelEditClass:"hidden",


				GBpayNow:"",
				GBprice:0,
				boxBy:"",
				boxSize: 0,
                newboxSize:0,
				boxWarning:false,
				boxButtonText:"",

				dompayNow:"",
                cDomain: 0,
				domBy:"",
				domWarning:false,
				Domprice:0,
				domButtonText:"",

				alpayNow:"",
                aliases: 0,
				alprice:0,
                newaliases:0,
				alButtonText:"",
				alWarning:false,

				currentServiceCost:0,

				paidThisMonth:0,
				balance:0,
				cycleStart:'',
				cycleEnd:'',
				monthlyCharge:0,
				bitcoinPay:"hidden",
				paypalPay:"hidden",
				monthChargeClass:"hidden",
                planSelector:1,
				howMuch:0,
                paymentVersion:0,
                currentPlan:0,
				setWarning:false,
				paym:"",
				stripeId:""
			};

		},

		handleClick: async function (i) {
			switch (i) {
				case 'upgradeMember':
					var thisComp=this;
					thisComp.setState({
						toPay:app.user.get("userPlan")['yearSubscr']/100+app.user.get("userPlan")['balance'],
						forPlan:"UpgradeToYear",
						howMuch:1
					});
					thisComp.handleClick('showSecond');
					break;

				case 'setGB':
					var thisComp=this;
					//if save
					if(this.state.boxButtonText=='Save'){

						var post={
							'howMuch':thisComp.state.boxSize,
							'planSelector':'bSize'
						};

						app.serverCall.ajaxRequest('savePlan', post, function (result) {

							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								thisComp.presetValues();
								thisComp.setState({
									boxBy:"",
									boxButtonText:""
								});

							}else if(result['response'] == "fail" && result['data']=="insBal"){

							}else if(result['response'] == "fail" && result['data']=="failToSave"){

							}
						});



					}

					if(this.state.boxButtonText=='Pay Now'){

						thisComp.setState({
							toPay:this.state.GBpayNow,
							forPlan:"Mail Storage",
							howMuch:thisComp.state.boxSize
						});
						thisComp.handleClick('showSecond');
					}
					//if pay


					break;

				case 'setDom':

					var thisComp=this;
					//if save
					if(this.state.domButtonText=='Save'){
						console.log(this.state.cDomain);

						var post={
							'howMuch':thisComp.state.cDomain,
							'planSelector':'cDomain'
						};

						app.serverCall.ajaxRequest('savePlan', post, function (result) {

							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								//thisComp.handleClick('showFirst');

								thisComp.presetValues();
								thisComp.setState({
									domBy:"",
									domButtonText:""
								});

							}else if(result['response'] == "fail" && result['data']=="insBal"){

								//	$('#infoModHead').html("Insufficient Funds");
								//	$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
								//	$('#infoModal').modal('show');

							}else if(result['response'] == "fail" && result['data']=="failToSave"){
								//	app.notifications.systemMessage('tryAgain');
							}
						});



					}


					if(this.state.domButtonText=='Pay Now'){
						thisComp.setState({
							toPay:this.state.dompayNow,
							forPlan:"Custom Domain",
							howMuch:thisComp.state.cDomain
						});
						thisComp.handleClick('showSecond');
					}
					//if pay


					break;

				case 'setAl':

					var thisComp=this;
					//if save
					if(this.state.alButtonText=='Save'){


						var post={
							'howMuch':thisComp.state.aliases,
							'planSelector':'alias'
						};

						app.serverCall.ajaxRequest('savePlan', post, function (result) {

							if (result['response'] == "success") {
								app.notifications.systemMessage('saved');
								//thisComp.handleClick('showFirst');

								thisComp.presetValues();
								thisComp.setState({
									alBy:"",
									alButtonText:""
								});

							}else if(result['response'] == "fail" && result['data']=="insBal"){

								//	$('#infoModHead').html("Insufficient Funds");
								//	$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
								//	$('#infoModal').modal('show');

							}else if(result['response'] == "fail" && result['data']=="failToSave"){
								//	app.notifications.systemMessage('tryAgain');
							}
						});



					}


					if(this.state.alButtonText=='Pay Now'){

						//console.log(app.user.get("userId"))
						thisComp.setState({
							toPay:this.state.alpayNow,
							forPlan:"Email Aliases",
							howMuch:thisComp.state.aliases
						});
						thisComp.handleClick('showSecond');

					}
					//if pay

					break;

				case 'renew':
					var thisComp=this;

						thisComp.setState({
							toPay:app.user.get("userPlan")['renewAmount'],
							forPlan:"Subscription Renewal",
							howMuch:1
						});

					thisComp.handleClick('showSecond');

					break;

				case "payEnough":
					var thisComp=this;
					thisComp.setState({
						toPay: app.user.get("userPlan")['priceFullProrated']+app.user.get("userPlan")['balance'],
						forPlan:"Missing Balance",
						howMuch:1
					});
					thisComp.handleClick('showSecond');

					break;

				case 'showFirst':

					this.setState(
						{
							firstPanelClass: "panel-body",
							firstTab: "active",

							secondTab:"",
							secondPanelClass:"panel-body hidden",

							editDisabled: true,
							cancelEditClass:"hidden",

							editPlanButtonClass:"",
							saveButtonClass:"hidden",
							paym:''


						});

					break;

				case 'showSecond':
					this.setState(
						{
							firstPanelClass: "panel-body hidden",
							firstTab: "",

							secondTab:"active",
							secondPanelClass:"panel-body"
						});
					break;


				case "stripe":

					this.setState({
						paym:'stripe',
						location:"plan",
						email:app.user.get('loginEmail')
					},async function(){
						await app.stripeCheckOut.start(this);
						await app.stripeCheckOut.checkout(this);
					});

					break;
				case "payPal":
					var thisComp=this;

					thisComp.setState({
						paym:'paypal'
					});

				var my_script = thisComp.new_script();

					var self = this;
					my_script.then(function() {
						//self.setState({'status': 'done'});
						paypal.Buttons({
							style: {
								shape: 'rect',
								color: 'gold',
								layout: 'vertical',
								label: 'paypal',

							},
							createOrder: function(data, actions) {
								return actions.order.create({
									purchase_units: [{
										amount: {
											value: thisComp.state.toPay
										},
										custom_id:app.user.get("userId"),
										description:thisComp.state.forPlan+"_"+thisComp.state.howMuch,
									}],
									application_context:
										{
											shipping_preference: 'NO_SHIPPING'
									}
								});
							},
							onApprove: function(data, actions) {
								return actions.order.capture().then(function(details) {
									//alert('Transaction completed by ' + details.payer.name.given_name + '!');
									alert('Thank you.');
									thisComp.handleClick.bind(thisComp, 'showFirst');
								});
							}
						}).render('#paypal-button-container');

					}).catch(function() {
						//self.setState({'status': 'error'});
					})



					break;

				case 'showDetail':
					this.setState(
						{
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

			var elements=app.stripeCheckOut.get("elements");
			var stripe=app.stripeCheckOut.get("stripe");

			const { error,paymentIntent } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Make sure to change this to your payment completion page
					return_url: "https://cyber.com/index.html"
				},
				redirect: "if_required"

			});

			try{
				if (paymentIntent.status === "succeeded") {
					console.log('paid2');
					app.stripeCheckOut.showMessage('Payment was accepted. Please wait to be redirected');
					this.handleClick('showFirst');
				}
			}catch(error){

			}

			// This point will only be reached if there is an immediate error when
			// confirming the payment. Otherwise, your customer will be redirected to
			// your `return_url`. For some payment methods like iDEAL, your customer will
			// be redirected to an intermediate site first to authorize the payment, then
			// redirected to the `return_url`.
			// console.log(error);
			try{
				if (error.type === "card_error" || error.type === "validation_error") {
					app.stripeCheckOut.showMessage(error.message);
				} else {
					app.stripeCheckOut.showMessage("An unexpected error occured.");
				}
			}catch(error){

			}
			app.stripeCheckOut.setLoading(false);
		},

		new_script: function() {
			return new Promise(function(resolve, reject){
				var script = document.createElement('script');
				script.src = 'https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD';
				script.addEventListener('load', function () {
					resolve();
				});
				script.addEventListener('error', function (e) {
					reject(e);
				});
				document.body.appendChild(script);
			})
		},

		getPlansDataPost: function(){

			var post={
                'planSelector':this.state.planSelector,
				'howMuch':this.state.howMuch,
			}
			return post;
		},

		handleChange: function (i, event) {
			var thisComp=this;
			switch (i) {
				case "changeGB":

					thisComp.setState({
						showButton: true,
						planSelector: 'bSize',
						howMuch:event.target.value,
						boxSize:event.target.value
					},function(){
						this.calculateNewPrice(function (result){
						});
					});
					break;
				case "changeDomain":

					thisComp.setState({
						planSelector: 'cDomain',
						howMuch:event.target.value,
						cDomain:event.target.value
					},function(){
						this.calculateNewPrice(function (result){
						});
					});


					break;

				case "changeAl":

					thisComp.setState({
						planSelector: 'alias',
						howMuch:event.target.value,
						aliases:event.target.value
					},function(){
						this.calculateNewPrice(function (result){
						});
					});


					break;

					//this.calculateNewPrice();
			}

		},

		componentWillUnmount: function () {
			app.user.off("change:userPlan");
		},
		calculateNewPrice: function () {
			var thisComp=this;
			var post=this.getPlansDataPost();

			app.serverCall.ajaxRequest('calculatePrice', post, function (result) {
				if (result['response'] == "success") {

					if(thisComp.state.planSelector=="bSize") {
						if(result['data']['warning']=="mailbox2small"){
							thisComp.setState({
								boxWarning:true
							});
							//console.log('sdsd');
						}else{
							thisComp.setState({
								boxWarning:false
							});
						}
						if(result['data']['oldPriceYear']>result['data']['newPriceYear']){
							thisComp.setState({
								boxButtonText:"Save",
								GBprice:accounting.formatMoney(result['data']['oldPriceYear']-result['data']['newPriceYear']),
								boxBy:"Plan will be decresed by",
								GBpayNow:""
							});

						}else if(result['data']['oldPriceYear']==result['data']['newPriceYear']){
							thisComp.setState({
								boxButtonText:"",
								GBprice: accounting.formatMoney(result['data']['basePrice']+result['data']['fullPrice']),
								boxBy:"",
								GBpayNow:""
							});
						}else if(result['data']['oldPriceYear']<result['data']['newPriceYear']){

							if(result['data']['changedByMinusBalance']<=0){
								thisComp.setState({
									boxButtonText:"Save",
									GBprice: accounting.formatMoney(result['data']['newPriceYear']-result['data']['oldPriceYear']),
									boxBy:"Plan will be increased by",
									GBpayNow:""
								});
							}else{
								thisComp.setState({
									boxButtonText:"Pay Now",
									GBprice: accounting.formatMoney(result['data']['newPriceYear']-result['data']['oldPriceYear']),
									boxBy:"Plan will be increased by",
									GBpayNow:result['data']['minimumCharge']
								});
							}

						}


					}

					if(thisComp.state.planSelector=="cDomain") {

						if(result['data']['warning']=="domain2small"){
							thisComp.setState({
								domWarning:true
							});
							//console.log('sdsd');
						}else{
							thisComp.setState({
								domWarning:false
							});
						}
						if(result['data']['oldPriceYear']>result['data']['newPriceYear']){
							thisComp.setState({
								domButtonText:"Save",
								Domprice:accounting.formatMoney(result['data']['oldPriceYear']-result['data']['newPriceYear']),
								domBy:"Plan will be decresed by",
								dompayNow:""
							});

						}else if(result['data']['oldPriceYear']==result['data']['newPriceYear']){
							thisComp.setState({
								domButtonText:"",
								Domprice: accounting.formatMoney(result['data']['basePrice']+result['data']['fullPrice']),
								domBy:"",
								dompayNow:""
							});
						}else if(result['data']['oldPriceYear']<result['data']['newPriceYear']){

							if(result['data']['changedByMinusBalance']<=0){
								thisComp.setState({
									domButtonText:"Save",
									Domprice: accounting.formatMoney(result['data']['newPriceYear']-result['data']['oldPriceYear']),
									domBy:"Plan will be increased by",
									dompayNow:""
								});
							}else{
								thisComp.setState({
									domButtonText:"Pay Now",
									Domprice: accounting.formatMoney(result['data']['newPriceYear']-result['data']['oldPriceYear']),
									domBy:"Plan will be increased by",
									dompayNow:result['data']['minimumCharge']
								});
							}

						}
					}

					if(thisComp.state.planSelector=="alias") {

						if(result['data']['warning']=="alias2small"){
							thisComp.setState({
								alWarning:true
							});
							//console.log('sdsd');
						}else{
							thisComp.setState({
								alWarning:false
							});
						}
						if(result['data']['oldPriceYear']>result['data']['newPriceYear']){
							thisComp.setState({
								alButtonText:"Save",
								alprice:accounting.formatMoney(result['data']['oldPriceYear']-result['data']['newPriceYear']),
								alBy:"Plan will be decresed by",
								alpayNow:""
							});

						}else if(result['data']['oldPriceYear']==result['data']['newPriceYear']){
							thisComp.setState({
								alButtonText:"",
								alprice: accounting.formatMoney(result['data']['basePrice']+result['data']['fullPrice']),
								alBy:"",
								alpayNow:""
							});
						}else if(result['data']['oldPriceYear']<result['data']['newPriceYear']){

							if(result['data']['changedByMinusBalance']<=0){
								thisComp.setState({
									alButtonText:"Save",
									alprice: accounting.formatMoney(result['data']['newPriceYear']-result['data']['oldPriceYear']),
									alBy:"Plan will be increased by",
									alpayNow:""
								});
							}else{
								thisComp.setState({
									alButtonText:"Pay Now",
									alprice: accounting.formatMoney(result['data']['newPriceYear']-result['data']['oldPriceYear']),
									alBy:"Plan will be increased by",
									alpayNow:result['data']['minimumCharge']
								});
							}
						}
					}


				}

			});


		},

        presetValues:function(){

            var thisComp = this;

            var def=$.Deferred();

            app.userObjects.loadUserPlan(function(){
              def.resolve();
            });


            def.done(function(){

            //	console.log(app.user.get("userPlan"));
                var currentPlan=app.user.get("userPlan");
                var decodedPlan=currentPlan['planData'];

                var timeEnd=new Date(currentPlan['cycleEnd']*1000);
				var timeStart=new Date(currentPlan['cycleStart']*1000);

                var dateStarted=new Date(currentPlan['created']*1000).getTime();
                var goodOld=new Date(2015, 11, 19).getTime();

                var amount=2;
                if(goodOld>dateStarted){
                    amount=5;
                }

				if(app.user.get("userPlan")['pastDue']==1 && app.user.get("userPlan")['priceFullProrated']>0){

					thisComp.setState({setWarning:true});
				}else{
					thisComp.setState({setWarning:false});
				}



                thisComp.setState({

                    boxSize: decodedPlan['bSize'],
                    cDomain: decodedPlan['cDomain'],
                    aliases: decodedPlan['alias'],

					GBprice:0,
					boxBy:"",
					GBpayNow:"",

					newboxSize:0,
					boxWarning:false,
					boxButtonText:"",


					domBy:"",
					domWarning:false,
					Domprice:0,
					domButtonText:"",


					alprice:0,
					newaliases:0,
					alButtonText:"",
					alWarning:false,
					alBy:"",
					alButtonText:"",

                    dispEmails: decodedPlan['dispos'],

                    pgpStrength: decodedPlan['pgpStr'],
                    attSize: decodedPlan['attSize'],
                    importPGP: decodedPlan['pgpImport'],
                    contacts: decodedPlan['contactList'],
                    delaySend: decodedPlan['delaySend'],
                    sendLimits: decodedPlan['sendLimits'],
                    recipPerMail:decodedPlan['recipPerMail'],
                    folderExpiration: decodedPlan['folderExpire'],
                    secLog: decodedPlan['secLog'],
                    filtEmail: decodedPlan['filter'],
                    claimAmount:amount,
                    //isAlrdClaimed:currentPlan['creditUsed'],
					isAlrdClaimed:true,

                    cycleEnd:timeEnd.toLocaleDateString(),
					cycleStart:timeStart.toLocaleDateString()
                });

               // setTimeout(function(){
               //     thisComp.calculateNewPrice();
               // },100);


            });
        },

		componentDidMount: function () {
			var thisComp = this;

            this.presetValues();
            app.user.on("change:userPlan",function() {
            	this.setState({
					"boxButtonText":"",
					"domButtonText":"",
					"alButtonText":"",
					"boxBy":"",
					"GBpayNow":"",
					"dompayNow":"",
					"alpayNow":"",
					"domBy":"",
					"alBy":"",
					"boxWarning":"",
					"domWarning":"",
					"alWarning":"",
					"boxSize":app.user.get("userPlan")['planData']['bSize'],
					"cDomain":app.user.get("userPlan")['planData']['cDomain'],
					"aliases":app.user.get("userPlan")['planData']['alias']

				})
			},this);


		},

        componentWillUnmount: function () {
            app.user.off("change:userPlan");

        },

   		accountDataTable: function () {

            var options = [];
			var toP= accounting.formatMoney(app.user.get("userPlan")['priceFullProrated']+app.user.get("userPlan")['balance'],'$',2)
            var paid=[];

          /*  if(app.user.get("userPlan")['balance']<0){
                paid.push(<span key="sd1" className='txt-color-red'>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
                paid.push( <span  key="sd2"  className="pull-right txt-color-red">Account is past due.</span>);
            }else{
                paid.push(<span key="sd1" className=''>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
            }*/
           //

			//console.log(app.user.get("userPlan"));
			//console.log(app.user.get('balanceShort'));
			var ys="";
			if(app.user.get("userPlan")['priceFullProrated']>0 && app.user.get("userPlan")['pastDue']==0){
				ys="Partialy PAID";
			}

			if(app.user.get("userPlan")['pastDue']==1){
				ys="UNPAID";
			}else{
				ys="PAID";
			}

			//what button to show
			//if pastdue and alrdpaid=0 then renew
			//if pastdue and alrd paid then missing balance

			options.push(<tr key="1c">
				<td className="col-md-6">
					<b>Current Plan:</b>
				</td>
				<td>From: {new Date(app.user.get("userPlan")['cycleStart']*1000).toLocaleDateString()}<br/>
					Until: {new Date(app.user.get("userPlan")['cycleEnd']*1000).toLocaleDateString()}</td>

				<td className="col-md-3">Status: <b>{ys}</b>
					<div className="pull-right dialog_buttons">
						<button type="button" className={app.user.get("userPlan")['needFill']?"btn btn-primary pull-right":"hidden"} onClick={this.handleClick.bind(this, 'payEnough')}>Pay Missing Balance of {toP}</button>

						<button type="button" className={app.user.get("userPlan")['needRenew']?"btn btn-primary pull-right":"hidden"} onClick={this.handleClick.bind(this, 'renew')}>Renew Plan ( ${app.user.get("userPlan")['renewAmount']} )</button>


					</div>
				</td>

			</tr>);

			options.push(<tr key="2a">
				<td>
					<b>{app.user.get("userPlan")['planSelected']==1?"Yearly":"Monthly"} Cost:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['monthlyCharge'])}
					</td>
				<td></td>
			</tr>);

			options.push(<tr key="2c">
				<td>
					<b>Paid This Cycle:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['alrdPaid'])}
				</td>
				<td></td>
			</tr>);

			//if(app.user.get("userPlan")['balance']>0){
				options.push(<tr key="3a" className={app.user.get("userPlan")['balance']==0?"hidden":""}>
					<td>
						<b>Previous Unpaid Balance:</b>
					</td>
					<td>{accounting.formatMoney(app.user.get("userPlan")['balance'])}
					</td>
					<td></td>
				</tr>);

			options.push(<tr key="3b" className={app.user.get("userPlan")['currentPlanBalance']==0?"hidden":""}>
				<td>
					<b>Unused Credit:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['currentPlanBalance'])}
				</td>
				<td></td>
			</tr>);

			options.push(<tr key="3c">
				<td>
					<b>Rewards:</b>
				</td>
				<td>{accounting.formatMoney(app.user.get("userPlan")['rewardCollected'],'$',3)}
				</td>
				<td></td>
			</tr>);


			//}


			return options;

		},
		planTable: function () {
			var options = [];

			//Mailbox Size
            var boxDif="";
            var bxS=this.state.newboxSize;

            if(this.state.newboxSize!=this.state.boxSize){
                boxDif=" => "+(bxS>1000?bxS/1000+" Gb":bxS+" MB");
            }
			options.push(<tr key="1">
				<td className="col-xs-5 no-right-padding">
					<b>Mailbox Size:</b>
				</td>
				<td className="col-xs-7">
                    {(app.user.get("userPlan")['planData']['bSize']>=1000?app.user.get("userPlan")['planData']['bSize']/1000+" Gb":app.user.get("userPlan")['planData']['bSize']+" MB")}
				</td>
			</tr>);


			options.push(<tr key="2" className="">
				<td className="col-xs-5 no-right-padding">
					<b>Custom Domain:</b>
				</td>
				<td className="col-xs-7">
                    {app.user.get("userPlan")['planData']['cDomain']}
                </td>
			</tr>);

            var alDif ="";
            if(this.state.newaliases!=this.state.aliases) {
                var alDif = " => " + this.state.newaliases;
            }
			options.push(<tr key="3" className="">
				<td className="col-xs-5">
					<b>Custom Aliases:</b>
				</td>
				<td>
                    {app.user.get("userPlan")['planData']['alias']}
				</td>
			</tr>);

			return options;
		},
		render: function () {

			var classFullSettSelect="col-xs-12";

			return (
				<div className={this.props.classes.rightClass} id="rightSettingPanel">

					<div className="col-lg-10 col-xs-12 personal-info ">
						<div className="panel panel-default">
							<div className="panel-heading">
								<ul className="nav nav-tabs tabbed-nav">
									<li role="presentation" className={this.state.firstTab}>
										<a onClick={this.handleClick.bind(this, 'showFirst')}>
											<h3 className={this.props.tabs.Header}>Features</h3>
											<h3 className={this.props.tabs.HeaderXS}>
												<i className="ion-bag"></i>
											</h3>

										</a>
									</li>
									<li role="presentation" className={this.state.secondTab}>
										<a className={this.state.secondTab=="active"?"":"hidden"}>
											<h3 className={this.props.tabs.Header}>Pay Now</h3>
											<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-credit-card"></i></h3>
										</a>
									</li>

								</ul>
							</div>

							<div className={this.state.firstPanelClass}>
								<h3 className={app.user.get("userPlan")['pastDue']===1?"txt-color-red":"hidden"}>
								Please Pay your balance to send and receive emails. Your email functionality is limited to access to previous emails only.
								</h3>

								<h3 className={app.user.get("userPlan")['needRenew']?"txt-color-red":"hidden"}>
									Please renew your service soon to avoid service interruption. Your email functionality will be limited to access to previous emails only.
								</h3>

								<h3 className={	(app.user.get("userPlan")['planSelected']==2 || app.user.get("userPlan")['planSelected']==3) && app.user.get("userPlan")['pastDue']!==1?"txt-color-red":"hidden"} style={{"marginBottom":"20px"}}>
									Please upgrade to yearly subscription to unlock premium features. <button type="button" className="btn btn-primary pull-right" onClick={this.handleClick.bind(this, 'upgradeMember')}>Upgrade {accounting.formatMoney(app.user.get("userPlan")['yearSubscr']/100+app.user.get("userPlan")['balance'])} for a year</button>

								</h3>

								<h3 className="pull-left">Account:</h3>

								<table className=" table table-hover table-striped datatable table-light">
							{this.accountDataTable()}
								</table>

								<h3 className="pull-left">Your current plan have following features:</h3>

								<table className=" table table-hover table-striped datatable table-light">

							{this.planTable()}

								</table>

								<h3 className="pull-left">Add/Remove features:</h3>
								<div className="clearfix"></div>

								<span className="col-lg-12">* - current Plan</span>
								<div className="clearfix"></div>

								<div className="row">
									<div className="col-md-12 col-lg-4">
										<div className="panel panel-default">
											<div className="panel-body disable">
												<h5><b>Mailbox Space</b></h5>
												<div className="form-horizontal margin-left-0">
													<label className="col-lg-7 col-sm-12 control-label">Set Space in GB:</label>
													<div className="col-lg-5 col-sm-12">
														<select className="form-control" onChange={this.handleChange.bind(this, 'changeGB')} value={this.state.boxSize} disabled={app.user.get("userPlan")['planSelected']==1?false:true} key="editor1">
															<option value="1000">{app.user.get("userPlan")['planData']['bSize']==1000?"1 GB*":"1 GB"}</option>
															<option value="5000">{app.user.get("userPlan")['planData']['bSize']==5000?"5 GB*":"5 GB"}</option>
															<option value="10000">{app.user.get("userPlan")['planData']['bSize']==10000?"10 GB*":"10 GB"}</option>
															<option value="15000">{app.user.get("userPlan")['planData']['bSize']==15000?"15 GB*":"15 GB"}</option>
														</select>
													</div>
													<label className={this.state.boxBy!=""?"col-lg-7 col-sm-12 control-label":"hidden"}>{this.state.boxBy}: </label>
													<label className={this.state.boxBy!=""?"col-lg-5 col-sm-12 control-label text-align-left":"hidden"}>{this.state.GBprice} / Year</label>

													<label className={this.state.GBpayNow!==""?"col-lg-7 col-sm-12 control-label":"hidden"}>Amount to pay now: </label>
													<label className={this.state.GBpayNow!==""?"col-lg-5 col-sm-12 control-label text-align-left":"hidden"}>${this.state.GBpayNow}</label>

													<div className="clearfix"></div>
													<span className={this.state.boxWarning?"txt-color-red":"hidden"}>Your current email box larger than requested size, please delete emails or increase the size</span>

													<div className="col-lg-12 margin-top-20">
													<button type="button" className={(this.state.boxButtonText!="" && !this.state.boxWarning)?"btn btn-primary pull-right":"hidden"} onClick={this.handleClick.bind(this, 'setGB')}>{this.state.boxButtonText}</button>
													</div>
												</div>
											</div>
										</div>

									</div>
									<div className="col-md-12 col-lg-4">
										<div className="panel panel-default">
											<div className="panel-body">
												<h5><b>Custom Domain</b></h5>
												<div className="form-horizontal margin-left-0">
													<label className="col-lg-7 col-sm-12 control-label">Number Of Domains:</label>

													<div className="col-lg-5 col-sm-12">
														<select className="form-control" onChange={this.handleChange.bind(this, 'changeDomain')} value={this.state.cDomain} disabled={app.user.get("userPlan")['planSelected']==1?false:true}>
															<option value="0">{app.user.get("userPlan")['planData']['cDomain']==0?"0*":"0"}</option>
															<option value="1">{app.user.get("userPlan")['planData']['cDomain']==1?"1*":"1"}</option>
															<option value="2">{app.user.get("userPlan")['planData']['cDomain']==2?"2*":"2"}</option>
															<option value="3">{app.user.get("userPlan")['planData']['cDomain']==3?"3*":"3"}</option>
														</select>
													</div>
													<label className={this.state.domBy!=""?"col-lg-7 col-sm-12 control-label":"hidden"}>{this.state.domBy}:</label>
													<label className={this.state.domBy!=""?"col-lg-5 col-sm-12 control-label text-align-left":"hidden"}>{this.state.Domprice} / Year</label>
													<label className={this.state.dompayNow!==""?"col-lg-7 col-sm-12 control-label":"hidden"}>Amount to pay now: </label>
													<label className={this.state.dompayNow!==""?"col-lg-5 col-sm-12 control-label text-align-left":"hidden"}>${this.state.dompayNow}</label>
													<div className="clearfix"></div>
													<span className={this.state.domWarning?"txt-color-red":"hidden"}>Your currently have more domain registered than new plan allowed, please remove unneeded  domain(s) or increase plan</span>
													<div className="col-lg-12 margin-top-20">
														<button type="button" className={(this.state.domButtonText!="" && !this.state.domWarning)?"btn btn-primary pull-right":"hidden"} onClick={this.handleClick.bind(this, 'setDom')}>{this.state.domButtonText}</button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-md-12 col-lg-4">
										<div className="panel panel-default">
											<div className="panel-body">
												<h5><b>Custom Alias</b></h5>
												<div className="form-horizontal margin-left-0">
													<label className="col-lg-8 col-sm-12 control-label">Number of aliases:</label>

													<div className="col-lg-4 col-sm-12">
														<select className="form-control" onChange={this.handleChange.bind(this, 'changeAl')} value={this.state.aliases} disabled={app.user.get("userPlan")['planSelected']==1?false:true}>
                                                            <option value="0">{app.user.get("userPlan")['planData']['alias']==0?"0*":"0"}</option>
															<option value="1">{app.user.get("userPlan")['planData']['alias']==1?"1*":"1"}</option>
															<option value="5">{app.user.get("userPlan")['planData']['alias']==5?"5*":"5"}</option>
															<option value="10">{app.user.get("userPlan")['planData']['alias']==10?"10*":"10"}</option>
														</select>
													</div>
													<label className={this.state.alBy!=""?"col-lg-7 col-sm-12 control-label":"hidden"}>{this.state.alBy}:</label>
													<label className={this.state.alBy!=""?"col-lg-5 col-sm-12 control-label text-align-left":"hidden"}>{this.state.alprice} / Year</label>
													<label className={this.state.alpayNow!==""?"col-lg-7 col-sm-12 control-label":"hidden"}>Amount to pay now: </label>
													<label className={this.state.alpayNow!==""?"col-lg-5 col-sm-12 control-label text-align-left":"hidden"}>${this.state.alpayNow}</label>
													<span className={this.state.alWarning?"txt-color-red":"hidden"}>Your currently have more aliases registered than plan you selected, please remove unneeded  aliase(s) or increase plan</span>
													<div className="col-lg-12 margin-top-20">
														<button type="button" className={(this.state.alButtonText!="" && !this.state.alWarning)?"btn btn-primary pull-right":"hidden"} onClick={this.handleClick.bind(this, 'setAl')}>{this.state.alButtonText}</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

							</div>

							<div className={this.state.secondPanelClass}>
								<h3 className="hidden">
								Payment
								</h3>

								<div className="pull-right dialog_buttons" style={{lineHeight: "40px"}}>
									{/*<button type="submit" className="btn btn-primary" onClick={this.handleClick.bind(this, 'payPal')}>Pay With PayPal</button>*/}
									<button type="submit" className="btn btn-primary" form="crypF" onClick={this.handleClick.bind(this, 'showFirst')}>Pay With CoinPayments</button>
									<button type="submit" className="btn btn-primary" form="perfF" onClick={this.handleClick.bind(this, 'showFirst')}>Pay With Perfect Money</button>
									<button type="submit" className="btn btn-primary" onClick={this.handleClick.bind(this, 'stripe')}>Pay With stripe (Credit / Debit Card)</button>

									<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'showFirst')}>Cancel</button>
								</div>

								<div className="clearfix"></div>
                                <div className="bold margin-top-20">
                                Info: <i className="">It may take some time to reflect new balance after successfull payment. <br/> If you pay with bitcoin, make sure you enter exact amount you are willing to pay, otherwise it may be marked as mispayment.</i></div>

                                <div className="clearfix"></div>


								<div className={this.state.paym=="paypal"?"":"hidden"} id="paypal-button-container"></div>

								<div className={this.state.paym=="stripe"?"":"hidden"} id="stripe-container">
									<form id="payment-form">
										<div id="payment-element">
										</div>
										<button id="submit">
											<div className="spinner hidden" id="spinner"></div>
											<span id="button-text">Pay now</span>
										</button>
										<div id="payment-message" className="hidden"></div>
									</form>
								</div>

                            </div>


						</div>
					</div>


					<form className="hidden" id="perfF"  action="https://perfectmoney.com/api/step1.asp" method="POST" target="_blank">
						<input type="hidden" name="PAYEE_ACCOUNT" value={app.defaults.get('perfectMecrh')}/>
						<input type="hidden" name="PAYEE_NAME" value="Cyber Fear"/>
						<input type="hidden" name="PAYMENT_AMOUNT" value={this.state.toPay}/>
						<input type="hidden" name="PAYMENT_UNITS" value="USD"/>
						<input type="hidden" name="STATUS_URL" value="https://cyberfear.com/api/PerfectPaidstatus"/>
						<input type="hidden" name="PAYMENT_URL" value="https://cyberfear.com/api/Pe"/>
						<input type="hidden" name="PAYMENT_URL_METHOD" value="POST"/>
						<input type="hidden" name="NOPAYMENT_URL" value="https://cyberfear.com/api/Pe"/>
						<input type="hidden" name="NOPAYMENT_URL_METHOD" value="LINK"/>
						<input type="hidden" name="SUGGESTED_MEMO" value=""/>
						<input type="hidden" name="userId" value={app.user.get("userId")}/>
						<input type="hidden" name="paymentFor" value={this.state.forPlan}/>
						<input type="hidden" name="howMuch" value={this.state.howMuch}/>
						<input type="hidden" name="BAGGAGE_FIELDS" value="userId paymentFor howMuch"/>

					</form>


					<form className="hidden" id="crypF" action="https://www.coinpayments.net/index.php" method="post" target="_blank" ref="crypto">
						<input type="hidden" name="cmd" value="_pay_simple"/>
						<input type="hidden" name="reset" value="1"/>
						<input type="hidden" name="first_name" value="anonymous"/>
						<input type="hidden" name="last_name" value="anonymous"/>
						<input type="hidden" name="email" value="anonymous@cyberfear.com"/>
						<input type="hidden" name="merchant" value={app.defaults.get('coinMecrh')}/>
						<input type="hidden" name="item_amount" value={this.state.howMuch}/>
						<input type="hidden" name="item_name" value={this.state.forPlan}/>
						<input type="hidden" name="item_desc" value={this.state.forPlan}/>
						<input type="hidden" name="custom" value={app.user.get("userId")}/>
						<input type="hidden" name="currency" value="USD"/>
						<input type="hidden" name="amountf" value={this.state.toPay}/>
						<input type="hidden" name="want_shipping" value="0"/>
						<input type="hidden" name="success_url" value="https://cyberfear.com/api/Pe"/>
						<input type="hidden" name="cancel_url" value="https://cyberfear.com/api/Pe"/>

					</form>

				</div>
				);
		}

	});
});
