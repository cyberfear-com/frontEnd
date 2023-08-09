define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        componentDidMount: function () {
            //
            document.querySelectorAll(".dropup").forEach(function (everydropdown) {
                everydropdown.addEventListener("shown.bs.dropdown", function () {
                    el_overlay = document.createElement("span");
                    el_overlay.className = "screen-darken";
                    document.body.appendChild(el_overlay);
                });

                everydropdown.addEventListener("hide.bs.dropdown", function () {
                    document.body.removeChild(document.querySelector(".screen-darken"));
                });
            });
        },
        getInitialState: function () {
            return {
                setings: { profile: "active" },
                activeLink: "",
                activeParentLink: "settings"
            };
        },
        boxSize: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    { className: "used_one" },
                    accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024 / 1024, 2),
                    " ",
                    "GB",
                    " "
                ),
                React.createElement(
                    "span",
                    null,
                    "\xA0/\xA0",
                    React.createElement(
                        "strong",
                        null,
                        app.user.get("userPlan")["planData"]["bSize"] / 1000,
                        " ",
                        "GB"
                    )
                )
            );
        },
        handleClick: function (i) {
            if (!app.user.get("inProcess")) {
                this.props.updateAct(i);

                switch (i) {
                    case "back-to-inbox":
                        app.user.set({ isComposingEmail: false });
                        app.user.set({ isDraftOpened: false });
                        app.user.set({ isDecryptingEmail: false });
                        Backbone.history.navigate("/mail/Inbox", {
                            trigger: true
                        });
                        break;
                    case "Profile":
                        this.setState({
                            activeLink: `Profile`,
                            activeParentLink: `settings`
                        });
                        Backbone.history.navigate("/settings/Profile", {
                            trigger: true
                        });
                        break;
                    case "Layout":
                        this.setState({
                            activeLink: `Layout`,
                            activeParentLink: `mailbox`
                        });
                        Backbone.history.navigate("/settings/Layout", {
                            trigger: true
                        });
                        break;
                    case "Session-Timeout":
                        this.setState({
                            activeLink: `Session-Timeout`,
                            activeParentLink: `security`
                        });
                        Backbone.history.navigate("/settings/Session-Timeout", {
                            trigger: true
                        });
                        break;
                    case "Password":
                        this.setState({
                            activeLink: `Password`,
                            activeParentLink: `security`
                        });
                        Backbone.history.navigate("/settings/Password", {
                            trigger: true
                        });
                        break;
                    case "Aliases":
                        this.setState({
                            activeLink: `Aliases`,
                            activeParentLink: `profile`
                        });
                        Backbone.history.navigate("/settings/Aliases", {
                            trigger: true
                        });
                        break;
                    case "Disposable-Aliases":
                        this.setState({
                            activeLink: `Disposable-Aliases`,
                            activeParentLink: `profile`
                        });
                        Backbone.history.navigate("/settings/Disposable-Aliases", {
                            trigger: true
                        });
                        break;
                    case "Custom-Domain":
                        this.setState({
                            activeLink: `Custom-Domain`,
                            activeParentLink: `profile`
                        });
                        Backbone.history.navigate("/settings/Custom-Domain", {
                            trigger: true
                        });
                        break;
                    case "2-Step":
                        this.setState({
                            activeLink: `2-Step`,
                            activeParentLink: `security`
                        });
                        Backbone.history.navigate("/settings/2-Step", {
                            trigger: true
                        });
                        break;
                    case "Contacts":
                        this.setState({
                            activeLink: `Contacts`,
                            activeParentLink: `profile`
                        });
                        Backbone.history.navigate("/settings/Contacts", {
                            trigger: true
                        });
                        break;
                    case "WebDiv":
                        this.setState({
                            activeLink: `WebDiv`
                        });
                        Backbone.history.navigate("/settings/WebDiv", {
                            trigger: true
                        });
                        break;
                    case "PGP-Keys":
                        this.setState({
                            activeLink: `PGP-Keys`,
                            activeParentLink: `security`
                        });
                        Backbone.history.navigate("/settings/PGP-Keys", {
                            trigger: true
                        });
                        break;

                    case "AdminPanel":
                        this.setState({
                            activeLink: `AdminPanel`
                        });
                        Backbone.history.navigate("/settings/AdminPanel", {
                            trigger: true
                        });
                        break;

                    case "Filter":
                        this.setState({
                            activeLink: `Filter`,
                            activeParentLink: `mailbox`
                        });
                        Backbone.history.navigate("/settings/Filter", {
                            trigger: true
                        });
                        break;
                    case "BlackList":
                        this.setState({
                            activeLink: `BlackList`,
                            activeParentLink: `mailbox`
                        });
                        Backbone.history.navigate("/settings/Black-List", {
                            trigger: true
                        });
                        break;
                    case "Folders":
                        this.setState({
                            activeLink: `Folders`,
                            activeParentLink: `mailbox`
                        });
                        Backbone.history.navigate("/settings/Folders", {
                            trigger: true
                        });
                        break;

                    case "Security-Log":
                        this.setState({
                            activeLink: `Security-Log`
                        });
                        Backbone.history.navigate("/settings/Security-Log", {
                            trigger: true
                        });
                        break;
                    case "Coupon":
                        this.setState({
                            activeLink: `Coupon`,
                            activeParentLink: `premium`
                        });
                        Backbone.history.navigate("/settings/Coupons", {
                            trigger: true
                        });
                        break;

                    case "Plan":
                        this.setState({
                            activeLink: `Plan`,
                            activeParentLink: `premium`
                        });
                        Backbone.history.navigate("/settings/Plan", {
                            trigger: true
                        });
                        break;

                    case "Delete-Account":
                        this.setState({
                            activeLink: `Delete-Account`,
                            activeParentLink: `profile`
                        });
                        Backbone.history.navigate("/settings/Delete-Account", {
                            trigger: true
                        });
                        break;
                }
            } else {
                $("#infoModHead").html("Active Process");
                $("#infoModBody").html("Please cancel or wait until process is finished before go to the next page.");
                $("#infoModal").modal("show");

                //todo add cancel button
                //console.log('no');
            }
        },
        render: function () {
            //console.log(this.props.activeLink);
            //console.log(this.props.classes.leftClass);
            var admin = "hidden";
            if (app.transform.SHA512(app.user.get("loginEmail")) == "eff5ce297f6dbec57ea9b44cea193bd1f053ebd207efbecc751c11307a1ea1ef3f1f2ddc64d744685e69e842b50a88228cd50aa2d3d411bdbfd448e72448b98d" || app.transform.SHA512(app.user.get("loginEmail")) == "30742f1d394011fdaaa1842001d5b9a7332356b60004e48f3141c7e0c3de4e35430ebe4fabdd646454d397c0f8dfb5674a4891e0e7b53fe79695d0d098216689") {
                var admin = "";
            }
            var st3 = {
                width: accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024, 2) * 100 / app.user.get("userPlan")["planData"]["bSize"] + "%"
            };
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    {
                        className: "left-settings-mobile",
                        id: "settingsOptionsMobile"
                    },
                    React.createElement(
                        "div",
                        { className: "__container" },
                        React.createElement(
                            "div",
                            { className: "__items" },
                            React.createElement(
                                "div",
                                { className: "btn-group dropup" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: `btn dropdown-toggle ${this.state.activeParentLink === `profile` ? "active" : ""}`,
                                        "data-bs-toggle": "dropdown",
                                        "aria-expanded": "false"
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", { d: "M12.0011 14.5208C10.0873 14.5208 8.23129 14.6628 6.83177 15.1322C6.12838 15.3681 5.48724 15.7037 5.01556 16.1936C4.52695 16.7011 4.25034 17.3445 4.25034 18.1075H5.67934C5.67934 17.7214 5.8076 17.4313 6.04495 17.1848C6.29924 16.9207 6.70516 16.6819 7.28616 16.487C8.45545 16.0949 10.1176 15.9498 12.0011 15.9498V14.5208ZM4.25034 18.1075C4.25034 18.8691 4.52472 19.5128 5.01073 20.0222C5.48026 20.5142 6.11928 20.8531 6.82205 21.092C8.2201 21.5673 10.0769 21.7145 12.0011 21.7145V20.2855C10.1095 20.2855 8.44815 20.1355 7.28202 19.739C6.70271 19.5421 6.29813 19.3014 6.04459 19.0357C5.80752 18.7872 5.67934 18.4949 5.67934 18.1075H4.25034ZM12.0011 21.7145C13.9142 21.7145 15.7701 21.572 17.1698 21.1024C17.8733 20.8664 18.5145 20.5307 18.9862 20.0411C19.475 19.5339 19.7519 18.8907 19.7519 18.1279H18.3229C18.3229 18.5132 18.1947 18.803 17.9572 19.0496C17.7027 19.3137 17.2965 19.5526 16.7153 19.7476C15.5457 20.14 13.8835 20.2855 12.0011 20.2855V21.7145ZM19.7519 18.1279C19.7519 17.3664 19.4776 16.7226 18.9917 16.2132C18.5223 15.7211 17.8833 15.3823 17.1806 15.1434C15.7826 14.6681 13.9258 14.5208 12.0011 14.5208V15.9498C13.8932 15.9498 15.5546 16.0999 16.7206 16.4963C17.2998 16.6933 17.7043 16.9339 17.9577 17.1996C18.1947 17.4481 18.3229 17.7404 18.3229 18.1279H19.7519ZM15.7809 7.49497C15.7809 9.58242 14.0887 11.2754 12.0004 11.2754V12.7044C14.8781 12.7044 17.2099 10.3714 17.2099 7.49497H15.7809ZM12.0004 11.2754C9.91329 11.2754 8.22095 9.58253 8.22095 7.49497H6.79195C6.79195 10.3713 9.12368 12.7044 12.0004 12.7044V11.2754ZM8.22095 7.49497C8.22095 5.40741 9.91329 3.7145 12.0004 3.7145V2.2855C9.12368 2.2855 6.79195 4.6186 6.79195 7.49497H8.22095ZM12.0004 3.7145C14.0887 3.7145 15.7809 5.40751 15.7809 7.49497H17.2099C17.2099 4.6185 14.8781 2.2855 12.0004 2.2855V3.7145Z" })
                                        )
                                    ),
                                    React.createElement(
                                        "span",
                                        { className: "label" },
                                        "Profile"
                                    )
                                ),
                                React.createElement(
                                    "ul",
                                    { className: "dropdown-menu" },
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Contacts` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Contacts")
                                            },
                                            "Contacts"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Aliases` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Aliases")
                                            },
                                            "Alias"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Disposable-Aliases` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Disposable-Aliases")
                                            },
                                            "Disposable address"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Custom-Domain` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Custom-Domain")
                                            },
                                            "Custom domain"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Delete-Account` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Delete-Account")
                                            },
                                            "Delete account"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "btn-group dropup" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: `btn dropdown-toggle ${this.state.activeParentLink === `security` ? "active" : ""}`,
                                        "data-bs-toggle": "dropdown",
                                        "aria-expanded": "false"
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", { d: "M15.6981 9.4895C15.6981 9.90372 16.0339 10.2395 16.4481 10.2395C16.8623 10.2395 17.1981 9.90372 17.1981 9.4895H15.6981ZM16.4481 7.39327H17.1982L17.198 7.38404L16.4481 7.39327ZM11.9445 2.99986L11.9352 2.24991L11.935 2.24992L11.9445 2.99986ZM7.55105 7.37376L6.80105 7.36099V7.37376H7.55105ZM6.80105 9.4895C6.80105 9.90372 7.13683 10.2395 7.55105 10.2395C7.96526 10.2395 8.30105 9.90372 8.30105 9.4895H6.80105ZM12.7506 14.1257C12.7506 13.7115 12.4148 13.3757 12.0006 13.3757C11.5864 13.3757 11.2506 13.7115 11.2506 14.1257H12.7506ZM11.2506 16.2922C11.2506 16.7064 11.5864 17.0422 12.0006 17.0422C12.4148 17.0422 12.7506 16.7064 12.7506 16.2922H11.2506ZM17.1981 9.4895V7.39327H15.6981V9.4895H17.1981ZM17.198 7.38404C17.1627 4.51244 14.8053 2.21458 11.9352 2.24991L11.9537 3.7498C13.9959 3.72466 15.673 5.35979 15.6982 7.4025L17.198 7.38404ZM11.935 2.24992C9.12297 2.28525 6.84903 4.55013 6.80116 7.36099L8.30094 7.38653C8.335 5.38649 9.9531 3.77494 11.9539 3.7498L11.935 2.24992ZM6.80105 7.37376V9.4895H8.30105V7.37376H6.80105ZM15.7265 20.2495H8.27311V21.7495H15.7265V20.2495ZM8.27311 20.2495C6.64474 20.2495 5.32422 18.929 5.32422 17.3006H3.82422C3.82422 19.7574 5.81631 21.7495 8.27311 21.7495V20.2495ZM5.32422 17.3006V13.1169H3.82422V17.3006H5.32422ZM5.32422 13.1169C5.32422 11.4886 6.64474 10.168 8.27311 10.168V8.66803C5.81631 8.66803 3.82422 10.6601 3.82422 13.1169H5.32422ZM8.27311 10.168H15.7265V8.66803H8.27311V10.168ZM15.7265 10.168C17.3549 10.168 18.6754 11.4886 18.6754 13.1169H20.1754C20.1754 10.6601 18.1833 8.66803 15.7265 8.66803V10.168ZM18.6754 13.1169V17.3006H20.1754V13.1169H18.6754ZM18.6754 17.3006C18.6754 18.929 17.3549 20.2495 15.7265 20.2495V21.7495C18.1833 21.7495 20.1754 19.7574 20.1754 17.3006H18.6754ZM11.2506 14.1257V16.2922H12.7506V14.1257H11.2506Z" })
                                        )
                                    ),
                                    React.createElement(
                                        "span",
                                        { className: "label" },
                                        "Security"
                                    )
                                ),
                                React.createElement(
                                    "ul",
                                    { className: "dropdown-menu" },
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Password` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Password")
                                            },
                                            "Password"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `2-Step` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "2-Step")
                                            },
                                            "2FA"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `PGP-Keys` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "PGP-Keys")
                                            },
                                            "PGP Keys"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Session-Timeout` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Session-Timeout")
                                            },
                                            "Session Timeout"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "btn-group dropup" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: `btn dropdown-toggle ${this.state.activeParentLink === `mailbox` ? "active" : ""}`,
                                        "data-bs-toggle": "dropdown",
                                        "aria-expanded": "false"
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", {
                                                fillRule: "evenodd",
                                                clipRule: "evenodd",
                                                d: "M12.7494 1.99951C12.7494 1.5853 12.4136 1.24951 11.9994 1.24951C11.5852 1.24951 11.2494 1.5853 11.2494 1.99951V10.1889L9.52974 8.46918C9.23685 8.17629 8.76197 8.17629 8.46908 8.46918C8.17619 8.76207 8.17619 9.23695 8.46908 9.52984L11.4691 12.5298C11.762 12.8227 12.2368 12.8227 12.5297 12.5298L15.5297 9.52984C15.8226 9.23695 15.8226 8.76207 15.5297 8.46918C15.2368 8.17629 14.762 8.17629 14.4691 8.46918L12.7494 10.1889V1.99951ZM8.57837 3.24951L8.62251 3.24951H8.74941C9.16362 3.24951 9.49941 3.5853 9.49941 3.99951C9.49941 4.41373 9.16362 4.74951 8.74941 4.74951H8.62251C7.8543 4.74951 7.34436 4.75076 6.95636 4.79715C6.58839 4.84116 6.41523 4.9178 6.2917 5.01426C6.16816 5.11071 6.05181 5.26011 5.91987 5.60642C5.78076 5.97158 5.65587 6.46599 5.46955 7.21127L4.26065 12.0469C4.10501 12.6694 4.03723 12.9427 3.99128 13.2156L3.98565 13.2495H6.19693L6.30388 13.2495C6.91342 13.2489 7.39332 13.2485 7.83668 13.4035C8.10574 13.4975 8.35854 13.6328 8.58604 13.8046C8.9609 14.0875 9.22677 14.487 9.56446 14.9945L9.62374 15.0835C10.0499 15.7227 10.1717 15.8875 10.317 15.9972C10.4204 16.0753 10.5353 16.1368 10.6576 16.1795C10.8296 16.2396 11.0343 16.2495 11.8025 16.2495H12.1969C12.9651 16.2495 13.1699 16.2396 13.3418 16.1795C13.4641 16.1368 13.579 16.0753 13.6824 15.9972C13.8277 15.8875 13.9495 15.7227 14.3757 15.0835L14.4349 14.9945C14.7726 14.487 15.0385 14.0875 15.4134 13.8046C15.6409 13.6328 15.8937 13.4975 16.1627 13.4035C16.6061 13.2485 17.086 13.2489 17.6955 13.2495L17.8025 13.2495H20.0132L20.0075 13.2156C19.9616 12.9427 19.8938 12.6694 19.7382 12.0469L18.5293 7.21127C18.3429 6.466 18.2181 5.97158 18.0789 5.60642C17.947 5.26011 17.8307 5.11071 17.7071 5.01426C17.5836 4.9178 17.4104 4.84116 17.0425 4.79715C16.6545 4.75076 16.1445 4.74951 15.3763 4.74951H15.2494C14.8352 4.74951 14.4994 4.41373 14.4994 3.99951C14.4994 3.5853 14.8352 3.24951 15.2494 3.24951H15.3763L15.4204 3.24951C16.1328 3.24949 16.733 3.24947 17.2206 3.30777C17.7382 3.36966 18.2112 3.50481 18.6302 3.83195C19.0492 4.15909 19.2951 4.58526 19.4807 5.0724C19.6555 5.53125 19.801 6.11358 19.9738 6.80462L19.9845 6.84747L21.1934 11.6831L21.2017 11.7164C21.3468 12.2967 21.4299 12.629 21.4867 12.9665C21.5985 13.6304 21.6333 14.305 21.5904 14.9769C21.5686 15.3185 21.5202 15.6576 21.4356 16.2498L21.4307 16.2837L21.4119 16.4157C21.2433 17.5975 21.1355 18.3533 20.8467 18.982C20.2753 20.2262 19.1948 21.1633 17.8824 21.553C17.2191 21.75 16.4557 21.7498 15.2619 21.7495L15.1286 21.7495H8.87023L8.73694 21.7495C7.5431 21.7498 6.77972 21.75 6.11643 21.553C4.80398 21.1633 3.72352 20.2262 3.1521 18.982C2.86331 18.3533 2.75552 17.5975 2.58694 16.4156L2.56811 16.2837L2.56325 16.2497C2.47865 15.6576 2.4302 15.3185 2.4084 14.9769C2.36551 14.305 2.40031 13.6304 2.5121 12.9665C2.56894 12.629 2.65203 12.2966 2.79712 11.7163L2.80544 11.6831L4.01434 6.84747L4.02504 6.80464C4.19778 6.11359 4.34334 5.53125 4.51815 5.0724C4.70374 4.58526 4.94959 4.15908 5.36858 3.83195C5.78757 3.50481 6.26064 3.36966 6.77826 3.30777C7.2658 3.24947 7.86606 3.24949 8.57837 3.24951ZM3.90535 14.8813C3.90255 14.8374 3.90014 14.7935 3.89814 14.7495H6.19693C6.96514 14.7495 7.16986 14.7594 7.34176 14.8195C7.46406 14.8623 7.57898 14.9238 7.68238 15.0018C7.82773 15.1115 7.94954 15.2763 8.37567 15.9155L8.43494 16.0046C8.77264 16.512 9.0385 16.9115 9.41337 17.1945C9.64086 17.3662 9.89367 17.5015 10.1627 17.5955C10.6061 17.7505 11.086 17.7501 11.6955 17.7496L11.8025 17.7495H12.1969L12.3039 17.7496C12.9134 17.7501 13.3933 17.7505 13.8367 17.5955C14.1057 17.5015 14.3585 17.3662 14.586 17.1945C14.9609 16.9115 15.2268 16.512 15.5645 16.0046L15.6237 15.9155C16.0499 15.2763 16.1717 15.1115 16.317 15.0018C16.4204 14.9238 16.5353 14.8623 16.6576 14.8195C16.8296 14.7594 17.0343 14.7495 17.8025 14.7495H20.1007C20.0987 14.7935 20.0963 14.8374 20.0935 14.8813C20.0758 15.1575 20.0365 15.4363 19.9458 16.0716C19.7516 17.4308 19.6695 17.9512 19.4836 18.356C19.0926 19.2072 18.3534 19.8484 17.4554 20.115C17.0284 20.2418 16.5017 20.2495 15.1286 20.2495H8.87023C7.49716 20.2495 6.97039 20.2418 6.54343 20.115C5.64544 19.8484 4.90618 19.2072 4.5152 18.356C4.32931 17.9512 4.24721 17.4308 4.05303 16.0716C3.96228 15.4363 3.92298 15.1575 3.90535 14.8813Z"
                                            })
                                        )
                                    ),
                                    React.createElement(
                                        "span",
                                        { className: "label" },
                                        "Mailbox"
                                    )
                                ),
                                React.createElement(
                                    "ul",
                                    { className: "dropdown-menu" },
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Folders` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Folders")
                                            },
                                            "Folder / Label"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Filter` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Filter")
                                            },
                                            "Email filter"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `BlackList` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "BlackList")
                                            },
                                            "Blacklist / Whitelist"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Layout` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Layout")
                                            },
                                            "Layout"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "btn-group dropup" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: `btn dropdown-toggle ${this.state.activeParentLink === `premium` ? "active" : ""}`,
                                        "data-bs-toggle": "dropdown",
                                        "aria-expanded": "false"
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", { d: "M20.039 5.40891L20.5111 5.99169L20.5116 5.99128L20.039 5.40891ZM16.1346 8.57195L15.5762 9.07266C15.8428 9.36994 16.2955 9.40624 16.6061 9.15524L16.1346 8.57195ZM12.4403 4.41845L13.0009 3.92021L13.0008 3.92005L12.4403 4.41845ZM11.5598 4.41845L12.1202 4.91696L12.1203 4.91686L11.5598 4.41845ZM7.86556 8.57195L7.3941 9.15524C7.70463 9.40624 8.15737 9.36994 8.42394 9.07266L7.86556 8.57195ZM3.96113 5.40891L3.48854 5.99128L3.48904 5.99169L3.96113 5.40891ZM3.0096 5.96835L3.74827 5.83851L3.74824 5.83832L3.0096 5.96835ZM4.13529 13.3919L4.87758 13.2846L4.87755 13.2845L4.13529 13.3919ZM19.8649 13.3919L19.1226 13.2845L19.1226 13.2846L19.8649 13.3919ZM20.9906 5.96835L21.7293 6.0982L21.7295 6.09686L20.9906 5.96835ZM5.3345 19.0283C4.92028 19.0283 4.5845 19.3641 4.5845 19.7783C4.5845 20.1925 4.92028 20.5283 5.3345 20.5283V19.0283ZM18.6648 20.5283C19.079 20.5283 19.4148 20.1925 19.4148 19.7783C19.4148 19.3641 19.079 19.0283 18.6648 19.0283V20.5283ZM19.5669 4.82613C17.8861 6.18771 15.8505 7.83722 15.6631 7.98867L16.6061 9.15524C16.7943 9.00312 18.8314 7.35241 20.5111 5.99169L19.5669 4.82613ZM16.693 8.07124C16.5086 7.86563 14.0285 5.07631 13.0009 3.92021L11.8798 4.9167C12.9051 6.07036 15.3889 8.8638 15.5762 9.07266L16.693 8.07124ZM13.0008 3.92005C12.468 3.32092 11.5322 3.32092 10.9994 3.92005L12.1203 4.91686C12.0564 4.98865 11.9438 4.98865 11.8799 4.91686L13.0008 3.92005ZM10.9995 3.91995C9.9704 5.07669 7.49171 7.86546 7.30718 8.07124L8.42394 9.07266C8.61108 8.86397 11.0944 6.06999 12.1202 4.91696L10.9995 3.91995ZM8.33702 7.98867C8.14966 7.83722 6.11403 6.18771 4.43323 4.82613L3.48904 5.99169C5.16879 7.35241 7.2059 9.00312 7.3941 9.15524L8.33702 7.98867ZM4.43373 4.82654C3.47125 4.04549 2.05633 4.87925 2.27095 6.09839L3.74824 5.83832C3.75265 5.86338 3.74953 5.902 3.73101 5.93938C3.71465 5.97242 3.69214 5.99313 3.6716 6.00521C3.65104 6.01731 3.62194 6.02695 3.58503 6.0252C3.54325 6.02321 3.50807 6.00713 3.48854 5.99128L4.43373 4.82654ZM2.27092 6.0982C2.51558 7.49009 3.04391 11.0877 3.39303 13.4994L4.87755 13.2845C4.53005 10.884 3.99786 7.25843 3.74827 5.83851L2.27092 6.0982ZM3.393 13.4992C3.63818 15.1955 5.09185 16.4488 6.8031 16.4488V14.9488C5.83487 14.9488 5.01574 14.2406 4.87758 13.2846L3.393 13.4992ZM6.8031 16.4488H17.1971V14.9488H6.8031V16.4488ZM17.1971 16.4488C18.9083 16.4488 20.362 15.1955 20.6072 13.4992L19.1226 13.2846C18.9844 14.2406 18.1653 14.9488 17.1971 14.9488V16.4488ZM20.6071 13.4994C20.9563 11.0877 21.4846 7.49009 21.7293 6.0982L20.2519 5.83851C20.0023 7.25843 19.4701 10.884 19.1226 13.2845L20.6071 13.4994ZM21.7295 6.09686C21.9412 4.87963 20.5302 4.04446 19.5664 4.82654L20.5116 5.99128C20.4924 6.0069 20.4574 6.02302 20.4155 6.02504C20.3785 6.02682 20.3491 6.01715 20.3283 6.00492C20.3075 5.99269 20.2851 5.9719 20.2688 5.93909C20.2504 5.90201 20.2475 5.86403 20.2517 5.83985L21.7295 6.09686ZM5.3345 20.5283H18.6648V19.0283H5.3345V20.5283Z" })
                                        )
                                    ),
                                    React.createElement(
                                        "span",
                                        { className: "label" },
                                        "Premium"
                                    )
                                ),
                                React.createElement(
                                    "ul",
                                    { className: "dropdown-menu" },
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Plan` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Plan")
                                            },
                                            "Upgrade"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        {
                                            className: `${this.state.activeLink === `Coupon` ? "active" : ""}`
                                        },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "Coupon")
                                            },
                                            "Coupons"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "btn-group" },
                                React.createElement(
                                    "button",
                                    {
                                        className: `btn`,
                                        onClick: this.handleClick.bind(this, "back-to-inbox"),
                                        "aria-expanded": "false"
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon settings" },
                                        React.createElement(
                                            "svg",
                                            {
                                                clipRule: "evenodd",
                                                fillRule: "evenodd",
                                                strokeLinejoin: "round",
                                                strokeMiterlimit: "2",
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", {
                                                d: "m9.474 5.209s-4.501 4.505-6.254 6.259c-.147.146-.22.338-.22.53s.073.384.22.53c1.752 1.754 6.252 6.257 6.252 6.257.145.145.336.217.527.217.191-.001.383-.074.53-.221.293-.293.294-.766.004-1.057l-4.976-4.976h14.692c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.692l4.978-4.979c.289-.289.287-.761-.006-1.054-.147-.147-.339-.221-.53-.221-.191-.001-.38.071-.525.215z",
                                                "fill-rule": "nonzero"
                                            })
                                        )
                                    ),
                                    React.createElement(
                                        "span",
                                        { className: "label" },
                                        "Inbox"
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    {
                        className: this.props.classes.leftClass,
                        id: "leftSettingPanel"
                    },
                    React.createElement(
                        "div",
                        { className: "left-container" },
                        React.createElement(
                            "div",
                            { className: "logo" },
                            React.createElement(
                                "a",
                                {
                                    onClick: this.handleClick.bind(this, "back-to-inbox")
                                },
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
                            { className: "left-acco-menu" },
                            React.createElement(
                                "div",
                                {
                                    className: "accordion",
                                    id: "settingsAccordion"
                                },
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        {
                                            className: "accordion-header",
                                            id: "headingProfile"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "accordion-button icon-profile collapsed",
                                                type: "button",
                                                "data-bs-toggle": "collapse",
                                                "data-bs-target": "#collapseProfile",
                                                "aria-expanded": "false",
                                                "aria-controls": "collapseProfile"
                                            },
                                            "Profile"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            id: "collapseProfile",
                                            className: "accordion-collapse collapse",
                                            "aria-labelledby": "headingProfile",
                                            "data-bs-parent": "#settingsAccordion"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "accordion-body" },
                                            React.createElement(
                                                "div",
                                                { className: "acco-menu-list" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Contacts` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Contacts")
                                                            },
                                                            "Contacts"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Aliases` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Aliases")
                                                            },
                                                            "Alias"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Disposable-Aliases` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Disposable-Aliases")
                                                            },
                                                            "Disposable address"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Custom-Domain` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Custom-Domain")
                                                            },
                                                            "Custom domain"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Delete-Account` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Delete-Account")
                                                            },
                                                            "Delete account"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        {
                                            className: "accordion-header",
                                            id: "headingSecurity"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "accordion-button icon-security collapsed",
                                                type: "button",
                                                "data-bs-toggle": "collapse",
                                                "data-bs-target": "#collapseSecurity",
                                                "aria-expanded": "false",
                                                "aria-controls": "collapseSecurity"
                                            },
                                            "Security"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            id: "collapseSecurity",
                                            className: "accordion-collapse collapse",
                                            "aria-labelledby": "headingSecurity",
                                            "data-bs-parent": "#settingsAccordion"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "accordion-body" },
                                            React.createElement(
                                                "div",
                                                { className: "acco-menu-list" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Password` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Password")
                                                            },
                                                            "Password"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `2-Step` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "2-Step")
                                                            },
                                                            "2FA"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `PGP-Keys` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "PGP-Keys")
                                                            },
                                                            "PGP Keys"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Session-Timeout` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Session-Timeout")
                                                            },
                                                            "Session Timeout"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        {
                                            className: "accordion-header",
                                            id: "headingMailbox"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "accordion-button icon-mailbox collapsed",
                                                type: "button",
                                                "data-bs-toggle": "collapse",
                                                "data-bs-target": "#collapseMailbox",
                                                "aria-expanded": "false",
                                                "aria-controls": "collapseMailbox"
                                            },
                                            "Mailbox"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            id: "collapseMailbox",
                                            className: "accordion-collapse collapse",
                                            "aria-labelledby": "headingMailbox",
                                            "data-bs-parent": "#settingsAccordion"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "accordion-body" },
                                            React.createElement(
                                                "div",
                                                { className: "acco-menu-list" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Folders` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Folders")
                                                            },
                                                            "Folder / Label"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Filter` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Filter")
                                                            },
                                                            "Email filter"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `BlackList` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "BlackList")
                                                            },
                                                            "Blacklist / Whitelist"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Layout` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Layout")
                                                            },
                                                            "Layout"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        {
                                            className: "accordion-header",
                                            id: "headingPremium"
                                        },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "accordion-button icon-premium collapsed",
                                                type: "button",
                                                "data-bs-toggle": "collapse",
                                                "data-bs-target": "#collapsePremium",
                                                "aria-expanded": "false",
                                                "aria-controls": "collapsePremium"
                                            },
                                            "Premium"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        {
                                            id: "collapsePremium",
                                            className: "accordion-collapse collapse",
                                            "aria-labelledby": "headingPremium",
                                            "data-bs-parent": "#settingsAccordion"
                                        },
                                        React.createElement(
                                            "div",
                                            { className: "accordion-body" },
                                            React.createElement(
                                                "div",
                                                { className: "acco-menu-list" },
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Plan` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Plan")
                                                            },
                                                            "Upgrade"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        {
                                                            className: `${this.state.activeLink === `Coupon` ? "active" : ""}`
                                                        },
                                                        React.createElement(
                                                            "a",
                                                            {
                                                                onClick: this.handleClick.bind(this, "Coupon")
                                                            },
                                                            "Coupons"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "accordion-item" },
                                    React.createElement(
                                        "h2",
                                        { className: "accordion-header" },
                                        React.createElement(
                                            "a",
                                            {
                                                className: `accordion-button icon-setting collapsed ${this.state.activeLink === `Profile` ? "active" : ""}`,
                                                onClick: this.handleClick.bind(this, "Profile")
                                            },
                                            "Setting"
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "left-bottom" },
                        React.createElement(
                            "div",
                            { className: "storage" },
                            React.createElement(
                                "div",
                                { className: "storage-count" },
                                this.boxSize()
                            ),
                            React.createElement(
                                "div",
                                { className: "storage-bar" },
                                React.createElement("span", { style: st3 })
                            )
                        )
                    )
                )
            );
        }
    });
});