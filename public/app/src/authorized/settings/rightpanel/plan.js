define([
    "react",
    "app",
    "accounting",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, accounting, RightTop) {
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
                howMuch: 0,
                paymentVersion: 0,
                currentPlan: 0,
                setWarning: false,
                paym: "",
                stripeId: "",
                planTab:[],
                duration:app.user.get("userPlan")['paymentVersion']==3?app.user.get("userPlan")['period']:"1 month",
                planSelector:app.user.get("userPlan")['paymentVersion']==3?app.user.get("userPlan")['planSelected']:"free",
                subStripeStatus:app.user.get("userPlan")['subStripeStatus'],

                initialPeriod:app.user.get("userPlan")['period'],
                PlanButton:true,
                //selectedPaymentOption: "subscription",
                selectedPaymentOption:app.user.get("userPlan")['subStripeStatus']=="active"||app.user.get("userPlan")['subStripeStatus']=="cancelled"||app.user.get("userPlan")['planSelected']=="free"?"subscription":"one-time",

            };
        },

        handleClick: async function (i,id=null) {
            switch (i) {
                case "choosePlan":
                    if(app.user.get("userPlan")['paymentVersion']==2){
                        console.log('need upgrade');
                    }else{
                        console.log('new version');
                    }
                    console.log('plan is:')
                    var price=0;
                    var planList=app.user.get("userPlan")['planList'];
                    var planPrice=planList[this.state.planSelector]['price'];
                    var planDiscount=this.state.duration=="2 years"?app.user.get("userPlan")['planList'][this.state.planSelector]['2ydisc']:this.state.duration=="1 year"?
                        app.user.get("userPlan")['planList'][this.state.planSelector]['1ydisc']:0;
                    var totalDiscount=(planDiscount+app.user.get("userPlan")['inviteDiscount'])/100;
                    var paidOver=app.user.get("userPlan")['currentPlanBalance'];
                    var monthMult=this.state.duration=="2 years"?24:this.state.duration=="1 year"?12:1;

                    price=((planPrice-planPrice*totalDiscount)*monthMult)-paidOver-app.user.get("userPlan")['alrdPaid']+app.user.get("userPlan")['balanceUsedInPlan'];
                    var priceNoBalance=((planPrice-planPrice*totalDiscount)*monthMult);
                    var discount=priceNoBalance-price;
                    // alert('planPrice: ' + priceNoBalance);
                    // alert('price to pay: ' + price);
                    // alert('discount: ' + discount);
                    console.log(price);

                    price=(price+app.user.get("userPlan")['balance'])/100;
                    discount=(discount)/100;
                    priceNoBalance=(priceNoBalance)/100;
                    if(price<=0){
                        console.log('we can proceed');
                        if (this.state.selectedPaymentOption == "subscription") {
                            this.setState({
                                price:accounting.formatMoney(0,"",2),
                                planPrice:accounting.formatMoney(planPrice,"",2),
                                discount:accounting.formatMoney(priceNoBalance,"",2),
                                PaymentDescr:this.state.duration,
                                recurring: recurring,
                            }, () => {
                                // This callback runs after the state has been updated
                                this.handleClick('showSecond');
                            });
                        } else if (app.user.get("userPlan")['subStripeStatus']=="active") {
                            alert("Please cancel your subscription first by clicking 'Manage Subscription' button");
                        } else {
                            this.handleClick('savePlan');
                        }
                    }else{
                        this.setState({
                            price:accounting.formatMoney(price,"",2),
                            planPrice:accounting.formatMoney(planPrice,"",2),
                            discount:accounting.formatMoney(discount,"",2),
                            PaymentDescr:this.state.duration
                        })
                        this.handleClick('showSecond');
                    }
                    break;
                case "savePlan":

                    var thisComp=this;
                   // console[].log(this.state);
                    var post={};
                    post["planSelector"] = this.state.planSelector;
                    post["period"] = this.state.duration;


                    app.serverCall.ajaxRequest('savePlan', post, function (result) {

                        if (result['response'] == "success") {
                            app.notifications.systemMessage('saved');
                            thisComp.presetValues();
                            thisComp.handleClick('showFirst');
                            //thisComp.presetValues();
                            //thisComp.setState({
                            //    boxBy:"",
                            //    boxButtonText:""
                            //});

                        }else if(result['response'] == "fail" && result['data']=="insBal"){

                        }else if(result['response'] == "fail" && result['data']=="failToSave"){

                        }
                    });
                    break;
                case "selectPeriod":

                    console.log(id);

                    this.setState({
                        duration: id,
                    });
                    break;
                case "manageSubscription":
                    app.stripeCheckOut.generateStripePortalUrl(this);
                    break;
                    console.log(id);

                    this.setState({
                        duration: id,
                    });
                    break;
                case "selectPlan":
                    //console.log('pressed');

                    //console.log(event.target.id);
                    //console.log(this.state.duration);
                    // check if can upgrade
                    //+1 check bsize
                    //+2 check aliases
                    //+3 check disposable
                    //+4 check customd domains

                    var alDis=app.globalF.getAliasDisposableCount();
                    console.log(app.globalF.getAliasDisposableCount());

                    if(alDis['aliases']-1>app.user.get("userPlan")["planList"][event.target.id]["alias"]){
                        $("#infoModHeader").html("");
                        $("#infoModBody").html(
                            "Please delete extra aliases to select this plan."
                        );
                        $("#infoModal").modal("show");
                    }else if(alDis['disposable']>app.user.get("userPlan")["planList"][event.target.id]["dispos"]){
                        $("#infoModHeader").html("");
                        $("#infoModBody").html(
                            "Please delete extra disposable aliases to select this plan."
                        );
                        $("#infoModal").modal("show");
                        }else if(app.user.get("mailboxSize")/1000/1000>app.user.get("userPlan")["planList"][event.target.id]["bSize"]){
                        $("#infoModHeader").html("");
                        $("#infoModBody").html(
                            "Your mailbox is too full to select this plan."
                        );
                        $("#infoModal").modal("show");
                    }else if(Object.keys(app.user.get("customDomains")).length>app.user.get("userPlan")["planList"][event.target.id]["cDomain"]){
                        $("#infoModHeader").html("");
                        $("#infoModBody").html(
                            "Please delete extra custom domains to select this plan."
                        );
                        $("#infoModal").modal("show");
                    }else{
                        this.setState({
                            planSelector: event.target.id,
                            initialPeriod:this.state.duration,
                            PlanButton:false
                        });
                    }



                    break;

                case "upgradeMember":
                    var thisComp = this;
                    planButtonStatus = false;
                    // alert("thisComp.planSelector: " + this.state.planSelector);
                    // alert("userPlan planSelected: " + app.user.get("userPlan")["planSelected"]);
                    if (this.state.planSelector == app.user.get("userPlan")["planSelected"]) {
                        planButtonStatus = true;
                    }
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        firstTab: "",
                        secondTab: "",
                        secondPanelClass: "panel-body d-none",
                        thirdTab: "active",
                        thirdPanelClass: "panel-body",
                        PlanButton:planButtonStatus,
                       // duration:"1 month",
                      //  planSelector:"free",

                    });

                  /*  thisComp.setState({
                        toPay:
                            app.user.get("userPlan")["yearSubscr"] / 100 +
                            app.user.get("userPlan")["balance"],
                        forPlan: "UpgradeToYear",
                        howMuch: 1,
                    });
                    thisComp.handleClick("showSecond");*/
                    break;

                case "fill":
                    var amnt=0;
                    var duration="";
                    var plan="";
               /*  if(!app.user.get("userPlan")["needRenew"]){
                     amnt=accounting.formatMoney((app.user.get("userPlan")["renewAmount"]-app.user.get("userPlan")["currentPlanBalance"]-app.user.get("userPlan")["alrdPaid"])/100,"");
                 }else{
                     amnt=accounting.formatMoney((app.user.get("userPlan")["renewAmount"])/100,"");
                 }*/
                    if(app.user.get("userPlan")["paymentVersion"]==2 && app.user.get("userPlan")["planSelected"]!=3 && !app.user.get("userPlan")["needRenew"]){
                        price=(app.user.get("userPlan")["renewAmount"]-app.user.get("userPlan")["currentPlanBalance"]-app.user.get("userPlan")["alrdPaid"])/100;
                    }
                    if(app.user.get("userPlan")["paymentVersion"]==2 && app.user.get("userPlan")["planSelected"]!=3 && app.user.get("userPlan")["needRenew"]){
                        price=(app.user.get("userPlan")["renewAmount"]-app.user.get("userPlan")["currentPlanBalance"])/100;
                    }else if(app.user.get("userPlan")["paymentVersion"]==3 && app.user.get("userPlan")["planSelected"]!="free"){
                        price=app.user.get("userPlan")["renewAmount"]/100;
                    }


                    if(app.user.get("userPlan")["paymentVersion"]==2){
                        duration=app.user.get("userPlan")["planSelected"]==1?"1 year":"1 month";
                        plan=app.user.get("userPlan")["planSelected"]==1?"Old Yearly":"Old Monthly";
                    }else{
                        duration=app.user.get("userPlan")["period"];
                        plan=app.user.get("userPlan")["planSelected"];
                    }

                    this.setState({
                        price:price<1?1:accounting.formatMoney(price,""),
                        planSelector:plan,
                        duration:duration,
                        PaymentDescr:"refill"
                    },function(){
                       // console.log(amnt);
                    });

                    this.handleClick("showSecond");
                    break;

                case "renew":
                    //var thisComp = this;
                    this.setState({
                        price:accounting.formatMoney(app.user.get("userPlan")["renewAmount"]/100,""),
                        planSelector:app.user.get("userPlan")["planSelected"],
                        duration:app.user.get("userPlan")["period"],
                        PaymentDescr:app.user.get("userPlan")["period"]
                    },function(){
                        console.log(this.state);
                    });

                    this.handleClick("showSecond");
                    break;


                case "payEnough":
                    var thisComp = this;
                    thisComp.setState({
                        toPay:
                            app.user.get("userPlan")["priceFullProrated"] +
                            app.user.get("userPlan")["balance"],
                        forPlan: "Missing Balance",
                        howMuch: 1,
                    });
                    thisComp.handleClick("showSecond");

                    break;

                case "showFirstIfMob":
                    if(app.mailMan.get("webview")){

                    }else{
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
                            paym: "",
                        });
                    }
                    break;

                case "showFirst":
                    //{this.state.planSelector+" plan "+ this.state.type +" for " + this.state.duration}
                    console.log(this.state.planSelector);
                    console.log(this.state.duration)
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
                        paym: "",
                    });

                    break;

                case "showSecond":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        firstTab: "",

                        secondTab: "active",
                        secondPanelClass: "panel-body",

                        thirdTab: "",
                        thirdPanelClass: "panel-body d-none",
                    });
                    break;

                case "showThird":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        firstTab: "",
                        secondTab: "",
                        secondPanelClass: "panel-body d-none",
                        thirdTab: "active",
                        thirdPanelClass: "panel-body",
                    });
                    break;
                case "newPlan":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        firstTab: "",
                        secondTab: "",
                        secondPanelClass: "panel-body d-none",
                        thirdTab: "active",
                        thirdPanelClass: "panel-body",
                        duration:"1 month",
                        planSelector:"free",

                    });
                    break;

                case "stripe":
                    var recurring = this.state.selectedPaymentOption == "subscription" ? 1 : 0;
                    this.setState({
                        recurring: recurring,
                    }, () => {
                        // This callback runs after the state has been updated
                        app.stripeCheckOut.generateStripeCheckoutUrl(this);
                    });
                    break;
                case "payPal":
                    var thisComp = this;

                    thisComp.setState({
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
                                                        value: thisComp.state.price,
                                                        currency_code:"USD",
                                                        breakdown:{
                                                            item_total:{
                                                                currency_code: "USD",
                                                                value: thisComp.state.price
                                                            }
                                                        }
                                                    },
                                                    items:[
                                                        {
                                                            name:thisComp.state.planSelector +' plan',
                                                            description: thisComp.state.PaymentDescr,
                                                            unit_amount:{
                                                                currency_code:"USD",
                                                                value:thisComp.state.price
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
                                                alert("Thank you.");
                                                thisComp.handleClick.bind(
                                                    thisComp,
                                                    "showFirst"
                                                );
                                            });
                                    },
                                })
                                .render("#paypal-button-container");
                        })
                        .catch(function () {
                            //self.setState({'status': 'error'});
                        });

                    break;

                case "showDetail":
                    this.setState({
                        detailVisible: "",
                        detailButtonVisible: "d-none",
                        //firstPanelClass:"panel-body hidden",
                        //secondPanelClass:"panel-body"
                    });
                    break;

                case "pay":
                    //$('#bitcoinModal').modal('show');

                    break;
            }
        },

        createPlanTab:(that)=>{
            let entry=[];
           var thisComp=that;

            var planList=app.user.get("userPlan")['planList'];
            //console.log(planList);
            var slog={
                free:"Try us",
                basic:"For users emailing occasionally",
                medium:"Users using email daily",
                pro:"Best in class"
            }

           Object.keys(planList).forEach(function(key) {

               if (key != "Old Yearly" && key != "Old Monthly" && key != "Old Free") {

               var price = 0;
               if (thisComp.state.duration == "2 years") {
                   price = (planList[key]['price'] - planList[key]['price'] * (app.user.get("userPlan")['planList'][key]['2ydisc'] + app.user.get("userPlan")['inviteDiscount']) / 100) / 100;
                   // console.log(app.user.get("userPlan")['planList'][key]['2ydisc']+app.user.get("userPlan")['discountApplied']);

               } else if (thisComp.state.duration == "1 year") {
                   price = (planList[key]['price'] - planList[key]['price'] * (app.user.get("userPlan")['planList'][key]['1ydisc'] + app.user.get("userPlan")['inviteDiscount']) / 100) / 100;
               } else {
                   price = (planList[key]['price'] - (planList[key]['price'] * app.user.get("userPlan")['inviteDiscount']) / 100) / 100;

               }

              // console.log(key);
              // console.log(planList[key]['price'] * app.user.get("userPlan")['discountApplied']);
              // console.log(thisComp.state.duration);

               price = accounting.formatMoney(price);


               //  console.log(app.user.get("userPlan")['planSelected'],app.user.get("userPlan")['period']);
               // console.log(thisComp.state.period,thisComp.state.selectedPlan);
               // console.log(thisComp.state.period!="1 month" && key=='free');
               //checked={thisComp.state.selectedPlan==key && thisComp.state.initialPeriod==thisComp.state.period}
               entry.push(
                   <div className={(thisComp.state.duration != "1 month" && key == 'free') ? "d-none" : "radio-box"}>
                       <input
                           type="radio"
                           className="btn-check"
                           key={key}
                           name="plan"
                           id={key}
                           value={key}
                           autoComplete="off"
                           onChange={thisComp.handleClick.bind(
                               null,
                               "selectPlan"
                           )}
                           disabled={app.user.get("userPlan")['planSelected'] == key && app.user.get("userPlan")['period'] == thisComp.state.duration}
                           checked={thisComp.state.planSelector == key && thisComp.state.initialPeriod == thisComp.state.duration}
                       />
                       <label
                           className="btn btn-outline-primary"
                           htmlFor={key}
                       >
                           {" "}
                           <span className="dot"></span>{" "}
                           <span
                               className={app.user.get("userPlan")['planSelected'] == key && app.user.get("userPlan")['period'] == thisComp.state.duration ? "plan-name font-weight-bold" : "plan-name"}>
                                                                    {key}
                                                                </span>{" "}
                           <span className="plan-text">
                               {app.user.get("userPlan")['planSelected'] == key && app.user.get("userPlan")['period'] == thisComp.state.duration ? "Current plan" : slog[key]}

                                                                </span>{" "}
                           <span className="plan-price">
                                                                    {price}{" "}
                               <span className="duration">
                                                                        / Month
                                                                    </span>
                                                                </span>{" "}
                       </label>
                   </div>
               );
           }
           })
            return entry;
        },
        handleChange: function (i, event) {
            var thisComp = this;
            console.log('pressed11');
            switch (i) {

                case "selectPlan":

                    console.log('pressed');

                    console.log(event.target);

                  //  this.setState({
                  //      selectedPlan: event.target.value,
                  //  });
                    break;
                //this.calculateNewPrice();
            }
        },

        handlePaymentOptionChange(optionId) {
          this.setState({ selectedPaymentOption: optionId });
        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
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

                var dateStarted = new Date(
                    currentPlan["created"] * 1000
                ).getTime();


                if (
                    app.user.get("userPlan")["pastDue"] == 1 &&
                    app.user.get("userPlan")["priceFullProrated"] > 0
                ) {
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

                    //isAlrdClaimed:currentPlan['creditUsed'],

                    cycleEnd: timeEnd.toLocaleDateString(),
                    cycleStart: timeStart.toLocaleDateString(),
                });

                // setTimeout(function(){
                //     thisComp.calculateNewPrice();
                // },100);
            });
        },

        componentDidMount: function () {
            var thisComp = this;

           // this.presetValues();
            app.user.on(
                "change:userPlan",
                function () {
                    this.setState({
                        boxButtonText: "",
                        domButtonText: "",
                        alButtonText: "",
                        boxBy: "",
                        boxWarning: "",
                        domWarning: "",
                        alWarning: "",
                        boxSize: app.user.get("userPlan")["planData"]["bSize"],
                        cDomain:
                            app.user.get("userPlan")["planData"]["cDomain"],
                        aliases: app.user.get("userPlan")["planData"]["alias"],
                        duration:app.user.get("userPlan")["period"],
                    });
                },
                this
            );
            console.log(app.user.get("userPlan"))
          //  this.createPlanTab();
        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
        },

        accountDataTable: function () {
            var options = [];
            var toP = accounting.formatMoney(
                app.user.get("userPlan")["priceFullProrated"] +
                    app.user.get("userPlan")["balance"],
                "$",
                2
            );
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

            if (app.user.get("userPlan")["pastDue"] == 1) {
                ys = "UNPAID";
            } else {
                ys = "PAID";
            }

            //what button to show
            //if pastdue and alrdpaid=0 then renew
            //if pastdue and alrd paid then missing balance

            var price=0;
            if(app.user.get("userPlan")["paymentVersion"]==2 && app.user.get("userPlan")["planSelected"]!=3 && !app.user.get("userPlan")["needRenew"]){
                price=(app.user.get("userPlan")["renewAmount"]-app.user.get("userPlan")["currentPlanBalance"])/100;

            }if(app.user.get("userPlan")["paymentVersion"]==2 && app.user.get("userPlan")["planSelected"]!=3 && app.user.get("userPlan")["needFill"]){
                price=(app.user.get("userPlan")["renewAmount"]-app.user.get("userPlan")["currentPlanBalance"]-app.user.get("userPlan")["alrdPaid"])/100;
            } if(app.user.get("userPlan")["paymentVersion"]==2 && app.user.get("userPlan")["planSelected"]!=3 && app.user.get("userPlan")["needRenew"]){
                price=(app.user.get("userPlan")["renewAmount"]-app.user.get("userPlan")["currentPlanBalance"])/100;
            }else if(app.user.get("userPlan")["paymentVersion"]==3 && app.user.get("userPlan")["planSelected"]!="free"){
                price=app.user.get("userPlan")["renewAmount"]/100;
            }
            options.push(
                <div className="information-table-row" key="1a">
                    <label>{app.user.get("userPlan")["needFill"]?"Balance Due:":"Balance Due at renewal:"}</label>
                    <div className="information-row-right">
                        <b>{accounting.formatMoney(price<0?0:price,"$",2)}</b> {price<1?"(min. charge $1)":""}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="3b">
                    <label>Balance Credit:</label>
                    <div className="information-row-right">
                        <b>{accounting.formatMoney(
                            app.user.get("userPlan")["currentPlanBalance"]/100
                        )}</b>
                    </div>
                </div>
            );

          /* accounting.formatMoney(app.user.get("userPlan")["truePriceFullProrated"],"")
           options.push(
                <div className="information-table-row" key="1b">
                    <label>Period Start date:</label>
                    <div className="information-row-right">
                        <b>{new Date(
                            app.user.get("userPlan")["cycleStart"] * 1000
                        ).toLocaleDateString()}</b>
                    </div>
                </div>
            );*/

            options.push(
                <div className="information-table-row" key="1c">
                    <label>Period Start date:</label>
                    <div className="information-row-right">
                        <b>{new Date(
                            app.user.get("userPlan")["cycleStart"] * 1000
                        ).toLocaleDateString()}</b>
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="1cc">
                    <label>Period End date:</label>
                    <div className="information-row-right">
                        <b>{new Date(
                            app.user.get("userPlan")["cycleEnd"] * 1000
                        ).toLocaleDateString()}</b>
                    </div>
                </div>
            );
            options.push(
                <div className="information-table-row" key="1cs">
                    <label>Period Length:</label>
                    <div className="information-row-right">
                        <b>{(app.user.get("userPlan")["cycleEnd"]-app.user.get("userPlan")["cycleStart"]>51536000)?"2 years":app.user.get("userPlan")["cycleEnd"]-app.user.get("userPlan")["cycleStart"]>=31536000?"1 year":"1 month"}</b>
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="1cd">
                    <label>Status:</label>
                    <div className="information-row-right">
                        <b>{ys}</b>
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="2c">
                    <label>
                        Paid This Cycle:
                    </label>
                    <div className="information-row-right">
                        <b>{accounting.formatMoney(
                            app.user.get("userPlan")["alrdPaid"]/100
                        )}</b>
                    </div>
                </div>
            );

            //if(app.user.get("userPlan")['balance']>0){
            options.push(
                <div
                    key="3a"
                    className={
                        app.user.get("userPlan")["balance"] == 0 ? "d-none" : "information-table-row"
                    }
                >
                    <label>Previous Unpaid Balance:</label>
                    <div className="information-row-right">
                        <b>{accounting.formatMoney(
                            app.user.get("userPlan")["balance"]/100
                        )}</b>
                    </div>
                </div>
            );


            options.push(
                <div className="information-table-row" key="3c">
                    <label>Rewards:</label>
                    <div className="information-row-right">
                        <b>{accounting.formatMoney(
                            app.user.get("userPlan")["rewardCollected"]/100,
                            "$",
                            3
                        )}</b>
                    </div>
                </div>
            );

            //}

            return options;
        },
        planTable: function () {
            var options = [];

            //Mailbox Size
            var boxDif = "";
            var bxS = this.state.newboxSize;

            if (this.state.newboxSize != this.state.boxSize) {
                boxDif =
                    " => " + (bxS > 1000 ? bxS / 1000 + " Gb" : bxS + " MB");
            }
            options.push(
                <div className="information-table-row" key="1a">
                    <label>Plan Name:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planSelected"]==2?"Old Monthly Plan":app.user.get("userPlan")["planSelected"]==3?"Old Free Plan":app.user.get("userPlan")["planSelected"]==1?"Old Yearly Plan":app.user.get("userPlan")["planSelected"]}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="1">
                    <label>Mailbox Size:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planData"]["bSize"] >= 1000
                            ? app.user.get("userPlan")["planData"]["bSize"] /
                                  1000 +
                              " Gb"
                            : app.user.get("userPlan")["planData"]["bSize"] +
                              " MB"}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="2">
                    <label>Custom Domain:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planData"]["cDomain"]}
                    </div>
                </div>
            );

            var alDif = "";
            if (this.state.newaliases != this.state.aliases) {
                var alDif = " => " + this.state.newaliases;
            }
            options.push(
                <div className="information-table-row" key="3">
                    <label>Custom Aliases:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planData"]["alias"]}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="4">
                    <label>Disposable emails:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planData"]["dispos"]}
                    </div>
                </div>
            );
            options.push(
                <div className="information-table-row" key="5">
                    <label>Sending Limits:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planData"]["sendLimits"]} / hour
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="6">
                    <label>Recipient Per Mail:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["planData"]["recipPerMail"]}
                    </div>
                </div>
            );

            return options;
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

        getPlansDataPost: function () {
            var post = {
                planSelector: this.state.planSelector,
                howMuch: this.state.howMuch,
            };
            return post;
        },

        render: function () {
            var classFullSettSelect = "col-xs-12";
            var barWidth=(accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024,2) * 100) /app.user.get("userPlan")["planData"]["bSize"];
            var st3 = barWidth>100?100:barWidth;
            const paymentOptions = [
              { id: "one-time", label: "One-time" },
              { id: "subscription", label: "Subscription" },
            ];
            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle upgrade-plan">
                        <div className="middle-top">
                            <h2>Plan</h2>
                        </div>
                        <div className="middle-content">
                            <div className="mid-nav">
                                <ul>
                                    <li
                                        role="presentation"
                                        className={this.state.firstTab}
                                    >
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                "showFirst"
                                            )}
                                        >
                                            Features
                                        </a>
                                    </li>
                                    <li
                                        role="presentation"
                                        className={this.state.secondTab}
                                    >
                                        <a
                                            className={
                                                this.state.secondTab == "active"
                                                    ? ""
                                                    : "d-none"
                                            }
                                        >
                                            Pay Now
                                        </a>
                                    </li>
                                    <li
                                        role="presentation"
                                        className={this.state.thirdTab}
                                    >
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                "showThird"
                                            )}
                                        >
                                            Plans
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className={this.state.firstPanelClass}>
                                <div className="middle-content-top">
                                    <h3
                                        className={
                                            ((app.user.get("mailboxSize") / 1024 / 1024/1024)> (app.user.get("userPlan")["planData"]["bSize"]/1000))? "txt-color-red"
                                                : "d-none"
                                        }
                                    >
                                        Your mailbox is full, please consider upgrading your account or delete unwanted emails.<br/><br/>
                                    </h3>


                                    <h3
                                        className={
                                            app.user.get("userPlan")[
                                                "pastDue"
                                            ] === 1
                                                ? "txt-color-red"
                                                : "d-none"
                                        }
                                    >
                                        Pay your balance to send and
                                        receive emails. Your email functionality
                                        is limited to access to previous emails
                                        only.<br/><br/>
                                    </h3>

                                    <h3
                                        className={
                                            app.user.get("userPlan")[
                                                "needRenew"
                                            ]
                                                ? "txt-color-red mb-2"
                                                : "d-none"
                                        }
                                    >
                                        Renew your service soon to avoid
                                        service interruption. Your email
                                        functionality will be limited to access
                                        to previous emails only.<br/><br/>
                                    </h3>
                                </div>
                                <div className="upgrade-details-top">
                                <div className="row">
                                    <div className="upgrade-details-left">
                                        <div className="top-row">
                                            <div className="row">
                                                <div className="col-5">
                                                    <div className="plan-details">
                                                        <span className="icon-plan">
                                                            {app.user.get("userPlan")["paymentVersion"]==2?(app.user.get("userPlan")["planSelected"]==1?"Old Yearly ":app.user.get("userPlan")["planSelected"]==2?"Old Monthly ":"Old Free "):app.user.get("userPlan")["planSelected"]}
                                                        </span>{" "}
                                                        Plan
                                                    </div>
                                                </div>
                                                <div className={app.user.get("userPlan")["paymentVersion"]==2?"col-7":"d-none"}>
                                                    <div className="pricing">
                                                        <sup>$</sup>
                                                        <span>{accounting.formatMoney(app.user.get("userPlan")["trueMonthPrice"]/100,"")}</span>
                                                        <sup className="sup-opacity">
                                                            / Month
                                                        </sup>
                                                    </div>
                                                </div>

                                                <div className={app.user.get("userPlan")["paymentVersion"]==3?"col-7":"d-none"}>
                                                    <div className="pricing">
                                                        <sup>$</sup>
                                                        <span>{accounting.formatMoney(app.user.get("userPlan")["truMonthCharge"]/100,"")}</span>
                                                        <sup className="sup-opacity">
                                                            / Month
                                                        </sup>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bottom-row">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="storage">
                                                        <div className="storage-count">
                                                            {accounting.toFixed(
                                                                app.user.get(
                                                                    "mailboxSize"
                                                                ) /
                                                                    1024 /
                                                                    1024/
                                                                1024,
                                                                3
                                                            )}{" "}
                                                            GB{" "}
                                                            <span>
                                                                /{" "}
                                                                {app.user.get(
                                                                    "userPlan"
                                                                )["planData"][
                                                                    "bSize"
                                                                ] / 1000}{" "}
                                                                GB
                                                            </span>
                                                        </div>
                                                        <div className="storage-bar">
                                                            <span style={{width:st3+"%"}}></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div
                                                        className={
                                                            (app.user.get(
                                                                "userPlan"
                                                            )["planSelected"] ==
                                                                2 ||
                                                                app.user.get(
                                                                    "userPlan"
                                                                )[
                                                                    "planSelected"
                                                                ] == 3) &&
                                                            app.user.get(
                                                                "userPlan"
                                                            )["pastDue"] !== 1
                                                                ? "txt-color-red"
                                                                : "d-non"
                                                        }
                                                        style={{
                                                            marginBottom:
                                                                "20px",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={app.user.get("userPlan")["paymentVersion"]==2 ?"btn-blue":"d-none"}
                                                            onClick={this.handleClick.bind(this,"newPlan")}
                                                        >
                                                            Purchase new plan
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={app.user.get("userPlan")["paymentVersion"]==3?"btn-blue":"d-none"}
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "upgradeMember"
                                                            )}
                                                        >
                                                            Select new plan
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={app.user.get("userPlan")["planSelected"]=="free" || app.user.get("userPlan")["planSelected"]=="3"?"d-none":"upgrade-details-right"}>
                                        <div className="title">
                                            {app.user.get("userPlan")["subStripeStatus"] == null ? "One-time payment, expires on" : "Next payment"}
                                        </div>

                                        <div className="date mb-3">
                                            {app.user.get("userPlan")["subStripeStatus"] === "cancelled" ? (
                                                "Subscription Cancelled"
                                            ) : app.user.get("userPlan")["subStripeStatus"] === "deleted" ? (
                                                "Subscription Deleted"
                                            ) : (
                                                "on " +
                                                new Date(
                                                    app.user.get("userPlan")["cycleEnd"] * 1000
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                            )}
                                        </div>


                                        <button
                                            type="button"
                                            className={app.user.get("userPlan")["needRenew"]||app.user.get("userPlan")["pastDue"]?"btn-border mb-3":"d-none"}
                                            onClick={this.handleClick.bind(this,"fill")}
                                        >

                                            {app.user.get("userPlan")["needRenew"]?"Renew":app.user.get("userPlan")["pastDue"]?"Fill Balance":""}
                                        </button>
                                        <button
                                            type="button"
                                            className={app.user.get("userPlan")['subStripeStatus']?"btn-border":"d-none"}
                                            onClick={this.handleClick.bind(
                                                null,
                                                "manageSubscription"
                                            )}
                                        >
                                            Manage Subscription
                                        </button>
                                    </div>
                                    </div>
                                </div>

                                <div className="upgrade-details-bottom">
                                    <div className="accordion">
                                        <div className="accordion-item">
                                            <h2
                                                className="accordion-header"
                                                id="plan-details-account"
                                            >
                                                <button
                                                    type="button"
                                                    className="accordion-button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#plan-details-account-collapse"
                                                    aria-expanded="true"
                                                    aria-controls="plan-details-account-collapse"
                                                >
                                                    Account:
                                                    <span className="icon"></span>
                                                </button>
                                            </h2>
                                            <div
                                                id="plan-details-account-collapse"
                                                className="accordion-collapse collapse show"
                                                aria-labelledby="plan-details-account"
                                                data-bs-parent="#plan-details-account-data"
                                            >
                                                <div className="accordion-body">
                                                    <div className="form-section">
                                                        <div className="information-table">
                                                            {this.accountDataTable()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="float-none"></div>
                                        <div className="accordion-item">
                                            <h2
                                                className="accordion-header"
                                                id="plan-details-current-features"
                                            >
                                                <button
                                                    type="button"
                                                    className="accordion-button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#plan-details-current-features-collapse"
                                                    aria-expanded="true"
                                                    aria-controls="plan-details-current-features-collapse"
                                                >
                                                    Your current plan have
                                                    following features:
                                                    <span className="icon"></span>
                                                </button>
                                            </h2>
                                            <div
                                                id="plan-details-current-features-collapse"
                                                className="accordion-collapse collapse show"
                                                aria-labelledby="plan-details-current-features"
                                                data-bs-parent="#plan-details-current-features-data"
                                            >
                                                <div className="accordion-body">
                                                    <div className="table-row">
                                                        <div className="table-responsive">
                                                            <div className="information-table">
                                                                {this.planTable()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="float-none"></div>
                                    </div>
                                </div>
                            </div>

                            <div className={this.state.secondPanelClass + " container"}>
                                <h3 className="d-none">Payment</h3>

                                {/* <div className="btn-row btn-group"> */}
                                <div className="btn-row d-sm-flex d-xs-flex">
                                    {/*<button type="submit" className="btn btn-primary" onClick={this.handleClick.bind(this, 'payPal')}>Pay With PayPal</button>*/}
                                    <button
                                        type="button"
                                        className="btn-border fixed-width-btn col-sm mx-1"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "showFirst"
                                        )}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        //className="btn-blue fixed-width-btn"
                                        className={this.state.selectedPaymentOption == "subscription"? "d-none":"btn-blue fixed-width-btn col-sm mx-1"}
                                        form="crypF"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "showFirstIfMob"
                                        )}
                                    >
                                        CoinPayments
                                    </button>
                                    <button
                                        type="submit"
                                        className={this.state.selectedPaymentOption == "subscription"? "d-none":"btn-blue fixed-width-btn col-sm mx-1 d-none"}
                                        form="perfF"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "showFirst"
                                        )}
                                    >
                                        Perfect Money
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-blue fixed-width-btn col-sm mx-1"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "stripe"
                                        )}
                                    >
                                        Stripe (Credit / Debit Card)
                                    </button>
                                    <button type="submit"
                                        className={this.state.selectedPaymentOption == "subscription"? "d-none":"btn-blue fixed-width-btn col-sm mx-1"}
                                        onClick={this.handleClick.bind(
                                            this,
                                            "payPal"
                                        )}
                                    >
                                        PayPal
                                    </button>
                                </div>

                                <div className="float-none"></div>
                                <div
                                //className="info-text"
                                className={this.state.selectedPaymentOption == "subscription"? "d-none":"info-text"}
                                >
                                    Info: It may take some time to reflect new
                                    balance after successfull payment. <br /> If
                                    you pay with bitcoin, make sure you enter
                                    exact amount you are willing to pay,
                                    otherwise it may be marked as mispayment.
                                </div>

                                <div className="float-none"></div>

                                <div
                                    className={
                                        this.state.paym == "paypal"
                                            ? ""
                                            : "d-none"
                                    }
                                    id="paypal-button-container"
                                ></div>
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
                                        this.state.selectedPaymentOption == "subscription"? "info-text":"d-none"
                                    }
                                    id="stripe-container"
                                >
                                <p>Subscriptions can be paid via Stripe only. If you wish to pay via Crypto Currency, select one-time payment.</p>
                                </div>
                            </div>

                            <div className={this.state.thirdPanelClass}>
                                <h3>Choose a Plan:</h3>
                                <p className="f12">
                                    Simple pricing. No hidden fees. Advanced
                                    features.
                                </p>
                                <div className="tab-section">
                                    <ul
                                        className="nav nav-tabs mb-2"
                                        id="myTab"
                                        role="tablist"
                                    >
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <button
                                                className={this.state.duration=="1 month"?"nav-link active":"nav-link"}
                                                id="monthly-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#monthly"
                                                type="button"
                                                role="tab"
                                                value="1 month"
                                                aria-controls="Monthly"
                                                aria-selected={this.state.duration=="1 month"?true:false}
                                                onClick={this.handleClick.bind(null,'selectPeriod',"1 month")}
                                            >
                                                Monthly
                                            </button>
                                        </li>
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <button
                                                className={this.state.duration=="1 year"?"nav-link active":"nav-link"}
                                                id="year-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#monthly"
                                                type="button"
                                                value="1 year"
                                                role="tab"
                                                aria-controls="year"
                                                aria-selected={this.state.duration=="1 year"?true:false}
                                                onClick={this.handleClick.bind(null,'selectPeriod',"1 year")}
                                            >
                                                <strong>1 Year</strong>
                                                <span className="low-opacity">
                                                    {"Save "+app.user.get("userPlan")["planList"]['basic']["1ydisc"]+"%"}
                                                </span>
                                            </button>
                                        </li>
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <button
                                                className={this.state.duration=="2 years"?"nav-link active":"nav-link"}
                                                id="year-2-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#monthly"
                                                type="button"
                                                value="2 years"
                                                role="tab"
                                                aria-controls="year-2"
                                                aria-selected={this.state.duration=="2 years"?"true":"false"}
                                                onClick={this.handleClick.bind(null,'selectPeriod',"2 years")}
                                            >
                                                <strong>2 Years</strong>
                                                <span className="low-opacity">
                                                    {"Save "+app.user.get("userPlan")["planList"]['basic']["2ydisc"]+"%"}
                                                </span>
                                            </button>
                                        </li>
                                    </ul>

                                    <ul className="nav nav-tabs recurring-tabs" id="paymentOptionTab" role="tablist">
                                      {paymentOptions.map((option, index) => (
                                        <li role="presentation" key={index}>
                                          <button
                                            className={`${
                                              this.state.selectedPaymentOption === option.id ? "nav-link active" : "nav-link"
                                            }`}
                                            id={`${option.id}-tab`}
                                            type="button"
                                            role="tab"
                                            onClick={() => this.handlePaymentOptionChange(option.id)}
                                          >
                                            {option.label}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>

                                    <div
                                        className="tab-content"
                                        id="additional-plans"
                                    >
                                        <div
                                            className="tab-pane fade active show"
                                            id="monthly"
                                            role="tabpanel"
                                            aria-labelledby="monthly-tab"
                                        >
                                            <div className="tab-content-top">
                                                <div className="tab-content-left">
                                                    <div
                                                        className="btn-group"
                                                        role="group"
                                                        aria-label="Basic radio toggle button group"
                                                    >
                                                        {this.createPlanTab(this)}
                                                    </div>
                                                </div>
                                                <div className="tab-content-right">
                                                    <h3>Features:</h3>

                                                    <div className="plan-features">
                                                        <ul>
                                                            <li>

                                                                {app.user.get("userPlan")["planList"][this.state.planSelector]["bSize"]/1000}&nbsp;
                                                                GB Storage
                                                            </li>
                                                            <li>
                                                                {app.user.get("userPlan")["planList"][this.state.planSelector]["sendLimits"]}&nbsp;emails
                                                                /hour sending
                                                                limit
                                                            </li>
                                                            <li className={app.user.get("userPlan")["planList"][this.state.planSelector]["alias"]==0?"not-include":""}>
                                                                {app.user.get("userPlan")["planList"][this.state.planSelector]["alias"]==0?"":app.user.get("userPlan")["planList"][this.state.planSelector]["alias"]}&nbsp;
                                                                Aliases
                                                            </li>
                                                            <li className={app.user.get("userPlan")["planList"][this.state.planSelector]["dispos"]==0?"not-include":""}>
                                                                {app.user.get("userPlan")["planList"][this.state.planSelector]["dispos"]==0?"":app.user.get("userPlan")["planList"][this.state.planSelector]["dispos"]} &nbsp; Disposable
                                                                aliases
                                                            </li>
                                                            <li>{app.user.get("userPlan")["planList"][this.state.planSelector]["recipPerMail"]}&nbsp; Recipient per mail</li>
                                                            <li className={app.user.get("userPlan")["planList"][this.state.planSelector]["cDomain"]==0?"not-include":""}>
                                                                {app.user.get("userPlan")["planList"][this.state.planSelector]["cDomain"]==0?"":app.user.get("userPlan")["planList"][this.state.planSelector]["cDomain"]}&nbsp;
                                                                Custom domain(s)
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-section-bottom">
                                                <div className="compare-plans d-none">
                                                    <button>
                                                        Compare plans
                                                    </button>
                                                </div>
                                                <div className="col-sm-12">
                                                    <button className="btn-blue full-width mt60 mb-2"
                                                            disabled={this.state.PlanButton}
                                                    onClick={this.handleClick.bind(null,'choosePlan')}>
                                                        Choose plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <form
                            className="d-none"
                            id="perfF"
                            action="https://perfectmoney.com/api/step1.asp"
                            method="POST"
                            target="_blank"
                        >
                            <input
                                type="hidden"
                                name="PAYEE_ACCOUNT"
                                value={app.defaults.get("perfectMecrh")}
                            />
                            <input
                                type="hidden"
                                name="PAYEE_NAME"
                                value="Mailum"
                            />
                            <input
                                type="hidden"
                                name="PAYMENT_AMOUNT"
                                value={this.state.price}
                            />
                            <input
                                type="hidden"
                                name="PAYMENT_UNITS"
                                value="USD"
                            />
                            <input
                                type="hidden"
                                name="STATUS_URL"
                                value="https://mailum.com/api/PerfectPaidstatus"
                            />
                            <input
                                type="hidden"
                                name="PAYMENT_URL"
                                value="https://mailum.com/api/Pe"
                            />
                            <input
                                type="hidden"
                                name="PAYMENT_URL_METHOD"
                                value="POST"
                            />
                            <input
                                type="hidden"
                                name="NOPAYMENT_URL"
                                value="https://mailum.com/api/Pe"
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
                                value={this.state.planSelector+" plan"}
                            />

                            <input
                                type="hidden"
                                name="description"
                                value={this.state.PaymentDescr}
                            />
                            <input
                                type="hidden"
                                name="BAGGAGE_FIELDS"
                                value="userId paymentFor description"
                            />
                        </form>

                        <form
                            className="d-none"
                            id="crypF"
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
                            <input type="hidden" name="reset" value="1" />
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
                                name="merchant"
                                value={app.defaults.get("coinMecrh")}
                            />

                            <input
                                type="hidden"
                                name="item_name"
                                value={this.state.planSelector+" plan"}
                            />
                            <input
                                type="hidden"
                                name="item_desc"
                                value={this.state.PaymentDescr}
                            />
                            <input
                                type="hidden"
                                name="custom"
                                value={app.user.get("userId")}
                            />
                            <input type="hidden" name="currency" value="USD" />
                            <input
                                type="hidden"
                                name="amountf"
                                value={this.state.price}
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
                    </div>
                    <div className="setting-right alias-email upgrade-plan">
                        <RightTop />
                    </div>
                </div>
            );
        },
    });
});
