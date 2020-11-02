define(['app', 'react'], function (app, React) {

    return React.createClass({

        getInitialState: function () {
            return {
                email: "",
                newPass: "",
                newPassRep: "",
                coupon:"",

                emailError: "",
                newPassError: "",
                couponError:"",
                repPassError: "",

                emailSucc: false,
                newPassSucc: false,
                repPassSucc: false,
                couponSucc:false,


                working: false,
                buttonTag: "",
                buttonText: "SIGN UP"


            };
        },

        componentDidMount: function () {

            $('#createAccount-modal').on('shown.bs.modal', function () {
            });
        },
        handleChange: function (action, event) {

            switch (action) {
                case 'coupon':
                    var thisComp=this;
                    this.setState({
                        coupon: event.target.value
                    },function(){
                        thisComp.checkCouponTyping();
                    });
                    break
                case 'email':

                    var thisComp=this;
                    var email = event.target.value;
                    console.log(email.length);
                    if (email.indexOf("@") !== -1) {
                        this.setState({
                            emailError: "please enter only first part of email, without @"
                        });
                    }else if (email.length<3) {
                        this.setState({
                            emailError: "minimum 3 character"
                        });
                    }else if (email.length>250) {
                        this.setState({
                            emailError: "maximum 250 character"
                        });
                    }else{
                        this.setState({
                            emailError: ""
                        });
                    }

                    this.setState({
                        email: event.target.value
                    },function(){
                        thisComp.checkEmailTyping();
                    });


                    break;
                case 'newPass':
                    var newPass = event.target.value;

                    if (newPass.length < 6) {
                        this.setState({
                            newPassError: "Please use password bigger than 6 characters",
                            newPassSucc: false,
                            repPassError: "",
                            repPassSucc: false
                        });
                    } else if (newPass.length > 80) {
                        this.setState({
                            newPassError: "Please use password less than 80 characters",
                            newPassSucc: false,
                            repPassError: "",
                            repPassSucc: false
                        });
                    } else {
                        this.setState({
                            newPassError: "",
                            newPassSucc: true,
                            repPassError: "",
                            repPassSucc: false
                        });
                    }

                    this.setState({
                        newPass: newPass,
                    });
                    break;
                case 'newPassRep':

                    var newPassRep = event.target.value;


                    if (this.state.newPass !== event.target.value) {
                        this.setState({
                            repPassError: "Please enter the same password as above",
                            repPassSucc: false
                        });
                    } else {
                        this.setState({
                            repPassError: "",
                            repPassSucc: true
                        });
                    }

                    this.setState({
                        newPassRep: event.target.value
                    });

                    break;
            }
        },

        checkFields:function(){
            var thisComp=this;

            thisComp.setState({
                working: true,
                buttonTag: "fa fa-refresh fa-spin",
                buttonText: "WORKING.."
            });

            var def= $.Deferred();


            var  em={target:{value:this.state.email}};
            this.handleChange('email',em);

            var  newPass={target:{value:this.state.newPass}};
            this.handleChange('newPass',newPass);

            var  newPassRep={target:{value:this.state.newPassRep}};
            this.handleChange('newPassRep',newPassRep);

           setTimeout(function(){
               if(thisComp.state.emailError=="" &&
                   thisComp.state.newPassError=="" &&
                   thisComp.state.repPassError=="" &&
                   thisComp.state.couponError==""
                    ){
                   def.resolve(true);
               }else{
                   def.reject();
                   thisComp.setState({
                       working: false,
                       buttonTag: "",
                       buttonText: "SIGN UP"
                   });
               }
           },400);


            return def;
        },


        generateUser: function () {
            var thisComp=this;

            this.checkFields()
            .then(function(msg){

                    var userAddress = thisComp.state.email.toLowerCase().split('@')[0];
                    var email = userAddress + app.defaults.get('domainMail').toLowerCase();

                    var pass = app.transform.SHA512(app.globalF.makeDerivedFancy(thisComp.state.newPass, app.defaults.get('hashToken')));
                    var folderKey = app.globalF.makeRandomBytes(32);
                    var salt = app.globalF.makeRandomBytes(256);
                    var secret = app.globalF.makeDerived(thisComp.state.newPass, salt);

                    //console.log();
                    app.generate.generateUserObjects(email, pass, secret, folderKey, salt)
                        .then(function (userObj) {

                            userObj['newPass']=pass;
                            userObj['salt']=app.transform.bin2hex(salt);
                            userObj['coupon']=thisComp.state.coupon;

                           $.ajax({
                                method: "POST",
                                url: app.defaults.get('apidomain')+"/createNewUserV2",
                                data: userObj,
                                dataType: "json",
                               xhrFields: {
                                   withCredentials: true
                               }
                            })
                                .then(function (msg) {

                                    if(msg['response']==='fail'){
                                        if(msg['data']==='limitIsReached'){
                                            app.notifications.systemMessage('once5min');
                                        }else{
                                            app.notifications.systemMessage('tryAgain');
                                        }


                                    }else if(msg['response']==='success'){
                                        $('#tokenModHead').html('Your account was successfully created!');

                                        $('#createAccount-modal').modal('hide');
                                        $('#tokenModBody').html('Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="https://blog.cyberfear.com/reset-password" target="_blank">blog</a>');


                                        $('#tokenModal').modal('show');
                                    }

                                    thisComp.setState({
                                        working: false,
                                        buttonTag: "",
                                        buttonText: "SIGN UP"
                                    });

                                   // console.log(msg)
                                });


                        });

                });




            //app.genea

        },
        checkCouponTyping: function () {

            var thisComp = this;
            if(thisComp.state.coupon.length>=0)
            {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get('apidomain')+"/checkCouponExistV2",
                    data: {
                        coupon: this.state.coupon

                    },
                    dataType: "text",
                    xhrFields: {
                        withCredentials: true
                    },
                })
                    .done(function (msg) {
                        if (msg === 'false' &&  thisComp.state.coupon.length>0) {
                            thisComp.setState({
                                couponError: "coupon not valid",
                                couponSucc:false
                            });
                        } else if (msg === 'true' || thisComp.state.coupon.length==0) {
                            thisComp.setState({
                                couponError: "",
                                couponSucc:true
                            });
                        }
                    });
            }


        },

        checkEmailTyping: function () {
            var thisComp = this;
            if(thisComp.state.email.length>=3)
            {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get('apidomain')+"/checkEmailExistV2",
                    data: {
                        fromEmail: this.state.email + app.defaults.get('domainMail').toLowerCase()

                    },
                    dataType: "text"
                })
                    .done(function (msg) {
                        if (msg === 'false') {
                            thisComp.setState({
                                emailError: "email exists"
                            });
                        } else if (msg === 'true' && thisComp.state.email.length>2 && thisComp.state.email.length<250) {
                            thisComp.setState({
                                emailError: ""
                            });
                        }
                    });
            }


        },

        checkEmail: function () {
            var thisComp = this;
            $.ajax({
                method: "POST",
                url: app.defaults.get('apidomain')+"/checkEmailExistV2",
                data: {
                    fromEmail: this.state.email + '@CyberFear.com'

                },
                dataType: "text"
            })
                .done(function (msg) {
                    if (msg === 'false') {
                        thisComp.setState({
                            emailError: "email exists"
                        });
                    } else if (msg === 'true') {
                        thisComp.generateUser();
                    } else if(JSON.parse(msg)['email']!=undefined) {
                        thisComp.setState({
                            emailError: JSON.parse(msg)['email']
                        });
                    }else{
                        app.notifications.systemMessage('tryAgain');
                    }
                });

        },
        handleClick: function (i, e) {
            switch (i) {
                case 'createUser':

                    this.checkEmail();

                    break;
                case 'enterCreateUser':
                    if (e.keyCode == 13) {

                        this.checkEmail();
                    }
                    break;
            }
        },
        render: function () {
            return (
                <div className="modal fade" id="createAccount-modal" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" onKeyDown={this.handleClick.bind(this, 'enterCreateUser')}>
                            <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <div className="row">
                                <div className="col-12 text-center heading" style={{marginBottom: "20px"}}>
                                    <img src="img/checklist.svg" height="25"/><br/>
                                        CREATE AN ACCOUNT
                                </div>
                            </div>
                            <div className="row">

                                <form className="registration-form smart-form" id="createUser">
                                    <div
                                        className={"form-group "+(this.state.emailError!=""?"has-error":"") + (this.state.emailSucc?"has-success":"")}>

                                        <div className="input-group emailErr">
                                            <input type="text" name="email" id="userEmail" className="form-control input-lg"
                                                   placeholder="choose email"
                                                   maxLength="160"
                                                   onChange={this.handleChange.bind(this, 'email')}
                                                   value={this.state.email}/>
                                            <span className="input-group-addon">{app.defaults.get('domainMail').toLowerCase()}</span>
                                        </div>
                                        <label
                                            className={"control-label pull-left "+(this.state.emailError==""?"hidden":"")}
                                            htmlFor="resetEmail">{this.state.emailError}</label>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div
                                        className={"form-group "+(this.state.newPassError!=""?"has-error":"") + (this.state.newPassSucc?"has-success":"")}>
                                        <input className="form-control input-lg" name="password" id="userPassword"
                                               type="password" placeholder="password"
                                               onChange={this.handleChange.bind(this, 'newPass')}
                                               value={this.state.newPass}/>
                                        <label
                                            className={"control-label pull-left "+(this.state.newPassError==""?"hidden":"")}
                                            htmlFor="newPass">{this.state.newPassError}</label>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div
                                        className={"form-group "+(this.state.repPassError!=""?"has-error":"") + (this.state.repPassSucc?"has-success":"")}>

                                        <input className="form-control input-lg" name="passwordrepeat"
                                               id="userPasswordRepeat" type="password" placeholder="repeat password"
                                               onChange={this.handleChange.bind(this, 'newPassRep')}
                                               value={this.state.newPassRep}/>
                                        <label
                                            className={"control-label pull-left "+(this.state.repPassError==""?"hidden":"")}
                                            htmlFor="newPassRep">{this.state.repPassError}</label>
                                    </div>
                                    <div className="clearfix"></div>

                                    <div
                                        className="form-group hidden">
                                        <span className="pull-left">Please type into field below</span>

                                        <input className="form-control input-lg" name="robotText"
                                               id="imrobot" type="text" placeholder="I'm no robot"
                                               onChange={this.handleChange.bind(this, 'norobot')}
                                               value={this.state.norobot}/>
                                        <label
                                            className={"control-label pull-left "+(this.state.repPassError==""?"hidden":"")}
                                            htmlFor="newPassRep">{this.state.repPassError}</label>
                                    </div>

                                    <div className="clearfix"></div>
                                    <div className="clearfix"></div>
                                    <div
                                        className={"form-group "+(this.state.couponError!=""?"has-error":"") + (this.state.couponSucc?"has-success":"")}>
                                        <input className="form-control input-lg" name="password" id="coupon"
                                               type="text" placeholder="if you have please enter coupon code here"
                                               onChange={this.handleChange.bind(this, 'coupon')}
                                               value={this.state.coupon}/>
                                        <label
                                            className={"control-label pull-left "+(this.state.couponError==""?"hidden":"")}
                                            htmlFor="newPass">{this.state.couponError}</label>
                                    </div>
                                    <div className="clearfix"></div>
                                    <button className="dark-btn w-100 py-2" type="button"
                                            style={{fontSize:"14px",fontFamily: 'Rodus-Square',padding: "9px 30px",width:"100%"}} disabled={this.state.working}
                                            onClick={this.handleClick.bind(this, 'createUser')}>{this.state.buttonText}
                                    </button>
                                    <div className="text-center" style={{fontSize:"13px",fontFamily: 'Rodus-Square',fontWeight:"500",marginTop:"10px"}}>
                                        By clicking “Create Account” you  agree with our <a href="/terms.html"
                                                                                          target="_blank" style=
                                                                                                {{fontWeight:"700"}}> Terms of Service </a>

                                    </div>

                                    <div className="share hidden">
                                        <a className="" href="https://facebook.com/sharer/sharer.php?u=https://cyberfear.com" target="_blank" aria-label=""><i className="fa fa-facebook fa-lg"></i></a>

                                        <a className="" href="https://twitter.com/intent/tweet/?text=I'm protecting my emails with cyberfear.com.&amp;url=https://cyberfear.com" target="_blank" aria-label=""><i className="fa fa-twitter fa-lg"></i></a>

                                        <a className="" href="https://plus.google.com/share?url=https://cyberfear.com" target="_blank" aria-label=""><i className="fa fa-google-plus fa-lg"></i></a>

                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }

    });
});