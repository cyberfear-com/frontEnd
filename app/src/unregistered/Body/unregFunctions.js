define([
    "app", "forge", 'openpgp'
], function (app, forge, openpgp) {

    var unregFunctions = Backbone.Model.extend({

        retrieveEmail:function(emailId,pin){
            var ready=$.Deferred();

            var key=app.globalF.generatePinKey(pin);

            var post={
                emailId:emailId,
                pin:app.transform.SHA256(app.globalF.makeDerivedFancy(key, 'ScRypTmAilSaltForPiN')),
                pinOld:app.transform.SHA512(pin)
            }
            app.serverCall.ajaxRequest('retrieveUnregEmailV2', post, function (result) {
                if (result['response'] == "success") {
                    ready.resolve(result['data']);
                }else if(result['response'] == "fail") {
                    if(result['data']===parseInt("-1")){
                        app.notifications.systemMessage('unregNoLonger');
                    }else if(result['data']>=parseInt(3)){
                        app.notifications.systemMessage('unregNoLonger');
                    }else{
                        app.notifications.systemMessage('unregAttempt',result['data']);
                    }
                }

            });
            return ready.promise();
        },
        downloadFileUnreg: function (fileName, modKey,version, callback) {

            var post = {
                'fileName': fileName,
                'modKey': modKey,
                'version':version
            }
            app.serverCall.ajaxRequest('downloadFileUnreg', post, function (result) {

                if (result['response'] == "success") {
                    callback(result['data'])

                } else if (result['response'] == "fail") {
                    app.notifications.systemMessage('fileNotFound');
                } else {
                    app.notifications.systemMessage('tryAgain');
                }
                //console.log(result);

            });

        },
        deleteEmailsUnreg:function(messageId,modKey){
            console.log(messageId);
            console.log(modKey);
            var post={
                messageId:messageId,
                modKey:modKey
            }

            app.serverCall.ajaxRequest('deleteEmailUnreg',post,function(result){
                console.log(result);
                if(result['response']==='success'){
                    app.notifications.systemMessage('msgRemoved');
                    app.restartApp();
                }else{
                    app.notifications.systemMessage('tryAgain');

                }

            });
        },

        reply:function(action){


           //
           // if (action == 'replyStrict' || action == 'replyFull' || action == 'replyAStrict' || action == 'replyAFull') {
                   // console.log(app.user.get('currentMessageView'));
                   // console.log(app.user.get('draftMessageView'));

                    var currentMessage = app.user.get('currentMessageView');
                    var draft = app.user.get('draftMessageView');
                    var d = new Date();
                    draft['messageId'] = app.user.get("currentMessageView")['id'];

                    var fromAll = $.merge([],currentMessage['meta']['to']);
                    fromAll = $.merge(fromAll,currentMessage['meta']['cc']);

                    var to={};
                    to[currentMessage['meta']['from']]={};
                    draft['meta']['to']=to;

           // console.log(fromAll);

                    $.each(fromAll, function (index, data) {
                        console.log(app.globalF.getEmailsFromString(app.transform.from64str(data)));
                       var t= app.transform.SHA256(app.globalF.getEmailsFromString(app.transform.from64str(data)));
                        if(t===currentMessage['recipientHash']){
                            draft['meta']['from']=data;
                        }
                    });

                 //   console.log(draft['meta']['from']);


                    draft['meta']['toCC'] = {};
                    draft['meta']['toBCC'] = {};
                    draft['meta']['signatureOn'] = false;
                    draft['meta']['version'] = 2;
                    draft['meta']['attachment'] = "";
                    draft['meta']['body'] = app.transform.from64str(currentMessage['meta']['body']);

                    draft['meta']['pinEnabled'] = false;
                    draft['meta']['opened'] = true;
                    draft['meta']['pin'] = '';
                    draft['meta']['status'] = 'normal';

                    draft['meta']['timeSent'] = Math.round(d.getTime() / 1000);
                    draft['meta']['timeCreated'] = Math.round(d.getTime() / 1000);

                    draft['meta']['subject'] = app.transform.from64str(currentMessage['meta']['subject']);
                    draft['meta']['type'] = 3;

                    var options = {};
                    //options.timeZone = 'UTC';
                    options.timeZoneName = 'short';
                    var fromMail = app.globalF.parseEmail(app.transform.from64str(currentMessage['meta']['from']));
                    //console.log(draft);
                    //if(action=='replyStrict' || action=='replyFull'){
                    var preReplyText = '<br/><br/><br/><br/>--------------------------------------------<br/><br/>' + 'On ' + new Date(currentMessage['meta']['timeSent'] * 1000).toDateString(options) + ' at ' + new Date(currentMessage['meta']['timeSent'] * 1000).toLocaleTimeString() + ', ' + fromMail['htmlFdisplay'] +
                        ' wrote: <br/>';

                    draft['body']['html'] = preReplyText + '<div style="margin-left:10px;padding-left:5px;border-left:2px solid #888;">' + $('#virtualization').contents().find("html").html() + '</div>';

                    //}
                    //draft['body']['html']="";
                    //draft['body']['text']=app.transform.from64str(body['body']['text']);
                    draft['modKey'] = "";



        },
        sendMail:function(draft,clearEmail,recipient){

          //  console.log(draft);

                var keys = "";
                var keyArr = {'keys': []};
                var emailpromises=[];
                var toCCkeys = {'keys': []};

                var encryptedPGPmessage = {};
                var toCCrcpt = {};

                var modKey=app.globalF.makeModKey();

                var inTextEmails = {
                    'toCCrcpt': {},
                    'toCCrcptV1':[],
                    'bccRcptV1':[],
                    'bccRcpt': {},

                    'attachments':{},
                    'modKey': app.transform.SHA512(modKey)

                };
                var emailtoCC=jQuery.extend(true, {}, draft);

             //   console.log(draft);
                //console.log(app.transform.from64str(mailKey));


                var pbK=app.transform.detectPGPkey(recipient['publicKey']);

                if(pbK==='v2'){
                    var publicKey = openpgp.key.readArmored(app.transform.from64str(recipient['publicKey']));
                    toCCkeys['keys'].push(publicKey['keys'][0]);
                    toCCrcpt[app.transform.to64str(clearEmail)] = recipient;

                }

           // console.log(toCCrcpt);

                if(toCCkeys.keys.length>0){
                    var key=app.globalF.createEncryptionKey256();
                    var toCCmeta={
                        'attachment':   0,
                        'to' :          draft['meta']['to'],
                        'toCC':           [],
                        'from' :        draft['meta']['from'],
                        'subject' :     draft['meta']['subject'],
                        'body' :        draft['meta']['body'],
                        'en':           1, //encrypted

                        'timeSent' :    draft['meta']['timeSent'],
                        'pin' :         '',

                        'modKey' :      modKey,
                        'type' :        1, //received
                        'status' :      '',
                        'emailHash':    app.transform.SHA512(JSON.stringify(emailtoCC)),
                        'emailKey':     app.transform.to64bin(key)
                    };

                   // console.log('dddd');
                   // console.log(draft['meta']['to']);
                   // console.log(toCCmeta);

                    var toCCPromise = $.Deferred();
                    openpgp.encryptMessage(toCCkeys.keys, app.transform.to64str(JSON.stringify(toCCmeta)))
                        .then(function (pgpMessage) {
                        //console.log(pgpMessage);
                        inTextEmails['toCCrcpt']['recipients'] = app.globalF.rcptObjToArr(toCCrcpt);
                        inTextEmails['toCCrcpt']['email'] = app.transform.toAes64(key,JSON.stringify(emailtoCC));
                        inTextEmails['toCCrcpt']['meta'] = app.transform.to64str(pgpMessage);
                        toCCPromise.resolve();
                    }).catch(function (error) {
                    });
                    emailpromises.push(toCCPromise);
                }



                Promise.all(emailpromises).then(function(values) {
                    //console.log('All done');
                //    console.log(inTextEmails);


                   var post= {
                       'emailData':JSON.stringify(inTextEmails),
                       'refId':app.user.get("currentMessageView")['id']
                   };

                    app.serverCall.ajaxRequest('sendEmailUnreg', post, function (result) {

                        if(result['response']=='success'){

                            if(result['data']=='saved'){

                                $('#dialogModHead').html('Email Sent.')
                                $('#dialogModBody').html('Email was successfully sent. Please click OK to delete email and go to main page or cancel to go back');

                                $('#dialogPop').modal({
                                    backdrop: 'static',
                                    keyboard: true
                                });



                                $('#dialogOk').on('click', function () {
                                    var messageId=app.user.get("currentMessageView")['id'];
                                    var modKey=app.user.get("currentMessageView")['originalBody']['modKey'];

                                    app.unregF.deleteEmailsUnreg(messageId,modKey,function(){
                                        app.restartApp();
                                    });

                                });



                                //app.user.set({"currentMessageView":{}});



                                //console.log(app.user.get("currentFolder"));

                            }else{
                                app.notifications.systemMessage('tryAgain');
                            }

                        }

                    });

                });


               // console.log(toCCmeta);
              //  console.log(inTextEmails);


        }
    });

    return unregFunctions;
});