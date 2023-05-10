define(["app", "react"], function (app, React) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                newPass: "",
                newPassRep: "",
                coupon: "",

                emailError: "",
                newPassError: "",
                couponError: "",
                repPassError: "",

                emailSucc: false,
                newPassSucc: false,
                repPassSucc: false,
                couponSucc: false,

                working: false,
                buttonTag: "",
                buttonText: "SIGN UP",

                accountCreationStatus: null,
                accountCreationError: ""
            };
        },

        componentDidMount: function () {
            $("#createAccount-modal").on("shown.bs.modal", function () {});
        },
        handleChange: function (action, event) {
            switch (action) {
                case "coupon":
                    var thisComp = this;
                    this.setState({
                        coupon: event.target.value
                    }, function () {
                        thisComp.checkCouponTyping();
                    });
                    break;
                case "email":
                    var thisComp = this;
                    var email = event.target.value;
                    console.log(email.length);
                    if (email.indexOf("@") !== -1) {
                        this.setState({
                            emailError: "please enter only first part of email, without @"
                        });
                    } else if (email.length < 3) {
                        this.setState({
                            emailError: "minimum 3 character"
                        });
                    } else if (email.length > 250) {
                        this.setState({
                            emailError: "maximum 250 character"
                        });
                    } else {
                        this.setState({
                            emailError: ""
                        });
                    }

                    this.setState({
                        email: event.target.value
                    }, function () {
                        thisComp.checkEmailTyping();
                    });

                    break;
                case "newPass":
                    var newPass = event.target.value;

                    if (newPass.length < 6) {
                        this.setState({
                            newPassError: "Please use password bigger than 6 characters",
                            newPassSucc: false,
                            repPassError: "",
                            repPassSucc: false
                        });
                    } else if (newPass.length > 80) {
                        this.setState({
                            newPassError: "Please use password less than 80 characters",
                            newPassSucc: false,
                            repPassError: "",
                            repPassSucc: false
                        });
                    } else {
                        this.setState({
                            newPassError: "",
                            newPassSucc: true,
                            repPassError: "",
                            repPassSucc: false
                        });
                    }

                    this.setState({
                        newPass: newPass
                    });
                    break;
                case "newPassRep":
                    var newPassRep = event.target.value;

                    if (this.state.newPass !== event.target.value) {
                        this.setState({
                            repPassError: "Please enter the same password as above",
                            repPassSucc: false
                        });
                    } else {
                        this.setState({
                            repPassError: "",
                            repPassSucc: true
                        });
                    }

                    this.setState({
                        newPassRep: event.target.value
                    });

                    break;
            }
        },

        checkFields: function () {
            var thisComp = this;

            thisComp.setState({
                working: true,
                buttonTag: "fa fa-refresh fa-spin",
                buttonText: "WORKING.."
            });

            var def = $.Deferred();

            var em = { target: { value: this.state.email } };
            this.handleChange("email", em);

            var newPass = { target: { value: this.state.newPass } };
            this.handleChange("newPass", newPass);

            var newPassRep = { target: { value: this.state.newPassRep } };
            this.handleChange("newPassRep", newPassRep);

            setTimeout(function () {
                if (thisComp.state.emailError == "" && thisComp.state.newPassError == "" && thisComp.state.repPassError == "" && thisComp.state.couponError == "") {
                    def.resolve(true);
                } else {
                    def.reject();
                    thisComp.setState({
                        working: false,
                        buttonTag: "",
                        buttonText: "SIGN UP"
                    });
                }
            }, 400);

            return def;
        },

        generateUser: function () {
            var thisComp = this;

            this.checkFields().then(function (msg) {
                var userAddress = thisComp.state.email.toLowerCase().split("@")[0];
                var email = userAddress + app.defaults.get("domainMail").toLowerCase();

                var pass = app.transform.SHA512(app.globalF.makeDerivedFancy(thisComp.state.newPass, app.defaults.get("hashToken")));
                var folderKey = app.globalF.makeRandomBytes(32);
                var salt = app.globalF.makeRandomBytes(256);
                var secret = app.globalF.makeDerived(thisComp.state.newPass, salt);

                //console.log();
                app.generate.generateUserObjects(email, pass, secret, folderKey, salt).then(function (userObj) {
                    userObj["newPass"] = pass;
                    userObj["salt"] = app.transform.bin2hex(salt);
                    userObj["coupon"] = thisComp.state.coupon;

                    $.ajax({
                        method: "POST",
                        url: app.defaults.get("apidomain") + "/createNewUserV2",
                        data: userObj,
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        }
                    }).then(function (msg) {
                        if (msg["response"] === "fail") {
                            if (msg["data"] === "limitIsReached") {
                                // app.notifications.systemMessage('once5min');
                                thisComp.setState({
                                    accountCreationError: "once5min"
                                });
                            } else {
                                // app.notifications.systemMessage('tryAgain');
                                thisComp.setState({
                                    accountCreationError: "tryAgain"
                                });
                            }
                        } else if (msg["response"] === "success") {
                            thisComp.setState({
                                accountCreationStatus: true
                            });
                        }

                        thisComp.setState({
                            working: false,
                            buttonTag: "",
                            buttonText: "SIGN UP"
                        });

                        // console.log(msg)
                    });
                });
            });

            //app.genea
        },
        checkCouponTyping: function () {
            var thisComp = this;
            if (thisComp.state.coupon.length >= 0) {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get("apidomain") + "/checkCouponExistV2",
                    data: {
                        coupon: this.state.coupon
                    },
                    dataType: "text",
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function (msg) {
                    if (msg === "false" && thisComp.state.coupon.length > 0) {
                        thisComp.setState({
                            couponError: "coupon not valid",
                            couponSucc: false
                        });
                    } else if (msg === "true" || thisComp.state.coupon.length == 0) {
                        thisComp.setState({
                            couponError: "",
                            couponSucc: true
                        });
                    }
                });
            }
        },

        checkEmailTyping: function () {
            var thisComp = this;
            if (thisComp.state.email.length >= 3) {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get("apidomain") + "/checkEmailExistV2",
                    data: {
                        fromEmail: this.state.email + app.defaults.get("domainMail").toLowerCase()
                    },
                    dataType: "text"
                }).done(function (msg) {
                    if (msg === "false") {
                        thisComp.setState({
                            emailError: "email exists"
                        });
                    } else if (msg === "true" && thisComp.state.email.length > 2 && thisComp.state.email.length < 250) {
                        thisComp.setState({
                            emailError: ""
                        });
                    }
                });
            }
        },

        checkEmail: function () {
            var thisComp = this;
            $.ajax({
                method: "POST",
                url: app.defaults.get("apidomain") + "/checkEmailExistV2",
                data: {
                    fromEmail: this.state.email + "@CyberFear.com"
                },
                dataType: "text"
            }).done(function (msg) {
                if (msg === "false") {
                    thisComp.setState({
                        emailError: "email exists"
                    });
                } else if (msg === "true") {
                    thisComp.generateUser();
                } else if (JSON.parse(msg)["email"] != undefined) {
                    thisComp.setState({
                        emailError: JSON.parse(msg)["email"]
                    });
                } else {
                    // app.notifications.systemMessage('tryAgain');
                    thisComp.setState({
                        accountCreationError: "tryAgain"
                    });
                }
            });
        },
        handleClick: function (i, e) {
            this.setState({
                accountCreationError: ""
            });
            switch (i) {
                case "createUser":
                    this.checkEmail();

                    break;
                case "enterCreateUser":
                    if (e.keyCode == 13) {
                        this.checkEmail();
                    }
                    break;
            }
        },
        handleModalClose: function () {
            this.setState({
                accountCreationStatus: null
            });
        },
        handleDownloadToken: function () {
            var toFile = app.user.get("downloadToken");

            var element = document.createElement("a");
            element.setAttribute("href", "data:attachment/plain;charset=utf-8," + toFile);
            element.setAttribute("download", "secretToken.key");

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "", id: "createAccount-modal" },
                React.createElement(
                    "div",
                    {
                        className: `loading-screen welcome ${ this.state.working ? "d-flex" : "d-none" }`
                    },
                    React.createElement(
                        "div",
                        { className: "t-animation is-loading page-login" },
                        React.createElement(
                            "div",
                            {
                                className: " loading-animation type-progress style-circle "
                            },
                            React.createElement(
                                "div",
                                { className: "progress-circle medium" },
                                React.createElement(
                                    "div",
                                    { className: "circle-bg" },
                                    React.createElement("img", {
                                        src: "/images/loading-circle.svg",
                                        alt: "loading-circle",
                                        style: {
                                            width: "91px",
                                            height: "91px"
                                        }
                                    })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "circle-content" },
                                    React.createElement(
                                        "div",
                                        { className: "loading-spinner" },
                                        React.createElement(
                                            "div",
                                            { className: "the-spinner" },
                                            React.createElement("div", { className: "_bar1" }),
                                            React.createElement("div", { className: "_bar2" }),
                                            React.createElement("div", { className: "_bar3" }),
                                            React.createElement("div", { className: "_bar4" }),
                                            React.createElement("div", { className: "_bar5" }),
                                            React.createElement("div", { className: "_bar6" }),
                                            React.createElement("div", { className: "_bar7" }),
                                            React.createElement("div", { className: "_bar8" })
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "progress-content" },
                                React.createElement(
                                    "h4",
                                    null,
                                    "Creating account!"
                                ),
                                React.createElement(
                                    "p",
                                    null,
                                    "Please wait a few second..."
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "modal-dialog modal-dialog-centered" },
                    React.createElement(
                        "div",
                        {
                            className: "modal-content",
                            onKeyDown: this.handleClick.bind(this, "enterCreateUser")
                        },
                        React.createElement(
                            "h1",
                            null,
                            "Create Account"
                        ),
                        React.createElement(
                            "div",
                            { className: "welcome-text" },
                            "to start using privacy protecting email service"
                        ),
                        React.createElement(
                            "div",
                            { className: "form-section" },
                            React.createElement(
                                "form",
                                {
                                    className: "registration-form smart-form",
                                    id: "createUser"
                                },
                                React.createElement(
                                    "div",
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-7" },
                                        React.createElement(
                                            "div",
                                            {
                                                className: "form-group " + (this.state.emailError != "" ? "has-error" : "") + (this.state.emailSucc ? "has-success" : "")
                                            },
                                            React.createElement("input", {
                                                type: "text",
                                                name: "email",
                                                id: "userEmail",
                                                className: "form-control input-lg",
                                                placeholder: "choose email",
                                                maxLength: "160",
                                                onChange: this.handleChange.bind(this, "email"),
                                                value: this.state.email
                                            }),
                                            React.createElement(
                                                "label",
                                                {
                                                    className: "control-label pull-left " + (this.state.emailError == "" ? "hidden" : ""),
                                                    htmlFor: "resetEmail"
                                                },
                                                this.state.emailError
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-5" },
                                        React.createElement(
                                            "div",
                                            { className: "form-group" },
                                            React.createElement(
                                                "select",
                                                {
                                                    className: "form-select",
                                                    "aria-label": "Default select example"
                                                },
                                                React.createElement(
                                                    "option",
                                                    { selected: "" },
                                                    "@cyberfear.com"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "1" },
                                                    "@cyberfear.com"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "2" },
                                                    "@cyberfear.com"
                                                ),
                                                React.createElement(
                                                    "option",
                                                    { value: "3" },
                                                    "@cyberfear.com"
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "div",
                                            {
                                                className: "form-group " + (this.state.newPassError != "" ? "has-error" : "") + (this.state.newPassSucc ? "has-success" : "")
                                            },
                                            React.createElement("input", {
                                                className: "form-control input-lg",
                                                name: "password",
                                                id: "userPassword",
                                                type: "password",
                                                placeholder: "password",
                                                onChange: this.handleChange.bind(this, "newPass"),
                                                value: this.state.newPass
                                            }),
                                            React.createElement(
                                                "label",
                                                {
                                                    className: "control-label pull-left " + (this.state.newPassError == "" ? "hidden" : ""),
                                                    htmlFor: "newPass"
                                                },
                                                this.state.newPassError
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "div",
                                            {
                                                className: "form-group " + (this.state.repPassError != "" ? "has-error" : "") + (this.state.repPassSucc ? "has-success" : "")
                                            },
                                            React.createElement("input", {
                                                className: "form-control input-lg",
                                                name: "passwordrepeat",
                                                id: "userPasswordRepeat",
                                                type: "password",
                                                placeholder: "repeat password",
                                                onChange: this.handleChange.bind(this, "newPassRep"),
                                                value: this.state.newPassRep
                                            }),
                                            React.createElement(
                                                "label",
                                                {
                                                    className: "control-label pull-left " + (this.state.repPassError == "" ? "hidden" : ""),
                                                    htmlFor: "newPassRep"
                                                },
                                                this.state.repPassError
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "div",
                                            { className: "form-group d-none" },
                                            React.createElement("input", {
                                                className: "form-control input-lg",
                                                name: "robotText",
                                                id: "imrobot",
                                                type: "text",
                                                placeholder: "I'm no robot",
                                                onChange: this.handleChange.bind(this, "norobot"),
                                                value: this.state.norobot
                                            }),
                                            React.createElement(
                                                "label",
                                                {
                                                    className: "control-label pull-left " + (this.state.repPassError == "" ? "hidden" : ""),
                                                    htmlFor: "newPassRep"
                                                },
                                                this.state.repPassError
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "div",
                                            {
                                                className: "form-group " + (this.state.couponError != "" ? "has-error" : "") + (this.state.couponSucc ? "has-success" : "")
                                            },
                                            React.createElement("input", {
                                                className: "form-control input-lg",
                                                name: "password",
                                                id: "coupon",
                                                type: "text",
                                                placeholder: "if you have please enter coupon code here",
                                                onChange: this.handleChange.bind(this, "coupon"),
                                                value: this.state.coupon
                                            }),
                                            React.createElement(
                                                "label",
                                                {
                                                    className: "control-label pull-left " + (this.state.couponError == "" ? "hidden" : ""),
                                                    htmlFor: "newPass"
                                                },
                                                this.state.couponError
                                            )
                                        )
                                    ),
                                    this.state.accountCreationError !== "" ? React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "div",
                                            { className: "bg-danger px-4 py-2 rounded text-white text-center mb-2 fs-6" },
                                            this.state.accountCreationError === "once5min" ? React.createElement(
                                                "span",
                                                null,
                                                `Please wait 5 minutes before creating another account`
                                            ) : React.createElement(
                                                "span",
                                                null,
                                                `An error occured while trying to create user, please try again in another 5 minutes`
                                            )
                                        )
                                    ) : null,
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "btn-blue full-width mt44",
                                                type: "button",
                                                disabled: this.state.working,
                                                onClick: this.handleClick.bind(this, "createUser")
                                            },
                                            this.state.buttonText
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-sm-12" },
                                        React.createElement(
                                            "div",
                                            {
                                                className: "text-center mt-2",
                                                style: { fontSize: "14px" }
                                            },
                                            "By clicking \u201CCreate Account\u201D you agree with our",
                                            " ",
                                            React.createElement(
                                                "a",
                                                {
                                                    href: "/terms.html",
                                                    target: "_blank",
                                                    style: {
                                                        fontWeight: "700"
                                                    }
                                                },
                                                " ",
                                                "Terms of Service",
                                                " "
                                            ),
                                            " ",
                                            React.createElement("br", null),
                                            React.createElement(
                                                "a",
                                                {
                                                    href: "mailbox.html#login",
                                                    className: "text-decoration-underline"
                                                },
                                                "Already a user"
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "share hidden" },
                                    React.createElement(
                                        "a",
                                        {
                                            className: "",
                                            href: "https://facebook.com/sharer/sharer.php?u=https://cyberfear.com",
                                            target: "_blank",
                                            "aria-label": ""
                                        },
                                        React.createElement("i", { className: "fa fa-facebook fa-lg" })
                                    ),
                                    React.createElement(
                                        "a",
                                        {
                                            className: "",
                                            href: "https://twitter.com/intent/tweet/?text=I'm protecting my emails with cyberfear.com.&url=https://cyberfear.com",
                                            target: "_blank",
                                            "aria-label": ""
                                        },
                                        React.createElement("i", { className: "fa fa-twitter fa-lg" })
                                    ),
                                    React.createElement(
                                        "a",
                                        {
                                            className: "",
                                            href: "https://plus.google.com/share?url=https://cyberfear.com",
                                            target: "_blank",
                                            "aria-label": ""
                                        },
                                        React.createElement("i", { className: "fa fa-google-plus fa-lg" })
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    {
                        className: `modal modal-sheet position-fixed ${ this.state.accountCreationStatus ? "d-block" : "d-none" } bg-secondary bg-opacity-75 py-5`,
                        tabindex: "-1",
                        role: "dialog",
                        id: "modalSheet"
                    },
                    React.createElement(
                        "div",
                        { className: "modal-dialog", role: "document" },
                        React.createElement(
                            "div",
                            { className: "modal-content rounded-4 shadow px-4 py-4" },
                            React.createElement(
                                "div",
                                { className: "modal-header border-bottom-0" },
                                React.createElement(
                                    "h5",
                                    { className: "modal-title" },
                                    "Your account was successfully created!"
                                ),
                                React.createElement("button", {
                                    type: "button",
                                    className: "btn-close",
                                    "data-bs-dismiss": "modal",
                                    "aria-label": "Close",
                                    onClick: this.handleModalClose.bind(this)
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-body py-0" },
                                React.createElement(
                                    "p",
                                    { className: "mb-2" },
                                    "Before logging in, please",
                                    " ",
                                    React.createElement(
                                        "b",
                                        null,
                                        "download the secret token"
                                    ),
                                    ". You will need this token to reset your password or secret phrase. You can read more about it in our",
                                    " ",
                                    React.createElement(
                                        "a",
                                        {
                                            href: "https://blog.cyberfear.com/reset-password",
                                            target: "_blank"
                                        },
                                        "blog"
                                    )
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-lg btn-dark mx-0 mb-2 fs-6",
                                        onClick: this.handleDownloadToken.bind(this)
                                    },
                                    "Download Token"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer flex-column border-top-0" },
                                React.createElement(
                                    "p",
                                    null,
                                    "Once dwonloaded, please log in."
                                ),
                                React.createElement(
                                    "a",
                                    {
                                        href: "#login",
                                        className: "btn btn-lg btn-primary w-100 mx-0 fs-6"
                                    },
                                    "Login"
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});