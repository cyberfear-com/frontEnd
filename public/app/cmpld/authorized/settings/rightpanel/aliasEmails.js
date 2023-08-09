define(["react", "app", "dataTable", "dataTableBoot", "cmpld/authorized/settings/rightpanel/rightTop", "quill"], function (React, app, DataTable, dataTableBoot, RightTop, Quill) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                viewFlag: false,
                dataAlias: this.getAliasData(),
                aliasForm: {},
                aliasEmail: "",

                includeSignature: false,
                signature: "",
                domain: app.defaults.get("domainMail").toLowerCase(),
                domains: [],

                pageTitle: `Add`,

                showDisplayName: app.user.get("showDisplayName"),
                aliasName: app.user.get("displayName")
            };
        },
        /**
         *
         * @returns {Array}
         */
        getAliasData: function () {
            var alEm = [];

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                if (emailData["addrType"] == 3) {
                    var el = {
                        DT_RowId: email64,
                        checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email: app.transform.from64str(emailData["email"]),
                        name: app.transform.escapeTags(app.transform.from64str(emailData["name"])),
                        main: 0,
                        edit: '<a class="table-icon edit-button"></a>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                    };
                    alEm.push(el);
                }
                /**
                 * { data: "checkbox" },
                    { data: "email" },
                    { data: "name" },
                    { data: "edit" },
                    { data: "delete" },
                    { data: "options" },
                 */
                if (emailData["addrType"] == 1) {
                    var el = {
                        DT_RowId: email64,
                        checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email: "<b>" + app.transform.from64str(emailData["email"]) + "</b>",
                        name: "<b>" + app.transform.escapeTags(app.transform.from64str(emailData["name"])) + "</b>",
                        main: 1,
                        edit: '<a class="table-icon edit-button"></a>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                    };
                    alEm.push(el);
                }
            });

            return alEm;
        },
        domains: function () {
            var thisComp = this;
            var options = [];
            app.serverCall.ajaxRequest("availableDomainsForAlias", {}, function (result) {
                if (result["response"] == "success") {
                    var localDomain = app.user.get("customDomains");

                    $.each(result["data"], function (index, domain) {
                        options.push(React.createElement(
                            "option",
                            {
                                key: "@" + domain["domain"],
                                value: "@" + domain["domain"]
                            },
                            "@" + domain["domain"]
                        ));

                        if (localDomain[app.transform.to64str(domain["domain"])] !== undefined) {
                            var selDomain = localDomain[app.transform.to64str(domain["domain"])];

                            if (selDomain["subdomain"] !== undefined && selDomain["subdomain"].length > 0) {
                                $.each(selDomain["subdomain"], function (ind, subdom64) {
                                    var domStr = app.transform.from64str(subdom64);
                                    options.push(React.createElement(
                                        "option",
                                        {
                                            key: "@" + subdom64,
                                            value: "@" + domStr + "." + selDomain["domain"]
                                        },
                                        "@" + domStr + "." + selDomain["domain"]
                                    ));
                                });
                            }
                        }
                    });

                    thisComp.setState({
                        domains: options
                    });
                } else {
                    app.notifications.systemMessage("tryAgain");
                }
            });
        },
        componentWillUpdate: function (nextProps, nextState) {
            if (nextState.signature != this.state.signature) {
                $(".note-editable").html(nextState.signature);
            }

            if (nextState.signatureEditable != this.state.signatureEditable) {
                $(".note-editable").attr("contenteditable", nextState.signatureEditable);
            }

            if (JSON.stringify(nextState.dataAlias) !== JSON.stringify(this.state.dataAlias)) {
                var t = $("#table1").DataTable();
                t.clear();
                var dataAlias = nextState.dataAlias;
                t.rows.add(dataAlias);
                t.draw(false);
            }
        },
        componentWillUnmount: function () {},
        /**
         *
         * @param {string} name
         * @param {string} email
         * @param {string} domain
         * @param {string} type
         */
        addAlDisp: function (name, email, domain, type) {
            //console.log(name,email,domain);

            app.user.set({ inProcess: true });

            var changeObj = {};
            var firPart = {};
            var secPart = {};
            var dfdmail = new $.Deferred();
            var thisComp = this;
            var newKey = {};
            app.user.set({ inProcess: true });

            var email64 = app.transform.to64str(email + domain);

            if (type === "disposable") {
                firPart = {
                    addrType: 2,
                    canSend: false,
                    email: email64,
                    isDefault: false,
                    keyLength: app.user.get("defaultPGPKeybit"),
                    name: "",
                    includeSignature: false,
                    signature: "",
                    date: Math.round(new Date().getTime() / 1000),
                    keysModified: Math.round(new Date().getTime() / 1000)
                };

                //	thisComp.setState({button1:{text:"Generating Keys",enabled:false,iClass:"fa fa-spin fa-refresh",onClick:""}});
            } else {
                firPart = {
                    addrType: 3,
                    canSend: true,
                    email: email64,
                    isDefault: thisComp.state.isDefault,
                    keyLength: app.user.get("defaultPGPKeybit"),
                    name: app.transform.to64str(name),
                    displayName: name != "" ? app.transform.to64str(name + " <" + app.transform.from64str(email64) + ">") : email64,
                    includeSignature: this.state.includeSignature,
                    signature: this.state.includeSignature ? app.transform.to64str(app.globalF.filterXSSwhite(this.state.signature)) : "",
                    date: Math.round(new Date().getTime() / 1000),
                    keysModified: Math.round(new Date().getTime() / 1000)
                };

                //	thisComp.setState({button2:{text:"Generating Keys",enabled:false,iClass:"fa fa-spin fa-refresh"}});
            }

            app.generate.generatePairs(app.user.get("defaultPGPKeybit"), name + "<" + app.transform.from64str(email64) + ">", function (PGPkeys) {
                //app.generate.generatePairs(app.user.get("defaultPGPKeybit")).done(function(PGPkeys){ //todo revert

                if (app.user.get("inProcess")) {
                    secPart = {
                        keyPass: PGPkeys["password"],
                        v2: {
                            privateKey: app.transform.to64str(PGPkeys["privateKey"]),
                            publicKey: app.transform.to64str(PGPkeys["publicKey"]),
                            receiveHash: app.transform.SHA512(app.transform.from64str(email64)).substring(0, 10)
                        }
                    };

                    //changeObj[email64]=$.extend(firPart, secPart);
                    //var keys=app.user.get("allKeys");

                    //keys[email64]=$.extend(firPart, secPart);
                    newKey = $.extend(firPart, secPart);
                    //console.log(changeObj);
                }
                dfdmail.resolve();
            });

            dfdmail.done(function () {
                if (app.user.get("inProcess")) {
                    $("#dntInter").modal("hide");

                    app.user.set({ inProcess: false });
                    //app.user.set({"pgpKeysChanged":true});
                    app.user.set({ newPGPKey: newKey });
                    //app.userObjects.updateObjects();

                    app.userObjects.updateObjects("addPGPKey", "", function (result) {
                        if (result == "saved") {
                            if (type == "disposable") {
                                //console.log(app.user.get("newPGPKey"));
                                thisComp.setState({
                                    dataDispisable: thisComp.getDisposableDataData()
                                });
                            } else {
                                thisComp.setState({
                                    dataAlias: thisComp.getAliasData()
                                });

                                thisComp.handleClick("showFirst");

                                //thisComp.setState({dataAlias:thisComp.getAliasData()});
                            }
                        } else if (result == "newerFound") {
                            //app.notifications.systemMessage('newerFnd');
                        } else if (result == "emailAdOverLimit") {
                            app.notifications.systemMessage("rchdLimits");
                        } else {
                            app.notifications.systemMessage("tryAgain");
                        }

                        app.user.unset("newPGPKey");
                    });
                }
            });
        },
        componentDidMount: function () {
            var thsComp = this;

            $(".note-editable").attr("contenteditable", "false");

            // Initiate editor toolbar [Quill]
            const quill = new Quill("#com-the-con-editor__alias", {
                modules: {
                    toolbar: "#editor_toolbar"
                },
                handlers: {
                    link: function (value) {
                        if (value) {
                            const href = prompt("Enter the URL");
                            this.quill.format("link", href);
                        } else {
                            this.quill.format("link", false);
                        }
                    }
                }
            });

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: thsComp.getAliasData(),
                columns: [{ data: "checkbox" }, { data: "email" }, { data: "name" }, { data: "edit" }, { data: "delete" }, { data: "options" }],
                columnDefs: [{ orderDataType: "data-sort", targets: [1, 2] }, { sClass: "col-options-width", targets: [0, -1] }, {
                    sClass: "data-cols col-content-width_one_half",
                    targets: [1, 2]
                }, { sClass: "col-mobile-hide", targets: [3, 4] }],
                order: [[2, "desc"], [0, "asc"]],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    // info: "_START_ to _END_ of _TOTAL_",
                    info: "Showing _START_ - _END_ of _TOTAL_ result",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>"
                    }
                }
            });
            $.validator.addMethod("uniqueUserName", function (value, element) {
                var isSuccess = false;
                var email = $("#fromAliasEmail").val().toLowerCase();
                email = email.split("@")[0] + $("#aliasDomain").val();

                if (app.globalF.IsEmail(email)) {
                    return true;
                } else return false;
            }, "no special symbols");

            this.setState({ aliasForm: $("#addNewAliasForm").validate() });
            //console.log(this.state.domain);

            $("#fromAliasEmail").rules("add", {
                required: true,
                minlength: 2,
                maxlength: 90,
                uniqueUserName: true,
                remote: {
                    url: app.defaults.get("apidomain") + "/checkEmailExistV2",
                    type: "post",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        fromEmail: function () {
                            var email = $("#fromAliasEmail").val().toLowerCase();
                            email = email.split("@")[0] + $("#aliasDomain").val();
                            return email;
                        }
                    }
                },
                messages: {
                    remote: "already in use"
                }
            });

            this.domains();
        },
        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "editAlias":
                    var keys = app.user.get("allKeys")[event];

                    if (keys["addrType"] == 1) {
                        this.setState({
                            deleteAlias: "hidden"
                        });
                    } else {
                        this.setState({
                            deleteAlias: ""
                        });
                    }

                    this.setState({
                        viewFlag: true,
                        firstPanelClass: "panel-body hidden",
                        secondPanelClass: "panel-body hidden",
                        thirdPanelClass: "panel-body hidden",
                        fourthPanelClass: "panel-body",
                        firstTab: "active",
                        secondTab: "",

                        button1enabled: true,
                        button1iClass: "",
                        button1visible: "hidden",

                        aliasId: event,
                        aliasEmail: app.transform.from64str(event),
                        aliasName: app.transform.from64str(keys["name"]),

                        isDefault: keys["isDefault"],
                        includeSignature: keys["includeSignature"],
                        signature: app.transform.from64str(keys["signature"]),

                        aliasNameEnabled: false,
                        button5click: "enableEdit",
                        button5text: "Edit",
                        button5class: "btn btn-warning",
                        signatureEditable: false
                    });
                    break;
                case "changeDomain":
                    var validator = this.state.aliasForm;
                    validator.resetForm();
                    $("#fromAliasEmail").valid();
                    this.setState({ domain: event.target.value });
                    break;

                case "changeAliasName":
                    this.setState({ aliasName: event.target.value });

                    break;

                case "changeAliasEmail":
                    var email = event.target.value.split("@")[0];
                    this.setState({ aliasEmail: email });

                    break;

                case "displaySign":
                    this.setState({
                        includeSignature: !this.state.includeSignature,
                        signatureEditable: !this.state.includeSignature
                    });

                    break;

                case "defaultChange":
                    this.setState({
                        isDefault: !this.state.isDefault
                    });

                    break;
            }
        },
        /**
         *
         * @param {string} action
         */
        handleClick: function (action, event) {
            switch (action) {
                case "showFirst":
                    this.setState({
                        viewFlag: false,
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body d-none",
                        fourthPanelClass: "panel-body d-none",
                        firstTab: "active",
                        secondTab: "",

                        button1visible: "",

                        button3visible: "d-none",

                        isDefault: false,
                        aliasId: "",
                        aliasName: "",
                        aliasEmail: "",
                        domain: app.defaults.get("domainMail").toLowerCase(),
                        includeSignature: false,
                        signature: "",
                        signatureEditable: false
                    });

                    $("#fromAliasName").removeClass("invalid");
                    $("#fromAliasName").removeClass("valid");

                    $("#fromAliasEmail").removeClass("invalid");
                    $("#fromAliasEmail").removeClass("valid");

                    var validator = $("#addNewAliasForm").validate();
                    validator.resetForm();

                    break;
                case "handleSelectAll":
                    if (event.target.checked) {
                        $("table .container-checkbox input").prop("checked", true);
                        $("table tr").addClass("selected");
                    } else {
                        $("table .container-checkbox input").prop("checked", false);
                        $("table tr").removeClass("selected");
                    }

                    break;
                case "saveNewAlias":
                    var validator = this.state.aliasForm;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#dntModHead").html("Please Wait");
                        $("#dntModBody").html("Sit tight while we working. It may take a minute, depend on your device. Or you can cancel");

                        $("#dntOk").on("click", function () {
                            app.user.set({ inProcess: false });

                            $("#dntInter").modal("hide");
                        });

                        var email = thisComp.state.aliasEmail.toLowerCase();
                        var name = thisComp.state.aliasName;
                        var domain = thisComp.state.domain;

                        app.globalF.checkSecondPass(function () {
                            $("#dntInter").modal({
                                backdrop: "static",
                                keyboard: false
                            });
                            thisComp.addAlDisp(name, email, domain, "alias");
                        });
                    }

                    break;

                case "addAlias":
                    var thisComp = this;

                    app.globalF.checkPlanLimits("alias", thisComp.state.dataAlias.length - 1, function (result) {
                        if (result) {
                            thisComp.setState({
                                firstPanelClass: "panel-body d-none",
                                secondPanelClass: "panel-body ",
                                thirdPanelClass: "panel-body d-none",
                                firstTab: "active",
                                secondTab: "",

                                button1visible: "d-none",
                                signature: '<div>Sent using Encrypted Email Service -&nbsp;<a href="https://cyberfear.com/index.html#createUser/' + app.user.get("userPlan")["coupon"] + '" target="_blank">CyberFear.com</a></div>'
                            });
                        } else {
                            thisComp.props.updateAct("Plan");
                            Backbone.history.navigate("settings/Plan", {
                                trigger: true
                            });
                        }
                    });

                    break;
                case "selectRowTab1":
                    var thisComp = this;
                    // Select element
                    if ($(event.target).prop("tagName").toUpperCase() === "INPUT") {
                        if (event.target.checked) {
                            $(event.target).closest("tr").addClass("selected");
                        } else {
                            $(event.target).closest("tr").removeClass("selected");
                        }
                    }
                    // Edit click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "A") {
                        var id = $(event.target).parents("tr").attr("id");

                        if (id != undefined) {
                            this.setState({
                                pageTitle: `Edit`
                            });
                            thisComp.handleChange("editAlias", id);
                        }
                    }
                    // Delete click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "BUTTON") {
                        if (event.target.classList.contains("delete-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                thisComp.deleteAlias(id);
                            }
                        }
                    }

                    // var id = $(event.target).parents("tr").attr("id");
                    // if (id != undefined) {
                    //     this.handleChange("editAlias", id);
                    // }

                    break;
                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag,
                        pageTitle: `Add`
                    });
                    break;
            }
        },
        deleteAlias: function (id) {
            $("#dialogModHead").html("Delete");
            $("#dialogModBody").html("Email alias will be deleted, and you wont be able to send or receive email with it. Continue?");

            var keys = app.user.get("allKeys");
            var thisComp = this;

            $("#dialogOk").on("click", function () {
                $("#settings-spinner").removeClass("d-none").addClass("d-block");
                $("#dialogPop").modal("hide");
                app.globalF.checkSecondPass(function () {
                    app.user.set({ newPGPKey: keys[id] });

                    delete keys[id];

                    app.userObjects.updateObjects("deletePGPKeys", "", function (result) {
                        if (result == "saved") {
                            thisComp.setState({
                                dataAlias: thisComp.getAliasData()
                            });
                            thisComp.handleClick("showFirst");
                        } else if (result == "newerFound") {
                            thisComp.setState({
                                dataAlias: thisComp.getAliasData()
                            });
                            thisComp.handleClick("showFirst");
                        }

                        app.user.unset("newPGPKey");
                    });
                });
                $("#settings-spinner").removeClass("d-block").addClass("d-none");
            });

            $("#dialogPop").modal("show");
        },
        render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle alias-email" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "div",
                            {
                                className: `arrow-back ${this.state.viewFlag ? "" : "d-none"}`
                            },
                            React.createElement("a", {
                                onClick: this.handleClick.bind(this, "toggleDisplay")
                            })
                        ),
                        React.createElement(
                            "h2",
                            null,
                            "Profile"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: `bread-crumb ${this.state.viewFlag ? "" : "d-none"}`
                            },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    null,
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "toggleDisplay")
                                        },
                                        "Alias"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    this.state.pageTitle,
                                    " alias"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            {
                                className: `the-view ${this.state.viewFlag ? "d-none" : ""}`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Alias"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "middle-content-top-right" },
                                    React.createElement(
                                        "div",
                                        { className: "add-contact-btn" },
                                        React.createElement(
                                            "a",
                                            {
                                                onClick: this.handleClick.bind(this, "toggleDisplay")
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                "+"
                                            ),
                                            " ",
                                            "Add Alias"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "table-row" },
                                React.createElement(
                                    "div",
                                    { className: "table-responsive" },
                                    React.createElement(
                                        "table",
                                        {
                                            className: "table",
                                            id: "table1",
                                            onClick: this.handleClick.bind(this, "selectRowTab1")
                                        },
                                        React.createElement(
                                            "colgroup",
                                            null,
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", null),
                                            React.createElement("col", null),
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", { width: "40" })
                                        ),
                                        React.createElement(
                                            "thead",
                                            null,
                                            React.createElement(
                                                "tr",
                                                null,
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    React.createElement(
                                                        "label",
                                                        { className: "container-checkbox" },
                                                        React.createElement("input", {
                                                            type: "checkbox",
                                                            onChange: this.handleClick.bind(this, "handleSelectAll")
                                                        }),
                                                        React.createElement("span", { className: "checkmark" })
                                                    )
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    "Email",
                                                    " ",
                                                    React.createElement("button", { className: "btn-sorting" })
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    "Name",
                                                    " ",
                                                    React.createElement("button", { className: "btn-sorting" })
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    "\xA0"
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    React.createElement("button", { className: "trash-btn" })
                                                ),
                                                React.createElement(
                                                    "th",
                                                    { scope: "col" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "dropdown" },
                                                        React.createElement("button", {
                                                            className: "btn btn-secondary dropdown-toggle ellipsis-btn",
                                                            type: "button",
                                                            "data-bs-toggle": "dropdown",
                                                            "aria-expanded": "false"
                                                        }),
                                                        React.createElement(
                                                            "ul",
                                                            { className: "dropdown-menu" },
                                                            React.createElement(
                                                                "li",
                                                                null,
                                                                React.createElement(
                                                                    "a",
                                                                    { href: "#" },
                                                                    "Action"
                                                                )
                                                            ),
                                                            React.createElement(
                                                                "li",
                                                                null,
                                                                React.createElement(
                                                                    "a",
                                                                    { href: "#" },
                                                                    "Another action"
                                                                )
                                                            ),
                                                            React.createElement(
                                                                "li",
                                                                null,
                                                                React.createElement(
                                                                    "a",
                                                                    { href: "#" },
                                                                    "Something here"
                                                                )
                                                            )
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
                            {
                                className: `the-creation ${this.state.viewFlag ? "" : "d-none"}`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    this.state.pageTitle,
                                    " alias"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addNewAliasForm" },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "fromName",
                                                    className: "form-control with-icon icon-name",
                                                    id: "fromAliasName",
                                                    value: this.state.aliasName,
                                                    placeholder: "Enter name",
                                                    onChange: this.handleChange.bind(this, "changeAliasName")
                                                })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "fromEmail",
                                                    className: "form-control with-icon icon-email",
                                                    id: "fromAliasEmail",
                                                    value: this.state.aliasEmail,
                                                    placeholder: "email alias",
                                                    onChange: this.handleChange.bind(this, "changeAliasEmail")
                                                })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-select",
                                                        value: this.state.domain,
                                                        id: "aliasDomain",
                                                        onChange: this.handleChange.bind(this, "changeDomain")
                                                    },
                                                    this.state.domains
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement(
                                                    "div",
                                                    { className: "row" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-6" },
                                                        React.createElement(
                                                            "label",
                                                            { className: "container-checkbox with-label" },
                                                            React.createElement("input", {
                                                                className: "pull-left",
                                                                type: "checkbox",
                                                                checked: this.state.isDefault,
                                                                onChange: this.handleChange.bind(this, "defaultChange")
                                                            }),
                                                            React.createElement("span", { className: "checkmark" }),
                                                            "Default"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "div",
                                                        { className: "col-6" },
                                                        React.createElement(
                                                            "label",
                                                            { className: "container-checkbox with-label" },
                                                            React.createElement("input", {
                                                                className: "pull-left",
                                                                type: "checkbox",
                                                                checked: this.state.includeSignature,
                                                                onChange: this.handleChange.bind(this, "displaySign")
                                                            }),
                                                            React.createElement("span", { className: "checkmark" }),
                                                            "Signature"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "com-content-editor editor" },
                                        React.createElement(
                                            "div",
                                            { className: "c-editor-actions" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: "c-editor-formating ql-formats",
                                                    id: "editor_toolbar"
                                                },
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-bold"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M14 36V8h11.4q3.3 0 5.725 2.1t2.425 5.3q0 1.9-1.05 3.5t-2.8 2.45v.3q2.15.7 3.475 2.5 1.325 1.8 1.325 4.05 0 3.4-2.625 5.6Q29.25 36 25.75 36Zm4.3-16.15h6.8q1.75 0 3.025-1.15t1.275-2.9q0-1.75-1.275-2.925Q26.85 11.7 25.1 11.7h-6.8Zm0 12.35h7.2q1.9 0 3.3-1.25t1.4-3.15q0-1.85-1.4-3.1t-3.3-1.25h-7.2Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-italic"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M10 40v-5h6.85l8.9-22H18V8h20v5h-6.85l-8.9 22H30v5Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-underline"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M10 42v-3h28v3Zm14-8q-5.05 0-8.525-3.45Q12 27.1 12 22.1V6h4v16.2q0 3.3 2.3 5.55T24 30q3.4 0 5.7-2.25Q32 25.5 32 22.2V6h4v16.1q0 5-3.475 8.45Q29.05 34 24 34Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-blockquote"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M29 23h8v-8h-8Zm-18 0h8v-8h-8Zm20.3 11 4-8H26V12h14v14.4L36.2 34Zm-18 0 4-8H8V12h14v14.4L18.2 34ZM15 19Zm18 0Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-list",
                                                        value: "ordered"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M6 40v-1.7h4.2V37H8.1v-1.7h2.1V34H6v-1.7h5.9V40Zm10.45-2.45v-3H42v3ZM6 27.85v-1.6l3.75-4.4H6v-1.7h5.9v1.6l-3.8 4.4h3.8v1.7Zm10.45-2.45v-3H42v3ZM8.1 15.8V9.7H6V8h3.8v7.8Zm8.35-2.55v-3H42v3Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-list",
                                                        value: "bullet"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M8.55 39q-1.05 0-1.8-.725T6 36.55q0-1.05.75-1.8t1.8-.75q1 0 1.725.75.725.75.725 1.8 0 1-.725 1.725Q9.55 39 8.55 39ZM16 38v-3h26v3ZM8.55 26.5q-1.05 0-1.8-.725T6 24q0-1.05.75-1.775.75-.725 1.8-.725 1 0 1.725.75Q11 23 11 24t-.725 1.75q-.725.75-1.725.75Zm7.45-1v-3h26v3ZM8.5 14q-1.05 0-1.775-.725Q6 12.55 6 11.5q0-1.05.725-1.775Q7.45 9 8.5 9q1.05 0 1.775.725Q11 10.45 11 11.5q0 1.05-.725 1.775Q9.55 14 8.5 14Zm7.5-1v-3h26v3Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-link"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M22.5 34H14q-4.15 0-7.075-2.925T4 24q0-4.15 2.925-7.075T14 14h8.5v3H14q-2.9 0-4.95 2.05Q7 21.1 7 24q0 2.9 2.05 4.95Q11.1 31 14 31h8.5Zm-6.25-8.5v-3h15.5v3ZM25.5 34v-3H34q2.9 0 4.95-2.05Q41 26.9 41 24q0-2.9-2.05-4.95Q36.9 17 34 17h-8.5v-3H34q4.15 0 7.075 2.925T44 24q0 4.15-2.925 7.075T34 34Z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "button",
                                                        onClick: this.handleClick.bind(this, "attachFile")
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 24 24"
                                                            },
                                                            React.createElement("path", { d: "M21.586 10.461l-10.05 10.075c-1.95 1.949-5.122 1.949-7.071 0s-1.95-5.122 0-7.072l10.628-10.585c1.17-1.17 3.073-1.17 4.243 0 1.169 1.17 1.17 3.072 0 4.242l-8.507 8.464c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414l7.093-7.05-1.415-1.414-7.093 7.049c-1.172 1.172-1.171 3.073 0 4.244s3.071 1.171 4.242 0l8.507-8.464c.977-.977 1.464-2.256 1.464-3.536 0-2.769-2.246-4.999-5-4.999-1.28 0-2.559.488-3.536 1.465l-10.627 10.583c-1.366 1.368-2.05 3.159-2.05 4.951 0 3.863 3.13 7 7 7 1.792 0 3.583-.684 4.95-2.05l10.05-10.075-1.414-1.414z" })
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        className: "ql-clean"
                                                    },
                                                    React.createElement(
                                                        "span",
                                                        { className: "icon" },
                                                        React.createElement(
                                                            "svg",
                                                            {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 48 48"
                                                            },
                                                            React.createElement("path", { d: "M25.35 21.8 21.5 18l1.2-2.8h-3.95l-5.2-5.2H40v5H28.25ZM40.3 45.2 22.85 27.7 18.45 38H13l6-14.1L2.8 7.7l2.1-2.1 37.5 37.5Z" })
                                                        )
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement("div", { id: "toolbar" }),
                                        React.createElement("div", {
                                            className: "com-the-con-editor__settings",
                                            id: "com-the-con-editor__alias"
                                        })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-section-bottom" },
                                        React.createElement(
                                            "div",
                                            { className: "btn-row" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-border fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "showFirst")
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "saveNewAlias")
                                                },
                                                `Save`
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
                    { className: "setting-right alias-email" },
                    React.createElement(RightTop, null),
                    React.createElement(
                        "div",
                        { className: "setting-right-data" },
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "h2",
                                null,
                                "Help"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
                            React.createElement(
                                "h3",
                                null,
                                "Email Aliases"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "This is an alternate addresses that can be used to receive emails. Email aliases are not alternative login addresses. Using email aliases makes it possible to give out an email addresses that can't be targeted for login attacks."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Display Name"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "is the real name or nickname that you would like people to see when you send email from one of your email aliases."
                            )
                        )
                    )
                )
            );
        }
    });
});