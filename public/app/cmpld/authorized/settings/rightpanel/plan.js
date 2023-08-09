define(["react", "app", "accounting", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, accounting, RightTop) {
    return React.createClass({
        getInitialState: function () {
            return {
                firstPanelClass: "panel-body",
                firstTab: "active",

                secondTab: "",
                secondPanelClass: "panel-body d-none",

                thirdTab: "",
                thirdPanelClass: "panel-body d-none",

                detailVisible: "",
                detailButtonVisible: "",
                //editDisabled:true,
                editDisabled: true,

                editPlanButtonClass: "",
                saveButtonClass: "d-none",
                toPay: 0,
                forPlan: "",

                mobileViewClass: "d-block-xs",
                desktopViewClass: "d-none-xs",

                cancelEditClass: "d-none",

                GBpayNow: "",
                GBprice: 0,
                boxBy: "",
                boxSize: 0,
                newboxSize: 0,
                boxWarning: false,
                boxButtonText: "",

                dompayNow: "",
                cDomain: 0,
                domBy: "",
                domWarning: false,
                Domprice: 0,
                domButtonText: "",

                alpayNow: "",
                aliases: 0,
                alprice: 0,
                newaliases: 0,
                alButtonText: "",
                alWarning: false,

                currentServiceCost: 0,

                paidThisMonth: 0,
                balance: 0,
                cycleStart: "",
                cycleEnd: "",
                monthlyCharge: 0,
                bitcoinPay: "d-none",
                paypalPay: "d-none",
                monthChargeClass: "d-none",
                planSelector: 1,
                howMuch: 0,
                paymentVersion: 0,
                currentPlan: 0,
                setWarning: false,
                paym: "",
                stripeId: ""
            };
        },

        handleClick: async function (i) {
            switch (i) {
                case "upgradeMember":
                    var thisComp = this;
                    thisComp.setState({
                        toPay: app.user.get("userPlan")["yearSubscr"] / 100 + app.user.get("userPlan")["balance"],
                        forPlan: "UpgradeToYear",
                        howMuch: 1
                    });
                    thisComp.handleClick("showSecond");
                    break;

                case "setGB":
                    var thisComp = this;
                    //if save
                    if (this.state.boxButtonText == "Save") {
                        var post = {
                            howMuch: thisComp.state.boxSize,
                            planSelector: "bSize"
                        };

                        app.serverCall.ajaxRequest("savePlan", post, function (result) {
                            if (result["response"] == "success") {
                                app.notifications.systemMessage("saved");
                                thisComp.presetValues();
                                thisComp.setState({
                                    boxBy: "",
                                    boxButtonText: ""
                                });
                            } else if (result["response"] == "fail" && result["data"] == "insBal") {} else if (result["response"] == "fail" && result["data"] == "failToSave") {}
                        });
                    }

                    if (this.state.boxButtonText == "Pay Now") {
                        thisComp.setState({
                            toPay: this.state.GBpayNow,
                            forPlan: "Mail Storage",
                            howMuch: thisComp.state.boxSize
                        });
                        thisComp.handleClick("showSecond");
                    }
                    //if pay

                    break;

                case "setDom":
                    var thisComp = this;
                    //if save
                    if (this.state.domButtonText == "Save") {
                        console.log(this.state.cDomain);

                        var post = {
                            howMuch: thisComp.state.cDomain,
                            planSelector: "cDomain"
                        };

                        app.serverCall.ajaxRequest("savePlan", post, function (result) {
                            if (result["response"] == "success") {
                                app.notifications.systemMessage("saved");
                                //thisComp.handleClick('showFirst');

                                thisComp.presetValues();
                                thisComp.setState({
                                    domBy: "",
                                    domButtonText: ""
                                });
                            } else if (result["response"] == "fail" && result["data"] == "insBal") {
                                //	$('#infoModHead').html("Insufficient Funds");
                                //	$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
                                //	$('#infoModal').modal('show');
                            } else if (result["response"] == "fail" && result["data"] == "failToSave") {
                                //	app.notifications.systemMessage('tryAgain');
                            }
                        });
                    }

                    if (this.state.domButtonText == "Pay Now") {
                        thisComp.setState({
                            toPay: this.state.dompayNow,
                            forPlan: "Custom Domain",
                            howMuch: thisComp.state.cDomain
                        });
                        thisComp.handleClick("showSecond");
                    }
                    //if pay

                    break;

                case "setAl":
                    var thisComp = this;
                    //if save
                    if (this.state.alButtonText == "Save") {
                        var post = {
                            howMuch: thisComp.state.aliases,
                            planSelector: "alias"
                        };

                        app.serverCall.ajaxRequest("savePlan", post, function (result) {
                            if (result["response"] == "success") {
                                app.notifications.systemMessage("saved");
                                //thisComp.handleClick('showFirst');

                                thisComp.presetValues();
                                thisComp.setState({
                                    alBy: "",
                                    alButtonText: ""
                                });
                            } else if (result["response"] == "fail" && result["data"] == "insBal") {
                                //	$('#infoModHead').html("Insufficient Funds");
                                //	$('#infoModBody').html("You are over your available balance by: <b>$"+result['need']+"</b> <br/>Please add more funds or select different plan.");
                                //	$('#infoModal').modal('show');
                            } else if (result["response"] == "fail" && result["data"] == "failToSave") {
                                //	app.notifications.systemMessage('tryAgain');
                            }
                        });
                    }

                    if (this.state.alButtonText == "Pay Now") {
                        //console.log(app.user.get("userId"))
                        thisComp.setState({
                            toPay: this.state.alpayNow,
                            forPlan: "Email Aliases",
                            howMuch: thisComp.state.aliases
                        });
                        thisComp.handleClick("showSecond");
                    }
                    //if pay

                    break;

                case "renew":
                    var thisComp = this;

                    thisComp.setState({
                        toPay: app.user.get("userPlan")["renewAmount"],
                        forPlan: "Subscription Renewal",
                        howMuch: 1
                    });

                    thisComp.handleClick("showSecond");

                    break;

                case "payEnough":
                    var thisComp = this;
                    thisComp.setState({
                        toPay: app.user.get("userPlan")["priceFullProrated"] + app.user.get("userPlan")["balance"],
                        forPlan: "Missing Balance",
                        howMuch: 1
                    });
                    thisComp.handleClick("showSecond");

                    break;

                case "showFirst":
                    this.setState({
                        firstPanelClass: "panel-body",
                        firstTab: "active",

                        secondTab: "",
                        secondPanelClass: "panel-body d-none",

                        thirdTab: "",
                        thirdPanelClass: "panel-body d-none",

                        editDisabled: true,
                        cancelEditClass: "d-none",

                        editPlanButtonClass: "",
                        saveButtonClass: "d-none",
                        paym: ""
                    });

                    break;

                case "showSecond":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        firstTab: "",

                        secondTab: "active",
                        secondPanelClass: "panel-body",

                        thirdTab: "",
                        thirdPanelClass: "panel-body d-none"
                    });
                    break;

                case "showThird":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        firstTab: "",

                        secondTab: "",
                        secondPanelClass: "panel-body d-none",

                        thirdTab: "active",
                        thirdPanelClass: "panel-body"
                    });
                    break;

                case "stripe":
                    this.setState({
                        paym: "stripe",
                        location: "plan",
                        email: app.user.get("loginEmail")
                    }, async function () {
                        await app.stripeCheckOut.start(this);
                        await app.stripeCheckOut.checkout(this);
                    });

                    break;
                case "payPal":
                    var thisComp = this;

                    thisComp.setState({
                        paym: "paypal"
                    });

                    var my_script = thisComp.new_script();

                    var self = this;
                    my_script.then(function () {
                        //self.setState({'status': 'done'});
                        paypal.Buttons({
                            style: {
                                shape: "rect",
                                color: "gold",
                                layout: "vertical",
                                label: "paypal"
                            },
                            createOrder: function (data, actions) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: thisComp.state.toPay
                                        },
                                        custom_id: app.user.get("userId"),
                                        description: thisComp.state.forPlan + "_" + thisComp.state.howMuch
                                    }],
                                    application_context: {
                                        shipping_preference: "NO_SHIPPING"
                                    }
                                });
                            },
                            onApprove: function (data, actions) {
                                return actions.order.capture().then(function (details) {
                                    //alert('Transaction completed by ' + details.payer.name.given_name + '!');
                                    alert("Thank you.");
                                    thisComp.handleClick.bind(thisComp, "showFirst");
                                });
                            }
                        }).render("#paypal-button-container");
                    }).catch(function () {
                        //self.setState({'status': 'error'});
                    });

                    break;

                case "showDetail":
                    this.setState({
                        detailVisible: "",
                        detailButtonVisible: "d-none"
                        //firstPanelClass:"panel-body hidden",
                        //secondPanelClass:"panel-body"
                    });
                    break;

                case "pay":
                    //$('#bitcoinModal').modal('show');

                    break;
            }
        },

        async stripeHandleSubmit(e) {
            console.log("her55");
            e.preventDefault();
            app.stripeCheckOut.setLoading(true);

            var elements = app.stripeCheckOut.get("elements");
            var stripe = app.stripeCheckOut.get("stripe");

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "https://cyber.com"
                },
                redirect: "if_required"
            });

            try {
                if (paymentIntent.status === "succeeded") {
                    console.log("paid2");
                    app.stripeCheckOut.showMessage("Payment was accepted. Please wait to be redirected");
                    this.handleClick("showFirst");
                }
            } catch (error) {}

            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            // console.log(error);
            try {
                if (error.type === "card_error" || error.type === "validation_error") {
                    app.stripeCheckOut.showMessage(error.message);
                } else {
                    app.stripeCheckOut.showMessage("An unexpected error occured.");
                }
            } catch (error) {}
            app.stripeCheckOut.setLoading(false);
        },

        new_script: function () {
            return new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.src = "https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD";
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
            });
        },

        getPlansDataPost: function () {
            var post = {
                planSelector: this.state.planSelector,
                howMuch: this.state.howMuch
            };
            return post;
        },

        handleChange: function (i, event) {
            var thisComp = this;
            switch (i) {
                case "changeGB":
                    thisComp.setState({
                        showButton: true,
                        planSelector: "bSize",
                        howMuch: event.target.value,
                        boxSize: event.target.value
                    }, function () {
                        this.calculateNewPrice(function (result) {});
                    });
                    break;
                case "changeDomain":
                    thisComp.setState({
                        planSelector: "cDomain",
                        howMuch: event.target.value,
                        cDomain: event.target.value
                    }, function () {
                        this.calculateNewPrice(function (result) {});
                    });

                    break;

                case "changeAl":
                    thisComp.setState({
                        planSelector: "alias",
                        howMuch: event.target.value,
                        aliases: event.target.value
                    }, function () {
                        this.calculateNewPrice(function (result) {});
                    });

                    break;

                //this.calculateNewPrice();
            }
        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
        },
        calculateNewPrice: function () {
            var thisComp = this;
            var post = this.getPlansDataPost();

            app.serverCall.ajaxRequest("calculatePrice", post, function (result) {
                if (result["response"] == "success") {
                    if (thisComp.state.planSelector == "bSize") {
                        if (result["data"]["warning"] == "mailbox2small") {
                            thisComp.setState({
                                boxWarning: true
                            });
                            //console.log('sdsd');
                        } else {
                            thisComp.setState({
                                boxWarning: false
                            });
                        }
                        if (result["data"]["oldPriceYear"] > result["data"]["newPriceYear"]) {
                            thisComp.setState({
                                boxButtonText: "Save",
                                GBprice: accounting.formatMoney(result["data"]["oldPriceYear"] - result["data"]["newPriceYear"]),
                                boxBy: "Plan will be decresed by",
                                GBpayNow: ""
                            });
                        } else if (result["data"]["oldPriceYear"] == result["data"]["newPriceYear"]) {
                            thisComp.setState({
                                boxButtonText: "",
                                GBprice: accounting.formatMoney(result["data"]["basePrice"] + result["data"]["fullPrice"]),
                                boxBy: "",
                                GBpayNow: ""
                            });
                        } else if (result["data"]["oldPriceYear"] < result["data"]["newPriceYear"]) {
                            if (result["data"]["changedByMinusBalance"] <= 0) {
                                thisComp.setState({
                                    boxButtonText: "Save",
                                    GBprice: accounting.formatMoney(result["data"]["newPriceYear"] - result["data"]["oldPriceYear"]),
                                    boxBy: "Plan will be increased by",
                                    GBpayNow: ""
                                });
                            } else {
                                thisComp.setState({
                                    boxButtonText: "Pay Now",
                                    GBprice: accounting.formatMoney(result["data"]["newPriceYear"] - result["data"]["oldPriceYear"]),
                                    boxBy: "Plan will be increased by",
                                    GBpayNow: result["data"]["minimumCharge"]
                                });
                            }
                        }
                    }

                    if (thisComp.state.planSelector == "cDomain") {
                        if (result["data"]["warning"] == "domain2small") {
                            thisComp.setState({
                                domWarning: true
                            });
                            //console.log('sdsd');
                        } else {
                            thisComp.setState({
                                domWarning: false
                            });
                        }
                        if (result["data"]["oldPriceYear"] > result["data"]["newPriceYear"]) {
                            thisComp.setState({
                                domButtonText: "Save",
                                Domprice: accounting.formatMoney(result["data"]["oldPriceYear"] - result["data"]["newPriceYear"]),
                                domBy: "Plan will be decresed by",
                                dompayNow: ""
                            });
                        } else if (result["data"]["oldPriceYear"] == result["data"]["newPriceYear"]) {
                            thisComp.setState({
                                domButtonText: "",
                                Domprice: accounting.formatMoney(result["data"]["basePrice"] + result["data"]["fullPrice"]),
                                domBy: "",
                                dompayNow: ""
                            });
                        } else if (result["data"]["oldPriceYear"] < result["data"]["newPriceYear"]) {
                            if (result["data"]["changedByMinusBalance"] <= 0) {
                                thisComp.setState({
                                    domButtonText: "Save",
                                    Domprice: accounting.formatMoney(result["data"]["newPriceYear"] - result["data"]["oldPriceYear"]),
                                    domBy: "Plan will be increased by",
                                    dompayNow: ""
                                });
                            } else {
                                thisComp.setState({
                                    domButtonText: "Pay Now",
                                    Domprice: accounting.formatMoney(result["data"]["newPriceYear"] - result["data"]["oldPriceYear"]),
                                    domBy: "Plan will be increased by",
                                    dompayNow: result["data"]["minimumCharge"]
                                });
                            }
                        }
                    }

                    if (thisComp.state.planSelector == "alias") {
                        if (result["data"]["warning"] == "alias2small") {
                            thisComp.setState({
                                alWarning: true
                            });
                            //console.log('sdsd');
                        } else {
                            thisComp.setState({
                                alWarning: false
                            });
                        }
                        if (result["data"]["oldPriceYear"] > result["data"]["newPriceYear"]) {
                            thisComp.setState({
                                alButtonText: "Save",
                                alprice: accounting.formatMoney(result["data"]["oldPriceYear"] - result["data"]["newPriceYear"]),
                                alBy: "Plan will be decresed by",
                                alpayNow: ""
                            });
                        } else if (result["data"]["oldPriceYear"] == result["data"]["newPriceYear"]) {
                            thisComp.setState({
                                alButtonText: "",
                                alprice: accounting.formatMoney(result["data"]["basePrice"] + result["data"]["fullPrice"]),
                                alBy: "",
                                alpayNow: ""
                            });
                        } else if (result["data"]["oldPriceYear"] < result["data"]["newPriceYear"]) {
                            if (result["data"]["changedByMinusBalance"] <= 0) {
                                thisComp.setState({
                                    alButtonText: "Save",
                                    alprice: accounting.formatMoney(result["data"]["newPriceYear"] - result["data"]["oldPriceYear"]),
                                    alBy: "Plan will be increased by",
                                    alpayNow: ""
                                });
                            } else {
                                thisComp.setState({
                                    alButtonText: "Pay Now",
                                    alprice: accounting.formatMoney(result["data"]["newPriceYear"] - result["data"]["oldPriceYear"]),
                                    alBy: "Plan will be increased by",
                                    alpayNow: result["data"]["minimumCharge"]
                                });
                            }
                        }
                    }
                }
            });
        },

        presetValues: function () {
            var thisComp = this;

            var def = $.Deferred();

            app.userObjects.loadUserPlan(function () {
                def.resolve();
            });

            def.done(function () {
                //	console.log(app.user.get("userPlan"));
                var currentPlan = app.user.get("userPlan");
                var decodedPlan = currentPlan["planData"];

                var timeEnd = new Date(currentPlan["cycleEnd"] * 1000);
                var timeStart = new Date(currentPlan["cycleStart"] * 1000);

                var dateStarted = new Date(currentPlan["created"] * 1000).getTime();
                var goodOld = new Date(2015, 11, 19).getTime();

                var amount = 2;
                if (goodOld > dateStarted) {
                    amount = 5;
                }

                if (app.user.get("userPlan")["pastDue"] == 1 && app.user.get("userPlan")["priceFullProrated"] > 0) {
                    thisComp.setState({ setWarning: true });
                } else {
                    thisComp.setState({ setWarning: false });
                }

                thisComp.setState({
                    boxSize: decodedPlan["bSize"],
                    cDomain: decodedPlan["cDomain"],
                    aliases: decodedPlan["alias"],

                    GBprice: 0,
                    boxBy: "",
                    GBpayNow: "",

                    newboxSize: 0,
                    boxWarning: false,
                    boxButtonText: "",

                    domBy: "",
                    domWarning: false,
                    Domprice: 0,
                    domButtonText: "",

                    alprice: 0,
                    newaliases: 0,
                    alButtonText: "",
                    alWarning: false,
                    alBy: "",
                    alButtonText: "",

                    dispEmails: decodedPlan["dispos"],

                    pgpStrength: decodedPlan["pgpStr"],
                    attSize: decodedPlan["attSize"],
                    importPGP: decodedPlan["pgpImport"],
                    contacts: decodedPlan["contactList"],
                    delaySend: decodedPlan["delaySend"],
                    sendLimits: decodedPlan["sendLimits"],
                    recipPerMail: decodedPlan["recipPerMail"],
                    folderExpiration: decodedPlan["folderExpire"],
                    secLog: decodedPlan["secLog"],
                    filtEmail: decodedPlan["filter"],
                    claimAmount: amount,
                    //isAlrdClaimed:currentPlan['creditUsed'],
                    isAlrdClaimed: true,

                    cycleEnd: timeEnd.toLocaleDateString(),
                    cycleStart: timeStart.toLocaleDateString()
                });

                // setTimeout(function(){
                //     thisComp.calculateNewPrice();
                // },100);
            });
        },

        componentDidMount: function () {
            var thisComp = this;

            this.presetValues();
            app.user.on("change:userPlan", function () {
                this.setState({
                    boxButtonText: "",
                    domButtonText: "",
                    alButtonText: "",
                    boxBy: "",
                    GBpayNow: "",
                    dompayNow: "",
                    alpayNow: "",
                    domBy: "",
                    alBy: "",
                    boxWarning: "",
                    domWarning: "",
                    alWarning: "",
                    boxSize: app.user.get("userPlan")["planData"]["bSize"],
                    cDomain: app.user.get("userPlan")["planData"]["cDomain"],
                    aliases: app.user.get("userPlan")["planData"]["alias"]
                });
            }, this);
        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
        },

        accountDataTable: function () {
            var options = [];
            var toP = accounting.formatMoney(app.user.get("userPlan")["priceFullProrated"] + app.user.get("userPlan")["balance"], "$", 2);
            var paid = [];

            /*  if(app.user.get("userPlan")['balance']<0){
                paid.push(<span key="sd1" className='txt-color-red'>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
                paid.push( <span  key="sd2"  className="pull-right txt-color-red">Account is past due.</span>);
            }else{
                paid.push(<span key="sd1" className=''>{accounting.formatMoney(app.user.get("userPlan")['balance'])}</span>);
            }*/
            //

            //console.log(app.user.get("userPlan"));
            //console.log(app.user.get('balanceShort'));
            var ys = "";
            if (app.user.get("userPlan")["priceFullProrated"] > 0 && app.user.get("userPlan")["pastDue"] == 0) {
                ys = "Partialy PAID";
            }

            if (app.user.get("userPlan")["pastDue"] == 1) {
                ys = "UNPAID";
            } else {
                ys = "PAID";
            }

            //what button to show
            //if pastdue and alrdpaid=0 then renew
            //if pastdue and alrd paid then missing balance

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1c" },
                React.createElement(
                    "label",
                    null,
                    "Start date:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    new Date(app.user.get("userPlan")["cycleStart"] * 1000).toLocaleDateString()
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1cc" },
                React.createElement(
                    "label",
                    null,
                    "End date:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    new Date(app.user.get("userPlan")["cycleEnd"] * 1000).toLocaleDateString()
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1cd" },
                React.createElement(
                    "label",
                    null,
                    "Status:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    React.createElement(
                        "b",
                        null,
                        ys
                    )
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "2a" },
                React.createElement(
                    "label",
                    null,
                    app.user.get("userPlan")["planSelected"] == 1 ? "Yearly" : "Monthly",
                    " ",
                    "Cost:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["monthlyCharge"])
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "2c" },
                React.createElement(
                    "label",
                    null,
                    React.createElement(
                        "b",
                        null,
                        "Paid This Cycle:"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["alrdPaid"])
                )
            ));

            //if(app.user.get("userPlan")['balance']>0){
            options.push(React.createElement(
                "div",
                {
                    className: "information-table-row",
                    key: "3a",
                    className: app.user.get("userPlan")["balance"] == 0 ? "d-none" : ""
                },
                React.createElement(
                    "label",
                    null,
                    "Previous Unpaid Balance:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["balance"])
                )
            ));

            options.push(React.createElement(
                "div",
                {
                    className: "information-table-row",
                    key: "3b",
                    className: app.user.get("userPlan")["currentPlanBalance"] == 0 ? "d-none" : ""
                },
                React.createElement(
                    "label",
                    null,
                    "Unused Credit:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["currentPlanBalance"])
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "3c" },
                React.createElement(
                    "label",
                    null,
                    "Rewards:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["rewardCollected"], "$", 3)
                )
            ));

            //}

            return options;
        },
        planTable: function () {
            var options = [];

            //Mailbox Size
            var boxDif = "";
            var bxS = this.state.newboxSize;

            if (this.state.newboxSize != this.state.boxSize) {
                boxDif = " => " + (bxS > 1000 ? bxS / 1000 + " Gb" : bxS + " MB");
            }
            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1" },
                React.createElement(
                    "label",
                    null,
                    "Mailbox Size:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    app.user.get("userPlan")["planData"]["bSize"] >= 1000 ? app.user.get("userPlan")["planData"]["bSize"] / 1000 + " Gb" : app.user.get("userPlan")["planData"]["bSize"] + " MB"
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "2" },
                React.createElement(
                    "label",
                    null,
                    "Custom Domain:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    app.user.get("userPlan")["planData"]["cDomain"]
                )
            ));

            var alDif = "";
            if (this.state.newaliases != this.state.aliases) {
                var alDif = " => " + this.state.newaliases;
            }
            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "3" },
                React.createElement(
                    "label",
                    null,
                    "Custom Aliases:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    app.user.get("userPlan")["planData"]["alias"]
                )
            ));

            return options;
        },
        render: function () {
            var classFullSettSelect = "col-xs-12";

            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle upgrade-plan" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "h2",
                            null,
                            "Upgrade"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            { className: "mid-nav" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    {
                                        role: "presentation",
                                        className: this.state.firstTab
                                    },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "showFirst")
                                        },
                                        "Features"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    {
                                        role: "presentation",
                                        className: this.state.secondTab
                                    },
                                    React.createElement(
                                        "a",
                                        {
                                            className: this.state.secondTab == "active" ? "" : "d-none"
                                        },
                                        "Pay Now"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    {
                                        role: "presentation",
                                        className: this.state.thirdTab
                                    },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "showThird")
                                        },
                                        "Plans"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.firstPanelClass },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    {
                                        className: app.user.get("userPlan")["pastDue"] === 1 ? "txt-color-red" : "d-none"
                                    },
                                    "Please Pay your balance to send and receive emails. Your email functionality is limited to access to previous emails only."
                                ),
                                React.createElement(
                                    "h3",
                                    {
                                        className: app.user.get("userPlan")["needRenew"] ? "txt-color-red" : "d-none"
                                    },
                                    "Please renew your service soon to avoid service interruption. Your email functionality will be limited to access to previous emails only."
                                ),
                                React.createElement(
                                    "h3",
                                    {
                                        className: (app.user.get("userPlan")["planSelected"] == 2 || app.user.get("userPlan")["planSelected"] == 3) && app.user.get("userPlan")["pastDue"] !== 1 ? "txt-color-red" : "d-none",
                                        style: { marginBottom: "20px" }
                                    },
                                    "Please upgrade to yearly subscription to unlock premium features."
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "upgrade-details-top" },
                                React.createElement(
                                    "div",
                                    { className: "upgrade-details-left" },
                                    React.createElement(
                                        "div",
                                        { className: "top-row" },
                                        React.createElement(
                                            "div",
                                            { className: "row" },
                                            React.createElement(
                                                "div",
                                                { className: "col-5" },
                                                React.createElement(
                                                    "div",
                                                    { className: "plan-details" },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon-plan" },
                                                        "Free"
                                                    ),
                                                    " ",
                                                    "Plan"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-7" },
                                                React.createElement(
                                                    "div",
                                                    { className: "pricing" },
                                                    React.createElement(
                                                        "sup",
                                                        null,
                                                        "$"
                                                    ),
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        "0.00"
                                                    ),
                                                    React.createElement(
                                                        "sup",
                                                        { className: "sup-opacity" },
                                                        "/ Month"
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "bottom-row" },
                                        React.createElement(
                                            "div",
                                            { className: "row" },
                                            React.createElement(
                                                "div",
                                                { className: "col-sm-6" },
                                                React.createElement(
                                                    "div",
                                                    { className: "storage" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "storage-count" },
                                                        accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024 / 1024, 2),
                                                        " ",
                                                        "GB",
                                                        " ",
                                                        React.createElement(
                                                            "span",
                                                            null,
                                                            "/",
                                                            " ",
                                                            app.user.get("userPlan")["planData"]["bSize"] / 1000,
                                                            " ",
                                                            "GB"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "storage-bar" },
                                                        React.createElement("span", null)
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-sm-6" },
                                                React.createElement(
                                                    "div",
                                                    {
                                                        className: (app.user.get("userPlan")["planSelected"] == 2 || app.user.get("userPlan")["planSelected"] == 3) && app.user.get("userPlan")["pastDue"] !== 1 ? "txt-color-red" : "d-none",
                                                        style: {
                                                            marginBottom: "20px"
                                                        }
                                                    },
                                                    React.createElement(
                                                        "button",
                                                        {
                                                            type: "button",
                                                            className: "btn-blue",
                                                            onClick: this.handleClick.bind(this, "upgradeMember")
                                                        },
                                                        "Upgrade",
                                                        " ",
                                                        accounting.formatMoney(app.user.get("userPlan")["yearSubscr"] / 100 + app.user.get("userPlan")["balance"]),
                                                        " ",
                                                        "for a year"
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "upgrade-details-right" },
                                    React.createElement(
                                        "div",
                                        { className: "title" },
                                        "Next payment"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "date" },
                                        "on Nov 30, 2022"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "btn-box" },
                                        React.createElement(
                                            "button",
                                            { className: "btn-border" },
                                            "Payments"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "upgrade-details-bottom" },
                                React.createElement(
                                    "div",
                                    { className: "accordion" },
                                    React.createElement(
                                        "div",
                                        { className: "accordion-item" },
                                        React.createElement(
                                            "h2",
                                            {
                                                className: "accordion-header",
                                                id: "plan-details-account"
                                            },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "accordion-button",
                                                    "data-bs-toggle": "collapse",
                                                    "data-bs-target": "#plan-details-account-collapse",
                                                    "aria-expanded": "true",
                                                    "aria-controls": "plan-details-account-collapse"
                                                },
                                                "Account:",
                                                React.createElement("span", { className: "icon" })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            {
                                                id: "plan-details-account-collapse",
                                                className: "accordion-collapse collapse show",
                                                "aria-labelledby": "plan-details-account",
                                                "data-bs-parent": "#plan-details-account-data"
                                            },
                                            React.createElement(
                                                "div",
                                                { className: "accordion-body" },
                                                React.createElement(
                                                    "div",
                                                    { className: "form-section" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "information-table" },
                                                        this.accountDataTable()
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement("div", { className: "float-none" }),
                                    React.createElement(
                                        "div",
                                        { className: "accordion-item" },
                                        React.createElement(
                                            "h2",
                                            {
                                                className: "accordion-header",
                                                id: "plan-details-current-features"
                                            },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "accordion-button",
                                                    "data-bs-toggle": "collapse",
                                                    "data-bs-target": "#plan-details-current-features-collapse",
                                                    "aria-expanded": "true",
                                                    "aria-controls": "plan-details-current-features-collapse"
                                                },
                                                "Your current plan have following features:",
                                                React.createElement("span", { className: "icon" })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            {
                                                id: "plan-details-current-features-collapse",
                                                className: "accordion-collapse collapse show",
                                                "aria-labelledby": "plan-details-current-features",
                                                "data-bs-parent": "#plan-details-current-features-data"
                                            },
                                            React.createElement(
                                                "div",
                                                { className: "accordion-body" },
                                                React.createElement(
                                                    "div",
                                                    { className: "table-row" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "table-responsive" },
                                                        React.createElement(
                                                            "div",
                                                            { className: "information-table" },
                                                            this.planTable()
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement("div", { className: "float-none" }),
                                    React.createElement(
                                        "div",
                                        { className: "accordion-item" },
                                        React.createElement(
                                            "h2",
                                            {
                                                className: "accordion-header",
                                                id: "plan-details-add-remove-features"
                                            },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "accordion-button",
                                                    "data-bs-toggle": "collapse",
                                                    "data-bs-target": "#plan-details-add-remove-features-collapse",
                                                    "aria-expanded": "true",
                                                    "aria-controls": "plan-details-add-remove-features-collapse"
                                                },
                                                "Add/Remove features:",
                                                React.createElement("span", { className: "icon" })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            {
                                                id: "plan-details-add-remove-features-collapse",
                                                className: "accordion-collapse collapse show",
                                                "aria-labelledby": "plan-details-add-remove-features",
                                                "data-bs-parent": "#plan-details-add-remove-features-data"
                                            },
                                            React.createElement(
                                                "div",
                                                { className: "accordion-body" },
                                                React.createElement(
                                                    "span",
                                                    { className: "col-lg-12" },
                                                    "* - current Plan"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "row" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-md-12 col-lg-4" },
                                                        React.createElement(
                                                            "div",
                                                            { className: "panel panel-default" },
                                                            React.createElement(
                                                                "div",
                                                                { className: "panel-body disable" },
                                                                React.createElement(
                                                                    "h5",
                                                                    null,
                                                                    React.createElement(
                                                                        "b",
                                                                        null,
                                                                        "Mailbox Space"
                                                                    )
                                                                ),
                                                                React.createElement(
                                                                    "div",
                                                                    { className: "form-horizontal margin-left-0" },
                                                                    React.createElement(
                                                                        "label",
                                                                        null,
                                                                        "Set Space in GB:"
                                                                    ),
                                                                    React.createElement(
                                                                        "div",
                                                                        null,
                                                                        React.createElement(
                                                                            "select",
                                                                            {
                                                                                className: "form-select",
                                                                                onChange: this.handleChange.bind(this, "changeGB"),
                                                                                value: this.state.boxSize,
                                                                                disabled: app.user.get("userPlan")["planSelected"] == 1 ? false : true,
                                                                                key: "editor1"
                                                                            },
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "1000" },
                                                                                app.user.get("userPlan")["planData"]["bSize"] == 1000 ? "1 GB*" : "1 GB"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "5000" },
                                                                                app.user.get("userPlan")["planData"]["bSize"] == 5000 ? "5 GB*" : "5 GB"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "10000" },
                                                                                app.user.get("userPlan")["planData"]["bSize"] == 10000 ? "10 GB*" : "10 GB"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "15000" },
                                                                                app.user.get("userPlan")["planData"]["bSize"] == 15000 ? "15 GB*" : "15 GB"
                                                                            )
                                                                        )
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.boxBy != "" ? "" : "d-none"
                                                                        },
                                                                        this.state.boxBy,
                                                                        ":",
                                                                        " "
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.boxBy != "" ? "" : "d-none"
                                                                        },
                                                                        this.state.GBprice,
                                                                        " ",
                                                                        "/ Year"
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.GBpayNow !== "" ? "" : "d-none"
                                                                        },
                                                                        "Amount to pay now:",
                                                                        " "
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.GBpayNow !== "" ? "" : "d-none"
                                                                        },
                                                                        "$",
                                                                        this.state.GBpayNow
                                                                    ),
                                                                    React.createElement("div", { className: "float-none" }),
                                                                    React.createElement(
                                                                        "span",
                                                                        {
                                                                            className: this.state.boxWarning ? "txt-color-red" : "d-none"
                                                                        },
                                                                        "Your current email box larger than requested size, please delete emails or increase the size"
                                                                    ),
                                                                    React.createElement(
                                                                        "div",
                                                                        { className: "col-lg-12 margin-top-20" },
                                                                        React.createElement(
                                                                            "button",
                                                                            {
                                                                                type: "button",
                                                                                className: this.state.boxButtonText != "" && !this.state.boxWarning ? "btn btn-primary pull-right" : "d-none",
                                                                                onClick: this.handleClick.bind(this, "setGB")
                                                                            },
                                                                            this.state.boxButtonText
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-md-12 col-lg-4" },
                                                        React.createElement(
                                                            "div",
                                                            { className: "panel panel-default" },
                                                            React.createElement(
                                                                "div",
                                                                { className: "panel-body" },
                                                                React.createElement(
                                                                    "h5",
                                                                    null,
                                                                    React.createElement(
                                                                        "b",
                                                                        null,
                                                                        "Custom Domain"
                                                                    )
                                                                ),
                                                                React.createElement(
                                                                    "div",
                                                                    { className: "form-horizontal margin-left-0" },
                                                                    React.createElement(
                                                                        "label",
                                                                        { className: "" },
                                                                        "Number Of Domains:"
                                                                    ),
                                                                    React.createElement(
                                                                        "div",
                                                                        { className: "" },
                                                                        React.createElement(
                                                                            "select",
                                                                            {
                                                                                className: "form-select",
                                                                                onChange: this.handleChange.bind(this, "changeDomain"),
                                                                                value: this.state.cDomain,
                                                                                disabled: app.user.get("userPlan")["planSelected"] == 1 ? false : true
                                                                            },
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "0" },
                                                                                app.user.get("userPlan")["planData"]["cDomain"] == 0 ? "0*" : "0"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "1" },
                                                                                app.user.get("userPlan")["planData"]["cDomain"] == 1 ? "1*" : "1"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "2" },
                                                                                app.user.get("userPlan")["planData"]["cDomain"] == 2 ? "2*" : "2"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "3" },
                                                                                app.user.get("userPlan")["planData"]["cDomain"] == 3 ? "3*" : "3"
                                                                            )
                                                                        )
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.domBy != "" ? "" : "d-none"
                                                                        },
                                                                        this.state.domBy,
                                                                        ":"
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.domBy != "" ? "" : "d-none"
                                                                        },
                                                                        this.state.Domprice,
                                                                        " ",
                                                                        "/ Year"
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.dompayNow !== "" ? "" : "d-none"
                                                                        },
                                                                        "Amount to pay now:",
                                                                        " "
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.dompayNow !== "" ? "" : "d-none"
                                                                        },
                                                                        "$",
                                                                        this.state.dompayNow
                                                                    ),
                                                                    React.createElement("div", { className: "float-none" }),
                                                                    React.createElement(
                                                                        "span",
                                                                        {
                                                                            className: this.state.domWarning ? "txt-color-red" : "d-none"
                                                                        },
                                                                        "Your currently have more domain registered than new plan allowed, please remove unneeded domain(s) or increase plan"
                                                                    ),
                                                                    React.createElement(
                                                                        "div",
                                                                        { className: "col-lg-12 margin-top-20" },
                                                                        React.createElement(
                                                                            "button",
                                                                            {
                                                                                type: "button",
                                                                                className: this.state.domButtonText != "" && !this.state.domWarning ? "btn btn-primary pull-right" : "d-none",
                                                                                onClick: this.handleClick.bind(this, "setDom")
                                                                            },
                                                                            this.state.domButtonText
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-md-12 col-lg-4" },
                                                        React.createElement(
                                                            "div",
                                                            { className: "panel panel-default" },
                                                            React.createElement(
                                                                "div",
                                                                { className: "panel-body" },
                                                                React.createElement(
                                                                    "h5",
                                                                    null,
                                                                    React.createElement(
                                                                        "b",
                                                                        null,
                                                                        "Custom Alias"
                                                                    )
                                                                ),
                                                                React.createElement(
                                                                    "div",
                                                                    { className: "form-horizontal margin-left-0" },
                                                                    React.createElement(
                                                                        "label",
                                                                        { className: "" },
                                                                        "Number of aliases:"
                                                                    ),
                                                                    React.createElement(
                                                                        "div",
                                                                        { className: "" },
                                                                        React.createElement(
                                                                            "select",
                                                                            {
                                                                                className: "form-select",
                                                                                onChange: this.handleChange.bind(this, "changeAl"),
                                                                                value: this.state.aliases,
                                                                                disabled: app.user.get("userPlan")["planSelected"] == 1 ? false : true
                                                                            },
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "0" },
                                                                                app.user.get("userPlan")["planData"]["alias"] == 0 ? "0*" : "0"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "1" },
                                                                                app.user.get("userPlan")["planData"]["alias"] == 1 ? "1*" : "1"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "5" },
                                                                                app.user.get("userPlan")["planData"]["alias"] == 5 ? "5*" : "5"
                                                                            ),
                                                                            React.createElement(
                                                                                "option",
                                                                                { value: "10" },
                                                                                app.user.get("userPlan")["planData"]["alias"] == 10 ? "10*" : "10"
                                                                            )
                                                                        )
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.alBy != "" ? "" : "d-none"
                                                                        },
                                                                        this.state.alBy,
                                                                        ":"
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.alBy != "" ? "" : "d-none"
                                                                        },
                                                                        this.state.alprice,
                                                                        " ",
                                                                        "/ Year"
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.alpayNow !== "" ? "" : "d-none"
                                                                        },
                                                                        "Amount to pay now:",
                                                                        " "
                                                                    ),
                                                                    React.createElement(
                                                                        "label",
                                                                        {
                                                                            className: this.state.alpayNow !== "" ? "" : "d-none"
                                                                        },
                                                                        "$",
                                                                        this.state.alpayNow
                                                                    ),
                                                                    React.createElement(
                                                                        "span",
                                                                        {
                                                                            className: this.state.alWarning ? "txt-color-red" : "d-none"
                                                                        },
                                                                        "Your currently have more aliases registered than plan you selected, please remove unneeded aliase(s) or increase plan"
                                                                    ),
                                                                    React.createElement(
                                                                        "div",
                                                                        { className: "col-lg-12 margin-top-20" },
                                                                        React.createElement(
                                                                            "button",
                                                                            {
                                                                                type: "button",
                                                                                className: this.state.alButtonText != "" && !this.state.alWarning ? "btn btn-primary pull-right" : "d-none",
                                                                                onClick: this.handleClick.bind(this, "setAl")
                                                                            },
                                                                            this.state.alButtonText
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement("div", { className: "float-none" })
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.secondPanelClass },
                            React.createElement(
                                "h3",
                                { className: "d-none" },
                                "Payment"
                            ),
                            React.createElement(
                                "div",
                                { className: "btn-row btn-group" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn-border fixed-width-btn",
                                        onClick: this.handleClick.bind(this, "showFirst")
                                    },
                                    "Cancel"
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "submit",
                                        className: "btn-blue fixed-width-btn",
                                        form: "crypF",
                                        onClick: this.handleClick.bind(this, "showFirst")
                                    },
                                    "Pay With CoinPayments"
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "submit",
                                        className: "btn-blue fixed-width-btn",
                                        form: "perfF",
                                        onClick: this.handleClick.bind(this, "showFirst")
                                    },
                                    "Pay With Perfect Money"
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "submit",
                                        className: "btn-blue fixed-width-btn",
                                        onClick: this.handleClick.bind(this, "stripe")
                                    },
                                    "Pay With stripe (Credit / Debit Card)"
                                )
                            ),
                            React.createElement("div", { className: "float-none" }),
                            React.createElement(
                                "div",
                                { className: "info-text" },
                                "Info: It may take some time to reflect new balance after successfull payment. ",
                                React.createElement("br", null),
                                " If you pay with bitcoin, make sure you enter exact amount you are willing to pay, otherwise it may be marked as mispayment."
                            ),
                            React.createElement("div", { className: "float-none" }),
                            React.createElement("div", {
                                className: this.state.paym == "paypal" ? "" : "d-none",
                                id: "paypal-button-container"
                            }),
                            React.createElement(
                                "div",
                                {
                                    className: this.state.paym == "stripe" ? "" : "d-none",
                                    id: "stripe-container"
                                },
                                React.createElement(
                                    "form",
                                    { id: "payment-form" },
                                    React.createElement("div", { id: "payment-element" }),
                                    React.createElement(
                                        "button",
                                        { id: "submit" },
                                        React.createElement("div", {
                                            className: "spinner d-none",
                                            id: "spinner"
                                        }),
                                        React.createElement(
                                            "span",
                                            { id: "button-text" },
                                            "Pay now"
                                        )
                                    ),
                                    React.createElement("div", {
                                        id: "payment-message",
                                        className: "d-none"
                                    })
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.thirdPanelClass },
                            React.createElement(
                                "h3",
                                null,
                                "Choose a Plan:"
                            ),
                            React.createElement(
                                "p",
                                { className: "f12" },
                                "Simple pricing. No hidden fees. Advanced features."
                            ),
                            React.createElement(
                                "div",
                                { className: "tab-section" },
                                React.createElement(
                                    "ul",
                                    {
                                        className: "nav nav-tabs",
                                        id: "myTab",
                                        role: "tablist"
                                    },
                                    React.createElement(
                                        "li",
                                        {
                                            className: "nav-item",
                                            role: "presentation"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "nav-link active",
                                                id: "monthly-tab",
                                                "data-bs-toggle": "tab",
                                                "data-bs-target": "#monthly",
                                                type: "button",
                                                role: "tab",
                                                "aria-controls": "Monthly",
                                                "aria-selected": "true"
                                            },
                                            "Monthly"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: "nav-item",
                                            role: "presentation"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "nav-link",
                                                id: "year-tab",
                                                "data-bs-toggle": "tab",
                                                "data-bs-target": "#year",
                                                type: "button",
                                                role: "tab",
                                                "aria-controls": "year",
                                                "aria-selected": "false"
                                            },
                                            React.createElement(
                                                "strong",
                                                null,
                                                "1 Year"
                                            ),
                                            React.createElement(
                                                "span",
                                                { className: "low-opacity" },
                                                "Save 30%"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: "nav-item",
                                            role: "presentation"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "nav-link",
                                                id: "year-2-tab",
                                                "data-bs-toggle": "tab",
                                                "data-bs-target": "#year-2",
                                                type: "button",
                                                role: "tab",
                                                "aria-controls": "year-2",
                                                "aria-selected": "false"
                                            },
                                            React.createElement(
                                                "strong",
                                                null,
                                                "2 Years"
                                            ),
                                            React.createElement(
                                                "span",
                                                { className: "low-opacity" },
                                                "Save 40%"
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        className: "tab-content",
                                        id: "additional-plans"
                                    },
                                    React.createElement(
                                        "div",
                                        {
                                            className: "tab-pane fade active show",
                                            id: "monthly",
                                            role: "tabpanel",
                                            "aria-labelledby": "monthly-tab"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "tab-content-top" },
                                            React.createElement(
                                                "div",
                                                { className: "tab-content-left" },
                                                React.createElement(
                                                    "div",
                                                    {
                                                        className: "btn-group",
                                                        role: "group",
                                                        "aria-label": "Basic radio toggle button group"
                                                    },
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "plan",
                                                            id: "free",
                                                            autocomplete: "off",
                                                            defaultChecked: true
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "free"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Free"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$0.00",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "plan",
                                                            id: "basic",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "basic"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Basic"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$24",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "plan",
                                                            id: "standard",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "standard"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Standard"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$60",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "plan",
                                                            id: "professional",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "professional"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Professional"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$180",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "tab-content-right" },
                                                React.createElement(
                                                    "h3",
                                                    null,
                                                    "Features:"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "plan-features" },
                                                    React.createElement(
                                                        "ul",
                                                        null,
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "1 GB Storage"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "60/hour sending limit"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "1 Custom aliases"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "10 Custom Disp. aliases"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "Inbox rules"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            { className: "not-include" },
                                                            "Custom domain"
                                                        )
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "form-section-bottom" },
                                            React.createElement(
                                                "div",
                                                { className: "compare-plans" },
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    "Compare plans"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "btn-row" },
                                                React.createElement(
                                                    "button",
                                                    { className: "btn-blue fixed-width-btn" },
                                                    "Choose plan"
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            className: "tab-pane fade",
                                            id: "year",
                                            role: "tabpanel",
                                            "aria-labelledby": "year-tab"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "tab-content-top" },
                                            React.createElement(
                                                "div",
                                                { className: "tab-content-left" },
                                                React.createElement(
                                                    "div",
                                                    {
                                                        className: "btn-group",
                                                        role: "group",
                                                        "aria-label": "Basic radio toggle button group"
                                                    },
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-plan",
                                                            id: "year-free",
                                                            autocomplete: "off",
                                                            defaultChecked: true
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-free"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Free"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$0.00",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-plan",
                                                            id: "year-basic",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-basic"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Basic"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$24",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-plan",
                                                            id: "year-standard",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-standard"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Standard"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$60",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-plan",
                                                            id: "year-professional",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-professional"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Professional"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$180",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "tab-content-right" },
                                                React.createElement(
                                                    "h3",
                                                    null,
                                                    "Features:"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "plan-features" },
                                                    React.createElement(
                                                        "ul",
                                                        null,
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "1 GB Storage"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "60/hour sending limit"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "1 Custom aliases"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "10 Custom Disp. aliases"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "Inbox rules"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            { className: "not-include" },
                                                            "Custom domain"
                                                        )
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "form-section-bottom" },
                                            React.createElement(
                                                "div",
                                                { className: "compare-plans" },
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    "Compare plans"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "btn-row" },
                                                React.createElement(
                                                    "button",
                                                    { className: "btn-blue fixed-width-btn" },
                                                    "Choose plan"
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            className: "tab-pane fade",
                                            id: "year-2",
                                            role: "tabpanel",
                                            "aria-labelledby": "year-2-tab"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "tab-content-top" },
                                            React.createElement(
                                                "div",
                                                { className: "tab-content-left" },
                                                React.createElement(
                                                    "div",
                                                    {
                                                        className: "btn-group",
                                                        role: "group",
                                                        "aria-label": "Basic radio toggle button group"
                                                    },
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-2-plan",
                                                            id: "year-2-free",
                                                            autocomplete: "off",
                                                            defaultChecked: true
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-2-free"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Free"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$0.00",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-2-plan",
                                                            id: "year-2-basic",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-2-basic"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Basic"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$24",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-2-plan",
                                                            id: "year-2-standard",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-2-standard"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Standard"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$60",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "radio-box" },
                                                        React.createElement("input", {
                                                            type: "radio",
                                                            className: "btn-check",
                                                            name: "year-2-plan",
                                                            id: "year-2-professional",
                                                            autocomplete: "off"
                                                        }),
                                                        React.createElement(
                                                            "label",
                                                            {
                                                                className: "btn btn-outline-primary",
                                                                htmlFor: "year-2-professional"
                                                            },
                                                            " ",
                                                            React.createElement("span", { className: "dot" }),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-name" },
                                                                "Professional"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-text" },
                                                                "Current plan"
                                                            ),
                                                            " ",
                                                            React.createElement(
                                                                "span",
                                                                { className: "plan-price" },
                                                                "$180",
                                                                " ",
                                                                React.createElement(
                                                                    "span",
                                                                    { className: "duration" },
                                                                    "/ Month"
                                                                )
                                                            ),
                                                            " "
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "tab-content-right" },
                                                React.createElement(
                                                    "h3",
                                                    null,
                                                    "Features:"
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "plan-features" },
                                                    React.createElement(
                                                        "ul",
                                                        null,
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "1 GB Storage"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "60/hour sending limit"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "1 Custom aliases"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "10 Custom Disp. aliases"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            null,
                                                            "Inbox rules"
                                                        ),
                                                        React.createElement(
                                                            "li",
                                                            { className: "not-include" },
                                                            "Custom domain"
                                                        )
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "form-section-bottom" },
                                            React.createElement(
                                                "div",
                                                { className: "compare-plans" },
                                                React.createElement(
                                                    "button",
                                                    null,
                                                    "Compare plans"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "btn-row" },
                                                React.createElement(
                                                    "button",
                                                    { className: "btn-blue fixed-width-btn" },
                                                    "Choose plan"
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "form",
                        {
                            className: "d-none",
                            id: "perfF",
                            action: "https://perfectmoney.com/api/step1.asp",
                            method: "POST",
                            target: "_blank"
                        },
                        React.createElement("input", {
                            type: "hidden",
                            name: "PAYEE_ACCOUNT",
                            value: app.defaults.get("perfectMecrh")
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "PAYEE_NAME",
                            value: "Cyber Fear"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "PAYMENT_AMOUNT",
                            value: this.state.toPay
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "PAYMENT_UNITS",
                            value: "USD"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "STATUS_URL",
                            value: "https://cyberfear.com/api/PerfectPaidstatus"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "PAYMENT_URL",
                            value: "https://cyberfear.com/api/Pe"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "PAYMENT_URL_METHOD",
                            value: "POST"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "NOPAYMENT_URL",
                            value: "https://cyberfear.com/api/Pe"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "NOPAYMENT_URL_METHOD",
                            value: "LINK"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "SUGGESTED_MEMO",
                            value: ""
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "userId",
                            value: app.user.get("userId")
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "paymentFor",
                            value: this.state.forPlan
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "howMuch",
                            value: this.state.howMuch
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "BAGGAGE_FIELDS",
                            value: "userId paymentFor howMuch"
                        })
                    ),
                    React.createElement(
                        "form",
                        {
                            className: "d-none",
                            id: "crypF",
                            action: "https://www.coinpayments.net/index.php",
                            method: "post",
                            target: "_blank",
                            ref: "crypto"
                        },
                        React.createElement("input", {
                            type: "hidden",
                            name: "cmd",
                            value: "_pay_simple"
                        }),
                        React.createElement("input", { type: "hidden", name: "reset", value: "1" }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "first_name",
                            value: "anonymous"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "last_name",
                            value: "anonymous"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "email",
                            value: "anonymous@cyberfear.com"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "merchant",
                            value: app.defaults.get("coinMecrh")
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "item_amount",
                            value: this.state.howMuch
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "item_name",
                            value: this.state.forPlan
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "item_desc",
                            value: this.state.forPlan
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "custom",
                            value: app.user.get("userId")
                        }),
                        React.createElement("input", { type: "hidden", name: "currency", value: "USD" }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "amountf",
                            value: this.state.toPay
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "want_shipping",
                            value: "0"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "success_url",
                            value: "https://cyberfear.com/api/Pe"
                        }),
                        React.createElement("input", {
                            type: "hidden",
                            name: "cancel_url",
                            value: "https://cyberfear.com/api/Pe"
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right alias-email upgrade-plan" },
                    React.createElement(RightTop, null)
                )
            );
        }
    });
});