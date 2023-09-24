define([
    "react",
    "app",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, RightTop) {
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

                ruleForm: {},
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

            app.serverCall.ajaxRequest(
                "getBlockedEmails",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        thisComp.setState({ currentFilter: result["data"] });
                        $.each(result["data"], function (index, fRule) {
                            var match =
                                "<span>" +
                                (fRule["mF"] == "1"
                                    ? "Email Matching"
                                    : fRule["mF"] == "2"
                                    ? "Email Not matching"
                                    : fRule["mF"] == "3"
                                    ? "Domain Matching"
                                    : "Domain Not Matching") +
                                "</span> ";

                            var text =
                                '<span>"<b>' +
                                app.transform.escapeTags(
                                    app.transform.from64str(fRule["txt"])
                                ) +
                                '</b>"</span> ';
                            var to =
                                "<span><b>" +
                                (fRule["dest"] === 0 ? "Dropped" : "Accepted") +
                                "</b></span>";
                            var el = {
                                DT_RowId: index,
                                checkbox:
                                    '<label class="container-checkbox d-none"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                                text: {
                                    display:
                                        "Sender`s " +
                                        match +
                                        text +
                                        "<span>will be </span> " +
                                        to,
                                    index: index,
                                },
                                delete: '<button class="table-icon delete-button"></button>',
                                options:
                                    '<div class="dropdown d-none"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
                            };

                            alEm.push(el);

                            //console.log(emailData);
                        });
                        if (callback) callback(alEm);
                    }
                }
            );

            //console.log(alEm);

            //this.setState({filterSet:alEm});
        },

        componentDidMount: function () {
            this.getFilter(function (dtSet) {
                require([
                    "dataTable",
                    "dataTableBoot",
                ], function (DataTable, dataTableBoot) {
                    $("#table1").dataTable({
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
                            { sClass: "col-mobile-hide", targets: [2] },
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
            });

            //	this.handleClick("addFilterRule");

            this.setState({ ruleForm: $("#addRuleForm").validate() });

            $("#textField").rules("add", {
                required: true,
                minlength: 1,
                maxlength: 255,
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
                        button2class:
                            "btn btn-warning pull-right margin-right-30",

                        secondPanelText: "Add Rule",

                        ruleId: "",
                        fieldMatch: "emailM",
                        fieldText: "",
                        destination: 0,
                    });

                    var validator = this.state.ruleForm;
                    validator.form();

                    $("#textField").removeClass("invalid");
                    $("#textField").removeClass("valid");

                    validator.resetForm();

                    break;

                case "clearFilterRules":
                    var thisComp = this;

                    app.serverCall.ajaxRequest(
                        "deleteAllBlockedEmails",
                        {},
                        function (result) {
                            if (result["response"] == "success") {
                                thisComp.getFilter(function (filter) {
                                    thisComp.setState({ filterSet: filter });
                                    thisComp.handleClick("showFirst");
                                });
                                app.notifications.systemMessage("saved");
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

                                    secondPanelText: "Add Rule",

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
                        console.log(thisComp.state.ruleId);
                        console.log(thisComp.state.fieldMatch);
                        console.log(thisComp.state.fieldText);
                        console.log(thisComp.state.destination);

                        var post = {
                            ruleId: thisComp.state.ruleId,
                            matchField: thisComp.state.fieldMatch,
                            text: thisComp.state.fieldText,
                            destination: thisComp.state.destination,
                        };

                        app.serverCall.ajaxRequest(
                            "saveBlockedEmails",
                            post,
                            function (result) {
                                if (result["response"] == "success") {
                                    thisComp.getFilter(function (filter) {
                                        thisComp.setState({
                                            filterSet: filter,
                                        });
                                        thisComp.handleClick("showFirst");
                                    });
                                    app.notifications.systemMessage("saved");
                                }
                            }
                        );
                        $("#settings-spinner")
                            .removeClass("d-block")
                            .addClass("d-none");
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
                        fieldMatch:
                            this.state.currentFilter[id]["mF"] === 1
                                ? "emailM"
                                : this.state.currentFilter[id]["mF"] === 3
                                ? "domainM"
                                : "domainNM",
                        fieldText: app.transform.from64str(
                            this.state.currentFilter[id]["txt"]
                        ),
                        destination: this.state.currentFilter[id]["dest"],
                    });

                    break;

                case "deleteRule":
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
                ruleId: id,
            };

            app.serverCall.ajaxRequest(
                "deleteBlockedEmails",
                post,
                function (result) {
                    if (result["response"] == "success") {
                        thisComp.getFilter(function (filter) {
                            thisComp.setState({ filterSet: filter });
                            thisComp.handleClick("showFirst");
                        });
                        app.notifications.systemMessage("saved");
                    }
                }
            );
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
                    <div className="setting-middle blacklist-whitelist">
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
                                            Blacklist / Whitelist
                                        </a>
                                    </li>
                                    <li>{this.state.secondPanelText}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="middle-content">
                            <div
                                className={`table-row ${this.state.firstPanelClass}`}
                            >
                                <div className="middle-content-top">
                                    <h3>Blacklist / Whitelist</h3>
                                    <div className="middle-content-top-right">
                                        <div className="add-contact-btn">
                                            <a
                                                className={
                                                    this.state.button1class
                                                }
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "addFilterRule"
                                                )}
                                            >
                                                <span className="icon">+</span>
                                                Add Rule
                                            </a>
                                            {/* <a
                                                className={
                                                    this.state.button2class
                                                }
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "clearFilterRules"
                                                )}
                                            >
                                                Remove All Rules
                                            </a> */}
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
                                                <th>Filters</th>
                                                <th scope="col">
                                                    <button className="trash-btn d-none"></button>
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

                            <div className={this.state.secondPanelClass}>
                                <div className="middle-content-top">
                                    <h3>{this.state.secondPanelText}</h3>
                                </div>

                                <p className={`f12`}>
                                    Sender will be sorted if:
                                </p>
                                <div className="form-section">
                                    <form id="addRuleForm" className="">
                                        <div className="row">
                                            <div className="col-12">
                                                <div
                                                    className={
                                                        this.state
                                                            .inputSelectClass
                                                    }
                                                >
                                                    <select
                                                        className="form-control"
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
                                                        <option value="domainM">
                                                            Domain Match
                                                        </option>
                                                        {
                                                            //<option value="domainNM">Domain Not Matched</option>
                                                        }
                                                        <option value="emailM">
                                                            Email Match
                                                        </option>
                                                        {
                                                            //  <option value="emailNM">Email Not Matched</option>
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
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
                                            <div className="col-12">
                                                <div
                                                    className={
                                                        this.state
                                                            .inputSelectClass
                                                    }
                                                >
                                                    <select
                                                        className="form-control"
                                                        id="destinationField"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeDestination"
                                                        )}
                                                        value={
                                                            this.state
                                                                .destination
                                                        }
                                                    >
                                                        <option value="0">
                                                            Drop
                                                        </option>
                                                        <option value="1">
                                                            Accept
                                                        </option>
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
                                <h3>Blacklist</h3>
                                <p>
                                    Will be saved on server, any email coming
                                    from outside of our server will be screened
                                    before reaching your email box. You can
                                    choose either to accept or drop email based
                                    on sender's email address or domain.
                                </p>
                                <p>
                                    Email address is always has higher priority,
                                    than domain, i.e if you create rule to drop
                                    any email originated from <b>yahoo.com</b>,
                                    but second rule will accept email from:{" "}
                                    <b>'IamNigerianPrince@yahoo.com'</b> - it
                                    will drop any emails originated from
                                    yahoo.com, except coming from{" "}
                                    <b>'IamNigerianPrince@yahoo.com'</b>.
                                </p>
                                <p>
                                    This is <b>unencrypted list</b> of rules
                                    accessible by our server, in order to
                                    prevent mass spam attack of your email
                                    address. This list will be scanned time to
                                    time and domains having very high spam
                                    rating will be added to our universal spam
                                    filter.
                                </p>
                                <h3>Note.</h3>
                                <p>
                                    This filter is not applicable to emails
                                    originated from our server. Please use
                                    'Email Filter' to screen those emails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
