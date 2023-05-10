define([
    "react",
    "app",
    "qrcode",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, qrcode, RightTop) {
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

                panel1Class: "d-none", //goog enab
                panel2Class: "d-none", //goog create
                panel3Class: "d-none", //yubi enab
                panel4Class: "d-none", //yubi create

                panel2Visible: "d-none",
                panel4Visible: "d-none",
                button1Class: "",
                googlePin: "",
                yubiPin: "",
            };
        },

        panelsReset: function () {
            this.setState({
                nav1Class: "",
                nav2Class: "",

                panel1Class: "d-none",
                panel2Class: "d-none",
                panel3Class: "d-none",
                panel4Class: "d-none",
                panel2Visible: "d-none",
                panel4Visible: "d-none",
                button1Class: "",
            });
        },

        whatToShow: function () {
            if (app.user.get("Factor2")["type"] == "google") {
                //google present
                this.setState({
                    nav1Class: "active",
                    nav2Class: "d-none",
                    nav1Click: "",
                    nav2Click: "",

                    panel1Class: "panel-body",
                    panel2Class: "d-none",
                    panel3Class: "d-none",
                    panel4Class: "d-none",
                    panel2Visible: "d-none",

                    button1Class: "d-none",
                });

                //this.generateQr(this.state.secret);
            } else if (app.user.get("Factor2")["type"] == "yubi") {
                //yubi present
                this.setState({
                    nav1Class: "d-none",
                    nav2Class: "active",
                    nav1Click: "",
                    nav2Click: "",

                    panel1Class: "d-none",
                    panel2Class: "d-none",
                    panel3Class: "panel-body",
                    panel4Class: "d-none",
                    panel2Visible: "d-none",
                    panel4Visible: "d-none",

                    button1Class: "d-none",
                    button2Class: "d-none",
                });
            } else {
                //if not selected

                this.setState({
                    nav1Class: "active",
                    nav2Class: "",
                    nav1Click: "show1Panel",
                    nav2Click: "show2Panel",

                    panel1Class: "d-none",
                    panel2Class: "panel-body",
                    panel3Class: "d-none",
                    panel4Class: "d-none",
                    panel2Visible: "d-none",
                    panel4Visible: "d-none",
                    button1Class: "",
                });
            }
        },

        componentDidMount: function () {
            this.whatToShow();
            var thisComp = this;

            this.setState({ googleValidator: $("#googleForm").validate() });

            $("#gpin").rules("add", {
                required: true,
                number: true,
                minlength: 6,
                maxlength: 6,
                remote: {
                    url: app.defaults.get("apidomain") + "/setup2FacV2",
                    type: "post",
                    data: {
                        secret: function () {
                            return thisComp.state.secret;
                        },
                        fac2Type: "google",
                        verificationCode: function () {
                            return thisComp.state.googlePin;
                        },
                        userToken: app.user.get("userLoginToken"),
                    },
                },
                messages: {
                    remote: "Incorrect Pin",
                },
            });

            this.setState({ yubiValidator: $("#yubiForm").validate() });
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
                    remote: "Incorrect Pin",
                },
            });
        },

        /**
         *
         * @param {string} action
         * @param {string} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "copyClipboard":
                    if (!navigator.clipboard) {
                    } else {
                        try {
                            navigator.clipboard
                                .writeText(
                                    $(event.target)
                                        .parent(".blue-bg-text")
                                        .find(".to-copy")
                                        .text()
                                )
                                .then(function () {});
                        } catch (e) {}
                    }
                    break;
                case "show1Panel":
                    this.handleClick("resetGoogleForm");
                    //this.whatToShow();

                    //this.setState({
                    //	nav1Class:"active",
                    //	panel2Class:"panel-body"
                    //});

                    break;

                case "show2Panel":
                    this.handleClick("resetYubiForm");

                    //this.setState({
                    //	nav1Class:"",
                    //	nav2Class:"active",
                    //	panel2Class:"d-none",
                    //	panel4Class:"panel-body",
                    //	button2Class:"",
                    //	button1Class:"d-none"
                    //});

                    break;
                case "confirmDisableGoogleAuth":
                    var thisComp = this;
                    $("#dialogModHead").html("Cancel Google 2-Factor");
                    $("#dialogModBody").html(" Are you sure?");

                    $("#dialogOk").on("click", function () {
                        thisComp.handleClick("DisableGoogleAuth");
                    });

                    $("#dialogPop").modal("show");

                    break;
                case "confirmDisableYubiAuth":
                    var thisComp = this;
                    $("#dialogModHead").html("Cancel YubiKey 2-Factor");
                    $("#dialogModBody").html("Are you sure?");

                    $("#dialogOk").on("click", function () {
                        thisComp.handleClick("DisableYubiAuth");
                    });

                    $("#dialogPop").modal("show");

                    break;

                case "DisableYubiAuth":
                    var thisComp = this;
                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: "",
                        },
                    });

                    app.userObjects.updateObjects(
                        "saveGoogleAuth",
                        "",
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.setState({
                                        secret: "",
                                        yubiPin: "",
                                    });

                                    thisComp.whatToShow();
                                } else if (result["data"] == "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                }
                            }
                        }
                    );
                    $("#dialogPop").modal("hide");

                    break;

                case "DisableGoogleAuth":
                    var thisComp = this;
                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: "",
                        },
                    });

                    $("#dialogPop").modal("hide");

                    app.userObjects.updateObjects(
                        "saveGoogleAuth",
                        "",
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.whatToShow();

                                    thisComp.whatToShow();
                                    $("#qrcode").html("");

                                    thisComp.setState({
                                        secret: "",
                                        googlePin: "",
                                    });
                                } else if (result["data"] == "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                }
                            }
                        }
                    );

                    //app.userObjects.updateObjects();
                    break;

                case "EnableGoogleAuth":
                    this.handleClick("resetGoogleForm");
                    this.panelsReset();

                    var secret = app.generate.makeQRSecret();
                    this.setState({
                        nav1Class: "active",
                        panel2Class: "panel-body",
                        panel2Visible: "",
                        button1Class: "d-none",
                        secret: secret,
                    });
                    this.generateQr(secret);

                    break;

                case "resetGoogleForm":
                    this.panelsReset();

                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: "",
                        },
                    });
                    $("#qrcode").html("");

                    this.setState({
                        nav1Class: "active",
                        panel2Class: "panel-body",
                        panel2Visible: "d-none",
                        button1Class: "",
                        secret: "",
                        googlePin: "",
                    });

                    $("#gpin").removeClass("invalid");
                    $("#gpin").removeClass("valid");

                    var validator = $("#googleForm").validate();
                    validator.resetForm();

                    break;
                case "saveNewGoogleAuth":
                    var validator = this.state.googleValidator;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        var post = {
                            secret: thisComp.state.secret,
                            fac2Type: "google",
                            verificationCode: thisComp.state.googlePin,
                        };
                        app.serverCall.ajaxRequest(
                            "setup2Fac",
                            post,
                            function (result) {
                                if (result === true) {
                                    app.user.set({
                                        Factor2: {
                                            type: "google",
                                            secret: app.transform.to64str(
                                                thisComp.state.secret
                                            ),
                                            since: Math.round(
                                                new Date().getTime() / 1000
                                            ),
                                        },
                                    });

                                    app.userObjects.updateObjects(
                                        "saveGoogleAuth",
                                        "",
                                        function (result) {
                                            if (
                                                result["response"] == "success"
                                            ) {
                                                if (result["data"] == "saved") {
                                                    thisComp.whatToShow();
                                                    $("#qrcode").html("");

                                                    thisComp.setState({
                                                        secret: "",
                                                        googlePin: "",
                                                    });
                                                } else if (
                                                    result["data"] ==
                                                    "newerFound"
                                                ) {
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        );

                        $("#gpin").removeClass("invalid");
                        $("#gpin").removeClass("valid");

                        var validator = $("#googleForm").validate();
                        validator.resetForm();
                    }

                    break;
                case "saveNewYubiAuth":
                    var validator = this.state.yubiValidator;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        app.user.set({ Fac2Changed: true });

                        app.user.set({
                            Factor2: {
                                type: "yubi",
                                secret: app.transform.to64str(
                                    this.state.yubiPin.substring(0, 12)
                                ),
                                since: Math.round(new Date().getTime() / 1000),
                            },
                        });

                        app.userObjects.updateObjects(
                            "saveGoogleAuth",
                            thisComp.state.yubiPin,
                            function (result) {
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        thisComp.whatToShow();
                                        //$('#qrcode').html('');

                                        thisComp.setState({
                                            secret: "",
                                            yubiPin: "",
                                        });
                                    } else if (result["data"] == "newerFound") {
                                        //app.notifications.systemMessage('newerFnd');
                                    }
                                }
                            }
                        );

                        //app.userObjects.updateObjects();
                        //this.whatToShow();
                    }

                    break;

                case "EnableYubiKeyAuth":
                    this.panelsReset();

                    this.setState({
                        nav2Class: "active",
                        panel4Class: "panel-body",
                        panel4Visible: "",
                        button2Class: "d-none",
                    });

                    break;

                case "resetYubiForm":
                    this.panelsReset();

                    app.user.set({
                        Factor2: {
                            type: "",
                            secret: "",
                            since: "",
                        },
                    });
                    $("#qrcode").html("");

                    this.setState({
                        nav2Class: "active",
                        panel4Class: "panel-body",
                        panel2Visible: "d-none",
                        button2Class: "",
                        yubiPin: "",
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
                case "enterGCode":
                    this.setState({
                        googlePin: event.target.value,
                    });
                    break;
                case "enterYCode":
                    this.setState({
                        yubiPin: event.target.value,
                    });
                    break;

                case "preventEnter":
                    if (event.keyCode == 13) {
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
                <div id="rightSettingPanel">
                    <div className="setting-middle two-step-security">
                        <div className="middle-top">
                            <div className="arrow-back">
                                <a href="#"></a>
                            </div>
                            <h2>Security</h2>
                            <div className="bread-crumb">
                                <ul>
                                    <li>2FA</li>
                                </ul>
                            </div>
                        </div>
                        <div className="middle-content">
                            <div className="mid-nav">
                                <ul>
                                    <li className={this.state.nav1Class}>
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                this.state.nav1Click
                                            )}
                                        >
                                            Google auth
                                        </a>
                                    </li>
                                    <li className={this.state.nav2Class}>
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                this.state.nav2Click
                                            )}
                                        >
                                            YubiKey
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className={this.state.panel1Class}>
                                <blockquote>
                                    <p>
                                        Using Google AUTH Since:{" "}
                                        <strong>
                                            {new Date(
                                                app.user.get("Factor2")[
                                                    "since"
                                                ] * 1000
                                            ).toLocaleDateString()}
                                        </strong>
                                    </p>
                                </blockquote>

                                <div className="form-section-bottom">
                                    <div className="btn-row">
                                        <button
                                            type="button"
                                            className="btn-blue fixed-width-btn"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "confirmDisableGoogleAuth"
                                            )}
                                        >
                                            Disable Google Auth
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={this.state.panel2Class}>
                                <div className="form-section-bottom">
                                    <div className="btn-row">
                                        <button
                                            type="button"
                                            className={
                                                "btn-blue fixed-width-btn " +
                                                this.state.button1Class
                                            }
                                            onClick={this.handleClick.bind(
                                                this,
                                                "EnableGoogleAuth"
                                            )}
                                        >
                                            Enable Google Auth
                                        </button>
                                    </div>
                                </div>

                                <div className={this.state.panel2Visible}>
                                    <div className="form-group">
                                        <div
                                            id="qrcode"
                                            className="qrcode"
                                        ></div>
                                    </div>

                                    <div className="form-group">
                                        <input
                                            type="name"
                                            className="form-control"
                                            readOnly={true}
                                            value={this.state.secret}
                                        />
                                    </div>

                                    <div className="form-section">
                                        <form
                                            id="googleForm"
                                            onKeyDown={this.handleChange.bind(
                                                this,
                                                "preventEnter"
                                            )}
                                        >
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <input
                                                            name="verificationCode"
                                                            id="gpin"
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                this.state
                                                                    .googlePin
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "enterGCode"
                                                            )}
                                                            placeholder="Enter code"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-section-bottom">
                                                <div className="btn-row">
                                                    <button
                                                        type="button"
                                                        className="btn-border fixed-width-btn"
                                                        onClick={this.handleClick.bind(
                                                            this,
                                                            "resetGoogleForm"
                                                        )}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-blue fixed-width-btn"
                                                        onClick={this.handleClick.bind(
                                                            this,
                                                            "saveNewGoogleAuth"
                                                        )}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className={this.state.panel3Class}>
                                <blockquote>
                                    <p>
                                        Using YubiKey Since:{" "}
                                        <strong>
                                            {new Date(
                                                app.user.get("Factor2")[
                                                    "since"
                                                ] * 1000
                                            ).toLocaleDateString()}
                                        </strong>
                                    </p>
                                </blockquote>

                                <div className="form-section-bottom">
                                    <div className="btn-row">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "confirmDisableYubiAuth"
                                            )}
                                        >
                                            Disable YubiKey
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={this.state.panel4Class}>
                                <div className="form-section-bottom">
                                    <div className="btn-row">
                                        <button
                                            type="button"
                                            className={
                                                "btn-blue fixed-width-btn " +
                                                this.state.button2Class
                                            }
                                            onClick={this.handleClick.bind(
                                                this,
                                                "EnableYubiKeyAuth"
                                            )}
                                        >
                                            Enable Yubikey
                                        </button>
                                    </div>
                                </div>

                                <div className={this.state.panel4Visible}>
                                    <div className="form-section">
                                        <form
                                            id="yubiForm"
                                            onKeyDown={this.handleChange.bind(
                                                this,
                                                "preventEnter"
                                            )}
                                        >
                                            <div className="row">
                                                <div className={`col-12`}>
                                                    <div className="form-group">
                                                        <input
                                                            name="verificationCode"
                                                            id="ypin"
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                this.state
                                                                    .yubiPin
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "enterYCode"
                                                            )}
                                                            placeholder="Enter code"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-section-bottom">
                                                <div className="btn-row">
                                                    <button
                                                        type="button"
                                                        className="btn-border fixed-width-btn"
                                                        onClick={this.handleClick.bind(
                                                            this,
                                                            "resetYubiForm"
                                                        )}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-blue fixed-width-btn"
                                                        onClick={this.handleClick.bind(
                                                            this,
                                                            "saveNewYubiAuth"
                                                        )}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-right two-step-security">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>

                            <div className="panel-body">
                                <h3>Google Authenticator</h3>
                                <p>
                                    Increase the security of your login with
                                    multi-factor authentication by Google
                                    Authenticator. After typing in your login
                                    password, you'll be prompted to enter the
                                    six digit code displayed in the
                                    Authenticator app on your mobile device. To
                                    begin the setup, be sure you are on the
                                    Google Auth tab and click on "Enable Google
                                    Auth" using the Authenticator app on your
                                    mobile device and scan the QR code displayed
                                    in your account settings.
                                </p>
                                <h3>YubiKey</h3>
                                <p>
                                    Small usb key, that generates One Time
                                    Password in order to protect your account.
                                    Please note, that in order to verify a
                                    token, the system needs to make request on
                                    third party server, that potentially can
                                    disclose your login attempt. You can learn
                                    more at :
                                </p>
                                <div className="blue-bg-text">
                                    <a
                                        href="https://www.yubico.com/start/"
                                        target={`_blank`}
                                    >
                                        https://www.yubico.com/start/
                                    </a>
                                    <a
                                        className="__copy"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "copyClipboard"
                                        )}
                                    >
                                        <span className="icon">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10.625 8.97812V11.2094C10.625 13.0688 9.88125 13.8125 8.02188 13.8125H5.79063C3.93125 13.8125 3.1875 13.0688 3.1875 11.2094V8.97812C3.1875 7.11875 3.93125 6.375 5.79063 6.375H8.02188C9.88125 6.375 10.625 7.11875 10.625 8.97812Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M13.8125 5.79063V8.02188C13.8125 9.88125 13.0688 10.625 11.2094 10.625H10.625V8.97812C10.625 7.11875 9.88125 6.375 8.02188 6.375H6.375V5.79063C6.375 3.93125 7.11875 3.1875 8.97812 3.1875H11.2094C13.0688 3.1875 13.8125 3.93125 13.8125 5.79063Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
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
        generateQr: function (secret) {
            var qrcode = new QRCode("qrcode", {
                text:
                    "otpauth://totp/" +
                    app.user.get("loginEmail") +
                    "?secret=" +
                    secret +
                    "&issuer=CyberFear.com",
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M,
            });
        },
    });
});
