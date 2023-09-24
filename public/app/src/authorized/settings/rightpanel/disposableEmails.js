define([
    "react",
    "app",
    "dataTable",
    "dataTableBoot",
    "dataTableResponsive",
    "cmpld/authorized/settings/rightpanel/rightTop"
], function (
    React,
    app,
    DataTable,
    dataTableBoot,
    dataTableResponsive,
    RightTop
) {
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
                aliasName: app.user.get("displayName"),
            };
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
                    keysModified: Math.round(new Date().getTime() / 1000),
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
                    displayName:
                        name != ""
                            ? app.transform.to64str(
                                  name +
                                      " <" +
                                      app.transform.from64str(email64) +
                                      ">"
                              )
                            : email64,
                    includeSignature: this.state.includeSignature,
                    signature: this.state.includeSignature
                        ? app.transform.to64str(
                              app.globalF.filterXSSwhite(this.state.signature)
                          )
                        : "",
                    date: Math.round(new Date().getTime() / 1000),
                    keysModified: Math.round(new Date().getTime() / 1000),
                };

                //	thisComp.setState({button2:{text:"Generating Keys",enabled:false,iClass:"fa fa-spin fa-refresh"}});
            }

            app.generate.generatePairs(
                app.user.get("defaultPGPKeybit"),
                name + "<" + app.transform.from64str(email64) + ">",
                function (PGPkeys) {
                    //app.generate.generatePairs(app.user.get("defaultPGPKeybit")).done(function(PGPkeys){ //todo revert

                    if (app.user.get("inProcess")) {
                        secPart = {
                            keyPass: PGPkeys["password"],
                            v2: {
                                privateKey: app.transform.to64str(
                                    PGPkeys["privateKey"]
                                ),
                                publicKey: app.transform.to64str(
                                    PGPkeys["publicKey"]
                                ),
                                receiveHash: app.transform
                                    .SHA512(app.transform.from64str(email64))
                                    .substring(0, 10),
                            },
                        };

                        //changeObj[email64]=$.extend(firPart, secPart);
                        //var keys=app.user.get("allKeys");

                        //keys[email64]=$.extend(firPart, secPart);
                        newKey = $.extend(firPart, secPart);
                        //console.log(changeObj);
                    }
                    dfdmail.resolve();
                }
            );

            dfdmail.done(function () {
                if (app.user.get("inProcess")) {
                    $("#dntInter").modal("hide");

                    app.user.set({ inProcess: false });
                    //app.user.set({"pgpKeysChanged":true});
                    app.user.set({ newPGPKey: newKey });
                    //app.userObjects.updateObjects();

                    app.userObjects.updateObjects(
                        "addPGPKey",
                        "",
                        function (result) {
                            if (result == "saved") {
                                if (type == "disposable") {
                                    //console.log(app.user.get("newPGPKey"));
                                    thisComp.setState({
                                        dataDispisable:
                                            thisComp.getDisposableDataData(),
                                    });
                                } else {
                                    thisComp.setState({
                                        dataAlias: thisComp.getAliasData(),
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
                        }
                    );
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

                case "copyToClipboard":
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
                        signatureEditable: false,
                    });

                    $("#fromAliasName").removeClass("invalid");
                    $("#fromAliasName").removeClass("valid");

                    $("#fromAliasEmail").removeClass("invalid");
                    $("#fromAliasEmail").removeClass("valid");

                    var validator = $("#addNewAliasForm").validate();
                    validator.resetForm();

                    break;

                case "addDisposable":
                    var email = app.generate.makerandomEmail();
                    var name = "";
                    var domain = app.defaults.get("domainMail").toLowerCase();

                    var thisComp = this;
                    app.globalF.checkPlanLimits(
                        "disposable",
                        thisComp.state.dataDispisable.length,
                        function (result) {
                            if (result) {
                                var postData = { fromEmail: email + domain };

                                app.serverCall.ajaxRequest(
                                    "checkEmailExist",
                                    postData,
                                    function (result) {
                                        if (result) {
                                            $("#dntModHead").html(
                                                "Please Wait"
                                            );
                                            $("#dntModBody").html(
                                                "Sit tight while we working. It may take a minute, depend on your device. Or you can cancel"
                                            );

                                            $("#dntOk").on(
                                                "click",
                                                function () {
                                                    app.user.set({
                                                        inProcess: false,
                                                    });

                                                    $("#dntInter").modal(
                                                        "hide"
                                                    );
                                                }
                                            );

                                            app.globalF.checkSecondPass(
                                                function () {
                                                    $("#dntInter").modal({
                                                        backdrop: "static",
                                                        keyboard: false,
                                                    });

                                                    //$('#dntInter').modal('show');
                                                    thisComp.addAlDisp(
                                                        name,
                                                        email,
                                                        domain,
                                                        "disposable"
                                                    );
                                                }
                                            );
                                        } else {
                                            app.notifications.systemMessage(
                                                "tryAgain"
                                            );
                                            thisComp.handleClick(
                                                "cancelDispos"
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );

                    break;


                case "deleteDisposable":
                    $("#dialogModHead").html("Delete");
                    $("#dialogModBody").html(
                        "Email alias will be deleted, and you wont be able to send or receive email with it. Continue?"
                    );

                    var keys = app.user.get("allKeys");
                    var thisComp = this;

                    $("#dialogOk").on("click", function () {
                        $("#dialogPop").modal("hide");
                        app.globalF.checkSecondPass(function () {
                            app.user.set({
                                newPGPKey: keys[thisComp.state.aliasId],
                            });

                            delete keys[thisComp.state.aliasId];

                            app.userObjects.updateObjects(
                                "deletePGPKeys",
                                "",
                                function (result) {
                                    if (result == "saved") {
                                        thisComp.setState({
                                            dataDispisable:
                                                thisComp.getDisposableDataData(),
                                        });

                                        //thisComp.setState({dataAlias:thisComp.getAliasData()});
                                        thisComp.handleClick("showSecond");
                                    } else if (result == "newerFound") {
                                        //app.notifications.systemMessage('newerFnd');

                                        thisComp.setState({
                                            dataAlias: thisComp.getAliasData(),
                                        });
                                        thisComp.handleClick("showSecond");
                                    }

                                    app.user.unset("newPGPKey");
                                }
                            );
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
                    if (
                        $(event.target).prop("tagName").toUpperCase() ===
                        "INPUT"
                    ) {
                        if (event.target.checked) {
                            $(event.target).closest("tr").addClass("selected");
                        } else {
                            $(event.target)
                                .closest("tr")
                                .removeClass("selected");
                        }
                    }

                    // Delete click functionality
                    if (
                        $(event.target).prop("tagName").toUpperCase() ===
                        "BUTTON"
                    ) {
                        if (event.target.classList.contains("delete-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                thisComp.setState({
                                    aliasId: id,
                                });
                                thisComp.handleClick("deleteDisposable");
                            }
                        }
                    }
                    //copy
                    if (
                        $(event.target).prop("tagName").toUpperCase() ===
                        "BUTTON"
                    ) {
                        if (event.target.classList.contains("copy-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                /*thisComp.setState({
                                    aliasId: id,
                                });*/
                                console.log(app.transform.from64str(id));

                                var $temp = $("<input>");
                                $("body").append($temp);
                                $temp.val(app.transform.from64str(id)).select();
                                document.execCommand("copy");
                                $temp.remove();
                            }
                        }
                    }

                    break;

                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag,
                        aliasNameEnabled: true,
                    });
                    break;

                case "handleSelectAll":
                    if (event.target.checked) {
                        $("table .container-checkbox input").prop(
                            "checked",
                            true
                        );
                        $("table tr").addClass("selected");
                    } else {
                        $("table .container-checkbox input").prop(
                            "checked",
                            false
                        );
                        $("table tr").removeClass("selected");
                    }

                    break;
            }
        },

        componentWillUpdate: function (nextProps, nextState) {

            if (
                JSON.stringify(nextState.dataDispisable) !==
                JSON.stringify(this.state.dataDispisable)
            ) {
                var t = $("#table2").DataTable();
                t.clear();
                var dataDispisable = nextState.dataDispisable;
                t.rows.add(dataDispisable);
                t.draw(false);
            }
        },

        render: function () {
            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle disposable-email">
                        <div className="middle-top">
                            <div
                                className={`arrow-back ${
                                    this.state.viewFlag ? "" : "d-none"
                                }`}
                            >
                                <a
                                    onClick={this.handleClick.bind(
                                        this,
                                        "toggleDisplay"
                                    )}
                                ></a>
                            </div>
                            <h2>Profile</h2>
                            <div
                                className={`bread-crumb ${
                                    this.state.viewFlag ? "" : "d-none"
                                }`}
                            >
                                <ul>
                                    <li>
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                "toggleDisplay"
                                            )}
                                        >
                                            Disposable address
                                        </a>
                                    </li>
                                    <li>Add address</li>
                                </ul>
                            </div>
                        </div>
                        <div className="middle-content">
                            <div
                                className={`the-view ${
                                    this.state.viewFlag ? "d-none" : ""
                                }`}
                            >
                                <div className="middle-content-top">
                                    <h3>Disposable address</h3>
                                    <div className="middle-content-top-right">
                                        <div className="add-contact-btn">
                                            <a
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "addDisposable"
                                                )}
                                            >
                                                <span className="icon">+</span>{" "}
                                                Add Address
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-responsive">
                                        <table
                                            className="table responsive"
                                            id="table2"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "selectRowTab2"
                                            )}
                                        >
                                            <colgroup>
                                                <col width="40" />
                                                <col />
                                                <col width="40" />
                                                <col width="50" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <label className="container-checkbox d-none">
                                                            <input
                                                                type="checkbox"
                                                                onChange={this.handleClick.bind(
                                                                    this,
                                                                    "handleSelectAll"
                                                                )}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </th>
                                                    <th scope="col">
                                                        Email{" "}
                                                        <button className="btn-sorting"></button>
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="col-mobile-hide d-none"
                                                    >
                                                        <button className="trash-btn"></button>
                                                    </th>
                                                    <th scope="col">
                                                        <div className="dropdown d-none">
                                                            <button
                                                                className="btn btn-secondary dropdown-toggle ellipsis-btn"
                                                                type="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            ></button>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <a href="#">
                                                                        Action
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        Another
                                                                        action
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        Something
                                                                        here
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="setting-right disposable-email">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>

                            <div className="panel-body">
                                <h3>Disposable email addresses</h3>
                                <p>
                                    are a randomly generated string of
                                    characters that are used to create a unique
                                    alternate email address for your account.
                                    The difference between regular email aliases
                                    and disposable addresses is that disposable
                                    addresses are intended to be temporary. For
                                    example you can use them for a short term
                                    purpose before deleting the address to
                                    prevent your real address from being sold
                                    and added to spam lists. Disposable email
                                    addresses are for receiving email, they can
                                    not be used to send emails..
                                </p>
                                <h3>Signature</h3>
                                <p>
                                    A unique signature can be created for each
                                    of your email aliases. For example, you may
                                    want different signatures if your account
                                    has multiple aliases or business purposes
                                    associated with them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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
                        name: app.transform.escapeTags(
                            app.transform.from64str(emailData["name"])
                        ),
                        main: 0,
                        //"edit":'<a class="editAlias"><i class="fa fa-pencil fa-lg txt-color-yellow"></i></a>',
                        //"delete": '<a class="deleteAlias"><i class="fa fa-times fa-lg txt-color-red"></i></a>'
                    };
                    alEm.push(el);
                }
                if (emailData["addrType"] == 1) {
                    var el = {
                        DT_RowId: email64,
                        email:
                            "<b>" +
                            app.transform.from64str(emailData["email"]) +
                            "</b>",
                        name:
                            "<b>" +
                            app.transform.escapeTags(
                                app.transform.from64str(emailData["name"])
                            ) +
                            "</b>",
                        main: 1,
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
                        checkbox:
                            '<label class="container-checkbox d-none"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email: app.transform.from64str(emailData["email"]),
                        // dispose: '<button class="disposed-button"></button>',
                        delete: '<button class="table-icon delete-button"></button>',
                        options:
                            '<button class="table-icon copy-button"></button>',
                    };
                    alEm.push(el);
                }
            });

            //this.setState({dataDispisable:alEm});
            return alEm;
        },

        componentDidMount: function () {
            var thsComp = this;

            // Initiate editor toolbar [Quill]
            $("#table2").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: thsComp.getDisposableDataData(),
                responsive: true,
                columns: [
                    { data: "checkbox" },
                    { data: "email" },
                    // { data: "dispose" },
                    { data: "delete" },
                    { data: "options" },
                ],
                columnDefs: [
                    { orderDataType: "data-sort", targets: 1 },
                    { sClass: "col-options-width", targets: [0, -1] },
                    { sClass: "data-cols col-content-width", targets: [1] },
                    { sClass: "col-mobile-hide", targets: [2] },
                    { responsivePriority: 1, targets: [0, 1] },
                    { responsivePriority: 2, targets: -1 },
                ],
                order: [[1, "asc"]],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    info: "Showing _START_ - _END_ of _TOTAL_ result",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>",
                    },
                },
            });

        },
    });
});
