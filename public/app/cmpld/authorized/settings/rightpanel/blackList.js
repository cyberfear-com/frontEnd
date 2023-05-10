define(["react", "app", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, RightTop) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body d-none",
                firstTab: "active",
                secondTab: "",
                secondPanelText: "Add Rule",

                button1class: "btn btn-primary pull-right",
                button2class: "btn btn-warning pull-right margin-right-30",

                inputNameClass: "form-group",
                inputNameChange: "changeFolderName",

                inputSelectClass: "form-group",

                filterSet: {},
                currentFilter: {},
                ruleId: "",
                fieldMatch: "emailM",
                fieldText: "",
                destination: 0,

                ruleForm: {}
            };
        },

        /**
         *
         * @returns {Array}
         */
        getFilter: function (callback) {
            var alEm = [];
            var thisComp = this;

            //apicall to get all records

            app.serverCall.ajaxRequest("getBlockedEmails", {}, function (result) {
                if (result["response"] == "success") {
                    thisComp.setState({ currentFilter: result["data"] });
                    $.each(result["data"], function (index, fRule) {
                        var match = "<span>" + (fRule["mF"] == "1" ? "Email Matching" : fRule["mF"] == "2" ? "Email Not matching" : fRule["mF"] == "3" ? "Domain Matching" : "Domain Not Matching") + "</span> ";

                        var text = '<span>"<b>' + app.transform.escapeTags(app.transform.from64str(fRule["txt"])) + '</b>"</span> ';
                        var to = "<span><b>" + (fRule["dest"] === 0 ? "Dropped" : "Accepted") + "</b></span>";
                        var el = {
                            DT_RowId: index,
                            checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                            text: {
                                display: "Sender`s " + match + text + "<span>will be </span> " + to,
                                index: index
                            },
                            delete: '<button class="table-icon delete-button"></button>',
                            options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                        };

                        alEm.push(el);

                        //console.log(emailData);
                    });
                    if (callback) callback(alEm);
                }
            });

            //console.log(alEm);

            //this.setState({filterSet:alEm});
        },

        componentDidMount: function () {
            this.getFilter(function (dtSet) {
                require(["dataTable", "dataTableBoot"], function (DataTable, dataTableBoot) {
                    $("#table1").dataTable({
                        dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                        data: dtSet,
                        columns: [{ data: "checkbox" }, {
                            data: {
                                _: "text.display",
                                sort: "text.index"
                            }
                        }, { data: "delete" }, { data: "options" }],
                        columnDefs: [{ orderDataType: "data-sort", targets: 1 }, {
                            sClass: "data-cols type_full col-content-width",
                            targets: [1]
                        }, { sClass: "col-options-width", targets: [0, -1] }, { sClass: "col-mobile-hide", targets: [2] }],
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
            });

            //	this.handleClick("addFilterRule");

            this.setState({ ruleForm: $("#addRuleForm").validate() });

            $("#textField").rules("add", {
                required: true,
                minlength: 1,
                maxlength: 255
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
                case "changeMatch":
                    this.setState({ fieldMatch: event.target.value });
                    break;

                case "changeText":
                    this.setState({ fieldText: event.target.value });
                    break;
                case "changeDestination":
                    this.setState({ destination: event.target.value });
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
                case "showFirst":
                    this.setState({
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",

                        firstTab: "active",
                        secondTab: "",

                        button1class: "btn btn-primary pull-right",
                        button2class: "btn btn-warning pull-right margin-right-30",

                        secondPanelText: "Add Rule",

                        ruleId: "",
                        fieldMatch: "emailM",
                        fieldText: "",
                        destination: 0
                    });

                    var validator = this.state.ruleForm;
                    validator.form();

                    $("#textField").removeClass("invalid");
                    $("#textField").removeClass("valid");

                    validator.resetForm();

                    break;

                case "clearFilterRules":
                    var thisComp = this;

                    app.serverCall.ajaxRequest("deleteAllBlockedEmails", {}, function (result) {
                        if (result["response"] == "success") {
                            thisComp.getFilter(function (filter) {
                                thisComp.setState({ filterSet: filter });
                                thisComp.handleClick("showFirst");
                            });
                            app.notifications.systemMessage("saved");
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

                                secondPanelText: "Add Rule",

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
                        console.log(thisComp.state.ruleId);
                        console.log(thisComp.state.fieldMatch);
                        console.log(thisComp.state.fieldText);
                        console.log(thisComp.state.destination);

                        var post = {
                            ruleId: thisComp.state.ruleId,
                            matchField: thisComp.state.fieldMatch,
                            text: thisComp.state.fieldText,
                            destination: thisComp.state.destination
                        };

                        app.serverCall.ajaxRequest("saveBlockedEmails", post, function (result) {
                            if (result["response"] == "success") {
                                thisComp.getFilter(function (filter) {
                                    thisComp.setState({
                                        filterSet: filter
                                    });
                                    thisComp.handleClick("showFirst");
                                });
                                app.notifications.systemMessage("saved");
                            }
                        });
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    }

                    break;

                case "editRule":
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
                        fieldMatch: this.state.currentFilter[id]["mF"] === 1 ? "emailM" : this.state.currentFilter[id]["mF"] === 3 ? "domainM" : "domainNM",
                        fieldText: app.transform.from64str(this.state.currentFilter[id]["txt"]),
                        destination: this.state.currentFilter[id]["dest"]
                    });

                    break;

                case "deleteRule":
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

                    // var id = $(event.target).parents("tr").attr("id");
                    // if (id != undefined) {
                    //     this.handleClick("editRule", id);
                    // }

                    break;
            }
        },

        deleteRule: function (id) {
            $("#settings-spinner").removeClass("d-none").addClass("d-block");
            var thisComp = this;

            var post = {
                ruleId: id
            };

            app.serverCall.ajaxRequest("deleteBlockedEmails", post, function (result) {
                if (result["response"] == "success") {
                    thisComp.getFilter(function (filter) {
                        thisComp.setState({ filterSet: filter });
                        thisComp.handleClick("showFirst");
                    });
                    app.notifications.systemMessage("saved");
                }
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
                    { className: "setting-middle blacklist-whitelist" },
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
                                        "Blacklist / Whitelist"
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
                                    "Blacklist / Whitelist"
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
                                                className: this.state.button1class,
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
                                                null,
                                                "Filters"
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
                                "p",
                                { className: `f12` },
                                "Sender will be sorted if:"
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
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputSelectClass
                                                },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-control",
                                                        id: "matchField",
                                                        onChange: this.handleChange.bind(this, "changeMatch"),
                                                        value: this.state.fieldMatch
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        { value: "domainM" },
                                                        "Domain Match"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "emailM" },
                                                        "Email Match"
                                                    )
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
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
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputSelectClass
                                                },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-control",
                                                        id: "destinationField",
                                                        onChange: this.handleChange.bind(this, "changeDestination"),
                                                        value: this.state.destination
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        { value: "0" },
                                                        "Drop"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "1" },
                                                        "Accept"
                                                    )
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
                                "Blacklist"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Will be saved on server, any email coming from outside of our server will be screened before reaching your email box. You can choose either to accept or drop email based on sender's email address or domain."
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Email address is always has higher priority, than domain, i.e if you create rule to drop any email originated from ",
                                React.createElement(
                                    "b",
                                    null,
                                    "yahoo.com"
                                ),
                                ", but second rule will accept email from:",
                                " ",
                                React.createElement(
                                    "b",
                                    null,
                                    "'IamNigerianPrince@yahoo.com'"
                                ),
                                " - it will drop any emails originated from yahoo.com, except coming from",
                                " ",
                                React.createElement(
                                    "b",
                                    null,
                                    "'IamNigerianPrince@yahoo.com'"
                                ),
                                "."
                            ),
                            React.createElement(
                                "p",
                                null,
                                "This is ",
                                React.createElement(
                                    "b",
                                    null,
                                    "unencrypted list"
                                ),
                                " of rules accessible by our server, in order to prevent mass spam attack of your email address. This list will be scanned time to time and domains having very high spam rating will be added to our universal spam filter."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Note."
                            ),
                            React.createElement(
                                "p",
                                null,
                                "This filter is not applicable to emails originated from our server. Please use 'Email Filter' to screen those emails."
                            )
                        )
                    )
                )
            );
        }
    });
});