define(["react", "app", "dataTable", "dataTableBoot", "cmpld/authorized/settings/rightpanel/rightTop", "irojs"], function (React, app, DataTable, dataTableBoot, RightTop, IroJs) {
    "use strict";

    return React.createClass({
        getInitialState: function () {
            return {
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body d-none",
                thirdPanelClass: "panel-body d-none",

                secondPanelText: "Add Folder",

                firstTab: "active",
                secondTab: "",

                button1Click: "addFolder",
                button1enabled: true,
                button1text: "Add Folder",
                button1visible: "",

                button3Click: "addLabel",
                button3enabled: true,
                button3text: "Add Label",
                button3visible: "d-none",

                folderSet: {},
                tagsSet: {},

                inputSelectClass: "form-group",
                inputSelectOnchange: "changeFolderExpiration",
                nameField: "",
                expireFolder: "",
                labelField: "",
                labelColor: "",
                folderColor: "",

                nameForm: {},
                folderId: ""
            };
        },
        /**
         *
         * @returns {Array}
         */
        getFolders: function () {
            var alEm = [];
            var dates = {
                "-1": "Never",
                1: "1 day",
                7: "1 week",
                30: "1 month",
                180: "6 months",
                365: "1 year"
            };

            $.each(app.user.get("folders"), function (index, data) {
                // { data: "checkbox" },
                //     {
                //         data: {
                //             _: "folder.display",
                //             sort: "folder.display",
                //         },
                //     },
                //     { data: "isMain" },
                //     { data: "expire" },
                //     { data: "delete" },
                //     { data: "options" },
                var el = {
                    DT_RowId: index,
                    checkbox: '<label class="container-checkbox"><input type="checkbox" /><span class="checkmark"></span></label>',
                    folder: {
                        display: data["isMain"] ? "<b>" + app.transform.escapeTags(app.transform.from64str(data["name"])) + "</b>" : app.transform.escapeTags(app.transform.from64str(data["name"]))
                    },
                    isMain: data["isMain"] ? "1" : "0",
                    expire: dates[data["exp"]],
                    delete: '<button class="table-icon delete-button"></button>',
                    options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                };
                alEm.push(el);
            });
            this.setState({ folderSet: alEm });
            //	console.log(alEm);
            return alEm;
        },

        /**
         *
         * @returns {Array}
         */
        getTags: function () {
            var alEm = [];

            $.each(app.user.get("tags"), function (label64, data64) {
                // { data: "checkbox" },
                //     { data: "label" },
                //     { data: "edit" },
                //     { data: "delete" },
                //     { data: "options" },
                var el = {
                    DT_RowId: label64,
                    checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                    label: app.transform.escapeTags(app.transform.from64str(label64)),
                    // edit: '<button class="disposed-button"></button>',
                    delete: '<button class="table-icon delete-button"></button>',
                    options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                };
                alEm.push(el);
            });
            this.setState({ tagsSet: alEm });
            //	console.log(alEm);
            return alEm;
        },

        componentDidMount: function () {
            var folderSet = this.getFolders();
            //console.log(folderSet);
            var tagSet = this.getTags();

            var thisComp = this;

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: folderSet,
                responsive: true,
                columns: [{ data: "checkbox" }, {
                    data: {
                        _: "folder.display",
                        sort: "folder.display"
                    }
                }, { data: "isMain" }, { data: "expire" }, { data: "delete" }, { data: "options" }],
                columnDefs: [{ sClass: "d-none", targets: [2] }, {
                    sClass: "data-cols col-content-width_one_half",
                    targets: [1, 3]
                }, { sClass: "col-options-width", targets: [0, -1] }, { sClass: "col-mobile-hide", targets: [4] }, { bSortable: false, aTargets: [2, 3] }, { orderDataType: "data-sort", targets: 0 }, {
                    responsivePriority: 1,
                    targets: 1
                }, { responsivePriority: 2, targets: 5 }],
                order: [[1, "desc"]],
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

            $("#table2").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: tagSet,
                columns: [{ data: "checkbox" }, { data: "label" },
                // { data: "edit" },
                { data: "delete" }, { data: "options" }],
                columnDefs: [{ sClass: "data-cols", targets: [1] }, { bSortable: false, aTargets: [1] }, { orderDataType: "data-sort", targets: 0 }],
                order: [[1, "desc"]],
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

            this.setState({ nameForm: $("#addNewFolderForm").validate() });

            $.validator.addMethod("uniqueFolderName", function (value, element) {
                console.log(thisComp.state.secondPanelText);

                var isSuccess = true;

                var folders = app.user.get("folders");

                if (thisComp.state.secondPanelText == "Add Folder") {
                    var seed = app.transform.to64str(thisComp.state.nameField);

                    $.each(folders, function (fldIndex, fldData) {
                        if (fldData["name"] == seed) {
                            isSuccess = false;
                        }
                    });
                }

                if (isSuccess) {
                    return true;
                } else {
                    return false;
                }

                //return true;
            }, "Folder Already Exist");

            $.validator.addMethod("uniqueLabelName", function (value, element) {
                var isSuccess = true;

                var tags = app.user.get("tags");

                var seed = app.transform.to64str(thisComp.state.labelField);
                console.log(seed);

                $.each(tags, function (tagIndex, tagData) {
                    if (tagIndex == seed) {
                        isSuccess = false;
                    }
                });

                if (isSuccess) {
                    return true;
                } else {
                    return false;
                }
            }, "Label Already Exist");

            $("#folderName").rules("add", {
                required: true,
                minlength: 3,
                maxlength: 90,
                uniqueFolderName: true
            });

            $("#labelName").rules("add", {
                required: true,
                minlength: 3,
                maxlength: 90,
                uniqueLabelName: true
            });

            $("#expireFold").rules("add", {
                required: true
            });

            // Add color picker
            var colorPicker = new IroJs.ColorPicker("#labelColourDiv", {
                width: 135
            });
            colorPicker.on(["color:init", "color:change"], function (color) {
                try {
                    document.getElementById("labelColour").value = color.hexString;
                    thisComp.setState({ labelColor: `${ color.hexString }` });
                } catch (e) {
                    console.log(e);
                }
            });

            var colorPicker = new IroJs.ColorPicker("#folderColourDiv", {
                width: 135
            });
            colorPicker.on(["color:init", "color:change"], function (color) {
                try {
                    document.getElementById("folderColour").value = color.hexString;
                    thisComp.setState({ folderColor: `${ color.hexString }` });
                } catch (e) {
                    console.log(e);
                }
            });
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (JSON.stringify(nextState.folderSet) !== JSON.stringify(this.state.folderSet)) {
                var t = $("#table1").DataTable();
                t.clear();
                var folders = nextState.folderSet;
                t.rows.add(folders);
                t.draw(false);
            }

            if (JSON.stringify(nextState.tagsSet) !== JSON.stringify(this.state.tagsSet)) {
                var t = $("#table2").DataTable();
                t.clear();
                var tags = nextState.tagsSet;
                t.rows.add(tags);
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
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body d-none",

                        firstTab: "active",
                        secondTab: "",

                        button1Click: "addFolder",
                        button1enabled: true,
                        button1text: "Add Folder",
                        button1visible: "",

                        button3Click: "addDisposable",
                        button3enabled: true,
                        button3text: "Add Disposable",
                        button3visible: "d-none",

                        folderId: "",
                        nameField: "",
                        expireFolder: 0,

                        deleteFolderClass: "d-none"
                    });

                    var validator = this.state.nameForm;
                    validator.form();

                    $("#folderName").removeClass("invalid");
                    $("#folderName").removeClass("valid");

                    $("#expireFold").removeClass("invalid");
                    $("#expireFold").removeClass("valid");

                    validator.resetForm();

                    break;

                case "showSecond":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body",

                        firstTab: "",
                        secondTab: "active",

                        button1Click: "addFolder",
                        button1enabled: true,
                        button1text: "Add Folder",
                        button1visible: "d-none",

                        button3Click: "addLabel",
                        button3enabled: true,
                        button3text: "Add Label",
                        button3visible: "",

                        labelField: ""
                    });

                    var validator = this.state.nameForm;
                    validator.form();

                    $("#labelName").removeClass("invalid");
                    $("#labelName").removeClass("valid");

                    validator.resetForm();

                    break;

                case "addFolder":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body",
                        thirdPanelClass: "panel-body d-none",

                        firstTab: "active",
                        secondTab: "",

                        secondPanelText: "Add Folder",

                        inputNameClass: "form-group col-xs-12 col-sm-6 col-lg-7",
                        inputNameOnchange: "changeFolderName",
                        inputSelectClass: "form-group col-xs-12 col-sm-6 col-lg-5",
                        inputSelectOnchange: "changeFolderExpiration",

                        inputLabelClass: "d-none",

                        button1text: "Add Folder",
                        button1enabled: true,
                        button1onClick: "addFolder",
                        button1class: "btn btn-primary pull-right d-none",
                        button1visible: "d-none",

                        button4Click: "showFirst",

                        button5Click: "saveNewFolder",
                        button5text: "Add",

                        nameField: "",
                        expireFolder: "-1",
                        deleteFolderClass: "d-none"

                    });
                    break;

                case "addLabel":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body",
                        thirdPanelClass: "panel-body d-none",

                        firstTab: "",
                        secondTab: "active",
                        secondPanelText: "Add Label",

                        inputNameClass: "d-none",
                        inputNameOnchange: "changeLabelName",

                        inputLabelClass: "form-group",

                        inputSelectClass: "d-none",
                        inputSelectOnchange: "",
                        button4Click: "showSecond",

                        button5Click: "saveNewLabel",
                        button5text: "Add",
                        deleteFolderClass: "d-none"

                    });
                    break;

                case "saveEditFolder":
                    //button5text

                    var validator = this.state.nameForm;

                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        var folders = app.user.get("folders");
                        var fId = thisComp.state.folderId;
                        folders[fId]["name"] = app.transform.to64str(this.state.nameField);
                        folders[fId]["exp"] = this.state.expireFolder;

                        app.userObjects.updateObjects("folderSettings", "", function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.setState({
                                        folderSet: thisComp.getFolders()
                                    });
                                    thisComp.handleClick("showFirst");
                                } else if (result["data"] == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                    thisComp.handleClick("showFirst");
                                }
                            }
                        });
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    }

                    break;

                case "saveNewFolder":
                    var validator = this.state.nameForm;

                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        var folderId = app.globalF.createFolderIndex();
                        var folders = app.user.get("folders");
                        folders[folderId] = {
                            name: app.transform.to64str(this.state.nameField),
                            exp: this.state.expireFolder,
                            isMain: false,
                            color: this.state.folderColor
                        };

                        var emails = app.user.get("emails")["folders"];
                        emails[folderId] = {};

                        app.userObjects.updateObjects("folderSettings", "", function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.setState({
                                        folderSet: thisComp.getFolders()
                                    });
                                    thisComp.handleClick("showFirst");
                                } else if (result["data"] == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                    thisComp.handleClick("showFirst");
                                }
                            }
                        });
                        $("#settings-spinner").removeClass("d-block").addClass("d-none");
                    }

                    break;

                case "saveNewLabel":
                    var validator = this.state.nameForm;

                    validator.form();

                    var thisComp = this;

                    var tags = app.user.get("tags");

                    if (validator.numberOfInvalids() == 0) {
                        tags[app.transform.to64str(this.state.labelField)] = {
                            color: this.state.labelColor
                        };
                        // console.log(tags);

                        app.userObjects.updateObjects("labelSettings", "", function (result) {
                            if (result == "saved") {
                                thisComp.setState({
                                    getTags: thisComp.getTags()
                                });
                                thisComp.handleClick("showSecond");
                            } else if (result == "newerFound") {
                                //app.notifications.systemMessage('newerFnd');
                                thisComp.handleClick("showFirst");
                            }
                        });
                    }

                    break;

                case "handleSelectAll":
                    // get parent table id
                    var parentTableId = $(event.target).parents("table").attr("id");
                    if (parentTableId != undefined) {
                        if (event.target.checked) {
                            $(`#${ parentTableId }`).find(".container-checkbox input").prop("checked", true);
                            $(`#${ parentTableId }`).find("tr").addClass("selected");
                        } else {
                            $(`#${ parentTableId }`).find(".container-checkbox input").prop("checked", false);
                            $(`#${ parentTableId }`).find("tr").removeClass("selected");
                        }
                    }

                    break;

                case "selectRowTab1":
                    var thisComp = this;
                    if ($(event.target).prop("tagName").toUpperCase() === "INPUT") {
                        if (event.target.checked) {
                            $(event.target).closest("tr").addClass("selected");
                        } else {
                            $(event.target).closest("tr").removeClass("selected");
                        }
                    }

                    // Edit click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "B") {
                        var id = $(event.target).parents("tr").attr("id");

                        if (id != undefined) {
                            thisComp.setState({
                                folderId: id
                            });
                            thisComp.handleClick("editFolder", id);
                        }
                    }
                    // Delete click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "BUTTON") {
                        if (event.target.classList.contains("delete-button")) {
                            var id = $(event.target).parents("tr").attr("id");

                            if (id != undefined) {
                                thisComp.setState({
                                    folderId: id
                                });
                                thisComp.deleteFolder(id);
                            }
                        }
                    }

                    break;

                case "deleteLabel":
                    app.userObjects.updateObjects("labelSettings", "", function (result) {
                        if (result == "saved") {
                            thisComp.setState({
                                getTags: thisComp.getTags()
                            });
                            thisComp.handleClick("showSecond");
                        } else if (result == "newerFound") {
                            //app.notifications.systemMessage('newerFnd');
                            thisComp.handleClick("showFirst");
                        }
                    });

                    break;

                case "selectRowTab2":
                    var thisComp = this;
                    var tags = app.user.get("tags");
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
                            delete tags[$(event.target).parents("tr").attr("id")];

                            app.userObjects.updateObjects("labelSettings", "", function (result) {
                                if (result == "saved") {
                                    thisComp.setState({
                                        getTags: thisComp.getTags()
                                    });
                                } else if (result == "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                    thisComp.handleClick("showFirst");
                                }
                            });
                        }
                    }

                    break;

                case "deleteFolder":
                    break;

                case "editFolder":
                    var folders = app.user.get("folders");
                    //console.log(folders[e]['name']);

                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body",
                        thirdPanelClass: "panel-body d-none",

                        secondPanelText: "Edit Folder",

                        inputNameClass: "form-group ",
                        inputNameOnchange: "changeFolderName",
                        inputSelectClass: "form-group ",
                        inputSelectOnchange: "changeFolderExpiration",

                        inputLabelClass: "d-none",

                        button1visible: "d-none",

                        button4Click: "showFirst",

                        button5Click: "saveEditFolder",
                        button5text: "Save",

                        nameField: app.transform.from64str(folders[event]["name"]),
                        expireFolder: folders[event]["exp"],
                        folderId: event,

                        deleteFolderClass: folders[event]["isMain"] ? "d-none" : "btn btn-danger"

                    });

                    break;
            }
        },

        deleteFolder: function (id) {
            // console.log(id);
            // return false;
            var thisComp = this;
            // var id = this.state.folderId;

            var trash = app.user.get("systemFolders")["trashFolderId"];
            var filter = app.user.get("filter");

            var folders = app.user.get("folders");
            var emails = app.user.get("emails")["folders"];

            if (folders[id]["isMain"]) {
                $("#infoModHead").html("Delete Folder");
                $("#infoModBody").html("You can not delete system folder");

                $("#infoModal").modal("show");
            } else {
                $("#dialogModHead").html("Delete Folder");
                $("#dialogModBody").html("All messages and filter rules for this folder will be deleted. Do you want to continue?");

                $("#dialogOk").on("click", function () {
                    $("#settings-spinner").removeClass("d-none").addClass("d-block");
                    if (Object.keys(emails[id]).length > 0) {
                        $.each(emails[id], function (index, email) {
                            email["f"] = trash;
                        });

                        emails[trash] = $.extend({}, emails[trash], emails[id]);
                    }

                    $.each(filter, function (filterIndex, filterData) {
                        if (filterData["to"] == id) {
                            delete filter[filterIndex];
                            //filter=app.globalF.arrayRemove(filter,filterIndex);
                        }
                    });

                    delete emails[id]; //removing from mails storage
                    delete folders[id]; //removing folder reference

                    $("#dialogPop").modal("hide");

                    app.userObjects.updateObjects("folderSettings", "", function (result) {
                        if (result["response"] == "success") {
                            if (result["data"] == "saved") {
                                thisComp.setState({
                                    folderSet: thisComp.getFolders()
                                });
                                thisComp.handleClick("showFirst");
                            } else if (result["data"] == "newerFound") {
                                //app.notifications.systemMessage('newerFnd');
                                thisComp.handleClick("showFirst");
                            }
                        }
                    });
                    $("#settings-spinner").removeClass("d-block").addClass("d-none");
                });

                $("#dialogPop").modal("show");
            }
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {
                case "changeNameField":
                    this.setState({
                        nameField: event.target.value
                    });

                    break;

                case "changeExpiration":
                    var thisComp = this;
                    app.globalF.checkPlanLimits("folderExpiration", event.target.value, function (result) {
                        if (result) {
                            thisComp.setState({
                                expireFolder: event.target.value
                            });
                        }
                    });

                    break;

                case "changeLabelField":
                    this.setState({
                        labelField: event.target.value
                    });

                    break;
                case "changeLabelColor":
                    this.setState({
                        labelColor: event.target.value
                    });

                    break;
                case "changeFolderColor":
                    this.setState({
                        folderColor: event.target.value
                    });

                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle folders-labels" },
                    React.createElement(
                        "div",
                        { className: "middle-top" },
                        React.createElement(
                            "h2",
                            null,
                            "Mailbox"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "middle-content" },
                        React.createElement(
                            "div",
                            { className: "mid-nav" },
                            React.createElement(
                                "ul",
                                null,
                                React.createElement(
                                    "li",
                                    {
                                        role: "presentation",
                                        className: this.state.firstTab
                                    },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "showFirst")
                                        },
                                        "Folders"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    {
                                        role: "presentation",
                                        className: this.state.secondTab
                                    },
                                    React.createElement(
                                        "a",
                                        {
                                            onClick: this.handleClick.bind(this, "showSecond")
                                        },
                                        "Labels"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "add-contact-btn" },
                                React.createElement(
                                    "a",
                                    {
                                        className: this.state.button1visible,
                                        onClick: this.handleClick.bind(this, this.state.button1Click),
                                        disabled: !this.state.button1enabled
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        "+"
                                    ),
                                    this.state.button1text
                                ),
                                React.createElement(
                                    "a",
                                    {
                                        className: this.state.button3visible,
                                        onClick: this.handleClick.bind(this, this.state.button3Click),
                                        disabled: !this.state.button3enabled
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        "+"
                                    ),
                                    this.state.button3text
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            {
                                className: `table-row ${ this.state.firstPanelClass }`
                            },
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
                                        React.createElement("col", { width: "50" }),
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
                                                "Title",
                                                React.createElement("button", { className: "btn-sorting" })
                                            ),
                                            React.createElement(
                                                "th",
                                                { scope: "col" },
                                                "Main"
                                            ),
                                            React.createElement(
                                                "th",
                                                {
                                                    scope: "col",
                                                    className: "name-width"
                                                },
                                                "Expire"
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
                            {
                                className: `table-row ${ this.state.thirdPanelClass }`
                            },
                            React.createElement(
                                "div",
                                { className: "table-responsive" },
                                React.createElement(
                                    "table",
                                    {
                                        className: "table",
                                        id: "table2",
                                        onClick: this.handleClick.bind(this, "selectRowTab2")
                                    },
                                    React.createElement(
                                        "colgroup",
                                        null,
                                        React.createElement("col", { width: "40" }),
                                        React.createElement("col", null),
                                        React.createElement("col", { width: "50" }),
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
                                                {
                                                    scope: "col",
                                                    className: "name-width"
                                                },
                                                "Title",
                                                React.createElement("button", { className: "btn-sorting" })
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
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addNewFolderForm", className: "" },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            {
                                                className: `col-md-6 ${ this.state.inputLabelClass }`
                                            },
                                            React.createElement("input", {
                                                type: "text",
                                                name: "labelName",
                                                className: "form-control with-icon icon-email",
                                                id: "labelName",
                                                placeholder: "name",
                                                value: this.state.labelField,
                                                onChange: this.handleChange.bind(this, "changeLabelField")
                                            })
                                        ),
                                        React.createElement(
                                            "div",
                                            {
                                                className: `col-md-6 ${ this.state.inputLabelClass }`
                                            },
                                            React.createElement("input", {
                                                type: "text",
                                                name: "labelColour",
                                                className: "form-control with-icon icon-email",
                                                id: "labelColour",
                                                placeholder: "color code",
                                                value: this.state.labelColor,
                                                onChange: this.handleChange.bind(this, "changeLabelColor")
                                            }),
                                            React.createElement("div", { id: "labelColourDiv" })
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-md-6" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: this.state.inputNameClass
                                                },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "fromName",
                                                    className: "form-control with-icon icon-email",
                                                    id: "folderName",
                                                    placeholder: "name",
                                                    value: this.state.nameField,
                                                    onChange: this.handleChange.bind(this, "changeNameField")
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
                                                React.createElement("div", { className: "select-icon icon-calendar" }),
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-select with-icon icon-calendar",
                                                        defaultValue: "0",
                                                        id: "expireFold",
                                                        value: this.state.expireFolder,
                                                        onChange: this.handleChange.bind(this, "changeExpiration")
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        {
                                                            value: "0",
                                                            disabled: true
                                                        },
                                                        "Message Will Expire"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "-1" },
                                                        "Never"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "1" },
                                                        "1 day"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "7" },
                                                        "7 days"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "30" },
                                                        "30 days"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "180" },
                                                        "6 month"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: "365" },
                                                        "1 year"
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
                                                    className: this.state.inputNameClass
                                                },
                                                React.createElement("input", {
                                                    type: "text",
                                                    name: "folderColour",
                                                    className: "form-control with-icon icon-email",
                                                    id: "folderColour",
                                                    placeholder: "color code",
                                                    value: this.state.folderColor,
                                                    onChange: this.handleChange.bind(this, "changeFolderColor")
                                                }),
                                                React.createElement("div", { id: "folderColourDiv" })
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
                                                    className: this.state.deleteFolderClass,
                                                    onClick: this.handleClick.bind(this, "deleteFolder")
                                                },
                                                "Delete Folder"
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
                                                    onClick: this.handleClick.bind(this, this.state.button4Click)
                                                },
                                                "Cancel"
                                            ),
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn-blue fixed-width-btn",
                                                    onClick: this.handleClick.bind(this, this.state.button5Click)
                                                },
                                                " ",
                                                this.state.button5text
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
                    { className: "setting-right folders-labels" },
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
                                "Folders"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "can be used to archive email and help keep your inbox clean. An email can be placed in only one folder.",
                                React.createElement("br", null),
                                "In an upcoming version we will be introducing a message expiration that will allow you to set an expiration date, per folder, that will allow email in a folder to be automatically deleted after a specified number of days."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Labels"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "are an additional way to help keep your email organized. An email can have one label applied to it. If you have an email that has an important topic in it, you can use the key word as a label. For example, if you discuss stocks often with people, you can put a \"stocks\" label on them and find all of them at once with a search. Think of them as tags for emails with same topics that might exist across your inbox and folder(s)."
                            )
                        )
                    )
                )
            );
        }
    });
});