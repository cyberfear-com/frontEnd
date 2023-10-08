define([
    "react",
    "app",
    "dataTable",
    "dataTableBoot",
    "cmpld/authorized/settings/rightpanel/rightTop",
    "quill",
], function (React, app, DataTable, dataTableBoot, RightTop, Quill) {
    "use strict";
    return React.createClass({
        getInitialState: function () {
            return {
                viewFlag: false,
                dataAlias: this.getAliasData(),
                aliasForm: {},
                aliasEmail: "",
                quill:{},
                sigE:"",
                nameE:"",

                includeSignature: false,
                signature: "",
                domain: app.defaults.get("domainMail").toLowerCase(),
                domains: [],

                pageTitle: `Add alias`,
                disabled:true,

                showDisplayName: app.user.get("showDisplayName"),
                aliasName: app.user.get("displayName"),
            };
        },
        /**
         *
         * @returns {Array}
         */
        getAliasData: function () {
            var alEm = [];

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                if (emailData["addrType"] == 3 || emailData["addrType"] == 1) {
                    var el = {
                        DT_RowId: email64,
                        checkbox:
                            '<label class="container-checkbox d-none"><input type="checkbox" name="inbox-email" /><span class="checkmark"></span></label>',
                        email:emailData["addrType"] == 1?"<b>" +app.transform.from64str(emailData["email"]) +"</b>": app.transform.from64str(emailData["email"]),
                        name:emailData["addrType"] == 1?"<b>" +app.transform.escapeTags(app.transform.from64str(emailData["name"])) +"</b>": app.transform.escapeTags(
                            app.transform.from64str(emailData["name"])
                        ),
                        edit: '<a class="table-icon edit-button d-none"></a>',
                        delete: emailData["addrType"] == 1?"":'<button class="table-icon delete-button"></button>',
                        options:
                            '<div class="dropdown d-none"><button class="btn btn-secondary dropdown-toggle table-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button></div>',
                        main:emailData["addrType"] == 1?1:0,
                    };
                    alEm.push(el);
                }
                /**
                 * { data: "checkbox" },
                    { data: "email" },
                    { data: "name" },
                    { data: "edit" },
                    { data: "delete" },
                    { data: "options" },
                 */
            });

            //console.log(app.user.get("allKeys"));
            return alEm;
        },
        domains: function () {
            var thisComp = this;
            var options = [];
            app.serverCall.ajaxRequest(
                "availableDomainsForAlias",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        var localDomain = app.user.get("customDomains");

                        $.each(result["data"], function (index, domain) {
                            options.push(
                                <option
                                    key={"@" + domain["domain"]}
                                    value={"@" + domain["domain"]}
                                >
                                    {"@" + domain["domain"]}
                                </option>
                            );

                            if (
                                localDomain[
                                    app.transform.to64str(domain["domain"])
                                ] !== undefined
                            ) {
                                var selDomain =
                                    localDomain[
                                        app.transform.to64str(domain["domain"])
                                    ];

                                if (
                                    selDomain["subdomain"] !== undefined &&
                                    selDomain["subdomain"].length > 0
                                ) {
                                    $.each(
                                        selDomain["subdomain"],
                                        function (ind, subdom64) {
                                            var domStr =
                                                app.transform.from64str(
                                                    subdom64
                                                );
                                            options.push(
                                                <option
                                                    key={"@" + subdom64}
                                                    value={
                                                        "@" +
                                                        domStr +
                                                        "." +
                                                        selDomain["domain"]
                                                    }
                                                >
                                                    {"@" +
                                                        domStr +
                                                        "." +
                                                        selDomain["domain"]}
                                                </option>
                                            );
                                        }
                                    );
                                }
                            }
                        });

                        thisComp.setState({
                            domains: options,
                        });
                    } else {
                        app.notifications.systemMessage("tryAgain");
                    }
                }
            );
        },
        componentWillUpdate: function (nextProps, nextState) {
           /* if (nextState.signature != this.state.signature) {
                $(".note-editable").html(nextState.signature);
            }

            if (nextState.signatureEditable != this.state.signatureEditable) {
                $(".note-editable").attr(
                    "contenteditable",
                    nextState.signatureEditable
                );
            }*/

            if (
                JSON.stringify(nextState.dataAlias) !==
                JSON.stringify(this.state.dataAlias)
            ) {
                var t = $("#table1").DataTable();
                t.clear();
                var dataAlias = nextState.dataAlias;
                t.rows.add(dataAlias);
                t.draw(false);
            }
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
        fake:function(){
            console.log('logging in');
        },
        componentDidMount: function () {
            var thsComp = this;

       //     $(".note-editable").attr("contenteditable", "false");

            // Initiate editor toolbar [Quill]
            const quill = new Quill("#com-the-con-editor__alias", {
                modules: {
                    toolbar: "#editor_toolbar",
                },
                handlers: {
                    link: function (value) {
                        if (value) {
                            const href = prompt("Enter the URL");
                            this.quill.format("link", href);
                        } else {
                            this.quill.format("link", false);
                        }
                    },
                },
                placeholder:'',

                //onChange:{this.handleChange.bind(null,"changeSig")},
            });

            quill.on('text-change', function() {
                thsComp.setState({
                    signature:quill.getText(),
                    sigE:quill.getLength()>500?"Please use signature less than 500 Characters":""
                })
                console.log('Text change!');
                console.log(quill.getLength());
            });
            this.setState({
                quill:quill
            })

            $("#table1").dataTable({
                dom: '<"middle-search"f>t<"mid-pagination-row"<"pagi-left"i><"pagi-right"p>>',
                data: thsComp.state.dataAlias,
                columns: [
                    { data: "checkbox" },
                    { data: "email" },
                    { data: "name" },
                    { data: "edit" },
                    { data: "delete" },
                    { data: "options" },
                    { data: "main" },
                ],
                columnDefs: [
                    { sClass: "d-none", targets: [6] },
                    { orderDataType: "data-sort", targets: [1, 2] },
                    { sClass: "col-options-width", targets: [0, -1] },
                    {
                        sClass: "data-cols col-content-width_one_half",
                        targets: [1, 2],
                    },
                    { sClass: "col-mobile-hide", targets: [3, 4] },

                ],
                order: [[6, "desc"],[1, "asc"]],
                language: {
                    emptyTable: "Empty",
                    sSearch: "",
                    searchPlaceholder: "Find something...",
                    // info: "_START_ to _END_ of _TOTAL_",
                    info: "Showing _START_ - _END_ of _TOTAL_ result",
                    infoEmpty: "No entries",
                    paginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>",
                    },
                },
            });
            $.validator.addMethod(
                "uniqueUserName",
                function (value, element) {
                    var isSuccess = false;
                    var email = $("#fromAliasEmail").val().toLowerCase();
                    email = email.split("@")[0] + $("#aliasDomain").val();

                    if (app.globalF.IsEmail(email)) {
                        return true;
                    } else return false;
                },
                "no special symbols"
            );

            this.setState({ aliasForm: $("#addNewAliasForm").validate() });
            //console.log(this.state.domain);

            $("#fromAliasName").rules("add", {
                required: false,
                minlength: 1,
                maxlength: 80
            });

            $("#fromAliasEmail").rules("add", {
                required: true,
                minlength: 3,
                maxlength: 90,
                uniqueUserName: true,
                remote: {
                    url: app.defaults.get("apidomain") + "/checkEmailExistV2",
                    type: "post",
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        fromEmail: function () {
                            var email = $("#fromAliasEmail")
                                .val()
                                .toLowerCase();
                            email =
                                email.split("@")[0] + $("#aliasDomain").val();
                            return email;
                        },
                    },
                },
                messages: {
                    remote: "already in use",
                },
            });

            this.domains();
        },
        ifReady(){
            if(this.state.aliasEmail.length>0
            ){
                this.setState({
                    saveDisabled:false
                })
            }
        },
        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleChange: function (action, event) {
            switch (action) {

                case "editAlias":
                    var keys = app.user.get("allKeys")[event];

                    if (keys["addrType"] == 1) {
                        this.setState({
                            deleteAlias: "hidden",
                        });
                    } else {
                        this.setState({
                            deleteAlias: "",
                        });
                    }
                    this.setState({
                        viewFlag: true,
                        button1enabled: true,
                        button1iClass: "",
                        button1visible: "hidden",
                        disabled:true,

                        aliasId: event,
                        pageTitle: app.transform.from64str(event),
                        aliasName: app.transform.from64str(keys["name"]),

                        isDefault: keys["isDefault"],
                        saveDisabled:false,
                        includeSignature: keys["includeSignature"],
                        signature: app.transform.from64str(keys["signature"]),

                        aliasNameEnabled: false,
                        signatureEditable: false,
                    });
                    this.state.quill.pasteHTML(app.transform.from64str(keys["signature"]));

                    if(keys["includeSignature"]){
                        this.state.quill.enable()
                    }else{
                        this.state.quill.disable()
                    }

                    console.log('sigs');
                    console.log(keys);
                    break;

                case "changeDomain":
                    var validator = this.state.aliasForm;
                    validator.resetForm();
                    $("#fromAliasEmail").valid();
                    this.setState({ domain: event.target.value });
                    break;

                case "changeAliasName":
                    this.setState({ aliasName: event.target.value });

                    break;

                case "changeAliasEmail":
                    var email = event.target.value.split("@")[0];
                    this.setState({ aliasEmail: email });
                    this.ifReady();

                    break;

                case "displaySign":
                    this.setState({
                        includeSignature: !this.state.includeSignature,
                        signatureEditable: !this.state.includeSignature,
                    },function(){
                        if(this.state.includeSignature){
                            this.state.quill.enable()
                        }else{
                            this.state.quill.disable()
                        }
                    });

                    break;

                case "defaultChange":
                    this.setState({
                        isDefault: !this.state.isDefault,
                    });

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
                        viewFlag: false,
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
                case 'saveEditAlias':
                    var thisComp=this;
                    var aliasId=this.state.aliasId;
                    var validator = this.state.aliasForm;
                    validator.form();

                    if (validator.numberOfInvalids() == 0 && this.state.sigE=="") {
                        var keys=app.user.get("allKeys")[aliasId];

                        if(this.state.isDefault){
                            var keysAll=app.user.get("allKeys");

                            $.each(keysAll, function( email64, emailData ) {
                                keysAll[email64]['isDefault']=false;
                            });
                        }



                        if(keys!=undefined){

                            app.globalF.checkSecondPass(function(){
                                keys['name']=app.transform.to64str(thisComp.state.aliasName);
                                keys['displayName']=(thisComp.state.aliasName!=""?app.transform.to64str(thisComp.state.aliasName+" <"+app.transform.from64str(aliasId)+">"):aliasId),
                                    keys['includeSignature']=thisComp.state.includeSignature;
                                keys['isDefault']=thisComp.state.isDefault;

                                keys['signature']=thisComp.state.includeSignature?app.transform.to64str(app.globalF.filterXSSwhite(thisComp.state.signature)):keys['signature'];

                                app.userObjects.updateObjects('editPGPKeys','',function(result){

                                    //if (result['response'] == "success") {
                                    if(result=='saved'){
                                        thisComp.setState(
                                            {
                                                dataAlias:thisComp.getAliasData()
                                            }
                                        );

                                        thisComp.handleClick('showFirst');

                                    }else if(result=='newerFound'){
                                        //app.notifications.systemMessage('newerFnd');
                                        thisComp.handleClick('showFirst');
                                    }

                                    //}
                                });
                            });





                        }

                    }




                    break;

                case "saveNewAlias":
                    var validator = this.state.aliasForm;
                    validator.form();
                    var thisComp = this;

                    if (validator.numberOfInvalids() == 0) {
                        $("#dntModHead").html("Please Wait");
                        $("#dntModBody").html(
                            "Sit tight while we working. It may take a minute, depend on your device. Or you can cancel"
                        );

                        $("#dntOk").on("click", function () {
                            app.user.set({ inProcess: false });

                            $("#dntInter").modal("hide");
                        });

                        var email = thisComp.state.aliasEmail.toLowerCase();
                        var name = thisComp.state.aliasName;
                        var domain = thisComp.state.domain;

                        app.globalF.checkSecondPass(function () {
                            $("#dntInter").modal({
                                backdrop: "static",
                                keyboard: false,
                            });
                            thisComp.addAlDisp(name, email, domain, "alias");
                        });
                    }

                    break;

                case "addAlias":
                    var thisComp = this;

                    app.globalF.checkPlanLimits(
                        "alias",
                        thisComp.state.dataAlias.length - 1,
                        function (result) {
                            if (result) {
                                thisComp.setState({
                                    firstPanelClass: "panel-body d-none",
                                    secondPanelClass: "panel-body ",
                                    thirdPanelClass: "panel-body d-none",
                                    firstTab: "active",
                                    secondTab: "",

                                    button1visible: "d-none",
                                    signature:'',
                                });
                            } else {
                                thisComp.props.updateAct("Plan");
                                Backbone.history.navigate("settings/Plan", {
                                    trigger: true,
                                });
                            }
                        }
                    );

                    break;
                case "selectRowTab1":
                    var thisComp = this;
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
                    // Edit click functionality
                    if ($(event.target).prop("tagName").toUpperCase() === "TD" || $(event.target).prop("tagName").toUpperCase() === "B" ) {
                        var id = $(event.target).parents("tr").attr("id");

                        if (id != undefined) {
                            this.setState({
                                pageTitle: `Edit alias`,
                                disabled:true,
                                button5click:"saveEditAlias",
                            });
                            thisComp.handleChange("editAlias", id);
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
                                thisComp.deleteAlias(id);
                            }
                        }
                    }

                    // var id = $(event.target).parents("tr").attr("id");
                    // if (id != undefined) {
                    //     this.handleChange("editAlias", id);
                    // }

                    break;
                case "toggleDisplay":

                    var alDis=app.globalF.getAliasDisposableCount();

                    if(alDis['aliases']-1>=app.user.get("userPlan")["planData"]["alias"]) {
                        $("#infoModHeader").html("Please upgrade your plan.");
                        $("#infoModBody").html(
                            "You've reached your plan limit. Please upgrade plan."
                        );
                        $("#infoModal").modal("show");
                    }else{
                        this.setState({
                            viewFlag: !this.state.viewFlag,
                            pageTitle: `Add alias`,
                            aliasName:"",
                            aliasEmail:"",
                            isDefault:false,
                            signature:"",
                            saveDisabled:true,
                            includeSignature:true,
                            button5click: "saveNewAlias",
                            disabled:false
                        },function(){
                            this.state.quill.pasteHTML('<div>Sent using Encrypted Email Service -&nbsp;<a href="https://mailum.com/mailbox/#signup/' +
                                app.user.get("userPlan")["coupon"] +
                                '" target="_blank">Mailum.com</a></div>');
                        });
                    }

                    break;
            }
        },
        deleteAlias: function (id) {
            $("#dialogModHead").html("Delete");
            $("#dialogModBody").html(
                "Email alias will be deleted, and you wont be able to send or receive email with it. Continue?"
            );

            var keys = app.user.get("allKeys");
            var thisComp = this;

            $("#dialogOk").on("click", function () {
                $("#settings-spinner")
                    .removeClass("d-none")
                    .addClass("d-block");
                $("#dialogPop").modal("hide");
                app.globalF.checkSecondPass(function () {

                    console.log('deleting');
                    console.log(keys[id]);
                    if(keys[id]['isDefault']){
                        $.each(keys, function( email64, emailData ) {
                            if(keys[email64]['addrType']==1){
                                keys[email64]['isDefault']=true;
                            }
                            console.log(keys[email64]);
                            //keysAll[email64]['isDefault']=false;
                        });
                    }
                    app.user.set({ newPGPKey: keys[id] });

                    delete keys[id];
                    console.log(keys);

                    app.userObjects.updateObjects(
                        "deletePGPKeys",
                        "",
                        function (result) {
                            if (result == "saved") {
                                thisComp.setState({
                                    dataAlias: thisComp.getAliasData(),
                                });
                                thisComp.handleClick("showFirst");
                            } else if (result == "newerFound") {
                                thisComp.setState({
                                    dataAlias: thisComp.getAliasData(),
                                });
                                thisComp.handleClick("showFirst");
                            }

                            app.user.unset("newPGPKey");
                        }
                    );

                });
                $("#settings-spinner")
                    .removeClass("d-block")
                    .addClass("d-none");
            });

            $("#dialogPop").modal("show");
        },
        render: function () {
            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle alias-email">
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
                                            Alias
                                        </a>
                                    </li>
                                    <li>{this.state.aliasName!=""?this.state.aliasName:this.state.pageTitle}</li>
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
                                    <h3>Alias</h3>
                                    <div className="middle-content-top-right">
                                        <div className="add-contact-btn">
                                            <a
                                                onClick={this.handleClick.bind(
                                                    this,
                                                    "toggleDisplay"
                                                )}
                                            >
                                                <span className="icon">+</span>{" "}
                                                Add Alias
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
                                                null,
                                                "selectRowTab1"
                                            )}
                                        >
                                            <colgroup>
                                                <col width="40" />
                                                <col />
                                                <col />
                                                <col width="40" />
                                                <col width="40" />
                                                <col width="40" />
                                                <col />
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
                                                    <th scope="col">
                                                        Name{" "}
                                                        <button className="btn-sorting"></button>
                                                    </th>
                                                    <th scope="col">&nbsp;</th>
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
                                                    <th scope="col" className="d-none">
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
                                    <h3>{this.state.pageTitle}</h3>
                                </div>

                                <div className="form-section">
                                    <form id="addNewAliasForm">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="fromName"
                                                        className="form-control with-icon icon-name"
                                                        id="fromAliasName"
                                                        value={
                                                            this.state.aliasName
                                                        }
                                                        placeholder="Enter name"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeAliasName"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        name="fromEmail"
                                                        className={this.state.disabled?"d-none":"form-control with-icon icon-email"}
                                                        id="fromAliasEmail"
                                                        value={
                                                            this.state
                                                                .aliasEmail
                                                        }
                                                        placeholder="email alias"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeAliasEmail"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <select
                                                        className={this.state.disabled?"d-none":"form-select"}
                                                        value={
                                                            this.state.domain
                                                        }
                                                        id="aliasDomain"
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "changeDomain"
                                                        )}
                                                    >
                                                        {this.state.domains}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label className="container-checkbox with-label">
                                                                <input
                                                                    className="pull-left"
                                                                    type="checkbox"
                                                                    checked={
                                                                        this
                                                                            .state
                                                                            .isDefault
                                                                    }
                                                                    onChange={this.handleChange.bind(
                                                                        this,
                                                                        "defaultChange"
                                                                    )}
                                                                />
                                                                <span className="checkmark"></span>
                                                                Default
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="container-checkbox with-label">
                                                                <input
                                                                    className="pull-left"
                                                                    type="checkbox"
                                                                    checked={this.state.includeSignature}
                                                                    onChange={this.handleChange.bind(
                                                                        this,
                                                                        "displaySign"
                                                                    )}
                                                                />
                                                                <span className="checkmark"></span>
                                                                Signature
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="com-content-editor editor">
                                            <div className="c-editor-actions">
                                                <div
                                                    className="c-editor-formating ql-formats"
                                                    id="editor_toolbar"
                                                >
                                                    <button
                                                        type="submit"
                                                        className="ql-bold"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M14 36V8h11.4q3.3 0 5.725 2.1t2.425 5.3q0 1.9-1.05 3.5t-2.8 2.45v.3q2.15.7 3.475 2.5 1.325 1.8 1.325 4.05 0 3.4-2.625 5.6Q29.25 36 25.75 36Zm4.3-16.15h6.8q1.75 0 3.025-1.15t1.275-2.9q0-1.75-1.275-2.925Q26.85 11.7 25.1 11.7h-6.8Zm0 12.35h7.2q1.9 0 3.3-1.25t1.4-3.15q0-1.85-1.4-3.1t-3.3-1.25h-7.2Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-italic"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M10 40v-5h6.85l8.9-22H18V8h20v5h-6.85l-8.9 22H30v5Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-underline"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M10 42v-3h28v3Zm14-8q-5.05 0-8.525-3.45Q12 27.1 12 22.1V6h4v16.2q0 3.3 2.3 5.55T24 30q3.4 0 5.7-2.25Q32 25.5 32 22.2V6h4v16.1q0 5-3.475 8.45Q29.05 34 24 34Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="ql-blockquote"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M29 23h8v-8h-8Zm-18 0h8v-8h-8Zm20.3 11 4-8H26V12h14v14.4L36.2 34Zm-18 0 4-8H8V12h14v14.4L18.2 34ZM15 19Zm18 0Z" />
                                                            </svg>
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="ql-link"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M22.5 34H14q-4.15 0-7.075-2.925T4 24q0-4.15 2.925-7.075T14 14h8.5v3H14q-2.9 0-4.95 2.05Q7 21.1 7 24q0 2.9 2.05 4.95Q11.1 31 14 31h8.5Zm-6.25-8.5v-3h15.5v3ZM25.5 34v-3H34q2.9 0 4.95-2.05Q41 26.9 41 24q0-2.9-2.05-4.95Q36.9 17 34 17h-8.5v-3H34q4.15 0 7.075 2.925T44 24q0 4.15-2.925 7.075T34 34Z" />
                                                            </svg>
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="ql-clean"
                                                    >
                                                        <span className="icon">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <path d="M25.35 21.8 21.5 18l1.2-2.8h-3.95l-5.2-5.2H40v5H28.25ZM40.3 45.2 22.85 27.7 18.45 38H13l6-14.1L2.8 7.7l2.1-2.1 37.5 37.5Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div id="toolbar"></div>
                                            <div
                                                className={this.state.sigE?"com-the-con-editor__settings invalid":'"com-the-con-editor__settings"'}
                                                id="com-the-con-editor__alias"

                                            ></div>
                                        </div>
                                        <label id="com-the-con-editor__alias-error" className={this.state.sigE?"invalid":'d-none'} htmlFor="signature">{this.state.sigE}</label>
                                        <div className="form-section-bottom">
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
                                                    disabled={this.state.saveDisabled}
                                                    className="btn-blue fixed-width-btn"
                                                    onClick={this.handleClick.bind(
                                                        this,
                                                        this.state.button5click
                                                    )}
                                                >
                                                    {`Save`}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-right alias-email">
                        <RightTop />
                        <div className="setting-right-data">
                            <div>
                                <h2>Help</h2>
                            </div>
                            <div className="panel-body">
                                <h3>Email Aliases</h3>
                                <p>
                                    This is an alternate addresses that can be
                                    used to receive emails. Email aliases are
                                    not alternative login addresses. Using email
                                    aliases makes it possible to give out an
                                    email addresses that can't be targeted for
                                    login attacks.
                                </p>
                                <h3>Display Name</h3>
                                <p>
                                    is the real name or nickname that you would
                                    like people to see when you send email from
                                    one of your email aliases.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
