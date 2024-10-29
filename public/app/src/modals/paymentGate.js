define(["app", "accounting", "react"], function (app, accounting, React) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                buttonTag: "",
                buttonText: "Create Account",
                typeOfPayment:"", // PP, coin,credit/stripe
                valueOfPayment:"", //$
                periodOfPayment:"", //month/year
                paymentPlan:"",
                butDis: false,
                stripeId: "",
                currentTab: "yearly-one",
                paymentPackagesModalActive: true,
                paymentTabContents:[],
                prices: {
                },
                selectedPaymentOption: "subscription",
                choosePlanButtonIsLoading: false,
            };
        },

        populatePlans: function () {
            console.log(app.user.get('userPlan'));

            this.setState({
                paymentTabContents:[
                    {
                        id: "free",
                        title: "Free",
                        desc: "Try us",
                        price:"",
                        per: "",
                        methodType: "free",
                        features: [
                            "Full Encryption",
                            "Space: ",
                            "Email Address: ",
                            "Receiving: Unlimited",
                            "Sending: ",
                            "Own Domain: ",
                        ],
                    },
                    {
                        id: "basic",
                        title: "Basic",
                        desc: "For users  emailing occasionally",
                        price: "",
                        per: 'month',
                        methodType: "month",
                        features: [
                            "Full Encryption",
                            "Space: ",
                            "Email Address: ",
                            "Receiving: Unlimited",
                            "Sending: ",
                            "Own Domain: ",
                        ],
                    },
                    {
                        id: "medium",
                        title: "Medium",
                        desc: "Users using email daily",
                        price: "",
                        per: "month",
                        methodType: "year",
                        features: [
                            "Full Encryption",
                            "Space: ",
                            "Email Address: ",
                            "Receiving: Unlimited",
                            "Sending: Unlimited",
                            "Own Domain: ",
                        ],
                    },
                    ,
                    {
                        id: "pro",
                        title: "Pro",
                        desc: "Best in class",
                        price: "",
                        per: "month",
                        methodType: "year",
                        features: [
                            "Full Encryption",
                            "Space: ",
                            "Email Address: ",
                            "Receiving: Unlimited",
                            "Sending: Unlimited",
                            "Own Domain: ",
                        ],
                    }
                ]
            });

        },

        componentDidMount: function () {
            var thisComp = this;

            app.user.on(
                "change:userPlan",
                function () {
                    thisComp.populatePlans();
                    thisComp.setPrices();
                  /*  if (app.user.get("userPlan")["planSelected"] == 1) {
                        var pl = "year";
                    } else if (app.user.get("userPlan")["planSelected"] == 2) {
                        var pl = "month";
                    } else if (app.user.get("userPlan")["planSelected"] == 3) {
                        var pl = "free";
                    }
                    console.log(pl);
                    thisComp.setState({
                        valueOfPayment:
                            app.user.get("userPlan")["monthlyCharge"] -
                            app.user.get("userPlan")["alrdPaid"],
                        paymentPlan: pl,
                    });*/
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
        componentDidUpdate(prevProps, prevState) {
            // console.log("prevState: " + JSON.stringify(prevState, null, 2));
            // console.log("prevState.paymentPlan: " + prevState.paymentPlan);
            // console.log("paymentPlan: " + this.state.paymentPlan);
            // Check if paymentPlan has just been set (changed from null to a value)
            //if (prevState.paymentPlan === null && this.state.paymentPlan !== null) {
            if (prevState.paymentPlan != this.state.paymentPlan) {
                // Update paymentPackagesModalActive when paymentPlan is no longer null
                this.setState({ paymentPackagesModalActive: false });
            }
        },
        setMembership: function (plan,period,finalPrice) {
            console.log('setting price');
            var userObj = {};
            var thisComp = this;

            userObj["planSelector"] = plan;
            userObj["period"] = period;
            userObj["finalPrice"] = finalPrice;
            userObj["userToken"] = app.user.get("userLoginToken");
            $.ajax({
                method: "POST",
                url: app.defaults.get("apidomain") + "/SetMembershipPriceV3",
                data: userObj,
                dataType: "json",
                xhrFields: {
                    withCredentials: true,
                },
            }).then(function (msg) {
                console.log(msg);
                if (msg["response"] === "fail") {
                    app.notifications.systemMessage("tryAgain");
                } else if (msg["response"] === "success") {

                    app.userObjects.loadUserPlan(function () {
                        console.log('loadUserPlan');
                        thisComp.setState({
                            valueOfPayment:finalPrice,
                            paymentPlan:plan,
                            periodOfPayment:period,

                        },function(){
                            console.log('thisComp.state');
                            console.log(thisComp.state);
                        });

                    });
                }
            });
        },

        handleChange: async function (action, event) {
            switch (action) {

                case "free":
                /*    this.setState({
                        paymentPlan: "free",
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
                    });*/
                    break;

                case "perfectm":
                    var thisComp = this;
                    this.setState({
                        typeOfPayment: "perfectm",
                    });

                    break;
                case "bitc":
                    var thisComp = this;
                    this.setState({
                        typeOfPayment: "bitc",
                    });

                    break;
                case "stripe":
                    var thisComp = this;
                    this.setState({
                        typeOfPayment: "stripe",
                    });

                    break;

/*                    location:that.state.location,//'NewMembership','plan'
                        planSelector:that.state.forPlan, //free','basic','medium','pro'
                    howMuch:that.state.howMuch, //1
                    price: that.state.toPay, //usd
                    */
                 /*   <input
                        type="hidden"
                        name="item_name"
                        value={this.state.paymentPlan+" plan"}
                    />
                    <input
                        type="hidden"
                        name="item_desc"
                        value={
                            this.state.periodOfPayment == "yearly-two"
                                ? "2 Years Subscription":
                                this.state.periodOfPayment == "yearly-one"
                                    ? "1 Year Subscription":"1 month Subscription"
                        }

                    price:that.state.price, //$
                    planSelector:that.state.planSelector, //free, basic, etc
                    duration:that.state.duration, //item/plan descr 1 year,
                    type:that.state.type, // new membership, renewal

                    userToken:app.user.get("userLoginToken"),
                    email:app.user.get('loginEmail'),

                }),
                        */

//                     this.setState(
//                         {
//                             // typeOfPayment: "stripe",
//                             // type: "NewMembership",
//                             // price: this.state.valueOfPayment/100,
//                             // PaymentDescr: thisComp.state.periodOfPayment == "yearly-two"
//                             //     ? "2 Years Subscription":
//                             //     thisComp.state.periodOfPayment == "yearly-one"
//                             //         ? "1 Year Subscription":"1 month Subscription",
//                             // planSelector:this.state.paymentPlan
//                             typeOfPayment: "stripe",
//                             type: "NewMembership",
//                             price: this.state.valueOfPayment/100,
//                             PaymentDescr: thisComp.state.periodOfPayment == "yearly-two"
//                                 ? "2 years":
//                                 thisComp.state.periodOfPayment == "yearly-one"
//                                     ? "1 year":"1 month",
//                             planSelector:this.state.paymentPlan
//                         },
//                         function () {
//                             app.stripeCheckOut.start(this);
//                             app.stripeCheckOut.checkout(this);
//                         }
//                     );

                    break;

                case "paypal":
                    var thisComp = this;
                    this.setState({
                        typeOfPayment: "paypal",
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
                                                            .valueOfPayment/100,
                                                    },
                                                    items:[
                                                        {
                                                            name:thisComp.state.paymentPlan +' plan',
                                                            description: thisComp.state.periodOfPayment == "yearly-two"
                                                                ? "2 years":
                                                                thisComp.state.periodOfPayment == "yearly-one"
                                                                    ? "1 year":"1 month",
                                                            unit_amount:{
                                                                currency_code:"USD",
                                                                value:thisComp.state
                                                                    .valueOfPayment/100
                                                            },
                                                            quantity:1
                                                        }
                                                    ],
                                                    custom_id:app.user.get("userId")
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

        new_script: function () {
            return new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.src =
                    "https://www.paypal.com/sdk/js?client-id=AWvU3zcq6qRAA5i316iSxoUYqNJ6t8ukW_jba3SB8XeSCLZbyESO4noshH81NnbjrrK-QMWpi53he_FY&currency=USD";
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
            });
        },

        handleClick: function (action, event, period) {

            // this.setState({
            //     paymentPackagesModalActive: false,
            // });
            switch (action) {
                case 'readytopay':
                    console.log('readytopay');
                    console.log(event);
                    console.log(period);
                    console.log(this.state.prices[event]);
                    //calc total
                    var finalPrice=0;
                    //event; //pan type
                    //period; //monthly, yearly-one, yearly-two

                    if(period=="monthly"){
                        finalPrice=this.state.prices[event];
                    }else if(period=="yearly-one"){
                        finalPrice=this.state.prices[event]*12;
                    }else{
                        finalPrice=this.state.prices[event]*24;
                    }
                    this.setMembership(event,period,finalPrice);
                    break;
                case "payBalance":
                    //event.preventDefault();

                    if (this.state.typeOfPayment !== "perfectm") {
                        app.user.set({
                            tempCoin: true,
                        });
                    }
                    console.log('data submitted:')
                    console.log(this.state.valueOfPayment);
                    console.log(this.state.periodOfPayment);


                    break;
                case "payStripe":
                    var thisComp = this;
                    var recurring = this.state.selectedPaymentOption == "subscription" ? 1 : 0;
                    this.setState({
                        type: "NewMembership",
                        price: this.state.valueOfPayment / 100,
                        PaymentDescr: thisComp.state.periodOfPayment == "yearly-two"
                            ? "2 years"
                            : thisComp.state.periodOfPayment == "yearly-one"
                                ? "1 year"
                                : "1 month",
                        planSelector: this.state.paymentPlan, // "medium"
                        typeOfPayment: "stripe",
                        recurring: recurring,
                    }, () => {
                        // This callback runs after the state has been updated
                        app.stripeCheckOut.generateStripeCheckoutUrl(this);
                    });
                    break;
                case "freemium":
                    var userObj = {};
                    userObj["userToken"] = app.user.get("userLoginToken");

                    $.ajax({
                        method: "POST",
                        url:
                            app.defaults.get("apidomain") +
                            "/activateFreemiumV2",
                        data: userObj,
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
                    });

                    break;
            }
        },


        handleTabChange: function (type, event) {
           var thisComp=this;
            this.setState({
                currentTab: type,
            },function(){
                thisComp.setPrices();
            });
        },
        handleBackButton: function () {
            this.setState({
                paymentPackagesModalActive: true,
            });
        },
        setPrices: function (){
            var price=[];

            if(this.state.currentTab=="monthly"){
                this.state.paymentTabContents.forEach(function(element)
                {
                    price[element.id] = app.user.get('userPlan')["planList"][element.id]['price']-app.user.get('userPlan')["planList"][element.id]['price']*app.user.get('userPlan')['inviteDiscount']/100;
                });

            }else if(this.state.currentTab=="yearly-one"){
                //per="per year";

                this.state.paymentTabContents.forEach((element) => (

                    price[element.id]=app.user.get('userPlan')["planList"][element.id]['price']-app.user.get('userPlan')["planList"][element.id]['price']*(app.user.get('userPlan')["planList"][element.id]['1ydisc']+app.user.get('userPlan')['inviteDiscount'])/100
                ));
            }else{
                // per="biannual";
                this.state.paymentTabContents.forEach((element) => (
                    price[element.id]=app.user.get('userPlan')["planList"][element.id]['price']-app.user.get('userPlan')["planList"][element.id]['price']*(app.user.get('userPlan')["planList"][element.id]['2ydisc']+app.user.get('userPlan')['inviteDiscount'])/100
                ));
            }
            this.setState({
                prices:price
            })
        },

        render: function () {

            var per="per month";

            var space=[];
            var aliases=[];
            var sending=[];
            var domain=[];
            this.state.paymentTabContents.forEach(function(element)
            {
                space[element.id] = app.user.get('userPlan')["planList"][element.id]['bSize']/1000+"GB";
                aliases[element.id]=app.user.get('userPlan')["planList"][element.id]['alias'];
                sending[element.id]=app.user.get('userPlan')["planList"][element.id]['sendLimits']+ " emails/hour";
                domain[element.id]=app.user.get('userPlan')["planList"][element.id]['cDomain'];
            });

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
                                                type="button"
                                                role="tab"
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
                                            : "tab-pane fade show active"
                                    }`}
                                    id="monthly-tab-pane"
                                    role="tabpanel"
                                    tabIndex="0"
                                >
                                    <div className="row gx-4">
                                        {this.state.paymentTabContents.map(
                                            (paymentContentTab, index) => (
                                                <div

                                                    className="col-md-5 col-lg-3"
                                                    key={index}
                                                >
                                                    <div className={paymentContentTab.title=="Medium"?"pricing-box blackbanner":"pricing-box"}>
                                                        <div className="pricing-box-top">
                                                            <div className="pricing-title">
                                                                {
                                                                    paymentContentTab.title
                                                                }
                                                                {paymentContentTab.title=="Medium" &&(
                                                                    <span className='badge bg-primary'>POPULAR</span>
                                                                    )}
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
                                                                    accounting.formatMoney(this.state.prices[paymentContentTab.id]/100)
                                                                }
                                                            </div>
                                                            <div className="per-month">
                                                                {
                                                                    per
                                                                }
                                                            </div>
                                                            <div className="btn-row">
                                                                <button
                                                                    className={paymentContentTab.title=="Medium"?"btn fw-normal text-center w-100 border-primary border-1":"btn fw-normal text-center w-100 border-primary border-1 normal"}
                                                                    style={{borderRadius:"0.75rem"}}
                                                                    onClick={this.handleClick.bind(
                                                                        null,
                                                                        'readytopay',
                                                                        paymentContentTab.id,
                                                                        this.state.currentTab
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
                                                            <ul className={paymentContentTab.title=="Medium"?"featured list-unstyled small mb-5":"other"}>
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

                                                                            {[
                                                                                paymentFeature=="Space: "?paymentFeature+space[paymentContentTab.id]:
                                                                                    paymentFeature=="Email Address: "?"Email Address: "+aliases[paymentContentTab.id]:
                                                                                        paymentFeature=="Sending: "?"Sending: "+sending[paymentContentTab.id]:
                                                                                            paymentFeature=="Own Domain: "?"Own Domain: "+domain[paymentContentTab.id]:paymentFeature,


                                                                            ]
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
                                className="panel panel-default"

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
                                                className={`radio ${this.state.paymentPlan == "free"?"selected": "d-none"}`}
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
                                                                    .typeOfPayment ==
                                                                "free"
                                                            }
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
                                                            Free
                                                        </span>
                                                    </div>

                                                </label>
                                            </div>

                                            <div
                                                className={`radio ${this.state.paymentPlan == "free"? "d-none":this.state.typeOfPayment == "bitc"? "selected": ""}`}
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
                                                                    .typeOfPayment ==
                                                                "bitc"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                null,
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
                                                className={`radio d-none ${this.state.paymentPlan == "free" || this.state.selectedPaymentOption == "subscription"? "d-none":this.state.typeOfPayment == "perfectm"? "selected": ""}`}

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
                                                                    .typeOfPayment ==
                                                                "perfectm"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                null,
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
                                            <div className="clearfix"></div>
                                            <div
                                                className={`radio ${this.state.paymentPlan == "free" || this.state.selectedPaymentOption == "subscription"? "d-none":this.state.typeOfPayment == "paypal"? "selected": ""}`}
                                            >
                                                <label>
                                                    <div className="te_text">
                                                        <input
                                                            className="margin-right-10"
                                                            type="radio"
                                                            name="optionsRadios"
                                                            id="optionsRadios4"
                                                            value="option3"
                                                            checked={
                                                                this.state
                                                                    .typeOfPayment ==
                                                                "paypal"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                null,
                                                                "paypal"
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
                                                            (PayPal)
                                                        </span>
                                                    </div>
                                                    <span className="icon">
                                                       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 26 26">
<path d="M 4.71875 0.0625 L 0.1875 20.8125 L 6.1875 20.8125 L 7.65625 13.9375 L 11.9375 13.9375 C 16.03125 13.9375 19.429688 11.414063 20.34375 7.125 C 21.382813 2.269531 17.898438 0.0625 14.90625 0.0625 Z M 9.78125 4.28125 L 12.71875 4.28125 C 14.183594 4.28125 15.179688 5.550781 14.75 7.125 C 14.382813 8.703125 12.839844 9.96875 11.3125 9.96875 L 8.5 9.96875 Z M 22.53125 5.5 C 22.527344 6.125 22.46875 6.796875 22.3125 7.53125 C 21.90625 9.441406 21.085938 11.113281 19.9375 12.4375 C 19.453125 13.863281 18.015625 14.96875 16.59375 14.96875 L 16.53125 14.96875 C 15.152344 15.597656 13.613281 15.9375 11.9375 15.9375 L 9.28125 15.9375 L 8.15625 21.21875 L 7.8125 22.8125 L 6.15625 22.8125 L 5.5 25.8125 L 11.46875 25.8125 L 12.9375 18.9375 L 17.21875 18.9375 C 21.3125 18.9375 24.738281 16.414063 25.65625 12.125 C 26.425781 8.519531 24.691406 6.367188 22.53125 5.5 Z"></path>
</svg>

                                                    </span>
                                                </label>
                                            </div>


                                            <div className="clearfix"></div>
                                            <div
                                                className={`radio ${this.state.paymentPlan == "free"? "d-none":this.state.typeOfPayment == "stripe"? "selected": ""}`}
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
                                                                    .typeOfPayment ==
                                                                "stripe"
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                null,
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
                                                       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
<path d="M 5 7 C 2.25 7 0 9.25 0 12 L 0 38 C 0 40.75 2.25 43 5 43 L 45 43 C 47.75 43 50 40.75 50 38 L 50 12 C 50 9.25 47.75 7 45 7 Z M 5 9 L 45 9 C 46.667969 9 48 10.332031 48 12 L 48 38 C 48 39.667969 46.667969 41 45 41 L 5 41 C 3.332031 41 2 39.667969 2 38 L 2 12 C 2 10.332031 3.332031 9 5 9 Z M 25.90625 18 C 25.285156 18.125 24.8125 18.683594 24.8125 19.34375 C 24.8125 20.089844 25.429688 20.6875 26.1875 20.6875 C 26.933594 20.6875 27.53125 20.089844 27.53125 19.34375 C 27.53125 18.585938 26.933594 18 26.1875 18 C 26.09375 18 25.996094 17.980469 25.90625 18 Z M 16.8125 19.1875 L 14.625 19.5625 L 14.3125 21.5 L 13.53125 21.625 L 13.25 23.40625 L 14.3125 23.40625 L 14.3125 27.15625 C 14.3125 28.128906 14.554688 28.773438 15.0625 29.1875 C 15.488281 29.53125 16.078125 29.71875 16.9375 29.71875 C 17.601563 29.71875 18.03125 29.601563 18.3125 29.53125 L 18.3125 27.5 C 18.15625 27.539063 17.800781 27.625 17.5625 27.625 C 17.054688 27.625 16.8125 27.371094 16.8125 26.78125 L 16.8125 23.40625 L 18.15625 23.40625 L 18.46875 21.5 L 16.8125 21.5 Z M 10.15625 21.34375 C 9.285156 21.34375 8.582031 21.574219 8.0625 22 C 7.523438 22.445313 7.25 23.066406 7.25 23.84375 C 7.25 25.25 8.101563 25.867188 9.5 26.375 C 10.402344 26.695313 10.6875 26.929688 10.6875 27.28125 C 10.6875 27.625 10.402344 27.8125 9.875 27.8125 C 9.222656 27.8125 8.140625 27.476563 7.4375 27.0625 L 7.125 29 C 7.726563 29.34375 8.839844 29.71875 10 29.71875 C 10.921875 29.71875 11.703125 29.476563 12.21875 29.0625 C 12.796875 28.605469 13.09375 27.929688 13.09375 27.0625 C 13.09375 25.625 12.230469 25.039063 10.8125 24.53125 C 10.054688 24.25 9.625 24.03125 9.625 23.6875 C 9.625 23.398438 9.855469 23.25 10.28125 23.25 C 11.058594 23.25 11.859375 23.542969 12.40625 23.8125 L 12.71875 21.875 C 12.285156 21.667969 11.386719 21.34375 10.15625 21.34375 Z M 33.0625 21.34375 C 32.316406 21.34375 31.671875 21.660156 31.0625 22.3125 L 30.9375 21.5 L 28.65625 21.5 L 28.65625 32.53125 L 31.25 32.09375 L 31.25 29.53125 C 31.644531 29.65625 32.042969 29.71875 32.40625 29.71875 C 33.046875 29.71875 33.960938 29.535156 34.6875 28.75 C 35.382813 27.992188 35.75 26.824219 35.75 25.28125 C 35.75 23.914063 35.488281 22.882813 34.96875 22.21875 C 34.511719 21.628906 33.871094 21.34375 33.0625 21.34375 Z M 40.28125 21.34375 C 38.097656 21.34375 36.71875 22.972656 36.71875 25.5625 C 36.71875 27.011719 37.097656 28.089844 37.8125 28.78125 C 38.453125 29.402344 39.371094 29.71875 40.5625 29.71875 C 41.660156 29.71875 42.671875 29.457031 43.3125 29.03125 L 43.03125 27.28125 C 42.398438 27.625 41.671875 27.78125 40.84375 27.78125 C 40.347656 27.78125 39.996094 27.6875 39.75 27.46875 C 39.480469 27.242188 39.332031 26.871094 39.28125 26.34375 L 43.53125 26.34375 C 43.542969 26.21875 43.5625 25.625 43.5625 25.4375 C 43.5625 24.152344 43.265625 23.152344 42.71875 22.4375 C 42.160156 21.710938 41.347656 21.34375 40.28125 21.34375 Z M 23.40625 21.375 C 22.679688 21.375 22.101563 21.753906 21.875 22.4375 L 21.71875 21.5 L 19.46875 21.5 L 19.46875 29.5625 L 22.03125 29.5625 L 22.03125 24.3125 C 22.351563 23.917969 22.816406 23.78125 23.4375 23.78125 C 23.574219 23.78125 23.699219 23.78125 23.875 23.8125 L 23.875 21.4375 C 23.699219 21.398438 23.5625 21.375 23.40625 21.375 Z M 24.875 21.5 L 24.875 29.5625 L 27.46875 29.5625 L 27.46875 21.5 Z M 40.03125 23.09375 C 40.097656 23.078125 40.144531 23.09375 40.21875 23.09375 C 40.796875 23.09375 41.117188 23.640625 41.15625 24.78125 L 39.25 24.78125 C 39.3125 23.777344 39.574219 23.210938 40.03125 23.09375 Z M 32.21875 23.3125 C 32.871094 23.3125 33.1875 23.996094 33.1875 25.375 C 33.1875 26.160156 33.082031 26.773438 32.84375 27.1875 C 32.636719 27.582031 32.308594 27.78125 31.9375 27.78125 C 31.679688 27.78125 31.457031 27.726563 31.25 27.625 L 31.25 23.8125 C 31.683594 23.355469 32.074219 23.3125 32.21875 23.3125 Z"></path>
</svg>
                                                    </span>
                                                </label>
                                            </div>
                                            <div
                                                className={
                                                    this.state.selectedPaymentOption == "subscription"? "info-text":"d-none"
                                                }
                                                id="stripe-container"
                                            >
                                            <p>Subscriptions can be paid via Stripe only. If you wish to pay via Crypto Currency, select one-time payment.</p>
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
                                                value="Mailum"
                                            />
                                            <input
                                                type="hidden"
                                                name="PAYMENT_AMOUNT"
                                                value={this.state.valueOfPayment/100}
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
                                                value={this.state.paymentPlan+" plan"}
                                            />
                                            <input
                                                type="hidden"
                                                name="description"
                                                value={
                                                    this.state.periodOfPayment == "yearly-two"
                                                        ? "2 years":
                                                        this.state.periodOfPayment == "yearly-one"
                                                            ? "1 year":"1 month"
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                name="BAGGAGE_FIELDS"
                                                value="userId paymentFor description"
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
                                                value="anonymous@mailum.com"
                                            />
                                            <input
                                                type="hidden"
                                                name="item_name"
                                                value={this.state.paymentPlan+" plan"}
                                            />
                                            <input
                                                type="hidden"
                                                name="item_desc"
                                                value={
                                                    this.state.periodOfPayment == "yearly-two"
                                                        ? "2 years":
                                                        this.state.periodOfPayment == "yearly-one"
                                                    ? "1 year":"1 month"
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
                                                value={this.state.valueOfPayment/100}
                                            />
                                            <input
                                                type="hidden"
                                                name="want_shipping"
                                                value="0"
                                            />
                                            <input
                                                type="hidden"
                                                name="success_url"
                                                value="https://mailum.com/api/Pe"
                                            />
                                            <input
                                                type="hidden"
                                                name="cancel_url"
                                                value="https://mailum.com/api/Pe"
                                            />
                                        </form>
                                        <div className="clearfix"></div>

                                        {/* <div */}
                                        {/*     className={ */}
                                        {/*         this.state.typeOfPayment == "stripe"&&  this.state.paymentPlan != "free" */}
                                        {/*             ? "" */}
                                        {/*             : "d-none" */}
                                        {/*     } */}
                                        {/*     id="stripe-container" */}
                                        {/* > */}
                                        {/*     <form id="payment-form"> */}
                                        {/*         <div id="payment-element"></div> */}
                                        {/*         <button id="submit"> */}
                                        {/*             <div */}
                                        {/*                 className="spinner d-none" */}
                                        {/*                 id="spinner" */}
                                        {/*             ></div> */}
                                        {/*             <span id="button-text"> */}
                                        {/*                 Pay now */}
                                        {/*             </span> */}
                                        {/*         </button> */}
                                        {/*         <div */}
                                        {/*             id="payment-message" */}
                                        {/*             className="d-none" */}
                                        {/*         ></div> */}
                                        {/*     </form> */}
                                        {/* </div> */}
                                        <div
                                            className={
                                                this.state.paym == "stripe"
                                                    ? ""
                                                    : "d-none"
                                            }
                                            id="stripe-container"
                                        >
                                        <p>Stripe payment has been opened in a new tab.</p>
                                        </div>

                                        <div
                                            className={
                                                this.state.typeOfPayment == "paypal"
                                                    ? ""
                                                    : "d-none"
                                            }
                                            id="paypal-button-container"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/*<div
                                    className={`loading-screen welcome ${
                                        this.state.paymentPlan != "free"
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
                                </div>*/}
                                <div
                                    className="group-btn type-pay_now px-4"
                                >
                                    <button
                                        type="button"
                                        onClick={this.handleBackButton}
                                        className="back-button"
                                    >
                                        Back
                                    </button>


                                    <button
                                        type="submit"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "freemium"
                                        )}
                                        className={this.state.paymentPlan == "free"? "white-btn": "d-none"}
                                        style={{
                                            float: "none",
                                            display: "initial",
                                        }}
                                    >
                                        Sign In
                                    </button>

                                    <button
                                        type="submit"
                                        form={
                                            this.state.typeOfPayment === "perfectm"
                                                ? "perfMF"
                                                : "cryptF"
                                        }
                                        onClick={this.handleClick.bind(
                                            this,
                                            "payBalance"
                                        )}
                                        className={
                                            (this.state.typeOfPayment == "perfectm" ||
                                                this.state.typeOfPayment == "bitc") &&
                                            this.state.paymentPlan != "free" &&
                                            !this.state.butDis
                                                ? "white-btn"
                                                : "d-none"
                                        }
                                        disabled={
                                            this.state.typeOfPayment === "" ||
                                            this.state.paymentPlan === "" ||
                                            this.state.paymentPlan === null ||
                                            this.state.butDis
                                        }
                                        style={{
                                            float: "none",
                                            display: "initial",
                                        }}
                                    >
                                        {!this.state.paymentPlan ? "Loading..." : "Pay Now"}
                                    </button>

                                    <button
                                        type="submit"
                                        onClick={this.handleClick.bind(this, "payStripe")}
                                        className={
                                            (this.state.typeOfPayment === "stripe") &&
                                            this.state.paymentPlan !== "free" &&
                                            !this.state.butDis
                                                ? "white-btn"
                                                : "d-none"
                                        }
                                        disabled={
                                            this.state.typeOfPayment === "" ||
                                            this.state.paymentPlan === "" ||
                                            this.state.paymentPlan === null ||
                                            this.state.butDis
                                        }
                                        style={{
                                            float: "none",
                                            display: "initial",
                                        }}
                                    >
                                        {!this.state.paymentPlan ? "Loading..." : "Pay Now Stripe"}
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );
        },
    });
});
