define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                mainFolders: app.globalF.getMainFolderList(),
                customFolders: app.globalF.getCustomFolderList(),
                customLabels: app.globalF.getCustomLabelList(),
                moveFolderMain: [],
                moveFolderCust: [],
                unopened: app.user.get("unopenedEmails"),
                menuExpanded: true,
            };
        },
        componentDidMount: function () {
            var thisComp = this;

            thisComp.props.changeFodlerId(
                app.user.get("systemFolders")["inboxFolderId"]
            );

            thisComp.notifyMe();

            app.user.on("change:unopenedEmails", function () {
                thisComp.updateUnopened();
            });
        },
        componentWillUnmount: function () {
            app.user.off("change:unopenedEmails");
            app.user.off("change:currentMessageView", function () {});
        },

        updateUnopened: function () {
            var thisComp = this;
            this.setState({
                unopened: app.user.get("unopenedEmails"),
            });
        },

        removeClassesActive: function () {
            $("#folderul > li").removeClass("active");
            $("#folderulcustom > li").removeClass("active");
        },

        handleChange: function (i, event) {
            switch (i) {
                case "switchLabels":
                    $("#emailListTable")
                        .DataTable()
                        .column(0)
                        .search($(event.target).data("name"), 0, 1);
                    break;
                case "backToInbox":
                    // Reset the label filter first
                    $("#emailListTable").DataTable().column(0).search("", 0, 1);
                    var thisComp = this;
                    $("#wrapper").removeClass("email-read-active");
                    app.user.on(
                        "change:currentMessageView",
                        function () {},
                        this
                    );
                    $("#sdasdasd").addClass("hidden");
                    clearTimeout(app.user.get("emailOpenTimeOut"));

                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            // $("#mMiddlePanelTop").removeClass(
                            //     " hidden-xs hidden-sm hidden-md"
                            // );
                            $("#appRightSide").css("display", "none");
                            var folder =
                                app.user.get("folders")[
                                    $(event.target).data("target")
                                ]["name"];

                            thisComp.removeClassesActive();

                            Backbone.history.navigate(
                                "/mail/" + app.transform.from64str(folder),
                                {
                                    trigger: true,
                                }
                            );

                            app.user.set({
                                currentFolder: app.transform.from64str(folder),
                            });

                            app.user.set({ resetSelectedItems: true });
                            app.user.set({ isDecryptingEmail: false });

                            app.globalF.resetCurrentMessage();
                            app.globalF.resetDraftMessage();

                            thisComp.props.changeFodlerId(
                                $(event.target).data("target")
                            );
                            $("#" + $(event.target).data("target"))
                                .parents("li")
                                .addClass("active");

                            $("#mMiddlePanel").scrollTop(0);

                            app.layout.display("viewBox");
                        }
                    });
                    break;
                case "switchFolder":
                    // Reset the label filter first
                    $("#emailListTable").DataTable().column(0).search("", 0, 1);
                    var thisComp = this;
                    $("#wrapper").removeClass("email-read-active");
                    app.user.on(
                        "change:currentMessageView",
                        function () {},
                        this
                    );

                    console.log('navigating');
                    console.log(thisComp.props.activePage);
                    console.log($(event.target).attr("id"));
                    if (
                        thisComp.props.activePage != $(event.target).attr("id")
                    ) {
                        $("#sdasdasd").addClass("hidden");
                        clearTimeout(app.user.get("emailOpenTimeOut"));

                        app.mixins.canNavigate(function (decision) {
                            if (decision) {
                                // $("#mMiddlePanelTop").removeClass(
                                //     " hidden-xs hidden-sm hidden-md"
                                // );
                                $("#appRightSide").css("display", "none");
                                var folder =
                                    app.user.get("folders")[
                                        $(event.target).attr("id")
                                    ]["name"];

                                thisComp.removeClassesActive();

                                Backbone.history.navigate(
                                    "/mail/" + app.transform.from64str(folder),
                                    {
                                        trigger: true,
                                    }
                                );

                                app.user.set({
                                    currentFolder:
                                        app.transform.from64str(folder),
                                });

                                app.user.set({ resetSelectedItems: true });
                                app.user.set({ isDecryptingEmail: false });

                                app.globalF.resetCurrentMessage();
                                app.globalF.resetDraftMessage();

                                app.user.set({
                                    activeFolderId:$(event.target).attr("id"),
                                    emailListRefresh: !app.user.get("emailListRefresh")

                                });
                                thisComp.props.changeFodlerId(
                                    $(event.target).attr("id")
                                );
                                $("#" + $(event.target).attr("id"))
                                    .parents("li")
                                    .addClass("active");

                                $("#mMiddlePanel").scrollTop(0);

                                app.layout.display("viewBox");
                            }
                        });
                    } else {
                        thisComp.removeClassesActive();
                        app.user.set({ resetSelectedItems: true });
                        app.user.set({ isDecryptingEmail: false });
                        app.globalF.resetCurrentMessage();
                        app.globalF.resetDraftMessage();
                        Backbone.history.navigate(
                            "/mail/" + app.user.get("currentFolder"),
                            {
                                trigger: true,
                            }
                        );
                        $("#emailListTable tr").removeClass("selected");
                        $("#sdasdasd").addClass("hidden");
                        $("#mMiddlePanelTop").removeClass(
                            " hidden-xs hidden-sm hidden-md"
                        );
                        $("#mRightPanel").addClass(
                            "hidden-xs hidden-sm hidden-md"
                        );
                    }

                    break;
            }
        },
        notifyMe: function () {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                // alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                console.log('granted notif');
            }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                    }
                });
            }
        },

        handleClick: function (i) {
            switch (i) {
                case "composeEmail":
                    app.user.set({ composeOriginate: 'new' });
                    app.user.set({ isComposingEmail: true });
                    Backbone.history.loadUrl(Backbone.history.fragment);
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
                case "addFolder":
                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            $("#settings-spinner")
                                .removeClass("d-none")
                                .addClass("d-block");
                            Backbone.history.navigate("/settings/Folders", {
                                trigger: true,
                            });
                        }
                    });

                    break;

                case "login":
                    console.log(createUserFormValidator);
                    break;
                case "toggleLeftSide":
                    document.body.classList.toggle("shrinked");
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
                    break;
            }
        },
        boxSize: function () {
            return (
                <div>
                    <span className="used_one">
                        {accounting.toFixed(
                            app.user.get("mailboxSize") / 1024 / 1024/1024,
                            3
                        )}{" "}
                        GB{" "}
                    </span>
                    <span>
                        &nbsp;/&nbsp;
                        <strong>
                            {app.user.get("userPlan")["planData"]["bSize"] /
                                1000}{" "}
                            GB
                        </strong>
                    </span>
                </div>
            );
        },

        systemFolderIcon: function (_type) {
            if (_type === "Inbox") {
                return (
                    <span className="menu-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#415067"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-evenodd"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.75 2C12.75 1.58579 12.4142 1.25 12 1.25C11.5858 1.25 11.25 1.58579 11.25 2V10.1893L9.53035 8.46967C9.23746 8.17678 8.76258 8.17678 8.46969 8.46967C8.1768 8.76256 8.1768 9.23744 8.46969 9.53033L11.4697 12.5303C11.7626 12.8232 12.2375 12.8232 12.5303 12.5303L15.5303 9.53033C15.8232 9.23744 15.8232 8.76256 15.5303 8.46967C15.2375 8.17678 14.7626 8.17678 14.4697 8.46967L12.75 10.1893V2ZM8.57898 3.25L8.62312 3.25H8.75002C9.16423 3.25 9.50002 3.58579 9.50002 4C9.50002 4.41421 9.16423 4.75 8.75002 4.75H8.62312C7.85491 4.75 7.34497 4.75125 6.95697 4.79764C6.589 4.84164 6.41584 4.91829 6.29231 5.01474C6.16877 5.11119 6.05242 5.2606 5.92048 5.60691C5.78137 5.97207 5.65648 6.46648 5.47016 7.21176L4.26126 12.0473C4.10562 12.6699 4.03784 12.9432 3.99189 13.2161L3.98626 13.25H6.19754L6.30449 13.2499C6.91403 13.2494 7.39393 13.249 7.83729 13.404C8.10635 13.498 8.35915 13.6333 8.58665 13.805C8.96151 14.088 9.22738 14.4875 9.56507 14.995L9.62435 15.084C10.0505 15.7232 10.1723 15.888 10.3176 15.9977C10.421 16.0758 10.536 16.1373 10.6583 16.18C10.8302 16.2401 11.0349 16.25 11.8031 16.25H12.1975C12.9658 16.25 13.1705 16.2401 13.3424 16.18C13.4647 16.1373 13.5796 16.0758 13.683 15.9977C13.8283 15.888 13.9501 15.7232 14.3763 15.084L14.4356 14.9949C14.7732 14.4875 15.0391 14.088 15.414 13.805C15.6415 13.6333 15.8943 13.498 16.1633 13.404C16.6067 13.249 17.0866 13.2494 17.6961 13.2499L17.8031 13.25H20.0138L20.0082 13.2161C19.9622 12.9432 19.8944 12.6699 19.7388 12.0473L18.5299 7.21176C18.3436 6.46648 18.2187 5.97207 18.0796 5.60691C17.9476 5.2606 17.8313 5.11119 17.7077 5.01474C17.5842 4.91829 17.411 4.84164 17.0431 4.79764C16.6551 4.75125 16.1451 4.75 15.3769 4.75H15.25C14.8358 4.75 14.5 4.41421 14.5 4C14.5 3.58579 14.8358 3.25 15.25 3.25H15.3769L15.4211 3.25C16.1334 3.24997 16.7336 3.24995 17.2212 3.30825C17.7388 3.37015 18.2119 3.5053 18.6308 3.83244C19.0498 4.15957 19.2957 4.58574 19.4813 5.07289C19.6561 5.53174 19.8016 6.11407 19.9744 6.80511L19.9851 6.84796L21.194 11.6835L21.2023 11.7169C21.3474 12.2971 21.4305 12.6295 21.4873 12.967C21.5991 13.6309 21.6339 14.3055 21.591 14.9774C21.5692 15.319 21.5208 15.6581 21.4362 16.2503L21.4313 16.2842L21.4125 16.4161C21.2439 17.598 21.1361 18.3538 20.8473 18.9825C20.2759 20.2267 19.1954 21.1637 17.883 21.5535C17.2197 21.7504 16.4563 21.7503 15.2625 21.75L15.1292 21.75H8.87084L8.73755 21.75C7.54371 21.7503 6.78033 21.7504 6.11704 21.5535C4.80459 21.1637 3.72413 20.2267 3.15271 18.9825C2.86392 18.3538 2.75613 17.598 2.58755 16.4161L2.56872 16.2842L2.56386 16.2502C2.47926 15.6581 2.43081 15.3189 2.40901 14.9774C2.36612 14.3055 2.40092 13.6309 2.51271 12.967C2.56955 12.6295 2.65264 12.2971 2.79773 11.7168L2.80605 11.6835L4.01495 6.84795L4.02565 6.80513C4.19839 6.11408 4.34395 5.53174 4.51876 5.07289C4.70435 4.58574 4.9502 4.15957 5.36919 3.83244C5.78818 3.5053 6.26125 3.37015 6.77887 3.30825C7.26641 3.24995 7.86667 3.24997 8.57898 3.25ZM3.90596 14.8818C3.90316 14.8379 3.90075 14.7939 3.89875 14.75H6.19754C6.96575 14.75 7.17047 14.7599 7.34237 14.82C7.46467 14.8627 7.57959 14.9242 7.68299 15.0023C7.82834 15.112 7.95015 15.2768 8.37628 15.916L8.43555 16.005C8.77325 16.5125 9.03911 16.912 9.41398 17.195C9.64147 17.3667 9.89428 17.502 10.1633 17.596C10.6067 17.751 11.0866 17.7506 11.6961 17.7501L11.8031 17.75H12.1975L12.3045 17.7501C12.914 17.7506 13.3939 17.751 13.8373 17.596C14.1063 17.502 14.3592 17.3667 14.5866 17.195C14.9615 16.912 15.2274 16.5125 15.5651 16.0051L15.6244 15.916C16.0505 15.2768 16.1723 15.112 16.3176 15.0023C16.421 14.9242 16.536 14.8627 16.6583 14.82C16.8302 14.7599 17.0349 14.75 17.8031 14.75H20.1013C20.0993 14.7939 20.0969 14.8379 20.0941 14.8818C20.0764 15.158 20.0372 15.4368 19.9464 16.0721C19.7522 17.4313 19.6701 17.9517 19.4842 18.3565C19.0933 19.2077 18.354 19.8489 17.456 20.1155C17.029 20.2423 16.5023 20.25 15.1292 20.25H8.87084C7.49778 20.25 6.971 20.2423 6.54404 20.1155C5.64605 19.8489 4.90679 19.2077 4.51581 18.3565C4.32992 17.9517 4.24782 17.4313 4.05364 16.0721C3.96289 15.4368 3.92359 15.158 3.90596 14.8818Z"
                            />
                        </svg>
                    </span>
                );
            } else if (_type === "Sent") {
                return (
                    <span className="menu-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#415067"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M20.5306 2.46969C20.7315 2.67057 20.8016 2.9677 20.7118 3.2372L14.7115 21.2372C14.6156 21.525 14.3558 21.7266 14.0532 21.7481C13.7506 21.7696 13.4648 21.6068 13.3292 21.3354L9.44099 13.559L1.6646 9.67084C1.39328 9.53518 1.23039 9.24944 1.2519 8.94685C1.2734 8.64427 1.47506 8.38443 1.76284 8.28851L19.7631 2.28851C20.0326 2.19867 20.3297 2.26882 20.5306 2.46969ZM10.9126 13.1481L13.8611 19.0451L18.8144 4.18587L3.95493 9.13896L9.85193 12.0875L12.9699 8.96971C13.2628 8.67683 13.7376 8.67684 14.0305 8.96974C14.3234 9.26264 14.3234 9.73752 14.0305 10.0304L10.9126 13.1481Z"
                            />
                        </svg>
                    </span>
                );
            } else if (_type === "Draft") {
                return (
                    <span className="menu-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#415067"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M18.8407 3.90343C18.3639 3.47003 17.6358 3.47002 17.1591 3.9034C17.1404 3.9204 17.116 3.9445 17.0302 4.03024L16.7233 4.33714C16.699 5.4133 17.5863 6.30073 18.6624 6.2766L18.9695 5.96953C19.0552 5.88379 19.0793 5.85939 19.0963 5.84069C19.5297 5.36393 19.5297 4.63587 19.0964 4.15911C19.0794 4.14041 19.0553 4.11601 18.9695 4.03027C18.8838 3.94453 18.8594 3.92042 18.8407 3.90343ZM17.3916 7.54747C16.5063 7.20178 15.798 6.49344 15.4524 5.6081L10.097 10.9634C9.29022 11.7701 8.98963 12.0796 8.78348 12.4437C8.57734 12.8077 8.46667 13.2247 8.18995 14.3316L8.03055 14.9691L8.66816 14.8097C9.77503 14.533 10.192 14.4224 10.556 14.2162C10.9201 14.0101 11.2295 13.7095 12.0363 12.9027L17.3916 7.54747ZM16.1501 2.79344C17.199 1.83999 18.8008 1.84001 19.8497 2.79349C19.8985 2.83785 19.9503 2.88971 20.0176 2.95704L20.0176 2.95705L20.0302 2.96963L20.0427 2.98216L20.0428 2.98217C20.1101 3.04951 20.162 3.10136 20.2063 3.15017C21.1597 4.19906 21.1597 5.80079 20.2063 6.84965C20.162 6.89842 20.1102 6.95022 20.0429 7.01746L20.0428 7.01755L20.0427 7.01767L20.0302 7.03019L13.097 13.9634L13.0234 14.0369C12.3154 14.7453 11.8581 15.2028 11.2951 15.5215C10.7321 15.8403 10.1046 15.997 9.13287 16.2397L9.13286 16.2397L9.03197 16.265L7.18168 16.7275C6.9261 16.7914 6.65573 16.7165 6.46945 16.5302C6.28316 16.344 6.20827 16.0736 6.27217 15.818L6.73474 13.9678L6.75995 13.8669C7.00267 12.8951 7.15943 12.2676 7.47819 11.7046C7.79694 11.1416 8.25442 10.6843 8.96278 9.97626L8.96279 9.97625L9.03634 9.90272L15.9696 2.96957L15.9821 2.957C16.0495 2.88966 16.1013 2.8378 16.1501 2.79344ZM3.25 20.9999C3.25 20.5857 3.58579 20.2499 4 20.2499H20C20.4142 20.2499 20.75 20.5857 20.75 20.9999C20.75 21.4141 20.4142 21.7499 20 21.7499H4C3.58579 21.7499 3.25 21.4141 3.25 20.9999Z"
                            />
                        </svg>
                    </span>
                );
            } else if (_type === "Spam") {
                return (
                    <span className="menu-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#415067"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.94513 3.25H9H15H15.0549C16.4225 3.24998 17.5248 3.24996 18.3918 3.36652C19.2919 3.48754 20.0497 3.74643 20.6517 4.34835C21.2536 4.95027 21.5125 5.70814 21.6335 6.60825C21.75 7.47522 21.75 8.57754 21.75 9.94513V10V20C21.75 20.2599 21.6154 20.5013 21.3943 20.638C21.1732 20.7746 20.8971 20.7871 20.6646 20.6708L18.3538 19.5154C17.4828 19.0799 17.1513 18.9193 16.8024 18.8369C16.4536 18.7546 16.0852 18.75 15.1115 18.75H9H8.94513H8.94512H8.94511C7.57753 18.75 6.47521 18.75 5.60825 18.6335C4.70814 18.5125 3.95027 18.2536 3.34835 17.6517C2.74643 17.0497 2.48754 16.2919 2.36652 15.3918C2.24996 14.5248 2.24998 13.4225 2.25 12.0549V12V10V9.94513C2.24998 8.57754 2.24996 7.47522 2.36652 6.60825C2.48754 5.70814 2.74643 4.95027 3.34835 4.34835C3.95027 3.74643 4.70814 3.48754 5.60825 3.36652C6.47522 3.24996 7.57754 3.24998 8.94513 3.25ZM5.80812 4.85315C5.07435 4.9518 4.68577 5.13225 4.40901 5.40901C4.13225 5.68577 3.9518 6.07435 3.85315 6.80812C3.75159 7.56347 3.75 8.56458 3.75 10V12C3.75 13.4354 3.75159 14.4365 3.85315 15.1919C3.9518 15.9257 4.13225 16.3142 4.40901 16.591C4.68577 16.8678 5.07435 17.0482 5.80812 17.1469C6.56347 17.2484 7.56458 17.25 9 17.25H15.1115L15.2 17.25C16.0554 17.2498 16.6077 17.2498 17.1471 17.3771C17.6864 17.5044 18.1803 17.7515 18.9454 18.1341L19.0246 18.1738L20.25 18.7865V10C20.25 8.56458 20.2484 7.56347 20.1469 6.80812C20.0482 6.07435 19.8678 5.68577 19.591 5.40901C19.3142 5.13225 18.9257 4.9518 18.1919 4.85315C17.4365 4.75159 16.4354 4.75 15 4.75H9C7.56458 4.75 6.56347 4.75159 5.80812 4.85315ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V11C11.25 11.4142 11.5858 11.75 12 11.75C12.4142 11.75 12.75 11.4142 12.75 11V7Z"
                            />
                        </svg>
                    </span>
                );
            } else if (_type === "Trash") {
                return (
                    <span className="menu-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#415067"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M10.4062 2.25C10.418 2.25 10.4297 2.25001 10.4415 2.25001H13.5585L13.5938 2.25C13.9112 2.24996 14.2092 2.24993 14.459 2.27844C14.7371 2.3102 15.0296 2.38362 15.3025 2.58033C15.5754 2.77705 15.7375 3.03125 15.8556 3.28509C15.9617 3.51301 16.0559 3.79577 16.1562 4.09691L16.1674 4.13038L16.5406 5.25001H19H21C21.4142 5.25001 21.75 5.58579 21.75 6.00001C21.75 6.41422 21.4142 6.75001 21 6.75001H19.7017L19.1217 15.449L19.1182 15.5016C19.0327 16.7844 18.9637 17.8205 18.8017 18.6336C18.6333 19.4789 18.3469 20.185 17.7553 20.7384C17.1637 21.2919 16.4401 21.5307 15.5855 21.6425C14.7634 21.75 13.725 21.75 12.4394 21.75H12.3867H11.6133H11.5606C10.275 21.75 9.23655 21.75 8.41451 21.6425C7.55986 21.5307 6.83631 21.2919 6.24472 20.7384C5.65312 20.185 5.3667 19.4789 5.19831 18.6336C5.03633 17.8205 4.96727 16.7844 4.88178 15.5016L4.87827 15.449L4.29834 6.75001H3C2.58579 6.75001 2.25 6.41422 2.25 6.00001C2.25 5.58579 2.58579 5.25001 3 5.25001H5H7.45943L7.83264 4.13038C7.83637 4.11919 7.84009 4.10802 7.8438 4.09688C7.94414 3.79576 8.03835 3.513 8.14438 3.28509C8.26246 3.03125 8.42459 2.77705 8.69752 2.58033C8.97045 2.38362 9.26287 2.3102 9.54102 2.27844C9.79077 2.24993 10.0888 2.24996 10.4062 2.25ZM9.04057 5.25001H14.9594L14.7443 4.60472C14.6289 4.25832 14.5611 4.05863 14.4956 3.91778C14.466 3.85424 14.4457 3.82282 14.4348 3.80824C14.4298 3.8015 14.427 3.79862 14.4264 3.79802L14.4254 3.7972L14.4243 3.79655C14.4236 3.79616 14.42 3.79439 14.412 3.79175C14.3947 3.78604 14.3585 3.77671 14.2888 3.76876C14.1345 3.75114 13.9236 3.75001 13.5585 3.75001H10.4415C10.0764 3.75001 9.86551 3.75114 9.71117 3.76876C9.64154 3.77671 9.60531 3.78604 9.58804 3.79175C9.58005 3.79439 9.57643 3.79616 9.57566 3.79655L9.57458 3.7972L9.57363 3.79802C9.57302 3.79862 9.57019 3.8015 9.56516 3.80824C9.55428 3.82282 9.53397 3.85424 9.50441 3.91778C9.43889 4.05863 9.37113 4.25832 9.25566 4.60472L9.04057 5.25001ZM5.80166 6.75001L6.37495 15.3492C6.4648 16.6971 6.52883 17.6349 6.6694 18.3405C6.80575 19.025 6.99608 19.3873 7.2695 19.6431C7.54291 19.8989 7.91707 20.0647 8.60907 20.1552C9.32247 20.2485 10.2625 20.25 11.6133 20.25H12.3867C13.7375 20.25 14.6775 20.2485 15.3909 20.1552C16.0829 20.0647 16.4571 19.8989 16.7305 19.6431C17.0039 19.3873 17.1943 19.025 17.3306 18.3405C17.4712 17.6349 17.5352 16.6971 17.6251 15.3492L18.1983 6.75001H16H8H5.80166Z"
                            />
                        </svg>
                    </span>
                );
            } else {
                return (
                    <span className="menu-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#415067"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.75 2C12.75 1.58579 12.4142 1.25 12 1.25C11.5858 1.25 11.25 1.58579 11.25 2V10.1893L9.53035 8.46967C9.23746 8.17678 8.76258 8.17678 8.46969 8.46967C8.1768 8.76256 8.1768 9.23744 8.46969 9.53033L11.4697 12.5303C11.7626 12.8232 12.2375 12.8232 12.5303 12.5303L15.5303 9.53033C15.8232 9.23744 15.8232 8.76256 15.5303 8.46967C15.2375 8.17678 14.7626 8.17678 14.4697 8.46967L12.75 10.1893V2ZM8.57898 3.25L8.62312 3.25H8.75002C9.16423 3.25 9.50002 3.58579 9.50002 4C9.50002 4.41421 9.16423 4.75 8.75002 4.75H8.62312C7.85491 4.75 7.34497 4.75125 6.95697 4.79764C6.589 4.84164 6.41584 4.91829 6.29231 5.01474C6.16877 5.11119 6.05242 5.2606 5.92048 5.60691C5.78137 5.97207 5.65648 6.46648 5.47016 7.21176L4.26126 12.0473C4.10562 12.6699 4.03784 12.9432 3.99189 13.2161L3.98626 13.25H6.19754L6.30449 13.2499C6.91403 13.2494 7.39393 13.249 7.83729 13.404C8.10635 13.498 8.35915 13.6333 8.58665 13.805C8.96151 14.088 9.22738 14.4875 9.56507 14.995L9.62435 15.084C10.0505 15.7232 10.1723 15.888 10.3176 15.9977C10.421 16.0758 10.536 16.1373 10.6583 16.18C10.8302 16.2401 11.0349 16.25 11.8031 16.25H12.1975C12.9658 16.25 13.1705 16.2401 13.3424 16.18C13.4647 16.1373 13.5796 16.0758 13.683 15.9977C13.8283 15.888 13.9501 15.7232 14.3763 15.084L14.4356 14.9949C14.7732 14.4875 15.0391 14.088 15.414 13.805C15.6415 13.6333 15.8943 13.498 16.1633 13.404C16.6067 13.249 17.0866 13.2494 17.6961 13.2499L17.8031 13.25H20.0138L20.0082 13.2161C19.9622 12.9432 19.8944 12.6699 19.7388 12.0473L18.5299 7.21176C18.3436 6.46648 18.2187 5.97207 18.0796 5.60691C17.9476 5.2606 17.8313 5.11119 17.7077 5.01474C17.5842 4.91829 17.411 4.84164 17.0431 4.79764C16.6551 4.75125 16.1451 4.75 15.3769 4.75H15.25C14.8358 4.75 14.5 4.41421 14.5 4C14.5 3.58579 14.8358 3.25 15.25 3.25H15.3769L15.4211 3.25C16.1334 3.24997 16.7336 3.24995 17.2212 3.30825C17.7388 3.37015 18.2119 3.5053 18.6308 3.83244C19.0498 4.15957 19.2957 4.58574 19.4813 5.07289C19.6561 5.53174 19.8016 6.11407 19.9744 6.80511L19.9851 6.84796L21.194 11.6835L21.2023 11.7169C21.3474 12.2971 21.4305 12.6295 21.4873 12.967C21.5991 13.6309 21.6339 14.3055 21.591 14.9774C21.5692 15.319 21.5208 15.6581 21.4362 16.2503L21.4313 16.2842L21.4125 16.4161C21.2439 17.598 21.1361 18.3538 20.8473 18.9825C20.2759 20.2267 19.1954 21.1637 17.883 21.5535C17.2197 21.7504 16.4563 21.7503 15.2625 21.75L15.1292 21.75H8.87084L8.73755 21.75C7.54371 21.7503 6.78033 21.7504 6.11704 21.5535C4.80459 21.1637 3.72413 20.2267 3.15271 18.9825C2.86392 18.3538 2.75613 17.598 2.58755 16.4161L2.56872 16.2842L2.56386 16.2502C2.47926 15.6581 2.43081 15.3189 2.40901 14.9774C2.36612 14.3055 2.40092 13.6309 2.51271 12.967C2.56955 12.6295 2.65264 12.2971 2.79773 11.7168L2.80605 11.6835L4.01495 6.84795L4.02565 6.80513C4.19839 6.11408 4.34395 5.53174 4.51876 5.07289C4.70435 4.58574 4.9502 4.15957 5.36919 3.83244C5.78818 3.5053 6.26125 3.37015 6.77887 3.30825C7.26641 3.24995 7.86667 3.24997 8.57898 3.25ZM3.90596 14.8818C3.90316 14.8379 3.90075 14.7939 3.89875 14.75H6.19754C6.96575 14.75 7.17047 14.7599 7.34237 14.82C7.46467 14.8627 7.57959 14.9242 7.68299 15.0023C7.82834 15.112 7.95015 15.2768 8.37628 15.916L8.43555 16.005C8.77325 16.5125 9.03911 16.912 9.41398 17.195C9.64147 17.3667 9.89428 17.502 10.1633 17.596C10.6067 17.751 11.0866 17.7506 11.6961 17.7501L11.8031 17.75H12.1975L12.3045 17.7501C12.914 17.7506 13.3939 17.751 13.8373 17.596C14.1063 17.502 14.3592 17.3667 14.5866 17.195C14.9615 16.912 15.2274 16.5125 15.5651 16.0051L15.6244 15.916C16.0505 15.2768 16.1723 15.112 16.3176 15.0023C16.421 14.9242 16.536 14.8627 16.6583 14.82C16.8302 14.7599 17.0349 14.75 17.8031 14.75H20.1013C20.0993 14.7939 20.0969 14.8379 20.0941 14.8818C20.0764 15.158 20.0372 15.4368 19.9464 16.0721C19.7522 17.4313 19.6701 17.9517 19.4842 18.3565C19.0933 19.2077 18.354 19.8489 17.456 20.1155C17.029 20.2423 16.5023 20.25 15.1292 20.25H8.87084C7.49778 20.25 6.971 20.2423 6.54404 20.1155C5.64605 19.8489 4.90679 19.2077 4.51581 18.3565C4.32992 17.9517 4.24782 17.4313 4.05364 16.0721C3.96289 15.4368 3.92359 15.158 3.90596 14.8818Z"
                            />
                        </svg>
                    </span>
                );
            }
        },

        unopenedBadge: function (
            unOpenedIndex,
            mainFoldersIndex,
            sentFolderId,
            trashFolderId
        ) {
            if (
                unOpenedIndex == 0 ||
                mainFoldersIndex == sentFolderId ||
                mainFoldersIndex == trashFolderId
            ) {
                return null;
            } else {
                return <span className="number-badge">{unOpenedIndex}</span>;
            }
        },

        render: function () {
            var st1 = {
                height: "10px",
                marginLeft: "4px",
                marginBottom: "2px",
            };
            var st2 = { marginTop: "3px" };
            var barWidth=(accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024,2) * 100) /app.user.get("userPlan")["planData"]["bSize"];
            var st3 = barWidth>100?100:barWidth;

            return (
                <div>
                    <div
                        className={`left-side ${
                            this.state.menuExpanded ? "expanded" : "shrinked"
                        }`}
                        id="folderMenu"
                    >
                        <div className="left-container">
                            <div className="logo">
                                <div className="menu-icon">
                                    <button
                                        type="button"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "toggleLeftSide"
                                        )}
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
                                <a
                                    data-target="94835ea2fc"
                                    className="brand"
                                    onClick={this.handleChange.bind(
                                        this,
                                        "backToInbox"
                                    )}
                                >
                                    <img
                                        src="/images/logo.svg"
                                        alt=""
                                        className="light-theme-logo"
                                    />{" "}
                                    <img
                                        src="/images/logo-white.svg"
                                        alt=""
                                        className="dark-theme-logo"
                                    />
                                </a>
                            </div>
                            <div className="new-message-btn">
                                <button
                                    onClick={this.handleClick.bind(
                                        this,
                                        "composeEmail"
                                    )}
                                >
                                    <span className="text">New message</span>
                                </button>
                            </div>
                            <div className="main-menu">
                                <ul id="folderul">
                                    {Object.keys(this.state.mainFolders).map(
                                        function (folderData, i) {
                                            return (
                                                <li
                                                    key={
                                                        "liM_" +
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["index"]
                                                    }
                                                    className={`${
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["role"] == "Inbox"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <a
                                                        key={"aM_" + i}
                                                        id={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"]
                                                        }
                                                        onClick={this.handleChange.bind(
                                                            null,
                                                            "switchFolder"
                                                        )}
                                                        data-name={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }
                                                    >
                                                        {this.systemFolderIcon(
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        )}
                                                        {
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }{" "}
                                                        {this.unopenedBadge(
                                                            this.state.unopened[
                                                                this.state
                                                                    .mainFolders[
                                                                    folderData
                                                                ]["index"]
                                                            ],
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["sentFolderId"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["trashFolderId"]
                                                        )}
                                                    </a>
                                                </li>
                                            );
                                        },
                                        this
                                    )}
                                </ul>
                            </div>
                            <div className="folder-menu">
                                <div className="add-folder">
                                    <button
                                        onClick={this.handleClick.bind(
                                            null,
                                            "addFolder"
                                        )}
                                    ></button>
                                </div>
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="false"
                                                aria-controls="collapseOne"
                                            >
                                                {" "}
                                                Folders{" "}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <ul id="folderulcustom">
                                                    {this.state.customFolders.map(
                                                        function (
                                                            folderData,
                                                            i
                                                        ) {
                                                            return (
                                                                <li
                                                                    key={
                                                                        "li_" +
                                                                        folderData[
                                                                            "index"
                                                                        ]
                                                                    }
                                                                    className={
                                                                        " " +
                                                                        (folderData[
                                                                            "role"
                                                                        ] ==
                                                                        "Inbox"
                                                                            ? "active"
                                                                            : this
                                                                                  .state
                                                                                  .unopened[
                                                                                  folderData[
                                                                                      "index"
                                                                                  ]
                                                                              ] ==
                                                                              0
                                                                            ? ""
                                                                            : "active")
                                                                    }
                                                                >

                                                                    <a
                                                                        key={
                                                                            "a_" +
                                                                            i
                                                                        }
                                                                        id={
                                                                            folderData[
                                                                                "index"
                                                                            ]
                                                                        }
                                                                        onClick={this.handleChange.bind(
                                                                            null,
                                                                            "switchFolder"
                                                                        )}
                                                                    >
                                                                        <span className="menu-icon">
                                                                            <svg
                                                                                width="24"
                                                                                height="24"
                                                                                viewBox="0 0 20 20"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    opacity="0.4"
                                                                                    d="M16.2013 3.36209C16.3115 3.53535 16.1226 3.7372 15.9224 3.69169C15.5307 3.57502 15.0974 3.51669 14.6557 3.51669H11.9055C11.7745 3.51669 11.6511 3.45507 11.5724 3.35033L10.6141 2.07502C10.4967 1.90872 10.6076 1.66669 10.8112 1.66669H13.1057C14.4066 1.66669 15.5524 2.3423 16.2013 3.36209Z"
                                                                                    fill={
                                                                                        folderData[
                                                                                            "color"
                                                                                        ]
                                                                                    }
                                                                                />
                                                                                <path
                                                                                    d="M16.7807 5.45002C16.4224 5.19169 16.0141 5.00002 15.5724 4.89169C15.2724 4.80835 14.9641 4.76669 14.6474 4.76669H11.5474C11.0641 4.76669 11.0307 4.72502 10.7724 4.38335L9.60573 2.83335C9.06406 2.10835 8.63906 1.66669 7.28073 1.66669H5.3474C3.31406 1.66669 1.66406 3.31669 1.66406 5.35002V14.65C1.66406 16.6834 3.31406 18.3334 5.3474 18.3334H14.6474C16.6807 18.3334 18.3307 16.6834 18.3307 14.65V8.45002C18.3307 7.20835 17.7224 6.11669 16.7807 5.45002ZM11.9891 13.6167H7.9974C7.6724 13.6167 7.4224 13.3584 7.4224 13.0334C7.4224 12.7167 7.6724 12.45 7.9974 12.45H11.9891C12.3141 12.45 12.5724 12.7167 12.5724 13.0334C12.5724 13.3584 12.3141 13.6167 11.9891 13.6167Z"
                                                                                    fill={
                                                                                        folderData[
                                                                                            "color"
                                                                                        ]
                                                                                    }
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        {folderData["name"]}
                                                                        {this.state.unopened[folderData["index"]] == 0 || this.state.unopened[folderData["index"]] ==undefined ? (
                                                                            "") : (
                                                                            <span className="number-badge">{this.state.unopened[folderData["index"]]}</span>)
                                                                        }
                                                                    </a>
                                                                </li>
                                                            );
                                                        },
                                                        this
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="folder-menu">
                                <div className="add-folder">
                                    <button
                                        onClick={this.handleClick.bind(
                                            this,
                                            "addFolder"
                                        )}
                                    ></button>
                                </div>
                                <div className="accordion" id="accordionLabels">
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseTwo"
                                            >
                                                {" "}
                                                Labels{" "}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseTwo"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionLabels"
                                        >
                                            <div className="accordion-body">
                                                <ul id="folderulcustom">
                                                    {this.state.customLabels.map(
                                                        function (label, i) {
                                                            return (
                                                                <li
                                                                    key={
                                                                        "li_" +
                                                                        i
                                                                    }
                                                                    className={``}
                                                                >
                                                                    <a
                                                                        key={
                                                                            "a_" +
                                                                            i
                                                                        }
                                                                        data-name={
                                                                            label.name
                                                                        }
                                                                        onClick={this.handleChange.bind(
                                                                            this,
                                                                            "switchLabels"
                                                                        )}
                                                                    >
                                                                        <span className="menu-icon">
                                                                            <svg
                                                                                width="19"
                                                                                height="16"
                                                                                viewBox="0 0 19 16"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M0 2C0 0.895431 0.895431 0 2 0H11.5C12.4443 0 13.3334 0.444583 13.9 1.2L18.1 6.8C18.6333 7.51111 18.6333 8.48889 18.1 9.2L13.9 14.8C13.3334 15.5554 12.4443 16 11.5 16H2C0.89543 16 0 15.1046 0 14V2Z"
                                                                                    fill={
                                                                                        label.color !==
                                                                                        ""
                                                                                            ? label.color
                                                                                            : "#c9d0da"
                                                                                    }
                                                                                />
                                                                                <rect
                                                                                    x="2"
                                                                                    y="2"
                                                                                    width="2"
                                                                                    height="12"
                                                                                    rx="1"
                                                                                    fill="white"
                                                                                    fillOpacity="0.3"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                label.name
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                </li>
                                                            );
                                                        },
                                                        this
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="left-bottom">
                            {((app.user.get("userPlan")["paymentVersion"] == 2 && app.user.get("userPlan")["planSelected"] == 3) || (app.user.get("userPlan")["paymentVersion"] == 3 && app.user.get("userPlan")["planSelected"] == "free")) &&
                                <div className="left-cta">
                                    <div className="call-to-action">
                                        <div className="cta-title">
                                            Let's explore the full
                                            <br />
                                            version of your mailbox
                                        </div>
                                        <div className="white-btn">
                                            <a
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "settings"
                                                )}
                                            >
                                                Discover Pro
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="storage">
                                <div className="storage-count">
                                    {this.boxSize()}
                                </div>
                                <div className="storage-bar">
                                    <span style={{width:st3+"%"}}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="offcanvas offcanvas-start"
                        tabIndex="-1"
                        id="offcanvasLeft"
                        aria-label="offcanvasLeftLabel"
                    >
                        <div className="offcanvas-header">
                            <div className="logo">
                                <a
                                    data-target="94835ea2fc"
                                    className="brand"
                                    onClick={this.handleChange.bind(
                                        this,
                                        "backToInbox"
                                    )}
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                >
                                    <img
                                        src="images/logo.svg"
                                        alt=""
                                        className="light-theme-logo"
                                    />
                                </a>
                            </div>
                            <button
                                type="button"
                                className="btn-close text-reset"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="new-message-btn">
                                <button
                                    onClick={this.handleClick.bind(
                                        this,
                                        "composeEmail"
                                    )}
                                    data-bs-dismiss="offcanvas"
                                >
                                    New message
                                </button>
                            </div>
                            {((app.user.get("userPlan")["paymentVersion"] == 2 && app.user.get("userPlan")["planSelected"] == 3) || (app.user.get("userPlan")["paymentVersion"] == 3 && app.user.get("userPlan")["planSelected"] == "free")) &&
                                <div className="go-premium-button">
                                    <a
                                        className="button"
                                        onClick={this.handleClick.bind(
                                            this,
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

                            <div className="main-menu">
                                <ul id="folderul">
                                    {Object.keys(this.state.mainFolders).map(
                                        function (folderData, i) {
                                            return (
                                                <li
                                                    key={
                                                        "liM_" +
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["index"]
                                                    }
                                                    className={`${
                                                        this.state.mainFolders[
                                                            folderData
                                                        ]["role"] == "Inbox"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <a
                                                        key={"aM_" + i}
                                                        id={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"]
                                                        }
                                                        onClick={this.handleChange.bind(
                                                            this,
                                                            "switchFolder"
                                                        )}
                                                        data-name={
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }
                                                        data-bs-dismiss="offcanvas"
                                                        aria-label="Close"
                                                    >
                                                        {this.systemFolderIcon(
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        )}
                                                        {
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["name"]
                                                        }{" "}
                                                        {this.unopenedBadge(
                                                            this.state.unopened[
                                                                this.state
                                                                    .mainFolders[
                                                                    folderData
                                                                ]["index"]
                                                            ],
                                                            this.state
                                                                .mainFolders[
                                                                folderData
                                                            ]["index"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["sentFolderId"],
                                                            app.user.get(
                                                                "systemFolders"
                                                            )["trashFolderId"]
                                                        )}
                                                    </a>
                                                </li>
                                            );
                                        },
                                        this
                                    )}
                                </ul>
                            </div>
                            <div className="folder-menu">
                                <div className="add-folder">
                                    <button
                                        onClick={this.handleClick.bind(
                                            this,
                                            "addFolder"
                                        )}
                                    ></button>
                                </div>
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="false"
                                                aria-controls="collapseOne"
                                            >
                                                {" "}
                                                Folders{" "}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <ul id="folderulcustom">
                                                    {this.state.customFolders.map(
                                                        function (
                                                            folderData,
                                                            i
                                                        ) {
                                                            return (
                                                                <li
                                                                    key={
                                                                        "li_" +
                                                                        folderData[
                                                                            "index"
                                                                        ]
                                                                    }
                                                                    className={
                                                                        " " +
                                                                        (folderData[
                                                                            "role"
                                                                        ] ==
                                                                        "Inbox"
                                                                            ? "active"
                                                                            : this
                                                                                  .state
                                                                                  .unopened[
                                                                                  folderData[
                                                                                      "index"
                                                                                  ]
                                                                              ] ==
                                                                              0
                                                                            ? ""
                                                                            : "active")
                                                                    }
                                                                >
                                                                    <a
                                                                        key={
                                                                            "a_" +
                                                                            i
                                                                        }
                                                                        id={
                                                                            folderData[
                                                                                "index"
                                                                            ]
                                                                        }
                                                                        onClick={this.handleChange.bind(
                                                                            this,
                                                                            "switchFolder"
                                                                        )}
                                                                        data-bs-dismiss="offcanvas"
                                                                        aria-label="Close"
                                                                    >
                                                                        <span className="menu-icon">
                                                                            <svg
                                                                                width="24"
                                                                                height="24"
                                                                                viewBox="0 0 20 20"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    opacity="0.4"
                                                                                    d="M16.2013 3.36209C16.3115 3.53535 16.1226 3.7372 15.9224 3.69169C15.5307 3.57502 15.0974 3.51669 14.6557 3.51669H11.9055C11.7745 3.51669 11.6511 3.45507 11.5724 3.35033L10.6141 2.07502C10.4967 1.90872 10.6076 1.66669 10.8112 1.66669H13.1057C14.4066 1.66669 15.5524 2.3423 16.2013 3.36209Z"
                                                                                    fill="#56BEC5"
                                                                                />
                                                                                <path
                                                                                    d="M16.7807 5.45002C16.4224 5.19169 16.0141 5.00002 15.5724 4.89169C15.2724 4.80835 14.9641 4.76669 14.6474 4.76669H11.5474C11.0641 4.76669 11.0307 4.72502 10.7724 4.38335L9.60573 2.83335C9.06406 2.10835 8.63906 1.66669 7.28073 1.66669H5.3474C3.31406 1.66669 1.66406 3.31669 1.66406 5.35002V14.65C1.66406 16.6834 3.31406 18.3334 5.3474 18.3334H14.6474C16.6807 18.3334 18.3307 16.6834 18.3307 14.65V8.45002C18.3307 7.20835 17.7224 6.11669 16.7807 5.45002ZM11.9891 13.6167H7.9974C7.6724 13.6167 7.4224 13.3584 7.4224 13.0334C7.4224 12.7167 7.6724 12.45 7.9974 12.45H11.9891C12.3141 12.45 12.5724 12.7167 12.5724 13.0334C12.5724 13.3584 12.3141 13.6167 11.9891 13.6167Z"
                                                                                    fill={
                                                                                        folderData[
                                                                                            "color"
                                                                                            ]
                                                                                    }
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        {folderData["name"]}&nbsp;
                                                                        {this.state.unopened[folderData["index"]] !=0 &&
                                                                                <span className="number-badge">{this.state.unopened[folderData["index"]]}
                                                                                  </span>
                                                                        }
                                                                    </a>
                                                                </li>
                                                            );
                                                        },
                                                        this
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="storage">
                                <div className="storage-count">
                                    {this.boxSize()}
                                </div>
                                <div className="storage-bar">
                                    <span style={{width:st3+"%"}}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
