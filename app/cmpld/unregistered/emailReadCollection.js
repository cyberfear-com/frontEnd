define(['react', 'app', 'cmpld/unregistered/Body/emailRead', 'cmpld/unregistered/navigation/mailViewNav', 'cmpld/unregistered/Body/composeEmail'

//'cmpld/authorized/mailbox/rightpanel/composeEmail'

], function (React, app, EmailRead, MailViewNav, ComposeEmail
// ComposeEmail
) {

    return React.createClass({

        getInitialState: function () {
            var rght = "Right col-lg-12 col-xs-12"; //col-lg-6


            return {
                rightPanel: rght,
                folderId: '',
                emailPin: "",
                isHtml: true,
                sendEmail: false,
                canReply: false
            };
        },
        componentDidMount: function () {

            if (this.props.activePage == "composeEmail") {
                console.log('redirect');

                Backbone.history.navigate("/retrieveEmailV2/" + this.props.emailId, {
                    trigger: true
                });
            }

            var thisComp = this;
            $('#askPassHeader').html('Please Enter Pin');
            $('#askPasInput').attr("placeholder", "Pin");

            $('#askforPass').modal({
                backdrop: 'static',
                keyboard: true
            });
            //$('#askPasInput').focus();

            $('#askPasSub').on('click', function () {

                var pin = $('#askPasInput').val();
                //var pin='1234';
                var emailId = thisComp.props.emailId;

                if (pin.length > 0 && (emailId.length == 24 || emailId.length == 128)) {
                    app.unregF.retrieveEmail(emailId, pin).then(function (result) {
                        if (result['version'] === 1) {
                            thisComp.showEmailV1(result, pin);
                        } else if (result['version'] === 2) {
                            thisComp.showEmailV2(result, pin);
                        }
                        $('#askforPass').modal('hide');
                    });
                }

                //  console.log(thisComp.props.emailId);
                // console.log($('#askPasInput').val());
                // thisComp.handleClick('save1Pass', $('#askPasInput').val());
            });
            $('#askPasCancel').on('click', function () {
                //    Backbone.history.navigate("/", {
                //        trigger : true
                //    });
            });
        },
        showEmailV2: function (emailData, pin) {

            // console.log(emailData);

            var key = app.globalF.generatePinKey(pin);

            var emailDecrypted = {
                body: app.transform.fromAes64(key, emailData['email'])
            };
            //console.log(emailDecrypted);

            var body = JSON.parse(emailDecrypted['body']);

            app.user.set({
                currentMessageView: {
                    'recipientHash': emailData['recipientHash'],
                    id: emailData['messageId'],
                    meta: body['meta'],
                    body: body['body'],
                    attachment: body['attachments'] == undefined ? {} : body['attachments'],
                    version: 2,
                    originalBody: body
                }
            });

            this.setState({
                canReply: true
            });
        },
        showEmailV1: function (emailData, pin) {

            var key = app.globalF.generatePinKey(app.transform.SHA512(pin));
            this.setState({
                emailPin: key
            });

            try {

                var emailDecrypted = {
                    body: app.v1transform.fromAes(key, emailData['email']['body']),
                    meta: app.v1transform.fromAes(key, emailData['email']['meta'])
                };

                var body = JSON.parse(emailDecrypted['body']);

                var version = 1;

                var meta = JSON.parse(emailDecrypted['meta']);

                body['meta']['from'] = body['from'];

                //fix old emails where recipient to field is not an object

                if (typeof body['meta']['to'] === 'string') {
                    var to = body['meta']['to'];
                    body['meta']['to'] = [];
                    body['meta']['to'].push(to);
                }

                app.user.set({
                    currentMessageView: {
                        id: emailData['messageId'],
                        meta: body['meta'],
                        body: body['body'],
                        attachment: body['attachment'] == undefined ? {} : body['attachment'],
                        version: version,
                        originalBody: body
                    }
                });

                //this.refs['renderMail'].renderEmail();
            } catch (err) {
                app.notifications.systemMessage('failedDecr');
                //    $('#pserror').html("PIN is invalid");
                //     $('#pserror').parent().parent().addClass('state-error');
            }
        },
        updateHtmlState: function () {
            //console.log('jjjj');
            var state = this.state.isHtml;
            this.setState({
                isHtml: !state
            });
        },
        sendMail: function () {
            //console.log('jjjj');
            this.setState({
                sendEmail: true
            });
        },

        handleClick: function (i) {
            switch (i) {}
        },

        onClick: function () {
            //	$('.hiddens').toggle();

        },
        render: function () {

            if (this.props.activePage == "composeEmail") {
                var body = React.createElement(ComposeEmail, { panel: this.state, resetClasses: this.resetClases, sendMail: this.state.sendEmail });
            } else {
                console.log(this.state);
                var body = React.createElement(EmailRead, { panel: this.state, isHtml: this.state.isHtml, emailPin: this.state.emailPin });
            }

            return React.createElement(
                'section',
                null,
                React.createElement(MailViewNav, { updateHtmlState: this.updateHtmlState, page: this.props.activePage, sendMail: this.sendMail, canReply: this.state.canReply }),
                React.createElement(
                    'div',
                    { className: 'Container' },
                    body
                )
            );
        }

    });
});