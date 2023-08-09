define(["react", "app", "dataTable", "dataTableBoot", "cmpld/authorized/settings/rightpanel/rightTop"], function (React, app, DataTable, dataTableBoot, RightTop) {
    "use strict";

    return React.createClass({
        /**
         *
         * @returns {{
         * firstPanelClass: string,
         * secondPanelClass: string,
         * thirdPanelClass: string,
         * firstTab: string,
         * button1visible: string,
         * button2text: string,
         * dataSet: Array,
         * newdomain: string,
         * domainBase: string,
         * domainHash: string,
         * domainID: string
         * }}
         */
        getInitialState: function () {
            return {
                viewFlag: false,
                firstPanelClass: "panel-body",
                secondPanelClass: "panel-body d-none",
                thirdPanelClass: "panel-body d-none",

                firstTab: "active",

                button1visible: "",

                button2text: "Add Domain",

                dataSet: [],
                newdomain: "",
                domainBase: "", //todo blank in production
                domainHash: "",
                domainID: "",
                enableSub: false,
                subdomainList: [],
                subdomainListPlain: [],
                subdomain: "",
                tmpDom: "",
                dkimAnswer: "",
                txtArea2value: ""
            };
        },
        componentDidMount: function () {
            var thisComp = this;

            this.getCustomDomain(function (result) {
                thisComp.setState({
                    dataSet: result
                });
            });

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: [],

                columns: [{ data: "checkbox" }, { data: "domain" }, { data: "check" }, { data: "delete" }, { data: "options" }],
                columnDefs: [{ sClass: "data-cols col-content-width", targets: [1] }, { orderDataType: "data-sort", targets: 1 }, { sClass: "col-mobile-hide", targets: [2, 3] }, { sClass: "col-options-width", targets: [0, -1] }],

                language: {
                    emptyTable: "No Domains",
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

            this.setState({
                aliasForm: $("#addNewAliasForm").validate({
                    errorElement: "span",
                    errorClass: "help-block",
                    highlight: function (element) {
                        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
                    },
                    unhighlight: function (element) {
                        $(element).closest(".form-group").removeClass("has-error").addClass("has-success");
                    },
                    errorPlacement: function (error, element) {
                        if (element.parent(".input-group").length || element.prop("type") === "checkbox" || element.prop("type") === "radio") {
                            error.insertAfter(element.parent());
                        } else {
                            error.insertAfter(element);
                        }
                    }
                })
            });

            try {
                $("#domainName").rules("add", {
                    required: true,
                    minlength: 3,
                    maxlength: 90,
                    remote: {
                        url: app.defaults.get("apidomain") + "/checkDomainExistV2",
                        type: "post",
                        data: {
                            domain: function () {
                                return thisComp.state.newdomain;
                            },

                            vrfString: function () {
                                return thisComp.state.domainBase;
                            },
                            userToken: app.user.get("userLoginToken")
                        },
                        dataFilter: function (data) {
                            console.log(data);
                            var json = JSON.parse(data);
                            if (json["response"] == "true") {
                                return '"true"';
                            } else if (json["response"] == "false") {
                                return '"domain exist "';
                            } else if (json["domain"] == "chkdomain") {
                                return '"check domain "';
                            } else if (json["vrfString"] == "chckVrf") {
                                return '"check verification string "';
                            }
                        }
                    },
                    messages: {
                        remote: "already in use"
                    }
                });
            } catch (e) {
                console.log(e.message);
            }

            //this.handleClick('showThird');
        },

        generateKeys: thisComp => {
            //var thisComp=this;

            app.generate.generateRSA("2048", function (RSAkeys) {
                var dkimString = RSAkeys.publicKey.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace(/(\r\n|\n|\r)/gm, "");
                dkimString = "v=DKIM1; k=rsa; p=" + dkimString + ";";
                thisComp.setState({
                    txtArea2value: RSAkeys.privateKey,
                    dkimAnswer: dkimString
                });
            });
        },
        /**
         *
         * @param callback
         */
        getCustomDomain: function (callback) {
            var alEm = [];

            app.serverCall.ajaxRequest("retrieveCustomDomainForUser", {}, function (result) {
                if (result["response"] == "success") {
                    var domains = result["domains"];

                    var sDomains = app.user.get("customDomains");
                    $.each(sDomains, function (domain64, data) {
                        if (domains[domain64] != undefined) {
                            var res = domains[domain64];

                            sDomains[domain64]["alReg"] = res["availableForAliasReg"];
                            sDomains[domain64]["dkim"] = res["dkimRec"];
                            sDomains[domain64]["mxRec"] = res["mxRec"];
                            sDomains[domain64]["obsolete"] = res["obsolete"];
                            sDomains[domain64]["owner"] = res["vrfRec"];
                            sDomains[domain64]["pending"] = res["pending"];

                            sDomains[domain64]["spf"] = res["spfRec"];
                            sDomains[domain64]["suspended"] = res["suspended"];

                            var good = '<i class="fa fa-check text-success fa-lg"></i>';

                            var alert = '<i class="fa fa-exclamation-triangle text-warning fa-lg"></i>';
                            var danger = '<i class="fa fa-exclamation-triangle text-danger fa-lg"></i>';

                            var suspMessage = 'data-toggle="tooltip" data-placement="top" title="Account Pending"';
                            var pendOwn = ' data-toggle="popover" data-placement="bottom" title="Verification String" data-content="<span style=\'word-break:break-all;\'>' + app.transform.SHA256(data["sec"]) + ' </span>"';

                            var inf = good;

                            if (res["spfRec"] != "1" || res["dkimRec"] != "1") {
                                var inf = alert;
                            }

                            if (res["suspended"] == "1" || res["mxRec"] != "1" || res["vrfRec"] != "1") {
                                var inf = danger;
                            }

                            var el = {
                                DT_RowId: domain64,
                                checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                                domain: app.transform.from64str(domain64),
                                check: '<button class="check-button"></button>',
                                delete: '<button class="table-icon delete-button">' + inf + "</button>",
                                options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                            };
                        } else {
                            var el = {
                                DT_RowId: domain64,
                                checkbox: '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                                domain: app.transform.from64str(domain64),
                                check: '<button class="check-button"></button>',
                                delete: '<button class="table-icon delete-button deleteDomain"></button>',
                                options: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>'
                            };
                        }

                        alEm.push(el);
                    });

                    //console.log(alEm);
                    //return alEm;
                }

                callback(alEm);
            });

            //this.setState({dataSet:alEm});
            //console.log(alEm);
            //return alEm;
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
                case "email":
                    break;
                case "copyToClipboard":
                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(this.state.dkimAnswer).select();
                    document.execCommand("copy");
                    $temp.remove();

                    break;
                case "copyClipboard":
                    if (!navigator.clipboard) {} else {
                        try {
                            navigator.clipboard.writeText($(event.target).parent(".blue-bg-text").find(".to-copy").text()).then(function () {});
                        } catch (e) {}
                    }
                    break;
                case "addSubdomain":
                    //  subdomainList

                    var item = this.state.subdomainList;

                    if (this.state.subdomain !== "") {
                        item.push(React.createElement(
                            "option",
                            {
                                key: app.transform.to64str(this.state.subdomain.toLowerCase()),
                                value: this.state.subdomain.toLowerCase()
                            },
                            this.state.subdomain.toLowerCase()
                        ));
                        this.setState({
                            subdomainList: item,
                            tmpDom: this.state.subdomain.toLowerCase(),
                            subdomain: ""
                        });
                    }
                    break;

                case "showFirst":
                    this.setState({
                        firstPanelClass: "panel-body",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body d-none",

                        firstTab: "active",

                        button1visible: "",

                        domainID: "",
                        newdomain: "",
                        domainBase: "",
                        domainHash: "",
                        enableSub: false,
                        subdomainList: [],
                        subdomainListPlain: [],
                        subdomain: "",
                        tmpDom: ""
                    });

                    $("#domainName").parents("div").removeClass("has-error");
                    $("#domainName").parents("div").removeClass("has-success");

                    var validator = $("#addNewAliasForm").validate();
                    validator.resetForm();

                    break;

                case "addNewDomain":
                    var thisComp = this;
                    app.globalF.checkPlanLimits("addDomain", Object.keys(app.user.get("customDomains")).length, function (result) {
                        if (result) {
                            thisComp.generateKeys(thisComp);

                            thisComp.setState({
                                firstPanelClass: "panel-body d-none",
                                secondPanelClass: "panel-body",
                                firstTab: "active",

                                button1visible: "d-none"
                            });
                        } else {
                            //console.log(this.props.activePage);
                            //this.props.activePage("Plan");
                            thisComp.props.updateAct("Plan");
                            //this.props.activeLink.plan

                            Backbone.history.navigate("/settings/Plan", {
                                trigger: true
                            });
                        }
                    });

                    break;

                case "showThird":
                    this.setState({
                        firstPanelClass: "panel-body d-none",
                        secondPanelClass: "panel-body d-none",
                        thirdPanelClass: "panel-body",

                        firstTab: "active",

                        button1visible: "d-none",

                        newdomain: "",
                        domainBase: "",
                        domainHash: "",
                        enableSub: false
                    });

                    var thisComp = this;

                    var domains = app.user.get("customDomains");
                    var id = event;

                    //console.log(domains[id]);
                    var status = "0";
                    if (domains[id]["pending"] == "1") {
                        status = "1";
                    } else if (domains[id]["obsolete"] == "1") {
                        status = "2";
                    } else if (domains[id]["suspended"] == "1") {
                        status = "3";
                    } else if (domains[id]["spf"] != "1" || domains[id]["dkim"] != "1" || domains[id]["mxRec"] != "1" || domains[id]["owner"] != "1") {
                        status = "4";
                    }

                    var item = [];

                    if (domains[id]["subdomain"] !== undefined && domains[id]["subdomain"].length > 0) {
                        $.each(domains[id]["subdomain"], function (ind, subdm64) {
                            item.push(React.createElement(
                                "option",
                                {
                                    key: subdm64,
                                    value: app.transform.from64str(subdm64)
                                },
                                app.transform.from64str(subdm64)
                            ));
                        });
                    }

                    thisComp.setState({
                        domain: app.transform.from64str(id),
                        verfString: app.transform.SHA256(domains[id]["sec"]),
                        subdomainListPlain: [],
                        spf: domains[id]["spf"],
                        mx: domains[id]["mxRec"],
                        owner: domains[id]["owner"],
                        dkim: domains[id]["dkim"],
                        dkimAnswer: domains[id]["dkimDNSRecord"],
                        status: status,
                        subdomain: "",
                        subdomainList: item
                    });

                    break;

                case "updateDomain":
                    var thisComp = this;

                    if (this.state.domainID != undefined) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        var custDomain = app.user.get("customDomains")[this.state.domainID];
                        var subdomains = this.state.subdomainList;

                        var tmpArr = [];
                        if (subdomains.length > 0) {
                            $.each(subdomains, function (ind, objct) {
                                tmpArr.push(objct["key"]);
                            });
                            custDomain["subdomain"] = tmpArr;
                        } else {
                            custDomain["subdomain"] = [];
                        }

                        app.user.set({
                            newDomain: {
                                id: this.state.domainID,
                                domain: custDomain["domain"],
                                subdomain: custDomain["subdomain"],
                                vrfString: custDomain["vrfString"],
                                sec: custDomain["sec"],
                                spf: custDomain["spf"],
                                mxRec: custDomain["mxRec"],
                                owner: custDomain["owner"],
                                dkim: custDomain["dkim"],
                                alReg: custDomain["alReg"],
                                pending: custDomain["pending"],
                                suspended: custDomain["suspended"],
                                obsolete: custDomain["obsolete"],
                                dkimDNSRecord: custDomain["dkimDNSRecord"],
                                dkimPrivateKey: custDomain["dkimPrivateKey"]
                            }
                        });

                        app.userObjects.updateObjects("updateDomain", "", function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.getCustomDomain(function (result) {
                                        thisComp.setState({
                                            dataSet: result
                                        });
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

                case "saveNewDomain":
                    var emfValidator = this.state.aliasForm;
                    var thisComp = this;
                    emfValidator.form();

                    if (emfValidator.numberOfInvalids() == 0) {
                        $("#settings-spinner").removeClass("d-none").addClass("d-block");
                        app.user.set({
                            newDomain: {
                                id: app.transform.to64str(thisComp.state.newdomain),
                                domain: this.state.newdomain,
                                subdomain: "",
                                vrfString: thisComp.state.domainBase,
                                dkimPrivateKey: thisComp.state.txtArea2value,
                                dkimDNSRecord: thisComp.state.dkimAnswer,
                                sec: thisComp.state.domainBase,
                                spf: false,
                                mxRec: false,
                                owner: false,
                                dkim: false,
                                alReg: false,
                                pending: true,
                                suspended: false,
                                obsolete: false
                            }
                        });

                        //console.log(app.user);

                        app.userObjects.updateObjects("savePendingDomain", "", function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    thisComp.getCustomDomain(function (result) {
                                        thisComp.setState({
                                            dataSet: result
                                        });
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

                case "deleteDomain":
                    var thisComp = this;

                    var aliases = app.user.get("allKeys");
                    var dom = app.transform.from64str(thisComp.state.domainID);
                    var alias = false;
                    $.each(aliases, function (id, email) {
                        var domain = app.globalF.getEmailDomain(app.transform.from64str(email["email"]));
                        //console.log(domain);
                        if (dom == domain) {
                            alias = true;
                        }
                        //this.state.domainID
                    });
                    if (alias) {
                        $("#infoModHead").html("Alias Exist");
                        $("#infoModBody").html("Please remove all aliases associated with this domain before deleting");
                        $("#infoModal").modal("show");
                    } else {
                        $("#dialogModHead").html("Delete");
                        $("#dialogModBody").html("If you deleting Custom Domain you won't be able to receive or send emails with it. Continue?");

                        var id = this.state.domainID;
                        $("#dialogOk").on("click", function () {
                            //var domains=app.user.get('customDomains');
                            //delete domains[id];
                            $("#settings-spinner").removeClass("d-none").addClass("d-block");
                            app.user.set({
                                newDomain: {
                                    id: id
                                }
                            });

                            $("#dialogPop").modal("hide");

                            app.userObjects.updateObjects("deleteDomain", "", function (result) {
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        thisComp.getCustomDomain(function (result) {
                                            thisComp.setState({
                                                dataSet: result
                                            });
                                        });

                                        thisComp.handleClick("showFirst");
                                    } else if (result["data"] == "newerFound") {
                                        //app.notifications.systemMessage('newerFnd');
                                        thisComp.handleClick("showFirst");
                                    }
                                }
                            });

                            //thisComp.handleClick('showFirst');
                            $("#settings-spinner").removeClass("d-block").addClass("d-none");
                        });

                        $("#dialogPop").modal("show");
                    }

                    break;

                case "refreshDNS":
                    var thisComp = this;

                    thisComp.setState({
                        refreshIclass: "fa fa-refresh fa-spin"
                    });

                    thisComp.getCustomDomain(function (result) {
                        thisComp.setState({
                            dataSet: result
                        });

                        app.user.set({ customDomainChanged: true });
                        //app.userObjects.updateObjects();

                        setTimeout(function () {
                            thisComp.handleClick("showThird", thisComp.state.domainID);
                            thisComp.setState({
                                refreshIclass: ""
                            });
                        }, 1000);
                    });

                    break;
                case "selectRow":
                    //domainID:""

                    // Select row
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
                                    domainID: $(event.target).parents("tr").attr("id")
                                });
                                thisComp.handleClick("deleteContact", id);
                            }
                        }
                    }

                    // var id = $(event.target).parents("tr").attr("id");
                    // if (id != undefined) {
                    //     this.setState({
                    //         domainID: $(event.target).parents("tr").attr("id"),
                    //     });
                    //     this.handleClick(
                    //         "showThird",
                    //         $(event.target).parents("tr").attr("id")
                    //     );
                    // }

                    break;
                case "toggleDisplay":
                    this.setState({
                        viewFlag: !this.state.viewFlag
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
                case "typingDomain":
                    var str = app.generate.makeVerificationString(event.target.value.toLowerCase());

                    this.setState({
                        newdomain: event.target.value.toLowerCase(),
                        domainBase: str["base"],
                        domainHash: str["hash"]
                    });

                    break;
                case "subdomain":
                    this.setState({
                        subdomain: event.target.value.toLowerCase()
                    });
                    break;
                case "enableSub":
                    this.setState({
                        enableSub: !this.state.enableSub
                    });
                    break;
            }
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (JSON.stringify(nextState.dataSet) !== JSON.stringify(this.state.dataSet)) {
                var t = $("#table1").DataTable();
                t.clear();
                var dataAlias = nextState.dataSet;
                t.rows.add(dataAlias);
                t.draw(false);
            }

            //$("[data-toggle='tooltip']").tooltip();
            //$('[data-toggle="popover"]').popover({
            //	html : true
            //});
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

            return React.createElement(
                "div",
                { id: "rightSettingPanel" },
                React.createElement(
                    "div",
                    { className: "setting-middle custom-domains" },
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
                                        "Custom domain"
                                    )
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Add domain"
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
                                    "Custom domain"
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
                                            "Add Domain"
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
                                            React.createElement("col", { width: "40" }),
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
                                                    null,
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
                                    "Add Domain"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-section" },
                                React.createElement(
                                    "form",
                                    { id: "addNewAliasForm", className: "" },
                                    React.createElement(
                                        "div",
                                        { className: `row` },
                                        React.createElement(
                                            "div",
                                            { className: "col-12" },
                                            React.createElement(
                                                "div",
                                                { className: "form-group" },
                                                React.createElement("input", {
                                                    id: "domainName",
                                                    name: "domain",
                                                    type: "text",
                                                    className: "form-control with-icon icon-domain-name",
                                                    placeholder: "Enter domain",
                                                    value: this.state.newdomain,
                                                    onChange: this.handleChange.bind(this, "typingDomain")
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
                                                    className: "form-control",
                                                    placeholder: "Verification String",
                                                    value: this.state.domainHash,
                                                    readOnly: true
                                                })
                                            )
                                        )
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
                                                    onClick: this.handleClick.bind(this, "saveNewDomain")
                                                },
                                                "Add Domain"
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement("div", { className: "pull-right dialog_buttons" })
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.thirdPanelClass },
                            React.createElement(
                                "h3",
                                null,
                                "Info:"
                            ),
                            React.createElement(
                                "table",
                                { className: " table table-hover table-striped datatable table-light" },
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        { className: "col-xs-3" },
                                        React.createElement(
                                            "b",
                                            null,
                                            "Domain:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        { colSpan: "2", className: "col-xs-9" },
                                        this.state.domain
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        { className: "col-xs-3" },
                                        React.createElement(
                                            "b",
                                            null,
                                            "Subdomain:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        { colSpan: "2", className: "col-xs-9" },
                                        React.createElement(
                                            "div",
                                            { className: "col-xs-12 col-lg-6" },
                                            React.createElement(
                                                "div",
                                                {
                                                    className: "form-group",
                                                    style: {
                                                        marginBottom: "0px"
                                                    }
                                                },
                                                React.createElement(
                                                    "select",
                                                    {
                                                        className: "form-control",
                                                        value: this.state.tmpDom
                                                    },
                                                    React.createElement(
                                                        "option",
                                                        {
                                                            value: "0",
                                                            disabled: true
                                                        },
                                                        "Enter subdomain"
                                                    ),
                                                    this.state.subdomainList
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-xs-12 col-lg-6" },
                                            React.createElement(
                                                "div",
                                                { className: "input-group" },
                                                React.createElement("input", {
                                                    type: "email",
                                                    name: "email",
                                                    id: "emNotInp",
                                                    className: "form-control",
                                                    placeholder: "subdomain",
                                                    value: this.state.subdomain,
                                                    onChange: this.handleChange.bind(this, "subdomain")
                                                }),
                                                React.createElement(
                                                    "span",
                                                    { className: "input-group-btn" },
                                                    React.createElement(
                                                        "button",
                                                        {
                                                            className: "btn btn-default btn-success",
                                                            type: "button",
                                                            style: {
                                                                padding: "7px 12px"
                                                            },
                                                            onClick: this.handleClick.bind(this, "addSubdomain")
                                                        },
                                                        React.createElement("i", { className: "fa fa-plus fa-lg" })
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "Verification String:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        { colSpan: "2" },
                                        this.state.verfString
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "SPF:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        {
                                            colSpan: "2",
                                            className: this.state.spf == "1" ? "text-success bold" : "text-danger bold"
                                        },
                                        this.state.spf == "1" ? "verified" : "failed"
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "MX:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        {
                                            colSpan: "2",
                                            className: this.state.mx == "1" ? "text-success bold" : "text-danger bold"
                                        },
                                        this.state.mx == "1" ? "verified" : "failed"
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "Owner:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        {
                                            colSpan: "2",
                                            className: this.state.owner == "1" ? "text-success bold" : "text-danger bold"
                                        },
                                        this.state.owner == "1" ? "verified" : "failed"
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "DKIM:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        {
                                            colSpan: "2",
                                            className: this.state.dkim == "1" ? "text-success bold" : "text-danger bold"
                                        },
                                        this.state.dkim == "1" ? "verified" : "failed"
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "Status:"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        {
                                            colSpan: "2",
                                            className: this.state.status == "0" ? "text-success bold" : this.state.status == "1" ? "text-warning bold" : "text-danger bold"
                                        },
                                        this.state.status == "0" ? "good" : this.state.status == "1" ? "pending" : this.state.status == "2" ? "obsolete" : this.state.status == "3" ? "suspended" : this.state.status == "4" ? "Some Error" : ""
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "DKIM Record Host Field"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        { colSpan: "2" },
                                        "default._domainkey"
                                    )
                                ),
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "b",
                                            null,
                                            "DKIM Record Answer Field"
                                        )
                                    ),
                                    React.createElement(
                                        "td",
                                        { className: "col-md-6" },
                                        this.state.dkimAnswer
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "pull-right dialog_buttons col-md-3" },
                                            React.createElement(
                                                "button",
                                                {
                                                    type: "button",
                                                    className: "btn btn-primary pull-right",
                                                    onClick: this.handleClick.bind(this, "copyToClipboard")
                                                },
                                                "Copy Text"
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement("div", { className: "clearfix" }),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "btn btn-danger",
                                    onClick: this.handleClick.bind(this, "deleteDomain")
                                },
                                "Delete"
                            ),
                            React.createElement(
                                "div",
                                { className: "pull-right dialog_buttons" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-success",
                                        onClick: this.handleClick.bind(this, "updateDomain")
                                    },
                                    React.createElement("i", {
                                        className: this.state.updateDomainI
                                    }),
                                    " ",
                                    "Save Changes"
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-default",
                                        onClick: this.handleClick.bind(this, "refreshDNS")
                                    },
                                    React.createElement("i", {
                                        className: this.state.refreshIclass
                                    }),
                                    " ",
                                    "Refresh DNS"
                                ),
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "btn btn-primary",
                                        onClick: this.handleClick.bind(this, "showFirst")
                                    },
                                    "OK"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "setting-right custom-domains" },
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
                                "Domain"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "The domain name you own and want to setup with mail hosting at mailum.com."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Verification String"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "A randomly generated string that verifies ownership of your domain. Create a TXT record in your DNS zone file in the format:"
                            ),
                            React.createElement(
                                "div",
                                { className: "green-bg-text" },
                                "Host: @ ",
                                React.createElement("br", null),
                                " TXT: mailum=Verification String"
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "SPF Record"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "An SPF record is a TXT record in your DNS zone and used to signal that Mailum is authorized to send email from your custom domain name. This record is important for passing spam checks at your contacts email hosting servers. Create the TXT record in your DNS zone file with the format:"
                            ),
                            React.createElement(
                                "div",
                                { className: "green-bg-text" },
                                "Host: @ ",
                                React.createElement("br", null),
                                " TXT: v=spf1 include:mailum.com ~all"
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
                                        "If you already have an SPF record, or need help creating a record that lets you send email from other servers too, please use this",
                                        " ",
                                        React.createElement(
                                            "a",
                                            {
                                                href: "http://www.emailquestions.com/spf-wizard/",
                                                target: "_blank"
                                            },
                                            "SPF wizard"
                                        )
                                    ),
                                    " "
                                )
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Note: Link will be opened to the third party website"
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "MX Record"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Create/replace a single MX record in the format:"
                            ),
                            React.createElement(
                                "div",
                                { className: "green-bg-text" },
                                "Host: @ ",
                                React.createElement("br", null),
                                "Priority: 10 ",
                                React.createElement("br", null),
                                "Value: custom.mailum.com"
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Owner"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "This will indicate If the system was able to verify your ownership over the domain."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "DKIM"
                            ),
                            React.createElement(
                                "p",
                                { className: "break-all" },
                                "DKIM is a digital signature that is sent along with email to verify that a server is authorized to send email on behalf of your domain. This is another step to comply and pass spam check. Please create the TXT record in the format:"
                            ),
                            React.createElement(
                                "div",
                                { className: "green-bg-text" },
                                "Paste the content of DKIM Record Answer"
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Status"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Our servers occasionally check your DNS records to verify that all information is correct, and it will warn you if there are any errors that need to be fixed."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "More information is available on our blog"
                            ),
                            React.createElement(
                                "div",
                                { className: "blue-bg-text" },
                                React.createElement(
                                    "a",
                                    {
                                        href: "https://blog.cyberfear.com/adding-custom-domain/",
                                        target: "_blank",
                                        className: "to-copy"
                                    },
                                    "https://blog.cyberfear.com/adding-custom-domain/"
                                ),
                                React.createElement(
                                    "a",
                                    {
                                        className: "__copy",
                                        onClick: this.handleClick.bind(this, "copyClipboard")
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "icon" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 17 17",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", {
                                                d: "M10.625 8.97812V11.2094C10.625 13.0688 9.88125 13.8125 8.02188 13.8125H5.79063C3.93125 13.8125 3.1875 13.0688 3.1875 11.2094V8.97812C3.1875 7.11875 3.93125 6.375 5.79063 6.375H8.02188C9.88125 6.375 10.625 7.11875 10.625 8.97812Z",
                                                strokeWidth: "1.0625",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }),
                                            React.createElement("path", {
                                                d: "M13.8125 5.79063V8.02188C13.8125 9.88125 13.0688 10.625 11.2094 10.625H10.625V8.97812C10.625 7.11875 9.88125 6.375 8.02188 6.375H6.375V5.79063C6.375 3.93125 7.11875 3.1875 8.97812 3.1875H11.2094C13.0688 3.1875 13.8125 3.93125 13.8125 5.79063Z",
                                                strokeWidth: "1.0625",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            })
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});