define(['react', 'app', 'wow', 'cmpld/splashPage/head', 'cmpld/splashPage/compare', 'cmpld/splashPage/footer', 'cmpld/modals/login', 'cmpld/splashPage/forgotPassword', 'cmpld/splashPage/forgotSecret', 'cmpld/modals/reportBug', 'cmpld/modals/createUser', 'cmpld/splashPage/terms', 'cmpld/splashPage/privacy', 'cmpld/splashPage/pe', 'cmpld/splashPage/canary', 'cmpld/modals/tokenPop', 'cmpld/modals/paymentGate', 'cmpld/modals/dialogPop'], function (React, app, Wow, SplashHead, Compare, SplashFoot, Login, ForgotPassword, ForgotSecret, ReportBug, CreateUser, Terms, Privacy, PE, Canary, TokenPop, PaymentGate, DialogPop) {
	var body;

	return React.createClass({
		getInitialState: function () {
			//	var AccountReset={
			//		'email':'',
			//		'secretToken':''
			//	};
			return { AccountResetOptions: "" };
		},
		//data binding example
		/*
  updateValue:function(modifiedValue){
  	console.log(this.state.AccountResetOptions);
  	//this.setState.AccountResetOptions=modifiedValue;
  	console.log(this.state.AccountResetOptions);
  	this.setState({
  		AccountResetOptions:{'email':modifiedValue}
  	})
  },
  */
		componentDidMount: function () {
			//$('link[rel=stylesheet][href="/css/all.css"]').remove();
			//$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/css/nonMin/splash.css') );
			//$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/css/nonMin/animate.min.css') );

			var AccountResetOptions = {
				'email': '',
				'secretToken': ''
			};

			this.setState({ 'AccountResetOptions': AccountResetOptions });

			var wow = new WOW({
				mobile: false
			});
			wow.init();
			jQuery(".status").fadeOut();
			jQuery(".preloader").delay(50).fadeOut("slow");

			$("[rel=popover-hover]").popover({
				trigger: "hover",
				html: true

			});

			function mainNav() {
				var top = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
				if (top > 40) $('.appear-on-scroll').stop().animate({
					"opacity": '1',
					"top": '0'
				});else $('.appear-on-scroll').stop().animate({
					"top": '-70',
					"opacity": '0'
				});

				if (top > 320) {
					$('.js-login').css('display', 'none');
				} else {
					$('.js-login').fadeIn(200);
				}

				if (top > 320) {
					$('.js-register').fadeIn(200);
				} else {
					$('.js-register').css('display', 'none');
				}
			}

			mainNav();
			$(window).scroll(function () {
				mainNav();
			});

			//$(document).on( 'scroll', function(){
			//	var height = $.(document).scrollTop();
			//	console.log(height);
			//});

			//$("html, body").animate({ scrollTop: height }, "slow");

			// app.serverCall.ajaxRequest('CheckStatusV2', "", function (result) {
			// if (result['response'] == "success") {
			//console.log(result);
			// }

			//  });
		},
		componentWillUnmount: function () {},

		render: function () {
			//console.log(this.props.page);

			if (this.props.page == 'index') {
				body = React.createElement(Compare, null);
			}
			if (this.props.page == 'donate') {
				//  body=<Compare scrollTo="donate"/>;
			}

			if (this.props.page == 'terms') {
				body = React.createElement(Terms, null);
			}
			if (this.props.page == 'pe') {
				body = React.createElement(PE, null);
			}

			if (this.props.page == 'privacy') {
				body = React.createElement(Privacy, null);
			}
			if (this.props.page == 'canary') {
				body = React.createElement(Canary, null);
			}
			if (this.props.page == 'forgotPassword') {
				body = React.createElement(ForgotPassword, { page: this.state.AccountResetOptions });
			}
			if (this.props.page == 'forgotSecret') {
				body = React.createElement(ForgotSecret, { page: this.state.AccountResetOptions });
			}
			/* data binding example <span>{this.state.AccountResetOptions.email}</span> */
			return React.createElement(
				'div',
				null,
				React.createElement(SplashHead, null),
				body,
				React.createElement(Login, null),
				React.createElement(SplashFoot, null),
				React.createElement(ReportBug, null),
				React.createElement(CreateUser, null),
				React.createElement(TokenPop, null),
				React.createElement(PaymentGate, null),
				React.createElement(DialogPop, null)
			);
		}
	});
});