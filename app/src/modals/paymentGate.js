define(['app','accounting', 'react'], function (app, accounting, React) {

    return React.createClass({

        getInitialState: function () {
            return {
                email: "",
                buttonTag: "",
                buttonText: "Create Account",
                paym:"",
                userId:"",
                mCharge:"",
                membr:""
            };
        },

        componentDidMount: function () {
            var thisComp=this;
            app.user.on("change:userPlan",function() {
                // console.log(app.user.get("resetSelectedItems"));

                if(app.user.get("userPlan")['planSelected']==1){
                    var pl='year';
                }else if(app.user.get("userPlan")['planSelected']==2){
                    var pl='month';
                }else if(app.user.get("userPlan")['planSelected']==3){
                    var pl='free';
                }
                thisComp.setState({
                    mCharge:app.user.get("userPlan")['monthlyCharge']-app.user.get("userPlan")['alrdPaid']-app.user.get("userPlan")['currentPlanBalance'],
                    membr:pl
                });
                // $('#selectAll>input').prop("checked",false);
            },thisComp);

                $(".specButton").on({
                    mouseover:function(){
                        $(this).css({
                            left:(Math.random()*450)+"px",
                        });
                    }
                });


        },

        componentWillUnmount: function () {
            app.user.off("change:userPlan");
        },
        setMembership:function(duration){

            var userObj={};

             userObj['planSelector']=duration;
            userObj['userToken']=app.user.get("userLoginToken");

            $.ajax({
                method: "POST",
                url: app.defaults.get('apidomain')+"/SetMembershipPriceV2",
                data: userObj,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                }
            })
                .then(function (msg) {

                    if(msg['response']==='fail'){
                            app.notifications.systemMessage('tryAgain');

                    }else if(msg['response']==='success'){
                        app.userObjects.loadUserPlan(function(){});
                    }

                     //console.log(msg)
                });
        },

        handleChange: function (action, event) {

            switch (action) {
                case 'year':
                    this.setState({
                        membr: "year",
                    });
                    this.setMembership('year');
                    break;
                case 'month':
                    this.setState({
                        membr: "month",
                    });
                    this.setMembership('month');
                    break;

                    case 'free':
                    this.setState({
                        membr: "free",
                    });
                    this.setMembership('free');
                    break;


                case 'perfectm':
                    var thisComp=this;
                    this.setState({
                        paym: "perfectm",
                    });

                    this.setState({
                        userId:app.user.get("userId")
                    });

                    break;
                case 'bitc':
                    var thisComp=this;
                    this.setState({
                        paym: "bitc",
                    });

                    this.setState({
                        userId:app.user.get("userId")
                    });

                    break;
                case 'paypal':
                    var thisComp=this;
                    this.setState({
                        paym: "paypal",
                    });

                    var my_script = thisComp.new_script();

                    var self = this;
                    my_script.then(function() {
                        //self.setState({'status': 'done'});
                        paypal.Buttons({
                            style: {
                                shape: 'rect',
                                color: 'gold',
                                layout: 'vertical',
                                label: 'paypal',

                            },
                            createOrder: function(data, actions) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: thisComp.state.mCharge
                                        },
                                        custom_id:app.user.get("userId"),
                                        description:"NewMembership",
                                        invoice_id:1
                                    }],
                                    application_context:
                                        {
                                            shipping_preference: 'NO_SHIPPING'
                                        }
                                });
                            },
                            onApprove: function(data, actions) {
                                return actions.order.capture().then(function(details) {
                                    //alert('Transaction completed by ' + details.payer.name.given_name + '!');
                                   // alert('done');

                                });
                            }
                        }).render('#paypal-button-container');

                    }).catch(function() {
                        //self.setState({'status': 'error'});
                    })

                    break;

            }
        },

        new_script: function() {
            return new Promise(function(resolve, reject){
                var script = document.createElement('script');
                script.src = 'https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD';
                script.addEventListener('load', function () {
                    resolve();
                });
                script.addEventListener('error', function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
            })
        },

        handleSubmit(event) {

        },
        handleClick: function(action,event) {
            switch(action) {
                case 'pay':
                    if(this.state.paym!=="perfectm"){
                        app.user.set({
                            tempCoin: true
                        });
                    };
                    break;
                case "freemium":

                    $.ajax({
                        method: "POST",
                        url: app.defaults.get('apidomain')+"/activateFreemiumV2",
                        data: {},
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        }
                    })
                        .then(function (msg) {

                            if(msg['response']==='fail'){
                                app.notifications.systemMessage('tryAgain');

                            }else if(msg['response']==='success'){
                                app.userObjects.loadUserPlan(function(){});
                            }

                            //console.log(msg)
                        });

                    break;
            }
        },

        render: function () {
            return (
                <div className="modal fade bs-example-modal-sm" id="makePayment" tabIndex="-1" role="dialog"
                     aria-hidden="true">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="panel panel-default">
                                <div className="panel-body text-center">
                                    {app.defaults.get('name')}
                                    <div className="clearfix"></div>
                                    Anonymous Email Service
                                    <div className="clearfix"></div>
                                    Account Type: Premium
                                    <div className="clearfix"></div>
                                    Amount Due: {accounting.formatMoney(this.state.mCharge)}
                                </div>
                            </div>

                            <div className="panel panel-default">
                                <div className="text-center">Select your Membership:</div>
                                <div className="panel-body">
                                    <div className="form-inline text-center">
                                        <div className="form-group col-lg-offset-0 text-left">
                                            <div className="radio">
                                                <label>
                                                    <input className="margin-right-10" type="radio" name="memberSh" id="optionsR1"
                                                           value="option1"
                                                           checked={this.state.membr=='year'}
                                                           onChange={this.handleChange.bind(this, 'year')} />
                                                    &nbsp;Yearly ($18/year)
                                                </label>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="radio">
                                                <label>
                                                    <input className="margin-right-10" type="radio" name="memberSh" id="optionsR2"
                                                           value="option2"
                                                           checked={this.state.membr=='month'}
                                                           onChange={this.handleChange.bind(this, 'month')} />

                                                    &nbsp;Monthly ($2/month)
                                                </label>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="radio">
                                                <label>
                                                    <input className="margin-right-10" type="radio" name="memberSh" id="optionsR"
                                                           value="option3"
                                                           checked={this.state.membr=='free'}
                                                           onChange={this.handleChange.bind(this, 'free')} />

                                                    &nbsp;Free (Some cool features are disabled)
                                                </label>
                                            </div>
                                        </div>


                                        <div className="clearfix"></div>

                                    </div>
                                </div>
                            </div>

                            <div className={this.state.membr=='free'?"hidden":"panel panel-default"}>
                                <div className="text-center">Payment Method:</div>
                                <div className="panel-body">
                                    <div className="form-inline text-center">
                                        <div className="form-group col-lg-offset-0 text-left">
                                            <div className="radio">
                                                <label>
                                                    <input className="margin-right-10" type="radio" name="optionsRadios" id="optionsRadios1"
                                                           value="option1"
                                                           checked={this.state.paym=='bitc'}
                                                           onChange={this.handleChange.bind(this, 'bitc')} />
                                                    &nbsp;Bitcoin & other Crypto Currency
                                                </label>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="radio">
                                                <label>
                                                    <input className="margin-right-10" type="radio" name="optionsRadios" id="optionsRadios2"
                                                           value="option2"
                                                           checked={this.state.paym=='perfectm'}
                                                           onChange={this.handleChange.bind(this, 'perfectm')} />

                                                    &nbsp;Perfect Money
                                                </label>
                                            </div>
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


                                        </div>



                                        <form onSubmit={this.handleSubmit} className="hidden" id="perfMF"  action="https://perfectmoney.com/api/step1.asp" method="POST" target="_blank">

                                            <input type="hidden" name="PAYEE_ACCOUNT" value={app.defaults.get('perfectMecrh')}/>
                                            <input type="hidden" name="PAYEE_NAME" value="Cyber Fear"/>
                                            <input type="hidden" name="PAYMENT_AMOUNT" value={this.state.mCharge}/>
                                            <input type="hidden" name="PAYMENT_UNITS" value="USD"/>
                                            <input type="hidden" name="STATUS_URL" value="https://cyberfear.com/api/PerfectPaidstatus"/>
                                            <input type="hidden" name="PAYMENT_URL" value="https://cyberfear.com/api/Pe"/>
                                            <input type="hidden" name="PAYMENT_URL_METHOD" value="POST"/>
                                            <input type="hidden" name="NOPAYMENT_URL" value="https://cyberfear.com/api/Pe"/>
                                            <input type="hidden" name="NOPAYMENT_URL_METHOD" value="LINK"/>
                                            <input type="hidden" name="SUGGESTED_MEMO" value=""/>
                                            <input type="hidden" name="userId" value={this.state.userId}/>
                                            <input type="hidden" name="paymentFor" value="NewMembership"/>
                                            <input type="hidden" name="howMuch" value="1"/>
                                            <input type="hidden" name="BAGGAGE_FIELDS" value="userId paymentFor howMuch"/>

                                        </form>







                                        <form  onSubmit={this.handleSubmit} className="hidden" id="cryptF" action="https://www.coinpayments.net/index.php" method="post" target="_blank"ref="crypto">
                                            <input type="hidden" name="cmd" value="_pay_simple"/>
                                            <input type="hidden" name="reset" value="1"/>
                                            <input type="hidden" name="merchant" value={app.defaults.get('coinMecrh')}/>
                                            <input type="hidden" name="item_amount" value="1"/>
                                            <input type="hidden" name="first_name" value="anonymous"/>
                                            <input type="hidden" name="last_name" value="anonymous"/>
                                            <input type="hidden" name="email" value="anonymous@cyberfear.com"/>
                                            <input type="hidden" name="item_name" value="Premium Membership"/>
                                            <input type="hidden" name="item_desc" value={this.state.membr=='year'?"1 Year Subscription":"1 Month Subscription"}/>
                                            <input type="hidden" name="custom" value={this.state.userId}/>
                                            <input type="hidden" name="currency" value="USD"/>
                                            <input type="hidden" name="amountf" value={this.state.mCharge}/>
                                            <input type="hidden" name="want_shipping" value="0"/>
                                            <input type="hidden" name="success_url" value="https://cyberfear.com/api/Pe"/>
                                            <input type="hidden" name="cancel_url" value="https://cyberfear.com/api/Pe"/>


                                        </form>
                                        <div className="clearfix"></div>

                                        <div className={this.state.paym=="paypal"?"":"hidden"} id="paypal-button-container"></div>



                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{textAlign:"center"}}>
                                <button type="submit" form={this.state.paym==="perfectm" ?"perfMF":"cryptF"} onClick={this.handleClick.bind(this, 'pay')} className={(this.state.paym=="perfectm" || this.state.paym=="bitc") && this.state.membr!='free' ?"white-btn":"hidden"} disabled={this.state.paym==""} style={{float:"none",display:"initial"}}>Pay Now</button>
                                </div>

                            </div>

                            <div className={this.state.membr=='free'?"":"hidden"} style={{textAlign:"center"}}>
                                <button onClick={this.handleClick.bind(this, 'freemium')} className="white-btn specButton" style={{float:"none",display:"initial"}}>Log In</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    });
});