define(["react", "app", "dataTable", "dataTableBoot", "dataTableResponsive", "cmpld/authorized/settings/rightpanel/rightTop", "quill"], function (React, app, DataTable, dataTableBoot, dataTableResponsive, RightTop, Quill) {
    "use strict";

    return React.createClass({
        /**
         *
         */
        getInitialState: function () {
            return {
                viewFlag: false,
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body d-none",
                thirdPanelClass: "panel-body d-none",
                fourthPanelClass: "panel-body d-none",
                firstTab: "active",
                secondTab: "",

                dataAlias: this.getAliasData(),
                dataDispisable: this.getDisposableDataData(),

                aliasForm: {},
                //aliasEmail:app.defaults.get("aliasEmail"),
                aliasEmail: "",

                button1Click: "addAlias",
                button1enabled: true,
                button1iClass: "",
                button1text: "Add New Alias",
                button1visible: "",

                button2text: "Add Alias",
                button2enabled: true,
                button2iClass: "",

                button3Click: "addDisposable",
                button3enabled: true,
                button3iClass: "",
                button3text: "Add Disposable",
                button3visible: "d-none",
                isDefault: false,

                includeSignature: false,
                signature: "",
                domain: app.defaults.get("domainMail").toLowerCase(),
                domains: [],

                showDisplayName: app.user.get("showDisplayName"),
                aliasName: app.user.get("displayName")
            };
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

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "changeDomain":
                    var validator = this.state.aliasForm;
                    validator.resetForm();
                    $("#fromAliasEmail").valid();
                    console.log(this.state.domain);
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

                case "editSignature":
                    this.setState({
                        signature: event
                    });
                    break;

                case "editAlias":
                    var keys = app.user.get("allKeys")[event];

                    if (keys["addrType"] == 1) {
                        this.setState({
                            deleteAlias: "d-none"
                        });
                    } else {
                        this.setState({
                            deleteAlias: ""
                        });
                    }

                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body d-none",
                        fourthPanelClass: "panel-body",
                        firstTab: "active",
                        secondTab: "",

                        button1enabled: true,
                        button1iClass: "",
                        button1visible: "d-none",

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

                case "showSecond":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body ",
                        fourthPanelClass: "panel-body d-none",
                        firstTab: "",
                        secondTab: "active",
                        aliasId: "",

                        button1visible: "d-none",
                        button3visible: ""
                    });
                    break;

                case "addAlias":
                    var thisComp = this;
                    //     console.log(thisComp.state.dataAlias.length)
                    //  console.log(thisComp.state.dataAlias)

                    app.globalF.checkPlanLimits("alias", thisComp.state.dataAlias.length - 1, function (result) {
                        if (result) {
                            thisComp.setState({
                                firstPanelClass: "panel-body d-none",
                                secondPanelClass: "panel-body ",
                                thirdPanelClass: "panel-body d-none",
                                firstTab: "active",
                                secondTab: "",

                                button1visible: "d-none",
                                signature: '<div>Sent using Encrypted Email Service -&nbsp;<a href="https://cyber.com/mailbox/#signup/' + app.user.get("userPlan")["coupon"] + '" target="_blank">CyberFear.com</a></div>'
                            });
                        } else {
                            thisComp.props.updateAct("Plan");
                            Backbone.history.navigate("settings/Plan", {
                                trigger: true
                            });
                        }
                    });

                    break;

                case "saveEditAlias":
                    var thisComp = this;
                    var aliasId = this.state.aliasId;

                    var keys = app.user.get("allKeys")[aliasId];

                    if (this.state.isDefault) {
                        var keysAll = app.user.get("allKeys");

                        $.each(keysAll, function (email64, emailData) {
                            keysAll[email64]["isDefault"] = false;
                        });
                    }

                    if (keys != undefined) {
                        keys["name"] = app.transform.to64str(this.state.aliasName);
                        keys["displayName"] = this.state.aliasName != "" ? app.transform.to64str(this.state.aliasName + " <" + app.transform.from64str(aliasId) + ">") : aliasId, keys["includeSignature"] = this.state.includeSignature;
                        keys["isDefault"] = this.state.isDefault;

                        keys["signature"] = this.state.includeSignature ? app.transform.to64str(app.globalF.filterXSSwhite($("#summernote1").code())) : keys["signature"];

                        app.globalF.checkSecondPass(function () {
                            app.userObjects.updateObjects("editPGPKeys", "", function (result) {
                                //if (result['response'] == "success") {
                                if (result == "saved") {
                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });

                                    thisComp.handleClick("showFirst");
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                    thisComp.handleClick("showFirst");
                                }

                                //}
                            });
                        });
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

                        //thisComp.setState({
                        //button2text:"Generating Keys",
                        //button2enabled:false,
                        //button2iClass:"fa fa-spin fa-refresh"
                        //});

                        //app.user.set({"inProcess":true});
                        app.globalF.checkSecondPass(function () {
                            $("#dntInter").modal({
                                backdrop: "static",
                                keyboard: false
                            });

                            //$('#dntInter').modal('show');
                            thisComp.addAlDisp(name, email, domain, "alias");
                        });
                    }

                    break;

                case "addDisposable":
                    var email = app.generate.makerandomEmail();
                    var name = "";
                    var domain = app.defaults.get("domainMail").toLowerCase();

                    var thisComp = this;
                    app.globalF.checkPlanLimits("disposable", thisComp.state.dataDispisable.length, function (result) {
                        if (result) {
                            var postData = { fromEmail: email + domain };

                            app.serverCall.ajaxRequest("checkEmailExist", postData, function (result) {
                                if (result) {
                                    $("#dntModHead").html("Please Wait");
                                    $("#dntModBody").html("Sit tight while we working. It may take a minute, depend on your device. Or you can cancel");

                                    $("#dntOk").on("click", function () {
                                        app.user.set({
                                            inProcess: false
                                        });

                                        $("#dntInter").modal("hide");
                                    });

                                    app.globalF.checkSecondPass(function () {
                                        $("#dntInter").modal({
                                            backdrop: "static",
                                            keyboard: false
                                        });

                                        //$('#dntInter').modal('show');
                                        thisComp.addAlDisp(name, email, domain, "disposable");
                                    });
                                } else {
                                    app.notifications.systemMessage("tryAgain");
                                    thisComp.handleClick("cancelDispos");
                                }
                            });
                        }
                    });

                    break;

                case "enableEdit":
                    this.setState({
                        aliasNameEnabled: true,
                        button5click: "saveEditAlias",
                        button5text: "Save",
                        signatureEditable: this.state.includeSignature,
                        button5class: "btn btn-primary"
                    });

                    //if(this.state.includeSignature){
                    //$('.note-editable').attr('contenteditable','true');
                    //}
                    break;

                case "selectRowTab1":
                    var id = $(event.target).parents("tr").attr("id");
                    if (id != undefined) {
                        this.handleChange("editAlias", id);
                    }

                    break;

                case "deleteAlias":
                    $("#dialogModHead").html("Delete");
                    $("#dialogModBody").html("Email alias will be deleted, and you wont be able to send or receive email with it. Continue?");

                    var keys = app.user.get("allKeys");
                    var thisComp = this;

                    $("#dialogOk").on("click", function () {
                        $("#dialogPop").modal("hide");
                        app.globalF.checkSecondPass(function () {
                            app.user.set({
                                newPGPKey: keys[thisComp.state.aliasId]
                            });

                            delete keys[thisComp.state.aliasId];

                            app.userObjects.updateObjects("deletePGPKeys", "", function (result) {
                                if (result == "saved") {
                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });
                                    thisComp.handleClick("showFirst");
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');

                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });
                                    thisComp.handleClick("showFirst");
                                }

                                app.user.unset("newPGPKey");
                            });
                        });
                    });

                    $("#dialogPop").modal("show");

                    break;

                case "deleteDisposable":
                    $("#dialogModHead").html("Delete");
                    $("#dialogModBody").html("Email alias will be deleted, and you wont be able to send or receive email with it. Continue?");

                    var keys = app.user.get("allKeys");
                    var thisComp = this;

                    $("#dialogOk").on("click", function () {
                        $("#dialogPop").modal("hide");
                        app.globalF.checkSecondPass(function () {
                            app.user.set({
                                newPGPKey: keys[thisComp.state.aliasId]
                            });

                            delete keys[thisComp.state.aliasId];

                            app.userObjects.updateObjects("deletePGPKeys", "", function (result) {
                                if (result == "saved") {
                                    thisComp.setState({
                                        dataDispisable: thisComp.getDisposableDataData()
                                    });

                                    //thisComp.setState({dataAlias:thisComp.getAliasData()});
                                    thisComp.handleClick("showSecond");
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');

                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData()
                                    });
                                    thisComp.handleClick("showSecond");
                                }

                                app.user.unset("newPGPKey");
                            });
                        });

                        //app.user.set({"newPGPKey":newKey});

                        //app.user.set({"pgpKeysChanged":true});
                        //app.userObjects.updateObjects();
                    });

                    $("#dialogPop").modal("show");

                    break;

                case "selectRowTab2":
                    //$(event.target).parents('tr').toggleClass('highlight');

                    var thisComp = this;
                    var keys = app.user.get("allKeys");

                    // Select element
                    if ($(event.target).prop("tagName").toUpperCase() === "INPUT") {
                        if (event.target.checked) {
                            $(event.target).closest("tr").addClass("selected");
                        } else {
                            $(event.target).closest("tr").removeClass("selected");
                        }
                    }

                    // Delete click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "BUTTON") {
                        if (event.target.classList.contains("delete-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                thisComp.setState({
                                    aliasId: id
                                });
                                thisComp.handleClick("deleteDisposable");
                            }
                        }
                    }

                    break;

                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag,
                        aliasNameEnabled: true
                    });
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
            }
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (nextState.signature != this.state.signature) {
                $(".note-editable").html(nextState.signature);
            }

            if (nextState.signatureEditable != this.state.signatureEditable) {
                $(".note-editable").attr("contenteditable", nextState.signatureEditable);
            }

            if (JSON.stringify(nextState.dataDispisable) !== JSON.stringify(this.state.dataDispisable)) {
                var t = $("#table2").DataTable();
                t.clear();
                var dataDispisable = nextState.dataDispisable;
                t.rows.add(dataDispisable);
                t.draw(false);
            }
        },

        render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle disposable-email" },
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
                                        "Disposable address"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Add address"
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
                                    "Disposable address"
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
                                            "Add Address"
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
                                            className: "table responsive",
                                            id: "table2",
                                            onClick: this.handleClick.bind(this, "selectRowTab2")
                                        },
                                        React.createElement(
                                            "colgroup",
                                            null,
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", null),
                                            React.createElement("col", { width: "40" }),
                                            React.createElement("col", { width: "50" })
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
                                                    {
                                                        scope: "col",
                                                        className: "col-mobile-hide"
                                                    },
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
                                    "Add address"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addNewAliasForm2" },
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
                                                    id: "fromAliasName2",
                                                    value: this.state.aliasName,
                                                    placeholder: "From name",
                                                    onChange: this.handleChange.bind(this, "changeAliasName"),
                                                    disabled: !this.state.aliasNameEnabled
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
                                                                disabled: !this.state.aliasNameEnabled,
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
                                                                onChange: this.handleChange.bind(this, "displaySign"),
                                                                disabled: !this.state.aliasNameEnabled
                                                            }),
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
                                            id: "com-the-con-editor__disposable"
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
                                                    onClick: this.handleClick.bind(this, "toggleDisplay")
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "addDisposable")
                                                },
                                                "Save"
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
                    { className: "setting-right disposable-email" },
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
                                "Disposable email addresses"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "are a randomly generated string of characters that are used to create a unique alternate email address for your account. The difference between regular email aliases and disposable addresses is that disposable addresses are intended to be temporary. For example you can use them for a short term purpose before deleting the address to prevent your real address from being sold and added to spam lists. Disposable email addresses are for receiving email, they can not be used to send emails.."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Signature"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "A unique signature can be created for each of your email aliases. For example, you may want different signatures if your account has multiple aliases or business purposes associated with them."
                            )
                        )
                    )
                )
            );
        },

        /**
         *
         * @returns {Array}
         */
        getAliasData: function () {
            var alEm = [];

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                //console.log(emailData);

                if (emailData["addrType"] == 3) {
                    var el = {
                        DT_RowId: email64,
                        email: app.transform.from64str(emailData["email"]),
                        name: app.transform.escapeTags(app.transform.from64str(emailData["name"])),
                        main: 0
                        //"edit":'<a class="editAlias"><i class="fa fa-pencil fa-lg txt-color-yellow"></i></a>',
                        //"delete": '<a class="deleteAlias"><i class="fa fa-times fa-lg txt-color-red"></i></a>'
                    };
                    alEm.push(el);
                }
                if (emailData["addrType"] == 1) {
                    var el = {
                        DT_RowId: email64,
                        email: "<b>" + app.transform.from64str(emailData["email"]) + "</b>",
                        name: "<b>" + app.transform.escapeTags(app.transform.from64str(emailData["name"])) + "</b>",
                        main: 1
                        //"edit":'<a class="editAlias"><i class="fa fa-pencil fa-lg txt-color-yellow"></i></a>',
                        //"delete": '<a class="deleteAlias"><i class="fa fa-times fa-lg txt-color-red"></i></a>'
                    };
                    alEm.push(el);
                }
            });
            //this.setState({dataAlias:alEm});

            return alEm;
        },

        /**
         *
         * @returns {Array}
         */
        getDisposableDataData: function () {
            var alEm = [];
            // columns: [{ data: "checkbox" }, { data: "email" }, { data: "dispose" }, { data: "delete" }, { data: "options" }],
            $.each(app.user.get("allKeys"), function (email64, emailData) {
                //console.log(emailData);
                if (emailData["addrType"] == 2) {
                    var el = {
                        DT_RowId: email64,
                        checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email: app.transform.from64str(emailData["email"]),
                        // dispose: '<button class="disposed-button"></button>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                    };
                    alEm.push(el);
                }
            });

            //this.setState({dataDispisable:alEm});
            return alEm;
        },

        componentDidMount: function () {
            var thsComp = this;

            $(".note-editable").attr("contenteditable", "false");

            // Initiate editor toolbar [Quill]
            const quill = new Quill("#com-the-con-editor__disposable", {
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

            var thsComp = this;

            $("#table2").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: thsComp.getDisposableDataData(),
                responsive: true,
                columns: [{ data: "checkbox" }, { data: "email" },
                // { data: "dispose" },
                { data: "delete" }, { data: "options" }],
                columnDefs: [{ orderDataType: "data-sort", targets: 1 }, { sClass: "col-options-width", targets: [0, -1] }, { sClass: "data-cols col-content-width", targets: [1] }, { sClass: "col-mobile-hide", targets: [2] }, { responsivePriority: 1, targets: [0, 1] }, { responsivePriority: 2, targets: -1 }],
                order: [[1, "asc"]],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
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

            this.domains();
        }
    });
});