define(['app', 'accounting', 'react'], function (app, accounting, React) {

    return React.createClass({

        getInitialState: function () {
            return {
                email: "",
                buttonTag: "",
                buttonText: "Create Account",
                paym: "",
                userId: "",
                mCharge: ""
            };
        },

        componentDidMount: function () {
            var thisComp = this;
            app.user.on("change:userPlan", function () {
                // console.log(app.user.get("resetSelectedItems"));
                thisComp.setState({
                    mCharge: app.user.get("userPlan")['monthlyCharge'] - app.user.get("userPlan")['alrdPaid'] - app.user.get("userPlan")['currentPlanBalance']
                });
                // $('#selectAll>input').prop("checked",false);
            }, thisComp);
        },

        componentWillUnmount: function () {

            app.user.off("change:userPlan");
        },

        handleChange: function (action, event) {

            switch (action) {
                case 'perfectm':
                    var thisComp = this;
                    this.setState({
                        paym: "perfectm"
                    });

                    this.setState({
                        userId: app.user.get("userId")
                    });

                    break;
                case 'bitc':
                    var thisComp = this;
                    this.setState({
                        paym: "bitc"
                    });

                    this.setState({
                        userId: app.user.get("userId")
                    });

                    break;
                case 'paypal':
                    var thisComp = this;
                    this.setState({
                        paym: "paypal"
                    });

                    var my_script = thisComp.new_script();

                    var self = this;
                    my_script.then(function () {
                        //self.setState({'status': 'done'});
                        paypal.Buttons({
                            style: {
                                shape: 'rect',
                                color: 'gold',
                                layout: 'vertical',
                                label: 'paypal'

                            },
                            createOrder: function (data, actions) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: thisComp.state.mCharge
                                        },
                                        custom_id: app.user.get("userId"),
                                        description: "NewMembership",
                                        invoice_id: 1
                                    }],
                                    application_context: {
                                        shipping_preference: 'NO_SHIPPING'
                                    }
                                });
                            },
                            onApprove: function (data, actions) {
                                return actions.order.capture().then(function (details) {
                                    //alert('Transaction completed by ' + details.payer.name.given_name + '!');
                                    // alert('done');

                                });
                            }
                        }).render('#paypal-button-container');
                    }).catch(function () {
                        //self.setState({'status': 'error'});
                    });

                    break;

            }
        },

        new_script: function () {
            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = 'https://www.paypal.com/sdk/js?client-id=AaDCvbA992btr491o9RRqJk6wcqicJRaKwpfhHwQh84MSVNCU1ARqFN9kAtUjqQV6GvmxSv17yFRAMGW&currency=USD';
                script.addEventListener('load', function () {
                    resolve();
                });
                script.addEventListener('error', function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
            });
        },

        handleSubmit(event) {},
        handleClick: function (action, event) {
            switch (action) {
                case 'pay':
                    if (this.state.paym !== "perfectm") {
                        app.user.set({
                            tempCoin: true
                        });
                    };
                    break;
            }
        },

        render: function () {
            return React.createElement(
                'div',
                { className: 'modal fade bs-example-modal-sm', id: 'makePayment', tabIndex: '-1', role: 'dialog',
                    'aria-hidden': 'true' },
                React.createElement(
                    'div',
                    { className: 'modal-dialog modal-md' },
                    React.createElement(
                        'div',
                        { className: 'modal-content' },
                        React.createElement(
                            'div',
                            { className: 'panel panel-default' },
                            React.createElement(
                                'div',
                                { className: 'panel-body text-center' },
                                app.defaults.get('name'),
                                React.createElement('div', { className: 'clearfix' }),
                                'Anonymous Email Service',
                                React.createElement('div', { className: 'clearfix' }),
                                'Account Type: Premium',
                                React.createElement('div', { className: 'clearfix' }),
                                'Amount Due: ',
                                accounting.formatMoney(this.state.mCharge)
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel panel-default' },
                            React.createElement(
                                'div',
                                { className: 'text-center' },
                                'Payment Method:'
                            ),
                            React.createElement(
                                'div',
                                { className: 'panel-body' },
                                React.createElement(
                                    'div',
                                    { className: 'form-inline text-center' },
                                    React.createElement(
                                        'div',
                                        { className: 'form-group col-lg-offset-0 text-left' },
                                        React.createElement(
                                            'div',
                                            { className: 'radio' },
                                            React.createElement(
                                                'label',
                                                null,
                                                React.createElement('input', { className: 'margin-right-10', type: 'radio', name: 'optionsRadios', id: 'optionsRadios1',
                                                    value: 'option1',
                                                    checked: this.state.paym == 'bitc',
                                                    onChange: this.handleChange.bind(this, 'bitc') }),
                                                '\xA0Bitcoin & other Crypto Currency'
                                            )
                                        ),
                                        React.createElement('div', { className: 'clearfix' }),
                                        React.createElement(
                                            'div',
                                            { className: 'radio' },
                                            React.createElement(
                                                'label',
                                                null,
                                                React.createElement('input', { className: 'margin-right-10', type: 'radio', name: 'optionsRadios', id: 'optionsRadios2',
                                                    value: 'option2',
                                                    checked: this.state.paym == 'perfectm',
                                                    onChange: this.handleChange.bind(this, 'perfectm') }),
                                                '\xA0Perfect Money'
                                            )
                                        ),
                                        React.createElement('div', { className: 'clearfix' }),
                                        React.createElement(
                                            'div',
                                            { className: 'radio' },
                                            React.createElement(
                                                'label',
                                                null,
                                                React.createElement('input', { className: 'margin-right-10', type: 'radio', name: 'optionsRadios', id: 'optionsRadios3',
                                                    value: 'option3',
                                                    checked: this.state.paym == 'paypal',
                                                    onChange: this.handleChange.bind(this, 'paypal') }),
                                                '\xA0PayPal'
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        'form',
                                        { onSubmit: this.handleSubmit, className: 'hidden', id: 'perfMF', action: 'https://perfectmoney.com/api/step1.asp', method: 'POST', target: '_blank' },
                                        React.createElement('input', { type: 'hidden', name: 'PAYEE_ACCOUNT', value: app.defaults.get('perfectMecrh') }),
                                        React.createElement('input', { type: 'hidden', name: 'PAYEE_NAME', value: 'Cyber Fear' }),
                                        React.createElement('input', { type: 'hidden', name: 'PAYMENT_AMOUNT', value: this.state.mCharge }),
                                        React.createElement('input', { type: 'hidden', name: 'PAYMENT_UNITS', value: 'USD' }),
                                        React.createElement('input', { type: 'hidden', name: 'STATUS_URL', value: 'https://cyberfear.com/api/PerfectPaidstatus' }),
                                        React.createElement('input', { type: 'hidden', name: 'PAYMENT_URL', value: 'https://cyberfear.com/api/Pe' }),
                                        React.createElement('input', { type: 'hidden', name: 'PAYMENT_URL_METHOD', value: 'POST' }),
                                        React.createElement('input', { type: 'hidden', name: 'NOPAYMENT_URL', value: 'https://cyberfear.com/api/Pe' }),
                                        React.createElement('input', { type: 'hidden', name: 'NOPAYMENT_URL_METHOD', value: 'LINK' }),
                                        React.createElement('input', { type: 'hidden', name: 'SUGGESTED_MEMO', value: '' }),
                                        React.createElement('input', { type: 'hidden', name: 'userId', value: this.state.userId }),
                                        React.createElement('input', { type: 'hidden', name: 'paymentFor', value: 'NewMembership' }),
                                        React.createElement('input', { type: 'hidden', name: 'howMuch', value: '1' }),
                                        React.createElement('input', { type: 'hidden', name: 'BAGGAGE_FIELDS', value: 'userId paymentFor howMuch' })
                                    ),
                                    React.createElement(
                                        'form',
                                        { onSubmit: this.handleSubmit, className: 'hidden', id: 'cryptF', action: 'https://www.coinpayments.net/index.php', method: 'post', target: '_blank', ref: 'crypto' },
                                        React.createElement('input', { type: 'hidden', name: 'cmd', value: '_pay_simple' }),
                                        React.createElement('input', { type: 'hidden', name: 'reset', value: '1' }),
                                        React.createElement('input', { type: 'hidden', name: 'merchant', value: app.defaults.get('coinMecrh') }),
                                        React.createElement('input', { type: 'hidden', name: 'item_amount', value: '1' }),
                                        React.createElement('input', { type: 'hidden', name: 'first_name', value: 'anonymous' }),
                                        React.createElement('input', { type: 'hidden', name: 'last_name', value: 'anonymous' }),
                                        React.createElement('input', { type: 'hidden', name: 'email', value: 'anonymous@cyberfear.com' }),
                                        React.createElement('input', { type: 'hidden', name: 'item_name', value: 'Premium Membership' }),
                                        React.createElement('input', { type: 'hidden', name: 'item_desc', value: '1 Year Subscription' }),
                                        React.createElement('input', { type: 'hidden', name: 'custom', value: this.state.userId }),
                                        React.createElement('input', { type: 'hidden', name: 'currency', value: 'USD' }),
                                        React.createElement('input', { type: 'hidden', name: 'amountf', value: this.state.mCharge }),
                                        React.createElement('input', { type: 'hidden', name: 'want_shipping', value: '0' }),
                                        React.createElement('input', { type: 'hidden', name: 'success_url', value: 'https://cyberfear.com/api/Pe' }),
                                        React.createElement('input', { type: 'hidden', name: 'cancel_url', value: 'https://cyberfear.com/api/Pe' })
                                    ),
                                    React.createElement('div', { className: 'clearfix' }),
                                    React.createElement('div', { className: this.state.paym == "paypal" ? "" : "hidden", id: 'paypal-button-container' }),
                                    React.createElement(
                                        'div',
                                        { className: 'radio' },
                                        React.createElement(
                                            'button',
                                            { type: 'submit', form: this.state.paym === "perfectm" ? "perfMF" : "cryptF", onClick: this.handleClick.bind(this, 'pay'), className: this.state.paym == "perfectm" || this.state.paym == "bitc" ? "white-btn" : "hidden", disabled: this.state.paym == "" },
                                            'Pay Now'
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }

    });
});