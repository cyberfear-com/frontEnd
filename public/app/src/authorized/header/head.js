define([
    "react",
    "app",
    "accounting",
    "cmpld/authorized/mailbox/notifications",
], function (React, app, accounting, Notifications) {
    return React.createClass({
        getInitialState: function () {
            return {
                userEmail: "",
                notificationFlag: false,
            };
        },
        componentDidMount: function () {

            if(!app.user.get("warningSet")){
                app.user.set({
                    warningSet: true
                });
                if(app.user.get("userPlan")["needRenew"] || app.user.get("userPlan")["pastDue"] === 1) {
                    Backbone.history.navigate("settings/Plan", {trigger: true});
                }
            }

        },
        handleCopyEmail: function () {
            const _this = this;
            if (!navigator.clipboard) {
                console.log("clipboard-not-found");
            } else {
                const emailElement =
                    document.getElementsByClassName("user-email")[0];
                navigator.clipboard
                    .writeText(emailElement.innerHTML)
                    .then(function () {
                        $("#email-copy").removeClass("hide").addClass("show");
                        _this.hideCopyEmailNotification();
                    });
            }
        },
        hideCopyEmailNotification: function () {
            setTimeout(function () {
                $("#email-copy").removeClass("show").addClass("hide");
            }, 1500);
        },
        handleClick: function (i) {
            switch (i) {
                case "logOut":
                    app.auth.logout();
                    break;
                case "leftSideCanvas":
                    console.log("left side canvas open button clicked");
                    break;
                case "settings":
                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            $("#settings-spinner")
                                .removeClass("d-none")
                                .addClass("d-block");
                            Backbone.history.navigate("/settings/Plan", {
                                trigger: true,
                            });
                        }
                    });
                    document.body.style.removeProperty("overflow");
                    window.document.body.style.removeProperty("overflow");
                    break;
                case "premiumplans":
                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            $("#settings-spinner")
                                .removeClass("d-none")
                                .addClass("d-block");
                            Backbone.history.navigate("/settings/Plan", {
                                trigger: true,
                            });
                        }
                    });
                    break;
                case "open-notifications":
                    this.setState({
                        notificationFlag: !this.state.notificationFlag,
                    });
                    break;
            }
        },
        handleSearchChange: function (event) {
            if (event.target.value.length > 1) {
                $(".mobile-search").addClass("has-data");
            } else {
                $(".mobile-search").removeClass("has-data");
            }
            $("#emailListTable")
                .DataTable()
                .column(0)
                .search(event.target.value, 0, 1)
                .draw();
        },
        handleSearchReset: function () {
            $("#mobile-search").val("");
            $(".mobile-search").removeClass("has-data");
            $("#emailListTable").DataTable().column(0).search("", 0, 1);
        },
        render: function () {
            return (
                <div>
                    <div className="position-fixed end-0 toast-index show">
                        <div
                            className="toast align-items-center text-white bg-primary border-0 fade hide"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                            autohide="true"
                            data-bs-delay="1500"
                            id="email-copy"
                        >
                            <div className="d-flex">
                                <div className="toast-body">
                                    <span className="toast-icon"></span>
                                    <div className="d-inline-block">
                                        Email Copied!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <header>
                        <div className="logo-2">
                            <div className="menu-icon on-left-side">
                                <button
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasLeft"
                                    aria-controls="offcanvasLeft"
                                >
                                    <svg
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 24 24"
                                        xmlSpace="preserve"
                                    >
                                        <path
                                            fill="#080D13"
                                            d="M1.2,3.2h21.7c0.6,0,1.1,0.5,1.1,1.1l0,0c0,0.6-0.5,1.1-1.1,1.1H1.2C0.5,5.4,0,4.9,0,4.3l0,0C0,3.7,0.5,3.2,1.2,3.2z"
                                        />
                                        <path
                                            fill="#080D13"
                                            d="M1.2,11.3h21.7c0.6,0,1.1,0.5,1.1,1.1l0,0c0,0.6-0.5,1.1-1.1,1.1H1.2C0.5,13.5,0,13,0,12.4l0,0C0,11.8,0.5,11.3,1.2,11.3z"
                                        />
                                        <path
                                            fill="#080D13"
                                            d="M1.2,19.4h21.7c0.6,0,1.1,0.5,1.1,1.1l0,0c0,0.6-0.5,1.1-1.1,1.1H1.2c-0.6,0-1.1-0.5-1.1-1.1l0,0C0,19.9,0.5,19.4,1.2,19.4z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <a href="#" className="mobile-logo">
                                <img
                                    src="images/logo.svg"
                                    alt=""
                                    className="light-theme"
                                />
                                <span className="folder-name">
                                    {app.user.get("currentFolder") !== ""
                                        ? app.user.get("currentFolder")
                                        : "Inbox"}
                                </span>
                                <img
                                    src="images/logo-white.svg"
                                    alt=""
                                    className="dark-theme"
                                />
                            </a>
                        </div>
                        <div className="right-top-data">
                            {((app.user.get("userPlan")["paymentVersion"]==2 && app.user.get("userPlan")["planSelected"]==3) || (app.user.get("userPlan")["paymentVersion"]==3 && app.user.get("userPlan")["planSelected"]=="free") ) &&
                                <div className="go-premium-button">
                                    <a
                                        className="button"
                                        onClick={this.handleClick.bind(
                                            null,
                                            "premiumplans"
                                        )}
                                    >
                                    <span className="icon">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.8989 6.07709L13.5656 8.46043C13.1239 8.77709 12.4906 8.58543 12.2989 8.07709L10.7239 3.87709C10.4573 3.15209 9.43228 3.15209 9.16561 3.87709L7.58228 8.06876C7.39061 8.58543 6.76561 8.77709 6.32395 8.45209L2.99061 6.06876C2.32395 5.60209 1.44061 6.26043 1.71561 7.03543L5.18228 15.7438C5.29895 16.0771 5.61561 16.2938 5.96561 16.2938H13.9073C14.2573 16.2938 14.5739 16.0688 14.6906 15.7438L18.1573 7.03543C18.4406 6.26043 17.5573 5.60209 16.8989 6.07709ZM12.0239 14.7688H7.85728C7.51561 14.7688 7.23228 14.4854 7.23228 14.1438C7.23228 13.8021 7.51561 13.5188 7.85728 13.5188H12.0239C12.3656 13.5188 12.6489 13.8021 12.6489 14.1438C12.6489 14.4854 12.3656 14.7688 12.0239 14.7688Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </span>
                                        <span className="off">{`%50`}</span>
                                        <span className="off shadow">{`%50`}</span>
                                        <span>Go Premium</span>
                                    </a>
                                </div>
                            }

                            <div className="icon-notification d-none">
                                <button
                                    onClick={this.handleClick.bind(
                                        null,
                                        "open-notifications"
                                    )}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12.0001 2.25C8.19416 2.25 4.98379 5.08406 4.51172 8.86064L3.5228 16.772C3.32514 18.3533 4.55813 19.75 6.15174 19.75H7.5127L7.56505 19.8678C8.34402 21.6205 10.0821 22.75 12.0001 22.75C13.9181 22.75 15.6562 21.6205 16.4352 19.8678L16.4875 19.75H17.8485C19.4421 19.75 20.6751 18.3533 20.4775 16.772L19.4886 8.86064C19.0165 5.08406 15.8061 2.25 12.0001 2.25ZM16.0172 18.25C16.0061 18.2498 15.9949 18.2498 15.9838 18.25H8.0164C8.00528 18.2498 7.99415 18.2498 7.98299 18.25H6.15174C5.46038 18.25 4.92547 17.6441 5.01122 16.958L6.00014 9.04669C6.37838 6.02075 8.95065 3.75 12.0001 3.75C15.0496 3.75 17.6219 6.02075 18.0001 9.04669L18.9891 16.958C19.0748 17.6441 18.5399 18.25 17.8485 18.25H16.0172ZM9.20531 19.75H14.7949C14.1807 20.6765 13.1361 21.25 12.0001 21.25C10.8641 21.25 9.8195 20.6765 9.20531 19.75Z"
                                        />
                                    </svg>

                                    <span>12</span>
                                </button>
                            </div>
                            <div className="user-dropdown">
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        id="user-dropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {" "}
                                        {/* <img src="images/user.jpg" alt="" /> */}
                                        <div className="user-avatar">
                                            <label className="user-letter">
                                                {app.user
                                                    .get("email")
                                                    .charAt(0)}
                                            </label>
                                        </div>{" "}
                                        {app.user.get("displayName") !== ""
                                            ? app.user.get("displayName")
                                            : "Me"}{" "}
                                        <span className="arrow"></span>
                                        <br />
                                        <span className="user-email">
                                            {app.user.get("email")}
                                        </span>{" "}
                                    </button>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="user-dropdown"
                                    >
                                        <li>
                                            <button
                                                id="email-copy"
                                                onClick={this.handleCopyEmail}
                                            >
                                                <span className="__icon">
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        className="fill-evenodd"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M6.66675 1.04175L6.62102 1.04175C5.48136 1.04173 4.56276 1.04172 3.84029 1.13885C3.0902 1.2397 2.45864 1.45544 1.95704 1.95704C1.45544 2.45864 1.2397 3.0902 1.13885 3.84029C1.04172 4.56276 1.04173 5.48136 1.04175 6.62102V6.66675V8.33342V8.37914C1.04173 9.5188 1.04172 10.4374 1.13885 11.1599C1.2397 11.91 1.45544 12.5415 1.95704 13.0431C2.45864 13.5447 3.0902 13.7605 3.84029 13.8613C4.43613 13.9414 5.16537 13.9555 6.04199 13.9579C6.04347 14.8308 6.05402 15.5527 6.12885 16.1408C6.21918 16.8506 6.412 17.4527 6.86276 17.9446C6.92418 18.0117 6.9885 18.076 7.05553 18.1374C7.54744 18.5882 8.1496 18.781 8.85938 18.8713C9.54404 18.9584 10.4103 18.9584 11.4849 18.9584H11.5279H13.3334H13.3792C14.5188 18.9584 15.4374 18.9584 16.1599 18.8613C16.91 18.7605 17.5415 18.5447 18.0431 18.0431C18.5447 17.5415 18.7605 16.91 18.8613 16.1599C18.9584 15.4374 18.9584 14.5189 18.9584 13.3793V13.3791V13.3334V11.5279V11.4849C18.9584 10.4103 18.9584 9.54404 18.8713 8.85938C18.781 8.1496 18.5882 7.54744 18.1374 7.05553C18.076 6.9885 18.0117 6.92418 17.9446 6.86276C17.4527 6.412 16.8506 6.21918 16.1408 6.12885C15.5527 6.05402 14.8308 6.04347 13.9579 6.04199C13.9555 5.16537 13.9414 4.43613 13.8613 3.84029C13.7605 3.0902 13.5447 2.45864 13.0431 1.95704C12.5415 1.45544 11.91 1.2397 11.1599 1.13885C10.4374 1.04172 9.5188 1.04173 8.37914 1.04175L8.33341 1.04175H6.66675ZM13.9584 7.29208V8.33341V8.37915V8.37917C13.9584 9.51881 13.9584 10.4374 13.8613 11.1599C13.7605 11.91 13.5447 12.5415 13.0431 13.0431C12.5415 13.5447 11.91 13.7605 11.1599 13.8613C10.4374 13.9584 9.51881 13.9584 8.37917 13.9584H8.37915H8.33342H7.29208C7.2938 14.8323 7.30435 15.4762 7.36885 15.983C7.44273 16.5635 7.5783 16.8753 7.78435 17.1001C7.82121 17.1404 7.8598 17.179 7.90002 17.2158C8.12488 17.4219 8.43666 17.5574 9.01718 17.6313C9.61371 17.7072 10.4001 17.7084 11.5279 17.7084H13.3334C14.5296 17.7084 15.3639 17.7071 15.9933 17.6225C16.6048 17.5402 16.9286 17.3899 17.1592 17.1592C17.3899 16.9286 17.5402 16.6048 17.6225 15.9933C17.7071 15.3639 17.7084 14.5296 17.7084 13.3334V11.5279C17.7084 10.4001 17.7072 9.61371 17.6313 9.01718C17.5574 8.43666 17.4219 8.12488 17.2158 7.90002C17.179 7.8598 17.1404 7.82121 17.1001 7.78435C16.8753 7.5783 16.5635 7.44273 15.983 7.36885C15.4762 7.30435 14.8322 7.2938 13.9584 7.29208ZM2.84092 2.84092C3.07156 2.61029 3.39537 2.45992 4.00685 2.3777C4.63631 2.29308 5.47057 2.29175 6.66675 2.29175H8.33341C9.52959 2.29175 10.3639 2.29308 10.9933 2.3777C11.6048 2.45992 11.9286 2.61029 12.1592 2.84092C12.3899 3.07156 12.5402 3.39537 12.6225 4.00685C12.7071 4.63631 12.7084 5.47057 12.7084 6.66675V8.33341C12.7084 9.52959 12.7071 10.3639 12.6225 10.9933C12.5402 11.6048 12.3899 11.9286 12.1592 12.1592C11.9286 12.3899 11.6048 12.5402 10.9933 12.6225C10.3639 12.7071 9.52959 12.7084 8.33342 12.7084H6.66675C5.47057 12.7084 4.63631 12.7071 4.00685 12.6225C3.39537 12.5402 3.07156 12.3899 2.84092 12.1592C2.61029 11.9286 2.45992 11.6048 2.3777 10.9933C2.29308 10.3639 2.29175 9.5296 2.29175 8.33342V6.66675C2.29175 5.47057 2.29308 4.63631 2.3777 4.00685C2.45992 3.39537 2.61029 3.07156 2.84092 2.84092Z"
                                                            fill="#22282F"
                                                        />
                                                    </svg>
                                                </span>
                                                Copy my email address
                                            </button>
                                        </li>
                                        <li>
                                            <a
                                                onClick={this.handleClick.bind(
                                                    null,
                                                    "settings"
                                                )}
                                                data-bs-dismiss="offcanvas"
                                                data-bs-target="#offcanvasRight"
                                                aria-label="Close"
                                            >
                                                <span className="__icon">
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g id="Iconly/Light/Setting">
                                                            <g id="Setting">
                                                                <path
                                                                    id="Path_33946"
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M20.8054 7.62288L20.183 6.54279C19.6564 5.62887 18.4895 5.31359 17.5743 5.83798V5.83798C17.1387 6.09461 16.6189 6.16742 16.1295 6.04035C15.6401 5.91329 15.2214 5.59678 14.9656 5.16064C14.8011 4.88342 14.7127 4.56766 14.7093 4.24531V4.24531C14.7242 3.72849 14.5292 3.22767 14.1688 2.85694C13.8084 2.4862 13.3133 2.27713 12.7963 2.27734H11.5423C11.0357 2.27734 10.5501 2.47918 10.1928 2.83821C9.83547 3.19724 9.63595 3.68386 9.63839 4.19039V4.19039C9.62338 5.23619 8.77126 6.07608 7.72535 6.07597C7.40299 6.07262 7.08724 5.98421 6.81001 5.81968V5.81968C5.89484 5.29528 4.72789 5.61056 4.20132 6.52448L3.53313 7.62288C3.00719 8.53566 3.31818 9.70187 4.22878 10.2316V10.2316C4.82068 10.5733 5.18531 11.2049 5.18531 11.8883C5.18531 12.5718 4.82068 13.2033 4.22878 13.5451V13.5451C3.31934 14.0712 3.00801 15.2346 3.53313 16.1446V16.1446L4.1647 17.2339C4.41143 17.679 4.82538 18.0076 5.31497 18.1467C5.80456 18.2859 6.32942 18.2242 6.7734 17.9753V17.9753C7.20986 17.7206 7.72997 17.6508 8.21812 17.7815C8.70627 17.9121 9.12201 18.2323 9.37294 18.6709C9.53748 18.9482 9.62589 19.2639 9.62924 19.5863V19.5863C9.62924 20.6428 10.4857 21.4993 11.5423 21.4993H12.7963C13.8493 21.4993 14.7043 20.6484 14.7093 19.5954V19.5954C14.7069 19.0873 14.9076 18.5993 15.2669 18.24C15.6262 17.8807 16.1143 17.6799 16.6224 17.6824C16.944 17.691 17.2584 17.779 17.5377 17.9387V17.9387C18.4505 18.4646 19.6167 18.1536 20.1464 17.243V17.243L20.8054 16.1446C21.0605 15.7068 21.1305 15.1853 21 14.6956C20.8694 14.206 20.549 13.7886 20.1098 13.5359V13.5359C19.6705 13.2832 19.3502 12.8658 19.2196 12.3762C19.089 11.8866 19.159 11.3651 19.4141 10.9272C19.58 10.6376 19.8202 10.3975 20.1098 10.2316V10.2316C21.0149 9.70216 21.3252 8.54276 20.8054 7.63203V7.63203V7.62288Z"
                                                                    stroke="#080D13"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                                <circle
                                                                    id="Ellipse_737"
                                                                    cx="12.1752"
                                                                    cy="11.8881"
                                                                    r="2.63616"
                                                                    stroke="#080D13"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </span>
                                                Settings
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={this.handleClick.bind(
                                                    null,
                                                    "logOut"
                                                )}
                                            >
                                                <span className="__icon">
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g clip-path="url(#clip0_70_872)">
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M6.66667 1.04224H6.63684C5.88331 1.04223 5.27558 1.04222 4.78533 1.08665C4.28005 1.13245 3.83855 1.22936 3.4375 1.46091C2.96244 1.73518 2.56795 2.12968 2.29367 2.60474C2.06213 3.00578 1.96522 3.44728 1.91942 3.95257C1.87499 4.44281 1.87499 5.05054 1.875 5.80407L1.875 5.80407L1.875 5.8339L1.875 14.1672L1.875 14.1971L1.875 14.1971C1.87499 14.9506 1.87498 15.5583 1.91942 16.0486C1.96521 16.5539 2.06213 16.9954 2.29367 17.3964C2.56795 17.8715 2.96244 18.266 3.4375 18.5402C3.83854 18.7718 4.28004 18.8687 4.78533 18.9145C5.27557 18.9589 5.8833 18.9589 6.63684 18.9589H6.66667H6.6965C7.45003 18.9589 8.05776 18.9589 8.548 18.9145C9.05329 18.8687 9.49479 18.7718 9.89583 18.5402C10.3709 18.266 10.7654 17.8715 11.0397 17.3964C11.2712 16.9954 11.3681 16.5539 11.4139 16.0486C11.4583 15.5583 11.4583 14.9506 11.4583 14.1971V14.1971V14.1672V13.3339C11.4583 12.9887 11.1785 12.7089 10.8333 12.7089C10.4882 12.7089 10.2083 12.9887 10.2083 13.3339V14.1672C10.2083 14.9576 10.2077 15.5086 10.169 15.9357C10.1311 16.3543 10.0605 16.5923 9.95713 16.7714C9.79257 17.0564 9.55587 17.2931 9.27083 17.4577C9.09175 17.5611 8.85376 17.6316 8.43517 17.6696C8.00799 17.7083 7.45702 17.7089 6.66667 17.7089C5.87632 17.7089 5.32534 17.7083 4.89816 17.6696C4.47957 17.6316 4.24158 17.5611 4.0625 17.4577C3.77746 17.2931 3.54077 17.0564 3.3762 16.7714C3.27281 16.5923 3.20225 16.3543 3.16432 15.9357C3.1256 15.5086 3.125 14.9576 3.125 14.1672L3.125 5.8339C3.125 5.04355 3.1256 4.49258 3.16432 4.0654C3.20226 3.64681 3.27281 3.40882 3.3762 3.22974C3.54077 2.9447 3.77747 2.708 4.0625 2.54344C4.24159 2.44004 4.47957 2.36949 4.89816 2.33155C5.32535 2.29284 5.87632 2.29224 6.66667 2.29224C7.45702 2.29224 8.00799 2.29284 8.43517 2.33155C8.85376 2.36949 9.09175 2.44004 9.27083 2.54344C9.55587 2.708 9.79257 2.9447 9.95713 3.22974C10.0605 3.40882 10.1311 3.64681 10.169 4.0654C10.2077 4.49258 10.2083 5.04355 10.2083 5.8339L10.2083 6.66724C10.2083 7.01241 10.4882 7.29224 10.8333 7.29224C11.1785 7.29224 11.4583 7.01241 11.4583 6.66724L11.4583 5.8339V5.80407V5.80404C11.4583 5.05052 11.4583 4.4428 11.4139 3.95257C11.3681 3.44728 11.2712 3.00578 11.0397 2.60474C10.7654 2.12968 10.3709 1.73518 9.89583 1.46091C9.49479 1.22937 9.05329 1.13245 8.548 1.08666C8.05776 1.04222 7.45003 1.04223 6.6965 1.04224H6.66667ZM14.6086 6.22489C14.3645 5.98081 13.9688 5.98081 13.7247 6.22489C13.4806 6.46897 13.4806 6.86469 13.7247 7.10877L15.9911 9.37516L6.66667 9.37516C6.32149 9.37516 6.04167 9.65498 6.04167 10.0002C6.04167 10.3453 6.32149 10.6252 6.66667 10.6252L15.9911 10.6252L13.7247 12.8916C13.4806 13.1356 13.4806 13.5314 13.7247 13.7754C13.9688 14.0195 14.3645 14.0195 14.6086 13.7754L17.9419 10.4421C18.186 10.198 18.186 9.8023 17.9419 9.55822L14.6086 6.22489Z"
                                                                fill="#080D13"
                                                            />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_70_872">
                                                                <rect
                                                                    width="20"
                                                                    height="20"
                                                                    fill="white"
                                                                />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </span>
                                                Log out
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="menu-icon">
                                <button
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasRight"
                                    aria-controls="offcanvasRight"
                                >
                                    <svg
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 24 24"
                                        xmlSpace="preserve"
                                    >
                                        <path
                                            fill="#080D13"
                                            d="M1.2,3.2h21.7c0.6,0,1.1,0.5,1.1,1.1l0,0c0,0.6-0.5,1.1-1.1,1.1H1.2C0.5,5.4,0,4.9,0,4.3l0,0C0,3.7,0.5,3.2,1.2,3.2z"
                                        />
                                        <path
                                            fill="#080D13"
                                            d="M1.2,11.3h21.7c0.6,0,1.1,0.5,1.1,1.1l0,0c0,0.6-0.5,1.1-1.1,1.1H1.2C0.5,13.5,0,13,0,12.4l0,0C0,11.8,0.5,11.3,1.2,11.3z"
                                        />
                                        <path
                                            fill="#080D13"
                                            d="M1.2,19.4h21.7c0.6,0,1.1,0.5,1.1,1.1l0,0c0,0.6-0.5,1.1-1.1,1.1H1.2c-0.6,0-1.1-0.5-1.1-1.1l0,0C0,19.9,0.5,19.4,1.2,19.4z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="mobile-search">
                        <input
                            type="search"
                            placeholder="Search..."
                            id="mobile-search"
                            onChange={this.handleSearchChange}
                        />
                        <span
                            className="icon"
                            onClick={this.handleSearchReset}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                            >
                                <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
                            </svg>
                        </span>
                    </div>
                    {this.state.notificationFlag && <Notifications />}
                </div>
            );
        },
    });
});
