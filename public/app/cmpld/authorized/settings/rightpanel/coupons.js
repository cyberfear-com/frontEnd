define(["react", "app", "accounting", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, accounting, RightTop) {
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
                alreadyAwarded: 0
            };
        },

        panelsReset: function () {
            this.setState({
                nav1Class: "",
                nav2Class: "",

                panel1Class: "",

                button1Class: ""
            });
        },

        CouponHistory: function () {
            var options = [];

            var paid = [];

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1a" },
                React.createElement(
                    "label",
                    null,
                    "Your Unique Coupon:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    app.user.get("userPlan")["coupon"]
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1b" },
                React.createElement(
                    "label",
                    null,
                    "Invitation Link:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right with-btn" },
                    "https://cyber.com/mailbox/#signup/",
                    app.user.get("userPlan")["coupon"],
                    React.createElement("button", {
                        className: "copy-btn",
                        id: "email-copy",
                        onClick: this.handleClick.bind(this, "copyToClipboard")
                    })
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1c" },
                React.createElement(
                    "label",
                    null,
                    "Discount for new user:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    this.state.discount,
                    "%"
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "1d" },
                React.createElement(
                    "label",
                    null,
                    "Reward for you:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    this.state.reward,
                    "%"
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "2a" },
                React.createElement(
                    "label",
                    null,
                    "Registered using your link:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    this.state.invited
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "2c" },
                React.createElement(
                    "label",
                    null,
                    "Registered and paid:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    this.state.paid
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "3b" },
                React.createElement(
                    "label",
                    null,
                    "Total Reward:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["rewardCollected"], "$", 2)
                )
            ));
            //if(app.user.get("userPlan")['balance']>0){

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "3ba" },
                React.createElement(
                    "label",
                    null,
                    "Pending Reward:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(this.state.pendingReward, "$", 2)
                )
            ));

            options.push(React.createElement(
                "div",
                { className: "information-table-row", key: "3c" },
                React.createElement(
                    "label",
                    null,
                    "Reward already paid:"
                ),
                React.createElement(
                    "div",
                    { className: "information-row-right" },
                    accounting.formatMoney(app.user.get("userPlan")["rewardPaid"], "$", 2)
                )
            ));
            return options;
        },

        whatToShow: function () {
            this.setState({
                nav1Class: "active",
                nav2Class: "",
                nav1Click: "show1Panel",
                nav2Click: "show2Panel",

                panel1Class: "",
                button1Class: ""
            });
        },

        componentDidMount: function () {
            this.whatToShow();
            var thisComp = this;

            app.serverCall.ajaxRequest("RetrieveCoupData", {}, function (result) {
                //console.log(result);
                thisComp.setState({
                    invited: result["invited"],
                    paid: result["paid"],
                    reward: result["reward"],
                    alreadyAwarded: result["totalAwarded"],
                    pendingReward: result["pendingAward"],
                    discount: result["discount"],
                    rewardPaid: 0
                });
            });
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
                    $temp.val("https://cyberfear.com/index.html#createUser/" + app.user.get("userPlan")["coupon"]).select();
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
            switch (action) {}
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classQRInputs = "col-xs-12 col-sm-8 col-md-9";
            var classQrDiv = "col-xs-12 col-sm-4 col-md-3";

            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle coupons" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "h2",
                            null,
                            "Premium"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            { className: "middle-content-top" },
                            React.createElement(
                                "h3",
                                null,
                                "Coupons"
                            )
                        ),
                        React.createElement(
                            "div",
                            {
                                className: `table-row ${this.state.panel1Class}`
                            },
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "div",
                                    { className: "information-table" },
                                    this.CouponHistory()
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right coupons" },
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
                                "Coupons serve 2 purposes:"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "- discount for new users",
                                React.createElement("br", null),
                                "- reward for you"
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Example:"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "You copy your coupon link and send it to your friend John.",
                                React.createElement("br", null),
                                "John clicks on your link and creates an account.",
                                React.createElement("br", null),
                                "John selects yearly subscription for $18.",
                                React.createElement("br", null),
                                "Thanks to your coupon, the price gets decreased by 10% which makes it $16.20 instead of $18.",
                                React.createElement("br", null),
                                "John saves $1.8. (10% of 18.00)",
                                React.createElement("br", null),
                                "You receive $3.24 reward. (20% of 16.20)",
                                React.createElement("br", null),
                                "Mailum gains a new member.",
                                React.createElement("br", null),
                                React.createElement("br", null),
                                "You can share your link with multiple people, it will always provide the discount and reward.",
                                React.createElement("br", null),
                                "You can withdraw your rewards when you like to.",
                                React.createElement("br", null),
                                React.createElement("br", null),
                                "Payments made by crypto and Perfect Money are instantly available for withdrawal.",
                                React.createElement("br", null),
                                "Payments made by PayPal will be pending for 30 days before they can be withdrawn.",
                                React.createElement("br", null),
                                React.createElement(
                                    "b",
                                    null,
                                    "Minimum withdrawal: $10.00"
                                ),
                                React.createElement("br", null)
                            )
                        )
                    )
                )
            );
        }
    });
});