define(["app", "accounting", "react"], function (app, accounting, React) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                buttonTag: "",
                buttonText: "Create Account",
                paym: "",
                mCharge: "",
                membr: "",
                butDis: false,
                stripeId: "",
                currentTab: "monthly",
                paymentPackagesModalActive: true,
            };
        },

        componentDidMount: function () {
            var thisComp = this;
            app.user.on(
                "change:userPlan",
                function () {
                    if (app.user.get("userPlan")["planSelected"] == 1) {
                        var pl = "year";
                    } else if (app.user.get("userPlan")["planSelected"] == 2) {
                        var pl = "month";
                    } else if (app.user.get("userPlan")["planSelected"] == 3) {
                        var pl = "free";
                    }
                    console.log(pl);
                    thisComp.setState({
                        mCharge:
                            app.user.get("userPlan")["monthlyCharge"] -
                            app.user.get("userPlan")["alrdPaid"],
                        membr: pl,
                    });
                },
                thisComp
            );

            /* $(".specButton").on({
                    mouseover:function(){
                        $(this).css({
                            left:(Math.random()*450)+"px",
                        });
                    }
                });*/
        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
        },
        setMembership: function (duration) {
            var userObj = {};
            var thisComp = this;

            userObj["planSelector"] = duration;
            userObj["userToken"] = app.user.get("userLoginToken");

            $.ajax({
                method: "POST",
                url: app.defaults.get("apidomain") + "/SetMembershipPriceV2",
                data: userObj,
                dataType: "json",
                xhrFields: {
                    withCredentials: true,
                },
            }).then(function (msg) {
                if (msg["response"] === "fail") {
                    app.notifications.systemMessage("tryAgain");
                } else if (msg["response"] === "success") {
                    app.userObjects.loadUserPlan(function () {
                        thisComp.setState(
                            {
                                butDis: false,
                            },
                            function () {
                                console.log(thisComp.state.mCharge);
                                console.log(thisComp.state.paym);
                                if (
                                    thisComp.state.paym == "stripe" &&
                                    thisComp.state.membr !== "free"
                                ) {
                                    var payLoad = {};
                                    payLoad["planSelector"] = this.state.membr;
                                    payLoad["userToken"] =
                                        app.user.get("userLoginToken");
                                    payLoad["price"] = this.state.mCharge;
                                    payLoad["stripeId"] = this.state.stripeId;

                                    app.stripeCheckOut.updateStripe(payLoad);
                                }
                            }
                        );
                    });
                }

                //console.log(msg)
            });
        },

        handleChange: async function (action, event) {
            switch (action) {
                case "year":
                    this.setState({
                        membr: "year",
                        butDis: true,
                    });
                    this.setMembership("year");
                    break;
                case "month":
                    this.setState({
                        membr: "month",
                        butDis: true,
                    });
                    this.setMembership("month");

                    break;

                case "free":
                    this.setState({
                        membr: "free",
                        butDis: true,
                    });
                    this.setState({
                        paymentPackagesModalActive: false,
                    });
                    this.setMembership("free");
                    $.ajax({
                        method: "POST",
                        url:
                            app.defaults.get("apidomain") +
                            "/activateFreemiumV2",
                        data: {},
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true,
                        },
                    }).then(function (msg) {
                        if (msg["response"] === "fail") {
                            app.notifications.systemMessage("tryAgain");
                        } else if (msg["response"] === "success") {
                            app.userObjects.loadUserPlan(function () {});
                        }

                        console.log(msg);
                    });
                    break;

                case "perfectm":
                    var thisComp = this;
                    this.setState({
                        paym: "perfectm",
                    });

                    break;
                case "bitc":
                    var thisComp = this;
                    this.setState({
                        paym: "bitc",
                    });

                    break;
                case "stripe":
                    var thisComp = this;
                    this.setState(
                        {
                            paym: "stripe",
                            location: "NewMembership",
                            email: app.user.get("loginEmail"),
                            toPay: this.state.mCharge,
                            forPlan: this.state.membr,
                            howMuch: 1,
                        },
                        function () {
                            app.stripeCheckOut.start(this);
                            app.stripeCheckOut.checkout(this);
                        }
                    );

                    break;

                case "paypal":
                    var thisComp = this;
                    this.setState({
                        paym: "paypal",
                    });

                    var my_script = thisComp.new_script();

                    var self = this;
                    my_script
                        .then(function () {
                            //self.setState({'status': 'done'});
                            paypal
                                .Buttons({
                                    style: {
                                        shape: "rect",
                                        color: "gold",
                                        layout: "vertical",
                                        label: "paypal",
                                    },
                                    createOrder: function (data, actions) {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: thisComp.state
                                                            .mCharge,
                                                    },
                                                    custom_id:
                                                        app.user.get("userId"),
                                                    description:
                                                        "NewMembership_1",
                                                },
                                            ],
                                            application_context: {
                                                shipping_preference:
                                                    "NO_SHIPPING",
                                            },
                                        });
                                    },
                                    onApprove: function (data, actions) {
                                        return actions.order
                                            .capture()
                                            .then(function (details) {
                                                //alert('Transaction completed by ' + details.payer.name.given_name + '!');
                                                // alert('done');
                                            });
                                    },
                                })
                                .render("#paypal-button-container");
                        })
                        .catch(function () {
                            //self.setState({'status': 'error'});
                        });

                    break;
            }
        },

        async stripeHandleSubmit(e) {
            console.log("her551");
            //4000000000000002 -decline
            //4242 4242 4242 4242 -good
            e.preventDefault();
            app.stripeCheckOut.setLoading(true);

            var elements = app.stripeCheckOut.get("elements");
            var stripe = app.stripeCheckOut.get("stripe");

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "https://cyber.com",
                },
                redirect: "if_required",
            });

            try {
                if (paymentIntent.status === "succeeded") {
                    console.log("paid");
                    app.stripeCheckOut.showMessage(
                        "Payment was accepted. Please wait to be redirected"
                    );
                }
            } catch (error) {}

            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            // console.log(error);
            try {
                if (
                    error.type === "card_error" ||
                    error.type === "validation_error"
                ) {
                    app.stripeCheckOut.showMessage(error.message);
                } else {
                    app.stripeCheckOut.showMessage(
                        "An unexpected error occured."
                    );
                }
            } catch (error) {}
            app.stripeCheckOut.setLoading(false);
        },

        new_script: function () {
            return new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.src =
                    "https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD";
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
            });
        },

        handleClick: function (action, event) {
            this.setState({
                paymentPackagesModalActive: false,
            });
            switch (action) {
                case "pay":
                    if (this.state.paym !== "perfectm") {
                        app.user.set({
                            tempCoin: true,
                        });
                    }
                    break;
                case "freemium":
                    $.ajax({
                        method: "POST",
                        url:
                            app.defaults.get("apidomain") +
                            "/activateFreemiumV2",
                        data: {},
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true,
                        },
                    }).then(function (msg) {
                        if (msg["response"] === "fail") {
                            app.notifications.systemMessage("tryAgain");
                        } else if (msg["response"] === "success") {
                            app.userObjects.loadUserPlan(function () {});
                        }

                        console.log(msg);
                    });

                    break;
            }
        },

        handleFreePayment: function () {
            this.state.setState({
                membr: "free",
            });
            this.handleChange.bind(this, "free");
        },

        handleMonthlyPayment: function () {
            this.state.setState({
                membr: "month",
            });
            this.handleChange.bind(this, "month");
        },
        handleYearlyPayment: function () {
            this.state.setState({
                membr: "year",
            });
            this.handleChange.bind(this, "year");
        },
        handleTabChange: function (type, event) {
            this.setState({
                currentTab: type,
            });
        },

        handleBackButton: function () {
            this.setState({
                paymentPackagesModalActive: true,
            });
        },

        render: function () {
            if (app.user.get("userPlan")["discountApplied"] > 0) {
                var discy = accounting.formatMoney(
                    (app.user.get("userPlan")["trueYearPrice"] *
                        (100 - app.user.get("userPlan")["discountApplied"])) /
                        10000
                );
                var discm = accounting.formatMoney(
                    (app.user.get("userPlan")["trueMonthPrice"] *
                        (100 - app.user.get("userPlan")["discountApplied"])) /
                        10000
                );

                if (app.user.get("userPlan")["planSelected"] == 1) {
                    var full =
                        "$" + app.user.get("userPlan")["trueYearPrice"] / 100;
                } else if (app.user.get("userPlan")["planSelected"] == 2) {
                    var full =
                        "$" + app.user.get("userPlan")["trueMonthPrice"] / 100;
                }
                var charge = false;
            } else {
                var charge = true;
            }

            const paymentTabs = [
                {
                    id: "monthly",
                    label: "Monthly",
                    tabId: "monthly",
                    offDesc: null,
                },
                {
                    id: "yearly",
                    label: "1 Year",
                    tabId: "yearly-one",
                    offDesc: "Save 30%",
                },
                {
                    id: "years2",
                    label: "2 years",
                    tabId: "yearly-two",
                    offDesc: "Save 40%",
                },
            ];

            const paymentTabContents = [
                {
                    id: "free",
                    title: "Free",
                    desc: "For most businesses that want to optimize web queries",
                    price: "$0.00",
                    per: "per month",
                    methodType: "free",
                    features: [
                        "All Limited Links",
                        "Own Analytics Platform",
                        "Chat Support",
                        "Optimize Hashtags",
                        "Unlimited Users",
                    ],
                },
                {
                    id: "monthly",
                    title: "Monthly",
                    desc: "For most businesses that want to optimize web queries",
                    price: `$
                    ${app.user.get("userPlan")["trueMonthPrice"] / 100}`,
                    per: `${discm} month`,
                    methodType: "month",
                    features: [
                        "All Limited Links",
                        "Own Analytics Platform",
                        "Chat Support",
                        "Optimize Hashtags",
                        "Unlimited Users",
                    ],
                },
                {
                    id: "yearly",
                    title: "Yearly",
                    desc: "For most businesses that want to optimize web queries",
                    price: `$
                    ${app.user.get("userPlan")["trueYearPrice"] / 100}`,
                    per: `${discy} month`,
                    methodType: "year",
                    features: [
                        "All Limited Links",
                        "Own Analytics Platform",
                        "Chat Support",
                        "Optimize Hashtags",
                        "Unlimited Users",
                    ],
                },
            ];

            return (
                <div
                    className="modal modal-sheet position-fixed d-flex bg-secondary bg-opacity-75 py-0 overflow-hidden"
                    id="makePayment"
                    tabIndex="-1"
                    role="dialog"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-pricing" role="document">
                        <div
                            id="paymentPackagesModalContent"
                            className={`modal-content rounded-4 shadow px-4 py-4 ${
                                this.state.paymentPackagesModalActive
                                    ? "d-block"
                                    : "d-none"
                            }`}
                        >
                            <div
                                className="pricing-top horizontal-center"
                                style={{ paddingTop: "10px" }}
                            >
                                <ul
                                    className="nav nav-tabs"
                                    id="myTab"
                                    role="tablist"
                                >
                                    {paymentTabs.map((paymentTab, index) => (
                                        <li role="presentation" key={index}>
                                            <button
                                                className={`${
                                                    this.state.currentTab ===
                                                    paymentTab.tabId
                                                        ? "active"
                                                        : ""
                                                }`}
                                                id={`${paymentTab.id}-tab`}
                                                data-bs-toggle="tab"
                                                data-bs-target={`#${paymentTab.id}-tab-pane`}
                                                type="button"
                                                role="tab"
                                                aria-controls={`${paymentTab.id}-tab-pane`}
                                                aria-selected={
                                                    this.state.currentTab ===
                                                    paymentTab.tabId
                                                        ? true
                                                        : false
                                                }
                                                onClick={this.handleTabChange.bind(
                                                    this,
                                                    paymentTab.tabId
                                                )}
                                            >
                                                <div
                                                    style={{
                                                        display:
                                                            "d-inline-block",
                                                    }}
                                                >
                                                    <div className="d-inline-block">
                                                        {paymentTab.label}
                                                    </div>
                                                    {paymentTab.offDesc !==
                                                    null ? (
                                                        <span className="dark">
                                                            {paymentTab.offDesc}
                                                        </span>
                                                    ) : (
                                                        <span className="d-none"></span>
                                                    )}
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="tab-content" id="myTabContent">
                                <div
                                    className={`${
                                        this.state.currentTab === "monthly"
                                            ? "tab-pane fade show active"
                                            : "tab-pane fade"
                                    }`}
                                    id="monthly-tab-pane"
                                    role="tabpanel"
                                    aria-labelledby="monthly-tab"
                                    tabindex="0"
                                >
                                    <div className="row gx-4">
                                        {paymentTabContents.map(
                                            (paymentContentTab, index) => (
                                                <div
                                                    className="col-md-6 col-lg-4"
                                                    key={index}
                                                >
                                                    <div className="pricing-box">
                                                        <div className="pricing-box-top">
                                                            <div className="pricing-title">
                                                                {
                                                                    paymentContentTab.title
                                                                }
                                                            </div>
                                                            <p>
                                                                {
                                                                    paymentContentTab.desc
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="pricing-box-middle">
                                                            <div className="price">
                                                                {
                                                                    paymentContentTab.price
                                                                }
                                                            </div>
                                                            <div className="per-month">
                                                                {
                                                                    paymentContentTab.per
                                                                }
                                                            </div>
                                                            <div className="btn-row">
                                                                <button
                                                                    className="btn-blue"
                                                                    onClick={this.handleChange.bind(
                                                                        this,
                                                                        paymentContentTab.methodType
                                                                    )}
                                                                    data-type={
                                                                        paymentContentTab.methodType
                                                                    }
                                                                >
                                                                    Choose plan
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="pricing-bullets">
                                                            <ul>
                                                                {paymentContentTab.features.map(
                                                                    (
                                                                        paymentFeature,
                                                                        _index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                _index
                                                                            }
                                                                        >
                                                                            {
                                                                                paymentFeature
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            id="paymentMethodsModalContent"
                            className={`modal-content rounded-4 shadow pb-4 ${
                                this.state.paymentPackagesModalActive
                                    ? "d-none"
                                    : "d-block"
                            }`}
                        >
                            <div
                                className={`
                                    ${
                                        this.state.membr == "free"
                                            ? "d-none"
                                            : "panel panel-default"
                                    }
                                `}
                            >
                                <div className="paymentmethod-heading px-4 pt-4 pb-3">
                                    <h4>Payment Method</h4>
                                </div>
                                <div className="px-4">
                                    <h2 className="title">
                                        Choose your Payment Method
                                    </h2>
                                </div>
                                <div className="panel-body px-4">
                                    <div className="form-inline text-center">
                                        <div className="form-group col-lg-offset-0 text-left">
                                            <div
                                                className={`radio ${
                                                    this.state.paym == "bitc"
                                                        ? "selected"
                                                        : ""
                                                }`}
                                            >
                                                <label>
                                                    <div className="te_text">
                                                        <input
                                                            className="margin-right-10"
                                                            type="radio"
                                                            name="optionsRadios"
                                                            id="optionsRadios1"
                                                            value="option1"
                                                            checked={
                                                                this.state
                                                                    .paym ==
                                                                "bitc"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "bitc"
                                                            )}
                                                        />
                                                        <span className="selected-icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="m19.95 26.75 11.95-12q.65-.65 1.55-.65t1.6.65q.7.75.7 1.65 0 .9-.7 1.6l-13.5 13.55q-.7.7-1.65.7t-1.6-.7L12.7 26q-.7-.7-.675-1.6.025-.9.775-1.65.65-.65 1.6-.65.95 0 1.65.65Z" />
                                                            </svg>
                                                        </span>
                                                        <span className="labelled">
                                                            Bitcoin & other
                                                            Crypto Currency
                                                        </span>
                                                    </div>

                                                    <span className="icon">
                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M9 8.38086H13.6846C14.7231 8.38086 15.5654 9.31548 15.5654 10.2616C15.5654 11.3001 14.7231 12.1424 13.6846 12.1424H9V8.38086Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M9 12.1309H14.3539C15.5423 12.1309 16.5 12.9732 16.5 14.0116C16.5 15.0501 15.5423 15.8924 14.3539 15.8924H9V12.1309Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12.2769 15.8809V17.7616"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M9.93457 15.8809V17.7616"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12.2769 6.5V8.38077"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M9.93457 6.5V8.38077"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M10.7769 8.38086H7.5"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M10.7769 15.8809H7.5"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                            />
                                                        </svg>
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div
                                                className={`radio ${
                                                    this.state.paym ==
                                                    "perfectm"
                                                        ? "selected"
                                                        : ""
                                                }`}
                                            >
                                                <label>
                                                    <div className="te_text">
                                                        <input
                                                            className="margin-right-10"
                                                            type="radio"
                                                            name="optionsRadios"
                                                            id="optionsRadios2"
                                                            value="option2"
                                                            checked={
                                                                this.state
                                                                    .paym ==
                                                                "perfectm"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "perfectm"
                                                            )}
                                                        />
                                                        <span className="selected-icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="m19.95 26.75 11.95-12q.65-.65 1.55-.65t1.6.65q.7.75.7 1.65 0 .9-.7 1.6l-13.5 13.55q-.7.7-1.65.7t-1.6-.7L12.7 26q-.7-.7-.675-1.6.025-.9.775-1.65.65-.65 1.6-.65.95 0 1.65.65Z" />
                                                            </svg>
                                                        </span>
                                                        <span className="labelled">
                                                            Perfect Money
                                                        </span>
                                                    </div>
                                                    <span className="icon">
                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M2 9H3C6 9 7 8 7 5V4"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M22 9H21C18 9 17 8 17 5V4"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M2 15H3C6 15 7 16 7 19V20"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M22 15H21C18 15 17 16 17 19V20"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                </label>
                                            </div>
                                            {/*
                                                <div className="clearfix"></div>
                                                <div className="radio">
                                                <label>
                                                <input className="margin-right-10" type="radio" name="optionsRadios" id="optionsRadios3"
                                                value="option3"
                                                checked={this.state.paym=='paypal'}
                                                onChange={this.handleChange.bind(this, 'paypal')} />
                                                &nbsp;PayPal
                                                </label>
                                                </div>
                                            */}
                                            <div className="clearfix"></div>
                                            <div
                                                className={`radio ${
                                                    this.state.paym == "stripe"
                                                        ? "selected"
                                                        : ""
                                                }`}
                                            >
                                                <label>
                                                    <div className="te_text">
                                                        <input
                                                            className="margin-right-10"
                                                            type="radio"
                                                            name="optionsRadios"
                                                            id="optionsRadios4"
                                                            value="option4"
                                                            checked={
                                                                this.state
                                                                    .paym ==
                                                                "stripe"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "stripe"
                                                            )}
                                                        />
                                                        <span className="selected-icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="m19.95 26.75 11.95-12q.65-.65 1.55-.65t1.6.65q.7.75.7 1.65 0 .9-.7 1.6l-13.5 13.55q-.7.7-1.65.7t-1.6-.7L12.7 26q-.7-.7-.675-1.6.025-.9.775-1.65.65-.65 1.6-.65.95 0 1.65.65Z" />
                                                            </svg>
                                                        </span>
                                                        <span className="labelled">
                                                            Credit / Debit Card
                                                            (Stripe)
                                                        </span>
                                                    </div>
                                                    <span className="icon">
                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M2 12.6101H19"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M19 10.28V17.43C18.97 20.28 18.19 21 15.22 21H5.78003C2.76003 21 2 20.2501 2 17.2701V10.28C2 7.58005 2.63 6.71005 5 6.57005C5.24 6.56005 5.50003 6.55005 5.78003 6.55005H15.22C18.24 6.55005 19 7.30005 19 10.28Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M22 6.73V13.72C22 16.42 21.37 17.29 19 17.43V10.28C19 7.3 18.24 6.55 15.22 6.55H5.78003C5.50003 6.55 5.24 6.56 5 6.57C5.03 3.72 5.81003 3 8.78003 3H18.22C21.24 3 22 3.75 22 6.73Z"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M5.25 17.8101H6.96997"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M9.10986 17.8101H12.5499"
                                                                stroke="#292D32"
                                                                strokeWidth="1.5"
                                                                strokeMiterlimit="10"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <form
                                            onSubmit={this.handleSubmit}
                                            className="d-none"
                                            id="perfMF"
                                            action="https://perfectmoney.com/api/step1.asp"
                                            method="POST"
                                            target="_blank"
                                        >
                                            <input
                                                type="hidden"
                                                name="PAYEE_ACCOUNT"
                                                value={app.defaults.get(
                                                    "perfectMecrh"
                                                )}
                                            />
                                            <input
                                                type="hidden"
                                                name="PAYEE_NAME"
                                                value="Cyber Fear"
                                            />
                                            <input
                                                type="hidden"
                                                name="PAYMENT_AMOUNT"
                                                value={this.state.mCharge}
                                            />
                                            <input
                                                type="hidden"
                                                name="PAYMENT_UNITS"
                                                value="USD"
                                            />
                                            <input
                                                type="hidden"
                                                name="STATUS_URL"
                                                value="https://cyberfear.com/api/PerfectPaidstatus"
                                            />
                                            <input
                                                type="hidden"
                                                name="PAYMENT_URL"
                                                value="https://cyberfear.com/api/Pe"
                                            />
                                            <input
                                                type="hidden"
                                                name="PAYMENT_URL_METHOD"
                                                value="POST"
                                            />
                                            <input
                                                type="hidden"
                                                name="NOPAYMENT_URL"
                                                value="https://cyberfear.com/api/Pe"
                                            />
                                            <input
                                                type="hidden"
                                                name="NOPAYMENT_URL_METHOD"
                                                value="LINK"
                                            />
                                            <input
                                                type="hidden"
                                                name="SUGGESTED_MEMO"
                                                value=""
                                            />
                                            <input
                                                type="hidden"
                                                name="userId"
                                                value={app.user.get("userId")}
                                            />
                                            <input
                                                type="hidden"
                                                name="paymentFor"
                                                value="NewMembership"
                                            />
                                            <input
                                                type="hidden"
                                                name="howMuch"
                                                value="1"
                                            />
                                            <input
                                                type="hidden"
                                                name="BAGGAGE_FIELDS"
                                                value="userId paymentFor howMuch"
                                            />
                                        </form>

                                        <form
                                            onSubmit={this.handleSubmit}
                                            className="d-none"
                                            id="cryptF"
                                            action="https://www.coinpayments.net/index.php"
                                            method="post"
                                            target="_blank"
                                            ref="crypto"
                                        >
                                            <input
                                                type="hidden"
                                                name="cmd"
                                                value="_pay_simple"
                                            />
                                            <input
                                                type="hidden"
                                                name="reset"
                                                value="1"
                                            />
                                            <input
                                                type="hidden"
                                                name="merchant"
                                                value={app.defaults.get(
                                                    "coinMecrh"
                                                )}
                                            />
                                            <input
                                                type="hidden"
                                                name="item_amount"
                                                value="1"
                                            />
                                            <input
                                                type="hidden"
                                                name="first_name"
                                                value="anonymous"
                                            />
                                            <input
                                                type="hidden"
                                                name="last_name"
                                                value="anonymous"
                                            />
                                            <input
                                                type="hidden"
                                                name="email"
                                                value="anonymous@cyberfear.com"
                                            />
                                            <input
                                                type="hidden"
                                                name="item_name"
                                                value="Premium Membership"
                                            />
                                            <input
                                                type="hidden"
                                                name="item_desc"
                                                value={
                                                    this.state.membr == "year"
                                                        ? "1 Year Subscription"
                                                        : "1 Month Subscription"
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                name="custom"
                                                value={app.user.get("userId")}
                                            />
                                            <input
                                                type="hidden"
                                                name="currency"
                                                value="USD"
                                            />
                                            <input
                                                type="hidden"
                                                name="amountf"
                                                value={this.state.mCharge}
                                            />
                                            <input
                                                type="hidden"
                                                name="want_shipping"
                                                value="0"
                                            />
                                            <input
                                                type="hidden"
                                                name="success_url"
                                                value="https://cyberfear.com/api/Pe"
                                            />
                                            <input
                                                type="hidden"
                                                name="cancel_url"
                                                value="https://cyberfear.com/api/Pe"
                                            />
                                        </form>
                                        <div className="clearfix"></div>

                                        <div
                                            className={
                                                this.state.paym == "stripe"
                                                    ? ""
                                                    : "d-none"
                                            }
                                            id="stripe-container"
                                        >
                                            <form id="payment-form">
                                                <div id="payment-element"></div>
                                                <button id="submit">
                                                    <div
                                                        className="spinner d-none"
                                                        id="spinner"
                                                    ></div>
                                                    <span id="button-text">
                                                        Pay now
                                                    </span>
                                                </button>
                                                <div
                                                    id="payment-message"
                                                    className="d-none"
                                                ></div>
                                            </form>
                                        </div>

                                        <div
                                            className={
                                                this.state.paym == "paypal"
                                                    ? ""
                                                    : "d-none"
                                            }
                                            id="paypal-button-container"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div
                                    className={`loading-screen welcome ${
                                        this.state.membr != "free"
                                            ? "d-none"
                                            : "d-flex"
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
                                                <h4>Welcome back!</h4>
                                                <p>
                                                    Please wait a few second...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.membr}
                                <div
                                    className={`group-btn type-pay_now px-4 ${
                                        this.state.membr != "free"
                                            ? ""
                                            : "d-none"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={this.handleBackButton.bind(
                                            this
                                        )}
                                        className={`back-button`}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        form={
                                            this.state.paym === "perfectm"
                                                ? "perfMF"
                                                : "cryptF"
                                        }
                                        onClick={this.handleClick.bind(
                                            this,
                                            "pay"
                                        )}
                                        className={
                                            (this.state.paym == "perfectm" ||
                                                this.state.paym == "bitc") &&
                                            this.state.membr != "free" &&
                                            !this.state.butDis
                                                ? "white-btn"
                                                : "d-none"
                                        }
                                        disabled={
                                            this.state.paym == "" ||
                                            this.state.butDis
                                        }
                                        style={{
                                            float: "none",
                                            display: "initial",
                                        }}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            </div>

                            <div
                                className={
                                    this.state.membr == "free" ? "" : "d-none"
                                }
                                style={{ textAlign: "center" }}
                            >
                                <button
                                    onClick={this.handleClick.bind(
                                        this,
                                        "freemium"
                                    )}
                                    className="white-btn"
                                    style={{
                                        float: "none",
                                        display: "initial",
                                    }}
                                >
                                    Log In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
