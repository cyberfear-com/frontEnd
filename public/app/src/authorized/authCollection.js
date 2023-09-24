define([
    "react",
    "app",
    "xss",
    "cmpld/authorized/mailbox/mailboxCollection",
    "cmpld/authorized/settings/settingsCollection",
    "cmpld/authorized/updates/updateVersion1",
    "cmpld/modals/secondPass",
    "cmpld/modals/syncUserObj",
    "cmpld/modals/logOutForce",
    "cmpld/modals/infoPop",
    "cmpld/modals/askForPass",
    "cmpld/modals/dialogPop",
    "cmpld/modals/dontInterrupt",
    "cmpld/modals/loading",
    "offline",
], function (
    React,
    app,
    xss,
    MailboxCollection,
    SettingsCollection,
    UpdateCollection,
    SecondPass,
    SyncUserObj,
    LogOutForce,
    InfoPop,
    AskForPass,
    DialogPop,
    DontInterrupt,
    Loading,
    offline
) {
    return React.createClass({
        getInitialState: function () {
            return {
                dfd: "",
                foderId: "",
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

                    $("#overlay, #loading-skeleton")
                        .removeClass("d-none")
                        .addClass("d-block");
                /*    $("#userObjSync").modal({
                        show: true,
                        backdrop: "static",
                        keyboard: true,
                    });*/

                 //   $("#secondPass").addClass("show d-block");

                    app.userObjects.startSession(function () {
                        $("#userObjSync").removeClass("show d-block");
                        $("#overlay, #loading-skeleton")
                            .removeClass("d-block")
                            .addClass("d-none");
                        $("#userObjSync").modal("hide");
                        app.sessionData.set({ sessionReady: true });
                        thisMod.setState({ dfd: "solved" });
                    });
                }
             /*   Offline.options = {
                    checks: {
                        xhr: {
                            url: "https://jsonplaceholder.typicode.com/posts/1",
                        },
                    },
                };*/

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
                folder: foderId,
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
                    body = (
                        <MailboxCollection
                            pp={this.props.folder}
                            activePage={this.state.folder}
                            changeFodlerId={this.changeFodlerId}
                            folderId={this.state.folder}
                            updateValue={this.updateValue}
                        />
                    );
                } else if (
                    page == "settings" &&
                    app.user.get("profileVersion") > 1
                ) {
                    body = (
                        <div>
                            <SettingsCollection
                                rightPanel={this.props.rightPanel}
                                activePage={this.props.activePage}
                            />
                        </div>
                    );

                    $("#settings-spinner")
                        .removeClass("d-block")
                        .addClass("d-none");
                } else if (
                    page == "settings" &&
                    app.user.get("profileVersion") == 1 &&
                    this.props.activePage == "updateVersion1"
                ) {
                    console.log(`settings`);
                    body = (
                        <SettingsCollection
                            rightPanel={this.props.rightPanel}
                            activePage="updateVersion1"
                        />
                    );
                } else if (app.user.get("profileVersion") == 1) {
                    Backbone.history.navigate("/settings/updateVersion1", {
                        trigger: true,
                    });
                }
            }

            return (
                <div
                    className="mailBody"
                    onClick={this.handleClick.bind(this, "resetTimer")}
                    onTouchEnd={this.handleClick.bind(this, "resetTimer")}
                    onKeyUp={this.handleClick.bind(this, "resetTimer")}
                >
                    {body}
                    <div id="overlay" className="d-none"></div>
                    <div
                        id="loading-skeleton"
                        className="loading-skeleton d-none"
                    >
                        <header>
                            <div className="logo-2">
                                <a href="#">
                                    <img
                                        src="images/logo.svg"
                                        alt=""
                                        className="light-theme"
                                    />{" "}
                                    <img
                                        src="images/logo-white.svg"
                                        alt=""
                                        className="dark-theme"
                                    />
                                </a>
                            </div>
                            <div className="right-top-data">
                                <div className="right-top-data-content">
                                    <div className="skeleton __circle"></div>
                                    <div className="skeleton __circle"></div>
                                    <div className="user-data">
                                        <div className="skeleton"></div>
                                        <div className="skeleton"></div>
                                    </div>
                                    <div className="skeleton __circle"></div>
                                </div>
                            </div>
                        </header>
                        <div className="mobile-search">
                            <input type="search" placeholder="Search..." />
                        </div>
                        <div className="left-side">
                            <div className="left-container">
                                <div className="logo">
                                    <a href="#">
                                        <img
                                            src="images/logo.svg"
                                            alt=""
                                            className="light-theme-logo"
                                        />{" "}
                                        <img
                                            src="images/logo-white.svg"
                                            alt=""
                                            className="dark-theme-logo"
                                        />
                                    </a>
                                </div>
                                <div className="new-message-btn">
                                    <button></button>
                                </div>
                                <div className="main-menu">
                                    <ul>
                                        <li>
                                            <div className="skeleton __folder _main"></div>
                                            <div className="skeleton __circle __medium"></div>
                                        </li>
                                        <li>
                                            <div className="skeleton __folder _main"></div>
                                            <div></div>
                                        </li>
                                        <li>
                                            <div className="skeleton __folder _main"></div>
                                            <div></div>
                                        </li>
                                        <li>
                                            <div className="skeleton __folder _main"></div>
                                            <div></div>
                                        </li>
                                        <li>
                                            <div className="skeleton __folder _main"></div>
                                            <div></div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="the-folders">
                                    <div className="main-menu the-folder-list">
                                        <div className="folders-heading">
                                            <div className="__first">
                                                {`Folders`}
                                                <div className="icon">
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M0.646446 0.313073C0.841709 0.11781 1.15829 0.11781 1.35355 0.313073L5 3.95952L8.64645 0.313072C8.84171 0.11781 9.15829 0.11781 9.35355 0.313072C9.54882 0.508334 9.54882 0.824917 9.35355 1.02018L5.35355 5.02018C5.15829 5.21544 4.84171 5.21544 4.64645 5.02018L0.646446 1.02018C0.451184 0.824917 0.451184 0.508335 0.646446 0.313073Z"
                                                            fill="#080D13"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="icon">
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V9.25H15C15.4142 9.25 15.75 9.58579 15.75 10C15.75 10.4142 15.4142 10.75 15 10.75H10.75V15C10.75 15.4142 10.4142 15.75 10 15.75C9.58579 15.75 9.25 15.4142 9.25 15V10.75H5C4.58579 10.75 4.25 10.4142 4.25 10C4.25 9.58579 4.58579 9.25 5 9.25H9.25V5C9.25 4.58579 9.58579 4.25 10 4.25Z"
                                                        fill="#2277F6"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="skeleton __folder _sub"></div>
                                                <div className="skeleton __circle __medium"></div>
                                            </li>
                                            <li>
                                                <div className="skeleton __folder _sub"></div>
                                                <div className="skeleton __circle __medium"></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skeleton the-desc"></div>
                                    <div className="bottom">
                                        <div className="skeleton"></div>
                                        <div className="skeleton"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="middle-section">
                            <div className="middle-top">
                                <div className="desktop-search">
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                    />
                                </div>
                                <div className="info-row">
                                    <div className="all-check">
                                        <label className="container-checkbox">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>{" "}
                                        </label>
                                    </div>
                                    <div className="arrow-btn">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-secondary dropdown-toggle"
                                                type="button"
                                                id="mail-sort"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            ></button>
                                        </div>
                                    </div>
                                    <div className="info-row-right">
                                        <div className="referesh-btn">
                                            <button
                                                id="referesh-btn"
                                                className="icon-btn"
                                            >
                                                {" "}
                                                <i></i>{" "}
                                            </button>
                                        </div>
                                        <div className="ellipsis-dropdown">
                                            <button type="button"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="middle-content">
                                <div className="inbox-list">
                                    <ul>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="the-email-item">
                                                <div className="the-checkbox">
                                                    <span className="the-iicon"></span>
                                                </div>
                                                <div className="the-content">
                                                    <div className="the-flex">
                                                        <div className="the-flex no-space">
                                                            <div className="skeleton _w_54"></div>
                                                            <div className="skeleton __circle __small"></div>
                                                        </div>
                                                        <div className="skeleton _w_54"></div>
                                                    </div>
                                                    <div className="skeleton _w_99"></div>
                                                    <div className="skeleton _w_250"></div>
                                                    <div className="the-flex">
                                                        <div className="skeleton _w_194"></div>
                                                        <div className="skeleton __circle __small"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="right-side">
                            <div className="email-conetent-wrp">
                                <div className="email-content-top">
                                    <div className="loading-select-email">
                                        <div className="the-circle">
                                            <div className="skeleton __circle"></div>
                                        </div>
                                        <div className="the-content">
                                            <div className="skeleton"></div>
                                            <div className="skeleton"></div>
                                            <div className="skeleton"></div>
                                        </div>
                                        <div className="the-action">
                                            <button type="button"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SyncUserObj />
                    <DialogPop />
                    <DontInterrupt />

                    <SecondPass />
                    <LogOutForce />
                    <InfoPop />
                    <AskForPass />
                    <DialogPop />
                    <DontInterrupt />
                    <Loading />
                </div>
            );
        },
    });
});
