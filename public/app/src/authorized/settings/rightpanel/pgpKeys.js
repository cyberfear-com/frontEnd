define([
    "react",
    "app",
    "dataTable",
    "dataTableBoot",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, DataTable, dataTableBoot, RightTop) {
    "use strict";
    return React.createClass({
        /**
         *
         * @returns {{
         * firstPanelClass: string,
         * secondPanelClass: string,
         * firstTab: string,
         * button1text: string,
         * button1enabled: boolean,
         * button1iClass: string,
         * button1onClick: string,
         * txtArea1readonly: boolean,
         * txtArea1value: string,
         * txtArea1onchange: string,
         * txtArea2readonly: boolean,
         * txtArea2value: string,
         * txtArea2onchange: string,
         * dataSet: Array,
         * keyEmail: string,
         * keyBit: string,
         * emailSince: string,
         * keyStrength: number,
         * inputSelectClass: string,
         * inputSelectDisabled: boolean,
         * keysForm: object,
         * pubCorrect: boolean,
         * pubBit2strong: boolean,
         * pubmatch: boolean,
         * privCorrect: boolean,
         * privPass: boolean,
         * privmatch: boolean,
         * privpassText: string,
         * privtextVisible: string,
         * privTextDisabled: boolean,
         * keyDate: string,
         * keyId: string
         * }}
         */
        getInitialState: function () {
            return {
                viewFlag: false,
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body d-none",
                firstTab: "active",

                button1text: "Add Domain",
                button1enabled: true,
                button1iClass: "",
                button1onClick: "addNewDomain",

                //button2text:"Save",
                //button2enabled:false,
                //button2iClass:"",
                //button2onClick:"saveKeys",

                txtArea1readonly: true,
                txtArea1value: "",
                txtArea1onchange: "checkPubKey",

                txtArea2readonly: true,
                txtArea2value: "",
                txtArea2onchange: "checkPrivKey",

                dataSet: [],
                keyEmail: "",
                keyName: "",
                keyBit: "",
                emailSince: "",
                keyStrength: 0,
                inputSelectClass:
                    "form-group pull-right col-xs-6 col-sm-5 col-lg-3",
                inputSelectDisabled: true,
                keysForm: {},
                //validationResult:true,

                pubCorrect: true,
                pubBit2strong: true,
                pubmatch: true,

                privCorrect: true,
                privPass: true,
                privmatch: true,
                privpassText: "",
                privtextVisible: "d-none",
                privTextDisabled: true,

                keyDate: "",
                keyId: "",

                defaultPGPStrength: app.user.get("defaultPGPKeybit"),
            };
        },

        componentDidMount: function () {
            var dtSet = this.getKeys();
            var thisComp = this;

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: dtSet,

                columns: [
                    { data: "checkbox" },
                    {
                        data: {
                            _: "email.display",
                            sort: "email.display",
                        },
                    },
                    { data: "bit" },
                    { data: "edit" },
                    { data: "delete" },
                    { data: "options" },
                ],
                columnDefs: [
                    { orderDataType: "data-sort", targets: 1 },
                    { sClass: "data-cols col-content-width", targets: [1] },
                    { sClass: "col-mobile-hide", targets: [2, 3, 4] },
                    { sClass: "col-options-width", targets: [0, -1] },
                ],
                order: [[1, "asc"]],
                language: {
                    emptyTable: "No Keys",
                    sSearch: "",
                    info: "Showing _START_ - _END_ of _TOTAL_ result",
                    searchPlaceholder: "Find something...",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>",
                    },
                },
            });

            this.setState({ keysForm: $("#editPGPkeys").validate() });

            $.validator.addMethod(
                "pubCorrect",
                function (value, element) {
                    return thisComp.state.pubCorrect;

                    //return this.optional(element) || (parseFloat(value) > 0);
                },
                "Public Key format is unknown"
            );

            $.validator.addMethod(
                "pubBit2strong",
                function (value, element) {
                    return thisComp.state.pubBit2strong;

                    //return this.optional(element) || (parseFloat(value) > 0);
                },
                "Public key is too strong."
            );

            $.validator.addMethod(
                "privPass",
                function (value, element) {
                    return thisComp.state.privPass;

                    //return this.optional(element) || (parseFloat(value) > 0);
                },
                "Private Key password is incorrect"
            );

            $.validator.addMethod(
                "pubmatch",
                function (value, element) {
                    return thisComp.state.pubmatch;

                    //return this.optional(element) || (parseFloat(value) > 0);
                },
                "Public Key not match with Private key"
            );

            $.validator.addMethod(
                "privCorrect",
                function (value, element) {
                    return thisComp.state.privCorrect;

                    //return this.optional(element) || (parseFloat(value) > 0);
                },
                "Private Key format is unknown"
            );

            $.validator.addMethod(
                "privmatch",
                function (value, element) {
                    return thisComp.state.privmatch;

                    //return this.optional(element) || (parseFloat(value) > 0);
                },
                "Private Key not match with Public key"
            );

            $("#privPass").rules("add", {
                //required: true,
                //minlength: 200,
                //maxlength: 900,
                //greaterThanZero:true
                privPass: true,
                //pubBit2strong:true,
                //pubmatch:true
            });

            $("#pubK").rules("add", {
                required: true,
                //minlength: 200,
                //maxlength: 900,
                //greaterThanZero:true
                pubCorrect: true,
                pubBit2strong: true,
                pubmatch: true,
            });

            $("#prK").rules("add", {
                required: true,
                //minlength: 200,
                //maxlength: 4000,
                //greaterThanZero:true
                privCorrect: true,
                privPass: true,
                privmatch: true,
            });

            //	this.handleClick('addNewDomain');
        },

        /**
         *
         * @returns {Array}
         */
        getKeys: function () {
            var alEm = [];

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                //console.log(emailData);
                var el = {
                    DT_RowId: email64,
                    checkbox:
                        '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                    email: {
                        display: app.transform.from64str(emailData["email"]),
                    },
                    bit: emailData["keyLength"],
                    edit: '<a class="table-icon edit-button"></a>',
                    delete: '<button class="table-icon delete-button"></button>',
                    options:
                        '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
                };
                alEm.push(el);
            });

            //this.setState({dataDispisable:alEm});
            return alEm;
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "copyClipboard":
                    if (!navigator.clipboard) {
                    } else {
                        try {
                            navigator.clipboard
                                .writeText(
                                    $(event.target)
                                        .parent(".blue-bg-text")
                                        .find(".to-copy")
                                        .text()
                                )
                                .then(function () {});
                        } catch (e) {}
                    }
                    break;
                case "email":
                    break;

                case "showFirst":
                    if (!app.user.get("inProcess")) {
                        this.setState({
                            viewFlag: false,
                            firstPanelClass: "panel-body",
                            secondPanelClass: "panel-body d-none",
                            firstTab: "active",

                            txtArea1value: "",
                            txtArea2value: "",
                            keyEmail: "",
                            keyName: "",
                            keyBit: "",
                            button5class: "",

                            keyId: "",
                            keyDate: "",
                            keyModified: "",
                            keyFingerprint: "",
                            privpassText: "",
                            privTextDisabled: true,
                        });
                    } else {
                        //todo add modal to prevent navigation
                        $("#infoModal").modal({
                            backdrop: "static",
                            keyboard: false,
                        });

                        $("#infoModHead").html("Active Process");
                        $("#infoModBody").html(
                            "Please cancel or wait until process is finished before continue."
                        );

                        $("#infoModal").modal("show");
                    }

                    break;

                case "editKey":
                    break;

                case "generateNewKeys":
                    var thisComp = this;

                    $("#dntModHead").html("Please Wait");
                    $("#dntModBody").html(
                        "Sit tight while we working. It may take a minute, depend on your device. Or you can cancel"
                    );

                    $("#dntInter").modal({
                        backdrop: "static",
                        keyboard: false,
                    });

                    app.user.set({ inProcess: true });

                    app.generate.generatePairs(
                        thisComp.state.keyBit,
                        thisComp.state.keyName,
                        function (PGPkeys) {
                            if (app.user.get("inProcess")) {
                                //console.log(thisComp.state.keyEmail);
                                //	console.log(thisComp.state.keyBit);
                                //console.log(PGPkeys);

                                app.globalF.getPublicKeyInfo(
                                    PGPkeys["publicKey"],
                                    function (result) {
                                        //keyData=result;
                                        thisComp.setState({
                                            keyStrength: result["strength"],
                                            keyFingerprint:
                                                result["fingerprint"],
                                            keyDate: result["created"],
                                        });
                                    }
                                );

                                thisComp.setState({
                                    button4iClass: "",
                                    button4text: "Generate New Keys",
                                    button4enabled: true,

                                    txtArea1value: PGPkeys["publicKey"],
                                    txtArea2value: PGPkeys["privateKey"],

                                    button3onClick: "showFirst",
                                    button2enabled: true,
                                    privpassText: PGPkeys["password"],
                                });

                                $("#dntInter").modal("hide");

                                app.user.set({ inProcess: false });
                            } else {
                                //console.log('canceled');
                                app.user.set({ inProcess: false });
                            }
                        }
                    );

                    $("#dntOk").on("click", function () {
                        app.user.set({ inProcess: false });
                        //thisComp.handleClick('showFirst');
                        $("#dntInter").modal("hide");
                    });

                    break;

                case "cancelGenerating":
                    app.user.set({ inProcess: false });
                    this.handleClick("showFirst");

                    break;

                case "saveKeys":
                    var thisComp = this;

                    this.validateBeforeSafe(function (result) {
                        if (result) {
                            $("#settings-spinner")
                                .removeClass("d-none")
                                .addClass("d-block");
                            app.globalF.checkSecondPass(function () {
                                var key = app.user.get("allKeys");

                                //	console.log();
                                key[thisComp.state.keyId]["v2"]["privateKey"] =
                                    app.transform.to64str(
                                        thisComp.state.txtArea2value
                                    );
                                key[thisComp.state.keyId]["v2"]["publicKey"] =
                                    app.transform.to64str(
                                        thisComp.state.txtArea1value
                                    );
                                key[thisComp.state.keyId]["v2"]["receiveHash"] =
                                    app.transform.getReceiveHash(
                                        app.transform.from64str(
                                            key[thisComp.state.keyId]["email"]
                                        )
                                    );
                                key[thisComp.state.keyId]["keyLength"] =
                                    thisComp.state.keyBit;
                                key[thisComp.state.keyId]["keyPass"] =
                                    thisComp.state.privpassText;

                                key[thisComp.state.keyId]["keysModified"] =
                                    Math.round(new Date().getTime() / 1000);

                                //	console.log(app.transform.from64str(key[thisComp.state.keyId]['email']));

                                var newKey = key[thisComp.state.keyId];

                                app.user.set({ newPGPKey: newKey });

                                app.userObjects.updateObjects(
                                    "editPGPkeysBits",
                                    "",
                                    function (result) {
                                        if (result == "saved") {
                                            //console.log('sdfsdf');
                                            thisComp.setState({
                                                dataSet: thisComp.getKeys(),
                                            });

                                            thisComp.handleClick("showFirst");
                                        } else if (result == "newerFound") {
                                            //app.notifications.systemMessage('newerFnd');
                                        }
                                    }
                                );
                            });
                            $("#settings-spinner")
                                .removeClass("d-block")
                                .addClass("d-none");
                            //console.log('saveKeys');
                        } else {
                            $("#infoModHead").html("PGP Key Pair Mismatch");
                            $("#infoModBody").html(
                                "Please generate new keys or make sure you import correct format"
                            );

                            $("#infoModal").modal("show");
                        }
                    });

                    break;

                case "viewKey":
                    var thisComp = this;
                    var keys = app.user.get("allKeys");
                    //var keyData={};
                    app.globalF.getPublicKeyInfo(
                        app.transform.from64str(keys[event]["v2"]["publicKey"]),
                        function (result) {
                            //keyData=result;
                            thisComp.setState({
                                keyStrength: result["strength"],
                                keyFingerprint: result["fingerprint"],
                                keyDate: result["created"],
                            });
                        }
                    );

                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body",
                        firstTab: "active",
                        viewFlag: true,

                        keyEmail: app.transform.from64str(keys[event]["email"]),
                        keyName: app.transform.from64str(
                            keys[event]["displayName"]
                        ),
                        keyBit: app.user.get("defaultPGPKeybit"),

                        inputSelectDisabled: true,
                        txtArea1readonly: true,
                        txtArea2readonly: true,

                        txtArea1value: app.transform.from64str(
                            keys[event]["v2"]["publicKey"]
                        ),
                        txtArea2value: app.transform.from64str(
                            keys[event]["v2"]["privateKey"]
                        ),

                        button2enabled: true,
                        button2text: "OK",
                        button2onClick: "showFirst",

                        button4visible: "d-none",
                        button5class: "",
                        button3visible: "d-none",

                        keyId: event,
                        keyModified: keys[event]["keysModified"],
                        emailSince: keys[event]["date"],
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

                case "selectRow":
                    var thisComp = this;

                    // var id = $(event.target).parents("tr").attr("id");
                    // if (id != undefined) {
                    //     thisComp.handleClick("viewKey", id);
                    // }

                    // Select row element
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
                    // Edit click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "A") {
                        var id = $(event.target).parents("tr").attr("id");

                        if (id != undefined) {
                            thisComp.setState({
                                keyId: id,
                            });
                            thisComp.editKey(id);
                        }
                    }

                    break;
                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag,
                    });
                    break;
            }
        },

        editKey: function (id) {
            var keys = app.user.get("allKeys");

            // var id = this.state.keyId;
            console.log(keys[id]);
            this.setState({
                viewFlag: true,
                firstPanelClass: "panel-body d-none",
                secondPanelClass: "panel-body",
                firstTab: "active",

                inputSelectDisabled: false,
                txtArea1readonly: false,
                txtArea2readonly: false,
                keyEmail: app.transform.from64str(keys[id]["email"]),
                keyName: app.transform.from64str(keys[id]["displayName"]),

                keyBit: keys[id]["keyLength"],

                txtArea1value: app.transform.from64str(
                    keys[id]["v2"]["publicKey"]
                ),
                txtArea2value: app.transform.from64str(
                    keys[id]["v2"]["privateKey"]
                ),

                //button2enabled:false,
                button2enabled: true,
                button2text: "Save",
                button2onClick: "saveKeys",

                button3enabled: true,
                button3visible: "",
                button3text: "Cancel",
                button3onClick: "showFirst",
                privpassText: keys[id]["keyPass"],
                privTextDisabled: false,

                button4enabled: true,
                button4visible: "",
                button4iClass: "",
                button4text: "Generate New Keys",
                button4onClick: "generateNewKeys",
                button5class: "d-none",

                keyDate: keys[id]["date"],
                keyModified: keys[id]["keysModified"],
                //keyFingerprint:app.transform.keyFingerprint(keys[id]['publicKey'])
            });
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (
                JSON.stringify(nextState.dataSet) !==
                JSON.stringify(this.state.dataSet)
            ) {
                var t = $("#table1").DataTable();
                t.clear();
                var contacts = nextState.dataSet;
                t.rows.add(contacts);
                t.draw(false);
            }
        },

        /**
         *
         * @param {boolean} callback
         */
        validateBeforeSafe: function (callback) {
            var thisComp = this;
            var pass = this.state.privpassText;
            thisComp.checkKeys(function (result) {
                if (
                    thisComp.state.pubCorrect &&
                    thisComp.state.pubBit2strong &&
                    thisComp.state.pubmatch &&
                    thisComp.state.privCorrect &&
                    thisComp.state.privmatch &&
                    thisComp.state.privPass
                ) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        },

        /**
         *
         * @param {null} callback
         */
        checkKeys: function (callback) {
            var thisComp = this;

            //console.log(thisComp.state.txtArea1value);

            app.globalF.getPublicKeyInfo(
                thisComp.state.txtArea1value,
                function (result) {
                    //keyData=result;
                    thisComp.setState({
                        keyStrength: result["strength"],
                        keyFingerprint: result["fingerprint"],
                        keyDate: result["created"],
                    });
                }
            );

            var pass = this.state.privpassText;
            app.globalF.validateKeys(
                thisComp.state.txtArea1value,
                thisComp.state.txtArea2value,
                pass,
                function (result) {
                    thisComp.setState(
                        {
                            pubCorrect: result["pubCorrect"],
                            pubBit2strong: result["pubBit2strong"],
                            pubmatch: result["pubmatch"],

                            privCorrect: result["privCorrect"],
                            privmatch: result["privmatch"],
                            privPass: result["privPass"],
                        },
                        function () {
                            callback();
                        }
                    );
                }
            );
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "changePrivatePass":
                    var thisComp = this;

                    thisComp.setState(
                        {
                            privpassText: event.target.value,
                        },
                        function () {
                            thisComp.checkKeys(function () {
                                var validator = thisComp.state.keysForm;
                                validator.form();

                                $("#pubK").removeClass("invalid");
                                $("#prK").removeClass("valid");

                                validator.resetForm();
                            });
                        }
                    );

                    break;
                case "checkPubKey":
                    var thisComp = this;
                    //console.log(event.target.value);

                    thisComp.setState(
                        {
                            txtArea1value: event.target.value,
                            button2enabled: true,
                        },
                        function () {
                            thisComp.checkKeys(function () {
                                var validator = thisComp.state.keysForm;
                                validator.form();

                                $("#pubK").removeClass("invalid");
                                $("#prK").removeClass("valid");

                                validator.resetForm();
                            });
                        }
                    );

                    break;
                case "checkPrivKey":
                    var thisComp = this;

                    thisComp.setState(
                        {
                            txtArea2value: event.target.value,
                            button2enabled: true,
                        },
                        function () {
                            thisComp.checkKeys(function () {
                                var validator = thisComp.state.keysForm;
                                validator.form();

                                $("#pubK").removeClass("invalid");
                                $("#prK").removeClass("valid");

                                validator.resetForm();
                            });
                        }
                    );

                    break;

                case "changeKeyBit":
                    this.setState({
                        keyBit: event.target.value,
                    });

                    break;
            }
        },
        /**
         *
         * @returns {Array}
         * @constructor
         */
        DefaultPGPbitList: function () {
            var options = [];

            for (var i = 1024; i <= 5120; i += 1024) {
                if (i <= app.user.get("userPlan")["planData"]["pgpStr"]) {
                    options.push(
                        <option key={i} value={i}>
                            {i} bits
                        </option>
                    );
                } else {
                    options.push(
                        <option key={i} disabled={true} value={i}>
                            {i} bits
                        </option>
                    );
                }
            }

            return options;
            console.log(app.user.get("userPlan")["planData"]["pgpStr"]);
        },
        PGPbitList: function () {
            var options = [];

            for (
                var i = 1024;
                i <= app.user.get("userPlan")["planData"]["pgpStr"];
                i += 1024
            ) {
                options.push(
                    <option
                        key={i}
                        value={i}
                        selected={this.state.keyBit === i}
                    >
                        {i} bits
                    </option>
                );
            }

            return options;
            //console.log(app.user.get('userPlan')['planData']['pgpStr']);
        },
        //function changingDomain() {
        //var str=makeVerificationString($('#newCustomDomain').val().toLowerCase());
        //$('#secretSTR').val(str['hash']);
        //}
        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classFullSettSelect = "form-group col-xs-12";

            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle pgp-keys">
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
                            <h2>Security</h2>
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
                                            PGP keys
                                        </a>
                                    </li>
                                    <li>Edit PGP keys</li>
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
                                    <h3>Default PGP Strength</h3>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <select
                                            className="form-select"
                                            onChange={this.handleChange.bind(
                                                this,
                                                "pgpStr"
                                            )}
                                            value={
                                                this.state.defaultPGPStrength
                                            }
                                        >
                                            <option value="0" disabled>
                                                Default PGP bits
                                            </option>
                                            {this.DefaultPGPbitList()}
                                        </select>
                                    </div>
                                </div>
                                <div
                                    style={{ padding: "10px", float: "left" }}
                                ></div>
                                <div className="middle-content-top">
                                    <h3>PGP Keys</h3>
                                </div>

                                <div
                                    className={`table-row ${this.state.firstPanelClass}`}
                                >
                                    <div className="table-responsive">
                                        <table
                                            className="table"
                                            id="table1"
                                            onClick={this.handleClick.bind(
                                                this,
                                                "selectRow"
                                            )}
                                        >
                                            <colgroup>
                                                <col width="40" />
                                                <col />
                                                <col width="60" />
                                                <col width="40" />
                                                <col width="40" />
                                                <col width="40" />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <label className="container-checkbox">
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
                                                        Address{" "}
                                                        <button className="btn-sorting"></button>
                                                    </th>
                                                    <th scope="col">Bit</th>
                                                    <th></th>
                                                    <th scope="col">
                                                        <button className="trash-btn"></button>
                                                    </th>

                                                    <th scope="col">
                                                        <div className="dropdown">
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

                            <div
                                className={`the-creation ${
                                    this.state.viewFlag ? "" : "d-none"
                                }`}
                            >
                                <div className="middle-content-top">
                                    <h3>Information</h3>
                                </div>
                                <div className="form-section">
                                    <form id="editPGPkeys" className="">
                                        <div
                                            className={
                                                this.state.inputSelectClass
                                            }
                                        >
                                            <select
                                                className="form-control"
                                                defaultValue="0"
                                                id="keyStr"
                                                value={this.state.keyBit}
                                                onChange={this.handleChange.bind(
                                                    this,
                                                    "changeKeyBit"
                                                )}
                                                disabled={
                                                    this.state
                                                        .inputSelectDisabled
                                                }
                                            >
                                                <option value="0" disabled>
                                                    Key Strength
                                                </option>
                                                {this.PGPbitList()}
                                            </select>
                                        </div>

                                        <div className="information-table">
                                            <div className="information-table-row">
                                                <label>Name:</label>
                                                <div className="information-row-right">
                                                    {this.state.keyName}
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Email:</label>
                                                <div className="information-row-right">
                                                    {this.state.keyEmail}
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Email Since:</label>
                                                <div className="information-row-right">
                                                    {new Date(
                                                        this.state.emailSince *
                                                            1000
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Keys Created:</label>
                                                <div className="information-row-right">
                                                    {new Date(
                                                        this.state.keyDate
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Strength:</label>
                                                <div className="information-row-right">
                                                    {this.state.keyStrength}{" "}
                                                    bits
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Fingerprint:</label>
                                                <div className="information-row-right">
                                                    {this.state
                                                        .keyFingerprint == `` ||
                                                    this.state.keyFingerprint ==
                                                        undefined ||
                                                    this.state.keyFingerprint ==
                                                        null
                                                        ? `NA`
                                                        : this.state
                                                              .keyFingerprint}
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>
                                                    Private Key Password:
                                                </label>
                                                <div className="information-row-right">
                                                    <input
                                                        type="text"
                                                        name="privPass"
                                                        className="form-control"
                                                        id="privPass"
                                                        placeholder="private key password"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changePrivatePass"
                                                        )}
                                                        disabled={
                                                            this.state
                                                                .privTextDisabled
                                                        }
                                                        value={
                                                            this.state
                                                                .privpassText
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Public Key</label>
                                                <div className="information-row-right">
                                                    <textarea
                                                        className="form-control"
                                                        id="pubK"
                                                        name="publicKey"
                                                        readOnly={
                                                            this.state
                                                                .txtArea1readonly
                                                        }
                                                        value={
                                                            this.state
                                                                .txtArea1value
                                                        }
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            this.state
                                                                .txtArea1onchange
                                                        )}
                                                        spellCheck="false"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="information-table-row">
                                                <label>Private Key</label>
                                                <div className="information-row-right">
                                                    <textarea
                                                        className="form-control"
                                                        rows="8"
                                                        id="prK"
                                                        name="prK"
                                                        readOnly={
                                                            this.state
                                                                .txtArea2readonly
                                                        }
                                                        value={
                                                            this.state
                                                                .txtArea2value
                                                        }
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            this.state
                                                                .txtArea2onchange
                                                        )}
                                                        spellCheck="false"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-section-bottom">
                                            <div className="generate-new-keys">
                                                <button
                                                    type="button"
                                                    className={
                                                        "icon-btn" +
                                                        this.state
                                                            .button4visible
                                                    }
                                                    disabled={
                                                        !this.state
                                                            .button4enabled
                                                    }
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        this.state
                                                            .button4onClick
                                                    )}
                                                >
                                                    <i></i> Generate new keys
                                                </button>
                                            </div>
                                            <div className="btn-row">
                                                <button
                                                    type="button"
                                                    className={
                                                        "btn-border fixed-width-btn " +
                                                        this.state
                                                            .button3visible
                                                    }
                                                    disabled={
                                                        !this.state
                                                            .button3enabled
                                                    }
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        this.state
                                                            .button3onClick
                                                    )}
                                                >
                                                    {this.state.button3text}
                                                </button>
                                                <button
                                                    type="button"
                                                    className={
                                                        "btn btn-warning " +
                                                        this.state.button5class
                                                    }
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "editKey"
                                                    )}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn-blue fixed-width-btn"
                                                    disabled={
                                                        !this.state
                                                            .button2enabled
                                                    }
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        this.state
                                                            .button2onClick
                                                    )}
                                                >
                                                    <i
                                                        className={
                                                            this.state
                                                                .button2iClass
                                                        }
                                                    ></i>
                                                    {this.state.button2text}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-right pgp-keys">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>

                            <div className="panel-body">
                                <h3>Default key strength bits</h3>
                                <p>
                                    Select the strength of the cryptography to
                                    be used for your key strength. A lower
                                    number of bits might improve speed but
                                    reduce security dramatically. A higher
                                    number of bits will take more time to
                                    process and open upon login and may not be
                                    supported by all devices if exported. The
                                    minimum recommended key strength is 2048
                                    bits.
                                </p>
                                <h3>Key Strength</h3>
                                <p>
                                    The strength of your PGP keys is determined
                                    by the number of bits. Keys with more bits
                                    are harder to break, but also take longer to
                                    use when encrypting and decrypting email. At
                                    this time 2048 bit keys are the recommended
                                    value and is the default selection.
                                    Increasing your key strength to 4096 or
                                    higher may prevent you from needing to
                                    generate new keys in the near future. Lower
                                    strength 1024 bit keys are available for
                                    compatibility reasons, but they are not
                                    recommended.
                                </p>
                                <h3>Fingerprint</h3>
                                <p>
                                    The fingerprint for a PGP key is used for
                                    some key management tasks. Detailed
                                    information about PGP key fingerprints can
                                    be found at
                                </p>
                                <div className="blue-bg-text">
                                    <a
                                        href="https://en.wikipedia.org/wiki/Public_key_fingerprint"
                                        target="_blank"
                                    >
                                        https://en.wikipedia.org/wiki/Public_key_fingerprint
                                    </a>
                                    <a
                                        className="__copy"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "copyClipboard"
                                        )}
                                    >
                                        <span className="icon">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10.625 8.97812V11.2094C10.625 13.0688 9.88125 13.8125 8.02188 13.8125H5.79063C3.93125 13.8125 3.1875 13.0688 3.1875 11.2094V8.97812C3.1875 7.11875 3.93125 6.375 5.79063 6.375H8.02188C9.88125 6.375 10.625 7.11875 10.625 8.97812Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M13.8125 5.79063V8.02188C13.8125 9.88125 13.0688 10.625 11.2094 10.625H10.625V8.97812C10.625 7.11875 9.88125 6.375 8.02188 6.375H6.375V5.79063C6.375 3.93125 7.11875 3.1875 8.97812 3.1875H11.2094C13.0688 3.1875 13.8125 3.93125 13.8125 5.79063Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                                <h3>The private key password</h3>
                                <p>
                                    The private key password is used to secure
                                    your key. The security of your private key
                                    is important because it is required to
                                    decrypt and read your email.
                                </p>
                                <h3>What are PGP public and private keys?</h3>
                                <p>
                                    Your public and private keys are used to
                                    encrypt and decrypt PGP encrypted emails.
                                    More information about how PGP works can be
                                    found on
                                </p>
                                <div className="blue-bg-text">
                                    <a href="https://en.wikipedia.org/wiki/Pretty_Good_Privacy">
                                        https://en.wikipedia.org/wiki/Pretty_Good_Privacy
                                    </a>
                                    <a
                                        className="__copy"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "copyClipboard"
                                        )}
                                    >
                                        <span className="icon">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10.625 8.97812V11.2094C10.625 13.0688 9.88125 13.8125 8.02188 13.8125H5.79063C3.93125 13.8125 3.1875 13.0688 3.1875 11.2094V8.97812C3.1875 7.11875 3.93125 6.375 5.79063 6.375H8.02188C9.88125 6.375 10.625 7.11875 10.625 8.97812Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M13.8125 5.79063V8.02188C13.8125 9.88125 13.0688 10.625 11.2094 10.625H10.625V8.97812C10.625 7.11875 9.88125 6.375 8.02188 6.375H6.375V5.79063C6.375 3.93125 7.11875 3.1875 8.97812 3.1875H11.2094C13.0688 3.1875 13.8125 3.93125 13.8125 5.79063Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                                <p>and the</p>
                                <div className="blue-bg-text">
                                    <a href="http://www.pgpi.org/">
                                        http://www.pgpi.org/
                                    </a>
                                    <a
                                        className="__copy"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "copyClipboard"
                                        )}
                                    >
                                        <span className="icon">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10.625 8.97812V11.2094C10.625 13.0688 9.88125 13.8125 8.02188 13.8125H5.79063C3.93125 13.8125 3.1875 13.0688 3.1875 11.2094V8.97812C3.1875 7.11875 3.93125 6.375 5.79063 6.375H8.02188C9.88125 6.375 10.625 7.11875 10.625 8.97812Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M13.8125 5.79063V8.02188C13.8125 9.88125 13.0688 10.625 11.2094 10.625H10.625V8.97812C10.625 7.11875 9.88125 6.375 8.02188 6.375H6.375V5.79063C6.375 3.93125 7.11875 3.1875 8.97812 3.1875H11.2094C13.0688 3.1875 13.8125 3.93125 13.8125 5.79063Z"
                                                    strokeWidth="1.0625"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
