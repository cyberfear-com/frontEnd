define(['react', 'app', 'dataTable', 'dataTableBoot'], function (React, app, DataTable, dataTableBoot) {
    return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState: function () {
            var dataSet = [];

            return {
                dataSet: dataSet,
                mainChecker: [],
                emailInFolder: 0,
                displayedFolder: "",
                messsageId: "",
                allChecked: false
            };
        },

        componentWillReceiveProps: function (nextProps) {
            //console.log(this.props.folderId);
            if (this.props.folderId != nextProps.folderId && this.props.folderId != "") {
                this.updateEmails(nextProps.folderId, '');
                //console.log(nextProps.folderId);
            }

            //this.setState({
            //	likesIncreasing: nextProps.likeCount > this.props.likeCount
            //});
        },
        updateEmails: function (folderId, noRefresh) {

            var thisComp = this;
            var emails = app.user.get('emails')['folders'][folderId];

            // if (thisComp.state.emailInFolder == Object.keys(emails).length && thisComp.state.displayedFolder == app.transform.from64str(app.user.get('folders')[folderId]['name'])) {

            //} else {

            var emailListCopy = app.user.get("folderCached");

            if (emailListCopy[folderId] === undefined) {
                emailListCopy[folderId] = {};
            }

            thisComp.setState({
                "displayedFolder": app.transform.from64str(app.user.get('folders')[folderId]['name']),
                "emailInFolder": Object.keys(emails).length
            });

            app.user.set({
                'currentFolder': app.transform.from64str(app.user.get('folders')[folderId]['name'])
            });

            //console.log(app.user.get('folders')[folderId]['role']);
            if (app.user.get('folders')[folderId]['role'] != undefined) {
                var t = app.transform.from64str(app.user.get('folders')[folderId]['role']);
            } else {
                var t = '';
            }

            //console.log(t);


            var data = [];
            var d = new Date();
            var trusted = app.user.get("trustedSenders");
            var encrypted2 = "";

            $.each(emails, function (index, folderData) {
                if (emailListCopy[folderId][index] !== undefined) {
                    var unread = folderData['st'] == 0 ? "unread" : folderData['st'] == 1 ? "fa fa-mail-reply" : folderData['st'] == 2 ? "fa fa-mail-forward" : "";

                    var row = {
                        "DT_RowId": index,
                        "email": {
                            "display": '<div class="email no-padding ' + unread + '">' + emailListCopy[folderId][index]["checkBpart"] + emailListCopy[folderId][index]["dateAtPart"] + emailListCopy[folderId][index]["fromPart"] + '<div class="title ellipsisText col-xs-10 col-md-6"><span>' + emailListCopy[folderId][index]["sb"] + '</span> - ' + emailListCopy[folderId][index]["bd"] + '</div>' + emailListCopy[folderId][index]["tagPart"] + '</div>',

                            //"open":folderData['o']?1:0,
                            "timestamp": emailListCopy[folderId][index]["timestamp"]
                        }
                    };
                } else {
                    var time = folderData['tr'] != undefined ? folderData['tr'] : folderData['tc'] != undefined ? folderData['tc'] : '';

                    //console.log(time);
                    if (d.toDateString() == new Date(parseInt(time + '000')).toDateString()) {
                        var dispTime = new Date(parseInt(time + '000')).toLocaleTimeString();
                    } else {
                        var dispTime = new Date(parseInt(time + '000')).toLocaleDateString();
                    }
                    var fromEmail = [];
                    var fromTitle = [];
                    var recipient = [];
                    var recipientTitle = [];
                    var trust = "";
                    if (folderData['to'].length > 0) {

                        $.each(folderData['to'], function (indexTo, email) {
                            // console.log(email);

                            if (app.transform.check64str(email)) {
                                var str = app.transform.from64str(email);
                            } else {
                                var str = email;
                            }

                            recipient.push(app.globalF.parseEmail(str)['name']);
                            recipientTitle.push(app.globalF.parseEmail(str)['email']);
                        });
                    } else if (Object.keys(folderData['to']).length > 0) {

                        $.each(folderData['to'], function (indexTo, email) {

                            try {
                                var str = app.transform.from64str(indexTo);

                                var name = "";
                                if (email === undefined) {
                                    name = str;
                                } else {
                                    if (email['name'] === undefined) {
                                        name = str;
                                    } else {
                                        if (email['name'] === "") {
                                            name = str;
                                        } else {
                                            name = app.transform.from64str(email['name']);
                                        }
                                    }
                                }

                                recipient.push(name);
                                recipientTitle.push(str);
                            } catch (err) {
                                recipient.push('error');
                                recipientTitle.push('error');
                            }
                        });
                    }
                    //console.log(recipient);

                    if (t == 'Sent' || t == 'Draft') {

                        //  console.log(folderData['to']);
                        //  console.log(folderData['cc']);
                        //  console.log(folderData['bcc']);
                        fromEmail = '';
                        fromTitle = '';

                        if (folderData['cc'] != undefined && Object.keys(folderData['cc']).length > 0) {

                            $.each(folderData['cc'], function (indexCC, email) {
                                try {
                                    var str = app.transform.from64str(indexCC);
                                    var name = "";
                                    if (email === undefined) {
                                        name = str;
                                    } else {
                                        if (email['name'] === undefined) {
                                            name = str;
                                        } else {
                                            if (email['name'] === "") {
                                                name = str;
                                            } else {
                                                name = app.transform.from64str(email['name']);
                                            }
                                        }
                                    }
                                    recipient.push(name);
                                    recipientTitle.push(str);
                                } catch (err) {
                                    recipient.push('error');
                                    recipientTitle.push('error');
                                }
                            });
                        }

                        if (folderData['bcc'] != undefined && Object.keys(folderData['bcc']).length > 0) {

                            $.each(folderData['bcc'], function (indexBCC, email) {
                                try {
                                    var str = app.transform.from64str(indexBCC);
                                    var name = "";
                                    if (email === undefined) {
                                        name = str;
                                    } else {
                                        if (email['name'] === undefined) {
                                            name = str;
                                        } else {
                                            if (email['name'] === "") {
                                                name = str;
                                            } else {
                                                name = app.transform.from64str(email['name']);
                                            }
                                        }
                                    }
                                    recipient.push(name);
                                    recipientTitle.push(str);
                                } catch (err) {
                                    recipient.push('error');
                                    recipientTitle.push('error');
                                }
                            });
                        }

                        recipient = recipient.join(', ');
                        recipientTitle = recipientTitle.join(', ');

                        fromEmail = recipient;
                        fromTitle = recipientTitle;
                    } else {

                        var str = app.transform.from64str(folderData['fr']);

                        //console.log(str);
                        fromEmail = app.globalF.parseEmail(str, true)['name'];
                        fromTitle = app.globalF.parseEmail(str, true)['email'];

                        if (trusted.indexOf(app.transform.SHA256(app.globalF.parseEmail(str)['email'])) !== -1) {
                            //console.log('X');
                            trust = "<img src='/img/logo/logo.png' style='height:25px'/>";
                        } else {
                            trust = "";
                        }
                        recipient = recipient.join(', ');
                        recipientTitle = recipientTitle.join(', ');
                    }

                    if (folderData['tg'].length > 0) {
                        //console.log(folderData['tg']);
                        var tag = folderData['tg'][0]['name'];
                    } else {
                        var tag = "";
                    }

                    if (parseInt(folderData['en']) == 1) {
                        encrypted2 = "<i class='fa fa-lock fa-lg'></i>";
                    } else if (parseInt(folderData['en']) == 0) {
                        encrypted2 = "<i class='fa fa-unlock fa-lg'></i>";
                    } else if (parseInt(folderData['en']) == 3) {
                        encrypted2 = "";
                    }

                    //console.log(tag);
                    tag = app.globalF.stripHTML(app.transform.from64str(tag));
                    //console.log(app.transform.from64str(tag));
                    var unread = folderData['st'] == 0 ? "unread" : folderData['st'] == 1 ? "fa fa-mail-reply" : folderData['st'] == 2 ? "fa fa-mail-forward" : "";

                    var attch = folderData['at'] == "1" ? '<span class="fa fa-paperclip fa-lg"></span>' : "";

                    if (fromEmail == "") {
                        fromEmail = fromTitle;
                    }

                    var checkBpart = '<label><input class="emailchk hidden-xs" type="checkbox" /></label>';

                    var fromPart = '<span class="from no-padding col-xs-8 col-md-3 ellipsisText margin-right-10" data-placement="bottom" data-toggle="popover-hover" title="" data-content="' + fromTitle + '">' + trust + ' ' + fromEmail + '</span>';

                    var dateAtPart = '<span class="no-padding date col-xs-3 col-sm-2">' + attch + '&nbsp;' + encrypted2 + ' ' + dispTime + '<span class="label label-primary f-s-10"></span><span class="label label-primary f-s-10"></span></span>';

                    var tagPart = '<div class="mailListLabel pull-right text-right col-xs-2"><div class="ellipsisText visible-xs"><span class="label label-success">' + tag + '</span></div><div class="ellipsisText hidden-xs col-xs-12 pull-right"><span class="label label-success">' + tag + '</span></div></div>';

                    emailListCopy[folderId][index] = {
                        "DT_RowId": index,
                        "unread": unread,
                        "checkBpart": checkBpart,
                        "dateAtPart": dateAtPart,
                        "fromPart": fromPart,
                        "sb": app.transform.escapeTags(app.transform.from64str(folderData['sb'])),
                        "bd": app.transform.escapeTags(app.transform.from64str(folderData['bd'])),
                        "tagPart": tagPart,
                        "timestamp": time
                    };

                    var row = {
                        "DT_RowId": index,
                        "email": {
                            "display": '<div class="email no-padding ' + emailListCopy[folderId][index]["unread"] + '">' + emailListCopy[folderId][index]["checkBpart"] + emailListCopy[folderId][index]["dateAtPart"] + emailListCopy[folderId][index]["fromPart"] + '<div class="title ellipsisText col-xs-10 col-md-6"><span>' + emailListCopy[folderId][index]["sb"] + '</span> - ' + emailListCopy[folderId][index]["bd"] + '</div>' + emailListCopy[folderId][index]["tagPart"] + '</div>',

                            //"open":folderData['o']?1:0,
                            "timestamp": emailListCopy[folderId][index]["timestamp"]
                        }
                    };
                }

                data.push(row);
            });

            app.user.set({ "folderCached": emailListCopy });

            var emTab = $('#emailListTable').DataTable();
            emTab.clear();
            if (noRefresh == '') {
                emTab.draw();
                //$('#mMiddlePanel').scrollTop(0);
                thisComp.setState({
                    messsageId: "",
                    allChecked: false

                }, function () {
                    $('#selectAll>input').prop("checked", false);
                });
            }

            emTab.rows.add(data);
            emTab.draw(false);

            this.attachTooltip();

            $('#emailListTable td').click(function () {
                var selectedEmails = app.user.get('selectedEmails');
                if ($(this).find('.emailchk').prop("checked")) {
                    selectedEmails[$(this).parents('tr').attr('id')] = true;
                } else {
                    delete selectedEmails[$(this).parents('tr').attr('id')];
                }

                //   console.log(selectedEmails);
            });

            //}
        },

        componentDidMount: function () {

            var dtSet = this.state.dataSet;
            var thisComp = this;

            $('#emailListTable').dataTable({
                "dom": '<"#checkAll"><"#emailListNavigation"pi>rt<"pull-right"p><"pull-right"i>',
                "data": dtSet,
                "columns": [{ data: {
                        _: "email.display",
                        sort: "email.timestamp",
                        filter: "email.display"
                    }
                }],

                "columnDefs": [{ "sClass": 'col-xs-12 border-right text-align-left no-padding padding-vertical-10', "targets": 0 }, { "orderDataType": "data-sort", "targets": 0 }],
                "sPaginationType": "simple",
                "order": [[0, "desc"]],
                "iDisplayLength": app.user.get("mailPerPage"),
                "language": {
                    "emptyTable": "Empty",
                    "info": "_START_ - _END_ of _TOTAL_",
                    "infoEmpty": "No entries",
                    "paginate": {
                        "sPrevious": "<i class='fa fa-chevron-left'></i>",
                        "sNext": "<i class='fa fa-chevron-right'></i>"
                    }
                },
                fnDrawCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $("#emailListTable thead").remove();
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if ($(nRow).attr('id') == app.user.get('currentMessageView')['id']) {
                        $(nRow).addClass('selected');
                    }

                    if (app.user.get("selectedEmails")[$(nRow).attr('id')] !== undefined) {
                        $(nRow).find('.emailchk').prop('checked', true);
                    }
                    //$(nRow).attr('id', aData[0]);

                    return nRow;
                }
            });

            //console.log(app.globalF.getInboxFolderId());
            app.globalF.getInboxFolderId(function (inbox) {
                thisComp.updateEmails(inbox, '');
            });

            app.user.on("change:resetSelectedItems", function () {
                if (app.user.get("resetSelectedItems")) {
                    app.user.set({ "selectedEmails": {} });

                    app.user.set({ "resetSelectedItems": false });
                }
            }, thisComp);

            //  app.user.set({"resetSelectedItems":true});

            app.user.on("change:emailListRefresh", function () {
                $('#sdasdasd').addClass("hidden");

                thisComp.updateEmails(thisComp.props.folderId, 'noRefresh');
                // $('#selectAll>input').prop("checked",false);
            }, thisComp);

            var container = $('#checkAll');

            //$(thisComp.selectAll()).appendTo(container);


            var mainChecker = [];

            $('#checkAll').html('<div class="btn-group btn btn-default borderless pull-left hidden-xs" id="selectAll"><input type="checkbox"/> </div>');

            /*
             <i class="fa fa-angle-down fa-lg" data-toggle="dropdown"></i><ul id="mvtofolder1" class="dropdown-menu"><li><a id="thisPage">this page</a></li><li><a id="wholeFolder">All in folder</a></li></ul>
             */

            /* $('#thisPage').click( function () {
                 if($('#selectAll>input').prop("checked")){
                     $('#selectAll>input').prop("checked",false);
                 }else{
                     $('#selectAll>input').prop("checked",true);
                 }
                  thisComp.selectThisPage(thisComp.state.selectedEmails);
              } );
              $('#wholeFolder').click( function () {
                 if($('#selectAll>input').prop("checked")){
                     $('#selectAll>input').prop("checked",false);
                 }else{
                     $('#selectAll>input').prop("checked",true);
                 }
                  thisComp.selectAll(thisComp.state.selectedEmails);
             } );
            */
            $('#selectAll').change(function () {
                var selectedEmails = app.user.get('selectedEmails');

                if ($('#selectAll>input').prop("checked")) {
                    $(".emailchk").prop('checked', true);

                    $(".emailchk").each(function (index) {
                        var messageId = $(this).closest('tr').attr('id');
                        selectedEmails[messageId] = true;
                    });
                    //  console.log(selectedEmails);
                } else {
                    $(".emailchk").prop('checked', false);
                    app.user.set({ "selectedEmails": {} });
                }

                if ($('#selectAll>input').prop("checked") === true) {
                    thisComp.setState({
                        allChecked: true
                    });
                    $('#sdasdasd').removeClass("hidden");
                } else {
                    thisComp.setState({
                        allChecked: false
                    });
                    if (thisComp.state.messsageId == "") {
                        $('#sdasdasd').addClass("hidden");
                    }
                }
                //console.log(thisComp.state.messsageId);

                // console.log($('#selectAll>input').prop("checked"));

            });
        },
        /*selectThisPage:function(thisComp){
            selectedEmails=thisComp.state.selectedEmails;
          },*/

        componentWillUnmount: function () {
            app.user.off("change:emailListRefresh");
        },
        handleClick: function (i, event) {
            switch (i) {

                case 'wholeFolder':
                    //  console.log('wholeFolder')
                    break;

                case 'thisPage':
                    //  console.log('thisPage')
                    break;

                case 'readEmail':
                    var thisComp = this;

                    var folder = app.user.get('folders')[this.props.folderId]['name'];

                    app.mixins.canNavigate(function (decision) {
                        if (decision) {
                            var id = $(event.target).parents('tr').attr('id');
                            if (!$(event.target).is('input')) {
                                app.globalF.resetCurrentMessage();
                                app.globalF.resetDraftMessage();

                                Backbone.history.navigate("/mail/" + app.transform.from64str(folder), {
                                    trigger: true
                                });

                                if (id != undefined && $(event.target).attr('type') != "checkbox" && $(event.target).prop("tagName") != "LABEL") {
                                    console.log('1');
                                    $('#sdasdasd').removeClass("hidden");
                                    $('#mMiddlePanelTop').addClass(' hidden-xs hidden-sm hidden-md');
                                    $('#mRightPanel').removeClass(' hidden-xs hidden-sm hidden-md');
                                    var table = $('#emailListTable').DataTable();
                                    table.$('tr.selected').removeClass('selected');

                                    $(event.target).parents('tr').toggleClass('selected');

                                    thisComp.setState({
                                        messsageId: id
                                    });

                                    app.globalF.renderEmail(id);

                                    app.mixins.hidePopHover();
                                }
                            }
                        } else {}
                    });

                    break;
            }
        },
        attachTooltip: function () {
            //console.log('gg');
            $('[data-toggle="popover-hover"]').popover({ trigger: "hover", container: 'body' });

            $('[data-toggle="popover-hover"]').on('shown.bs.popover', function () {
                var $pop = $(this);
                setTimeout(function () {
                    $pop.popover('hide');
                }, 5000);
            });
            var thisComp = this;
            $('#emailListTable input[type="checkbox"]').click(function () {
                if ($(".emailchk").prop('checked')) {
                    $('#sdasdasd').removeClass("hidden");
                } else if (thisComp.state.messsageId == "") {
                    $('#sdasdasd').addClass("hidden");
                } else {
                    //  thisComp.setState({
                    //    messsageId:""
                    //  });
                }
            });
        },

        componentDidUpdate: function () {
            //this.attachTooltip();
        },
        render: function () {
            var middleClass = "Middle inbox checkcentr col-lg-6 col-xs-12 ";

            //console.log(this.props.panel.middlePanel);
            //$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: 'body'});
            return React.createElement(
                'div',
                { className: ' no-padding', id: 'mMiddlePanel' },
                React.createElement('table', { className: 'table table-hover table-inbox row-border clickable', id: 'emailListTable', onClick: this.handleClick.bind(this, 'readEmail') })
            );
        }

    });
});