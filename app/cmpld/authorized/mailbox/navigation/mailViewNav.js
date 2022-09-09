define(['react', 'app', 'accounting'], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                moveFolderMain: [],
                moveFolderCust: [],
                checkNewMails: false,
                trashStatus: false,
                spamStatus: false,
                blackList: false,
                pastDue: false,
                balanceShort: false,
                hidden: true

            };
        },
        handleClick: function (i, event) {
            switch (i) {
                case 'email':
                    break;

                case 'checkNewMail':
                    app.mailMan.startShift();

                    break;
                case 'detectDirection':
                    app.layout.detectDirection();

                    break;

                case 'gotoBalance':

                    Backbone.history.navigate("settings/Plan", {
                        trigger: true
                    });

                    break;

            }
        },
        getSelected: function () {
            var selected = [];

            selected = Object.keys(app.user.get("selectedEmails"));

            if (selected.length == 0) {
                var elem = {};
                var item = $('#emailListTable tr.selected').attr('id');
                if (item != undefined) {
                    selected.push(item);
                }
            }
            return selected;
        },

        handleChange: function (i, event) {
            switch (i) {
                case 'moveToFolder':

                    var destFolderId = $(event.target).attr('id');

                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        app.user.set({ "currentMessageView": {} });

                        app.globalF.move2Folder(destFolderId, selected, function () {
                            app.userObjects.updateObjects('folderUpdate', '', function (result) {
                                $('#selectAll>input').prop("checked", false);
                                app.user.set({ "resetSelectedItems": true });
                                app.globalF.syncUpdates();
                            });
                        });
                    } else {
                        app.notifications.systemMessage('selectMsg');
                    }

                    break;
                case 'moveToTrash':

                    var thisComp = this;
                    this.setState({
                        trashStatus: true
                    });
                    var target = {};
                    if ($(event.target).is('i')) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find('i');
                    }

                    target.removeClass('fa-trash-o').addClass('fa-refresh fa-spin');

                    if (this.props.folderId == app.user.get('systemFolders')['spamFolderId'] || this.props.folderId == app.user.get('systemFolders')['trashFolderId'] || this.props.folderId == app.user.get('systemFolders')['draftFolderId']) {

                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            //console.log(selected);
                            //delete email physically;
                            app.user.set({ "currentMessageView": {} });

                            app.globalF.deleteEmailsFromFolder(selected, function (emails2Delete) {
                                //console.log(emails2Delete);
                                if (emails2Delete.length > 0) {
                                    app.userObjects.updateObjects('deleteEmail', emails2Delete, function (result) {
                                        $('#selectAll>input').prop("checked", false);
                                        app.user.set({ "resetSelectedItems": true });
                                        app.globalF.syncUpdates();
                                        app.layout.display('viewBox');

                                        target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');

                                        thisComp.setState({
                                            trashStatus: false
                                        });
                                    });
                                }
                            });
                        } else {
                            app.notifications.systemMessage('selectMsg');
                            target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');
                            thisComp.setState({
                                trashStatus: false
                            });
                        }
                    } else {

                        var destFolderId = app.user.get("systemFolders")['trashFolderId'];
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            app.user.set({ "currentMessageView": {} });
                            app.globalF.move2Folder(destFolderId, selected, function () {
                                app.userObjects.updateObjects('folderUpdate', '', function (result) {
                                    $('#selectAll>input').prop("checked", false);
                                    app.user.set({ "resetSelectedItems": true });
                                    app.globalF.syncUpdates();
                                    app.layout.display('viewBox');

                                    target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');

                                    thisComp.setState({
                                        trashStatus: false
                                    });
                                });
                            });
                        } else {
                            app.notifications.systemMessage('selectMsg');
                            target.removeClass('fa-refresh fa-spin').addClass('fa-trash-o');
                            thisComp.setState({
                                trashStatus: false
                            });
                        }
                    }

                    break;

                case 'blackList':
                    var thisComp = this;

                    console.log('blacklisting');
                    thisComp.setState({
                        blackList: true
                    });

                    var target = {};

                    if ($(event.target).is('i')) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find('i');
                    }
                    target.removeClass('fa-stop').addClass('fa-refresh fa-spin');

                    console.log(app.user.get("systemFolders"));
                    var destFolderId = app.user.get("systemFolders")['trashFolderId'];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        var emailpromises = [];

                        app.user.set({ "currentMessageView": {} });

                        app.globalF.move2Folder(destFolderId, selected, function () {
                            app.userObjects.updateObjects('folderUpdate', '', function (result) {

                                $.each(selected, function (index, emailId) {
                                    var emailMetaPromise = $.Deferred();

                                    var email = app.globalF.getEmailsFromString(app.transform.from64str(app.user.get('emails')['messages'][emailId]['fr']).toLowerCase());
                                    console.log(email);

                                    var post = {
                                        'ruleId': '',
                                        'matchField': 'emailM',
                                        'text': email,
                                        'destination': 0
                                    };

                                    app.serverCall.ajaxRequest('saveBlockedEmails', post, function (result) {
                                        if (result['response'] == "success") {
                                            emailMetaPromise.resolve();
                                        }
                                    });

                                    emailpromises.push(emailMetaPromise);
                                });

                                Promise.all(emailpromises).then(function () {
                                    app.notifications.systemMessage('saved');
                                    $('#selectAll>input').prop("checked", false);
                                    app.user.set({ "resetSelectedItems": true });
                                    app.globalF.syncUpdates();
                                    app.layout.display('viewBox');

                                    target.removeClass('fa-spin fa-refresh').addClass('fa-stop');

                                    thisComp.setState({
                                        blackList: false
                                    });
                                });
                            });
                        });
                    } else {
                        app.notifications.systemMessage('selectMsg');
                        target.removeClass('fa-spin fa-refresh').addClass('fa-stop');

                        thisComp.setState({
                            blackList: false
                        });
                    }

                    break;

                case 'moveToSpam':
                    // console.log('move to spam');

                    var thisComp = this;

                    thisComp.setState({
                        spamStatus: true
                    });
                    var target = {};

                    if ($(event.target).is('i')) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find('i');
                    }

                    target.addClass('fa-spin');

                    var destFolderId = app.user.get("systemFolders")['spamFolderId'];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        app.user.set({ "currentMessageView": {} });
                        app.globalF.move2Folder(destFolderId, selected, function () {

                            $.each(selected, function (index, emailId) {
                                var email = app.transform.from64str(app.user.get('emails')['messages'][emailId]['fr']);
                                app.globalF.createFilterRule("", "sender", "strict", destFolderId, app.globalF.parseEmail(email)['email'], function () {});
                            });

                            app.userObjects.updateObjects('folderSettings', '', function (result) {
                                if (result['response'] == 'success' && result['data'] == 'saved') {
                                    $('#selectAll>input').prop("checked", false);
                                    app.user.set({ "resetSelectedItems": true });
                                    app.globalF.syncUpdates();
                                    app.layout.display('viewBox');

                                    target.removeClass('fa-spin');

                                    thisComp.setState({
                                        spamStatus: false
                                    });
                                }
                            });
                        });
                    } else {
                        app.notifications.systemMessage('selectMsg');
                        target.removeClass('fa-spin');

                        thisComp.setState({
                            spamStatus: false
                        });
                    }

                    break;

                case 'markAsRead':

                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        var messages = app.user.get('emails')['messages'];
                        //var folders=app.user.get('emails')['folders'];

                        $.each(selected, function (index, emailId) {

                            //folders[messages[emailId]['f']][emailId]['st']==0?folders[messages[emailId]['f']][emailId]['st']=3:folders[messages[emailId]['f']][emailId]['st'];
                            messages[emailId]['st'] == 0 ? messages[emailId]['st'] = 3 : messages[emailId]['st'];
                        });

                        app.userObjects.updateObjects('folderUpdate', '', function (result) {
                            $('#selectAll>input').prop("checked", false);
                            app.user.set({ "resetSelectedItems": true });
                            app.globalF.syncUpdates();
                        });

                        //app.userObjects.saveMailBox('emailsRead',{});
                    } else {
                        app.notifications.systemMessage('selectMsg');
                    }

                    break;

                case 'markAsUnread':

                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        var messages = app.user.get('emails')['messages'];
                        //var folders=app.user.get('emails')['folders'];

                        $.each(selected, function (index, emailId) {

                            //folders[messages[emailId]['f']][emailId]['st']=0;
                            messages[emailId]['st'] = 0;
                        });

                        app.userObjects.updateObjects('folderUpdate', '', function (result) {
                            $('#selectAll>input').prop("checked", false);
                            app.user.set({ "resetSelectedItems": true });
                            app.globalF.syncUpdates();
                        });

                        //app.userObjects.saveMailBox('emailsRead',{});
                    } else {
                        app.notifications.systemMessage('selectMsg');
                    }

                    break;

            }
        },

        change: function (event) {

            //console.log(event.target.value);
            $('#emailListTable').DataTable().column(0).search(event.target.value, 0, 1).draw();
        },

        componentWillUnmount: function () {
            app.user.off("change:mailboxSize");
            app.user.off("change:checkNewEmails");
            app.user.off("change:pastDue");
            app.user.off("change:balanceShort");
        },
        componentDidMount: function () {
            //this.getMainFolderList();
            //$( document ).tooltip();
            //$("[rel=tooltip]").tooltip();

            //this.getCustomFolderList();
            this.getMainFolderList();
            this.getCustomFolderList();
            var thisComp = this;

            app.user.on("change:mailboxSize", function () {
                thisComp.forceUpdate();
            });

            app.user.on("change:checkNewEmails", function () {

                thisComp.setState({
                    checkNewMails: app.user.get('checkNewEmails')

                });
                //console.log(thisComp.state.checkNewMails);
            });
            thisComp.checkPastDue();

            app.user.on("change:pastDue", function () {
                thisComp.checkPastDue();
            }, thisComp);
            app.user.on("change:balanceShort", function () {
                thisComp.checkPastDue();
            }, thisComp);
        },

        checkPastDue: function () {
            // console.log(app.user.get('pastDue'));
            this.setState({
                pastDue: app.user.get('pastDue'),
                balanceShort: app.user.get('balanceShort')
            });
        },

        getMainFolderList: function () {
            var mainFolderList = app.globalF.getMainFolderList();
            var thisComp = this;

            var options = [];
            $.each(mainFolderList, function (index, folderData) {

                if (['Inbox', 'Spam', 'Trash'].indexOf(folderData['role']) > -1) {
                    options.push(React.createElement(
                        'li',
                        { key: folderData['index'] },
                        React.createElement(
                            'a',
                            { id: folderData['index'], onClick: thisComp.handleChange.bind(thisComp, 'moveToFolder') },
                            folderData['name']
                        )
                    ));
                }
            });

            this.setState({
                moveFolderMain: options
            });
            //return options;
        },

        boxSize: function () {

            //console.log(app.globalF.countEmailsSize());
            return React.createElement(
                'span',
                { className: 'mailboxsize' },
                accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024 / 1024, 2),
                ' GB \xA0/\xA0',
                React.createElement(
                    'strong',
                    null,
                    app.user.get("userPlan")['planData']['bSize'] / 1000,
                    ' GB'
                )
            );
        },

        getCustomFolderList: function () {

            var folderList = app.globalF.getCustomFolderList();
            var thisComp = this;

            var options = [];
            $.each(folderList, function (index, folderData) {
                options.push(React.createElement(
                    'li',
                    { key: index },
                    React.createElement(
                        'a',
                        { id: folderData['index'], onClick: thisComp.handleChange.bind(thisComp, 'moveToFolder') },
                        folderData['name']
                    )
                ));
            });
            this.setState({
                moveFolderCust: options
            });
        },

        render: function () {

            //console.log(app.user.get('draftMessageView')['id']);
            // console.log(app.user.get('currentMessageView')['id']);
            var st1 = { height: '25px', marginLeft: '4px', marginBottom: '2px' };
            var st2 = { marginTop: '3px' };
            var st3 = { width: accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024, 2) * 100 / app.user.get("userPlan")['planData']['bSize'] + '%' };

            var balanceShort = [];
            if (this.state.balanceShort && !this.state.pastDue) {
                var balance = app.user.get("userPlan")['balance'];
                var monthlyCharge = app.user.get("userPlan")['monthlyCharge'];
                // var planDue=new Date(parseInt(app.user.get("userPlan")['cycleEnd']+'000')).toLocaleDateString();

                balanceShort.push(React.createElement(
                    'button',
                    { key: 'shrt1',
                        className: "btn btn-default btn-warning",
                        'data-placement': 'bottom', 'data-toggle': 'popover-hover',
                        'data-html': 'true',
                        title: '',
                        'data-content': "Your need to renew your subscription in the next <b>30 days</b>. <br/>To prevent service interruption please renew your plan.", type: 'button',

                        onClick: this.handleClick.bind(this, 'gotoBalance') },
                    React.createElement('i', { key: 'shrt2', className: 'fa fa-bell-o fa-lg txt-color-white' })
                ));
            }
            return React.createElement(
                'div',
                { className: 'emailHeader col-xs-12' },
                React.createElement(
                    'div',
                    { className: 'leftFolderAndSpace' },
                    React.createElement(
                        'div',
                        { className: 'inbox-space visible-md visible-sm visible-lg pull-left InboxRefresh' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-default pull-right', rel: 'tooltip', title: '', 'data-placement': 'bottom', 'data-original-title': 'Check new email', type: 'button', onClick: this.handleClick.bind(this, 'checkNewMail'), disabled: this.state.checkNewMails },
                            React.createElement('i', { className: "fa fa-refresh fa-lg " + (this.state.checkNewMails ? "fa-spin" : "") })
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'InboxIcons' },
                    React.createElement(
                        'div',
                        { className: 'btn-group pull-left hidden-xs' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Search', onChange: this.change })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'mailIcons' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-default visible-xs pull-left', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', title: '', 'data-content': 'Back To Email', type: 'button', onClick: this.handleClick.bind(this, 'detectDirection') },
                            React.createElement('i', { id: 'navArrow', className: 'navArrow fa fa-long-arrow-left fa-lg' })
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.hidden ? "hidden" : "", id: 'sdasdasd' },
                            React.createElement(
                                'div',
                                { className: 'btn-group' },
                                React.createElement(
                                    'button',
                                    { className: 'btn btn-default', id: 'mvFolderButton', 'data-toggle': 'dropdown', 'data-placement': 'top', 'data-toggle': 'dropdown', title: '', 'data-content': 'Move To Folder', type: 'button', onclick: '' },
                                    'Move to  ',
                                    React.createElement('i', { className: 'fa fa-angle-down fa-lg' })
                                ),
                                React.createElement(
                                    'ul',
                                    { id: 'mvtofolder', className: 'dropdown-menu scrollable-menu', role: 'menu' },
                                    this.state.moveFolderMain,
                                    React.createElement('li', { className: 'divider' }),
                                    this.state.moveFolderCust
                                )
                            ),
                            React.createElement(
                                'button',
                                { className: 'btn btn-default deletebutton', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', title: '', 'data-content': 'Trash', type: 'button', disabled: this.state.trashStatus,
                                    onClick: this.handleChange.bind(this, 'moveToTrash') },
                                'Delete'
                            ),
                            React.createElement(
                                'button',
                                { className: 'btn btn-default', 'data-placement': 'bottom', 'data-toggle': 'popover-hover', title: '', 'data-content': 'Spam', type: 'button',
                                    disabled: this.state.spamStatus,
                                    onClick: this.handleChange.bind(this, 'moveToSpam') },
                                'Spam'
                            ),
                            React.createElement(
                                'div',
                                { className: 'btn-group boxEmailOption' },
                                React.createElement(
                                    'button',
                                    { className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
                                    'More ',
                                    React.createElement('i', { className: 'fa fa-angle-down fa-lg' })
                                ),
                                React.createElement(
                                    'ul',
                                    { className: 'dropdown-menu pull-right' },
                                    React.createElement(
                                        'li',
                                        { id: 'replythis' },
                                        React.createElement(
                                            'a',
                                            { onClick: this.handleChange.bind(this, 'markAsRead') },
                                            'Mark as read'
                                        )
                                    ),
                                    React.createElement(
                                        'li',
                                        { id: 'forwardthis' },
                                        React.createElement(
                                            'a',
                                            { onClick: this.handleChange.bind(this, 'markAsUnread') },
                                            'Mark as unread'
                                        )
                                    ),
                                    React.createElement(
                                        'li',
                                        { id: 'blocksender' },
                                        React.createElement(
                                            'a',
                                            { onClick: this.handleChange.bind(this, 'blackList') },
                                            'Block Sender'
                                        )
                                    )
                                )
                            ),
                            balanceShort,
                            React.createElement(
                                'button',
                                { className: "btn btn-default " + (this.state.pastDue ? "back_red" : "hidden"), 'data-placement': 'bottom', 'data-toggle': 'popover-hover', title: '', 'data-content': 'Account is past due. Please refill your balance.', type: 'button',

                                    onClick: this.handleClick.bind(this, 'gotoBalance') },
                                React.createElement('i', { className: 'fa fa-bell-o fa-lg txt-color-white' })
                            ),
                            React.createElement(
                                'button',
                                { className: 'btn btn-sm btn-default w-xxs w-auto-xs hidden', tooltip: 'Archive' },
                                React.createElement('i', { className: 'ion ion-archive ion-lg' })
                            )
                        )
                    )
                )
            );
        }

    });
});