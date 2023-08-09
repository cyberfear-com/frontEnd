define(["react", "app", "dataTable", "dataTableAbsolute", "dataTableBoot"], function (React, app) {
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
                showPreview: true,

                moveFolderMain: [],
                moveFolderCust: [],
                checkNewMails: false,
                trashStatus: false,
                spamStatus: false,
                blackList: false,
                pastDue: false,
                balanceShort: false,
                hidden: true,
                isWorkingFlag: false,
                moveToFolderFlag: false,
                showReadUnread: ""
            };
        },
        componentWillReceiveProps: function (nextProps) {
            if (this.props.folderId != nextProps.folderId && this.props.folderId != "") {
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
                displayedFolder: app.transform.from64str(app.user.get("folders")[folderId]["name"]),
                emailInFolder: Object.keys(emails).length
            });

            app.user.set({
                currentFolder: app.transform.from64str(app.user.get("folders")[folderId]["name"])
            });

            if (app.user.get("folders")[folderId]["role"] != undefined) {
                var t = app.transform.from64str(app.user.get("folders")[folderId]["role"]);
            } else {
                var t = "";
            }

            //console.log(t);

            var data = [];
            var d = new Date();
            var trusted = app.user.get("trustedSenders");
            var encrypted2 = "";

            $.each(emails, function (index, folderData) {
                var time = folderData["tr"] != undefined ? folderData["tr"] : folderData["tc"] != undefined ? folderData["tc"] : "";

                if (d.toDateString() == new Date(parseInt(time + "000")).toDateString()) {
                    var dispTime = new Date(parseInt(time + "000")).toLocaleTimeString();
                } else {
                    var dispTime = new Date(parseInt(time + "000")).toLocaleDateString();
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
                        recipientTitle.push(app.globalF.parseEmail(str)["email"]);
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
                                        name = app.transform.from64str(email["name"]);
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

                    if (folderData["cc"] != undefined && Object.keys(folderData["cc"]).length > 0) {
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
                                            name = app.transform.from64str(email["name"]);
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

                    if (folderData["bcc"] != undefined && Object.keys(folderData["bcc"]).length > 0) {
                        $.each(folderData["bcc"], function (indexBCC, email) {
                            try {
                                var str = app.transform.from64str(indexBCC);
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
                                            name = app.transform.from64str(email["name"]);
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

                    recipient = recipient.join(", ");
                    recipientTitle = recipientTitle.join(", ");

                    fromEmail = recipient;
                    fromTitle = recipientTitle;
                } else {
                    var str = app.transform.from64str(folderData["fr"]);

                    fromEmail = app.globalF.parseEmail(str, true)["name"];
                    fromTitle = app.globalF.parseEmail(str, true)["email"];

                    if (trusted.indexOf(app.transform.SHA256(app.globalF.parseEmail(str)["email"])) !== -1) {
                        trust = "<img src='/img/logo/logo.png' style='height:25px'/>";
                    } else {
                        trust = "";
                    }
                    recipient = recipient.join(", ");
                    recipientTitle = recipientTitle.join(", ");
                }

                var titleTag = "";

                if (folderData["tg"].length > 0) {
                    var tag = folderData["tg"][0]["name"];
                    var tagColor = thisComp.getTagColor(tag);
                    titleTag = '<span class="taggs" title="' + tag + '"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M13.5119 9.2475L12.5969 8.3325C12.3794 8.145 12.2519 7.8675 12.2444 7.56C12.2294 7.2225 12.3644 6.885 12.6119 6.6375L13.5119 5.7375C14.2919 4.9575 14.5844 4.2075 14.3369 3.615C14.0969 3.03 13.3544 2.7075 12.2594 2.7075H4.42187V2.0625C4.42187 1.755 4.16687 1.5 3.85937 1.5C3.55187 1.5 3.29688 1.755 3.29688 2.0625V15.9375C3.29688 16.245 3.55187 16.5 3.85937 16.5C4.16687 16.5 4.42187 16.245 4.42187 15.9375V12.2775H12.2594C13.3394 12.2775 14.0669 11.9475 14.3144 11.355C14.5619 10.7625 14.2769 10.02 13.5119 9.2475Z" fill="' + tagColor + '"/></svg></span>';
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
                var unread = folderData["st"] == 0 ? "unread" : folderData["st"] == 1 ? "fa fa-mail-reply" : folderData["st"] == 2 ? "fa fa-mail-forward" : "";

                var attch = folderData["at"] == "1" ? '<span class="fa fa-paperclip fa-lg"></span>' : "";

                var sonn = folderData["pt"] === -1 ? '<span class="pinned"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.0516 6.34999L9.65156 1.94999C9.45156 1.74999 9.15156 1.74999 8.95156 1.94999L7.35156 3.54999C7.10156 3.79999 7.20156 4.09999 7.35156 4.24999L7.70156 4.59999L6.20156 6.09999C5.45156 5.94999 3.40156 5.59999 2.30156 6.69999C2.10156 6.89999 2.10156 7.19999 2.30156 7.39999L5.15156 10.25L2.00156 13.4C1.80156 13.6 1.80156 13.9 2.00156 14.1C2.20156 14.3 2.55156 14.25 2.70156 14.1L5.85156 10.95L8.70156 13.8C9.00156 14.05 9.30156 13.95 9.40156 13.8C10.5016 12.7 10.1516 10.65 10.0016 9.89999L11.5016 8.39999L11.8516 8.74999C12.0516 8.94999 12.3516 8.94999 12.5516 8.74999L14.1516 7.14999C14.2516 6.84999 14.2516 6.54999 14.0516 6.34999Z" fill="#4D535C"/></svg></span>' : "";

                // console.log(folderData["pt"]);

                if (fromEmail == "") {
                    fromEmail = fromTitle;
                }

                // var checkBpart = '<label><input class="emailchk hidden-xs" type="checkbox" /></label>';
                var checkBpart = '<div class="select-checkbox"><label class="container-checkbox"><input type="checkbox" name="inbox-email"> <span class="checkmark"></span></label></div>';

                // var fromPart =
                //     '<span class="from no-padding col-xs-8 col-md-3 ellipsisText margin-right-10" data-placement="bottom" data-toggle="popover-hover" title="" data-content="' +
                //     fromTitle +
                //     '">' +
                //     trust +
                //     " " +
                //     fromEmail +
                //     "</span>";

                var fromPart = '<span class="unread-bullet"></span>';

                // var dateAtPart =
                //     '<span class="no-padding date col-xs-3 col-sm-2">' +
                //     attch +
                //     "&nbsp;" +
                //     encrypted2 +
                //     " " +
                //     dispTime +
                //     '<span class="label label-primary f-s-10"></span><span class="label label-primary f-s-10"></span></span>';

                var dateAtPart = '<div class="date-time" data-time="' + time + '">' + sonn + attch + "&nbsp;" + encrypted2 + " " + dispTime + "</div>";

                var tagPart = '<div class="mailListLabel pull-right text-right col-xs-2"><div class="ellipsisText visible-xs"><span class="label label-success">' + tag + '</span></div><div class="ellipsisText hidden-xs col-xs-12 pull-right"><span class="label label-success">' + tag + "</span></div></div>";

                // var tagPart = "";

                emailListCopy[folderId][index] = {
                    DT_RowId: index,
                    unread: unread,
                    checkBpart: checkBpart,
                    dateAtPart: dateAtPart,
                    fromPart: fromPart,
                    sb: app.transform.escapeTags(app.transform.from64str(folderData["sb"])),
                    bd: app.transform.escapeTags(app.transform.from64str(folderData["bd"])),
                    tagPart: tagPart,
                    timestamp: time,
                    son: folderData["pt"]
                };
                var showPreview = thisComp.state.showPreview ? "" : "d-none";
                var row = {
                    DT_RowId: index,
                    email: {
                        display: '<div class="email no-padding ' + emailListCopy[folderId][index]["unread"] + '">' + emailListCopy[folderId][index]["checkBpart"] + emailListCopy[folderId][index]["dateAtPart"] + emailListCopy[folderId][index]["fromPart"] + '<div class="mail-toggle ' + showPreview + '"><div class="mail-title">' + titleTag + emailListCopy[folderId][index]["sb"] + "</div> <p><label class='from'>" + fromTitle + ": </label>" + emailListCopy[folderId][index]["bd"] + "</p></div>" + emailListCopy[folderId][index]["tagPart"] + "</div>",

                        timestamp: emailListCopy[folderId][index]["timestamp"],
                        sortOrder: folderData["pt"] === undefined ? emailListCopy[folderId][index]["timestamp"] : folderData["pt"]
                    }
                };

                data.push(row);
            });

            app.user.set({ folderCached: emailListCopy });

            var emTab = $("#emailListTable").DataTable();
            emTab.clear();
            if (noRefresh == "") {
                emTab.draw();
                thisComp.setState({
                    messsageId: "",
                    allChecked: false
                }, function () {
                    $("#selectAll>input").prop("checked", false);
                    $("#selectAllAlt > input").prop("checked", false);
                });
            }

            emTab.rows.add(data);
            emTab.draw(false);
            if (thisComp.state.showReadUnread == "read") {
                this.handleShowRead();
            }
            if (thisComp.state.showReadUnread == "unread") {
                this.handleShowUnRead();
            }

            // this.attachTooltip();

            $("#emailListTable td").click(function () {
                var selectedEmails = app.user.get("selectedEmails");
                // ".emailchk"
                if ($(this).find('[name="inbox-email"]').prop("checked")) {
                    selectedEmails[$(this).parents("tr").attr("id")] = true;
                    $("#mail-extra-options").addClass("active");
                } else {
                    delete selectedEmails[$(this).parents("tr").attr("id")];
                    $("#mail-extra-options").removeClass("active");
                }
            });
        },
        getTagColor: function (tagName) {
            var colorCode = `#c9d0da`;
            $.each(app.user.get("tags"), function (index, labelData) {
                if (tagName === index) {
                    colorCode = labelData.color;
                }
            });
            return colorCode;
        },
        handleShowPreview: function () {
            var thisComp = this;
            if (thisComp.state.showPreview) {
                $(document).find(".mail-toggle").addClass("d-none");
            } else {
                $(document).find(".mail-toggle").removeClass("d-none");
            }
            thisComp.setState({
                showPreview: !thisComp.state.showPreview
            });
        },
        componentWillUnmount: function () {
            app.user.off("change:checkNewEmails");
        },
        componentDidMount: function () {
            this.getMainFolderList();
            this.getCustomFolderList();

            var dtSet = this.state.dataSet;
            var thisComp = this;

            app.user.on("change:checkNewEmails", function () {
                thisComp.setState({
                    checkNewMails: app.user.get("checkNewEmails")
                });
            });

            var hidden = $.fn.dataTable.absoluteOrder([{ value: "-1", position: "top" }]);

            $("#emailListTable").dataTable({
                dom: '<"#checkAll"><"#emailListNavigation"pi>rt<"pull-right"p><"pull-right"i>',
                data: dtSet,
                columns: [{
                    data: {
                        _: "email.display",
                        sort: "email.timestamp",
                        filter: "email.display"
                    }
                }, {
                    data: {
                        _: "email.sortOrder"
                    }
                }],

                columnDefs: [{
                    sClass: "col-xs-12 border-right text-align-left no-padding padding-vertical-10",
                    targets: 0
                }, { orderDataType: "data-sort", targets: 0 }, {
                    targets: -1,
                    visible: false,
                    type: hidden
                }],
                sPaginationType: "simple",
                order: [[1, "desc"]],
                iDisplayLength: parseInt(app.user.get("mailPerPage")),
                language: {
                    emptyTable: "Empty",
                    info: "_START_ - _END_ of _TOTAL_",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>"
                    }
                },
                fnDrawCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $("#emailListTable thead").remove();
                },
                fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if ($(nRow).attr("id") == app.user.get("currentMessageView")["id"]) {
                        $(nRow).addClass("selected");
                    }

                    if (app.user.get("selectedEmails")[$(nRow).attr("id")] !== undefined) {
                        // ".emailchk"
                        $(nRow).find('[name="inbox-email"]').prop("checked", true);
                    }
                    //$(nRow).attr('id', aData[0]);

                    return nRow;
                }
            });

            app.globalF.getInboxFolderId(function (inbox) {
                thisComp.updateEmails(inbox, "");
            });
            app.user.on("change:resetSelectedItems", function () {
                if (app.user.get("resetSelectedItems")) {
                    app.user.set({ selectedEmails: {} });
                    app.user.set({ resetSelectedItems: false });
                }
            }, thisComp);
            app.user.on("change:emailListRefresh", function () {
                // $("#sdasdasd").addClass("hidden"); - find this in original inbox page
                thisComp.updateEmails(thisComp.props.folderId, "noRefresh");
            }, thisComp);
        },
        handleClick: function (i, event) {
            app.user.set({
                isDecryptingEmail: true
            });

            Backbone.history.loadUrl(Backbone.history.fragment);
            switch (i) {
                case "wholeFolder":
                    //  console.log('wholeFolder')
                    break;

                case "thisPage":
                    //  console.log('thisPage')
                    break;

                case "readEmail":
                    if ($(event.target).prop("class").toString() === "dataTables_empty") {
                        app.user.set({ isComposingEmail: false });
                        app.user.set({ isDraftOpened: false });
                        app.user.set({ isDecryptingEmail: false });
                        Backbone.history.loadUrl(Backbone.history.fragment);
                    } else {
                        if ($(event.target).prop("tagName").toUpperCase() !== "INPUT" && $(event.target).prop("tagName").toUpperCase() !== "SPAN") {
                            var thisComp = this;

                            var folder = app.user.get("folders")[this.props.folderId]["name"];
                            // If Draft folder items are clicked, close compose email is active have it close anyway
                            if (this.props.folderId === `ebf12ef47c`) {
                                app.user.set({ isComposingEmail: false });
                                app.user.set({ isDraftOpened: false });
                                Backbone.history.loadUrl(Backbone.history.fragment);
                            }

                            app.mixins.canNavigate(function (decision) {
                                $("#wrapper").addClass("email-read-active");
                                if (decision) {
                                    var id = $(event.target).parents("tr").attr("id");
                                    if ($(event.target).prop("tagName") !== "INPUT" || $(event.target).prop("tagName") !== "SPAN") {
                                        app.globalF.resetCurrentMessage();
                                        app.globalF.resetDraftMessage();

                                        Backbone.history.navigate("/mail/" + app.transform.from64str(folder), {
                                            trigger: true
                                        });
                                        if (id != undefined && ($(event.target).attr("type") !== "checkbox" || $(event.target).prop("tagName") !== "LABEL" || $(event.target).prop("tagName") !== "SPAN") || $(event.target).prop("tagName") !== "INPUT") {
                                            var table = $("#emailListTable").DataTable();
                                            table.$("tr.selected").removeClass("selected");

                                            $(event.target).parents("tr").toggleClass("selected");

                                            $("#appRightSide").css("display", "block");

                                            thisComp.setState({
                                                messsageId: id
                                            });

                                            app.globalF.renderEmail(id);

                                            app.mixins.hidePopHover();
                                        }
                                    }
                                } else {}
                            });
                        } else {
                            $("#wrapper").removeClass("email-read-active");
                            var thisComp = this;
                            var table = $("#emailListTable").DataTable();
                            $(event.target).parents("tr").toggleClass("selected");
                            $("#appRightSide").css("display", "none");
                            thisComp.setState({
                                messsageId: ""
                            });
                            app.user.set({ isDecryptingEmail: false });
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }
                    }
                    break;
            }
        },
        handleRefreshButton: function (event) {
            app.mailMan.startShift();

            const _event = event;
            _event.target.children[0].classList.add("spin-animation");
            this.removeRefreshClass(_event.target.children[0]);

            $("#selectAll>input").prop("checked", false);
            $("#selectAllAlt > input").prop("checked", false);
        },
        handleSearchChange: function (event) {
            if (event.target.value.length > 1) {
                $(".desktop-search").addClass("has-data");
            } else {
                $(".desktop-search").removeClass("has-data");
            }

            $("#emailListTable").DataTable().search(event.target.value, 0, 1).draw();
        },
        handleSearchReset: function () {
            $("#desktop-search").val("");
            $(".desktop-search").removeClass("has-data");
            $("#emailListTable").DataTable().search("", 0, 1).draw();
        },
        removeRefreshClass: function (_element) {
            setTimeout(function () {
                _element.classList.remove("spin-animation");
            }, 500);
        },
        handleChange: function (i, event) {
            var thisComp = this;

            switch (i) {
                case "moveToFolder":
                    var destFolderId = $(event.target).attr("id");

                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        thisComp.setState({
                            isWorkingFlag: true
                        });

                        app.user.set({ currentMessageView: {} });

                        app.globalF.move2Folder(destFolderId, selected, function () {
                            app.userObjects.updateObjects("folderUpdate", "", function (result) {
                                $("#selectAll>input").prop("checked", false);
                                $("#selectAllAlt > input").prop("checked", false);
                                app.user.set({
                                    resetSelectedItems: true
                                });
                                app.globalF.syncUpdates();
                                thisComp.setState({
                                    isWorkingFlag: false
                                });
                                $("#mail-extra-options").removeClass("active");
                            });
                        });
                    } else {
                        app.notifications.systemMessage("selectMsg");
                    }

                    app.user.set({
                        isDecryptingEmail: false
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;
                case "moveToTrash":
                    var thisComp = this;
                    this.setState({
                        trashStatus: true,
                        isWorkingFlag: true
                    });
                    var target = {};
                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target.removeClass("fa-trash-o").addClass("fa-refresh fa-spin");

                    if (this.props.folderId == app.user.get("systemFolders")["spamFolderId"] || this.props.folderId == app.user.get("systemFolders")["trashFolderId"] || this.props.folderId == app.user.get("systemFolders")["draftFolderId"]) {
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            //console.log(selected);
                            //delete email physically;
                            app.user.set({ currentMessageView: {} });

                            app.globalF.deleteEmailsFromFolder(selected, function (emails2Delete) {
                                //console.log(emails2Delete);
                                if (emails2Delete.length > 0) {
                                    app.userObjects.updateObjects("deleteEmail", emails2Delete, function (result) {
                                        $("#selectAll>input").prop("checked", false);
                                        $("#selectAllAlt > input").prop("checked", false);
                                        app.user.set({
                                            resetSelectedItems: true
                                        });
                                        app.globalF.syncUpdates();
                                        app.layout.display("viewBox");

                                        target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");

                                        thisComp.setState({
                                            trashStatus: false,
                                            isWorkingFlag: false
                                        });
                                        $("#mail-extra-options").removeClass("active");
                                    });
                                }
                            });
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false
                            });
                        }
                    } else {
                        var destFolderId = app.user.get("systemFolders")["trashFolderId"];
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            app.user.set({ currentMessageView: {} });
                            app.globalF.move2Folder(destFolderId, selected, function () {
                                app.userObjects.updateObjects("folderUpdate", "", function (result) {
                                    $("#selectAll>input").prop("checked", false);
                                    $("#selectAllAlt > input").prop("checked", false);
                                    app.user.set({
                                        resetSelectedItems: true
                                    });
                                    app.globalF.syncUpdates();
                                    app.layout.display("viewBox");

                                    target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");

                                    thisComp.setState({
                                        trashStatus: false,
                                        isWorkingFlag: false
                                    });
                                    $("#mail-extra-options").removeClass("active");
                                });
                            });
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target.removeClass("fa-refresh fa-spin").addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false
                            });
                        }
                    }

                    app.user.set({
                        isDecryptingEmail: false
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;

                case "blackList":
                    var thisComp = this;

                    console.log("blacklisting");
                    thisComp.setState({
                        blackList: true,
                        isWorkingFlag: true
                    });

                    var target = {};

                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }
                    target.removeClass("fa-stop").addClass("fa-refresh fa-spin");

                    console.log(app.user.get("systemFolders"));
                    var destFolderId = app.user.get("systemFolders")["trashFolderId"];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        var emailpromises = [];

                        app.user.set({ currentMessageView: {} });

                        app.globalF.move2Folder(destFolderId, selected, function () {
                            app.userObjects.updateObjects("folderUpdate", "", function (result) {
                                $.each(selected, function (index, emailId) {
                                    var emailMetaPromise = $.Deferred();

                                    var email = app.globalF.getEmailsFromString(app.transform.from64str(app.user.get("emails")["messages"][emailId]["fr"]).toLowerCase());
                                    console.log(email);

                                    var post = {
                                        ruleId: "",
                                        matchField: "emailM",
                                        text: email,
                                        destination: 0
                                    };

                                    app.serverCall.ajaxRequest("saveBlockedEmails", post, function (result) {
                                        if (result["response"] == "success") {
                                            emailMetaPromise.resolve();
                                        }
                                    });

                                    emailpromises.push(emailMetaPromise);
                                });

                                Promise.all(emailpromises).then(function () {
                                    app.notifications.systemMessage("saved");
                                    $("#selectAll>input").prop("checked", false);
                                    $("#selectAllAlt > input").prop("checked", false);
                                    app.user.set({
                                        resetSelectedItems: true
                                    });
                                    app.globalF.syncUpdates();
                                    app.layout.display("viewBox");

                                    target.removeClass("fa-spin fa-refresh").addClass("fa-stop");

                                    thisComp.setState({
                                        blackList: false,
                                        isWorkingFlag: false
                                    });
                                    $("#mail-extra-options").removeClass("active");
                                });
                            });
                        });
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        target.removeClass("fa-spin fa-refresh").addClass("fa-stop");

                        thisComp.setState({
                            blackList: false,
                            isWorkingFlag: false
                        });
                    }

                    break;

                case "moveToSpam":
                    // console.log('move to spam');

                    var thisComp = this;

                    thisComp.setState({
                        spamStatus: true,
                        isWorkingFlag: true
                    });
                    var target = {};

                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target.addClass("fa-spin");

                    var destFolderId = app.user.get("systemFolders")["spamFolderId"];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        app.user.set({ currentMessageView: {} });
                        app.globalF.move2Folder(destFolderId, selected, function () {
                            $.each(selected, function (index, emailId) {
                                var email = app.transform.from64str(app.user.get("emails")["messages"][emailId]["fr"]);
                                app.globalF.createFilterRule("", "sender", "strict", destFolderId, app.globalF.parseEmail(email)["email"], function () {});
                            });

                            app.userObjects.updateObjects("folderSettings", "", function (result) {
                                if (result["response"] == "success" && result["data"] == "saved") {
                                    $("#selectAll>input").prop("checked", false);
                                    $("#selectAllAlt > input").prop("checked", false);
                                    app.user.set({
                                        resetSelectedItems: true
                                    });
                                    app.globalF.syncUpdates();
                                    app.layout.display("viewBox");

                                    target.removeClass("fa-spin");

                                    thisComp.setState({
                                        spamStatus: false,
                                        isWorkingFlag: false
                                    });
                                    $("#mail-extra-options").removeClass("active");
                                }
                            });
                        });
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        target.removeClass("fa-spin");

                        thisComp.setState({
                            spamStatus: false,
                            isWorkingFlag: false
                        });
                    }

                    app.user.set({
                        isDecryptingEmail: false
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;

                case "markAsRead":
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        thisComp.setState({
                            isWorkingFlag: true
                        });
                        var messages = app.user.get("emails")["messages"];
                        //var folders=app.user.get('emails')['folders'];

                        $.each(selected, function (index, emailId) {
                            //folders[messages[emailId]['f']][emailId]['st']==0?folders[messages[emailId]['f']][emailId]['st']=3:folders[messages[emailId]['f']][emailId]['st'];
                            messages[emailId]["st"] == 0 ? messages[emailId]["st"] = 3 : messages[emailId]["st"];
                        });

                        app.userObjects.updateObjects("folderUpdate", "", function (result) {
                            $("#selectAll>input").prop("checked", false);
                            $("#selectAllAlt > input").prop("checked", false);
                            app.user.set({ resetSelectedItems: true });
                            app.globalF.syncUpdates();
                            thisComp.setState({
                                isWorkingFlag: false
                            });
                            $("#mail-extra-options").removeClass("active");
                        });

                        //app.userObjects.saveMailBox('emailsRead',{});
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        thisComp.setState({
                            isWorkingFlag: false
                        });
                    }

                    break;

                case "markAsUnread":
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        thisComp.setState({
                            isWorkingFlag: true
                        });
                        var messages = app.user.get("emails")["messages"];
                        //var folders=app.user.get('emails')['folders'];

                        $.each(selected, function (index, emailId) {
                            //folders[messages[emailId]['f']][emailId]['st']=0;
                            messages[emailId]["st"] = 0;
                        });

                        app.userObjects.updateObjects("folderUpdate", "", function (result) {
                            $("#selectAll>input").prop("checked", false);
                            $("#selectAllAlt > input").prop("checked", false);
                            app.user.set({ resetSelectedItems: true });
                            app.globalF.syncUpdates();
                            thisComp.setState({
                                isWorkingFlag: false
                            });
                            $("#mail-extra-options").removeClass("active");
                        });

                        //app.userObjects.saveMailBox('emailsRead',{});
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        thisComp.setState({
                            isWorkingFlag: false
                        });
                    }
                    break;
            }
        },
        getSelected: function () {
            var selected = [];

            selected = Object.keys(app.user.get("selectedEmails"));

            if (selected.length == 0) {
                // var elem = {};
                // var item = $("#emailListTable tr.selected").attr("id");
                $("#emailListTable tr").each(function () {
                    if ($(this).find(".select-checkbox input").is(":checked")) {
                        var item = $(this).closest("tr").attr("id");
                        if (item != undefined) {
                            selected.push(item);
                        }
                    }
                });
            }
            return selected;
        },
        getMainFolderList: function () {
            var mainFolderList = app.globalF.getMainFolderList();
            var thisComp = this;

            var options = [];
            $.each(mainFolderList, function (index, folderData) {
                // ["Inbox", "Spam", "Trash"]
                if (["Inbox"].indexOf(folderData["role"]) > -1) {
                    options.push(React.createElement(
                        "li",
                        { key: folderData["index"] },
                        React.createElement(
                            "a",
                            {
                                id: folderData["index"],
                                onClick: thisComp.handleChange.bind(thisComp, "moveToFolder")
                            },
                            folderData["name"]
                        )
                    ));
                }
            });

            this.setState({
                moveFolderMain: options
            });
        },
        getCustomFolderList: function () {
            var folderList = app.globalF.getCustomFolderList();
            var thisComp = this;

            var options = [];
            $.each(folderList, function (index, folderData) {
                options.push(React.createElement(
                    "li",
                    { key: index },
                    React.createElement(
                        "a",
                        {
                            id: folderData["index"],
                            onClick: thisComp.handleChange.bind(thisComp, "moveToFolder")
                        },
                        folderData["name"]
                    )
                ));
            });
            this.setState({
                moveFolderCust: options
            });
        },
        handleSelectAll: function (event) {
            var thisComp = this;
            var selectedEmails = app.user.get("selectedEmails");
            if (event.target.checked) {
                thisComp.setState({
                    allChecked: true
                });
                $(".select-checkbox input").prop("checked", true);
                $(".select-checkbox").each(function (index) {
                    var messageId = $(this).closest("tr").attr("id");
                    selectedEmails[messageId] = true;
                });
                $("#mail-extra-options").addClass("active");
            } else {
                $("#mail-extra-options").removeClass("active");
                $(".select-checkbox input").prop("checked", false);
                thisComp.setState({
                    allChecked: false
                });
                app.user.set({ selectedEmails: {} });
            }
        },
        handleShowAll: function (event) {
            this.setState({
                showReadUnread: ""
            });
            $("#emailListTable td > div").removeClass("d-none");
        },
        handleShowRead: function (event) {
            this.setState({
                showReadUnread: "read"
            });
            $("#emailListTable td > div").removeClass("d-none");
            $("#emailListTable td > div").each(function () {
                jElement = $(this);
                if (jElement.hasClass("unread")) {
                    jElement.addClass("d-none");
                }
            });
        },
        handleShowUnRead: function (event) {
            this.setState({
                showReadUnread: "unread"
            });
            $("#emailListTable td > div").addClass("d-none");
            $("#emailListTable td > div").each(function () {
                jElement = $(this);
                if (jElement.hasClass("unread")) {
                    jElement.removeClass("d-none");
                }
            });
        },
        handleClickMoveToFolder: function (event) {
            const currentPosition = this.state.moveToFolderFlag;
            this.setState({
                moveToFolderFlag: !currentPosition
            });
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    {
                        className: this.state.isWorkingFlag ? "in-working popup d-block" : "in-working popup d-none"
                    },
                    React.createElement(
                        "div",
                        { className: "wrapper" },
                        React.createElement(
                            "div",
                            { className: "inner" },
                            React.createElement(
                                "div",
                                { className: "content" },
                                React.createElement(
                                    "div",
                                    { className: "t-animation" },
                                    React.createElement(
                                        "div",
                                        { className: "loading-animation type-progress style-circle" },
                                        React.createElement(
                                            "div",
                                            { className: "progress-circle medium" },
                                            React.createElement(
                                                "div",
                                                { className: "circle-bg" },
                                                React.createElement("img", {
                                                    src: "/images/loading-circle.svg",
                                                    alt: "loading-circle",
                                                    style: {
                                                        width: "91px",
                                                        height: "91px"
                                                    }
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "circle-content" },
                                                React.createElement(
                                                    "div",
                                                    { className: "loading-spinner" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "the-spinner" },
                                                        React.createElement("div", { className: "_bar1" }),
                                                        React.createElement("div", { className: "_bar2" }),
                                                        React.createElement("div", { className: "_bar3" }),
                                                        React.createElement("div", { className: "_bar4" }),
                                                        React.createElement("div", { className: "_bar5" }),
                                                        React.createElement("div", { className: "_bar6" }),
                                                        React.createElement("div", { className: "_bar7" }),
                                                        React.createElement("div", { className: "_bar8" })
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "t-text" },
                                    React.createElement(
                                        "h2",
                                        null,
                                        "Processing..."
                                    ),
                                    React.createElement(
                                        "h6",
                                        null,
                                        "Please wait while we set things up for you."
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "middle-section", id: "appMiddleSection" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "div",
                            { className: "desktop-search" },
                            React.createElement("input", {
                                type: "search",
                                placeholder: "Search...",
                                id: "desktop-search",
                                onChange: this.handleSearchChange.bind(this)
                            }),
                            React.createElement(
                                "span",
                                {
                                    className: "icon",
                                    onClick: this.handleSearchReset.bind(this)
                                },
                                React.createElement(
                                    "svg",
                                    {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        viewBox: "0 0 48 48"
                                    },
                                    React.createElement("path", { d: "m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" })
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "info-row", id: "checkAll" },
                            React.createElement(
                                "div",
                                { className: "all-check" },
                                React.createElement(
                                    "label",
                                    {
                                        className: "container-checkbox",
                                        id: "selectAll"
                                    },
                                    React.createElement("input", {
                                        type: "checkbox",
                                        onChange: this.handleSelectAll.bind(this),
                                        checked: this.state.allChecked
                                    }),
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
                                        "aria-expanded": "false",
                                        "data-bs-auto-close": "outside"
                                    }),
                                    React.createElement(
                                        "ul",
                                        {
                                            className: "dropdown-menu",
                                            "aria-labelledby": "mail-sort"
                                        },
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "label",
                                                {
                                                    id: "selectAllAlt",
                                                    className: "container-checkbox"
                                                },
                                                React.createElement("input", {
                                                    type: "checkbox",
                                                    onChange: this.handleSelectAll.bind(this),
                                                    checked: this.state.allChecked
                                                }),
                                                React.createElement("span", { className: "checkmark" }),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Select all"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                null,
                                                " ",
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            fillRule: "evenodd",
                                                            clipRule: "evenodd"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M8.6734 1.00299C8.54739 0.746078 8.28618 0.583252 8.00003 0.583252C7.71387 0.583252 7.45266 0.746077 7.32665 1.00299L5.50041 4.72653L1.89079 5.25792C1.61006 5.29924 1.37669 5.49546 1.28778 5.76493C1.19888 6.0344 1.26966 6.33096 1.47068 6.53123L4.17678 9.22729L3.26863 13.2273C3.20408 13.5116 3.31017 13.8076 3.54064 13.9862C3.77112 14.1648 4.08421 14.1936 4.34342 14.0601L8.00002 12.1769L11.6566 14.0601C11.9158 14.1936 12.2289 14.1648 12.4594 13.9862C12.6899 13.8076 12.796 13.5116 12.7314 13.2273L11.8233 9.22729L14.5294 6.53123C14.7304 6.33096 14.8012 6.0344 14.7123 5.76493C14.6234 5.49546 14.39 5.29924 14.1093 5.25792L10.4996 4.72653L8.6734 1.00299Z",
                                                            fill: "#FFB84C"
                                                        })
                                                    )
                                                ),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all starred"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                null,
                                                " ",
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            fillRule: "evenodd",
                                                            clipRule: "evenodd"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M8.6734 1.00299C8.54739 0.746078 8.28618 0.583252 8.00003 0.583252C7.71387 0.583252 7.45266 0.746077 7.32665 1.00299L5.50041 4.72653L1.89079 5.25792C1.61006 5.29924 1.37669 5.49546 1.28778 5.76493C1.19888 6.0344 1.26966 6.33096 1.47068 6.53123L4.17678 9.22729L3.26863 13.2273C3.20408 13.5116 3.31017 13.8076 3.54064 13.9862C3.77112 14.1648 4.08421 14.1936 4.34342 14.0601L8.00002 12.1769L11.6566 14.0601C11.9158 14.1936 12.2289 14.1648 12.4594 13.9862C12.6899 13.8076 12.796 13.5116 12.7314 13.2273L11.8233 9.22729L14.5294 6.53123C14.7304 6.33096 14.8012 6.0344 14.7123 5.76493C14.6234 5.49546 14.39 5.29924 14.1093 5.25792L10.4996 4.72653L8.6734 1.00299Z",
                                                            fill: "#080D13"
                                                        })
                                                    )
                                                ),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show unstarred"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowRead.bind(this)
                                                },
                                                " ",
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M3.31903 12.4194C3.14545 12.7955 3.30963 13.2411 3.68572 13.4147C4.06181 13.5882 4.5074 13.4241 4.68097 13.048L3.31903 12.4194ZM19.319 13.048C19.4926 13.4241 19.9382 13.5882 20.3143 13.4147C20.6904 13.2411 20.8545 12.7955 20.681 12.4194L19.319 13.048ZM4.68097 13.048C7.61285 6.69527 16.3871 6.69527 19.319 13.048L20.681 12.4194C17.2129 4.9048 6.78715 4.9048 3.31903 12.4194L4.68097 13.048ZM12 15.7163C11.1409 15.7163 10.4375 15.016 10.4375 14.1529H8.9375C8.9375 15.846 10.3141 17.2163 12 17.2163V15.7163ZM10.4375 14.1529C10.4375 13.2909 11.1407 12.5904 12 12.5904V11.0904C10.3143 11.0904 8.9375 12.4605 8.9375 14.1529H10.4375ZM12 12.5904C12.8592 12.5904 13.5624 13.2909 13.5624 14.1529H15.0624C15.0624 12.4605 13.6857 11.0904 12 11.0904V12.5904ZM13.5624 14.1529C13.5624 15.016 12.859 15.7163 12 15.7163V17.2163C13.6859 17.2163 15.0624 15.846 15.0624 14.1529H13.5624Z",
                                                            fill: "black"
                                                        })
                                                    )
                                                ),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all read"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowUnRead.bind(this)
                                                },
                                                " ",
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z",
                                                            fill: "#080D13"
                                                        }),
                                                        React.createElement("line", {
                                                            x1: "19.8485",
                                                            y1: "0.529136",
                                                            x2: "5.84854",
                                                            y2: "22.9799",
                                                            stroke: "black",
                                                            "stroke-width": "2"
                                                        })
                                                    )
                                                ),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all unread"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowAll.bind(this)
                                                },
                                                " ",
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M3.31903 12.4194C3.14545 12.7955 3.30963 13.2411 3.68572 13.4147C4.06181 13.5882 4.5074 13.4241 4.68097 13.048L3.31903 12.4194ZM19.319 13.048C19.4926 13.4241 19.9382 13.5882 20.3143 13.4147C20.6904 13.2411 20.8545 12.7955 20.681 12.4194L19.319 13.048ZM4.68097 13.048C7.61285 6.69527 16.3871 6.69527 19.319 13.048L20.681 12.4194C17.2129 4.9048 6.78715 4.9048 3.31903 12.4194L4.68097 13.048ZM12 15.7163C11.1409 15.7163 10.4375 15.016 10.4375 14.1529H8.9375C8.9375 15.846 10.3141 17.2163 12 17.2163V15.7163ZM10.4375 14.1529C10.4375 13.2909 11.1407 12.5904 12 12.5904V11.0904C10.3143 11.0904 8.9375 12.4605 8.9375 14.1529H10.4375ZM12 12.5904C12.8592 12.5904 13.5624 13.2909 13.5624 14.1529H15.0624C15.0624 12.4605 13.6857 11.0904 12 11.0904V12.5904ZM13.5624 14.1529C13.5624 15.016 12.859 15.7163 12 15.7163V17.2163C13.6859 17.2163 15.0624 15.846 15.0624 14.1529H13.5624Z",
                                                            fill: "black"
                                                        })
                                                    )
                                                ),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    "Show all"
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "li",
                                            null,
                                            React.createElement(
                                                "button",
                                                {
                                                    onClick: this.handleShowPreview.bind(this)
                                                },
                                                " ",
                                                this.state.showPreview ? React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M3.31903 12.4194C3.14545 12.7955 3.30963 13.2411 3.68572 13.4147C4.06181 13.5882 4.5074 13.4241 4.68097 13.048L3.31903 12.4194ZM19.319 13.048C19.4926 13.4241 19.9382 13.5882 20.3143 13.4147C20.6904 13.2411 20.8545 12.7955 20.681 12.4194L19.319 13.048ZM4.68097 13.048C7.61285 6.69527 16.3871 6.69527 19.319 13.048L20.681 12.4194C17.2129 4.9048 6.78715 4.9048 3.31903 12.4194L4.68097 13.048ZM12 15.7163C11.1409 15.7163 10.4375 15.016 10.4375 14.1529H8.9375C8.9375 15.846 10.3141 17.2163 12 17.2163V15.7163ZM10.4375 14.1529C10.4375 13.2909 11.1407 12.5904 12 12.5904V11.0904C10.3143 11.0904 8.9375 12.4605 8.9375 14.1529H10.4375ZM12 12.5904C12.8592 12.5904 13.5624 13.2909 13.5624 14.1529H15.0624C15.0624 12.4605 13.6857 11.0904 12 11.0904V12.5904ZM13.5624 14.1529C13.5624 15.016 12.859 15.7163 12 15.7163V17.2163C13.6859 17.2163 15.0624 15.846 15.0624 14.1529H13.5624Z",
                                                            fill: "black"
                                                        })
                                                    )
                                                ) : React.createElement(
                                                    "span",
                                                    null,
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement("path", {
                                                            d: "M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z",
                                                            fill: "#080D13"
                                                        }),
                                                        React.createElement("line", {
                                                            x1: "19.8485",
                                                            y1: "0.529136",
                                                            x2: "5.84854",
                                                            y2: "22.9799",
                                                            stroke: "black",
                                                            "stroke-width": "2"
                                                        })
                                                    )
                                                ),
                                                " ",
                                                React.createElement(
                                                    "div",
                                                    null,
                                                    this.state.showPreview ? "Hide email preview" : "Show email preview"
                                                )
                                            )
                                        )
                                    )
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
                                            className: "icon-btn",
                                            onClick: this.handleRefreshButton.bind(this)
                                        },
                                        React.createElement("i", null)
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "arrow-btn ellipsis-dropdown" },
                                    React.createElement(
                                        "div",
                                        { className: "dropdown dropstart" },
                                        React.createElement(
                                            "button",
                                            {
                                                className: "btn btn-secondary dropdown-toggle",
                                                type: "button",
                                                id: "mail-extra-options",
                                                "data-bs-toggle": "dropdown",
                                                "aria-expanded": "false",
                                                "data-bs-auto-close": "outside"
                                            },
                                            React.createElement(
                                                "svg",
                                                {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg"
                                                },
                                                React.createElement("path", { d: "M13.2727 12.0909C13.2727 11.1872 12.5401 10.4546 11.6364 10.4546C10.7326 10.4546 10 11.1872 10 12.0909C10 12.9947 10.7326 13.7273 11.6364 13.7273C12.5401 13.7273 13.2727 12.9947 13.2727 12.0909Z" }),
                                                React.createElement("path", { d: "M13.2727 18.3636C13.2727 17.4599 12.5401 16.7273 11.6364 16.7273C10.7326 16.7273 10 17.4599 10 18.3636C10 19.2674 10.7326 20 11.6364 20C12.5401 20 13.2727 19.2674 13.2727 18.3636Z" }),
                                                React.createElement("path", { d: "M13.2727 5.81823C13.2727 4.91449 12.5401 4.18186 11.6364 4.18186C10.7326 4.18186 10 4.91449 10 5.81823C10 6.72196 10.7326 7.45459 11.6364 7.45459C12.5401 7.45459 13.2727 6.72196 13.2727 5.81823Z" })
                                            )
                                        ),
                                        React.createElement(
                                            "ul",
                                            {
                                                className: "dropdown-menu",
                                                id: "mail-extra-options"
                                            },
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleClickMoveToFolder.bind(this)
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 16 16"
                                                            },
                                                            React.createElement("path", {
                                                                fill: "#212121",
                                                                d: "M11,6.99859568 C13.2099146,6.99859568 15.0014043,8.79008541 15.0014043,11 C15.0014043,13.2099146 13.2099146,15.0014043 11,15.0014043 C8.79008541,15.0014043 6.99859568,13.2099146 6.99859568,11 C6.99859568,8.79008541 8.79008541,6.99859568 11,6.99859568 Z M3.00029246,4.08524952 L3,10.5 C3,11.8254834 4.03153594,12.9100387 5.33562431,12.9946823 L5.5,13 L6.41455474,13.0001005 C6.570562,13.3572616 6.76707514,13.692679 6.99828794,14.0005466 L5,14 C3.34314575,14 2,12.6568542 2,11 L2,5.5 C2,4.84678131 2.41754351,4.29108512 3.00029246,4.08524952 Z M10.7982202,8.04519957 L10.7219826,8.08859116 L10.6527347,8.14644661 L10.5948793,8.2156945 C10.4767577,8.38620412 10.4767577,8.61379588 10.5948793,8.7843055 L10.6527347,8.85355339 L12.298,10.499 L8.5,10.5 L8.41012437,10.5080557 C8.20603131,10.5450996 8.04509963,10.7060313 8.00805567,10.9101244 L8,11 L8.00805567,11.0898756 C8.04509963,11.2939687 8.20603131,11.4549004 8.41012437,11.4919443 L8.5,11.5 L12.3,11.499 L10.6527347,13.1464466 L10.5948793,13.2156945 C10.4598832,13.4105626 10.4791684,13.679987 10.6527347,13.8535534 C10.8263011,14.0271197 11.0957255,14.0464049 11.2905936,13.9114088 L11.3598415,13.8535534 L13.8894794,11.3212104 L13.9264615,11.2711351 L13.9684959,11.1910366 L13.9945326,11.1082776 L14.0043382,11.0443521 L14.0043382,10.9557501 L13.9945537,10.8920225 L13.9686776,10.8094049 L13.926777,10.7292723 L13.889498,10.6788087 L11.3598415,8.14644661 L11.2905936,8.08859116 C11.1444425,7.98734412 10.9563535,7.97288026 10.7982202,8.04519957 Z M10.5,2 C11.3284271,2 12,2.67157288 12,3.5 L12.0007536,6.09873786 C11.6774063,6.0330692 11.342729,5.99859568 11,5.99859568 L11,3.5 C11,3.22385763 10.7761424,3 10.5,3 L5.5,3 C5.22385763,3 5,3.22385763 5,3.5 L5,10.5 C5,10.7761424 5.22385763,11 5.5,11 L5.99859568,11 C5.99859568,11.342729 6.0330692,11.6774063 6.09873786,12.0007536 L5.5,12 C4.67157288,12 4,11.3284271 4,10.5 L4,3.5 C4,2.67157288 4.67157288,2 5.5,2 L10.5,2 Z"
                                                            })
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Move To"
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    {
                                                        className: `dd-inner ${this.state.moveToFolderFlag ? "d-block" : "d-none"}`
                                                    },
                                                    this.state.moveFolderMain,
                                                    React.createElement("li", { className: "divider" }),
                                                    this.state.moveFolderCust
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "moveToTrash"),
                                                        disabled: this.state.trashStatus
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                xmlns: "http://www.w3.org/2000/svg"
                                                            },
                                                            React.createElement("path", {
                                                                "fill-rule": "evenodd",
                                                                "clip-rule": "evenodd",
                                                                d: "M10.4062 2.25L10.4415 2.25H13.5585L13.5938 2.25C13.9112 2.24996 14.2092 2.24992 14.459 2.27844C14.7371 2.31019 15.0296 2.38361 15.3025 2.58033C15.5754 2.77704 15.7375 3.03124 15.8556 3.28508C15.9616 3.51299 16.0559 3.79574 16.1562 4.09685L16.1562 4.09687L16.1562 4.0969L16.1674 4.13037L16.5406 5.25H19H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H19.7017L19.1217 15.449L19.1182 15.5016C19.0327 16.7844 18.9637 17.8205 18.8017 18.6336C18.6333 19.4789 18.3469 20.185 17.7553 20.7384C17.1637 21.2919 16.4401 21.5307 15.5855 21.6425C14.7634 21.75 13.725 21.75 12.4394 21.75H12.3867H11.6133H11.5606C10.275 21.75 9.23655 21.75 8.41451 21.6425C7.55986 21.5307 6.83631 21.2919 6.24472 20.7384C5.65312 20.185 5.3667 19.4789 5.19831 18.6336C5.03633 17.8205 4.96727 16.7844 4.88178 15.5016L4.87827 15.449L4.29834 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H5H7.45943L7.83264 4.13037L7.8438 4.09688L7.84381 4.09686C7.94414 3.79575 8.03835 3.51299 8.14438 3.28508C8.26246 3.03124 8.42459 2.77704 8.69752 2.58033C8.97045 2.38361 9.26287 2.31019 9.54102 2.27844C9.79077 2.24992 10.0888 2.24996 10.4062 2.25ZM9.04057 5.25H14.9594L14.7443 4.60472C14.6289 4.25832 14.5611 4.05863 14.4956 3.91778C14.466 3.85423 14.4457 3.82281 14.4348 3.80824C14.4298 3.80149 14.427 3.79862 14.4264 3.79801L14.4254 3.79719L14.4243 3.79654C14.4236 3.79616 14.42 3.79439 14.412 3.79174C14.3947 3.78604 14.3585 3.7767 14.2888 3.76875C14.1345 3.75113 13.9236 3.75 13.5585 3.75H10.4415C10.0764 3.75 9.86551 3.75113 9.71117 3.76875C9.64154 3.7767 9.60531 3.78604 9.58804 3.79174C9.58005 3.79439 9.57643 3.79616 9.57566 3.79654L9.57458 3.79719L9.57363 3.79801C9.57302 3.79862 9.57019 3.80149 9.56516 3.80824C9.55428 3.82281 9.53397 3.85423 9.50441 3.91778C9.43889 4.05863 9.37113 4.25832 9.25566 4.60472L9.04057 5.25ZM5.80166 6.75L6.37495 15.3492C6.4648 16.6971 6.52883 17.6349 6.6694 18.3405C6.80575 19.025 6.99608 19.3873 7.2695 19.6431C7.54291 19.8988 7.91707 20.0647 8.60907 20.1552C9.32247 20.2485 10.2625 20.25 11.6133 20.25H12.3867C13.7375 20.25 14.6775 20.2485 15.3909 20.1552C16.0829 20.0647 16.4571 19.8988 16.7305 19.6431C17.0039 19.3873 17.1943 19.025 17.3306 18.3405C17.4712 17.6349 17.5352 16.6971 17.6251 15.3492L18.1983 6.75H16H8H5.80166ZM10 9.25C10.4142 9.25 10.75 9.58579 10.75 10V17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25 17.4142 9.25 17V10C9.25 9.58579 9.58579 9.25 10 9.25ZM14.75 10C14.75 9.58579 14.4142 9.25 14 9.25C13.5858 9.25 13.25 9.58579 13.25 10V14C13.25 14.4142 13.5858 14.75 14 14.75C14.4142 14.75 14.75 14.4142 14.75 14V10Z",
                                                                fill: "#080D13"
                                                            })
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Delete"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "moveToSpam"),
                                                        disabled: this.state.spamStatus
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                xmlns: "http://www.w3.org/2000/svg"
                                                            },
                                                            React.createElement("path", {
                                                                "fill-rule": "evenodd",
                                                                "clip-rule": "evenodd",
                                                                d: "M8.94513 3.25H9H15H15.0549C16.4225 3.24998 17.5248 3.24996 18.3918 3.36652C19.2919 3.48754 20.0497 3.74643 20.6517 4.34835C21.2536 4.95027 21.5125 5.70814 21.6335 6.60825C21.75 7.47522 21.75 8.57754 21.75 9.94513V10V20C21.75 20.2599 21.6154 20.5013 21.3943 20.638C21.1732 20.7746 20.8971 20.7871 20.6646 20.6708L18.3538 19.5154C17.4828 19.0799 17.1513 18.9193 16.8024 18.8369C16.4536 18.7546 16.0852 18.75 15.1115 18.75H9H8.94513H8.94512H8.94511C7.57753 18.75 6.47521 18.75 5.60825 18.6335C4.70814 18.5125 3.95027 18.2536 3.34835 17.6517C2.74643 17.0497 2.48754 16.2919 2.36652 15.3918C2.24996 14.5248 2.24998 13.4225 2.25 12.0549V12V10V9.94513C2.24998 8.57754 2.24996 7.47522 2.36652 6.60825C2.48754 5.70814 2.74643 4.95027 3.34835 4.34835C3.95027 3.74643 4.70814 3.48754 5.60825 3.36652C6.47522 3.24996 7.57754 3.24998 8.94513 3.25ZM5.80812 4.85315C5.07435 4.9518 4.68577 5.13225 4.40901 5.40901C4.13225 5.68577 3.9518 6.07435 3.85315 6.80812C3.75159 7.56347 3.75 8.56458 3.75 10V12C3.75 13.4354 3.75159 14.4365 3.85315 15.1919C3.9518 15.9257 4.13225 16.3142 4.40901 16.591C4.68577 16.8678 5.07435 17.0482 5.80812 17.1469C6.56347 17.2484 7.56458 17.25 9 17.25H15.1115L15.2 17.25C16.0554 17.2498 16.6077 17.2498 17.1471 17.3771C17.6864 17.5044 18.1803 17.7515 18.9454 18.1341L19.0246 18.1738L20.25 18.7865V10C20.25 8.56458 20.2484 7.56347 20.1469 6.80812C20.0482 6.07435 19.8678 5.68577 19.591 5.40901C19.3142 5.13225 18.9257 4.9518 18.1919 4.85315C17.4365 4.75159 16.4354 4.75 15 4.75H9C7.56458 4.75 6.56347 4.75159 5.80812 4.85315ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V11C11.25 11.4142 11.5858 11.75 12 11.75C12.4142 11.75 12.75 11.4142 12.75 11V7Z",
                                                                fill: "#415067"
                                                            })
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Spam"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "markAsRead")
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 24 24"
                                                            },
                                                            React.createElement("path", { d: "M.026 24l11.974-11.607 11.974 11.607h-23.948zm11.964-23.961l-11.99 8.725v12.476l7.352-7.127-5.653-4.113 10.291-7.488 10.309 7.488-5.655 4.108 7.356 7.132v-12.476l-12.01-8.725z" })
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Mark as Read"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "markAsUnread")
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 24 24"
                                                            },
                                                            React.createElement("path", { d: "M12 12.713l-11.985-9.713h23.971l-11.986 9.713zm-5.425-1.822l-6.575-5.329v12.501l6.575-7.172zm10.85 0l6.575 7.172v-12.501l-6.575 5.329zm-1.557 1.261l-3.868 3.135-3.868-3.135-8.11 8.848h23.956l-8.11-8.848z" })
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Mark as Unread"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "button",
                                                    {
                                                        onClick: this.handleChange.bind(this, "blackList")
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 24 24"
                                                            },
                                                            React.createElement("path", { d: "M11.75 3.092v8.538c0 .383.688.391.688 0v-7.17c0-1.357 2.395-1.399 2.395 0v8.125c0 .5.491.573.676.197.176-.361.908-1.974.917-1.991.735-1.541 3.193-.605 2.429 1.209-.19.492-2.544 5.832-3.144 7.179-.629 1.411-1.857 2.821-4.126 2.821h-3.94c-2.388 0-3.645-1.417-3.645-3.895v-10.812c0-1.434 1.976-1.362 1.976-.066v4.741c0 .391.715.389.715 0v-7.618c0-1.475 2.208-1.435 2.208 0v7.192c0 .397.664.378.664-.008v-8.442c0-1.435 2.187-1.477 2.187 0zm-1.081-3.092c-1.055 0-1.972.499-2.53 1.277-1.833-.2-3.391 1.146-3.446 2.972-1.554.143-2.693 1.403-2.693 3.044v10.812c0 3.636 2.163 5.895 5.645 5.895h3.94c2.686 0 4.8-1.423 5.953-4.006.437-.981 2.873-6.496 3.17-7.24.464-1.119.373-2.297-.25-3.236-.761-1.146-2.233-1.75-3.624-1.41v-3.649c0-1.914-1.646-3.203-3.53-3.017-.532-.879-1.492-1.442-2.635-1.442z" })
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "Block Sender"
                                                    )
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
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            { className: "inbox-list" },
                            React.createElement("table", {
                                className: "table table-hover table-inbox row-border clickable",
                                id: "emailListTable",
                                onClick: this.handleClick.bind(this, "readEmail")
                            })
                        )
                    )
                )
            );
        }
    });
});