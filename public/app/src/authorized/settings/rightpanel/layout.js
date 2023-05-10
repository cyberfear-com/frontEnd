define([
    "react",
    "app",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, RightTop) {
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
                    secondTab: "",
                },
                firstRadio:
                    app.user.get("inboxLayout") == "3cols" ? true : false,
                secondRadio:
                    app.user.get("inboxLayout") == "2col2hor" ? true : false,
                thirdRadio:
                    app.user.get("inboxLayout") == "2col" ? true : false,

                mailPerPage: app.user.get("mailPerPage"),
                secondPanelData: {
                    enableForwarding: app.user.get("enableForwarding"),
                    forwardingAddress: app.user.get("forwardingAddress"),
                    notificationSound: app.user.get("notificationSound"),
                    enableNotification: app.user.get("enableNotification"),
                    notificationAddress: app.user.get("notificationAddress"),
                },

                inboxLayout: app.user.get("inboxLayout"),
            };
        },

        componentDidMount: function () {},

        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleChange: function (i, event) {
            switch (i) {
                case "mailPerPage":
                    this.setState({
                        mailPerPage: event.target.value,
                    });
                    break;
                case "changeSound":
                    this.setState({
                        secondPanelData: {
                            enableForwarding:
                                this.state.secondPanelData.enableForwarding,
                            forwardingAddress:
                                this.state.secondPanelData.forwardingAddress,
                            notificationSound: event.target.value,
                            enableNotification:
                                this.state.secondPanelData.enableNotification,
                            notificationAddress:
                                this.state.secondPanelData.notificationAddress,
                        },
                    });
                    break;
            }
        },

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
                            secondTab: "",
                        },
                    });

                    break;
                case "showSecond":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body d-none",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active",
                        },
                    });
                    break;

                case "firstRadio":
                    this.setState({
                        firstRadio: true,
                        secondRadio: false,
                        thirdRadio: false,
                        inboxLayout: "3cols",
                    });
                    break;
                case "secondRadio":
                    this.setState({
                        firstRadio: false,
                        secondRadio: true,
                        thirdRadio: false,

                        inboxLayout: "2col2hor",
                    });
                    break;
                case "thirdRadio":
                    this.setState({
                        firstRadio: false,
                        secondRadio: false,
                        thirdRadio: true,

                        inboxLayout: "2col",
                    });
                    break;

                case "resetLayout":
                    this.setState({
                        firstRadio: false,
                        secondRadio: false,
                        thirdRadio: false,

                        inboxLayout: app.user.get("inboxLayout"),
                    });
                    break;

                case "safeLayout":
                    app.user.set({ inboxLayout: this.state.inboxLayout });

                    app.userObjects.updateObjects(
                        "userLayout",
                        "",
                        function (response) {
                            //restore copy of the object if failed to save
                            if (response == "success") {
                                //app.user.set({"DecryptedProfileObject":profile});
                                //app.userObjects.set({"EncryptedProfileObject":newProfObj});
                                //console.log('ura');
                            } else if (response == "failed") {
                            } else if (response == "nothing") {
                            }
                        }
                    );

                    break;

                case "resetAccSett":
                    this.setState({
                        sessionExpiration: app.user.get("sessionExpiration"),
                        mailPerPage: app.user.get("mailPerPage"),
                        remeberPassword: app.user.get("remeberPassword"),

                        secondPanelData: {
                            enableForwarding: app.user.get("enableForwarding"),
                            forwardingAddress:
                                app.user.get("forwardingAddress"),
                            notificationSound:
                                app.user.get("notificationSound"),
                            enableNotification:
                                app.user.get("enableNotification"),
                            notificationAddress: app.user.get(
                                "notificationAddress"
                            ),
                        },
                    });

                    $("#emNotInp").removeClass("invalid");
                    $("#emNotInp").removeClass("valid");

                    var validator = $("#notForm").validate();
                    validator.resetForm();

                    $("#emForwInp").removeClass("invalid");
                    $("#emForwInp").removeClass("valid");

                    var validatorforwForm = $("#forwForm").validate();
                    validatorforwForm.resetForm();

                    break;

                case "safeAccSett":
                    $("#settings-spinner")
                        .removeClass("d-none")
                        .addClass("d-block");
                    app.user.set({ mailPerPage: this.state.mailPerPage });
                    app.userObjects.updateObjects(
                        "userProfile",
                        "",
                        function (response) {
                            if (response === "success") {
                            } else if (response === "failed") {
                            } else if (response === "nothing") {
                            }
                        }
                    );
                    $("#settings-spinner")
                        .removeClass("d-block")
                        .addClass("d-none");

                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classLaySelct = "col-xs-12";

            return (
                <div
                    className={this.props.classes.rightClass}
                    id="rightSettingPanel"
                >
                    <div className="setting-middle layout">
                        <div className="panel panel-default">
                            <div className="middle-top">
                                <ul>
                                    <li
                                        role="presentation"
                                        className={this.state.panel.firstTab}
                                    >
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                "showFirst"
                                            )}
                                        >
                                            <h2
                                                className={
                                                    this.props.tabs.Header
                                                }
                                            >
                                                Layout
                                            </h2>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="middle-content">
                                <div
                                    className={this.state.panel.firstPanelClass}
                                >
                                    <div className="form-section">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <select
                                                        className="form-select"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "mailPerPage"
                                                        )}
                                                        value={
                                                            this.state
                                                                .mailPerPage
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            Emails per page
                                                        </option>
                                                        <option value="10">
                                                            10 Emails per page
                                                        </option>
                                                        <option value="25">
                                                            25 Emails per page
                                                        </option>
                                                        <option value="50">
                                                            50 Emails per page
                                                        </option>
                                                        <option value="100">
                                                            100 Emails per page
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <select
                                                        className="form-control"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeSound"
                                                        )}
                                                        value={
                                                            this.state
                                                                .secondPanelData
                                                                .notificationSound
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            New Email
                                                            Notification Sound
                                                        </option>
                                                        <option value="">
                                                            Disable Sound
                                                        </option>
                                                        <option value="10">
                                                            Bell
                                                        </option>
                                                        <option value="25">
                                                            lala
                                                        </option>
                                                        <option value="50">
                                                            lolo
                                                        </option>
                                                        <option value="100">
                                                            lambada
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-section-bottom">
                                        <div className="btn-row">
                                            <button
                                                type="button"
                                                className="btn-border fixed-width-btn"
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "resetAccSett"
                                                )}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-blue fixed-width-btn"
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "safeAccSett"
                                                )}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-right layout">
                        <RightTop />
                        <div className="setting-right-data">
                            <div className="panel-heading">
                                <h2 className="panel-title personal-info-title">
                                    Help
                                </h2>
                            </div>

                            <div className="panel-body">
                                <h3>Emails per page</h3>
                                <p>
                                    Select the number of emails you would like
                                    to be displayed per page in your inbox and
                                    folders.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
