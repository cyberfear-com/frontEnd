define(["react", "app"], function (React, app) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                token: "",
                secret: "",
                newPass: "",
                newPassRep: "",
                salt: "",
                accountCreationStatus:false,

                emailError: "",
                tokenError: "",
                secretError: "",
                newPassError: "",
                repPassError: "",

                emailSucc: false,
                tokenSucc: false,
                secretSucc: false,
                newPassSucc: false,
                repPassSucc: false,
                generateI: "false",

                oneStep: false,
            };
        },
        componentDidMount: function () {
            $("#forgPass-modal").modal("show");
        },

        handleChange: function (action, event) {
            switch (action) {
                case "email":
                    this.setState(
                        {
                            email: event.target.value,
                        },
                        function(){
                            this.checkFields('email',this)
                        }
                    );
                    break;

                case "token":
                    this.setState({
                        token: event.target.value,
                    });
                    break;

                case "secret":
                    this.setState({
                        secret: event.target.value,
                    });
                    break;
                case "newPass":
                    this.setState(
                        {
                            newPass: event.target.value,
                        },
                        function(){
                            this.checkFields('newPass',this),
                                this.checkFields('newPassRep',this)
                        }
                    );
                    break;
                case "newPassRep":
                    this.setState({
                        newPassRep: event.target.value,
                    },
                        function(){
                            this.checkFields('newPassRep',this)
                        }
                        );


                    break;
                case "getFile":
                    var thisComp = this;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        thisComp.setState(
                            {
                                token: reader.result,
                            },
                            function () {
                                thisComp.verifyAccountStep();
                            }
                        );
                    };
                    reader.readAsText(event.target.files[0]);

                    break;
            }
        },
        handleDownloadToken: function () {
            var toFile = app.user.get("downloadToken");

            var element = document.createElement("a");
            element.setAttribute(
                "href",
                "data:attachment/plain;charset=utf-8," + toFile
            );
            element.setAttribute("download", this.state.email+".key");

            element.style.display = "none";

            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);
        },

        checkButton:(that)=>{
            if (
                that.state.emailError == "" &&
                that.state.tokenError == "" &&
                that.state.newPassError == "" &&
                that.state.repPassError == "" &&
                that.state.newPass == that.state.newPassRep &&
                that.state.email.length>0 &&
                that.state.newPass.length>0
            ) {
                that.setState({
                    generateI:""
                });
            }else{
                that.setState({
                    generateI:"true"
                });
            }
        },
        checkFields:(action,that)=>{

            switch (action) {
                case "email":
                    if (that.state.email.length < 6) {
                        that.setState({
                            emailError: "minimum 6 character",
                        },function(){
                            that.checkButton(that)
                        });
                    } else if (that.state.email.length > 250) {
                        that.setState({
                            emailError: "maximum 250 character",
                        },function(){
                            that.checkButton(that)
                        });
                    } else {
                        that.setState({
                            emailError: "",
                        },function(){
                            that.checkButton(that)
                        });
                    }
                    that.verifyAccountStep();

                    break;
                case "newPass":
                    if (that.state.newPass.length < 6) {
                        that.setState({
                            newPassError:
                                "Please use password longer than 6 characters",
                            newPassSucc: false
                        });
                    } else if (that.state.newPass.length > 80) {
                        that.setState({
                            newPassError:
                                "Please use password less than 80 characters",
                            newPassSucc: false
                        });
                    } else {
                        that.setState({
                            newPassError: "",
                            newPassSucc: true
                        },function(){
                            that.checkButton(that)
                        });
                    }
                    break;
                case "newPassRep":
                    if (that.state.newPassRep.length>0 && that.state.newPass !== that.state.newPassRep) {
                        that.setState({
                            repPassError:
                                "Please enter the same password as above",
                            repPassSucc: false,
                        },function(){
                            that.checkButton(that)
                        });
                    } else {
                        that.setState({
                            repPassError: "",
                            repPassSucc: true
                        },function(){
                            that.checkButton(that)
                        });
                    }
                    break;

            }

        },
        verifyAccountStep: function () {
            var post = {
                email: app.transform.SHA512(this.state.email),
                tokenHash: app.transform.SHA512(this.state.token),
            };

            var thisComp = this;
            if (this.state.email == "") {
                this.setState({
                    emailError: "please provide email",
                });
            }
            if (this.state.email != "" && this.state.token != "") {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get("apidomain") + "/checkStepsV2",
                    data: post,
                    dataType: "json",
                }).done(function (msg) {
                    if (msg["response"] == "notFound") {
                        thisComp.setState({
                            tokenError: "Token is not assigned to this email. ",
                            oneStep:false
                        },function(){
                            thisComp.checkButton(thisComp)
                        });
                    } else if (msg["response"] == "success") {
                        thisComp.setState({
                            tokenError: "",
                            emailError: "",
                            emailSucc: true,
                            tokenSucc: true,
                            oneStep:
                                parseInt(msg["oneStep"]) === 0 ? false : true,
                            salt: app.transform.hex2bin(msg["saltS"]),
                        },function(){
                                thisComp.checkButton(thisComp)
                        });
                    } else {
                        app.notifications.systemMessage("tryAgain");
                            thisComp.checkButton(thisComp)
                    }
                });
            }
        },
        handleClick: function (action, event) {
            //app.user.set({id:10});

            switch (action) {
                case "resetPass":
                    var thisComp = this;

                    this.checkFields('email',this);
                    this.checkFields('newPass',this);
                    this.checkFields('newPassRep',this);
                            if (
                                thisComp.state.emailError == "" &&
                                thisComp.state.tokenError == "" &&
                                thisComp.state.secretError == "" &&
                                thisComp.state.newPassError == "" &&
                                thisComp.state.repPassError == "" &&
                                thisComp.state.newPassError ==
                                    thisComp.state.repPassError
                            ) {
                                thisComp.setState({
                                    generateI: "fa fa-refresh fa-spin fa-lg",
                                });

                                if (thisComp.state.oneStep === false) {
                                    var salt = thisComp.state.salt;

                                    var secretnew = app.globalF.makeDerived(
                                        thisComp.state.secret,
                                        salt
                                    );

                                    var tokenAesHash = app.transform.SHA512(
                                        thisComp.state.token
                                    );

                                    //var derivedKey = app.globalF.makeDerived(secretnew, salt);
                                    var derivedKey = secretnew;
                                    var Test =
                                        app.transform.bin2hex(derivedKey);

                                    var Part2 = Test.substr(64, 128);
                                    var keyA = app.transform.hex2bin(Part2);

                                    var tokenAes = app.transform.fromAesBin(
                                        keyA,
                                        thisComp.state.token
                                    );
                                    var tokenHash =
                                        app.transform.SHA512(tokenAes);

                                    var post = {
                                        email: app.transform.SHA512(
                                            thisComp.state.email
                                        ),
                                        tokenHash: tokenHash,
                                        tokenAesHash: tokenAesHash,
                                    };

                                    $.ajax({
                                        method: "POST",
                                        url: "api/checkTokenHashesV2",
                                        data: post,
                                        dataType: "json",
                                    }).done(function (msg) {
                                        if (msg["response"] == "success") {
                                            var newPass = app.transform.SHA512(
                                                thisComp.state.newPass
                                            );
                                            thisComp.changePass(
                                                app.transform.SHA512(
                                                    thisComp.state.email
                                                ),
                                                tokenHash,
                                                tokenAesHash,
                                                newPass
                                            );
                                        } else if (
                                            msg["response"] == "incorrect"
                                        ) {
                                            thisComp.setState({
                                                secretError:
                                                    "Incorrect second password",
                                                generateI: "",
                                            });
                                        } else {
                                            app.notifications.systemMessage(
                                                "tryAgain"
                                            );
                                            thisComp.setState({
                                                generateI: "",
                                            });
                                        }
                                    });
                                } else {
                                    var tokenAesHash = app.transform.SHA512(
                                        thisComp.state.token
                                    );

                                    var newPass = app.transform.SHA512(
                                        app.globalF.makeDerivedFancy(
                                            thisComp.state.newPass,
                                            app.defaults.get("hashToken")
                                        )
                                    );
                                    var secondPass = app.globalF.makeDerived(
                                        this.state.newPass,
                                        thisComp.state.salt
                                    );

                                    thisComp.resetPassAndSecret(
                                        thisComp.state.email,
                                        tokenHash,
                                        tokenAesHash,
                                        newPass,
                                        secondPass
                                    );
                                }
                            }
                    break;

                case "browseToken":
                    $("#tokenFile").click();
                    break;
            }
        },
        handleModalClose: function () {
            this.setState({
                accountCreationStatus: null,
            });
            Backbone.history.navigate("/login", {
                trigger: true,
            });
        },
        changePass: function (email, tokenHash, tokenAesHash, newPass) {
            var post = {
                email: email,
                tokenHash: tokenHash,
                tokenAesHash: tokenAesHash,
                newPass: newPass,
            };
            $.ajax({
                method: "POST",
                url: app.defaults.get("apidomain") + "/changeLoginPassV2",
                data: post,
                dataType: "json",
            }).done(function (msg) {
                if (msg["response"] == "success") {
                    app.notifications.systemMessage("saved");

                    setTimeout(function () {
                        app.restartApp();
                    }, 2000);
                } else if (msg["response"] == "incorrect") {
                    app.notifications.systemMessage("wrngSecPass");
                    thisComp.setState({
                        generateI: "",
                    });
                } else {
                    app.notifications.systemMessage("tryAgain");
                    thisComp.setState({
                        generateI: "",
                    });
                }
            });
        },

        resetPassAndSecret: function (
            oldEmail,
            tokenHash,
            tokenAesHash,
            newPass,
            secondPass
        ) {
            //todo delete all previous data with this user
            //generate new user
            // app.globalF.resetSecondPass();

           // var userAddress = email.toLowerCase().split("@")[0];
            var email =oldEmail.toLowerCase();
            //    userAddress + app.defaults.get("domainMail").toLowerCase();

            var pass = newPass;
            var folderKey = app.globalF.makeRandomBytes(32);
            var salt = this.state.salt;
            var secret = secondPass;
            var thisComp = this;

            app.generate
                .generateUserObjects(email, pass, secret, folderKey, salt)
                .then(function (userObj) {
                    userObj["newPass"] = pass;
                    userObj["oldTokenAesHash"] = tokenAesHash;

                    $.ajax({
                        method: "POST",
                        url: app.defaults.get("apidomain") + "/resetUserV3",
                        data: userObj,
                        dataType: "json",
                    }).then(function (msg) {
                        if (msg["response"] === "fail") {
                            if (msg["data"] === "limitIsReached") {
                                app.notifications.systemMessage("once5min");
                            } else {
                                app.notifications.systemMessage("tryAgain");
                            }
                        } else if (msg["response"] === "success") {
                           thisComp.setState({
                               accountCreationStatus:true
                           });
                        }

                        thisComp.setState({
                            generateI: "",
                        });

                        // console.log(msg)
                    });
                });
        },

        render: function () {
            return (
                // forgPass-modal
                <div className="" id="forgPass">
                    <div className="">
                        <div className="">
                            <div className="row">
                                <fieldset>
                                    <h1>Reset Password</h1>

                                    <div className="form-section">
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                name="resetEmail"
                                                id="resetPass_email"
                                                className={"form-control "+(this.state.emailError == ""
                                                    ? (this.state.email.length>6 && this.state.token.length>0 && this.state.tokenError == "")?"is-valid":this.state.token.length>0 && this.state.tokenError!= ""?"is-invalid":"":"is-invalid") }
                                                placeholder="1. email address"
                                                onChange={this.handleChange.bind(
                                                    this,
                                                    "email"
                                                )}
                                                value={this.state.email}
                                            />
                                            <label
                                                className={
                                                    "control-label pull-left " +
                                                    (this.state
                                                        .emailError == ""
                                                        ? "hidden"
                                                        : "invalid-feedback")
                                                }
                                                htmlFor="resetEmail"
                                            >
                                                {this.state.emailError}
                                            </label>
                                        </div>

                                        <div className="clearfix"></div>

                                        <div
                                            className="input-group form-group">
                                            <input
                                                className="d-none"
                                                id="tokenFile"
                                                type="file"
                                                readOnly
                                                onChange={this.handleChange.bind(
                                                    this,
                                                    "getFile"
                                                )}
                                            />
                                            <input
                                                name="tokenFile"
                                                className={"form-control "+(this.state.tokenError == ""
                                                    ? (this.state.token.length>0 && this.state.emailError == "")?"is-valid":"":"is-invalid") }
                                                id="appendbutton"
                                                type="text"
                                                placeholder="2. secret token"
                                                readOnly
                                                value={this.state.token}
                                                style={{
                                                    textOverflow: "ellipsis",
                                                    padding: "10px 20px 10px 15px"
                                                }}
                                            />
                                            <div className="input-group-btn">
                                                <span
                                                    className="input-group-addon"
                                                    style={{
                                                        padding: "0",
                                                        border: "0",
                                                        lineHeight: "1.1",
                                                    }}
                                                >
                                                    <button
                                                        className="btn-blue"
                                                        style={{
                                                            margin: "0",
                                                            padding:
                                                                "10px 52px",
                                                            height: "100%",
                                                            borderTopLeftRadius:
                                                                "0px",
                                                            borderBottomLeftRadius:
                                                                "0px",
                                                        }}
                                                        type="button"
                                                        onClick={this.handleClick.bind(
                                                            null,
                                                            "browseToken"
                                                        )}
                                                    >
                                                        Browse for Token
                                                    </button>
                                                </span>
                                            </div>
                                            <label
                                                className={
                                                    "control-label pull-left " +
                                                    (this.state
                                                        .tokenError == ""
                                                        ? "d-none"
                                                        : "invalid-feedback")
                                                }
                                                htmlFor="tokenFile"
                                            >
                                                {this.state.tokenError}
                                            </label>
                                            <div className="clearfix"></div>
                                            <div
                                                className={
                                                    "form-group text-left " +
                                                    (this.state.tokenError == ""?
                                                        this.state.oneStep
                                                            ? ""
                                                            : "d-none":"d-none")
                                                }
                                            >
                                                Because you are using single
                                                password for login and encrypting
                                                your emails. Resetting your password
                                                will permanently delete all your
                                                existing emails and contacts.
                                                <br /> Proceed with caution.
                                            </div>
                                        </div>



                                        <div
                                            className={
                                                "form-group " +
                                                (this.state.secretError != ""
                                                    ? "has-error"
                                                    : "") +
                                                (this.state.oneStep
                                                    ? " d-none"
                                                    : "")
                                            }
                                        >
                                            <input
                                                type="password"
                                                name="secretPhrase"
                                                className="form-control input-lg"
                                                placeholder="3. second password"
                                                onChange={this.handleChange.bind(
                                                    this,
                                                    "secret"
                                                )}
                                                value={this.state.secret}
                                            />
                                            <label
                                                className={
                                                    "control-label pull-left " +
                                                    (this.state.secretError ==
                                                    ""
                                                        ? "d-none"
                                                        : "")
                                                }
                                                htmlFor="secretPhrase"
                                            >
                                                {this.state.secretError}
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <hr />
                                <fieldset>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            name="newPass"
                                            className={"form-control input-lg "+(this.state.newPassError == ""
                                                ? this.state.newPass.length>5?"is-valid":"":"is-invalid") }
                                            placeholder="4. new password"
                                            onChange={this.handleChange.bind(
                                                this,
                                                "newPass"
                                            )}
                                            value={this.state.newPass}
                                        />
                                        <label
                                            className={
                                                "control-label pull-left " +
                                                (this.state
                                                    .newPassError == ""
                                                    ? "hidden"
                                                    : "invalid-feedback")
                                            }
                                            htmlFor="newPass"
                                        >
                                            {this.state.newPassError}
                                        </label>
                                    </div>

                                    <div
                                        className={
                                            "form-group " +
                                            (this.state.repPassError != ""
                                                ? "has-error"
                                                : "")
                                        }
                                    >
                                        <input
                                            type="password"
                                            name="newPassRep"
                                            className={"form-control input-lg "+(this.state.repPassError == ""
                                                ? this.state.newPassRep.length>5?"is-valid":"":"is-invalid") }
                                            placeholder="5. repeat new password"
                                            onChange={this.handleChange.bind(
                                                this,
                                                "newPassRep"
                                            )}
                                            value={this.state.newPassRep}
                                        />
                                        <label
                                            className={
                                                "control-label pull-left " +
                                                (this.state
                                                    .repPassError == ""
                                                    ? "hidden"
                                                    : "invalid-feedback")
                                            }
                                            htmlFor="newPassRep"
                                        >
                                            {this.state.repPassError}
                                        </label>
                                    </div>
                                </fieldset>

                                <button
                                    className="btn-blue full-width mt44"
                                    disabled={
                                        this.state.generateI != ""
                                            ? true
                                            : false
                                    }
                                    onClick={this.handleClick.bind(
                                        this,
                                        "resetPass"
                                    )}
                                >
                                    RESET PASSWORD
                                </button>
                                {{/*
                                    <div className="login-bottom">
                                        <div className="welcome-text">
                                            {`Already have the login details?`}
                                        </div>
                                        <div className="btn-row">
                                            <a
                                                href="#login"
                                                className="btn-gray-border"
                                            >{`Sign in`}</a>
                                        </div>
                                    </div>
                               */} }
                            </div>
                        </div>
                    </div>
                    <div
                        className={`modal modal-sheet position-fixed ${
                            this.state.accountCreationStatus
                                ? "d-block"
                                : "d-none"
                        } bg-secondary bg-opacity-75 py-5`}
                        tabIndex="-1"
                        role="dialog"
                        id="modalSheet"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content rounded-4 shadow px-4 py-4">
                                <div className="modal-header border-bottom-0">
                                    <h5 className="modal-title">
                                        Your password has been successfully changed!
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={this.handleModalClose}
                                    ></button>
                                </div>
                                <div className="modal-body py-0">
                                    <p className="mb-2">
                                        Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="https://blog.mailum.com/reset-password" target="_blank">blog</a>
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-dark mx-0 mb-2 fs-6"
                                        onClick={this.handleDownloadToken}
                                    >
                                        Download Token
                                    </button>
                                </div>
                                <div className="modal-footer flex-column border-top-0">
                                    <p>Once dwonloaded, please log in.</p>
                                    <a
                                        href="/mailbox/#login"
                                        className="btn btn-lg btn-primary w-100 mx-0 fs-6"
                                    >
                                        Login
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
