define(['react', 'app', 'summernote'], function (React, app, summernote) {
    "use strict";


    return React.createClass({
        getInitialState: function () {
            return {

                panel: {
                    firstPanelClass: "panel-body hidden",
                    secondPanelClass: "panel-body",
                    firstTab: "hidden",
                    secondTab: "active"
                },

                firstPanelData: {
                    showDisplayName: app.user.get("showDisplayName"),
                    displayName: app.user.get("displayName")
                },

                sessionExpiration: app.user.get("sessionExpiration"),
                mailPerPage: app.user.get("mailPerPage"),
                remeberPassword: app.user.get("remeberPassword"),

            secondPanelData: {
                    enableForwarding: app.user.get("enableForwarding"),
                    forwardingAddress: app.user.get("forwardingAddress"),
                    notificationSound: app.user.get("notificationSound"),
                    enableNotification: app.user.get("enableNotification"),
                    notificationAddress: app.user.get("notificationAddress")
                },
                defaultPGPStrength:app.user.get('defaultPGPKeybit'),

                emfValidator: {},
                emNotValidator: {}

            };
        },

        /**
         *
         */
        componentDidMount: function () {

            React.initializeTouchEvents(true);

            this.setState({emfValidator: $("#forwForm").validate()});

            $("#emForwInp").rules("add", {
                email: true,
                required: true,
                minlength: 3,
                maxlength: 200
            });

            this.setState({emNotValidator: $("#notForm").validate()});

            $("#emNotInp").rules("add", {
                email: true,
                required: true,
                minlength: 3,
                maxlength: 200
            });

            //this.handleClick('showAccSett');

        },
        ifSecondPanelSave: function () {
            if (
                this.state.sessionExpiration === app.user.get("sessionExpiration") &&
                    this.state.mailPerPage === app.user.get("mailPerPage") &&
                    this.state.remeberPassword === app.user.get("remeberPassword") &&
                    this.state.secondPanelData.enableForwarding === app.user.get("enableForwarding") &&
                    this.state.secondPanelData.forwardingAddress === app.user.get("forwardingAddress") &&
                    this.state.secondPanelData.notificationSound === app.user.get("notificationSound") &&
                    this.state.secondPanelData.enableNotification === app.user.get("enableNotification") &&
                    this.state.secondPanelData.notificationAddress === app.user.get("notificationAddress") &&
                    this.state.defaultPGPStrength === app.user.get("defaultPGPKeybit")


                ) {
                return true;
            } else {
                return false;
            }

        },
        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleChange: function (i, event) {
            switch (i) {
                case 'displayNameCheck':
                    this.setState({
                        firstPanelData: {
                            showDisplayName: !this.state.firstPanelData.showDisplayName,
                            displayName: this.state.firstPanelData.displayName
                        }
                    });
                    break;

                case 'dispNameChange':
                    this.setState({
                        firstPanelData: {
                            showDisplayName: this.state.firstPanelData.showDisplayName,
                            displayName: event.target.value
                        }
                    });
                    break;


                case 'remPass':
                    this.setState(
                        {
                            remeberPassword: !this.state.remeberPassword
                        });
                    break;

                case 'mailPerPage':

                    this.setState(
                        {
                            mailPerPage: event.target.value
                        });
                    break;

                case 'sessTime':


                    this.setState(
                        {
                            sessionExpiration: event.target.value
                        });
                    break;
                case 'changeSound':

                    this.setState(
                        {
                            secondPanelData: {
                                enableForwarding: this.state.secondPanelData.enableForwarding,
                                forwardingAddress: this.state.secondPanelData.forwardingAddress,
                                notificationSound: event.target.value,
                                enableNotification: this.state.secondPanelData.enableNotification,
                                notificationAddress: this.state.secondPanelData.notificationAddress
                            }
                        });
                    break;
                case 'enabForw':
                    this.setState(
                        {
                            secondPanelData: {
                                enableForwarding: !this.state.secondPanelData.enableForwarding,
                                forwardingAddress: this.state.secondPanelData.forwardingAddress,
                                notificationSound: this.state.secondPanelData.notificationSound,
                                enableNotification: this.state.secondPanelData.enableNotification,
                                notificationAddress: this.state.secondPanelData.notificationAddress
                            }
                        });

                    $("#emForwInp").removeClass("invalid");
                    $("#emForwInp").removeClass("valid");

                    var validator = $("#forwForm").validate();
                    validator.resetForm();
                    break;

                case 'enabEmNot':
                    this.setState(
                        {
                            secondPanelData: {

                                enableForwarding: this.state.secondPanelData.enableForwarding,
                                forwardingAddress: this.state.secondPanelData.forwardingAddress,
                                notificationSound: this.state.secondPanelData.notificationSound,
                                enableNotification: !this.state.secondPanelData.enableNotification,
                                notificationAddress: this.state.secondPanelData.notificationAddress
                            }
                        });

                    $("#emNotInp").removeClass("invalid");
                    $("#emNotInp").removeClass("valid");

                    var validatornotForm = $("#notForm").validate();
                    validatornotForm.resetForm();


                    break;
                case 'entEmNot':
                    this.setState(
                        {

                            secondPanelData: {
                                enableForwarding: this.state.secondPanelData.enableForwarding,
                                forwardingAddress: this.state.secondPanelData.forwardingAddress,
                                notificationSound: this.state.secondPanelData.notificationSound,
                                enableNotification: this.state.secondPanelData.enableNotification,
                                notificationAddress: event.target.value
                            }
                        });
                    break;

                case 'entEmFow':
                    this.setState(
                        {
                            secondPanelData: {
                                enableForwarding: this.state.secondPanelData.enableForwarding,
                                forwardingAddress: event.target.value,
                                notificationSound: this.state.secondPanelData.notificationSound,
                                enableNotification: this.state.secondPanelData.enableNotification,
                                notificationAddress: this.state.secondPanelData.notificationAddress
                            }
                        });
                    break;

                case 'pgpStr':
                    this.setState({
                        defaultPGPStrength:event.target.value
                    });
                    break;

            }
        },

        /**
         *
         * @param {string} i
         * @param {object} event
         */
        handleClick: function (i, event) {
            switch (i) {
                case 'showUprof':
                    this.setState(
                        {
                            panel: {
                                firstPanelClass: "panel-body",
                                secondPanelClass: "panel-body hidden",
                                firstTab: "active",
                                secondTab: ""
                            }
                        });

                    break;
                case 'showAccSett':
                    this.setState({
                        panel: {
                            firstPanelClass: "panel-body hidden",
                            secondPanelClass: "panel-body",
                            firstTab: "",
                            secondTab: "active"
                        }
                    });
                    break;
                case 'hSessTime':
                    console.log('fff');
                    break;
                case 'resetProfile':
                    this.setState(
                        {
                            firstPanelData: {
                                showDisplayName: app.user.get("showDisplayName"),
                                displayName: app.user.get("displayName")
                            }
                        });

                    if (app.user.get("includeSignature")) {
                        $('#signDiv').removeClass('div-readonly');
                    } else {
                        $('#signDiv').addClass('div-readonly');
                    }
                    break;

                case 'resetAccSett':

                    this.setState(
                        {
                            sessionExpiration:app.user.get("sessionExpiration"),
                            mailPerPage: app.user.get("mailPerPage"),
                            remeberPassword: app.user.get("remeberPassword"),

                            secondPanelData: {


                                enableForwarding: app.user.get("enableForwarding"),
                                forwardingAddress: app.user.get("forwardingAddress"),
                                notificationSound: app.user.get("notificationSound"),
                                enableNotification: app.user.get("enableNotification"),
                                notificationAddress: app.user.get("notificationAddress")
                            }
                        });

                    $("#emNotInp").removeClass("invalid");
                    $("#emNotInp").removeClass("valid");

                    var validator = $("#notForm").validate();
                    validator.resetForm();

                    $("#emForwInp").removeClass("invalid");
                    $("#emForwInp").removeClass("valid");

                    var validatorforwForm = $("#forwForm").validate();
                    validatorforwForm.resetForm();

                    break;

                case 'safeAccSett':

                    var emfValidator = this.state.emfValidator;
                    var emNotValidator = this.state.emNotValidator;

                    emfValidator.form();
                    emNotValidator.form();

                    if (emfValidator.numberOfInvalids() === 0 && emNotValidator.numberOfInvalids() === 0) {

                        app.user.set({"sessionExpiration": this.state.sessionExpiration});
                        app.user.set({"mailPerPage": this.state.mailPerPage});
                        app.user.set({"defaultPGPKeybit": parseInt(this.state.defaultPGPStrength)});



                        app.user.set({"remeberPassword": this.state.remeberPassword});

                        if(!this.state.remeberPassword){
                            app.user.set({"password":''});
                            app.user.set({"secondPassword":''});
                        }
                        /*
                        app.user.set({"enableForwarding": this.state.secondPanelData.enableForwarding});
                        app.user.set({"enableNotification": this.state.secondPanelData.enableNotification});


                        if (this.state.secondPanelData.enableForwarding) {
                            app.user.set({"forwardingAddress": this.state.secondPanelData.forwardingAddress});
                        }

                        if (this.state.secondPanelData.notificationSound != 0) {
                            app.user.set({"notificationSound": this.state.secondPanelData.notificationSound});
                        }

                        if (this.state.secondPanelData.enableNotification) {
                            app.user.set({"notificationAddress": this.state.secondPanelData.notificationAddress});
                        }
                        */

                        app.userObjects.updateObjects('userProfile','',function(response){
                            //restore copy of the object if failed to save
                            if(response==='success'){
                                //app.user.set({"DecryptedProfileObject":profile});
                                //app.userObjects.set({"EncryptedProfileObject":newProfObj});
                                //console.log('ura');
                            }else if(response==='failed'){

                            }else if(response==='nothing'){

                            }

                        });
                    }


                    //	console.log(changeObj, 'saveAccountSettings');
                    break;


                case 'safeProfile':

                    app.user.set({"showDisplayName": this.state.firstPanelData.showDisplayName});

                    if (this.state.firstPanelData.showDisplayName) {
                        app.user.set({"displayName": filterXSS(this.state.firstPanelData.displayName)});
                    }

                    app.userObjects.updateObjects('userProfile1');//obsolete
                    break;

            }
        },

        /**
         *
         * @returns {Array}
         * @constructor
         */
        PGPbitList:function(){
            var options=[];

            for(var i=1024;i<=5120;i+=1024){
                if(i<=app.user.get('userPlan')['planData']['pgpStr']){
                    options.push(
                        <option key={i} value={i}>{i} bits

                        </option>
                    );
                }else{
                    options.push(
                        <option key={i} disabled={true} value={i}>{i} bits

                        </option>
                    );
                }

            }

            return options;
            console.log(app.user.get('userPlan')['planData']['pgpStr']);
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            //{/* onClick={this.handleClick.bind(this, 'showAccSett')}*/}
            var showDisp = {visibility: !this.state.firstPanelData.showDisplayName ? 'hidden' : ''};
            //console.log('ddsd');
            return (
                <div className={this.props.classes.rightClass} id="rightSettingPanel">

                    <div className="col-lg-7 col-xs-12 personal-info ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <ul className="nav nav-tabs tabbed-nav">
                                    <li role="presentation" className={this.state.panel.firstTab}>
                                        <a onClick={this.handleClick.bind(this, 'showUprof')}>
                                            <h3 className={this.props.tabs.Header}>Info</h3>
                                            <h3 className={this.props.tabs.HeaderXS}><i className="ion-person"></i></h3>
                                        </a>
                                    </li>
                                    <li role="presentation" className={this.state.panel.secondTab}>
                                       <a>
                                            <h3 className={this.props.tabs.Header}>Profile Settings</h3>
                                            <h3 className={this.props.tabs.HeaderXS}><i className="ion-android-options"></i></h3>
                                        </a>
                                    </li>
                                </ul>

                            </div>

                            <div className={this.state.panel.firstPanelClass}>

                                <div className="form-group">
                                    <h3 className="" style={showDisp}>{this.state.firstPanelData.displayName}
                                        <br/>
                                    </h3>
                                &lt;{app.user.get("email")}&gt;
                                </div>

                                <div className="form-group">
                                    <input className="pull-left" type="checkbox" checked={this.state.firstPanelData.showDisplayName} onChange={this.handleChange.bind(this, 'displayNameCheck')} />
                                &nbsp;
                                    <label>display name</label>

                                    <input type="name" className="form-control" readOnly={!this.state.firstPanelData.showDisplayName} onChange={this.handleChange.bind(this, 'dispNameChange')} placeholder="Enter name"
                                    value={this.state.firstPanelData.displayName}
                                    />
                                </div>

                                <div className="pull-right">
                                    <button type="button" className="btn btn-primary"
                                    onClick={this.handleClick.bind(this, 'safeProfile')}
                                    disabled={this.state.firstPanelData.showDisplayName == app.user.get("showDisplayName") && this.state.firstPanelData.displayName == app.user.get("displayName")}
                                    >Save</button>
                                    <button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'resetProfile')}>Cancel</button>
                                </div>
                            </div>


                            <div className={this.state.panel.secondPanelClass}>

                                <div className={this.props.classes.classActSettSelect}>
                                    <div className="form-group">
                                        <select className="form-control" onChange={this.handleChange.bind(this, 'sessTime')} value={this.state.sessionExpiration}>
                                            <option value="0" disabled>Select Session Time Out</option>
                                            <option value="-1">Disable Timeout</option>
                                            <option value="600">10 Minutes</option>
                                            <option value="1800">30 Minutes</option>
                                            <option value="3600">1 Hour</option>
                                            <option value="10800">3 Hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={this.props.classes.classActSettSelect}>
                                    <div className="form-group">
                                        <select className="form-control" onChange={this.handleChange.bind(this, 'mailPerPage')} value={this.state.mailPerPage}>
                                            <option value="0" disabled>Emails per page</option>
                                            <option value="10">10 Emails per page</option>
                                            <option value="25">25 Emails per page</option>
                                            <option value="50">50 Emails per page</option>
                                            <option value="100">100 Emails per page</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={this.props.classes.classActSettSelect}>
                                    <div className="form-group">
                                        <select className="form-control" onChange={this.handleChange.bind(this, 'pgpStr')} value={this.state.defaultPGPStrength}>
                                            <option value="0" disabled>Default PGP bits</option>
                                        {this.PGPbitList()}
                                        </select>
                                    </div>
                                </div>

                                <div className={this.props.classes.classActSettSelect+" hidden"}>
                                    <div className="form-group">
                                        <select className="form-control" onChange={this.handleChange.bind(this, 'changeSound')} value={this.state.secondPanelData.notificationSound}>
                                            <option value="0" disabled>New Email Notification Sound</option>
                                            <option value="">Disable Sound</option>
                                            <option value="10">Bell</option>
                                            <option value="25">lala</option>
                                            <option value="50">lolo</option>
                                            <option value="100">lambada</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="clearfix"></div>
                                <div className={this.props.classes.classActSettSelect +" hidden"}>
                                    <form id="forwForm">
                                        <div className="form-group">
                                            <input className="pull-left" type="checkbox" checked={this.state.secondPanelData.enableForwarding} onChange={this.handleChange.bind(this, 'enabForw')} />
                                        &nbsp;
                                            <label>Enable Email Forwarding</label>
                                            <input type="email" name="email" id="emForwInp" className="form-control"
                                            disabled={!this.state.secondPanelData.enableForwarding} placeholder="Email Forward"
                                            value={this.state.secondPanelData.forwardingAddress}
                                            onChange={this.handleChange.bind(this, 'entEmFow')}/>
                                        </div>
                                    </form>
                                </div>

                                <div className={this.props.classes.classActSettSelect +" hidden"}>
                                    <form id="notForm">
                                        <div className="form-group">
                                            <input className="pull-left" type="checkbox" checked={this.state.secondPanelData.enableNotification} onChange={this.handleChange.bind(this, 'enabEmNot')} />
                                        &nbsp;
                                            <label>Enable Email Notification</label>
                                            <input type="email"  name="email" id="emNotInp" className="form-control"
                                            disabled={!this.state.secondPanelData.enableNotification} placeholder="Email Notification"
                                            value={this.state.secondPanelData.notificationAddress}
                                            onChange={this.handleChange.bind(this, 'entEmNot')}/>
                                        </div>
                                    </form>
                                </div>

                                <div className="clearfix"></div>

                                <div className={this.props.classes.classActSettSelect}>
                                    <div className="form-group">
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox"
                                                checked={this.state.remeberPassword}
                                                onChange={this.handleChange.bind(this, 'remPass')} />
                                            Remember Password for Session
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pull-right dialog_buttons">
                                    <button type="button" className="btn btn-primary" disabled={this.ifSecondPanelSave()} onClick={this.handleClick.bind(this, 'safeAccSett')}>Save</button>
                                    <button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'resetAccSett')}>Cancel</button>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="col-lg-5 col-xs-12 personal-info ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title personal-info-title">Help</h3>

                            </div>

                            <div className="panel-body">

                                <p>
                                    <b>Default key strength bits</b> - Select the strength of the cryptography to be used for your key strength. A lower number of bits might improve speed but reduce security dramatically. A higher number of bits will take more time to process and open upon login and may not be supported by all devices if exported. The minimum recommended key strength is 2048 bits.

                                </p>
                                <p>
                                    <b>Emails per page</b> - Select the number of emails you would like to be displayed per page in your inbox and folders.
                                </p>

                                <p>
                                    <b>Timeout</b> - Select the amount of time before your current session logs out automatically and requires you to login again. You can select <b>Disable Timeout</b> to turn off this feature.(Not recommended)
                                </p>
                                <p>
                                    <b>Remember Password</b> - Check this box to keep your password in memory for the duration of the session. It will prevent the system from asking you every time you want to add or delete your email aliases or change to private keys. Enabling this feature can lower your security, if someone can gain access to your computer.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                );
        }

    });
});