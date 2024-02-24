/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var UserLogin = Backbone.Model.extend({
		// Initialize with negative/empty defaults
		// These will be overriden after the initial checkAuth
		defaults: {
			//logged_in: false,
			//user_id: ''
		},
		initialize: function(){
			//_.bindAll.apply(_, [this].concat(_.functions(this)));

			// Singleton user object
			// Access or listen on this throughout any module with app.session.user
		//	this.user = new UserModel({});
		},


		Login: function(emailInput, password,factor2,callback) {
			var thisComp=this;

			var arr = emailInput.split("@");

			if (arr.length == 1)
				var email = arr[0].toLowerCase() + app.defaults.get('domainMail').toLowerCase();
			else
				var email = emailInput.toLowerCase();

			//console.log(email);
			var post={
				//todo get one step or two before submit, minimize exposure
				username:app.transform.SHA512(email),
				password:app.transform.SHA512(password),
				password2step:app.transform.SHA512(app.globalF.makeDerivedFancy(password, app.defaults.get('hashToken'))),
				factor2:factor2

			}

			app.serverCall.ajaxRequest('loginUser',post,function(result){


				if(result['response']=="success"){
					if(result['data']['status']=="welcome"){


					//	console.log('logged');app.user.set({"isAuth":parseInt(result['data']['userObjectVersion'])});
					app.user.set({"profileVersion":parseInt(result['data']['userObjectVersion'])});

					app.user.set({"firstTime":result['data']['firstTime']});
					app.user.set({"oneStep":result['data']['oneStep']});
					app.user.set({"userLogedIn":true});

					app.user.set({"userLoginToken":result['data']['token']});
					app.user.set({"loginEmail":email});

					app.user.set({"userId": result['data']['userId']});
					app.user.set({"cacheEmId":app.transform.SHA256(email).substring(0, 10)+result['data']['userId']});
					app.user.set({"salt": app.transform.hex2bin(result['data']['salt'])});

					if(result['data']['oneStep']){
						//console.log(password);
                        //console.log(password);
						app.user.set({"secondPassword":app.globalF.makeDerived(password, app.transform.hex2bin(result['data']['salt']))});

					}else{
						//console.log(app.user.get('secondPassword'));
					}

					//app.indexedDBWorker.openDb();

						//console.log(app.user)

					if (result['data']['paymentVersion']==3) {
						callback('useMailUm');
					}else if (result['data']['firstTime']===true) {
						$('#loginUser').modal('hide');
						//start plancheck routines
						thisComp.setTimer();
						thisComp.checkPlan();

						$('#makePayment').modal('show');
					}else{
						$('#loginUser').modal('hide');
						Backbone.history.navigate(app.defaults.get('defaultPage'), {
							trigger : true
						});

					}

				callback('good');

				}else if(result['data']=="needGoogle"){
						callback('needGoogle');
				}else if(result['data']=="needYubi") {
						callback('needYubi');
				}else if(result['data']=="pinWrong"){
					app.notifications.systemMessage('wrongPin');
				}else if(result['data']=="limitIsReached"){
					app.notifications.systemMessage('limitIsReached');
				}

				}else{
					app.notifications.systemMessage('wrngUsrOrPass');
				}
			});

		},
		logout:function(){
			app.serverCall.ajaxRequest('loginOut',{},function(result){
				if(result['response']=="success")
				app.restartApp();
			},function(){});
		},

		checkPlan:function(){
			var thisComp=this;
			if (!app.user.get("getPlan")) {
				app.user.set({"getPlan": true});

				app.userObjects.loadUserPlan(function () {

					app.user.set({"getPlan": false});
					//if paid
					if (app.user.get("userPlan")['newUser'] === false && app.user.get("userPlan")['alrdPaid'] === app.user.get("userPlan")['monthlyCharge']) {

						clearInterval(thisComp.checkP);
						app.user.set({"getPlan": false});
						//redirect to mailbox when paid

						$('#dialogPop').modal('hide');
						$('#makePayment').modal('hide');

						Backbone.history.navigate(app.defaults.get('defaultPage'), {
						    trigger: true
						 });

						//console.log('paid continue')
					}else if (app.user.get("userPlan")['newUser'] === false && (app.user.get("userPlan")['alrdPaid'] != app.user.get("userPlan")['monthlyCharge'] || app.user.get("userPlan")['pastDue']==1 )) {

					//	console.log(app.user.get("userPlan"));

						clearInterval(thisComp.checkP);
						app.user.set({"getPlan": false});
						//redirect to mailbox when paid

						$('#dialogPop').modal('hide');
						$('#makePayment').modal('hide');

						Backbone.history.navigate("settings/Plan", {
							trigger : true
						});

						//console.log('paid continue')
					}else if(app.user.get("tempCoin") || (app.user.get("userPlan")['newUser'] !== true &&  app.user.get("firstTimeCacel")===false)){
						//if processing


						$('#dialogCancel').on('click', function () {

							//clearInterval(thisComp.checkP);
							app.user.set({"getPlan": false});
							//redirect to mailbox when paid
							$('#dialogPop').modal('hide');
							$('#makePayment').modal('show');
							console.log('opa21')
							app.user.set({
								tempCoin: false
							});

							// clearInterval(thisComp.state.checkP);
							app.user.set({"firstTimeCacel":true});
							// $('#makePayment').modal('show');
							// $('#dialogPop').modal('hide');
						});

						$('#dialogModHead').html("Waiting for funds");
						$('#dialogModBody').html("You started a payment process.<br/> It may take some time to precess. As soon as we receive payments, you will be automatically redirected to your mailbox. You can close this window and come back later.<br/><b>If you like to use other payment processor, please click 'Cancel'</b><br/><br/> Thnak you for choosing CyberFear.com");

						$("#dialogOk").addClass('hidden');

						$('#makePayment').modal('hide');

						$('#dialogPop').modal('show');
						//start check timer
					}else  if(app.user.get("userPlan")['newUser'] === true ||  app.user.get("firstTimeCacel")===true){
						//if cancelled

						$('#makePayment').modal('show');
						$('#dialogPop').modal('hide');
						//start check timer
					}

				});
			}
		},
		setTimer:function() {
			var thisComp=this;
			thisComp.checkP=setInterval(function () {
					thisComp.checkPlan();
				}, 5000); //todo change to 10 sec on production
		}


	});

	return UserLogin;
});
