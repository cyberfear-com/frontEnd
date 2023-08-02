define(["react", "app", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, RightTop) {
    "use strict";

    return React.createClass({
        /**
         *
         * @returns {{
         * panel: {
         *  firstPanelClass: string,
         *  secondPanelClass: string,
         *  firstTab: string,
         *  secondTab: string
         *  },
         * firstRadio: boolean,
         * secondRadio: boolean,
         * thirdRadio: boolean,
         * inboxLayout: string
         * }}
         */
        getInitialState: function () {
            return {
                panel: {
                    firstPanelClass: "panel-body",
                    secondPanelClass: "panel-body d-none",
                    firstTab: "active",
                    secondTab: ""
                },
                firstRadio: app.user.get("inboxLayout") == "3cols" ? true : false,
                secondRadio: app.user.get("inboxLayout") == "2col2hor" ? true : false,
                thirdRadio: app.user.get("inboxLayout") == "2col" ? true : false,

                inboxLayout: app.user.get("inboxLayout")
            };
        },

        componentDidMount: function () {},

        /**
         *
         * @param {string} action
         */
        handleClick: function (action) {
            switch (action) {
                case "showFirst":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body",
                            secondPanelClass: "panel-body d-none",
                            firstTab: "active",
                            secondTab: ""
                        }
                    });

                    break;
                case "showSecond":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body d-none",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active"
                        }
                    });
                    break;

                case "firstRadio":
                    this.setState({
                        firstRadio: true,
                        secondRadio: false,
                        thirdRadio: false,
                        inboxLayout: "3cols"
                    });
                    break;
                case "secondRadio":
                    this.setState({
                        firstRadio: false,
                        secondRadio: true,
                        thirdRadio: false,

                        inboxLayout: "2col2hor"
                    });
                    break;
                case "thirdRadio":
                    this.setState({
                        firstRadio: false,
                        secondRadio: false,
                        thirdRadio: true,

                        inboxLayout: "2col"
                    });
                    break;

                case "resetLayout":
                    this.setState({
                        firstRadio: false,
                        secondRadio: false,
                        thirdRadio: false,

                        inboxLayout: app.user.get("inboxLayout")
                    });
                    break;

                case "safeLayout":
                    app.user.set({ inboxLayout: this.state.inboxLayout });

                    app.userObjects.updateObjects("userLayout", "", function (response) {
                        //restore copy of the object if failed to save
                        if (response == "success") {
                            //app.user.set({"DecryptedProfileObject":profile});
                            //app.userObjects.set({"EncryptedProfileObject":newProfObj});
                            //console.log('ura');
                        } else if (response == "failed") {} else if (response == "nothing") {}
                    });

                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classLaySelct = "col-xs-12";

            return React.createElement(
                "div",
                {
                    className: this.props.classes.rightClass,
                    id: "rightSettingPanel"
                },
                React.createElement(
                    "div",
                    { className: "setting-middle layout" },
                    React.createElement(
                        "div",
                        { className: "panel panel-default" },
                        React.createElement(
                            "div",
                            { className: "middle-top" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    {
                                        role: "presentation",
                                        className: this.state.panel.firstTab
                                    },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "showFirst")
                                        },
                                        React.createElement(
                                            "h2",
                                            {
                                                className: this.props.tabs.Header
                                            },
                                            "Layout"
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.panel.firstPanelClass },
                            React.createElement(
                                "div",
                                { className: classLaySelct },
                                React.createElement(
                                    "label",
                                    { className: "col-xs-6 col-sm-4" },
                                    React.createElement("input", {
                                        type: "radio",
                                        name: "inlineRadioOptions",
                                        checked: this.state.firstRadio,
                                        onChange: this.handleClick.bind(this, "firstRadio")
                                    }),
                                    React.createElement("img", {
                                        src: "/img/layouts/3col.jpg",
                                        className: "layimage img-thumbnail img-responsive row-centered"
                                    })
                                ),
                                React.createElement(
                                    "label",
                                    { className: "col-xs-6 col-sm-4" },
                                    React.createElement("input", {
                                        type: "radio",
                                        name: "inlineRadioOptions",
                                        checked: this.state.secondRadio,
                                        onChange: this.handleClick.bind(this, "secondRadio")
                                    }),
                                    React.createElement("img", {
                                        src: "/img/layouts/2col2hor.jpg",
                                        className: "layimage img-thumbnail img-responsive row-centered"
                                    })
                                ),
                                React.createElement(
                                    "label",
                                    { className: "col-xs-6 col-sm-4" },
                                    React.createElement("input", {
                                        type: "radio",
                                        name: "inlineRadioOptions",
                                        checked: this.state.thirdRadio,
                                        onChange: this.handleClick.bind(this, "thirdRadio")
                                    }),
                                    React.createElement("img", {
                                        src: "/img/layouts/2col.jpg",
                                        className: "layimage img-thumbnail img-responsive row-centered"
                                    })
                                )
                            ),
                            React.createElement("div", { className: "clearfix" }),
                            React.createElement(
                                "div",
                                { className: "col-xs-12 paddin-top-10 text-right" },
                                React.createElement(
                                    "div",
                                    { className: "form-group" },
                                    React.createElement(
                                        "div",
                                        { className: "" },
                                        React.createElement(
                                            "button",
                                            {
                                                type: "button",
                                                className: "btn btn-primary",
                                                onClick: this.handleClick.bind(this, "safeLayout"),
                                                disabled: this.state.inboxLayout == app.user.get("inboxLayout")
                                            },
                                            "Save"
                                        ),
                                        React.createElement(
                                            "button",
                                            {
                                                type: "button",
                                                className: "btn btn-default",
                                                onClick: this.handleClick.bind(this, "resetLayout")
                                            },
                                            "Cancel"
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.panel.secondPanelClass },
                            React.createElement(
                                "div",
                                {
                                    className: "alert alert-warning",
                                    role: "alert"
                                },
                                "Allbe able to receive any more emails. Do you want to continue"
                            ),
                            React.createElement(
                                "div",
                                { className: "pull-right" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-primary"
                                    },
                                    "Save"
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-default"
                                    },
                                    "Cancel"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right layout" },
                    React.createElement(RightTop, null),
                    React.createElement(
                        "div",
                        { className: "setting-right-data" },
                        React.createElement(
                            "div",
                            { className: "panel-heading" },
                            React.createElement(
                                "h2",
                                { className: "panel-title personal-info-title" },
                                "Help"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
                            React.createElement(
                                "h3",
                                null,
                                "Display Name"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda. Possit menandri persequeris no has, cibo deleniti euripidis usu ei. Vel ea elit mentitum tacimates, ut omnis scribentur vis. Pri id dico consetetur repudiandae, vix no cibo quando offendit. At nam nibh deserunt, his at facer tantas, dicit quando mandamus his eu. Eros ocurreret has id, altera verterem molestiae ad eum. Ea saepe discere delicatissimi sea, ius ne dolor timeam epicuri, ne sea quod civibus convenire."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Signature"
                            ),
                            React.createElement(
                                "p",
                                null,
                                React.createElement(
                                    "b",
                                    null,
                                    "Signature"
                                ),
                                " -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda."
                            )
                        )
                    )
                )
            );
        }
    });
});