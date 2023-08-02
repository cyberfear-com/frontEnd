define(["react", "app", "dataTable", "dataTableBoot"], function (React, app) {
    return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState: function () {
            var dataSet = [];

            return {
                dataSet: dataSet,
                mainChecker: [],
                emailInFolder: 0,
                displayedFolder: "",
                messsageId: "",
                allChecked: false,
                emailList: [],
            };
        },
        componentWillReceiveProps: function (nextProps) {
            if (
                this.props.folderId != nextProps.folderId &&
                this.props.folderId != ""
            ) {
                this.updateEmails(nextProps.folderId, "");
            }
        },
        updateEmails: function (folderId, noRefresh) {
            var thisComp = this;
            var emails = app.user.get("emails")["folders"][folderId];
            var emailListCopy = app.user.get("folderCached");
            if (emailListCopy[folderId] === undefined) {
                emailListCopy[folderId] = {};
            }

            thisComp.setState({
                emailList: emailListCopy,
                displayedFolder: app.transform.from64str(
                    app.user.get("folders")[folderId]["name"]
                ),
                emailInFolder: Object.keys(emails).length,
            });

            app.user.set({
                currentFolder: app.transform.from64str(
                    app.user.get("folders")[folderId]["name"]
                ),
            });
            if (app.user.get("folders")[folderId]["role"] != undefined) {
                var t = app.transform.from64str(
                    app.user.get("folders")[folderId]["role"]
                );
            } else {
                var t = "";
            }

            var data = [];
            var d = new Date();
            var trusted = app.user.get("trustedSenders");
            var encrypted2 = "";

            let htmlSource = ``;

            $.each(emails, function (index, folderData) {
                if (emailListCopy[folderId][index] !== undefined) {
                    var unread =
                        folderData["st"] == 0
                            ? "unread"
                            : folderData["st"] == 1
                            ? "fa fa-mail-reply"
                            : folderData["st"] == 2
                            ? "fa fa-mail-forward"
                            : "";
                    htmlSource +=
                        '<li id="' +
                        index +
                        '" class="' +
                        unread +
                        '"><div class="select-checkbox"><label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label></div><div class="date-time">' +
                        emailListCopy[folderId][index]["dateAtPart"] +
                        '</div><button class="started-icon"></button><div class="inbox-list-top">' +
                        emailListCopy[folderId][index]["fromPart"] +
                        '<button class="attachment-icon"></button><span class="unread-bullet"></span></div><div class="mail-toggle"><div class="mail-title">' +
                        emailListCopy[folderId][index]["sb"] +
                        "</div><p>" +
                        emailListCopy[folderId][index]["bd"] +
                        emailListCopy[folderId][index]["tagPart"] +
                        "</p></div></li>";
                } else {
                    var time =
                        folderData["tr"] != undefined
                            ? folderData["tr"]
                            : folderData["tc"] != undefined
                            ? folderData["tc"]
                            : "";

                    if (
                        d.toDateString() ==
                        new Date(parseInt(time + "000")).toDateString()
                    ) {
                        var dispTime = new Date(
                            parseInt(time + "000")
                        ).toLocaleTimeString();
                    } else {
                        var dispTime = new Date(
                            parseInt(time + "000")
                        ).toLocaleDateString();
                    }
                    var fromEmail = [];
                    var fromTitle = [];
                    var recipient = [];
                    var recipientTitle = [];
                    var trust = "";
                    if (folderData["to"].length > 0) {
                        $.each(folderData["to"], function (indexTo, email) {
                            if (app.transform.check64str(email)) {
                                var str = app.transform.from64str(email);
                            } else {
                                var str = email;
                            }

                            recipient.push(app.globalF.parseEmail(str)["name"]);
                            recipientTitle.push(
                                app.globalF.parseEmail(str)["email"]
                            );
                        });
                    } else if (Object.keys(folderData["to"]).length > 0) {
                        $.each(folderData["to"], function (indexTo, email) {
                            try {
                                var str = app.transform.from64str(indexTo);

                                var name = "";
                                if (email === undefined) {
                                    name = str;
                                } else {
                                    if (email["name"] === undefined) {
                                        name = str;
                                    } else {
                                        if (email["name"] === "") {
                                            name = str;
                                        } else {
                                            name = app.transform.from64str(
                                                email["name"]
                                            );
                                        }
                                    }
                                }

                                recipient.push(name);
                                recipientTitle.push(str);
                            } catch (err) {
                                recipient.push("error");
                                recipientTitle.push("error");
                            }
                        });
                    }
                    if (t == "Sent" || t == "Draft") {
                        fromEmail = "";
                        fromTitle = "";

                        if (
                            folderData["cc"] != undefined &&
                            Object.keys(folderData["cc"]).length > 0
                        ) {
                            $.each(folderData["cc"], function (indexCC, email) {
                                try {
                                    var str = app.transform.from64str(indexCC);
                                    var name = "";
                                    if (email === undefined) {
                                        name = str;
                                    } else {
                                        if (email["name"] === undefined) {
                                            name = str;
                                        } else {
                                            if (email["name"] === "") {
                                                name = str;
                                            } else {
                                                name = app.transform.from64str(
                                                    email["name"]
                                                );
                                            }
                                        }
                                    }
                                    recipient.push(name);
                                    recipientTitle.push(str);
                                } catch (err) {
                                    recipient.push("error");
                                    recipientTitle.push("error");
                                }
                            });
                        }

                        if (
                            folderData["bcc"] != undefined &&
                            Object.keys(folderData["bcc"]).length > 0
                        ) {
                            $.each(
                                folderData["bcc"],
                                function (indexBCC, email) {
                                    try {
                                        var str =
                                            app.transform.from64str(indexBCC);
                                        var name = "";
                                        if (email === undefined) {
                                            name = str;
                                        } else {
                                            if (email["name"] === undefined) {
                                                name = str;
                                            } else {
                                                if (email["name"] === "") {
                                                    name = str;
                                                } else {
                                                    name =
                                                        app.transform.from64str(
                                                            email["name"]
                                                        );
                                                }
                                            }
                                        }
                                        recipient.push(name);
                                        recipientTitle.push(str);
                                    } catch (err) {
                                        recipient.push("error");
                                        recipientTitle.push("error");
                                    }
                                }
                            );
                        }

                        recipient = recipient.join(", ");
                        recipientTitle = recipientTitle.join(", ");

                        fromEmail = recipient;
                        fromTitle = recipientTitle;
                    } else {
                        var str = app.transform.from64str(folderData["fr"]);

                        //console.log(str);
                        fromEmail = app.globalF.parseEmail(str, true)["name"];
                        fromTitle = app.globalF.parseEmail(str, true)["email"];

                        if (
                            trusted.indexOf(
                                app.transform.SHA256(
                                    app.globalF.parseEmail(str)["email"]
                                )
                            ) !== -1
                        ) {
                            trust =
                                "<img src='/img/logo/logo.png' style='height:25px'/>";
                        } else {
                            trust = "";
                        }
                        recipient = recipient.join(", ");
                        recipientTitle = recipientTitle.join(", ");
                    }

                    if (folderData["tg"].length > 0) {
                        var tag = folderData["tg"][0]["name"];
                    } else {
                        var tag = "";
                    }

                    if (parseInt(folderData["en"]) == 1) {
                        encrypted2 = "<i class='fa fa-lock fa-lg'></i>";
                    } else if (parseInt(folderData["en"]) == 0) {
                        encrypted2 = "<i class='fa fa-unlock fa-lg'></i>";
                    } else if (parseInt(folderData["en"]) == 3) {
                        encrypted2 = "";
                    }

                    tag = app.globalF.stripHTML(app.transform.from64str(tag));

                    var unread =
                        folderData["st"] == 0
                            ? "unread"
                            : folderData["st"] == 1
                            ? "fa fa-mail-reply"
                            : folderData["st"] == 2
                            ? "fa fa-mail-forward"
                            : "";

                    var attch =
                        folderData["at"] == "1"
                            ? '<span class="fa fa-paperclip fa-lg"></span>'
                            : "";

                    if (fromEmail == "") {
                        fromEmail = fromTitle;
                    }

                    var checkBpart =
                        '<label><input class="emailchk hidden-xs" type="checkbox" /></label>';

                    var fromPart = fromTitle; //  + trust + fromEmail

                    var dateAtPart = attch + encrypted2 + dispTime;

                    var tagPart = tag + tag;

                    emailListCopy[folderId][index] = {
                        DT_RowId: index,
                        unread: unread,
                        checkBpart: checkBpart,
                        dateAtPart: dateAtPart,
                        fromPart: fromPart,
                        sb: app.transform.escapeTags(
                            app.transform.from64str(folderData["sb"])
                        ),
                        bd: app.transform.escapeTags(
                            app.transform.from64str(folderData["bd"])
                        ),
                        tagPart: tagPart,
                        timestamp: time,
                    };

                    htmlSource +=
                        '<li id="' +
                        index +
                        '" class="' +
                        emailListCopy[folderId][index]["unread"] +
                        '"><div class="select-checkbox"><label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label></div><div class="date-time">' +
                        emailListCopy[folderId][index]["dateAtPart"] +
                        '</div><button class="started-icon"></button><div class="inbox-list-top">' +
                        emailListCopy[folderId][index]["fromPart"] +
                        '<button class="attachment-icon"></button><span class="unread-bullet"></span></div><div class="mail-toggle"><div class="mail-title">' +
                        emailListCopy[folderId][index]["sb"] +
                        "</div><p>" +
                        emailListCopy[folderId][index]["bd"] +
                        emailListCopy[folderId][index]["tagPart"] +
                        "</p></div></li>";
                }
            });

            $("#inboxList").html(htmlSource);
        },
        componentDidMount: function () {
            var dtSet = this.state.dataSet;
            var thisComp = this;
            app.globalF.getInboxFolderId(function (inbox) {
                thisComp.updateEmails(inbox, "");
            });
            app.user.on(
                "change:resetSelectedItems",
                function () {
                    if (app.user.get("resetSelectedItems")) {
                        app.user.set({ selectedEmails: {} });
                        app.user.set({ resetSelectedItems: false });
                    }
                },
                thisComp
            );
            app.user.on(
                "change:emailListRefresh",
                function () {
                    // $("#sdasdasd").addClass("hidden"); - find this in original inbox page
                    thisComp.updateEmails(thisComp.props.folderId, "noRefresh");
                },
                thisComp
            );
        },
        handleClick: function (i, event) {
            switch (i) {
                case "wholeFolder":
                    //  console.log('wholeFolder')
                    break;

                case "thisPage":
                    //  console.log('thisPage')
                    break;

                case "readEmail":
                    var thisComp = this;

                    var folder =
                        app.user.get("folders")[this.props.folderId]["name"];

                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            // console.log($(event.target).is("li"));
                            // var id = $(event.target).parents("li").attr("id");
                            var id = $(event.target).attr("id");
                            if (!$(event.target).is("input")) {
                                app.globalF.resetCurrentMessage();
                                app.globalF.resetDraftMessage();

                                Backbone.history.navigate(
                                    "/mail/" + app.transform.from64str(folder),
                                    {
                                        trigger: true,
                                    }
                                );

                                if (
                                    id != undefined &&
                                    $(event.target).attr("type") !=
                                        "checkbox" &&
                                    $(event.target).prop("tagName") != "LABEL"
                                ) {
                                    // $("#sdasdasd").removeClass("hidden"); - [NEW VERSION AVAILABLE BUTTON]
                                    // TODO: check if following is needed, otherwise remove it
                                    // $("#mMiddlePanelTop").addClass(
                                    //     " hidden-xs hidden-sm hidden-md"
                                    // );
                                    // $("#mRightPanel").removeClass(
                                    //     " hidden-xs hidden-sm hidden-md"
                                    // );
                                    // $(event.target)
                                    //     .parents("li.selected")
                                    //     .removeClass("selected");

                                    // $(event.target)
                                    //     .parents("li")
                                    //     .toggleClass("selected");

                                    $("#appRightSide").css("display", "block");

                                    $("#inboxList")
                                        .find("li")
                                        .removeClass("selected");
                                    $("#inboxList")
                                        .find("li#" + id)
                                        .addClass("selected");

                                    thisComp.setState({
                                        messsageId: id,
                                    });

                                    app.globalF.renderEmail(id);

                                    app.mixins.hidePopHover();
                                }
                            }
                        } else {
                        }
                    });

                    break;
            }
        },
        handleRefreshButton: function (event) {
            const _event = event;
            _event.target.children[0].classList.add("spin-animation");
            this.removeRefreshClass(_event.target.children[0]);
        },
        removeRefreshClass: function (_element) {
            setTimeout(function () {
                _element.classList.remove("spin-animation");
            }, 500);
        },
        render: function () {
            return (
                <div className="middle-section" id="appMiddleSection">
                    <div className="middle-top">
                        <div className="desktop-search">
                            <input type="search" placeholder="Search..." />
                        </div>
                        <div className="info-row">
                            <div className="all-check">
                                <label className="container-checkbox">
                                    <input
                                        type="checkbox"
                                        // onClick="toggle(this)"
                                    />
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
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="mail-sort"
                                    >
                                        <li>
                                            <label className="container-checkbox">
                                                <input
                                                    type="checkbox"
                                                    // onClick="toggle(this)"
                                                />
                                                <span className="checkmark"></span>{" "}
                                                <div>Select all</div>
                                            </label>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="star-yellow"></span>{" "}
                                                <div>Show all starred</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="star-gray"></span>{" "}
                                                <div>Show unstarred</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="eye"></span>{" "}
                                                <div>Show all read</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="eye-close"></span>{" "}
                                                <div>Show all unread</div>
                                            </button>
                                        </li>
                                        <li>
                                            <button>
                                                {" "}
                                                <span className="eye-close"></span>{" "}
                                                <div>Show email preview</div>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="info-row-right">
                                <div className="referesh-btn">
                                    <button
                                        id="referesh-btn"
                                        className="icon-btn"
                                        onClick={this.handleRefreshButton.bind(
                                            this
                                        )}
                                    >
                                        <i></i>
                                    </button>
                                </div>
                                <div className="ellipsis-dropdown">
                                    <button></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="middle-content">
                        <div className="inbox-list">
                            <ul
                                id="inboxList"
                                onClick={this.handleClick.bind(
                                    this,
                                    "readEmail"
                                )}
                            >
                                {}
                            </ul>
                        </div>
                        <div className="middle-pagination">
                            <div className="pagibox">
                                <button className="mail-prev"></button>
                                <span className="mail-count">1/38</span>
                                <button className="mail-next"></button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
