define([
	"app", "forge",'openpgp'
], function (app, forge,openpgp) {
	"use strict";
	var fetchingEmails = Backbone.Model.extend({
        //app.mailMan
        initialize: function(){
            this.set({"emailHashes":{}});
            this.set({"emailKeysByHashes":{}});
            this.set({'checkNewEmails':false});
            this.set({'mailCheckInterval':{}});
            this.set({'makeItFaster':false});

        },
		//defaults: {
		//	loginDisable: false,
			//buttonText: 'Create Account',
			//buttonTag: '',
			//picture: null
		//},

        startShift:function(){
            //app.user set flag checking email if is set disable check spin in mailbox or represent state
            var thisComp=this;

                if(app.user.get("checkNewEmails")===false){

                    app.user.set({
                        oldUnopenedEmails:app.globalF.countUnopened(app.user.get('unopenedEmails'))
                    });


                    clearTimeout(app.mailMan.get('mailCheckInterval'));

                    app.user.set({"checkNewEmails":true});
                    var mailV2=$.Deferred();

                    app.mailMan.preparations()
                        .then(function () {

                            app.mailMan.fetchEmail()
                                .then(function (result) {

                                    if (result['response'] === 'success' && result['data'] != undefined) {

                                        //todo add last time email checked, prevent from fetching improper data(if hash match with other user)

                                        if (result['data']['v2'] != undefined && Object.keys(result['data']['v2']).length > 0) {
                                            app.user.set({"lastIdKey":result['data']['lastId']});
                                           // console.log(result['data']['lastId']);
                                            app.mailMan.decodeV2(result['data']['v2'], function (decryptedSeedObject) {
                                                //next step is to get metadata from email, but we already have that and its ready to be saved in our objects
                                                if (Object.keys(decryptedSeedObject).length > 0) {
                                                    app.mailMan.applyFilter(decryptedSeedObject, function () {
                                                        app.mailMan.saveEmailIntoInboxV2(decryptedSeedObject, function () {
                                                                mailV2.resolve();
                                                                app.mailMan.set({'makeItFaster':true});

                                                            var oldie=app.user.get('oldUnopenedEmails');
                                                            var newie=app.globalF.countUnopened(app.user.get('unopenedEmails'))

                                                                            if(oldie<newie){
                                                                                if (!("Notification" in window)) {
                                                                                }
                                                                                else if (Notification.permission === "granted") {

                                                                               if(newie-oldie>1){
                                                                                    var notification = new Notification('CyberFear.com', {
                                                                                        body:  "You got "+(newie-oldie)+" new emails",
                                                                                        requireInteraction: true,
                                                                                        vibrate: [200, 100, 200]
                                                                                    })
                                                                                   notification.onclick = function(x) { window.focus(); this.close(); };
                                                                                }else{
                                                                                    var notification = new Notification('CyberFear.com', {
                                                                                        body: "You got new email",
                                                                                        requireInteraction: true,
                                                                                        vibrate: [200, 100, 200]

                                                                                    })
                                                                                    notification.onclick = function(x) { window.focus(); this.close(); };
                                                                                }
                                                                            }
                                                                           }

                                                        });
                                                    });
                                                }else{

                                                    mailV2.resolve();
                                                    app.mailMan.set({'makeItFaster':true});
                                                }

                                            });
                                        }else{
                                            mailV2.resolve();
                                        }

                                    } else {

                                        mailV2.resolve();

                                    }

                                        mailV2.done(function () {

                                            setTimeout(function () {
                                                app.user.set({"checkNewEmails": false});
                                            }, 1000); //just to give notice somethig is going on


                                            var time=30000;
                                            if(app.mailMan.get('makeItFaster')){
                                                time=15000;
                                            }
                                            app.mailMan.set({'makeItFaster':false});
                                            var schedule=setTimeout(function () {
                                                thisComp.startShift();
                                            }, time);

                                            app.mailMan.set({'mailCheckInterval':schedule});

                                            app.globalF.syncUpdates();

                                        });





                                });


                        });
                }


        },
        applyFilter:function(decryptedMeta,callback){
            var filter =app.user.get('filter');

            if(Object.keys(filter).length>0){

                $.each(decryptedMeta, function (messageId, messageObj) {

                    $.each(filter, function (filterId, filterRule) {
                        var match=false;

                        //sender part
                        if(filterRule['field']==='sender'){

                            var mSender=app.transform.from64str(messageObj['meta']['from']).trim().toLowerCase();

                            var fSender=app.transform.from64str(filterRule['text']).trim().toLowerCase();

                            if(filterRule['match']==="strict"){
                                app.globalF.parseEmail(mSender,'',function(result){
                                    mSender=result['email'];
                                });

                                if(mSender===fSender){
                                    match=true;
                                }

                            }else if(filterRule['match']==="relaxed"){

                                if(mSender.indexOf(fSender) > -1){
                                    match=true;
                                }

                            }else if(filterRule['match']==="negative"){

                                if(mSender.indexOf(fSender) === -1){
                                    match=true;
                                }
                            }

                        }

                        //subject
                        if(filterRule['field']==='subject'){

                            var mSubject=app.transform.from64str(messageObj['meta']['subject']).trim().toLowerCase();
                            var fSubject=app.transform.from64str(filterRule['text']).trim().toLowerCase();

                            if(filterRule['match']==="strict"){

                                if(mSubject===fSubject){
                                    match=true;
                                }

                            }else if(filterRule['match']==="relaxed"){

                                if(mSubject.indexOf(fSubject) > -1){
                                    match=true;
                                }

                            }else if(filterRule['match']==="negative"){

                                if(mSubject.indexOf(fSubject) === -1){
                                    match=true;
                                }
                            }

                        }

                        //to
                        if(filterRule['field']==='rcpt'){

                            //recpt is array
                            var allRcpt=$.merge(messageObj['meta']['to'], messageObj['meta']['toCC']);
                            var fRcpt=app.transform.from64str(filterRule['text']).trim().toLowerCase();

                            $.each(allRcpt, function (index, recipient) {

                                var mRcpt=app.transform.from64str(recipient).trim().toLowerCase();

                                if(filterRule['match']==="strict"){

                                    app.globalF.parseEmail(mRcpt,'',function(result){
                                        mRcpt=result['email'];
                                    });

                                    if(mRcpt===fRcpt){
                                        match=true;
                                    }

                                }else if(filterRule['match']==="relaxed"){

                                    if(mRcpt.indexOf(fRcpt) > -1){
                                        match=true;
                                    }

                                }else if(filterRule['match']==="negative"){
                                    if(mRcpt.indexOf(fRcpt) === -1){
                                        match=true;
                                    }
                                }

                            });


                        }

                        if(match===true){
                            decryptedMeta[messageId]['sugFolder']=filterRule['to'];
                        }

                    });
                    //console.log(messageObj);
                });

            }
            //console.log(filter);

           // console.log(decryptedMeta);

            callback(decryptedMeta);



        },

        saveEmailIntoInboxV2: function(decryptedMeta,callback) {

            //  console.log(decryptedMeta);

            /*
             1) get new emailId,
             2) create message with this id in folder Dir(inbox)
             3) send data to save folderObject and deleting email from queue
             */
            /*


             fr:""; //from
             to:[]; //to
             sb:""; //subject
             bd:""; //body
             tc:""; //created
             tr:""; //received
             mK:""; //modKey
             at:0; //attachment
             pn:""; //pin
             en:3; //encrypted 1-scryptmail internal,0-clear,3-unknown
             sg:""; //encrypted signature
             sgM:false; //manual signature

             tp:0; //type 1-received,2 sent,3draft
             sz:0; //size
             //st:1;//status 1-replied,2-forwarder,3-opened,0-unopened
             vr:1;//version
             */

            var messageObj = {};
            var emailpromises = $.Deferred();

            var modK = app.globalF.makeModKey();

            var post = {
                modKey: modK,
                limit: Object.keys(decryptedMeta).length
            };
            var mesIds=[];
            var waitforId=$.Deferred();

            app.serverCall.ajaxRequest('getDraftMessageId', post, function (result) {
                if (result['response'] == "success") {
                    mesIds=result['data']['messageIds']
                    //console.log(result['data']['messageIds']);
                    if(mesIds.length==Object.keys(decryptedMeta).length){
                        waitforId.resolve();
                    }

                }
            });



            waitforId.then(function() {
                var drId=0;
                $.each(decryptedMeta, function (emailMetaId, data) {
                    var d = new Date();
                    var post = {
                        modKey: modK
                    };
                    //var emailMetaPromise = $.Deferred();

                    // app.serverCall.ajaxRequest('getDraftMessageId', post, function (result) {
                    //if (result['response'] == "success") {

                    decryptedMeta[emailMetaId]['persFid'] = mesIds[drId];
                    decryptedMeta[emailMetaId]['persFmodKey'] = modK;

                    var destFolder = app.user.get('systemFolders')['inboxFolderId'];
                    if (data['sugFolder'] != undefined) {
                        var allFolders = app.user.get('folders');
                        if (allFolders[data['sugFolder']] != undefined) {
                            destFolder = data['sugFolder'];
                        }
                    }
                    var sentDate = 0;
                    if (data['timeSent'] !== undefined) {
                        sentDate = parseInt(data['timeSent']);
                    } else if (data['meta']['timeRcvd'] !== undefined) {
                        sentDate = parseInt(data['meta']['timeRcvd']);
                    } else {
                        sentDate = parseInt(data['meta']['timeSent'])
                    }

                    messageObj[mesIds[drId]] = {

                        'p': data['meta']['emailKey'], //password
                        'b': "", //block to decide later
                        'tc': parseInt(data['meta']['timeSent']), //
                        'tg': [],
                        'f': destFolder, //folder to inbox
                        'fr': data['meta']['from'], //from


                        'to': $.merge(data['meta']['to'], data['meta']['toCC']), //to

                        'sb': data['meta']['subject'], //subject
                        'bd': data['meta']['body'], //body


                        'tr': sentDate, //timeSent received - outside more
                        //'tr':Math.round(d.getTime() / 1000), //received
                        'mK': modK, //modKey
                        'at': data['meta']['attachment'], //attachment
                        'pn': data['meta']['pin'], //pin
                        'en': data['meta']['en'], //encrypted 1-scryptmail internal,0-clear,3-unknown
                        'sg': "", //encrypted signature
                        'sgM': false, //manual signature

                        'tp': 1, //type 1-received,2 sent,3draft
                        'sz': parseInt(data['emailSize']), //size
                        'st': 0,//status 1-replied,2-forwarder,3-opened,0-unopened
                        'vr': 2//version

                    };
                 //   emailMetaPromise.resolve();
                    //  }
                    // });
                   // emailpromises.push(emailMetaPromise);
                    drId++;
                });
                emailpromises.resolve();
            });


        emailpromises.then(function() {
            console.log(decryptedMeta);

                //   console.log(messageObj);
                   var folder = app.user.get('systemFolders')['inboxFolderId'];

                       app.globalF.addNewMessageToFolder(messageObj, folder, function () {
                           var message2Delete=[];
                           $.each(decryptedMeta, function (oldMessageId, data) {
                               var messageData={
                                   'mailQId':oldMessageId,
                                   'mailModKey':data['mailModKey'],
                                   'persFid':data['persFid'],
                                   'persFmodKey':data['persFmodKey']
                               };

                               message2Delete.push(messageData);

                           });

                           app.userObjects.updateObjects('saveNewEmailV2', message2Delete, function (result) {

                                callback();

                           });

                       });

               });




        },




        decodeV2:function(emailsObjects,callback){
            //console.log(emailsObjects);
            var keysByHash=app.mailMan.get("emailKeysByHashes");
            var decryptedSeedObject={};
            var decryptionPromise=[];

            $.each(emailsObjects, function (index, data) {

                var key = app.transform.from64str(keysByHash[data['rcpnt']]['privateKey']);
                var keyPass=keysByHash[data['rcpnt']]['keyPass'];
                var encryptedMessage=app.transform.from64bin(data['meta']);
                var emailPromise = $.Deferred();

                app.transform.PGPmessageDecrypt(key,keyPass,encryptedMessage,function(decryptedText64){

                    if(decryptedText64!==false){
                        var decryptedTextObj=JSON.parse(app.transform.from64str(decryptedText64));

                        //console.log(decryptedTextObj);

                        decryptedSeedObject[index]={
                            'mailId':index,
                            'mailModKey':decryptedTextObj['modKey'],
                            'emailKey':decryptedTextObj['emailKey'],
                            'rcpnt':data['rcpnt'],
                            'meta':decryptedTextObj,
                            'file':data['file'],
                            'emailSize':data['emailSize'],
                            'v':2,
                            'timeSent':data['timeSent']
                        };
                    }
                    emailPromise.resolve();
                });

                decryptionPromise.push(emailPromise);
            });

            Promise.all(decryptionPromise).then(function(values) {
                callback(decryptedSeedObject);
               // console.log(decryptedSeedObject);
            });

        },

        /**
         *
         * @returns {*}
         */
        fetchEmail:function(){
            var dfd = jQuery.Deferred();

            var post={
                'emailHashes':JSON.stringify(app.mailMan.get("emailHashes")),
                'limit':50,
                'lastIdKey': app.user.get("lastIdKey")
            }

            app.serverCall.ajaxRequest('getNewSeeds', post, function (result) {
                dfd.resolve(result);
            });


            return dfd.promise();
        },

        /**
         *
         * Check available keys and email addresses for fetching
         *
         * @param callback
         */
        preparations: function(){
            //check all keys
            var dfd = jQuery.Deferred();

                var keys=app.user.get('allKeys');
                var hashes={
                    'v2':[]
                };
                var emailByhash={};
            //console.log(app.user.get('allKeys'));

                $.each(keys, function (email64, emailData) {
                    //hashes.push(emailData['v1']['receiveHash']);
                   //hashes.push(emailData['v2']['receiveHash']);

                    hashes['v2'].push(emailData['v2']['receiveHash']);

                    emailByhash[emailData['v2']['receiveHash']]=jQuery.extend(true, {}, emailData['v2']);
                    emailByhash[emailData['v2']['receiveHash']]['version']=2;
                    emailByhash[emailData['v2']['receiveHash']]['keyPass']=emailData['keyPass'];



                });

                app.mailMan.set({
                    "emailHashes":hashes,
                    "emailKeysByHashes":emailByhash
                });
                dfd.resolve();

            return dfd.promise();

        }

	});

	return fetchingEmails;
});
