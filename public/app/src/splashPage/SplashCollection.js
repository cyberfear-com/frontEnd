define([
    "react",
    "app",
    "wow",
    "cmpld/splashPage/head",
    "cmpld/splashPage/compare",
    "cmpld/splashPage/loginPage",
    "cmpld/splashPage/footer",
    "cmpld/modals/login",
    "cmpld/splashPage/forgotPassword",
    "cmpld/splashPage/forgotSecret",
    "cmpld/modals/reportBug",
    "cmpld/modals/createUser",
    // "cmpld/modals/contactUs",
    "cmpld/splashPage/pe",
    "cmpld/modals/tokenPop",
    "cmpld/modals/paymentGate",
    "cmpld/modals/dialogPop",
], function (
    React,
    app,
    Wow,
    SplashHead,
    Compare,
    LoginPage,
    SplashFoot,
    Login,
    ForgotPassword,
    ForgotSecret,
    ReportBug,
    // ContactUs,
    CreateUser,
    PE,
    TokenPop,
    PaymentGate,
    DialogPop
) {
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
                email: "",
                secretToken: "",
            };

            this.setState({ AccountResetOptions: AccountResetOptions });

            var wow = new WOW({
                mobile: false,
            });
            wow.init();
            jQuery(".status").fadeOut();
            jQuery(".preloader").delay(50).fadeOut("slow");

            $("[rel=popover-hover]").popover({
                trigger: "hover",
                html: true,
            });

            function mainNav() {
                var top =
                    (document.documentElement &&
                        document.documentElement.scrollTop) ||
                    document.body.scrollTop;
                if (top > 40)
                    $(".appear-on-scroll").stop().animate({
                        opacity: "1",
                        top: "0",
                    });
                else
                    $(".appear-on-scroll").stop().animate({
                        top: "-70",
                        opacity: "0",
                    });

                if (top > 320) {
                    $(".js-login").css("display", "none");
                } else {
                    $(".js-login").fadeIn(200);
                }

                if (top > 320) {
                    $(".js-register").fadeIn(200);
                } else {
                    $(".js-register").css("display", "none");
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
            // console.log(this.props.page);

           /* if (this.props.page == "index") {
                body = <Compare />;
            }*/
            if (this.props.page == "login") {
                body = <LoginPage />;
            }
            if (this.props.page == "signup") {
                body = <CreateUser coupon={this.props.coupon}/>;
            }
            if (this.props.page == "pe") {
                body = <PE />;
            }
            if (this.props.page == "firstTimeLogin") {
                body = <PaymentGate />;
            }

            if (this.props.page == "forgotPassword") {
                body = <ForgotPassword page={this.state.AccountResetOptions} />;
            }
            if (this.props.page == "forgotSecret") {
                body = <ForgotSecret page={this.state.AccountResetOptions} />;
            }
            /* data binding example <span>{this.state.AccountResetOptions.email}</span> */
            if (
                this.props.page === "login" ||
                this.props.page === "signup" ||
                this.props.page === "forgotPassword" ||
                this.props.page === "firstTimeLogin"
            ) {
                return (
                    <div>
                            { body }
                    </div>
                );
            }/* else {
                return (
                    <div>
                        <SplashHead />
                        {body}
                        <Login />
                        <SplashFoot />
                        <ReportBug />

                        <TokenPop />

                        <DialogPop />
                    </div>
                );
            }*/
        },
    });
});
