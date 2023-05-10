define(["react", "app", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, RightTop) {
    "use strict";

    return React.createClass({
        /**
         *
         * @returns {{
         * firstPanelClass: string,
         * secondPanelClass: string,
         * firstTab: string,
         * secondTab: string,
         * secondPanelText: string,
         * button1class: string,
         * inputNameClass: string,
         * inputNameChange: string,
         * inputSelectClass: string,
         * inputSelectChange: string,
         * filterSet: {},
         * ruleId: string,
         * fieldFrom: string,
         * fieldMatch: string,
         * fieldText: string,
         * fieldFolder: string,
         * ruleForm: {}
         * }}
         */
        getInitialState: function () {
            return {
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body d-none",
                firstTab: "active",
                secondTab: "",
                secondPanelText: "Add new Email filter",

                button1class: "btn btn-primary pull-right",
                button2class: "btn btn-warning pull-right margin-right-30",

                inputNameClass: "form-group",
                inputNameChange: "changeFolderName",

                inputSelectClass: "form-group",

                inputSelectChange: "changeFolderExpiration",

                filterSet: {},

                ruleId: "",
                fieldFrom: "sender",
                fieldMatch: "strict",
                fieldText: "",
                fieldFolder: "1",

                ruleForm: {}
            };
        },

        /**
         *
         * @returns {Array}
         */
        getFilter: function () {
            var alEm = [];

            $.each(app.user.get("filter"), function (index, fRule) {
                var folder = app.user.get("folders")[fRule["to"]];

                //console.log(folder!=undefined);
                var folderName = folder != undefined ? app.transform.from64str(folder["name"]) : "Inbox";
                //var folderName='Inbox';
                var from = "<span><b>" + (fRule["field"] == "rcpt" ? "recipient" : fRule["field"] == "sender" ? "sender" : fRule["field"] == "subject" ? "subject" : "") + "</b></span> ";
                var match = "<span>" + (fRule["match"] == "strict" ? "match" : fRule["match"] == "relaxed" ? "contains" : "not contain") + "</span> ";
                var text = '<span>"<b>' + app.transform.escapeTags(app.transform.from64str(fRule["text"])) + '</b>"</span> ';
                var to = "<span><b>" + app.transform.escapeTags(folderName) + "</b></span>";
                var el = {
                    DT_RowId: index,
                    checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                    text: {
                        display: from + match + text + "<span>will be moved to </span> " + to,
                        index: index
                    },
                    edit: '<a class="table-icon edit-button"></a>',
                    delete: '<button class="table-icon delete-button"></button>',
                    options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                };

                alEm.push(el);

                //console.log(emailData);
            });

            //console.log(alEm);

            //this.setState({filterSet:alEm});
            //	console.log(alEm);
            return alEm;
        },

        /**
         *
         * @returns {Array}
         */
        getFolders: function () {
            var folder = app.user.get("folders");
            var options = [];
            $.each(folder, function (index, folder) {
                options.push(React.createElement(
                    "option",
                    { key: index, value: index },
                    app.transform.from64str(folder["name"])
                ));
            });
            return options;
        },

        componentDidMount: function () {
            var dtSet = this.getFilter();

            require(["dataTable", "dataTableBoot"], function (DataTable, dataTableBoot) {
                $("#table1").dataTable({
                    responsive: true,
                    dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                    data: dtSet,
                    columns: [{ data: "checkbox" }, {
                        data: {
                            _: "text.display",
                            sort: "text.index"
                        }
                    }, { data: "edit" }, { data: "delete" }, { data: "options" }],
                    columnDefs: [{ orderDataType: "data-sort", targets: 1 }, {
                        sClass: "data-cols type_full col-content-width",
                        targets: [1]
                    }, { sClass: "col-options-width", targets: [0, -1] }, { sClass: "col-mobile-hide", targets: [2, 3] }],
                    order: [[1, "asc"]],
                    language: {
                        emptyTable: "Empty",
                        sSearch: "",
                        searchPlaceholder: "Find something...",
                        info: "Showing _START_ - _END_ of _TOTAL_ result",
                        paginate: {
                            sPrevious: "<i class='fa fa-chevron-left'></i>",
                            sNext: "<i class='fa fa-chevron-right'></i>"
                        }
                    }
                });
            });
            //	this.handleClick("addFilterRule");

            this.setState({ ruleForm: $("#addRuleForm").validate() });

            $("#textField").rules("add", {
                required: true,
                minlength: 3,
                maxlength: 90
            });

            $("#destinationField").rules("add", {
                required: true
            });

            //
            //
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "changeFrom":
                    this.setState({ fieldFrom: event.target.value });
                    break;

                case "changeMatch":
                    this.setState({ fieldMatch: event.target.value });
                    break;

                case "changeText":
                    this.setState({ fieldText: event.target.value });
                    break;

                case "changeDestination":
                    this.setState({ fieldFolder: event.target.value });
                    break;
            }
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "handleSelectAll":
                    if (event.target.checked) {
                        $("table .container-checkbox input").prop("checked", true);
                        $("table tr").addClass("selected");
                    } else {
                        $("table .container-checkbox input").prop("checked", false);
                        $("table tr").removeClass("selected");
                    }

                    break;
                case "showFirst":
                    this.setState({
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",

                        firstTab: "active",
                        secondTab: "",

                        button1class: "btn btn-primary pull-right",
                        button2class: "btn btn-warning pull-right margin-right-30",

                        secondPanelText: "Add new Email filter",

                        ruleId: "",
                        fieldFrom: "sender",
                        fieldMatch: "strict",
                        fieldText: "",
                        fieldFolder: "1"
                    });

                    var validator = this.state.ruleForm;
                    validator.form();

                    $("#textField").removeClass("invalid");
                    $("#textField").removeClass("valid");

                    $("#destinationField").removeClass("invalid");
                    $("#destinationField").removeClass("valid");

                    validator.resetForm();

                    break;

                case "clearFilterRules":
                    app.user.set({ filter: {} });
                    var thisComp = this;

                    app.userObjects.updateObjects("saveFilter", "", function (result) {
                        if (result == "saved") {
                            thisComp.setState({
                                filterSet: thisComp.getFilter()
                            });
                            thisComp.handleClick("showFirst");
                            app.notifications.systemMessage("saved");
                        } else if (result == "newerFound") {
                            app.notifications.systemMessage("newerFnd");
                        } else if (result == "nothingUpdt") {
                            app.notifications.systemMessage("nthTochngORexst");
                        }
                    });

                    break;
                case "addFilterRule":
                    var thisComp = this;
                    app.globalF.checkPlanLimits("filter", Object.keys(app.user.get("filter")).length, function (result) {
                        if (result) {
                            thisComp.setState({
                                firstPanelClass: "panel-body d-none",
                                secondPanelClass: "panel-body ",
                                firstTab: "active",
                                secondTab: "bingo",

                                secondPanelText: "Add new Email filter",

                                deleteButtonClass: "d-none",
                                saveButtonText: "Add",

                                button1class: "d-none",
                                button2class: "d-none"
                            });
                        }
                    });

                    break;
                case "saveRule":
                    var validator = this.state.ruleForm;

                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        var id = thisComp.state.ruleId;
                        var from = thisComp.state.fieldFrom;
                        var match = thisComp.state.fieldMatch;
                        var folder = thisComp.state.fieldFolder;
                        var text = thisComp.state.fieldText;

                        app.globalF.createFilterRule(id, from, match, folder, text, function () {
                            app.userObjects.updateObjects("saveFilter", "", function (result) {
                                if (result == "saved") {
                                    thisComp.setState({
                                        filterSet: thisComp.getFilter()
                                    });
                                    thisComp.handleClick("showFirst");
                                    app.notifications.systemMessage("saved");
                                } else if (result == "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                } else if (result == "nothingUpdt") {
                                    app.notifications.systemMessage("nthTochngORexst");
                                }
                            });

                            //thisComp.setState({filterSet:thisComp.getFilter()});
                            //thisComp.handleClick("showFirst");
                        });
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    }

                    break;

                case "editRule":
                    var filter = app.user.get("filter");
                    var id = event;

                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body ",
                        firstTab: "active",
                        secondTab: "bingo",

                        secondPanelText: "Edit Rule",

                        button1class: "d-none",
                        button2class: "d-none",
                        deleteButtonClass: "",
                        saveButtonText: "Save",

                        ruleId: id,
                        fieldFrom: filter[id]["field"],
                        fieldMatch: filter[id]["match"],
                        fieldText: app.transform.from64str(filter[id]["text"]),
                        fieldFolder: filter[id]["to"]
                    });

                    break;

                case "deleteRule":
                    break;

                case "selectRow":
                    // var id = $(event.target).parents("tr").attr("id");
                    // if (id != undefined) {
                    //     this.handleClick("editRule", id);
                    // }

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
                                ruleId: id
                            });
                            thisComp.handleClick("editRule", id);
                        }
                    }

                    // Delete click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "BUTTON") {
                        if (event.target.classList.contains("delete-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                thisComp.setState({
                                    ruleId: id
                                });
                                thisComp.deleteRule(id);
                            }
                        }
                    }

                    break;
            }
        },

        deleteRule: function (id) {
            $("#settings-spinner").removeClass("d-none").addClass("d-block");
            var thisComp = this;
            var filter = app.user.get("filter");
            console.log(id);

            delete filter[id];

            app.userObjects.updateObjects("saveFilter", "", function (result) {
                if (result == "saved") {
                    thisComp.setState({
                        filterSet: thisComp.getFilter()
                    });
                    thisComp.handleClick("showFirst");
                } else if (result == "newerFound") {}
            });
            $("#settings-spinner").removeClass("d-block").addClass("d-none");
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (JSON.stringify(nextState.filterSet) !== JSON.stringify(this.state.filterSet)) {
                var t = $("#table1").DataTable();
                t.clear();
                var folders = nextState.filterSet;
                t.rows.add(folders);
                t.draw(false);
            }
        },

        /**
         *
         * @returns {JSX}
         */render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle email-filters" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "div",
                            {
                                className: `arrow-back ${ this.state.secondTab === "bingo" ? "" : "d-none" }`
                            },
                            React.createElement("a", {
                                onClick: this.handleClick.bind(this, "showFirst")
                            })
                        ),
                        React.createElement(
                            "h2",
                            null,
                            "Mailbox"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: `bread-crumb  ${ this.state.secondTab === "bingo" ? "" : "d-none" }`
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
                                            onClick: this.handleClick.bind(this, "showFirst")
                                        },
                                        "Email filter"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    this.state.secondPanelText
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
                                className: `table-row ${ this.state.firstPanelClass }`
                            },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    "Email filters"
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
                                                onClick: this.handleClick.bind(this, "addFilterRule")
                                            },
                                            React.createElement(
                                                "span",
                                                { className: "icon" },
                                                "+"
                                            ),
                                            "Add Rule"
                                        )
                                    )
                                )
                            ),
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
                                                "Filters"
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
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.secondPanelClass },
                            React.createElement(
                                "div",
                                { className: "middle-content-top" },
                                React.createElement(
                                    "h3",
                                    null,
                                    this.state.secondPanelText
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addRuleForm", className: "" },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputSelectClass
                                                },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-select",
                                                        id: "fromField",
                                                        onChange: this.handleChange.bind(this, "changeFrom"),
                                                        value: this.state.fieldFrom
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        { value: "sender" },
                                                        "From"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "rcpt" },
                                                        "To"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "subject" },
                                                        "Subject"
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputSelectClass
                                                },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-select",
                                                        id: "matchField",
                                                        onChange: this.handleChange.bind(this, "changeMatch"),
                                                        value: this.state.fieldMatch
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        { value: "relaxed" },
                                                        "Contains"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "negative" },
                                                        "Does not Contain"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "strict" },
                                                        "match"
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputSelectClass
                                                },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "fromName",
                                                    className: "form-control",
                                                    id: "textField",
                                                    placeholder: "text",
                                                    onChange: this.handleChange.bind(this, "changeText"),
                                                    value: this.state.fieldText
                                                })
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputSelectClass
                                                },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-select",
                                                        defaultValue: "0",
                                                        id: "destinationField",
                                                        onChange: this.handleChange.bind(this, "changeDestination"),
                                                        value: this.state.fieldFolder
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        {
                                                            value: "0",
                                                            disabled: true
                                                        },
                                                        "Move To"
                                                    ),
                                                    this.getFolders()
                                                )
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
                                                    className: this.state.deleteButtonClass,
                                                    onClick: this.handleClick.bind(this, "deleteRule")
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
                                                    onClick: this.handleClick.bind(this, "showFirst")
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, "saveRule")
                                                },
                                                this.state.saveButtonText
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
                    { className: "setting-right email-filters" },
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
                                "Email Filter"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Creating an email filter requires 4 pieces of information:"
                            ),
                            React.createElement(
                                "div",
                                { className: "bullets" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        "The From: To: or Subject: to match"
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        "Select if the rule applies when the text in the next box is matched, not matched, or is an exact match."
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        " The text being matched"
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        " ",
                                        "Select where the email should be delivered (inbox or a folder)"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "p",
                            null,
                            "If you like Once you are done, click the Add button to create the email filter."
                        )
                    )
                )
            );
        }
    });
});