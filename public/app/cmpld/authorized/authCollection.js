define(["react", "app", "xss", "cmpld/authorized/mailbox/mailboxCollection", "cmpld/authorized/settings/settingsCollection", "cmpld/authorized/updates/updateVersion1", "cmpld/modals/secondPass", "cmpld/modals/syncUserObj", "cmpld/modals/logOutForce", "cmpld/modals/infoPop", "cmpld/modals/askForPass", "cmpld/modals/dialogPop", "cmpld/modals/dontInterrupt", "cmpld/modals/loading", "offline"], function (React, app, xss, MailboxCollection, SettingsCollection, UpdateCollection, SecondPass, SyncUserObj, LogOutForce, InfoPop, AskForPass, DialogPop, DontInterrupt, Loading, offline) {
    return React.createClass({
        getInitialState: function () {
            return {
                dfd: "",
                foderId: ""
            };
        },
        componentDidMount: function () {
            var thisMod = this;

            if (!app.user.get("userLogedIn")) {
                app.auth.logout();
            } else {
                if (app.sessionData.get("sessionReady")) {
                    thisMod.setState({ dfd: "solved" });
                } else {
                    $("#userObjSync").addClass("show d-block");
                    $("#overlay, #loading-skeleton").removeClass("d-none").addClass("d-block");
                    $("#userObjSync").modal({
                        show: true,
                        backdrop: "static",
                        keyboard: true
                    });

                    app.userObjects.startSession(function () {
                        $("#userObjSync").removeClass("show d-block");
                        $("#overlay, #loading-skeleton").removeClass("d-block").addClass("d-none");
                        $("#userObjSync").modal("hide");
                        app.sessionData.set({ sessionReady: true });
                        thisMod.setState({ dfd: "solved" });
                    });
                }
                Offline.options = {
                    checks: {
                        xhr: {
                            url: "https://jsonplaceholder.typicode.com/posts/1"
                        }
                    }
                };

                // If application comes online
                Offline.on("up", function () {
                    app.serverCall.restartQue();
                });
            }
        },
        handleClick: function (i) {
            switch (i) {
                case "resetTimer":
                    app.user.startTimer();
                    break;
            }
        },
        changeFodlerId: function (foderId) {
            this.setState({
                folder: foderId
            });
        },
        componentWillUnmount: function () {},

        updateValue: function (modifiedValue) {
            this.setState(modifiedValue);
        },

        render: function () {
            var body = "";
            var page = this.props.page;

            if (this.state.dfd == "solved") {
                if (page == "mailBox" && app.user.get("profileVersion") > 1) {
                    body = React.createElement(MailboxCollection, {
                        pp: this.props.folder,
                        activePage: this.state.folder,
                        changeFodlerId: this.changeFodlerId,
                        folderId: this.state.folder,
                        updateValue: this.updateValue
                    });
                } else if (page == "settings" && app.user.get("profileVersion") > 1) {
                    body = React.createElement(
                        "div",
                        null,
                        React.createElement(SettingsCollection, {
                            rightPanel: this.props.rightPanel,
                            activePage: this.props.activePage
                        })
                    );

                    $("#settings-spinner").removeClass("d-block").addClass("d-none");
                } else if (page == "settings" && app.user.get("profileVersion") == 1 && this.props.activePage == "updateVersion1") {
                    console.log(`settings`);
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: "updateVersion1"
                    });
                } else if (app.user.get("profileVersion") == 1) {
                    Backbone.history.navigate("/settings/updateVersion1", {
                        trigger: true
                    });
                }
            }

            return React.createElement(
                "div",
                {
                    className: "mailBody",
                    onClick: this.handleClick.bind(this, "resetTimer"),
                    onTouchEnd: this.handleClick.bind(this, "resetTimer"),
                    onKeyUp: this.handleClick.bind(this, "resetTimer")
                },
                body,
                React.createElement("div", { id: "overlay", className: "d-none" }),
                React.createElement(
                    "div",
                    {
                        id: "loading-skeleton",
                        className: "loading-skeleton d-none"
                    },
                    React.createElement(
                        "header",
                        null,
                        React.createElement(
                            "div",
                            { className: "logo-2" },
                            React.createElement(
                                "a",
                                { href: "#" },
                                React.createElement("img", {
                                    src: "images/logo.svg",
                                    alt: "",
                                    className: "light-theme"
                                }),
                                " ",
                                React.createElement("img", {
                                    src: "images/logo-white.svg",
                                    alt: "",
                                    className: "dark-theme"
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "right-top-data" },
                            React.createElement(
                                "div",
                                { className: "right-top-data-content" },
                                React.createElement("div", { className: "skeleton __circle" }),
                                React.createElement("div", { className: "skeleton __circle" }),
                                React.createElement(
                                    "div",
                                    { className: "user-data" },
                                    React.createElement("div", { className: "skeleton" }),
                                    React.createElement("div", { className: "skeleton" })
                                ),
                                React.createElement("div", { className: "skeleton __circle" })
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mobile-search" },
                        React.createElement("input", { type: "search", placeholder: "Search..." })
                    ),
                    React.createElement(
                        "div",
                        { className: "left-side" },
                        React.createElement(
                            "div",
                            { className: "left-container" },
                            React.createElement(
                                "div",
                                { className: "logo" },
                                React.createElement(
                                    "a",
                                    { href: "#" },
                                    React.createElement("img", {
                                        src: "images/logo.svg",
                                        alt: "",
                                        className: "light-theme-logo"
                                    }),
                                    " ",
                                    React.createElement("img", {
                                        src: "images/logo-white.svg",
                                        alt: "",
                                        className: "dark-theme-logo"
                                    })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "new-message-btn" },
                                React.createElement("button", null)
                            ),
                            React.createElement(
                                "div",
                                { className: "main-menu" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __folder _main" }),
                                        React.createElement("div", { className: "skeleton __circle __medium" })
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __folder _main" }),
                                        React.createElement("div", null)
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __folder _main" }),
                                        React.createElement("div", null)
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __folder _main" }),
                                        React.createElement("div", null)
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement("div", { className: "skeleton __folder _main" }),
                                        React.createElement("div", null)
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "the-folders" },
                                React.createElement(
                                    "div",
                                    { className: "main-menu the-folder-list" },
                                    React.createElement(
                                        "div",
                                        { className: "folders-heading" },
                                        React.createElement(
                                            "div",
                                            { className: "__first" },
                                            `Folders`,
                                            React.createElement(
                                                "div",
                                                { className: "icon" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        width: "10",
                                                        height: "6",
                                                        viewBox: "0 0 10 6",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg"
                                                    },
                                                    React.createElement("path", {
                                                        fillRule: "evenodd",
                                                        clipRule: "evenodd",
                                                        d: "M0.646446 0.313073C0.841709 0.11781 1.15829 0.11781 1.35355 0.313073L5 3.95952L8.64645 0.313072C8.84171 0.11781 9.15829 0.11781 9.35355 0.313072C9.54882 0.508334 9.54882 0.824917 9.35355 1.02018L5.35355 5.02018C5.15829 5.21544 4.84171 5.21544 4.64645 5.02018L0.646446 1.02018C0.451184 0.824917 0.451184 0.508335 0.646446 0.313073Z",
                                                        fill: "#080D13"
                                                    })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "icon" },
                                            React.createElement(
                                                "svg",
                                                {
                                                    width: "20",
                                                    height: "20",
                                                    viewBox: "0 0 20 20",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg"
                                                },
                                                React.createElement("path", {
                                                    fillRule: "evenodd",
                                                    clipRule: "evenodd",
                                                    d: "M10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V9.25H15C15.4142 9.25 15.75 9.58579 15.75 10C15.75 10.4142 15.4142 10.75 15 10.75H10.75V15C10.75 15.4142 10.4142 15.75 10 15.75C9.58579 15.75 9.25 15.4142 9.25 15V10.75H5C4.58579 10.75 4.25 10.4142 4.25 10C4.25 9.58579 4.58579 9.25 5 9.25H9.25V5C9.25 4.58579 9.58579 4.25 10 4.25Z",
                                                    fill: "#2277F6"
                                                })
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "ul",
                                        null,
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement("div", { className: "skeleton __folder _sub" }),
                                            React.createElement("div", { className: "skeleton __circle __medium" })
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement("div", { className: "skeleton __folder _sub" }),
                                            React.createElement("div", { className: "skeleton __circle __medium" })
                                        )
                                    )
                                ),
                                React.createElement("div", { className: "skeleton the-desc" }),
                                React.createElement(
                                    "div",
                                    { className: "bottom" },
                                    React.createElement("div", { className: "skeleton" }),
                                    React.createElement("div", { className: "skeleton" })
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-section" },
                        React.createElement(
                            "div",
                            { className: "middle-top" },
                            React.createElement(
                                "div",
                                { className: "desktop-search" },
                                React.createElement("input", {
                                    type: "search",
                                    placeholder: "Search..."
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "info-row" },
                                React.createElement(
                                    "div",
                                    { className: "all-check" },
                                    React.createElement(
                                        "label",
                                        { className: "container-checkbox" },
                                        React.createElement("input", { type: "checkbox" }),
                                        React.createElement("span", { className: "checkmark" }),
                                        " "
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "arrow-btn" },
                                    React.createElement(
                                        "div",
                                        { className: "dropdown" },
                                        React.createElement("button", {
                                            className: "btn btn-secondary dropdown-toggle",
                                            type: "button",
                                            id: "mail-sort",
                                            "data-bs-toggle": "dropdown",
                                            "aria-expanded": "false"
                                        })
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "info-row-right" },
                                    React.createElement(
                                        "div",
                                        { className: "referesh-btn" },
                                        React.createElement(
                                            "button",
                                            {
                                                id: "referesh-btn",
                                                className: "icon-btn"
                                            },
                                            " ",
                                            React.createElement("i", null),
                                            " "
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ellipsis-dropdown" },
                                        React.createElement("button", { type: "button" })
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "middle-content" },
                            React.createElement(
                                "div",
                                { className: "inbox-list" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "the-email-item" },
                                            React.createElement(
                                                "div",
                                                { className: "the-checkbox" },
                                                React.createElement("span", { className: "the-iicon" })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "the-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-flex no-space" },
                                                        React.createElement("div", { className: "skeleton _w_54" }),
                                                        React.createElement("div", { className: "skeleton __circle __small" })
                                                    ),
                                                    React.createElement("div", { className: "skeleton _w_54" })
                                                ),
                                                React.createElement("div", { className: "skeleton _w_99" }),
                                                React.createElement("div", { className: "skeleton _w_250" }),
                                                React.createElement(
                                                    "div",
                                                    { className: "the-flex" },
                                                    React.createElement("div", { className: "skeleton _w_194" }),
                                                    React.createElement("div", { className: "skeleton __circle __small" })
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "right-side" },
                        React.createElement(
                            "div",
                            { className: "email-conetent-wrp" },
                            React.createElement(
                                "div",
                                { className: "email-content-top" },
                                React.createElement(
                                    "div",
                                    { className: "loading-select-email" },
                                    React.createElement(
                                        "div",
                                        { className: "the-circle" },
                                        React.createElement("div", { className: "skeleton __circle" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "the-content" },
                                        React.createElement("div", { className: "skeleton" }),
                                        React.createElement("div", { className: "skeleton" }),
                                        React.createElement("div", { className: "skeleton" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "the-action" },
                                        React.createElement("button", { type: "button" })
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(SyncUserObj, null),
                React.createElement(DialogPop, null),
                React.createElement(DontInterrupt, null),
                React.createElement(SecondPass, null),
                React.createElement(LogOutForce, null),
                React.createElement(InfoPop, null),
                React.createElement(AskForPass, null),
                React.createElement(DialogPop, null),
                React.createElement(DontInterrupt, null),
                React.createElement(Loading, null)
            );
        }
    });
});