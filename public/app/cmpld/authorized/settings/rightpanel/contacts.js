define(["react", "app", "dataTable", "dataTableBoot", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, DataTable, dataTableBoot, RightTop) {
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
                firstTab: "active",

                secondPanelText: "New Contact",

                button1text: "Add Contact",
                button1visible: "",
                button1onClick: "addNewContact",

                button2text: "Save",
                button2onClick: "saveNewContact",

                button3enabled: true,
                button3visible: "",
                button3text: "Cancel",
                button3onClick: "showFirst",

                contactsSet: {},
                rememberContacts: app.user.get("rememberContacts"),

                contactId: "",
                nameField: "",
                emailField: "",
                pinField: "",
                pgpField: "",
                pgpOn: false,

                keyStrength: "",
                keyFingerprint: "",
                keyDate: "",
                pubCorrect: true,

                keyForm: {}
            };
        },

        /**
         *
         * @returns {Array}
         */
        getContacts: function () {
            var alEm = [];

            var ff = app.user.get("contacts");

            delete ff[""];
            $.each(app.user.get("contacts"), function (index, contactData) {
                var el = {
                    DT_RowId: index,
                    checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                    email: {
                        display: app.transform.escapeTags(app.transform.from64str(contactData["e"]))
                    },
                    name: {
                        display: app.transform.escapeTags(app.transform.from64str(contactData["n"]))
                    },
                    edit: '<a class="table-icon edit-button"></a>',
                    delete: '<button class="table-icon delete-button"></button>',
                    options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                };
                alEm.push(el);
            });

            this.setState({ contactsSet: alEm });
            return alEm;
        },

        componentDidMount: function () {
            var dtSet = this.getContacts();

            var thisComp = this;

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: dtSet,

                columns: [{ data: "checkbox" }, {
                    data: {
                        _: "email.display",
                        sort: "email.display"
                    }
                }, {
                    data: {
                        _: "name.display",
                        sort: "name.display"
                    }
                }, { data: "edit" }, { data: "delete" }, { data: "options" }],
                columnDefs: [{ orderDataType: "data-sort", targets: 1 }, {
                    sClass: "data-cols col-content-width_one_half",
                    targets: [1, 2]
                }, { sClass: "col-options-width", targets: [0, -1] }, { sClass: "col-mobile-hide", targets: [3, 4] }],
                order: [[0, "asc"]],
                language: {
                    emptyTable: "No Contacts",
                    info: "Showing _START_ - _END_ of _TOTAL_ result",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>"
                    }
                }
            });

            this.setState({ keyForm: $("#editPGPkey").validate() });

            $.validator.addMethod("pubCorrect", function (value, element) {
                return thisComp.state.pubCorrect;
            }, "Public Key format is unknown");

            $("#pgpField").rules("add", {
                pubCorrect: true
            });

            $("#nameField").rules("add", {
                //required: true,
                minlength: 1,
                maxlength: 200
            });

            $("#emailField").rules("add", {
                required: true,
                email: true,
                minlength: 5,
                maxlength: 220
            });

            $("#pinField").rules("add", {
                minlength: 3,
                maxlength: 100
            });
        },

        /**
         *
         * @returns {boolean}
         */

        checkKey: function () {
            var isSuccess = app.globalF.validatePublicKey(this.state.pgpField);
            return isSuccess;
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (JSON.stringify(nextState.contactsSet) !== JSON.stringify(this.state.contactsSet)) {
                var t = $("#table1").DataTable();
                t.clear();
                var contacts = nextState.contactsSet;
                t.rows.add(contacts);
                t.draw(false);
            }
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "showFirst":
                    this.setState({
                        viewFlag: false,
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",
                        firstTab: "active",

                        button1visible: "",

                        contactId: "",
                        nameField: "",
                        emailField: "",
                        pinField: "",
                        pgpField: "",

                        pgpOn: false,

                        keyStrength: "",
                        keyFingerprint: "",
                        keyDate: ""
                    });

                    var validator = this.state.keyForm;
                    validator.form();

                    $("#nameField").removeClass("invalid");
                    $("#nameField").removeClass("valid");

                    $("#emailField").removeClass("invalid");
                    $("#emailField").removeClass("valid");

                    $("#pinField").removeClass("invalid");
                    $("#pinField").removeClass("valid");

                    $("#pgpField").removeClass("invalid");
                    $("#pgpField").removeClass("valid");

                    validator.resetForm();

                    break;

                case "addNewContact":
                    var thisComp = this;
                    app.globalF.checkPlanLimits("contacts", Object.keys(app.user.get("contacts")).length, function (result) {
                        if (result) {
                            thisComp.setState({
                                firstPanelClass: "panel-body d-none",
                                secondPanelClass: "panel-body",
                                firstTab: "active",

                                secondPanelText: "New Contact",

                                button1visible: "d-none",

                                button2onClick: "saveNewContact",

                                button4visible: "d-none"
                            });
                        }
                    });

                    break;
                case "deleteContact":
                    var thisComp = this;
                    var id = thisComp.state.contactId;

                    var contacts = app.user.get("contacts");
                    console.log(contacts[id]);

                    $("#dialogModHead").html("Delete Contact");
                    $("#dialogModBody").html("Contact will be deleted. Continue?");
                    $("#dialogModBodyHeading").html('Are you sure you want to Delete <br /> "Dennis@cyberfear.com"?');

                    $("#dialogOk").on("click", function () {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");

                        delete contacts[id];

                        app.user.set({ contactsChanged: true });
                        app.userObjects.updateObjects("saveContacts", "", function (result) {
                            if (result == "saved") {
                                thisComp.getContacts();

                                thisComp.handleClick("showFirst");
                                $("#dialogPop").modal("hide");
                            } else if (result == "newerFound") {
                                $("#dialogPop").modal("hide");
                            }
                        });
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    });

                    $("#dialogPop").modal("show");

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
                case "selectRow":
                    var thisComp = this;
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
                            thisComp.setState({
                                contactId: id
                            });
                            thisComp.handleClick("editContact", id);
                        }
                    }
                    // Delete click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "BUTTON") {
                        if (event.target.classList.contains("delete-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                thisComp.setState({
                                    contactId: id
                                });
                                thisComp.handleClick("deleteContact", id);
                            }
                        }
                    }

                    break;

                case "editContact":
                    var contacts = app.user.get("contacts");
                    var contact = contacts[event];
                    var thisComp = this;

                    $("#settings-spinner").removeClass("d-none").addClass("d-block");

                    app.globalF.getPublicKeyInfo(app.transform.from64str(contact["pgp"]), function (result) {
                        thisComp.setState({
                            keyStrength: result["strength"],
                            keyFingerprint: result["fingerprint"],
                            keyDate: result["created"]
                        });
                        $("#settings-spinner").removeClass("dmblock").addClass("d-none");
                    });
                    this.setState({
                        viewFlag: true,
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body",
                        firstTab: "active",

                        secondPanelText: "Edit Contact",

                        button1visible: "d-none",

                        contactId: event,
                        nameField: app.transform.from64str(contact["n"]),
                        emailField: app.transform.from64str(contact["e"]),
                        pinField: app.transform.from64str(contact["p"]),
                        pgpOn: contact["pgpOn"],
                        pgpField: app.transform.from64str(contact["pgp"]),

                        button4visible: "",
                        button2onClick: "saveExistingContact"
                    });

                    break;

                case "saveNewContact":
                    var thisComp = this;

                    var validator = this.state.keyForm;
                    validator.form();

                    if (validator.numberOfInvalids() == 0) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        var contacts = app.user.get("contacts");

                        var contId = app.transform.to64str(thisComp.state.emailField);

                        contacts[contId] = {
                            n: app.transform.to64str(thisComp.state.nameField),
                            p: app.transform.to64str(thisComp.state.pinField),
                            e: app.transform.to64str(thisComp.state.emailField),
                            pgp: app.transform.to64str(thisComp.state.pgpField),
                            pgpOn: thisComp.state.pgpField == "" ? false : thisComp.state.pgpOn
                        };

                        app.user.set({ contactsChanged: true });

                        app.userObjects.updateObjects("saveContacts", "", function (result) {
                            if (result == "saved") {
                                thisComp.getContacts();

                                thisComp.handleClick("showFirst");
                                $("#dialogPop").modal("hide");
                            } else if (result == "newerFound") {
                                $("#dialogPop").modal("hide");
                            }

                            $("#settings-spinner").removeClass("d-block").addClass("d-none");
                        });

                        thisComp.getContacts();
                        thisComp.handleClick("showFirst");
                    }

                    break;

                case "saveExistingContact":
                    var thisComp = this;

                    var validator = this.state.keyForm;
                    validator.form();

                    if (validator.numberOfInvalids() == 0) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        var contacts = app.user.get("contacts");

                        if (contacts[thisComp.state.contactId]["n"] != app.transform.to64str(thisComp.state.nameField) || contacts[thisComp.state.contactId]["p"] != app.transform.to64str(thisComp.state.pinField) || contacts[thisComp.state.contactId]["e"] != app.transform.to64str(thisComp.state.emailField) || contacts[thisComp.state.contactId]["pgp"] != app.transform.to64str(thisComp.state.pgpField) || contacts[thisComp.state.contactId]["pgpOn"] != app.transform.to64str(thisComp.state.pgpOn)) {
                            contacts[thisComp.state.contactId] = {
                                n: app.transform.to64str(thisComp.state.nameField),
                                p: app.transform.to64str(thisComp.state.pinField),
                                e: app.transform.to64str(thisComp.state.emailField),
                                pgp: app.transform.to64str(thisComp.state.pgpField),
                                pgpOn: thisComp.state.pgpOn
                            };

                            app.user.set({ contactsChanged: true });
                            app.userObjects.updateObjects("saveContacts", "", function (result) {
                                if (result == "saved") {
                                    thisComp.getContacts();

                                    thisComp.handleClick("showFirst");
                                } else if (result == "newerFound") {}
                            });
                        } else {
                            app.notifications.systemMessage("nthTochng");
                        }
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    }

                    break;

                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag,
                        button4visible: "d-none"
                    });
                    break;
            }
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "remCont":
                    this.setState({
                        rememberContacts: !this.state.rememberContacts
                    });
                    app.user.set({ inProcess: true });
                    $("#settings-spinner").removeClass("d-none").addClass("d-block");
                    app.user.set({
                        rememberContacts: !this.state.rememberContacts
                    });

                    app.userObjects.updateObjects("userProfile", "", function (response) {
                        if (response === "saved") {
                            app.user.set({ inProcess: false });
                        } else if (response === "newerFound") {
                            app.user.set({ inProcess: false });
                        } else if (response === "nothingUpdt") {
                            app.user.set({ inProcess: false });
                        }
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    });

                    break;

                case "enablePublic":
                    this.setState({
                        pgpOn: !this.state.pgpOn
                    });
                    break;

                case "changeName":
                    this.setState({
                        nameField: event.target.value
                    });

                    break;
                case "changeEmail":
                    this.setState({
                        emailField: event.target.value
                    });

                    break;
                case "changePin":
                    this.setState({
                        pinField: event.target.value
                    });

                    break;

                case "changePGP":
                    var thisComp = this;
                    this.setState({
                        pgpField: event.target.value
                    }, function () {
                        app.globalF.getPublicKeyInfo(thisComp.state.pgpField, function (result) {
                            thisComp.setState({
                                keyStrength: result["strength"],
                                keyFingerprint: result["fingerprint"],
                                keyDate: result["created"]
                            });
                        });
                        app.globalF.validateKeys(thisComp.state.pgpField, "", "", function (result) {
                            thisComp.setState({
                                pubCorrect: result["pubCorrect"]
                            });
                        });
                    });

                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            var classFullSettSelect = "form-group col-xs-12";

            return React.createElement(
                "div",
                {
                    className: this.props.classes.rightClass,
                    id: "rightSettingPanel"
                },
                React.createElement(
                    "div",
                    { className: "setting-middle contacts" },
                    React.createElement(
                        "div",
                        { className: "panel panel-default panel-setting" },
                        React.createElement(
                            "div",
                            { className: "middle-top" },
                            React.createElement(
                                "div",
                                {
                                    className: `arrow-back ${ this.state.viewFlag ? "" : "d-none" }`
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
                                    className: `bread-crumb ${ this.state.viewFlag ? "" : "d-none" }`
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
                                            "Contacts"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        "Add contact"
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
                                    className: `the-view ${ this.state.viewFlag ? "d-none" : "" }`
                                },
                                React.createElement(
                                    "div",
                                    { className: "middle-content-top alt" },
                                    React.createElement(
                                        "h3",
                                        null,
                                        "Contacts"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "middle-content-top-right" },
                                        React.createElement(
                                            "div",
                                            { className: "remember-box" },
                                            React.createElement(
                                                "label",
                                                { className: "container-checkbox with-label" },
                                                React.createElement("input", {
                                                    type: "checkbox",
                                                    checked: this.state.rememberContacts,
                                                    onChange: this.handleChange.bind(this, "remCont")
                                                }),
                                                React.createElement("span", { className: "checkmark" }),
                                                " ",
                                                "Remember contacts"
                                            )
                                        ),
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
                                                "Add contact"
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
                                                onClick: this.handleClick.bind(this, "selectRow")
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
                                                        {
                                                            scope: "col",
                                                            className: "name-width"
                                                        },
                                                        "Name",
                                                        " ",
                                                        React.createElement("button", { className: "btn-sorting" })
                                                    ),
                                                    React.createElement("th", null),
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
                                    className: `the-creation ${ this.state.viewFlag ? "" : "d-none" }`
                                },
                                React.createElement(
                                    "div",
                                    { className: "middle-content-top" },
                                    React.createElement(
                                        "h3",
                                        null,
                                        "Add contact"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "form-section" },
                                    React.createElement(
                                        "form",
                                        { id: "editPGPkey", className: "" },
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
                                                        name: "nameField",
                                                        className: "form-control with-icon icon-name",
                                                        id: "nameField",
                                                        placeholder: "Enter name",
                                                        value: this.state.nameField,
                                                        onChange: this.handleChange.bind(this, "changeName")
                                                    })
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-12" },
                                                React.createElement(
                                                    "div",
                                                    { className: "form-group" },
                                                    React.createElement("input", {
                                                        type: "text",
                                                        name: "emailField",
                                                        readOnly: this.state.contactId != "" ? true : false,
                                                        className: "form-control with-icon icon-email",
                                                        id: "emailField",
                                                        placeholder: "Enter email",
                                                        value: this.state.emailField,
                                                        onChange: this.handleChange.bind(this, "changeEmail")
                                                    })
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-12" },
                                                React.createElement(
                                                    "div",
                                                    { className: "form-group" },
                                                    React.createElement("input", {
                                                        type: "text",
                                                        name: "pinField",
                                                        className: "form-control with-icon icon-pin",
                                                        id: "pinField",
                                                        placeholder: "Enter pin (optional)",
                                                        value: this.state.pinField,
                                                        readOnly: this.state.pgpOn,
                                                        onChange: this.handleChange.bind(this, "changePin")
                                                    })
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-12" },
                                                React.createElement(
                                                    "div",
                                                    { className: "form-group" },
                                                    React.createElement(
                                                        "div",
                                                        { className: "key-checkbox-row" },
                                                        React.createElement(
                                                            "div",
                                                            { className: "key-checkbox-top" },
                                                            React.createElement(
                                                                "label",
                                                                { className: "container-checkbox with-label" },
                                                                React.createElement("input", {
                                                                    type: "checkbox",
                                                                    onChange: this.handleChange.bind(this, "enablePublic"),
                                                                    checked: this.state.pgpOn
                                                                }),
                                                                React.createElement("span", { className: "checkmark" }),
                                                                " ",
                                                                "Contact Public Key"
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "div",
                                                            {
                                                                className: `
                                                            key-list ${ !this.state.pgpOn ? "d-none" : "" }`
                                                            },
                                                            React.createElement(
                                                                "ul",
                                                                null,
                                                                React.createElement(
                                                                    "li",
                                                                    null,
                                                                    "Strength:",
                                                                    " ",
                                                                    this.state.keyStrength != "" ? this.state.keyStrength + " bits" : ""
                                                                ),
                                                                React.createElement(
                                                                    "li",
                                                                    null,
                                                                    "Fingerprint:",
                                                                    " ",
                                                                    this.state.keyFingerprint
                                                                ),
                                                                React.createElement(
                                                                    "li",
                                                                    null,
                                                                    "Created:",
                                                                    " ",
                                                                    this.state.keyDate != "" ? new Date(this.state.keyDate).toLocaleString() : ""
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "col-12" },
                                                React.createElement(
                                                    "div",
                                                    { className: "form-group" },
                                                    React.createElement("input", {
                                                        className: "form-control with-icon icon-key",
                                                        id: "pgpField",
                                                        name: "pgpField",
                                                        readOnly: !this.state.pgpOn,
                                                        value: this.state.pgpField,
                                                        onChange: this.handleChange.bind(this, "changePGP"),
                                                        placeholder: "Public Key (optional)"
                                                    })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "form-section-bottom" },
                                            React.createElement(
                                                "div",
                                                { className: "delete-item" },
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "button",
                                                        className: this.state.button4visible,
                                                        onClick: this.handleClick.bind(this, "deleteContact")
                                                    },
                                                    "Delete"
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "btn-row" },
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "button",
                                                        className: "btn-border fixed-width-btn",
                                                        onClick: this.handleClick.bind(this, this.state.button3onClick)
                                                    },
                                                    "Cancel"
                                                ),
                                                React.createElement(
                                                    "button",
                                                    {
                                                        type: "button",
                                                        className: "btn-blue fixed-width-btn",
                                                        onClick: this.handleClick.bind(this, this.state.button2onClick)
                                                    },
                                                    "Save"
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
                    { className: "setting-right contacts " },
                    React.createElement(RightTop, null),
                    React.createElement(
                        "div",
                        { className: "setting-right-data" },
                        React.createElement(
                            "div",
                            { className: "panel-heading" },
                            React.createElement(
                                "h2",
                                { className: "panel-title personal-info-title" },
                                "Help"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "panel-body" },
                            React.createElement(
                                "h3",
                                null,
                                "Remember Contacts"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "When this option is checked, new contacts will be auto-saved upon sending email."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Name"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Enter the contact's real name."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Email"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Enter the contact's email address."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Pin"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "This is optional. This is a number that you choose which consists of at least four digits. You share it with your contact via some other form of communication. Anytime you send that contact an email, they need to know the pin number in order to read it. If you choose to use pin numbers, you should choose a different one for each contact."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Public Key"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "If you know the public key for a contact with an email address hosted by another email service, paste it into this box to gain the ability to send that contact PGP encrypted emails."
                            )
                        )
                    )
                )
            );
        }
    });
});