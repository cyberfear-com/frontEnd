define([
    "react",
    "app",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, RightTop) {
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

                ruleForm: {},
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
                var folderName =
                    folder != undefined
                        ? app.transform.from64str(folder["name"])
                        : "Inbox";
                //var folderName='Inbox';
                var from =
                    "<span><b>" +
                    (fRule["field"] == "rcpt"
                        ? "recipient"
                        : fRule["field"] == "sender"
                        ? "sender"
                        : fRule["field"] == "subject"
                        ? "subject"
                        : "") +
                    "</b></span> ";
                var match =
                    "<span>" +
                    (fRule["match"] == "strict"
                        ? "match"
                        : fRule["match"] == "relaxed"
                        ? "contains"
                        : "not contain") +
                    "</span> ";
                var text =
                    '<span>"<b>' +
                    app.transform.escapeTags(
                        app.transform.from64str(fRule["text"])
                    ) +
                    '</b>"</span> ';
                var to =
                    "<span><b>" +
                    app.transform.escapeTags(folderName) +
                    "</b></span>";
                var el = {
                    DT_RowId: index,
                    checkbox:
                        '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                    text: {
                        display:
                            from +
                            match +
                            text +
                            "<span>will be moved to </span> " +
                            to,
                        index: index,
                    },
                    edit: '<a class="table-icon edit-button"></a>',
                    delete: '<button class="table-icon delete-button"></button>',
                    options:
                        '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
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
                options.push(
                    <option key={index} value={index}>
                        {app.transform.from64str(folder["name"])}
                    </option>
                );
            });
            return options;
        },

        componentDidMount: function () {
            var dtSet = this.getFilter();

            require(["dataTable", "dataTableBoot"], function (
                DataTable,
                dataTableBoot
            ) {
                $("#table1").dataTable({
                    responsive: true,
                    dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                    data: dtSet,
                    columns: [
                        { data: "checkbox" },
                        {
                            data: {
                                _: "text.display",
                                sort: "text.index",
                            },
                        },
                        { data: "edit" },
                        { data: "delete" },
                        { data: "options" },
                    ],
                    columnDefs: [
                        { orderDataType: "data-sort", targets: 1 },
                        {
                            sClass: "data-cols type_full col-content-width",
                            targets: [1],
                        },
                        { sClass: "col-options-width", targets: [0, -1] },
                        { sClass: "col-mobile-hide", targets: [2, 3] },
                    ],
                    order: [[1, "asc"]],
                    language: {
                        emptyTable: "Empty",
                        sSearch: "",
                        searchPlaceholder: "Find something...",
                        info: "Showing _START_ - _END_ of _TOTAL_ result",
                        paginate: {
                            sPrevious: "<i class='fa fa-chevron-left'></i>",
                            sNext: "<i class='fa fa-chevron-right'></i>",
                        },
                    },
                });
            });
            //	this.handleClick("addFilterRule");

            this.setState({ ruleForm: $("#addRuleForm").validate() });

            $("#textField").rules("add", {
                required: true,
                minlength: 3,
                maxlength: 90,
            });

            $("#destinationField").rules("add", {
                required: true,
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
                case "showFirst":
                    this.setState({
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",

                        firstTab: "active",
                        secondTab: "",

                        button1class: "btn btn-primary pull-right",
                        button2class:
                            "btn btn-warning pull-right margin-right-30",

                        secondPanelText: "Add new Email filter",

                        ruleId: "",
                        fieldFrom: "sender",
                        fieldMatch: "strict",
                        fieldText: "",
                        fieldFolder: "1",
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

                    app.userObjects.updateObjects(
                        "saveFilter",
                        "",
                        function (result) {
                            if (result == "saved") {
                                thisComp.setState({
                                    filterSet: thisComp.getFilter(),
                                });
                                thisComp.handleClick("showFirst");
                                app.notifications.systemMessage("saved");
                            } else if (result == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (result == "nothingUpdt") {
                                app.notifications.systemMessage(
                                    "nthTochngORexst"
                                );
                            }
                        }
                    );

                    break;
                case "addFilterRule":
                    var thisComp = this;
                    app.globalF.checkPlanLimits(
                        "filter",
                        Object.keys(app.user.get("filter")).length,
                        function (result) {
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
                                    button2class: "d-none",
                                });
                            }
                        }
                    );

                    break;
                case "saveRule":
                    var validator = this.state.ruleForm;

                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#settings-spinner")
                            .removeClass("d-none")
                            .addClass("d-block");
                        var id = thisComp.state.ruleId;
                        var from = thisComp.state.fieldFrom;
                        var match = thisComp.state.fieldMatch;
                        var folder = thisComp.state.fieldFolder;
                        var text = thisComp.state.fieldText;

                        app.globalF.createFilterRule(
                            id,
                            from,
                            match,
                            folder,
                            text,
                            function () {
                                app.userObjects.updateObjects(
                                    "saveFilter",
                                    "",
                                    function (result) {
                                        if (result == "saved") {
                                            thisComp.setState({
                                                filterSet: thisComp.getFilter(),
                                            });
                                            thisComp.handleClick("showFirst");
                                            app.notifications.systemMessage(
                                                "saved"
                                            );
                                        } else if (result == "newerFound") {
                                            app.notifications.systemMessage(
                                                "newerFnd"
                                            );
                                        } else if (result == "nothingUpdt") {
                                            app.notifications.systemMessage(
                                                "nthTochngORexst"
                                            );
                                        }
                                    }
                                );

                                //thisComp.setState({filterSet:thisComp.getFilter()});
                                //thisComp.handleClick("showFirst");
                            }
                        );
                        $("#settings-spinner")
                            .removeClass("d-block")
                            .addClass("d-none");
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
                        fieldFolder: filter[id]["to"],
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
                                ruleId: id,
                            });
                            thisComp.handleClick("editRule", id);
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
                                    ruleId: id,
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
                        filterSet: thisComp.getFilter(),
                    });
                    thisComp.handleClick("showFirst");
                } else if (result == "newerFound") {
                }
            });
            $("#settings-spinner").removeClass("d-block").addClass("d-none");
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (
                JSON.stringify(nextState.filterSet) !==
                JSON.stringify(this.state.filterSet)
            ) {
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
         */
        render: function () {
            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle email-filters">
                        <div className="middle-top">
                            <div
                                className={`arrow-back ${
                                    this.state.secondTab === "bingo"
                                        ? ""
                                        : "d-none"
                                }`}
                            >
                                <a
                                    onClick={this.handleClick.bind(
                                        this,
                                        "showFirst"
                                    )}
                                ></a>
                            </div>
                            <h2>Mailbox</h2>
                            <div
                                className={`bread-crumb  ${
                                    this.state.secondTab === "bingo"
                                        ? ""
                                        : "d-none"
                                }`}
                            >
                                <ul>
                                    <li>
                                        <a
                                            onClick={this.handleClick.bind(
                                                this,
                                                "showFirst"
                                            )}
                                        >
                                            Email filter
                                        </a>
                                    </li>
                                    <li>{this.state.secondPanelText}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="middle-content">
                            {/* <div className="panel-heading">
                                <button
                                    type="button"
                                    className={this.state.button2class}
                                    onClick={this.handleClick.bind(
                                        this,
                                        "clearFilterRules"
                                    )}
                                >
                                    {" "}
                                    Remove All Rules
                                </button>
                            </div> */}

                            <div
                                className={`table-row ${this.state.firstPanelClass}`}
                            >
                                <div className="middle-content-top">
                                    <h3>Email filters</h3>
                                    <div className="middle-content-top-right">
                                        <div className="add-contact-btn">
                                            <a
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "addFilterRule"
                                                )}
                                            >
                                                <span className="icon">+</span>
                                                Add Rule
                                            </a>
                                        </div>
                                    </div>
                                </div>
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
                                                <th scope="col">Filters</th>
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

                            <div className={this.state.secondPanelClass}>
                                <div className="middle-content-top">
                                    <h3>{this.state.secondPanelText}</h3>
                                </div>

                                <div className="form-section">
                                    <form id="addRuleForm" className="">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div
                                                    className={
                                                        this.state
                                                            .inputSelectClass
                                                    }
                                                >
                                                    <select
                                                        className="form-select"
                                                        id="fromField"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeFrom"
                                                        )}
                                                        value={
                                                            this.state.fieldFrom
                                                        }
                                                    >
                                                        <option value="sender">
                                                            From
                                                        </option>
                                                        <option value="rcpt">
                                                            To
                                                        </option>
                                                        <option value="subject">
                                                            Subject
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div
                                                    className={
                                                        this.state
                                                            .inputSelectClass
                                                    }
                                                >
                                                    <select
                                                        className="form-select"
                                                        id="matchField"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeMatch"
                                                        )}
                                                        value={
                                                            this.state
                                                                .fieldMatch
                                                        }
                                                    >
                                                        <option value="relaxed">
                                                            Contains
                                                        </option>
                                                        <option value="negative">
                                                            Does not Contain
                                                        </option>
                                                        <option value="strict">
                                                            match
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div
                                                    className={
                                                        this.state
                                                            .inputSelectClass
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        name="fromName"
                                                        className="form-control"
                                                        id="textField"
                                                        placeholder="text"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeText"
                                                        )}
                                                        value={
                                                            this.state.fieldText
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div
                                                    className={
                                                        this.state
                                                            .inputSelectClass
                                                    }
                                                >
                                                    <select
                                                        className="form-select"
                                                        defaultValue="0"
                                                        id="destinationField"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeDestination"
                                                        )}
                                                        value={
                                                            this.state
                                                                .fieldFolder
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            Move To
                                                        </option>

                                                        {this.getFolders()}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-section-bottom">
                                            <div className="delete-item">
                                                <button
                                                    type="button"
                                                    className={
                                                        this.state
                                                            .deleteButtonClass
                                                    }
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "deleteRule"
                                                    )}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="btn-row">
                                                <button
                                                    type="button"
                                                    className="btn-border fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "showFirst"
                                                    )}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-blue fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "saveRule"
                                                    )}
                                                >
                                                    {this.state.saveButtonText}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-right email-filters">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>

                            <div className="panel-body">
                                <h3>Email Filter</h3>
                                <p>
                                    Creating an email filter requires 4 pieces
                                    of information:
                                </p>
                                <div className="bullets">
                                    <ul>
                                        <li>
                                            {" "}
                                            The From: To: or Subject: to match
                                        </li>
                                        <li>
                                            {" "}
                                            Select if the rule applies when the
                                            text in the next box is matched, not
                                            matched, or is an exact match.
                                        </li>
                                        <li> The text being matched</li>
                                        <li>
                                            {" "}
                                            Select where the email should be
                                            delivered (inbox or a folder)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p>
                                If you like Once you are done, click the Add
                                button to create the email filter.
                            </p>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
