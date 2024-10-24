/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var StripeCheckOut = Backbone.Model.extend({
		defaults: {
		},
		initialize: function(){
			this.set({
				"element": {},
				"stripe":{}
			});
		},
		setLoading:function(isLoading) {
			if (isLoading) {
				// Disable the button and show a spinner
				document.querySelector("#submit").disabled = true;
				document.querySelector("#spinner").classList.remove("hidden");
				document.querySelector("#button-text").classList.add("hidden");
			} else {
				document.querySelector("#submit").disabled = false;
				document.querySelector("#spinner").classList.add("hidden");
				document.querySelector("#button-text").classList.remove("hidden");
			}
		},
		stripe_script:(that)=>{
			return new Promise(function(resolve, reject){
				var script = document.createElement('script');
				script.src = 'https://js.stripe.com/v3/';
				$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/css/stripe.css') );
				document.body.appendChild(script);

				script.addEventListener('load', function () {
					app.stripeCheckOut.set({
						"stripe":Stripe(app.defaults.get('stripeKey')),
					});
					app.user.set({"stipeLoaded":true});
					resolve();
				});
				script.addEventListener('error', function (e) {
					reject(e);
				});

			})
		},
	    generateStripeUrl: function(that) {
	        // Open a blank window immediately to avoid popup blockers
	        var paymentWindow = window.open('', '_blank');

	        // Collect necessary data before making the request
	        var paymentData = {
	            price: that.state.price,
	            planSelector: that.state.planSelector + " plan",
	            duration: that.state.PaymentDescr,
	            type: that.state.planSelector + " plan",
	            userToken: app.user.get("userLoginToken"),
	            email: app.user.get('loginEmail'),
	        };
	        //alert(JSON.stringify(paymentData, null, 2));
	        // Update the state (if necessary)
	        that.setState({
	            paym: "stripe",
	            email: app.user.get("loginEmail"),
	        });

	        // Make the asynchronous call to get the Stripe URL
	        fetch("/api/createOrderStripeV3", {
	            method: "POST",
	            headers: { "Content-Type": "application/json" },
	            body: JSON.stringify(paymentData),
	        })
	        .then((response) => response.json())
	        .then((result) => {
	            if (result && result.url) {
	                // Redirect the paymentWindow to the Stripe URL
	                paymentWindow.location.href = result.url;
	            } else {
	                // Handle the error case
	                paymentWindow.close();
	                app.notifications.systemMessage("Failed to initiate payment. Please try again.");
	            }
	        })
	        .catch((error) => {
	            console.error('Error generating Stripe URL:', error);
	            paymentWindow.close();
	            app.notifications.systemMessage("An error occurred. Please try again.");
	        });
	    },

		async checkStatus() {
			console.log('checking123');
			//const clientSecret = new URLSearchParams(window.location.search).get(
			//	"payment_intent_client_secret"
			//);
			//const clientSecret =clientSecret

			if (!this.state.clientSecret) {
				console.log('returned');
				console.log(this.state.clientSecret);
				return;
			}

			const { paymentIntent } = await stripe.retrievePaymentIntent(this.state.clientSecret);

			switch (paymentIntent.status) {
				case "succeeded":
					this.showMessage("Payment succeeded!");
					//todo create new order if payment suceeded
					console.log('good payment');
					break;
				case "processing":
					this.showMessage("Your payment is processing.");
					break;
				case "requires_payment_method":
					this.showMessage("Your payment was not successful, please try again.");
					break;
				default:
					this.showMessage("Something went wrong.");
					break;
			}
		},

		checkout:(that)=>{
			document
				.querySelector("#payment-form")
				.addEventListener("submit", that.stripeHandleSubmit);

		},
		updateStripe(payLoad){

			// var userObj={};
			//
			// userObj['planSelector']= that.state.forPlan;
			// userObj['howMuch']= that.state.howMuch;
			// userObj['userToken']=app.user.get("userLoginToken");
			// userObj['price']=that.state.toPay;
			// userObj['stripeId']=that.state.stripeId;

			$.ajax({
				method: "POST",
				url: app.defaults.get('apidomain')+"/UpdateStripeV3",
				data: payLoad,
				dataType: "json",
				xhrFields: {
					withCredentials: true
				}
			})
				.then(function (msg) {

					if(msg['response']==='fail'){
						app.notifications.systemMessage('tryAgain');

					}else if(msg['response']==='success'){
					}
				});

		},



		showMessage(messageText) {
			const messageContainer = document.querySelector("#payment-message");

			messageContainer.classList.remove("hidden");
			messageContainer.textContent = messageText;

			setTimeout(function () {
				messageContainer.classList.add("hidden");
				messageText.textContent = "";
			}, 4000);
		},

	});

	return StripeCheckOut;
});
