define(["app", "react"], function (app, React) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                newPass: "",
                newPassRep: "",
                coupon: "",
                domainList: ["@mailum.com","@cyberfear.com"],
                domain:"@mailum.com",

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
                accountCreationError: "",
            };
        },

        componentDidMount: async function () {
            $("#createAccount-modal").on("shown.bs.modal", function () {});
         if(this.props.coupon.length>0){
             this.setState({
                 coupon:this.props.coupon
             },function(){
                 this.checkCouponTyping();
             })
         }
            let response = await fetch(app.defaults.get("apidomain") + `/availableForRegistrationV3`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let data = await response.json()

            var domList=[];
            data.data.map((x) =>{
                domList.push("@"+x.domain);
                if(x.def2reg=="1"){
                    this.setState({domain:"@"+x.domain});
                }
            })
            this.setState({domainList:domList})
        },
        handleChange: function (action, event) {
            switch (action) {
                case "coupon":
                    var thisComp = this;
                    this.setState(
                        {
                            coupon: event.target.value,
                        },
                        function () {
                                thisComp.checkCouponTyping();

                        }
                    );
                    break;
                case "changeDomain":
                    this.setState({
                        domain:event.target.value
                    },function () {
                        this.checkEmailTyping();
                    })
                    break;
                case "email":
                    var email = event.target.value;
                    if (email.indexOf("@") !== -1) {
                        this.setState({
                            emailError:
                                "please enter only first part of email, without @",
                        });
                    } else if (email.length < 3) {
                        this.setState({
                            emailError: "minimum 3 character",
                        });
                    } else if (email.length > 250) {
                        this.setState({
                            emailError: "maximum 250 character",
                        });
                    } else {
                        this.setState({
                            emailError: "",
                        });
                    }

                    this.setState(
                        {
                            email: event.target.value,
                        },
                        function () {
                            this.checkEmailTyping();
                        }
                    );

                    break;
                case "newPass":
                    var newPass = event.target.value;

                    if (newPass.length < 6) {
                        this.setState({
                            newPassError:
                                "Please use password longer than 6 characters",
                            newPassSucc: false,
                            repPassError: "",
                            repPassSucc: false,
                        });
                    } else if (newPass.length > 80) {
                        this.setState({
                            newPassError:
                                "Please use password less than 80 characters",
                            newPassSucc: false,
                            repPassError: "",
                            repPassSucc: false,
                        });
                    } else {
                        this.setState({
                            newPassError: "",
                            newPassSucc: true,
                            repPassError: "",
                            repPassSucc: false,
                        });
                    }

                    this.setState({
                        newPass: newPass,
                    });
                    break;
                case "newPassRep":
                    var newPassRep = event.target.value;

                    if (this.state.newPass !== event.target.value) {
                        this.setState({
                            repPassError:
                                "Please enter the same password as above",
                            repPassSucc: false,
                        });
                    } else {
                        this.setState({
                            repPassError: "",
                            repPassSucc: true,
                        });
                    }

                    this.setState({
                        newPassRep: event.target.value,
                    });

                    break;
            }
        },

        checkFields: function () {
            var thisComp = this;

            thisComp.setState({
                working: true,
                buttonTag: "fa fa-refresh fa-spin",
                buttonText: "WORKING..",
            });

            var def = $.Deferred();

            var em = { target: { value: this.state.email } };
            this.handleChange("email", em);

            var newPass = { target: { value: this.state.newPass } };
            this.handleChange("newPass", newPass);

            var newPassRep = { target: { value: this.state.newPassRep } };
            this.handleChange("newPassRep", newPassRep);

            setTimeout(function () {
                if (
                    thisComp.state.emailError == "" &&
                    thisComp.state.newPassError == "" &&
                    thisComp.state.repPassError == "" &&
                    thisComp.state.couponError == ""
                ) {
                    def.resolve(true);
                } else {
                    def.reject();
                    thisComp.setState({
                        working: false,
                        buttonTag: "",
                        buttonText: "SIGN UP",
                    });
                }
            }, 400);

            return def;
        },

        generateUser: function () {
            var thisComp = this;
            this.checkFields().then(function (msg) {
                var userAddress = thisComp.state.email
                    .toLowerCase()
                    .split("@")[0];
                var email =
                    userAddress + thisComp.state.domain.toLowerCase();

                var pass = app.transform.SHA512(
                    app.globalF.makeDerivedFancy(
                        thisComp.state.newPass,
                        app.defaults.get("hashToken")
                    )
                );
                var folderKey = app.globalF.makeRandomBytes(32);
                var salt = app.globalF.makeRandomBytes(256);
                var secret = app.globalF.makeDerived(
                    thisComp.state.newPass,
                    salt
                );

                //console.log();
                app.generate
                    .generateUserObjects(email, pass, secret, folderKey, salt)
                    .then(function (userObj) {
                        userObj["newPass"] = pass;
                        userObj["salt"] = app.transform.bin2hex(salt);
                        userObj["coupon"] = thisComp.state.coupon;

                        console.log(userObj);
                        $.ajax({
                            method: "POST",
                            url:
                                app.defaults.get("apidomain") +
                                "/createNewUserV3",
                            data: userObj,
                            dataType: "json",
                            xhrFields: {
                                withCredentials: true,
                            },
                        }).then(function (msg) {
                            if (msg["response"] === "fail") {
                                if (msg["data"] === "limitIsReached") {
                                    thisComp.setState({
                                        accountCreationError: "Please wait 5 minutes before creating another account",
                                    });
                                } else {
                                    // app.notifications.systemMessage('tryAgain');
                                    thisComp.setState({
                                        accountCreationError: "Please try again.",
                                    });
                                }
                            } else if (msg["response"] === "success") {
                                thisComp.setState({
                                    accountCreationStatus: true,
                                });
                            }

                            thisComp.setState({
                                working: false,
                                buttonTag: "",
                                buttonText: "SIGN UP",
                            });

                            // console.log(msg)
                        }).fail(function(jqXhr) {
                            thisComp.setState({
                                accountCreationError: "Server in unavailable. Please check your connection and try again.",
                                working: false,
                                buttonTag: "",
                                buttonText: "SIGN UP",
                            });
                        });
                    });
            });

            //app.genea
        },
        checkCouponTyping: function () {
            var thisComp = this;
            if(this.state.coupon.length==16 || this.state.coupon.length==32) {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get("apidomain") + "/checkCouponExistV3",
                    data: {
                        coupon: this.state.coupon,
                    },
                    dataType: "text",
                    xhrFields: {
                        withCredentials: true,
                    },
                }).done(function (msg) {
                    if (msg === "false" && thisComp.state.coupon.length > 0) {
                        thisComp.setState({
                            couponError: "coupon not valid",
                            couponSucc: false,
                        });
                    } else if (
                        msg === "true" ||
                        thisComp.state.coupon.length == 0
                    ) {
                        thisComp.setState({
                            couponError: "",
                            couponSucc: true,
                        });
                    }
                });
            }else if(this.state.coupon.length==0){
                thisComp.setState({
                    couponError: "",
                    couponSucc: true,
                });
            } else{
                thisComp.setState({
                    couponError: "coupon not valid",
                    couponSucc: false,
                });
            }
        },

        checkEmailTyping: function () {
            var thisComp = this;
            if (thisComp.state.email.length >= 3) {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get("apidomain") + "/checkEmailExist4RegistrationV3",
                    data: {
                        email:thisComp.state.email.toLowerCase(),
                        domain:thisComp.state.domain.toLowerCase()
                    },
                    dataType: "text",
                }).done(function (msg) {
                    if (msg === "false") {
                        thisComp.setState({
                            emailError: "email exists",
                        });
                    }else if( msg !== "true"){
                        thisComp.setState({
                            emailError: "email contain incorrect symbols",
                        });
                    } else if (
                        msg === "true" &&
                        thisComp.state.email.length > 2 &&
                        thisComp.state.email.length < 250
                    ) {
                        thisComp.setState({
                            emailError: "",
                        });
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    app.notifications.systemMessage("tryAgain");
                    // Request failed. Show error message to user.
                    // errorThrown has error message.
                })
            }
        },

        checkEmail: function () {
            var thisComp = this;
            this.checkFields().then(function (msg) {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get("apidomain") + "/checkEmailExist4RegistrationV3",
                    data: {
                        email:thisComp.state.email.toLowerCase(),
                        domain:thisComp.state.domain.toLowerCase()
                    },
                    dataType: "text",
                }).done(function (msg) {
                    console.log(msg);
                    if (msg === "false") {
                        thisComp.setState({
                            emailError: "email exists",
                        });
                    } else if (msg === "true") {
                        thisComp.generateUser();
                    } else if (JSON.parse(msg)["email"] != undefined) {
                        thisComp.setState({
                            emailError: JSON.parse(msg)["email"],
                        });
                    } else {
                        // app.notifications.systemMessage('tryAgain');
                        thisComp.setState({
                            accountCreationError: "tryAgain",
                        });
                    }
                });
            });


        },
        handleClick: function (i, e) {
            this.setState({
                accountCreationError: "",
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
                accountCreationStatus: null,
            });
        },
        handleDownloadToken: function () {
            var toFile = app.user.get("downloadToken");

            var element = document.createElement("a");
            element.setAttribute(
                "href",
                "data:attachment/plain;charset=utf-8," + toFile
            );
            element.setAttribute("download", "secretToken.key");

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);
        },
        render: function () {
            return (
                <div className="" id="createAccount-modal">
                    <div
                        className={`loading-screen welcome ${
                            this.state.working ? "d-flex" : "d-none"
                        }`}
                    >
                        <div className="t-animation is-loading page-login">
                            <div
                                className="
                                            loading-animation
                                            type-progress
                                            style-circle
                                        "
                            >
                                <div className="progress-circle medium">
                                    <div className="circle-bg">
                                        <img
                                            src="/images/loading-circle.svg"
                                            alt="loading-circle"
                                            style={{
                                                width: "91px",
                                                height: "91px",
                                            }}
                                        />
                                    </div>
                                    <div className="circle-content">
                                        <div className="loading-spinner">
                                            <div className="the-spinner">
                                                <div className="_bar1"></div>
                                                <div className="_bar2"></div>
                                                <div className="_bar3"></div>
                                                <div className="_bar4"></div>
                                                <div className="_bar5"></div>
                                                <div className="_bar6"></div>
                                                <div className="_bar7"></div>
                                                <div className="_bar8"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress-content">
                                    <h4>Creating account!</h4>
                                    <p>Please wait a few second...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className="modal-content"
                            onKeyDown={this.handleClick.bind(
                                null,
                                "enterCreateUser"
                            )}
                        >
                            <h1>Create Account</h1>
                            <div className="welcome-text">
                                to start using privacy protecting email service
                            </div>
                            <div className="form-section">
                                <form
                                    className="registration-form smart-form"
                                    id="createUser"
                                >
                                    <div className="row">
                                        <div className="col-sm-7">
                                            <div className="form-group ">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="userEmail"
                                                    autoComplete="username"
                                                    className={"form-control input-lg "+(this.state.emailError == ""
                                                ? (this.state.email.length>2)?"is-valid":"":"is-invalid") }
                                                    placeholder="choose email"
                                                    maxLength="160"
                                                    onChange={this.handleChange.bind(
                                                        null,
                                                        "email"
                                                    )}
                                                    value={this.state.email}
                                                />
                                                {/* <span className="input-group-addon">{app.defaults.get('domainMail').toLowerCase()}</span> */}
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
                                        </div>
                                        <div className="col-sm-5">
                                            <div className="form-group">
                                                <select
                                                    className="form-select"
                                                    aria-label="Default select example"
                                                    onChange={this.handleChange.bind(
                                                        null,
                                                        "changeDomain"
                                                    )}
                                                    defaultValue={this.state.domain}
                                                    value={this.state.domain}
                                                >
                                                    {this.state.domainList.map( (x,y) =>
                                                    <option key={y}>{x}</option> )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <input
                                                    className={"form-control input-lg "+(this.state.newPassError == ""
                                                        ? this.state.newPass.length>5?"is-valid":"":"is-invalid") }
                                                    name="password"
                                                    id="userPassword"
                                                    type="password"
                                                    placeholder="password"
                                                    autoComplete="new-password"
                                                    onChange={this.handleChange.bind(
                                                        null,
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
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <input
                                                    className={"form-control input-lg "+(this.state.repPassError == ""
                                                        ? this.state.newPassRep.length>5?"is-valid":"":"is-invalid") }

                                                    name="passwordrepeat"
                                                    id="userPasswordRepeat"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    placeholder="repeat password"
                                                    onChange={this.handleChange.bind(
                                                        null,
                                                        "newPassRep"
                                                    )}
                                                    value={
                                                        this.state.newPassRep
                                                    }
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
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group d-none">
                                                <input
                                                    className="form-control input-lg"
                                                    name="robotText"
                                                    id="imrobot"
                                                    type="text"
                                                    placeholder="I'm no robot"
                                                    onChange={this.handleChange.bind(
                                                        null,
                                                        "norobot"
                                                    )}
                                                    value={this.state.norobot}
                                                />
                                                <label
                                                    className={
                                                        "control-label pull-left " +
                                                        (this.state
                                                            .repPassError == ""
                                                            ? "hidden"
                                                            : "")
                                                    }
                                                    htmlFor="newPassRep"
                                                >
                                                    {this.state.repPassError}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div
                                                className="form-group ">
                                                <input
                                                    className={"form-control input-lg "+(this.state.couponError==""?this.state.coupon.length==0?"":"is-valid":"is-invalid")}
                                                    name="coupon"
                                                    id="coupon"
                                                    type="text"
                                                    placeholder="if you have please enter coupon code here"
                                                    onChange={this.handleChange.bind(
                                                        null,
                                                        "coupon"
                                                    )}
                                                    value={this.state.coupon}
                                                />
                                                <label
                                                    className={
                                                        "control-label pull-left " +
                                                        (this.state
                                                            .couponError == ""
                                                            ? "valid-feedback"
                                                            : "invalid-feedback")
                                                    }
                                                    htmlFor="coupon"
                                                >
                                                    {this.state.couponError}
                                                </label>
                                            </div>
                                        </div>
                                        {this.state.accountCreationError !==
                                        "" ? (
                                            <div className="col-sm-12">
                                                <div className="bg-danger px-4 py-2 rounded text-white text-center mb-2 fs-6">
                                                    <span>{this.state.accountCreationError}</span>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className="col-sm-12">
                                            <button
                                                className="btn-blue full-width mt44"
                                                type="button"
                                                disabled={this.state.working}
                                                onClick={this.handleClick.bind(
                                                    null,
                                                    "createUser"
                                                )}
                                            >
                                                {this.state.buttonText}
                                            </button>
                                        </div>
                                        <div className="col-sm-12">
                                            <div
                                                className="text-center mt-2"
                                                style={{ fontSize: "14px" }}
                                            >
                                                By clicking “Create Account” you
                                                agree with our{" "}
                                                <a
                                                    href="/terms"
                                                    target="_blank"
                                                    style={{
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {" "}
                                                    Terms of Service{" "}
                                                </a>{" "}
                                                <br />
                                                <a
                                                    href="/mailbox/#login"
                                                    className="text-decoration-underline"
                                                >
                                                    Already a user
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="share hidden">
                                        <a
                                            className=""
                                            href="https://facebook.com/sharer/sharer.php?u=https://cyberfear.com"
                                            target="_blank"
                                            aria-label=""
                                        >
                                            <i className="fa fa-facebook fa-lg"></i>
                                        </a>

                                        <a
                                            className=""
                                            href="https://twitter.com/intent/tweet/?text=I'm protecting my emails with cyberfear.com.&amp;url=https://cyberfear.com"
                                            target="_blank"
                                            aria-label=""
                                        >
                                            <i className="fa fa-twitter fa-lg"></i>
                                        </a>

                                        <a
                                            className=""
                                            href="https://plus.google.com/share?url=https://cyberfear.com"
                                            target="_blank"
                                            aria-label=""
                                        >
                                            <i className="fa fa-google-plus fa-lg"></i>
                                        </a>
                                    </div>
                                </form>
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
                                        Your account was successfully created!
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
                                        Before logging in, please{" "}
                                        <b>download the secret token</b>. You
                                        will need this token to reset your
                                        password or secret phrase. You can read
                                        more about it in our{" "}
                                        <a
                                            href="https://blog.cyberfear.com/reset-password"
                                            target="_blank"
                                        >
                                            blog
                                        </a>
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
                                    <p>Once downloaded, please log in.</p>
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
