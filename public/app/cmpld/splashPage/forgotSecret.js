define(['react', 'app'], function (React, app) {
    return React.createClass({
        getInitialState: function () {
            return {
                email: "",
                token: "",
                secret: "",
                newPass: "",
                newPassRep: "",
                salt: "",

                emailError: "",
                tokenError: "",
                secretError: "",
                newPassError: "",
                repPassError: "",
                generateI: "",

                emailSucc: false,
                tokenSucc: false,
                secretSucc: false,
                newPassSucc: false,
                repPassSucc: false

            };
        },
        componentDidMount: function () {},

        handleChange: function (action, event) {

            switch (action) {
                case 'email':
                    var thisComp = this;
                    this.setState({
                        email: event.target.value
                    }, function () {
                        thisComp.verifyAccountStep();
                    });
                    break;

                case 'token':
                    this.setState({
                        token: event.target.value
                    });
                    break;

                case 'secret':
                    this.setState({
                        secret: event.target.value
                    });
                    break;
                case 'newPass':
                    this.setState({
                        newPass: event.target.value
                    });
                    break;
                case 'newPassRep':
                    this.setState({
                        newPassRep: event.target.value
                    });
                    break;
                case "getFile":
                    var thisComp = this;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        thisComp.setState({
                            token: reader.result
                        }, function () {
                            thisComp.verifyAccountStep();
                        });
                    };
                    reader.readAsText(event.target.files[0]);

                    break;

            }
        },
        verifyAccountStep: function () {
            var post = {
                'email': app.transform.SHA512(this.state.email),
                'tokenAesHash': app.transform.SHA512(this.state.token)
            };

            var thisComp = this;
            if (this.state.email == "") {
                this.setState({
                    emailError: "please provide email"
                });
            }
            if (this.state.email != "" && this.state.token != "") {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get('apidomain') + "/checkTokenV2",
                    data: post,
                    dataType: "json"
                }).done(function (msg) {
                    if (msg['response'] == "notFound") {
                        thisComp.setState({
                            tokenError: "Hmm. Token not match to this email. Do you have another one? "
                        });
                    } else if (msg['response'] == "success") {
                        thisComp.setState({
                            tokenError: "",
                            emailError: "",
                            emailSucc: true,
                            tokenSucc: true
                        });

                        thisComp.setState({
                            oneStep: parseInt(msg['oneStep']) === 0 ? false : true,
                            salt: app.transform.hex2bin(msg['saltS'])
                        });

                        if (parseInt(msg['oneStep']) === 1) {
                            alert('This email use single password. Press ok to be redirected');
                            Backbone.history.navigate("forgotPassword", {
                                trigger: true
                            });
                        }
                    } else {
                        app.notifications.systemMessage('tryAgain');
                    }
                });
            }
        },

        handleClick: function (action, event) {
            //app.user.set({id:10});

            switch (action) {
                case 'resetPass':
                    var thisComp = this;

                    this.setState({
                        emailError: this.state.email == "" ? "enter email" : "",
                        tokenError: this.state.token == "" ? "provide token" : "",
                        secretError: this.state.secret == "" ? "enter first password" : "",
                        newPassError: this.state.newPass == "" ? "enter new second password" : this.state.newPass.length < 6 ? "password is too short. 6 min" : this.state.newPass.length > 80 ? "password is too long. 80 " : "",
                        repPassError: this.state.newPassRep != this.state.newPass ? "password should match" : ""
                    }, function () {
                        if (thisComp.state.emailError == "" && thisComp.state.tokenError == "" && thisComp.state.secretError == "" && thisComp.state.newPassError == "" && thisComp.state.repPassError == "" && thisComp.state.newPassError == thisComp.state.repPassError) {
                            thisComp.setState({
                                'generateI': "fa fa-refresh fa-spin fa-lg"
                            });

                            if (thisComp.state.oneStep === false) {
                                var tokenAesHash = app.transform.SHA512(thisComp.state.token);

                                var oldPass = app.transform.SHA512(thisComp.state.secret);
                                var secondPass = app.globalF.makeDerived(this.state.newPass, thisComp.state.salt);

                                thisComp.resetPassAndSecret(thisComp.state.email, tokenAesHash, oldPass, secondPass);
                            }
                        }
                    });

                    break;

                case 'browseToken':
                    $('#sec_tokenFile').click();
                    break;
            }
        },

        resetPassAndSecret: function (email, tokenAesHash, oldPass, secondPass) {

            //todo delete all previous data with this user
            //generate new user
            // app.globalF.resetSecondPass();

            var userAddress = email.toLowerCase().split('@')[0];
            var email = userAddress + '@CyberFear.com';

            var pass = oldPass;
            var folderKey = app.globalF.makeRandomBytes(32);
            var salt = this.state.salt;
            var secret = secondPass;
            var thisComp = this;

            app.generate.generateUserObjects(email, pass, secret, folderKey, salt).then(function (userObj) {

                userObj['oldPass'] = pass;
                userObj['oldTokenAesHash'] = tokenAesHash;

                $.ajax({
                    method: "POST",
                    url: app.defaults.get('apidomain') + "/resetUserTwoStepV2",
                    data: userObj,
                    dataType: "json"
                }).then(function (msg) {

                    if (msg['response'] === 'fail') {
                        if (msg['data'] === 'limitIsReached') {
                            app.notifications.systemMessage('once5min');
                        } else {
                            app.notifications.systemMessage('tryAgain');
                        }
                    } else if (msg['response'] === 'success') {
                        $('#tokenModHead').html('Your account was successfully created!');

                        $('#createAccount-modal').modal('hide');
                        $('#tokenModBody').html('Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="https://blog.cyberfear.com/reset-password" target="_blank">blog</a>');

                        $('#tokenModal').modal('show');
                    } else if (msg['response'] === 'wrngPass') {
                        thisComp.setState({
                            'secretError': "password is incorrect"
                        });
                    }

                    thisComp.setState({
                        'generateI': ""
                    });

                    console.log(msg);
                });
            });
        },

        render: function () {

            return React.createElement(
                'div',
                { id: 'sec_content', className: 'forgotSecret container section-header' },
                React.createElement(
                    'div',
                    { className: 'modal-dialog modal-dialog-centered' },
                    React.createElement(
                        'div',
                        { className: 'modal-content' },
                        React.createElement(
                            'div',
                            { className: 'row' },
                            React.createElement(
                                'div',
                                { className: 'col-12 text-center heading', style: { marginBottom: "20px" } },
                                React.createElement('img', { src: 'img/forgot.svg', height: '25' }),
                                React.createElement('br', null),
                                'RESET PASSWORD',
                                React.createElement(
                                    'legend',
                                    { className: '' },
                                    React.createElement(
                                        'h5',
                                        null,
                                        React.createElement(
                                            'small',
                                            { className: 'text-left' },
                                            'Resetting your second password will permanently delete all your existing emails and contacts. Proceed with caution.'
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                'fieldset',
                                null,
                                React.createElement(
                                    'div',
                                    { className: "form-group " + (this.state.emailError != "" ? "has-error" : "") + (this.state.emailSucc ? "has-success" : "") },
                                    React.createElement('input', { type: 'email', name: 'resetEmail', id: 'sec_resetPass_email', className: 'form-control', placeholder: 'email address', onChange: this.handleChange.bind(this, 'email'), value: this.state.email }),
                                    React.createElement(
                                        'label',
                                        { className: "control-label pull-left " + (this.state.emailError == "" ? "hidden" : ""), htmlFor: 'resetEmail' },
                                        this.state.emailError
                                    )
                                ),
                                React.createElement('div', { className: 'clearfix' }),
                                React.createElement(
                                    'div',
                                    { className: "input-group form-group " + (this.state.tokenError != "" ? "has-error" : "") + (this.state.tokenSucc ? "has-success" : "") },
                                    React.createElement('input', { className: 'hidden', id: 'sec_tokenFile', type: 'file', readOnly: true, onChange: this.handleChange.bind(this, 'getFile') }),
                                    React.createElement('input', { name: 'tokenFile', className: 'form-control', id: 'sec_appendbutton', type: 'text', placeholder: 'secret token', readOnly: true, value: this.state.token,
                                        style: { textOverflow: "ellipsis" } }),
                                    React.createElement(
                                        'div',
                                        { className: 'input-group-btn' },
                                        React.createElement(
                                            'span',
                                            { className: 'input-group-addon', style: { padding: "0", border: "0", lineHeight: "1.1" } },
                                            React.createElement(
                                                'button',
                                                { className: 'dark-btn', style: { margin: "0", padding: "10px 52px", height: "100%" }, type: 'button', onClick: this.handleClick.bind(this, 'browseToken') },
                                                'Browse for Token'
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    'label',
                                    { className: "control-label pull-left has-error" + (this.state.tokenError == "" ? "hidden" : ""), htmlFor: 'tokenFile' },
                                    this.state.tokenError
                                ),
                                React.createElement('div', { className: 'clearfix' }),
                                React.createElement('div', { className: 'form-group pull-left ' }),
                                React.createElement('div', { className: 'clearfix' }),
                                React.createElement(
                                    'div',
                                    { className: "form-group " + (this.state.secretError != "" ? "has-error" : "") + (this.state.oneStep ? "hidden" : "") },
                                    React.createElement('input', { type: 'password', name: 'secretPhrase', className: 'form-control', placeholder: 'first password', onChange: this.handleChange.bind(this, 'secret'), value: this.state.secret }),
                                    React.createElement(
                                        'label',
                                        { className: "control-label pull-left " + (this.state.secretError == "" ? "hidden" : ""), htmlFor: 'secretPhrase' },
                                        this.state.secretError
                                    )
                                )
                            ),
                            React.createElement('hr', null),
                            React.createElement(
                                'fieldset',
                                null,
                                React.createElement(
                                    'div',
                                    { className: "form-group " + (this.state.newPassError != "" ? "has-error" : "") },
                                    React.createElement('input', { type: 'password', name: 'newPass', className: 'form-control', placeholder: '4. new second password', onChange: this.handleChange.bind(this, 'newPass'), value: this.state.newPass }),
                                    React.createElement(
                                        'label',
                                        { className: "control-label pull-left " + (this.state.newPassError == "" ? "hidden" : ""), htmlFor: 'newPass' },
                                        this.state.newPassError
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: "form-group " + (this.state.repPassError != "" ? "has-error" : "") },
                                    React.createElement('input', { type: 'password', name: 'newPassRep', className: 'form-control', placeholder: '5. repeat second password', onChange: this.handleChange.bind(this, 'newPassRep'), value: this.state.newPassRep }),
                                    React.createElement(
                                        'label',
                                        { className: "control-label pull-left " + (this.state.repPassError == "" ? "hidden" : ""), htmlFor: 'newPassRep' },
                                        this.state.repPassError
                                    )
                                )
                            ),
                            React.createElement(
                                'button',
                                { className: 'dark-btn w-100 py-2', id: 'sec_resetPassButton',
                                    style: { fontSize: "14px", fontFamily: 'Rodus-Square', padding: "9px 30px", width: "100%" }, disabled: this.state.generateI != "" ? true : false, onClick: this.handleClick.bind(this, 'resetPass'), type: 'button' },
                                'RESET PASSWORD'
                            )
                        )
                    )
                )
            );
        }

    });
});