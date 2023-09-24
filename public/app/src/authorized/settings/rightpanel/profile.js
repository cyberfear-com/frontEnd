define([
    "react",
    "app",
    "summernote",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, summernote, RightTop) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                panel: {
                    firstPanelClass: "panel-body d-none",
                    secondPanelClass: "panel-body",
                    firstTab: "d-none",
                    secondTab: "active",
                },

                firstPanelData: {
                    showDisplayName: app.user.get("showDisplayName"),
                    displayName: app.user.get("displayName"),
                },

                sessionExpiration: app.user.get("sessionExpiration"),
                mailPerPage: app.user.get("mailPerPage"),
                remeberPassword: app.user.get("remeberPassword"),

                secondPanelData: {
                    enableForwarding: app.user.get("enableForwarding"),
                    forwardingAddress: app.user.get("forwardingAddress"),
                    notificationSound: app.user.get("notificationSound"),
                    enableNotification: app.user.get("enableNotification"),
                    notificationAddress: app.user.get("notificationAddress"),
                },
                defaultPGPStrength: app.user.get("defaultPGPKeybit"),

                emfValidator: {},
                emNotValidator: {},
            };
        },

        /**
         *
         */
        componentDidMount: function () {
            React.initializeTouchEvents(true);

            console.log(app.user.get("sessionExpiration"));

            this.setState({ emfValidator: $("#forwForm").validate() });

            $("#emForwInp").rules("add", {
                email: true,
                required: true,
                minlength: 3,
                maxlength: 200,
            });

            this.setState({ emNotValidator: $("#notForm").validate() });

            $("#emNotInp").rules("add", {
                email: true,
                required: true,
                minlength: 3,
                maxlength: 200,
            });
        },
        ifSecondPanelSave: function () {
            if (
                this.state.sessionExpiration ===
                    app.user.get("sessionExpiration") &&
                this.state.mailPerPage === app.user.get("mailPerPage") &&
                this.state.remeberPassword ===
                    app.user.get("remeberPassword") &&
                this.state.secondPanelData.enableForwarding ===
                    app.user.get("enableForwarding") &&
                this.state.secondPanelData.forwardingAddress ===
                    app.user.get("forwardingAddress") &&
                this.state.secondPanelData.notificationSound ===
                    app.user.get("notificationSound") &&
                this.state.secondPanelData.enableNotification ===
                    app.user.get("enableNotification") &&
                this.state.secondPanelData.notificationAddress ===
                    app.user.get("notificationAddress") &&
                this.state.defaultPGPStrength ===
                    app.user.get("defaultPGPKeybit")
            ) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleChange: function (i, event) {
            switch (i) {
                case "displayNameCheck":
                    this.setState({
                        firstPanelData: {
                            showDisplayName:
                                !this.state.firstPanelData.showDisplayName,
                            displayName: this.state.firstPanelData.displayName,
                        },
                    });
                    break;

                case "dispNameChange":
                    this.setState({
                        firstPanelData: {
                            showDisplayName:
                                this.state.firstPanelData.showDisplayName,
                            displayName: event.target.value,
                        },
                    });
                    break;

                case "remPass":
                    this.setState({
                        remeberPassword: !this.state.remeberPassword,
                    });
                    break;

                case "mailPerPage":
                    this.setState({
                        mailPerPage: event.target.value,
                    });
                    break;

                case "sessTime":
                    this.setState({
                        sessionExpiration: event.target.value,
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
                case "enabForw":
                    this.setState({
                        secondPanelData: {
                            enableForwarding:
                                !this.state.secondPanelData.enableForwarding,
                            forwardingAddress:
                                this.state.secondPanelData.forwardingAddress,
                            notificationSound:
                                this.state.secondPanelData.notificationSound,
                            enableNotification:
                                this.state.secondPanelData.enableNotification,
                            notificationAddress:
                                this.state.secondPanelData.notificationAddress,
                        },
                    });

                    $("#emForwInp").removeClass("invalid");
                    $("#emForwInp").removeClass("valid");

                    var validator = $("#forwForm").validate();
                    validator.resetForm();
                    break;

                case "enabEmNot":
                    this.setState({
                        secondPanelData: {
                            enableForwarding:
                                this.state.secondPanelData.enableForwarding,
                            forwardingAddress:
                                this.state.secondPanelData.forwardingAddress,
                            notificationSound:
                                this.state.secondPanelData.notificationSound,
                            enableNotification:
                                !this.state.secondPanelData.enableNotification,
                            notificationAddress:
                                this.state.secondPanelData.notificationAddress,
                        },
                    });

                    $("#emNotInp").removeClass("invalid");
                    $("#emNotInp").removeClass("valid");

                    var validatornotForm = $("#notForm").validate();
                    validatornotForm.resetForm();

                    break;
                case "entEmNot":
                    this.setState({
                        secondPanelData: {
                            enableForwarding:
                                this.state.secondPanelData.enableForwarding,
                            forwardingAddress:
                                this.state.secondPanelData.forwardingAddress,
                            notificationSound:
                                this.state.secondPanelData.notificationSound,
                            enableNotification:
                                this.state.secondPanelData.enableNotification,
                            notificationAddress: event.target.value,
                        },
                    });
                    break;

                case "entEmFow":
                    this.setState({
                        secondPanelData: {
                            enableForwarding:
                                this.state.secondPanelData.enableForwarding,
                            forwardingAddress: event.target.value,
                            notificationSound:
                                this.state.secondPanelData.notificationSound,
                            enableNotification:
                                this.state.secondPanelData.enableNotification,
                            notificationAddress:
                                this.state.secondPanelData.notificationAddress,
                        },
                    });
                    break;

                case "pgpStr":
                    this.setState({
                        defaultPGPStrength: event.target.value,
                    });
                    break;
            }
        },

        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleClick: function (i, event) {
            switch (i) {
                case "showUprof":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body",
                            secondPanelClass: "panel-body d-none",
                            firstTab: "active",
                            secondTab: "",
                        },
                    });

                    break;
                case "showAccSett":
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body d-none",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active",
                        },
                    });
                    break;
                case "hSessTime":
                    console.log("fff");
                    break;
                case "resetProfile":
                    this.setState({
                        firstPanelData: {
                            showDisplayName: app.user.get("showDisplayName"),
                            displayName: app.user.get("displayName"),
                        },
                    });

                    if (app.user.get("includeSignature")) {
                        $("#signDiv").removeClass("div-readonly");
                    } else {
                        $("#signDiv").addClass("div-readonly");
                    }
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
                    var emfValidator = this.state.emfValidator;
                    var emNotValidator = this.state.emNotValidator;

                    emfValidator.form();
                    emNotValidator.form();

                    if (
                        emfValidator.numberOfInvalids() === 0 &&
                        emNotValidator.numberOfInvalids() === 0
                    ) {
                        $("#settings-spinner")
                            .removeClass("d-none")
                            .addClass("d-block");
                        app.user.set({
                            sessionExpiration: this.state.sessionExpiration,
                        });
                        app.user.set({ mailPerPage: this.state.mailPerPage });
                        app.user.set({
                            defaultPGPKeybit: parseInt(
                                this.state.defaultPGPStrength
                            ),
                        });

                        app.user.set({
                            remeberPassword: this.state.remeberPassword,
                        });

                        if (!this.state.remeberPassword) {
                            app.user.set({ password: "" });
                            app.user.set({ secondPassword: "" });
                        }

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
                    }

                    break;

                case "safeProfile":
                    app.user.set({
                        showDisplayName:
                            this.state.firstPanelData.showDisplayName,
                    });

                    if (this.state.firstPanelData.showDisplayName) {
                        app.user.set({
                            displayName: filterXSS(
                                this.state.firstPanelData.displayName
                            ),
                        });
                    }

                    app.userObjects.updateObjects("userProfile1"); //obsolete
                    break;
            }
        },

        /**
         *
         * @returns {Array}
         * @constructor
         */
        PGPbitList: function () {
            var options = [];

            for (var i = 1024; i <= 5120; i += 1024) {
                if (i <= app.user.get("userPlan")["planData"]["pgpStr"]) {
                    options.push(
                        <option key={i} value={i}>
                            {i} bits
                        </option>
                    );
                } else {
                    options.push(
                        <option key={i} disabled={true} value={i}>
                            {i} bits
                        </option>
                    );
                }
            }

            return options;
            console.log(app.user.get("userPlan")["planData"]["pgpStr"]);
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var showDisp = {
                visibility: !this.state.firstPanelData.showDisplayName
                    ? "d-none"
                    : "",
            };

            return (
                <div
                    className={this.props.classes.rightClass}
                    id="rightSettingPanel"
                >
                    <div className="setting-middle personal-info ">
                        <div className="panel panel-default">
                            <div className="middle-top">
                                <ul>
                                    <li
                                        role="presentation"
                                        className={this.state.panel.secondTab}
                                    >
                                        <a>
                                            <h2>Account Settings</h2>
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
                                                    <h3
                                                        className=""
                                                        style={showDisp}
                                                    >
                                                        {
                                                            this.state
                                                                .firstPanelData
                                                                .displayName
                                                        }
                                                        <br />
                                                    </h3>
                                                    &lt;{app.user.get("email")}
                                                    &gt;
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label className="container-checkbox with-label">
                                                        <input
                                                            className="pull-left"
                                                            type="checkbox"
                                                            checked={
                                                                this.state
                                                                    .firstPanelData
                                                                    .showDisplayName
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "displayNameCheck"
                                                            )}
                                                        />
                                                        <span className="checkmark"></span>
                                                        display name
                                                    </label>

                                                    <input
                                                        type="name"
                                                        className="form-control"
                                                        readOnly={
                                                            !this.state
                                                                .firstPanelData
                                                                .showDisplayName
                                                        }
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "dispNameChange"
                                                        )}
                                                        placeholder="Enter name"
                                                        value={
                                                            this.state
                                                                .firstPanelData
                                                                .displayName
                                                        }
                                                    />
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
                                                        "resetProfile"
                                                    )}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-blue fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "safeProfile"
                                                    )}
                                                    disabled={
                                                        this.state
                                                            .firstPanelData
                                                            .showDisplayName ==
                                                            app.user.get(
                                                                "showDisplayName"
                                                            ) &&
                                                        this.state
                                                            .firstPanelData
                                                            .displayName ==
                                                            app.user.get(
                                                                "displayName"
                                                            )
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={
                                        this.state.panel.secondPanelClass
                                    }
                                >
                                    <div className="form-section">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <select
                                                        className="form-select"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "sessTime"
                                                        )}
                                                        value={
                                                            this.state
                                                                .sessionExpiration
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            Select Session Time
                                                            Out
                                                        </option>
                                                        <option value="-1">
                                                            Disable Timeout
                                                        </option>
                                                        <option value="600">
                                                            10 Minutes
                                                        </option>
                                                        <option value="1800">
                                                            30 Minutes
                                                        </option>
                                                        <option value="3600">
                                                            1 Hour
                                                        </option>
                                                        <option value="10800">
                                                            3 Hours
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
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
                                                        className="form-select"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "pgpStr"
                                                        )}
                                                        value={
                                                            this.state
                                                                .defaultPGPStrength
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            Default PGP bits
                                                        </option>
                                                        {this.PGPbitList()}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 d-none">
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

                                    <div
                                        className={
                                            this.props.classes
                                                .classActSettSelect + " d-none"
                                        }
                                    >
                                        <div className="form-section">
                                            <form id="forwForm">
                                                <div className="row">
                                                    <div className="form-group">
                                                        <label className="container-checkbox with-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    this.state
                                                                        .secondPanelData
                                                                        .enableForwarding
                                                                }
                                                                onChange={this.handleChange.bind(
                                                                    this,
                                                                    "enabForw"
                                                                )}
                                                            />
                                                            <span className="checkmark"></span>
                                                            Enable Email
                                                            Forwarding
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="emForwInp"
                                                            className="form-control with-icon icon-email"
                                                            disabled={
                                                                !this.state
                                                                    .secondPanelData
                                                                    .enableForwarding
                                                            }
                                                            placeholder="Email Forward"
                                                            value={
                                                                this.state
                                                                    .secondPanelData
                                                                    .forwardingAddress
                                                            }
                                                            onChange={this.handleChange.bind(
                                                                this,
                                                                "entEmFow"
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            this.props.classes
                                                .classActSettSelect + " d-none"
                                        }
                                    >
                                        <div className="form-section">
                                            <form id="notForm">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label className="container-checkbox with-label">
                                                                <input
                                                                    className="pull-left"
                                                                    type="checkbox"
                                                                    checked={
                                                                        this
                                                                            .state
                                                                            .secondPanelData
                                                                            .enableNotification
                                                                    }
                                                                    onChange={this.handleChange.bind(
                                                                        this,
                                                                        "enabEmNot"
                                                                    )}
                                                                />
                                                                <span className="checkmark"></span>
                                                                Enable Email
                                                                Notification
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                id="emNotInp"
                                                                className="form-control with-icon icon-email"
                                                                disabled={
                                                                    !this.state
                                                                        .secondPanelData
                                                                        .enableNotification
                                                                }
                                                                placeholder="Email Notification"
                                                                value={
                                                                    this.state
                                                                        .secondPanelData
                                                                        .notificationAddress
                                                                }
                                                                onChange={this.handleChange.bind(
                                                                    this,
                                                                    "entEmNot"
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="form-section-bottom">
                                        <div className="checkbox-left">
                                            <label className="container-checkbox with-label">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        this.state
                                                            .remeberPassword
                                                    }
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "remPass"
                                                    )}
                                                />
                                                <span className="checkmark"></span>
                                                Remember Password for Session
                                            </label>
                                        </div>
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
                                                disabled={this.ifSecondPanelSave()}
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

                    <div className="setting-right personal-info ">
                        <RightTop />
                        <div className="setting-right-data">
                            <div className="panel-heading">
                                <h2 className="panel-title personal-info-title">
                                    Help
                                </h2>
                            </div>

                            <div className="panel-body">
                                <h3>Default key strength bits</h3>
                                <p>
                                    Select the strength of the cryptography to
                                    be used for your key strength. A lower
                                    number of bits might improve speed but
                                    reduce security dramatically. A higher
                                    number of bits will take more time to
                                    process and open upon login and may not be
                                    supported by all devices if exported. The
                                    minimum recommended key strength is 2048
                                    bits.
                                </p>
                                <h3>Emails per page</h3>
                                <p>
                                    Select the number of emails you would like
                                    to be displayed per page in your inbox and
                                    folders.
                                </p>
                                <h3>Timeout</h3>

                                <p>
                                    Select the amount of time before your
                                    current session logs out automatically and
                                    requires you to login again. You can select{" "}
                                    <b>Disable Timeout</b> to turn off this
                                    feature.(Not recommended)
                                </p>
                                <h3>Remember Password</h3>
                                <p>
                                    Check this box to keep your password in
                                    memory for the duration of the session. It
                                    will prevent the system from asking you
                                    every time you want to add or delete your
                                    email aliases or change to private keys.
                                    Enabling this feature can lower your
                                    security, if someone can gain access to your
                                    computer.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
