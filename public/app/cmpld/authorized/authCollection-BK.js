define(["react", "app", "xss", "cmpld/authorized/header/head", "cmpld/authorized/footer/footer", "cmpld/authorized/mailbox/mailboxCollection", "cmpld/authorized/settings/settingsCollection", "cmpld/authorized/updates/updateVersion1", "cmpld/modals/secondPass", "cmpld/modals/syncUserObj", "cmpld/modals/logOutForce", "cmpld/modals/infoPop", "cmpld/modals/askForPass", "cmpld/modals/dialogPop", "cmpld/modals/dontInterrupt"], function (React, app, xss, Header, Footer, MailboxCollection, SettingsCollection, UpdateCollection, SecondPass, SyncUserObj, LogOutForce, InfoPop, AskForPass, DialogPop, DontInterrupt) {
    var body;

    return React.createClass({
        getInitialState: function () {
            //	app.globalF.countEmailsSize();
            //	var AccountReset={
            //		'email':'',
            //		'secretToken':''
            //	};
            return {
                dfd: "",
                foderId: ""
            };
        },
        //data binding example
        /*
        updateValue:function(modifiedValue){
        console.log(this.state.AccountResetOptions);
        //this.setState.AccountResetOptions=modifiedValue;
        console.log(this.state.AccountResetOptions);
        this.setState({
        AccountResetOptions:{'email':modifiedValue}
        })
        },
        */
        componentDidMount: function () {
            //console.log(app.user.get("secondPassword"));
            //logout if refresh
            var thisMod = this;

            if (!app.user.get("userLogedIn")) {
                app.auth.logout();
            } else {
                //remove unecessary stuff
                $(".preloader").remove();
                $('link[rel=stylesheet][href="/css/splash.css"]').remove();
                $('link[rel=stylesheet][href="/css/animate.min.css"]').remove();
                $('link[rel=stylesheet][href="/css/stripe.css"]').remove();
                $("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", "/css/main1.css"));

                //check if account ready
                //console.log(app.user.get("secondPassword"));

                if (app.sessionData.get("sessionReady")) {
                    thisMod.setState({ dfd: "solved" });
                } else {
                    $("#userObjSync").modal({
                        backdrop: "static",
                        keyboard: true
                    });

                    app.userObjects.startSession(function () {
                        $("#userObjSync").modal("hide");

                        app.sessionData.set({ sessionReady: true });
                        thisMod.setState({ dfd: "solved" });

                        //console.log(app.user)
                    });
                    /*
                    if(!app.user.get("oneStep")){
                    //todo disabled to show for dev
                    if(app.defaults.dev){
                    //if development
                    }else{
                    //for production
                    //$('#secondPass').modal({
                    //		backdrop: 'static',
                    //	keyboard: true
                    //});
                    app.globalF.checkSecondPass(function(){
                    $('#userObjSync').modal({
                    backdrop: 'static',
                    keyboard: true
                    });
                    app.userObjects.startSession(function(){
                    $('#userObjSync').modal('hide');
                    app.sessionData.set({"sessionReady":true});
                    thisMod.setState({dfd: "solved"});
                    });
                    });
                    //$('#secondPass').on('hidden.bs.modal', function () {
                    //sunc local data from server or check cache for new vers
                    //if second pass is set
                    //});
                    }
                    //change into askforPass Functionality
                    }else{
                    //sunc local data from server or check cache for new vers
                    $('#userObjSync').modal({
                    backdrop: 'static',
                    keyboard: true
                    });
                    app.userObjects.startSession(function(){
                    $('#userObjSync').modal('hide');
                    app.sessionData.set({"sessionReady":true});
                    thisMod.setState({dfd: "solved"});
                    });
                    }
                    */
                }
            }
        },
        handleClick: function (i) {
            switch (i) {
                case "resetTimer":
                    app.user.startTimer();
                    break;
            }
        },
        changeFodlerId: function (foderId) {
            this.setState({
                folder: foderId
            });
        },
        componentWillUnmount: function () {},

        updateValue: function (modifiedValue) {
            this.setState(modifiedValue);

            //console.log(this.state.AccountResetOptions);
            //this.setState.AccountResetOptions=modifiedValue;
            //console.log(this.state.AccountResetOptions);
            //this.setState({
            //	AccountResetOptions:{'email':modifiedValue}
            //})
        },

        render: function () {
            var body = "";
            var page = this.props.page;

            if (this.state.dfd == "solved") {
                //console.log('page: '+page);
                //console.log('Apage: '+this.props.activePage);
                //console.log('profVers: '+app.user.get("profileVersion"));
                //

                if (page == "mailBox" && app.user.get("profileVersion") > 1) {
                    //console.log(this.props.folder);
                    body = React.createElement(MailboxCollection, {
                        pp: this.props.folder,
                        activePage: this.state.folder,
                        changeFodlerId: this.changeFodlerId,
                        folderId: this.state.folder,
                        updateValue: this.updateValue
                    });
                } else if (page == "settings" && app.user.get("profileVersion") > 1) {
                    //	console.log('settings');
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: this.props.activePage
                    });
                } else if (page == "settings" && app.user.get("profileVersion") == 1 && this.props.activePage == "updateVersion1") {
                    //	console.log('update');
                    body = React.createElement(SettingsCollection, {
                        rightPanel: this.props.rightPanel,
                        activePage: "updateVersion1"
                    });
                } else if (app.user.get("profileVersion") == 1) {
                    //console.log('redirect');
                    Backbone.history.navigate("/settings/updateVersion1", {
                        trigger: true
                    });
                }
            }

            return React.createElement(
                "div",
                {
                    className: "mailBody",
                    onClick: this.handleClick.bind(this, "resetTimer"),
                    onTouchEnd: this.handleClick.bind(this, "resetTimer"),
                    onKeyUp: this.handleClick.bind(this, "resetTimer")
                },
                React.createElement(
                    "div",
                    { className: "Top" },
                    React.createElement(Header, { changeFodlerId: this.changeFodlerId })
                ),
                body,
                React.createElement(
                    "div",
                    { className: "lds-spinner hidden", id: "spinn" },
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null)
                ),
                React.createElement("div", { id: "overlay", className: "hidden" }),
                React.createElement(Footer, null),
                React.createElement(SyncUserObj, null),
                React.createElement(SecondPass, null),
                React.createElement(LogOutForce, null),
                React.createElement(InfoPop, null),
                React.createElement(AskForPass, null),
                React.createElement(DialogPop, null),
                React.createElement(DontInterrupt, null)
            );
        }
    });
});