define(['app', 'react'], function (app, React) {

    return React.createClass({

        getInitialState: function () {
            return {
                email: "",
                newPass: "",
                newPassRep: "",

                emailError: "",
                newPassError: "",
                repPassError: "",

                emailSucc: false,
                newPassSucc: false,
                repPassSucc: false,

                working: false,
                buttonTag: "",
                buttonText: "Create Account"

            };
        },

        componentDidMount: function () {

            $('#createAccount-modal').on('shown.bs.modal', function () {
                $.ajax({
                    method: "POST",
                    url: app.defaults.get('apidomain')+"/checkEmailExistV2",
                    data: {
                        email: 'test@cyberfear.com'

                    },
                    dataType: "text"
                });
            });

            //console.log('cruser');
            /*this.model.on('change', function() {
             this.forceUpdate();
             }.bind(this));*/
            /*
              newUserValidator = $("#createUser").validate({
             errorPlacement: function(error, element) {
             if (element.attr("name") == "email") {
             error.insertAfter(".emailErr");
             } else {
             error.insertAfter(element);
             }
             }
             });
              $("#userEmail").rules("add", {
             premail: true,
             required: true,
             minlength: 3,
             maxlength: 200,
             remote: {
             url: "/checkEmailExistV2",
             type: "post",
             data:{
             email:function(){
             var em=$('#userEmail').val().toLowerCase() + '@CyberFear.com';
             return app.globalF.SHA512(em)
             }
             }
             },
             messages: {
             remote: "username already in use"
             }
             });
              $("#userPassword").rules("add", {
             required: true,
             minlength: 6,
             maxlength: 80
             });
              $("#userPasswordRepeat").rules("add", {
             required: true,
             minlength: 6,
             maxlength: 80,
             equalTo: '#userPassword',
             messages: {
             required: 'Please enter your password one more time.',
             equalTo: 'Please enter the same password as above.'
             }
             });
             */
        },
        handleChange: function (action, event) {

            switch (action) {
                case 'email':

                    var thisComp = this;
                    var email = event.target.value;
                    console.log(email.length);
                    if (email.indexOf("@") !== -1) {
                        this.setState({
                            emailError: "please enter only first part of email, without @"
                        });
                    } else if (email.length < 3) {
                        this.setState({
                            emailError: "minimum 3 character"
                        });
                    } else if (email.length > 250) {
                        this.setState({
                            emailError: "maximum 250 character"
                        });
                    } else {
                        this.setState({
                            emailError: ""
                        });
                    }

                    this.setState({
                        email: event.target.value
                    }, function () {
                        thisComp.checkEmailTyping();
                    });

                    break;
                case 'newPass':
                    var newPass = event.target.value;

                    if (newPass.length < 6) {
                        this.setState({
                            newPassError: "Please use password bigger than 5 characters",
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
                        newPass: newPass
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

        checkFields: function () {
            var def = $.Deferred();
            var thisComp = this;

            var em = { target: { value: this.state.email } };
            this.handleChange('email', em);

            var newPass = { target: { value: this.state.newPass } };
            this.handleChange('newPass', newPass);

            var newPassRep = { target: { value: this.state.newPassRep } };
            this.handleChange('newPassRep', newPassRep);

            setTimeout(function () {
                if (thisComp.state.emailError == "" && thisComp.state.newPassError == "" && thisComp.state.repPassError == "") {
                    def.resolve(true);
                } else {
                    def.reject();
                }
            }, 400);

            return def;
        },

        generateUser: function () {
            var thisComp = this;

            this.checkFields().then(function (msg) {
                console.log(msg);
                thisComp.setState({
                    working: true,
                    buttonTag: "fa fa-refresh fa-spin",
                    buttonText: "Creating new user"
                });

                var userAddress = thisComp.state.email.toLowerCase().split('@')[0];
                var email = userAddress + app.defaults.get('domainMail');

                var pass = app.transform.SHA512(app.globalF.makeDerivedFancy(thisComp.state.newPass, app.defaults.get('hashToken')));
                var folderKey = app.globalF.makeRandomBytes(32);
                var salt = app.globalF.makeRandomBytes(256);
                var secret = app.globalF.makeDerived(thisComp.state.newPass, salt);

                app.generate.generateUserObjects(email, pass, secret, folderKey, salt).then(function (userObj) {

                    userObj['newPass'] = pass;
                    userObj['salt'] = app.transform.bin2hex(salt);

                    $.ajax({
                        method: "POST",
                        url: app.defaults.get('apidomain')+"/createNewUserV2",
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
                            $('#tokenModBody').html('Thank you. Please click close to start using your email.');

                            $('#tokenModal').modal('show');
                        }

                        thisComp.setState({
                            working: false,
                            buttonTag: "",
                            buttonText: "Create Account"
                        });

                        console.log(msg);
                    });
                });
            });

            //app.genea
        },

        checkEmailTyping: function () {
            var thisComp = this;
            $.ajax({
                method: "POST",
                url: app.defaults.get('apidomain')+"/checkEmailExistV2",
                data: {
                    email: this.state.email + app.defaults.get('domainMail')

                },
                dataType: "text"
            }).done(function (msg) {
                if (msg === 'false') {
                    thisComp.setState({
                        emailError: "email exists"
                    });
                } else if (msg === 'true' && thisComp.state.email > 2 && thisComp.state.email < 250) {
                    thisComp.setState({
                        emailError: ""
                    });
                }
            });
        },

        checkEmail: function () {
            var thisComp = this;
            $.ajax({
                method: "POST",
                url: app.defaults.get('apidomain')+"/checkEmailExistV2",
                data: {
                    email: this.state.email + app.defaults.get('domainMail')

                },
                dataType: "text"
            }).done(function (msg) {
                if (msg === 'false') {
                    thisComp.setState({
                        emailError: "email exists"
                    });
                } else if (msg === 'true') {
                    thisComp.generateUser();
                } else if (JSON.parse(msg)['email'] != undefined) {
                    thisComp.setState({
                        emailError: JSON.parse(msg)['email']
                    });
                } else {
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
            return React.createElement(
                'div',
                { className: '', id: 'createAccount-modal' },
                React.createElement(
                    'div',
                    { className: '' },
                    React.createElement(
                        'div',
                        { className: '', onKeyDown: this.handleClick.bind(this, 'enterCreateUser') },
                        React.createElement(
                            'h4',
                            { className: 'dark-text form-heading' },
                            'Create an Account'
                        ),
                        React.createElement(
                            'form',
                            { className: 'registration-form smart-form', id: 'createUser' },
                            React.createElement(
                                'div',
                                {
                                    className: "form-group " + (this.state.emailError != "" ? "has-error" : "") + (this.state.emailSucc ? "has-success" : "") },
                                React.createElement(
                                    'div',
                                    { className: 'input-group emailErr' },
                                    React.createElement('input', { type: 'text', name: 'email', id: 'userEmail', className: 'form-control input-lg',
                                        placeholder: 'choose email',
                                        maxLength: '160',
                                        onChange: this.handleChange.bind(this, 'email'),
                                        value: this.state.email }),
                                    React.createElement(
                                        'span',
                                        { className: 'input-group-addon' },
                                        app.defaults.get('domainMail')
                                    )
                                ),
                                React.createElement(
                                    'label',
                                    {
                                        className: "control-label pull-left " + (this.state.emailError == "" ? "hidden" : ""),
                                        htmlFor: 'resetEmail' },
                                    this.state.emailError
                                )
                            ),
                            React.createElement('div', { className: 'clearfix' }),
                            React.createElement(
                                'div',
                                {
                                    className: "form-group " + (this.state.newPassError != "" ? "has-error" : "") + (this.state.newPassSucc ? "has-success" : "") },
                                React.createElement('input', { className: 'form-control input-lg', name: 'password', id: 'userPassword',
                                    type: 'password', placeholder: 'password',
                                    onChange: this.handleChange.bind(this, 'newPass'),
                                    value: this.state.newPass }),
                                React.createElement(
                                    'label',
                                    {
                                        className: "control-label pull-left " + (this.state.newPassError == "" ? "hidden" : ""),
                                        htmlFor: 'newPass' },
                                    this.state.newPassError
                                )
                            ),
                            React.createElement('div', { className: 'clearfix' }),
                            React.createElement(
                                'div',
                                {
                                    className: "form-group " + (this.state.repPassError != "" ? "has-error" : "") + (this.state.repPassSucc ? "has-success" : "") },
                                React.createElement('input', { className: 'form-control input-lg', name: 'passwordrepeat',
                                    id: 'userPasswordRepeat', type: 'password', placeholder: 'repeat password',
                                    onChange: this.handleChange.bind(this, 'newPassRep'),
                                    value: this.state.newPassRep }),
                                React.createElement(
                                    'label',
                                    {
                                        className: "control-label pull-left " + (this.state.repPassError == "" ? "hidden" : ""),
                                        htmlFor: 'newPassRep' },
                                    this.state.repPassError
                                )
                            ),
                            React.createElement('div', { className: 'clearfix' }),
                            React.createElement(
                                'div',
                                {
                                    className: 'form-group hidden' },
                                React.createElement(
                                    'span',
                                    { className: 'pull-left' },
                                    'Please type into field below'
                                ),
                                React.createElement('input', { className: 'form-control input-lg', name: 'robotText',
                                    id: 'imrobot', type: 'text', placeholder: 'I\'m no robot',
                                    onChange: this.handleChange.bind(this, 'norobot'),
                                    value: this.state.norobot }),
                                React.createElement(
                                    'label',
                                    {
                                        className: "control-label pull-left " + (this.state.repPassError == "" ? "hidden" : ""),
                                        htmlFor: 'newPassRep' },
                                    this.state.repPassError
                                )
                            ),
                            React.createElement('div', { className: 'clearfix' }),
                            React.createElement(
                                'div',
                                { className: 'form-group' },
                                'By clicking "Create Account", I agree with the ',
                                React.createElement(
                                    'a',
                                    { href: '#TermsAndConditions',
                                        target: '_blank' },
                                    ' Terms and Conditions '
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'form-group' },
                                React.createElement(
                                    'button',
                                    { id: 'reguser', className: 'btn btn-primary standard-button', type: 'button',
                                        disabled: this.state.working,
                                        onClick: this.handleClick.bind(this, 'createUser') },
                                    React.createElement('i', { className: this.state.buttonTag }),
                                    ' ',
                                    this.state.buttonText
                                )
                            )
                        )
                    )
                )
            );
        }

    });
});