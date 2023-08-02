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
                txtArea2value: "",
            };
        },
        componentDidMount: function () {
            var thisComp = this;

            this.getCustomDomain(function (result) {
                thisComp.setState({
                    dataSet: result,
                });
            });

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: [],

                columns: [
                    { data: "checkbox" },
                    { data: "domain" },
                    { data: "check" },
                    { data: "delete" },
                    { data: "options" },
                ],
                columnDefs: [
                    { sClass: "data-cols col-content-width", targets: [1] },
                    { orderDataType: "data-sort", targets: 1 },
                    { sClass: "col-mobile-hide", targets: [2, 3] },
                    { sClass: "col-options-width", targets: [0, -1] },
                ],

                language: {
                    emptyTable: "No Domains",
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

            this.setState({
                aliasForm: $("#addNewAliasForm").validate({
                    errorElement: "span",
                    errorClass: "help-block",
                    highlight: function (element) {
                        $(element)
                            .closest(".form-group")
                            .removeClass("has-success")
                            .addClass("has-error");
                    },
                    unhighlight: function (element) {
                        $(element)
                            .closest(".form-group")
                            .removeClass("has-error")
                            .addClass("has-success");
                    },
                    errorPlacement: function (error, element) {
                        if (
                            element.parent(".input-group").length ||
                            element.prop("type") === "checkbox" ||
                            element.prop("type") === "radio"
                        ) {
                            error.insertAfter(element.parent());
                        } else {
                            error.insertAfter(element);
                        }
                    },
                }),
            });

            try {
                $("#domainName").rules("add", {
                    required: true,
                    minlength: 3,
                    maxlength: 90,
                    remote: {
                        url:
                            app.defaults.get("apidomain") +
                            "/checkDomainExistV2",
                        type: "post",
                        data: {
                            domain: function () {
                                return thisComp.state.newdomain;
                            },

                            vrfString: function () {
                                return thisComp.state.domainBase;
                            },
                            userToken: app.user.get("userLoginToken"),
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
                        },
                    },
                    messages: {
                        remote: "already in use",
                    },
                });
            } catch (e) {
                console.log(e.message);
            }

            //this.handleClick('showThird');
        },

        generateKeys: (thisComp) => {
            //var thisComp=this;

            app.generate.generateRSA("2048", function (RSAkeys) {
                var dkimString = RSAkeys.publicKey
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replace(/(\r\n|\n|\r)/gm, "");
                dkimString = "v=DKIM1; k=rsa; p=" + dkimString + ";";
                thisComp.setState({
                    txtArea2value: RSAkeys.privateKey,
                    dkimAnswer: dkimString,
                });
            });
        },
        /**
         *
         * @param callback
         */
        getCustomDomain: function (callback) {
            var alEm = [];

            app.serverCall.ajaxRequest(
                "retrieveCustomDomainForUser",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        var domains = result["domains"];

                        var sDomains = app.user.get("customDomains");
                        $.each(sDomains, function (domain64, data) {
                            if (domains[domain64] != undefined) {
                                var res = domains[domain64];

                                sDomains[domain64]["alReg"] =
                                    res["availableForAliasReg"];
                                sDomains[domain64]["dkim"] = res["dkimRec"];
                                sDomains[domain64]["mxRec"] = res["mxRec"];
                                sDomains[domain64]["obsolete"] =
                                    res["obsolete"];
                                sDomains[domain64]["owner"] = res["vrfRec"];
                                sDomains[domain64]["pending"] = res["pending"];

                                sDomains[domain64]["spf"] = res["spfRec"];
                                sDomains[domain64]["suspended"] =
                                    res["suspended"];

                                var good =
                                    '<i class="fa fa-check text-success fa-lg"></i>';

                                var alert =
                                    '<i class="fa fa-exclamation-triangle text-warning fa-lg"></i>';
                                var danger =
                                    '<i class="fa fa-exclamation-triangle text-danger fa-lg"></i>';

                                var suspMessage =
                                    'data-toggle="tooltip" data-placement="top" title="Account Pending"';
                                var pendOwn =
                                    ' data-toggle="popover" data-placement="bottom" title="Verification String" data-content="<span style=\'word-break:break-all;\'>' +
                                    app.transform.SHA256(data["sec"]) +
                                    ' </span>"';

                                var inf = good;

                                if (
                                    res["spfRec"] != "1" ||
                                    res["dkimRec"] != "1"
                                ) {
                                    var inf = alert;
                                }

                                if (
                                    res["suspended"] == "1" ||
                                    res["mxRec"] != "1" ||
                                    res["vrfRec"] != "1"
                                ) {
                                    var inf = danger;
                                }

                                var el = {
                                    DT_RowId: domain64,
                                    checkbox:
                                        '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                                    domain: app.transform.from64str(domain64),
                                    check: '<button class="check-button"></button>',
                                    delete:
                                        '<button class="table-icon delete-button">' +
                                        inf +
                                        "</button>",
                                    options:
                                        '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
                                };
                            } else {
                                var el = {
                                    DT_RowId: domain64,
                                    checkbox:
                                        '<label class="container-checkbox"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                                    domain: app.transform.from64str(domain64),
                                    check: '<button class="check-button"></button>',
                                    delete: '<button class="table-icon delete-button deleteDomain"></button>',
                                    options:
                                        '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
                                };
                            }

                            alEm.push(el);
                        });

                        //console.log(alEm);
                        //return alEm;
                    }

                    callback(alEm);
                }
            );

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
                case "addSubdomain":
                    //  subdomainList

                    var item = this.state.subdomainList;

                    if (this.state.subdomain !== "") {
                        item.push(
                            <option
                                key={app.transform.to64str(
                                    this.state.subdomain.toLowerCase()
                                )}
                                value={this.state.subdomain.toLowerCase()}
                            >
                                {this.state.subdomain.toLowerCase()}
                            </option>
                        );
                        this.setState({
                            subdomainList: item,
                            tmpDom: this.state.subdomain.toLowerCase(),
                            subdomain: "",
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
                        tmpDom: "",
                    });

                    $("#domainName").parents("div").removeClass("has-error");
                    $("#domainName").parents("div").removeClass("has-success");

                    var validator = $("#addNewAliasForm").validate();
                    validator.resetForm();

                    break;

                case "addNewDomain":
                    var thisComp = this;
                    app.globalF.checkPlanLimits(
                        "addDomain",
                        Object.keys(app.user.get("customDomains")).length,
                        function (result) {
                            if (result) {
                                thisComp.generateKeys(thisComp);

                                thisComp.setState({
                                    firstPanelClass: "panel-body d-none",
                                    secondPanelClass: "panel-body",
                                    firstTab: "active",

                                    button1visible: "d-none",
                                });
                            } else {
                                //console.log(this.props.activePage);
                                //this.props.activePage("Plan");
                                thisComp.props.updateAct("Plan");
                                //this.props.activeLink.plan

                                Backbone.history.navigate("/settings/Plan", {
                                    trigger: true,
                                });
                            }
                        }
                    );

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
                        enableSub: false,
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
                    } else if (
                        domains[id]["spf"] != "1" ||
                        domains[id]["dkim"] != "1" ||
                        domains[id]["mxRec"] != "1" ||
                        domains[id]["owner"] != "1"
                    ) {
                        status = "4";
                    }

                    var item = [];

                    if (
                        domains[id]["subdomain"] !== undefined &&
                        domains[id]["subdomain"].length > 0
                    ) {
                        $.each(
                            domains[id]["subdomain"],
                            function (ind, subdm64) {
                                item.push(
                                    <option
                                        key={subdm64}
                                        value={app.transform.from64str(subdm64)}
                                    >
                                        {app.transform.from64str(subdm64)}
                                    </option>
                                );
                            }
                        );
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
                        subdomainList: item,
                    });

                    break;

                case "updateDomain":
                    var thisComp = this;

                    if (this.state.domainID != undefined) {
                        $("#settings-spinner")
                            .removeClass("d-none")
                            .addClass("d-block");
                        var custDomain =
                            app.user.get("customDomains")[this.state.domainID];
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
                                dkimPrivateKey: custDomain["dkimPrivateKey"],
                            },
                        });

                        app.userObjects.updateObjects(
                            "updateDomain",
                            "",
                            function (result) {
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        thisComp.getCustomDomain(function (
                                            result
                                        ) {
                                            thisComp.setState({
                                                dataSet: result,
                                            });
                                        });

                                        thisComp.handleClick("showFirst");
                                    } else if (result["data"] == "newerFound") {
                                        //app.notifications.systemMessage('newerFnd');
                                        thisComp.handleClick("showFirst");
                                    }
                                }
                            }
                        );
                        $("#settings-spinner")
                            .removeClass("d-block")
                            .addClass("d-none");
                    }

                    break;

                case "saveNewDomain":
                    var emfValidator = this.state.aliasForm;
                    var thisComp = this;
                    emfValidator.form();

                    if (emfValidator.numberOfInvalids() == 0) {
                        $("#settings-spinner")
                            .removeClass("d-none")
                            .addClass("d-block");
                        app.user.set({
                            newDomain: {
                                id: app.transform.to64str(
                                    thisComp.state.newdomain
                                ),
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
                                obsolete: false,
                            },
                        });

                        //console.log(app.user);

                        app.userObjects.updateObjects(
                            "savePendingDomain",
                            "",
                            function (result) {
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        thisComp.getCustomDomain(function (
                                            result
                                        ) {
                                            thisComp.setState({
                                                dataSet: result,
                                            });
                                        });

                                        thisComp.handleClick("showFirst");
                                    } else if (result["data"] == "newerFound") {
                                        //app.notifications.systemMessage('newerFnd');
                                        thisComp.handleClick("showFirst");
                                    }
                                }
                            }
                        );
                        $("#settings-spinner")
                            .removeClass("d-block")
                            .addClass("d-none");
                    }

                    break;

                case "deleteDomain":
                    var thisComp = this;

                    var aliases = app.user.get("allKeys");
                    var dom = app.transform.from64str(thisComp.state.domainID);
                    var alias = false;
                    $.each(aliases, function (id, email) {
                        var domain = app.globalF.getEmailDomain(
                            app.transform.from64str(email["email"])
                        );
                        //console.log(domain);
                        if (dom == domain) {
                            alias = true;
                        }
                        //this.state.domainID
                    });
                    if (alias) {
                        $("#infoModHead").html("Alias Exist");
                        $("#infoModBody").html(
                            "Please remove all aliases associated with this domain before deleting"
                        );
                        $("#infoModal").modal("show");
                    } else {
                        $("#dialogModHead").html("Delete");
                        $("#dialogModBody").html(
                            "If you deleting Custom Domain you won't be able to receive or send emails with it. Continue?"
                        );

                        var id = this.state.domainID;
                        $("#dialogOk").on("click", function () {
                            //var domains=app.user.get('customDomains');
                            //delete domains[id];
                            $("#settings-spinner")
                                .removeClass("d-none")
                                .addClass("d-block");
                            app.user.set({
                                newDomain: {
                                    id: id,
                                },
                            });

                            $("#dialogPop").modal("hide");

                            app.userObjects.updateObjects(
                                "deleteDomain",
                                "",
                                function (result) {
                                    if (result["response"] == "success") {
                                        if (result["data"] == "saved") {
                                            thisComp.getCustomDomain(function (
                                                result
                                            ) {
                                                thisComp.setState({
                                                    dataSet: result,
                                                });
                                            });

                                            thisComp.handleClick("showFirst");
                                        } else if (
                                            result["data"] == "newerFound"
                                        ) {
                                            //app.notifications.systemMessage('newerFnd');
                                            thisComp.handleClick("showFirst");
                                        }
                                    }
                                }
                            );

                            //thisComp.handleClick('showFirst');
                            $("#settings-spinner")
                                .removeClass("d-block")
                                .addClass("d-none");
                        });

                        $("#dialogPop").modal("show");
                    }

                    break;

                case "refreshDNS":
                    var thisComp = this;

                    thisComp.setState({
                        refreshIclass: "fa fa-refresh fa-spin",
                    });

                    thisComp.getCustomDomain(function (result) {
                        thisComp.setState({
                            dataSet: result,
                        });

                        app.user.set({ customDomainChanged: true });
                        //app.userObjects.updateObjects();

                        setTimeout(function () {
                            thisComp.handleClick(
                                "showThird",
                                thisComp.state.domainID
                            );
                            thisComp.setState({
                                refreshIclass: "",
                            });
                        }, 1000);
                    });

                    break;
                case "selectRow":
                    //domainID:""

                    // Select row
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
                                    domainID: $(event.target)
                                        .parents("tr")
                                        .attr("id"),
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
                        viewFlag: !this.state.viewFlag,
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
                    var str = app.generate.makeVerificationString(
                        event.target.value.toLowerCase()
                    );

                    this.setState({
                        newdomain: event.target.value.toLowerCase(),
                        domainBase: str["base"],
                        domainHash: str["hash"],
                    });

                    break;
                case "subdomain":
                    this.setState({
                        subdomain: event.target.value.toLowerCase(),
                    });
                    break;
                case "enableSub":
                    this.setState({
                        enableSub: !this.state.enableSub,
                    });
                    break;
            }
        },

        componentWillUpdate: function (nextProps, nextState) {
            if (
                JSON.stringify(nextState.dataSet) !==
                JSON.stringify(this.state.dataSet)
            ) {
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

            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle custom-domains">
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
                                            Custom domain
                                        </a>
                                    </li>
                                    <li>Add domain</li>
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
                                    <h3>Custom domain</h3>
                                    <div className="middle-content-top-right">
                                        <div className="add-contact-btn">
                                            <a
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "toggleDisplay"
                                                )}
                                            >
                                                <span className="icon">+</span>{" "}
                                                Add Domain
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-row">
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
                                                <col width="50" />
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
                                                        Email{" "}
                                                        <button className="btn-sorting"></button>
                                                    </th>
                                                    <th>&nbsp;</th>
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
                                    <h3>Add Domain</h3>
                                </div>

                                <div className="form-section">
                                    <form id="addNewAliasForm" className="">
                                        <div className={`row`}>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input
                                                        id="domainName"
                                                        name="domain"
                                                        type="text"
                                                        className="form-control with-icon icon-domain-name"
                                                        placeholder="Enter domain"
                                                        value={
                                                            this.state.newdomain
                                                        }
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "typingDomain"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Verification String"
                                                        value={
                                                            this.state
                                                                .domainHash
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-section-bottom">
                                            <div className="btn-row">
                                                <button
                                                    type="button"
                                                    className="btn-border fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "toggleDisplay"
                                                    )}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-blue fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "saveNewDomain"
                                                    )}
                                                >
                                                    Add Domain
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="pull-right dialog_buttons"></div>
                            </div>

                            <div className={this.state.thirdPanelClass}>
                                <h3>Info:</h3>

                                <table className=" table table-hover table-striped datatable table-light">
                                    <tr>
                                        <td className="col-xs-3">
                                            <b>Domain:</b>
                                        </td>
                                        <td colSpan="2" className="col-xs-9">
                                            {this.state.domain}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="col-xs-3">
                                            <b>Subdomain:</b>
                                        </td>
                                        <td colSpan="2" className="col-xs-9">
                                            <div className="col-xs-12 col-lg-6">
                                                <div
                                                    className="form-group"
                                                    style={{
                                                        marginBottom: "0px",
                                                    }}
                                                >
                                                    <select
                                                        className="form-control"
                                                        value={
                                                            this.state.tmpDom
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            Enter subdomain
                                                        </option>
                                                        {
                                                            this.state
                                                                .subdomainList
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-lg-6">
                                                <div className="input-group">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="emNotInp"
                                                        className="form-control"
                                                        placeholder="subdomain"
                                                        value={
                                                            this.state.subdomain
                                                        }
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "subdomain"
                                                        )}
                                                    />
                                                    <span className="input-group-btn">
                                                        <button
                                                            className="btn btn-default btn-success"
                                                            type="button"
                                                            style={{
                                                                padding:
                                                                    "7px 12px",
                                                            }}
                                                            onClick={this.handleClick.bind(
                                                                this,
                                                                "addSubdomain"
                                                            )}
                                                        >
                                                            <i className="fa fa-plus fa-lg"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Verification String:</b>
                                        </td>
                                        <td colSpan="2">
                                            {this.state.verfString}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>SPF:</b>
                                        </td>
                                        <td
                                            colSpan="2"
                                            className={
                                                this.state.spf == "1"
                                                    ? "text-success bold"
                                                    : "text-danger bold"
                                            }
                                        >
                                            {this.state.spf == "1"
                                                ? "verified"
                                                : "failed"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>MX:</b>
                                        </td>
                                        <td
                                            colSpan="2"
                                            className={
                                                this.state.mx == "1"
                                                    ? "text-success bold"
                                                    : "text-danger bold"
                                            }
                                        >
                                            {this.state.mx == "1"
                                                ? "verified"
                                                : "failed"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Owner:</b>
                                        </td>
                                        <td
                                            colSpan="2"
                                            className={
                                                this.state.owner == "1"
                                                    ? "text-success bold"
                                                    : "text-danger bold"
                                            }
                                        >
                                            {this.state.owner == "1"
                                                ? "verified"
                                                : "failed"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>DKIM:</b>
                                        </td>
                                        <td
                                            colSpan="2"
                                            className={
                                                this.state.dkim == "1"
                                                    ? "text-success bold"
                                                    : "text-danger bold"
                                            }
                                        >
                                            {this.state.dkim == "1"
                                                ? "verified"
                                                : "failed"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Status:</b>
                                        </td>
                                        <td
                                            colSpan="2"
                                            className={
                                                this.state.status == "0"
                                                    ? "text-success bold"
                                                    : this.state.status == "1"
                                                    ? "text-warning bold"
                                                    : "text-danger bold"
                                            }
                                        >
                                            {this.state.status == "0"
                                                ? "good"
                                                : this.state.status == "1"
                                                ? "pending"
                                                : this.state.status == "2"
                                                ? "obsolete"
                                                : this.state.status == "3"
                                                ? "suspended"
                                                : this.state.status == "4"
                                                ? "Some Error"
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>DKIM Record Host Field</b>
                                        </td>
                                        <td colSpan="2">default._domainkey</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>DKIM Record Answer Field</b>
                                        </td>
                                        <td className="col-md-6">
                                            {this.state.dkimAnswer}
                                        </td>
                                        <td>
                                            <div className="pull-right dialog_buttons col-md-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary pull-right"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        "copyToClipboard"
                                                    )}
                                                >
                                                    Copy Text
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <div className="clearfix"></div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={this.handleClick.bind(
                                        this,
                                        "deleteDomain"
                                    )}
                                >
                                    Delete
                                </button>
                                <div className="pull-right dialog_buttons">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "updateDomain"
                                        )}
                                    >
                                        <i
                                            className={this.state.updateDomainI}
                                        ></i>{" "}
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "refreshDNS"
                                        )}
                                    >
                                        <i
                                            className={this.state.refreshIclass}
                                        ></i>{" "}
                                        Refresh DNS
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "showFirst"
                                        )}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-right custom-domains">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>

                            <div className="panel-body">
                                <h3>Domain</h3>
                                <p>
                                    The domain name you own and want to setup
                                    with mail hosting at mailum.com.
                                </p>
                                <h3>Verification String</h3>
                                <p>
                                    A randomly generated string that verifies
                                    ownership of your domain. Create a TXT
                                    record in your DNS zone file in the format:
                                </p>
                                <div className="green-bg-text">
                                    Host: @ <br /> TXT: mailum=Verification
                                    String
                                </div>
                                <h3>SPF Record</h3>
                                <p>
                                    An SPF record is a TXT record in your DNS
                                    zone and used to signal that Mailum is
                                    authorized to send email from your custom
                                    domain name. This record is important for
                                    passing spam checks at your contacts email
                                    hosting servers. Create the TXT record in
                                    your DNS zone file with the format:
                                </p>
                                <div className="green-bg-text">
                                    Host: @ <br /> TXT: v=spf1
                                    include:mailum.com ~all
                                </div>
                                <div className="bullets">
                                    <ul>
                                        <li>
                                            {" "}
                                            If you already have an SPF record,
                                            or need help creating a record that
                                            lets you send email from other
                                            servers too, please use this{" "}
                                            <a
                                                href="http://www.emailquestions.com/spf-wizard/"
                                                target="_blank"
                                            >
                                                SPF wizard
                                            </a>
                                        </li>{" "}
                                    </ul>
                                </div>
                                <p>
                                    Note: Link will be opened to the third party
                                    website
                                </p>
                                <h3>MX Record</h3>
                                <p>
                                    Create/replace a single MX record in the
                                    format:
                                </p>
                                <div className="green-bg-text">
                                    Host: @ <br />
                                    Priority: 10 <br />
                                    Value: custom.mailum.com
                                </div>
                                <h3>Owner</h3>
                                <p>
                                    This will indicate If the system was able to
                                    verify your ownership over the domain.
                                </p>
                                <h3>DKIM</h3>
                                <p className="break-all">
                                    DKIM is a digital signature that is sent
                                    along with email to verify that a server is
                                    authorized to send email on behalf of your
                                    domain. This is another step to comply and
                                    pass spam check. Please create the TXT
                                    record in the format:
                                </p>
                                <div className="green-bg-text">
                                    Paste the content of DKIM Record Answer
                                </div>
                                <h3>Status</h3>
                                <p>
                                    Our servers occasionally check your DNS
                                    records to verify that all information is
                                    correct, and it will warn you if there are
                                    any errors that need to be fixed.
                                </p>
                                <h3>
                                    More information is available on our blog
                                </h3>

                                <div className="blue-bg-text">
                                    <a
                                        href="https://blog.cyberfear.com/adding-custom-domain/"
                                        target="_blank"
                                        className="to-copy"
                                    >
                                        https://blog.cyberfear.com/adding-custom-domain/
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
