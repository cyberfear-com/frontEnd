define(["react", "app", "ajaxQueue", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, ajaxQueue, RightTop) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                viewFlag: false,
                panel: {
                    firstPanelClass: "panel-body",
                    secondPanelClass: "panel-body d-none",
                    firstTab: "active",
                    secondTab: app.user.get("oneStep") ? "d-none" : ""
                },

                saveButton1Panel: { text: "Save", enabled: true, iClass: "" },
                saveButton2Panel: {
                    text: "Save",
                    enabled: true,
                    iClass: "",
                    onClick: "change2Pass"
                },

                password1input: { text: app.defaults.get("firstPassfield") },
                password1inputRepeat: app.defaults.get("firstPassfield"),

                password2input: { text: app.defaults.get("secondPassfield") },
                password2inputRepeat: {
                    text: app.defaults.get("secondPassfield")
                },

                secAlertText: app.user.get("oneStep") ? "" : "d-none",
                remeberPassword: app.user.get("remeberPassword"),

                paswordForm: {},
                secForm: {},
                button2Class: app.user.get("oneStep") ? "d-none" : "",
                button3Class: app.user.get("oneStep") ? "btn btn-default" : "d-none"
            };
        },
        componentWillUnmount: function () {
            //console.log('dismounted');
            //id="askPasSub">Submit</button>
            //id="askPasCancel">Cancel</button>
        },

        componentDidMount: function () {
            this.setState({
                paswordForm: $("#passForm").validate(),
                secForm: $("#secForm").validate()
            });

            $("#newPass").rules("add", {
                required: true,
                minlength: 6,
                maxlength: 80
            });

            $("#newPassRep").rules("add", {
                required: true,
                minlength: 6,
                maxlength: 80,
                equalTo: "#newPass",
                messages: {
                    required: "Please enter your password one more time.",
                    equalTo: "Please enter the same password as above."
                }
            });

            $("#newSecret").rules("add", {
                required: true,
                minlength: 6,
                maxlength: 80
            });

            $("#newSecretRep").rules("add", {
                required: true,
                minlength: 6,
                maxlength: 80,
                equalTo: "#newSecret",
                messages: {
                    required: "Please enter your password one more time.",
                    equalTo: "Please enter the same password as above."
                }
            });

            //app.user.set({oneStep:true});
            //app.user.set({factor2Auth:true});

            //console.log(app.user);
            //this.handleClick('showSecond');
        },

        /**
         *
         * @param {string} testPass
         * @param {boolean} callback
         */
        checkIfFirstPassGood: function (testPass, callback) {
            var post = {};
            console.log(app.user.get("oneStep"));
            //post['Testpassword'] = testPass;

            if (app.user.get("oneStep")) {
                post["password"] = app.transform.SHA512(app.globalF.makeDerivedFancy(testPass, app.defaults.get("hashToken")));
                post["steps"] = 1;
            } else {
                post["password"] = app.transform.SHA512(testPass);
                post["steps"] = 2;
            }
            app.serverCall.ajaxRequest("checkPass", post, function (result) {
                if (result["response"] == "success") {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "showFirst":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body",
                            secondPanelClass: "panel-body d-none",
                            firstTab: "active",
                            secondTab: app.user.get("oneStep") ? "d-none" : ""
                        }
                    });

                    break;

                case "showSecond":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body d-none",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active"
                        }
                    });

                    break;

                case "downloadToken":
                    var toFile = "";

                    app.globalF.checkSecondPass(function () {
                        var derivedKey = app.user.get("secondPassword");
                        console.log(derivedKey);
                        //console.log(salt);

                        app.generate.generateToken(derivedKey, function (tokenHash, tokenAes, tokenAesHash) {
                            toFile = tokenAes;

                            var post = {
                                tokenHash: tokenHash,
                                tokenAesHash: tokenAesHash
                            };

                            app.serverCall.ajaxRequest("updateSecretToken", post, function (result) {
                                if (result["response"] == "success") {
                                    var element = document.createElement("a");
                                    element.setAttribute("href", "data:attachment/plain;charset=utf-8," + toFile);
                                    element.setAttribute("download", app.user.get("email") + ".key");

                                    element.style.display = "none";
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
                                } else if (result["response"] == "fail") {
                                    app.notifications.systemMessage("tryAgain");
                                }
                            });
                        });
                    });

                    break;

                case "enableSecondPass":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body d-none",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active"
                        }
                    });

                    break;

                case "change1Pass":
                    //verify existing pass
                    console.log(app.user.get("remeberPassword"));

                    var paswordForm = this.state.paswordForm;
                    paswordForm.form();

                    var thisComp = this;
                    if (paswordForm.numberOfInvalids() == 0) {
                        $("#askPassHeader").html("Provide Original Password");

                        $("#askforPass").modal("show");
                        $("#askPasSub").on("click", function () {
                            thisComp.handleClick("save1Pass", $("#askPasInput").val());
                        });
                    }
                    break;

                case "delete2Pass":
                    var thisComp = this;

                    this.checkIfFirstPassGood(event, function (result) {
                        if (result) {
                            app.user.set({
                                password: app.transform.SHA512(event)
                            });
                            app.user.set({
                                newPassword: app.transform.SHA512(app.globalF.makeDerivedFancy(event, app.defaults.get("hashToken")))
                            });
                            app.user.set({
                                newSecondPassword: app.globalF.makeDerived(event, app.user.get("salt"))
                            });

                            app.user.set({ oneStep: true });
                            $("#askforPass").modal("hide");

                            //console.log(app.user);

                            app.userObjects.updateObjects("changeSecondPass", "disableSecond", function (result) {
                                //restore copy of the object if failed to save
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        thisComp.handleClick("resetSecondPanel");
                                        thisComp.handleClick("resetFirstPanel");
                                        thisComp.setState({
                                            secAlertText: "",
                                            button3Class: "btn btn-default",
                                            button2Class: "d-none"
                                        });

                                        app.user.set({ password: "" });
                                        $("#askPasInput").val("");

                                        if (app.user.get("remeberPassword")) {
                                            app.user.set({
                                                secondPassword: app.user.get("newSecondPassword")
                                            });
                                        } else {
                                            app.user.set({
                                                secondPassword: ""
                                            });
                                        }
                                    } else if (result["data"] == "newerFound") {
                                        //app.notifications.systemMessage('newerFnd');
                                    }
                                }

                                app.user.unset("newPassword");
                                app.user.unset("newSecondPassword");
                            });
                        } else {
                            app.notifications.systemMessage("wrngPass");
                        }
                    });

                    break;

                case "save1Pass":
                    var thisComp = this;

                    var pass = event;
                    this.checkIfFirstPassGood(pass, function (result) {
                        if (result) {
                            $("#askforPass").modal("hide");

                            //set new pass
                            if (app.user.get("oneStep")) {
                                //check with user pass field event

                                app.user.set({
                                    password: app.transform.SHA512(app.globalF.makeDerivedFancy(pass, app.defaults.get("hashToken")))
                                });
                                app.user.set({
                                    newPassword: app.transform.SHA512(app.globalF.makeDerivedFancy(thisComp.state.password1input.text, app.defaults.get("hashToken")))
                                });
                                app.user.set({
                                    newSecondPassword: app.globalF.makeDerived(thisComp.state.password1input.text, app.user.get("salt"))
                                });
                            } else {
                                app.user.set({
                                    password: app.transform.SHA512(pass)
                                });
                                //app.user.set({"newPassword": app.transform.SHA512(thisComp.state.password1input.text)});
                                app.user.set({
                                    newPassword: app.transform.SHA512(thisComp.state.password1input.text)
                                });
                            }

                            //app.user.set({"firstPassChanged": true});

                            app.userObjects.updateObjects("changePass", "", function (result) {
                                //restore copy of the object if failed to save
                                if (result["response"] == "success") {
                                    thisComp.handleClick("resetFirstPanel");

                                    app.user.set({ password: "" });

                                    if (app.user.get("oneStep") && app.user.get("remeberPassword")) {
                                        app.user.set({
                                            secondPassword: app.user.get("newSecondPassword")
                                        });
                                    } else {
                                        app.user.set({
                                            secondPassword: ""
                                        });
                                    }

                                    $("#askPasInput").val("");
                                }

                                app.user.unset("newPassword");
                                app.user.unset("newSecondPassword");
                            });

                            //app.userObjects.updateObjects();
                        } else {
                            app.notifications.systemMessage("wrngPass");
                        }
                    });

                    //$('#askforPass').modal('hide');

                    break;

                case "change2Pass":
                    var pasword2Form = this.state.secForm;
                    pasword2Form.form();

                    var thisComp = this;
                    if (pasword2Form.numberOfInvalids() == 0) {
                        if (app.user.get("oneStep")) {
                            $("#askPassHeader").html("Provide Original Password");
                        } else {
                            $("#askPassHeader").html("Provide Original Second Password");
                        }

                        $("#askforPass").modal("show");
                        $("#askPasSub").on("click", function () {
                            thisComp.handleClick("save2Pass", $("#askPasInput").val());
                        });
                    }

                    break;
                case "save2Pass":
                    var thisComp = this;
                    console.log(event);

                    var pass = app.globalF.makeDerived(event, app.user.get("salt"));

                    if (app.globalF.tryDecrypt(pass)) {
                        // enableSecond

                        var action = "";
                        if (app.user.get("oneStep")) {
                            app.user.set({ oneStep: false });
                            app.user.set({
                                password: app.transform.SHA512(app.globalF.makeDerivedFancy(event, app.defaults.get("hashToken")))
                            });

                            app.user.set({
                                newPassword: app.transform.SHA512(event)
                            });
                            app.user.set({
                                newSecondPassword: app.globalF.makeDerived(thisComp.state.password2input.text, app.user.get("salt"))
                            });

                            action = "enableSecond";
                        } else {
                            app.user.set({
                                newSecondPassword: app.globalF.makeDerived(thisComp.state.password2input.text, app.user.get("salt"))
                            });
                        }

                        $("#askforPass").modal("hide");

                        //console.log('saving pass2');
                        app.userObjects.updateObjects("changeSecondPass", action, function (result) {
                            //restore copy of the object if failed to save
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.setState({
                                        secAlertText: "d-none",
                                        button3Class: "d-none",
                                        button2Class: ""
                                    });
                                } else if (result["data"] == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                }

                                thisComp.handleClick("resetSecondPanel");

                                app.user.set({ password: "" });

                                if (app.user.get("remeberPassword")) {
                                    app.user.set({
                                        secondPassword: app.user.get("newSecondPassword")
                                    });
                                } else {
                                    app.user.set({ secondPassword: "" });
                                }
                            }

                            app.user.unset("newPassword");
                            app.user.unset("newSecondPassword");
                        });
                    } else {
                        if (app.user.get("oneStep")) {
                            app.notifications.systemMessage("wrngPass");
                        } else {
                            app.notifications.systemMessage("wrngSecPass");
                        }
                    }
                    break;

                case "resetFirstPanel":
                    this.setState({
                        password1input: { text: "" },
                        password1inputRepeat: ""
                    });
                    var validator = $("#passForm").validate();
                    validator.resetForm();

                    $("#newPass").removeClass("invalid");
                    $("#newPass").removeClass("valid");

                    $("#newPassRep").removeClass("invalid");
                    $("#newPassRep").removeClass("valid");

                    break;

                case "resetSecondPanel":
                    this.setState({
                        password2input: { text: "" },
                        password2inputRepeat: { text: "" }
                    });
                    var validator = $("#secForm").validate();
                    validator.resetForm();

                    $("#newSecret").removeClass("invalid");
                    $("#newSecret").removeClass("valid");

                    $("#newSecretRep").removeClass("invalid");
                    $("#newSecretRep").removeClass("valid");

                    if (app.user.get("oneStep")) {
                        this.setState({
                            panel: {
                                firstPanelClass: "panel-body",
                                secondPanelClass: "panel-body d-none",
                                firstTab: "active",
                                secondTab: "d-none"
                            },
                            secAlertText: app.user.get("oneStep") ? "" : "d-none"
                        });
                    }

                    break;

                case "disableSecondPass":
                    var thisComp = this;

                    $("#askPassHeader").html("Provide Original Second Password");
                    $("#askPasInput").val(app.defaults.get("secondPassfield"));
                    $("#askforPass").modal("show");

                    $("#askPasSub").on("click", function () {
                        console.log("check First");
                        thisComp.handleClick("veryfyFirstPass", $("#askPasInput").val());
                    });

                    break;
                case "veryfyFirstPass":
                    var thisComp = this;

                    var pass = app.globalF.makeDerived(event, app.user.get("salt"));

                    if (app.globalF.tryDecrypt(pass)) {
                        $("#askforPass").modal("hide");

                        setTimeout(function () {
                            $("#askPassHeader").html("Provide First Password");
                            $("#askPasInput").val(app.defaults.get("firstPassfield"));
                            $("#askforPass").modal("show");
                            $("#askPasSub").on("click", function () {
                                console.log("check Second");
                                //app.user.set({"oneStep": true});
                                thisComp.handleClick("delete2Pass", $("#askPasInput").val());
                            });
                        }, 1000);
                    } else {
                        app.notifications.systemMessage("wrngSecPass");
                    }
                    break;

                //case 'tryAgain':
                //$.ajaxQueue.stop();
                //$.ajaxQueue.run();
                //	$.ajaxQueue.startNextRequest('tryAgain');
                //	break;

                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag
                    });
                    break;
            }
        },
        /**
         *
         * @returns {JSX}
         */

        render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle password" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        this.state.viewFlag ? React.createElement(
                            "div",
                            { className: "arrow-back" },
                            React.createElement("a", {
                                onClick: this.handleClick.bind(this, "toggleDisplay")
                            })
                        ) : null,
                        React.createElement(
                            "h2",
                            null,
                            "Security"
                        ),
                        React.createElement(
                            "div",
                            { className: "bread-crumb" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    null,
                                    React.createElement(
                                        "a",
                                        null,
                                        "Password"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    this.state.viewFlag ? React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "toggleDisplay")
                                        },
                                        "Change password"
                                    ) : React.createElement(
                                        "span",
                                        null,
                                        "Change password"
                                    )
                                ),
                                this.state.viewFlag ? React.createElement(
                                    "li",
                                    null,
                                    "Second password"
                                ) : null
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            {
                                className: `the-view ${this.state.viewFlag ? "d-none" : ""}`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Change password"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "secound-password-btn" },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "toggleDisplay")
                                        },
                                        "Enable second password"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "passForm" },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "password",
                                                    name: "fpass",
                                                    className: "form-control with-icon icon-lock",
                                                    id: "newPass",
                                                    placeholder: "New password",
                                                    onChange: this.handleChange.bind(this, "changepass1"),
                                                    value: this.state.password1input.text
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "password",
                                                    name: "fpassrep",
                                                    className: "form-control with-icon icon-lock",
                                                    id: "newPassRep",
                                                    placeholder: "Repeat password",
                                                    onChange: this.handleChange.bind(this, "changepass1repeat"),
                                                    value: this.state.password1inputRepeat
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement(
                                                    "div",
                                                    { className: "checkbox-left" },
                                                    React.createElement(
                                                        "label",
                                                        { className: "container-checkbox with-label" },
                                                        React.createElement("input", {
                                                            type: "checkbox",
                                                            checked: this.state.remeberPassword,
                                                            onChange: this.handleChange.bind(this, "remPass")
                                                        }),
                                                        React.createElement("span", { className: "checkmark" }),
                                                        "Remember Password for Session"
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "info-text" },
                                                "Note: If you changed your password, please download new reset token"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-section-bottom" },
                                        React.createElement(
                                            "div",
                                            { className: "token-download" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    onClick: this.handleClick.bind(this, "downloadToken")
                                                },
                                                "Download Reset Token"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "btn-row" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-border fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "resetFirstPanel")
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "change1Pass")
                                                },
                                                "Save"
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            {
                                className: `the-second-password ${this.state.viewFlag ? "" : "d-none"}`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top with-stacked" },
                                React.createElement(
                                    "div",
                                    {
                                        role: "alert",
                                        className: "alert alert-warning"
                                    },
                                    "Please enter second password, that will be used to encrypt your data."
                                ),
                                React.createElement(
                                    "h3",
                                    null,
                                    "Enable secound password"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "secForm" },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "password",
                                                    name: "spass",
                                                    className: "form-control with-icon icon-lock",
                                                    id: "newSecret",
                                                    placeholder: "New secret phrase",
                                                    onChange: this.handleChange.bind(this, "changepass2"),
                                                    value: this.state.password2input.text
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "password",
                                                    name: "spassrep",
                                                    className: "form-control with-icon icon-lock",
                                                    id: "newSecretRep",
                                                    placeholder: "Repeat secret phrase",
                                                    onChange: this.handleChange.bind(this, "changepass2repeat"),
                                                    value: this.state.password2inputRepeat.text
                                                })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "info-text" },
                                                "Note: If you changed or enabled/disabled your second password, please download new reset token"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-section-bottom" },
                                        React.createElement(
                                            "div",
                                            { className: "disable-second-pass" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "col-xs-12 col-sm-6 " + this.state.button2Class,
                                                    onClick: this.handleClick.bind(this, "disableSecondPass")
                                                },
                                                "Disable Second Password"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "btn-row" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-border fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "toggleDisplay")
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, this.state.saveButton2Panel.onClick)
                                                },
                                                "Save"
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right password" },
                    React.createElement(RightTop, null),
                    React.createElement(
                        "div",
                        { className: "setting-right-data" },
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "h2",
                                null,
                                "Help"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
                            React.createElement(
                                "h3",
                                null,
                                "Remember Password"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Check this box to keep your password in memory for the duration of the session. It will prevent the system from asking you every time you want to add or delete your email aliases or change to private keys. Enabling this feature can lower your security, if someone can gain access to your computer."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Password"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "(6-80 characters) Strengthen the security of your account by regularly changing the strong password used to access your account. A strong password contains at least 16 characters including numbers and special characters. To help protect your account we recommend enabling two factor authentication using either Google Auth or YubiKey."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Second Password"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Mailum offers the option to have two passwords protecting your account instead of a single password. We understand there are reasons why two passwords might not be considered as a better solution than a single password. Two factor authentication with Google Authenticator or a YubiKey can be enabled instead of or in addition to a second password."
                            )
                        )
                    )
                )
            );
        },
        handleChange: function (action, event) {
            switch (action) {
                case "changepass1":
                    this.setState({
                        password1input: {
                            text: event.target.value
                        }
                    });

                    break;
                case "changepass1repeat":
                    this.setState({
                        password1inputRepeat: event.target.value
                    });
                    break;

                case "changepass2":
                    this.setState({
                        password2input: {
                            text: event.target.value
                        }
                    });
                    break;
                case "changepass2repeat":
                    this.setState({
                        password2inputRepeat: {
                            text: event.target.value
                        }
                    });
                    break;
                case "remPass":
                    this.setState({
                        remeberPassword: !this.state.remeberPassword
                    });
                    break;
            }
        }
    });
});