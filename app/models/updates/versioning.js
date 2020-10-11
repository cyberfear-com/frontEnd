define([
	"app",'openpgp'
], function(app,openpgp){

	var Versioning = Backbone.Model.extend({

		initialize: function(){
			//app.versioning
			this.set({"modalText": ''});
			this.set({"modalpercentage": '0'});

		},

		updateV1: function() {

			var messagesObject={};
			messagesObject[0]={};
			messagesObject[0]['folders']={};
			messagesObject[1]={};
			messagesObject[1]['messages']={};
			var tempPass={};

			var block=1;
			var count=0;
			var folderCount=1;
			var spamId="";
			var order={
				'Inbox':0,
				'Sent':1,
				'Draft':2,
				'Spam':3,
				'Trash':4
			};

            var firstStep=$.Deferred();
            var secondStep=$.Deferred();
            var thirdStep=$.Deferred();
            var fourthStep=$.Deferred();
            var fifthStep=$.Deferred();
            var sixStep=$.Deferred();
            var sevenStep=$.Deferred();
            var eightStep=$.Deferred();

            //variables block
            var emailsIds=[];
            var thisComp=this;
            var encryptedMessageObj={};
            var prfObj=app.user.get("DecryptedProfileObject");
            var newProfObj={};

            var newContList={};
            var newContactObj={};
            var newBlackList={};
            var newBlackListObj={};
            var newUserObj={};
            var PGPkeys={};
            var updateKeys={};
            var dfd_arr = [];


            firstStep.resolve();

            firstStep.done(function () {
                console.log('one');
                thisComp.set({"modalText": 'Parsing Emails..'});
                thisComp.set({"modalpercentage": '10'});

                $.each(app.user.get("DecryptedFolderObject"), function( index, value ) {
                    //index --folder name

                    if(index!='Custom'){
                        var ind=app.transform.SHA256(index).substring(0,10);

                        messagesObject[0]['folders'][ind]={'name':app.transform.to64str(index),'exp':-1,'isMain':true,'role':app.transform.to64str(index),'order':order[index]};

                        if(index=="Spam"){
                            spamId=ind;
                        }
                        //todo fetch all emails and extract received date for folder expiration
                        // o -opened,p-pass,b-block,f-folderIndex,c-created
                        //console.log(value);
                        $.each(value, function( mesId, mesData ) {
                            messagesObject[block]['messages'][mesId]={};
                            messagesObject[block]['messages'][mesId]['st']=mesData['opened']?3:0;
                            //console.log(mesData['opened']);
                            messagesObject[block]['messages'][mesId]['p']=app.transform.to64bin(app.transform.hex2bin(mesData['p']));

                            messagesObject[block]['messages'][mesId]['b']=block;
                            messagesObject[block]['messages'][mesId]['f']=ind; //folder
                            messagesObject[block]['messages'][mesId]['tg']=[];
                            if(!jQuery.isEmptyObject(mesData['tags'])){
                                messagesObject[block]['messages'][mesId]['tg'].push(Object.keys(mesData['tags'])[0]);
                            }

                            messagesObject[block]['messages'][mesId]['fr']=""; //from
                            messagesObject[block]['messages'][mesId]['to']=[]; //to
                            messagesObject[block]['messages'][mesId]['sb']=""; //subject
                            messagesObject[block]['messages'][mesId]['bd']=""; //body
                            messagesObject[block]['messages'][mesId]['tc']=""; //created
                            messagesObject[block]['messages'][mesId]['tr']=""; //received
                            messagesObject[block]['messages'][mesId]['mK']=""; //modKey
                            messagesObject[block]['messages'][mesId]['at']=0; //attachment
                            messagesObject[block]['messages'][mesId]['pn']=""; //pin
                            messagesObject[block]['messages'][mesId]['en']=3; //encrypted 1-local internal,0-clear,3-unknown
                            messagesObject[block]['messages'][mesId]['sg']=""; //encrypted signature
                            messagesObject[block]['messages'][mesId]['sgM']=false; //manual signature

                            messagesObject[block]['messages'][mesId]['tp']=0; //type 1-received,2 sent,3draft
                            messagesObject[block]['messages'][mesId]['sz']=0; //size
                            //messagesObject[block]['messages'][mesId]['st']=1;//status 1-replied,2-forwarder,3-opened,0-unopened
                            messagesObject[block]['messages'][mesId]['vr']=1;//version






                            //messagesObject[block]['messages'][mesId]['tg']=[mesData['tags']!=undefined?[Object.keys(mesData['tags'])[0]]:{}];

                            tempPass[mesId]=messagesObject[block]['messages'][mesId];

                            //tempPass[mesId]={
                            //	'o':mesData['opened'],
                            //	'p':app.transform.to64bin(app.transform.hex2bin(mesData['p']))
                            //};
                            emailsIds.push(mesId);
                            if(count==300){
                                block++;
                                messagesObject[block]={};
                                messagesObject[block]['messages']={};
                                count=0;
                            }

                            count++;
                        });
                        folderCount++
                        //console.log(messagesObject);
                    }else{
                        $.each(value, function( custFolder, custMessage ) {

                            var ind=app.transform.SHA256(custMessage['name']).substring(0,10);

                            messagesObject[0]['folders'][ind]={'name':app.transform.to64str(custMessage['name']),'exp':-1,'isMain':false};
                            $.each(custMessage, function( cmesId, cmesData ) {
                                if(cmesId!="name"){
                                    messagesObject[block]['messages'][cmesId]={};
                                    messagesObject[block]['messages'][cmesId]['st']=cmesData['opened']?3:0;
                                    messagesObject[block]['messages'][cmesId]['p']=app.transform.to64bin(app.transform.hex2bin(cmesData['p']));
                                    messagesObject[block]['messages'][cmesId]['b']=block;
                                    messagesObject[block]['messages'][cmesId]['f']=ind;

                                    messagesObject[block]['messages'][cmesId]['tg']=[];

                                    //todo make sure tags get tranferred corectly
                                    if(!jQuery.isEmptyObject(cmesData['tags'])){
                                        messagesObject[block]['messages'][cmesId]['tg'].push(Object.keys(cmesData['tags'])[0]);
                                    }

                                    messagesObject[block]['messages'][cmesId]['fr']=""; //from
                                    messagesObject[block]['messages'][cmesId]['to']=[]; //to
                                    messagesObject[block]['messages'][cmesId]['sb']=""; //subject
                                    messagesObject[block]['messages'][cmesId]['bd']=""; //body
                                    messagesObject[block]['messages'][cmesId]['tc']=""; //created
                                    messagesObject[block]['messages'][cmesId]['tr']=""; //received
                                    messagesObject[block]['messages'][cmesId]['mK']=""; //modKey
                                    messagesObject[block]['messages'][cmesId]['at']=0; //attachment
                                    messagesObject[block]['messages'][cmesId]['pn']=""; //pin
                                    messagesObject[block]['messages'][cmesId]['en']=3; //encrypted 1-local internal,0-clear,3-unknown
                                    messagesObject[block]['messages'][cmesId]['sg']=""; //encrypted signature
                                    messagesObject[block]['messages'][cmesId]['sgM']=false; //text signature, on the bottom

                                    messagesObject[block]['messages'][cmesId]['tp']=0; //type 1-received,2 sent,3draft
                                    messagesObject[block]['messages'][cmesId]['sz']=0; //size
                                    //messagesObject[block]['messages'][cmesId]['st']=1;//status 1-replied,2-forwarder,3-opened,0-unopened
                                    messagesObject[block]['messages'][cmesId]['vr']=1;//version


                                    //messagesObject[block]['messages'][cmesId]['tg']=[cmesData['tags']!=undefined?[Object.keys(cmesData['tags'])[0]]:{}];

                                    tempPass[cmesId]=messagesObject[block]['messages'][cmesId];

                                    //tempPass[cmesId]={
                                    //	'o':cmesData['opened'],
                                    //	'p':app.transform.to64bin(app.transform.hex2bin(cmesData['p']))
                                    //};

                                    emailsIds.push(cmesId);
                                    if(count==300){
                                        block++;
                                        count=0;
                                        messagesObject[block]={};
                                        messagesObject[block]['messages']={};
                                    }
                                    count++;

                                }
                            });

                            folderCount++
                        });
                    }

                });
                console.log('one1');

                secondStep.resolve();
            });

            secondStep.done(function () {
                console.log('two');

                thisComp.set({"modalText": 'Fetching Old Emails Metadata..'});
                thisComp.set({"modalpercentage": '15'});

                if(emailsIds.length==0){
                    thirdStep.resolve();
                }else{
                    var post={
                        messageIds:JSON.stringify(emailsIds)
                    };

                    app.serverCall.ajaxRequest('retrieveFoldersMeta', post, function (result) {
                        if (result['response'] == "success") {

                            if(result['data']['results']!=undefined){
                                $.each(result['data']['results'], function( index, emailData ) {
                                    //console.log(app.transform.from64bin(tempPass[emailData['messageHash']]['p']));
                                    try {
                                        var key = app.transform.from64bin(tempPass[emailData['messageHash']]['p']);
                                        var z = app.transform.fromAes64(key, emailData['meta']);

                                        var meta = JSON.parse(z);
                                        var email2=app.globalF.getEmailsFromString(app.transform.from64str(meta['from']));

                                        tempPass[emailData['messageHash']]['fr']=meta['from']; //from
                                        tempPass[emailData['messageHash']]['to']=$.isArray(meta['to'])?meta['to']:[meta['to']]; //to
                                        tempPass[emailData['messageHash']]['sb']=meta['subject']; //subject
                                        tempPass[emailData['messageHash']]['bd']=meta['body']; //body
                                        tempPass[emailData['messageHash']]['tc']=meta['timeSent']; //created
                                        tempPass[emailData['messageHash']]['tr']=meta['timeRcvd']; //received
                                        tempPass[emailData['messageHash']]['mK']=meta['modKey']; //modKey
                                        tempPass[emailData['messageHash']]['at']=meta['attachment']=="1"?1:0; //attachment
                                        tempPass[emailData['messageHash']]['pn']=meta['pin']; //pin
                                        tempPass[emailData['messageHash']]['en']=3; //encrypted 1-local internal,0-clear,3-unknown
                                        tempPass[emailData['messageHash']]['sg']=meta['signature']!=undefined?meta['signature']:""; //encrypted signature
                                        tempPass[emailData['messageHash']]['sgM']=false; //manual signature

                                        tempPass[emailData['messageHash']]['tp']=(meta['type']=="received")?1:(meta['type']=="sent")?'2':(meta['type']=="draft"?3:""); //type 1-received,2 sent,3draft
                                        tempPass[emailData['messageHash']]['sz']=emailData['emailSize']; //size
                                        tempPass[emailData['messageHash']]['fsz']=emailData['fileSize'];
                                        //tempPass[emailData['messageHash']]['st']=1;//status 1-replied,2-forwarder,3-opened,0-unopened
                                        tempPass[emailData['messageHash']]['vr']=1;//version


                                        //console.log(emailData['newHash']);
                                        if(emailData['newHash']!=undefined){
                                            //get rid of old numeric ids
                                            messagesObject[tempPass[emailData['messageHash']]['b']]['messages'][emailData['newHash']]=tempPass[emailData['messageHash']];


                                            delete messagesObject[tempPass[emailData['messageHash']]['b']]['messages'][emailData['messageHash']];
                                        }



                                    } catch (err) {

                                    }


                                });
                                thirdStep.resolve();


                            }else{
                                thirdStep.resolve();
                            }

                        }
                    });
                }

                console.log('two2');
            });

            thirdStep.done(function () {
                console.log('three');
                thisComp.set({"modalText": 'Encrypting Email Object..'});
                thisComp.set({"modalpercentage": '20'});var enEmObj=$.Deferred();

                //console.log(messagesObject);
                $.each(messagesObject, function( msgBlock, msgData ) {
                    if(msgBlock==0){
                        encryptedMessageObj[msgBlock]={};
                        encryptedMessageObj[msgBlock]['data']=app.transform.toAes64(app.user.get("folderKey"), JSON.stringify(msgData['folders']));
                        encryptedMessageObj[msgBlock]['nonce']=1;
                        encryptedMessageObj[msgBlock]['index']=msgBlock;
                        encryptedMessageObj[msgBlock]['hash']=app.transform.SHA512(JSON.stringify(msgData['folders']));
                    }else{
                        encryptedMessageObj[msgBlock]={};
                        encryptedMessageObj[msgBlock]['data']=app.transform.toAes64(app.user.get("folderKey"), JSON.stringify(msgData['messages']));
                        encryptedMessageObj[msgBlock]['nonce']=1;
                        encryptedMessageObj[msgBlock]['index']=msgBlock;
                        encryptedMessageObj[msgBlock]['hash']=app.transform.SHA512(JSON.stringify(msgData['messages']));
                    }

                });

                console.log('three1');
                fourthStep.resolve();
            });

            fourthStep.done(function () {
                console.log('four');
                thisComp.set({"modalText": 'Creating Profile Object..'});
                thisComp.set({"modalpercentage": '30'});

                prfObj['version']=2;
                prfObj['fontSize']="";
                prfObj['fontType']="";
                prfObj['lastSeed']="";
                if(prfObj['mailPerPage']!=undefined){
                    prfObj['mailPerPage']=parseInt(app.transform.from64str(prfObj['mailPerPage']));
                }else{
                    prfObj['mailPerPage']=25;
                }



                if(prfObj['sessionExpiration']===undefined){
                    prfObj['sessionExpiration']=-1;
                }else{
                    prfObj['sessionExpiration']=parseInt(app.transform.from64str(prfObj['sessionExpiration']));
                }



                prfObj['displayName']=prfObj['name'];
                delete prfObj['name'];
                delete prfObj['lastSeed'];

                delete prfObj['aliasEmails'];
                delete prfObj['disposableEmails'];

                prfObj['showDisplayName']=true;
                prfObj['includeSignature']=true;
                prfObj['signature']='';
                prfObj['remeberPassword']=false;
                prfObj['defaultPGPKeybit']=2048;


                prfObj['enableForwarding']=false;
                prfObj['forwardingAddress']='';
                prfObj['notificationSound']='';
                prfObj['enableNotification']=false;
                prfObj['notificationAddress']='';


                prfObj['Factor2']={
                    'type':'',
                    'secret':'',
                    'since':''
                };


                prfObj['inboxLayout']=app.transform.to64str("3cols");


                $.each(prfObj['customDomains'], function( index, data ) {
                    prfObj['customDomains'][data['domainName']]={
                        'sec':app.transform.from64str(data['secret']),
                        'spf':false,
                        'mxRec':false,
                        'owner':false,
                        'dkim':false,
                        'alReg':false,
                        'pending':false,
                        'suspended':false,
                        'obsolete':false
                    };
                    delete prfObj['customDomains'][index];
                });

                $.each(prfObj['tags'], function( index, data ) {
                    prfObj['tags'][index]={'color':''};
                });


                delete prfObj['newMails']
                //console.log(prfObj);
                thisComp.set({"modalText": 'Updating Profile..'});
                thisComp.set({"modalpercentage": 40});

                //console.log(prfObj);

                newProfObj[0]={
                    "data": app.transform.toAes64(app.user.get("folderKey"), JSON.stringify(prfObj)),
                    "hash":app.transform.SHA512(JSON.stringify(prfObj)),
                    "index":0,
                    "nonce":1
                };

                console.log('four4');
                fifthStep.resolve();
            });

            fifthStep.done(function () {
                console.log('five');

                thisComp.set({"modalText": 'Creating Contacts Object..'});
                thisComp.set({"modalpercentage": '40'});

                $.each(app.user.get("DecryptedContactsObject"), function( email, data ) {
                    var em=app.transform.to64str(email);
                    newContList[em]={};
                    newContList[em]['n']=app.transform.to64str(data['name']);
                    newContList[em]['p']=app.transform.to64str(data['pin']!=undefined?data['pin']:'');
                    newContList[em]['e']=app.transform.to64str(email);
                    newContList[em]['pgpOn']=false;
                    newContList[em]['pgp']='';
                });



                newContactObj[0]={
                    "data": app.transform.toAes64(app.user.get("folderKey"), JSON.stringify(newContList)),
                    "hash":app.transform.SHA512(JSON.stringify(newContList)),
                    "nonce":1,
                    "index":0
                };

                console.log('five5');

                sixStep.resolve();
            });

            sixStep.done(function () {
                console.log('six');
                thisComp.set({"modalText": 'Creating Filters..'});
                thisComp.set({"modalpercentage": '50'});

                $.each(app.user.get("DecryptedBlackListObject"), function( email, data ) {
                    var em=app.transform.to64str(data['email']);

                    var spamEl={'field':'sender','match':"strict",'to':spamId,'text':em};
                    newBlackList[app.transform.SHA256(JSON.stringify(spamEl))]=spamEl;

                });


                newBlackListObj[0]={
                    "data": app.transform.toAes64(app.user.get("folderKey"), JSON.stringify(newBlackList)),
                    "hash":app.transform.SHA512(JSON.stringify(newBlackList)),
                    "nonce":1,
                    "index":0
                };

               console.log('six6');
                sevenStep.resolve();
            });

            sevenStep.done(function () {
                thisComp.set({"modalText": 'Generating new PGP Keys..'});
                thisComp.set({"modalpercentage": '50'});

                dfd_arr.push($.Deferred());
                var ind=0;

                var testObj=[];
                $.each(app.user.get("DecryptedUserObject")['keys'], function( indexHash, emailData ) {
                    testObj.push(emailData);
                });

                function iterateKeys(testObj,cntr){
                    var eachKey=$.Deferred();

                    //console.log(testObj[cntr]);
                    var emailData=testObj[cntr];
                    PGPkeys[app.transform.to64str(emailData['email'])]=emailData;
                    var pass=app.transform.to64bin(app.globalF.createEncryptionKey256()); //generating random key
                    var options = {
                        numBits: parseInt(emailData['keyLength']),
                        userId: "<"+emailData['email']+">",
                        passphrase: pass
                    };
                    app.versioning.set({"modalText": 'Generating new PGP Key for: '+emailData['email']});
                    openpgp.generateKeyPair(options).then(function(keypair) {
                        var privkey = keypair.privateKeyArmored;
                        var pubkey = keypair.publicKeyArmored;

                        PGPkeys[app.transform.to64str(emailData['email'])]={
                            'addrType':(emailData['canSend']==1) ? 1 : (emailData['canSend']==0) ? 2 : (emailData['canSend']==2) ? 3 : 2, //1 -orig,2 dispos,3-alias
                            'isDefault':(emailData['canSend']==1) ? true :false,
                            'description':"",
                            'canSend':(emailData['canSend']==1 || emailData['canSend']==2)? true:false,
                            'name':emailData['canSend']==1 ? app.transform.to64str(app.user.get("displayName")):'',
                            'displayName':(emailData['canSend']==1 && app.user.get("displayName")!="")?app.transform.to64str(app.user.get("displayName")+" <"+emailData['email']+">"):app.transform.to64str(emailData['email']),
                            'email':app.transform.to64str(emailData['email']),
                            'includeSignature':false,
                            'v1':{
                                'privateKey':emailData['privateKey'],
                                'publicKey':emailData['publicKey'],
                                'receiveHash':emailData['receiveHash']
                            },
                            'v2':{
                                'privateKey':app.transform.to64bin(privkey),
                                'publicKey':app.transform.to64bin(pubkey),
                                'receiveHash':app.transform.getReceiveHash(emailData['email'])
                            },
                            'keyPass':pass, //to decrypt PGP key
                            'signature':'',
                            'keyLength':emailData['keyLength'],
                            'date':Math.round((new Date).getTime()/1000),
                            'keysModified':'',
                            'isChanged':false
                        };
                        updateKeys[app.transform.to64str(emailData['email'])]=app.transform.to64bin(pubkey);

                        eachKey.resolve();

                    }).catch(function(error) {
                        console.log(error);
                        app.versioning.set({"modalText": 'Failed to generate PGP Keys. Please try again'});
                    });
                        eachKey.done(function () {
                            if(cntr<testObj.length-1){
                                cntr++;
                                iterateKeys(testObj,cntr);
                            }else{

                                eightStep.resolve();
                            }
                        });

                }
                iterateKeys(testObj,0);

            });

            eightStep.done(function () {
              //  console.log(PGPkeys);

                var oldPlan=app.user.get("oldPlan");
                var newPlan=oldPlan['id'];


                app.user.get("DecryptedUserObject")['keys']=PGPkeys;

                //console.log(app.user.get("DecryptedUserObject"));

                var strUserObj=JSON.stringify(app.user.get("DecryptedUserObject"));

                newUserObj[0]={
                    "data": app.transform.prof2DbV2(strUserObj,app.user.get("secondPassword"),app.user.get("salt")),
                    "hash":app.transform.SHA512(strUserObj),
                    "nonce":1,
                    "index":0

                };

                app.userObjects.set({"EncryptedUserObject":JSON.stringify(newUserObj)});
                app.userObjects.set({"EncryptedContactsObject":JSON.stringify(newContactObj)})
                app.userObjects.set({"EncryptedBlackListObject":JSON.stringify(newBlackListObj)});

                app.userObjects.set({"EncryptedProfileObject":JSON.stringify(newProfObj)});
                app.userObjects.set({"EncryptedFolderObject":JSON.stringify(encryptedMessageObj)});



                var updatingPost={};

                updatingPost['userObject']=app.userObjects.get("EncryptedUserObject");
                updatingPost['contactObject']=app.userObjects.get("EncryptedContactsObject");
                updatingPost['blackListObject']=app.userObjects.get("EncryptedBlackListObject");
                updatingPost['updateKeys']=JSON.stringify(updateKeys);

                updatingPost['plan']=newPlan;

                updatingPost['profileObject']=app.userObjects.get("EncryptedProfileObject");
                updatingPost['folderObject']=app.userObjects.get("EncryptedFolderObject");
                updatingPost['modKey']=app.user.get("modKey");
                updatingPost['profileVersion']=2;


                thisComp.set({"modalText": 'Saving..'});
                thisComp.set({"modalpercentage": 60});

                //var thisModule=this;


                var secretnew = app.user.get('secondPassword');
                var salt = app.user.get('salt');
                var derivedKey = app.globalF.makeDerived(secretnew, salt);
                var Test = app.transform.bin2hex(derivedKey);
                var Part2 = Test.substr(64, 128);
                var keyA = app.transform.hex2bin(Part2);
                var token = app.globalF.makeRandomBytes(256);
                var tokenHash = app.transform.SHA512(token);
                var tokenAes = app.transform.toAesBin(keyA, token);
                var tokenAesHash = app.transform.SHA512(tokenAes);

                app.user.set({downloadToken:tokenAes});

                updatingPost['tokenHash']=tokenHash;
                updatingPost['tokenAesHash']=tokenAesHash;

                app.serverCall.ajaxRequest('updateUserData',updatingPost,function(result)
                {
                    if(result['response']=="success"){

                        setTimeout(function() {
                            app.versioning.set({"modalText": 'Finished.'});
                            app.versioning.set({"modalpercentage": 100});
                            app.notifications.systemMessage('Saved');

                            $('#startUpdate').addClass('hidden');
                            $('#cancelUpdate').addClass('hidden');

                            $('#logoutModal').modal({
                                backdrop: 'static',
                                keyboard: true
                            });

                        }, 1000);

                    }else{

                        app.versioning.set({"modalText": ''});
                        app.versioning.set({"modalpercentage": 0});

                        $('#startUpdate').prop('disabled',false);
                        $('#startUpdate').html('Continue');
                        $('#cancelUpdate').toggleClass('hidden');
                        $('#logoutUpdate').toggleClass('hidden');
                    }


                },function(){});
            });
            //-------------------------------------
        }

	});

	return Versioning;
});