define([
    "react",
    "app",
    "accounting",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, accounting, RightTop) {
    "use strict";
    return React.createClass({
        /**
         *
         * @returns {{
         * nav1Class: string,
         * nav2Class: string,
         * panel1Class: string,
         * panel2Class: string,
         * panel3Class: string,
         * panel4Class: string,
         * panel2Visible: string,
         * panel4Visible: string,
         * button1Class: string,
         * googlePin: string,
         * yubiPin: string
         * }}
         */
        getInitialState: function () {
            return {
                nav1Class: "",
                nav2Class: "",
                panel1Class: "", //goog enab
                button1Class: "",
                CouponHistory: "",
                invited: 0,
                paid: 0,
                reward: 0,
                pendingReward: 0,
                discount: 0,
                rewardPaid: 0,
                alreadyAwarded: 0,
            };
        },

        panelsReset: function () {
            this.setState({
                nav1Class: "",
                nav2Class: "",

                panel1Class: "",

                button1Class: "",
            });
        },

        CouponHistory: function () {
            var options = [];

            var paid = [];

            options.push(
                <div className="information-table-row" key="1a">
                    <label>Your Unique Coupon:</label>
                    <div className="information-row-right">
                        {app.user.get("userPlan")["coupon"]}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="1b">
                    <label>Invitation Link:</label>
                    <div className="information-row-right with-btn">
                        https://cyber.com/mailbox/#signup/
                        {app.user.get("userPlan")["coupon"]}
                        <button
                            className="copy-btn"
                            id="email-copy"
                            onClick={this.handleClick.bind(
                                this,
                                "copyToClipboard"
                            )}
                        ></button>
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="1c">
                    <label>Discount for new user:</label>
                    <div className="information-row-right">
                        {this.state.discount}%
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="1d">
                    <label>Reward for you:</label>
                    <div className="information-row-right">
                        {this.state.reward}%
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="2a">
                    <label>Registered using your link:</label>
                    <div className="information-row-right">
                        {this.state.invited}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="2c">
                    <label>Registered and paid:</label>
                    <div className="information-row-right">
                        {this.state.paid}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="3b">
                    <label>Total Reward:</label>
                    <div className="information-row-right">
                        {accounting.formatMoney(
                            app.user.get("userPlan")["rewardCollected"],
                            "$",
                            2
                        )}
                    </div>
                </div>
            );
            //if(app.user.get("userPlan")['balance']>0){

            options.push(
                <div className="information-table-row" key="3ba">
                    <label>Pending Reward:</label>
                    <div className="information-row-right">
                        {accounting.formatMoney(
                            this.state.pendingReward,
                            "$",
                            2
                        )}
                    </div>
                </div>
            );

            options.push(
                <div className="information-table-row" key="3c">
                    <label>Reward already paid:</label>
                    <div className="information-row-right">
                        {accounting.formatMoney(
                            app.user.get("userPlan")["rewardPaid"],
                            "$",
                            2
                        )}
                    </div>
                </div>
            );
            return options;
        },

        whatToShow: function () {
            this.setState({
                nav1Class: "active",
                nav2Class: "",
                nav1Click: "show1Panel",
                nav2Click: "show2Panel",

                panel1Class: "",
                button1Class: "",
            });
        },

        componentDidMount: function () {
            this.whatToShow();
            var thisComp = this;

            app.serverCall.ajaxRequest(
                "RetrieveCoupData",
                {},
                function (result) {
                    //console.log(result);
                    thisComp.setState({
                        invited: result["invited"],
                        paid: result["paid"],
                        reward: result["reward"],
                        alreadyAwarded: result["totalAwarded"],
                        pendingReward: result["pendingAward"],
                        discount: result["discount"],
                        rewardPaid: 0,
                    });
                }
            );
        },

        /**
         *
         * @param {string} action
         * @param {string} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "show1Panel":
                    break;

                case "show2Panel":
                    this.handleClick("resetYubiForm");

                    break;

                case "copyToClipboard":
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp
                        .val(
                            "https://cyberfear.com/index.html#createUser/" +
                                app.user.get("userPlan")["coupon"]
                        )
                        .select();
                    document.execCommand("copy");
                    $temp.remove();
                    break;
            }
        },

        /**
         *
         * @param {sting} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classQRInputs = "col-xs-12 col-sm-8 col-md-9";
            var classQrDiv = "col-xs-12 col-sm-4 col-md-3";

            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle coupons">
                        <div className="middle-top">
                            <h2>Premium</h2>
                        </div>
                        <div className="middle-content">
                            <div className="middle-content-top">
                                <h3>Coupons</h3>
                            </div>

                            <div
                                className={`table-row ${this.state.panel1Class}`}
                            >
                                <div className="form-section">
                                    <div className="information-table">
                                        {this.CouponHistory()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-right coupons">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>

                            <div className="panel-body">
                                <h3>Coupons serve 2 purposes:</h3>
                                <p>
                                    - discount for new users
                                    <br />- reward for you
                                </p>
                                <h3>Example:</h3>
                                <p>
                                    You copy your coupon link and send it to
                                    your friend John.
                                    <br />
                                    John clicks on your link and creates an
                                    account.
                                    <br />
                                    John selects yearly subscription for $18.
                                    <br />
                                    Thanks to your coupon, the price gets
                                    decreased by 10% which makes it $16.20
                                    instead of $18.
                                    <br />
                                    John saves $1.8. (10% of 18.00)
                                    <br />
                                    You receive $3.24 reward. (20% of 16.20)
                                    <br />
                                    Mailum gains a new member.
                                    <br />
                                    <br />
                                    You can share your link with multiple
                                    people, it will always provide the discount
                                    and reward.
                                    <br />
                                    You can withdraw your rewards when you like
                                    to.
                                    <br />
                                    <br />
                                    Payments made by crypto and Perfect Money
                                    are instantly available for withdrawal.
                                    <br />
                                    Payments made by PayPal will be pending for
                                    30 days before they can be withdrawn.
                                    <br />
                                    <b>Minimum withdrawal: $10.00</b>
                                    <br />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
