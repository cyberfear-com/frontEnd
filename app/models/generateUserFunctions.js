define([
	"app", "forge",'openpgp'
], function (app, forge,openpgp) {
	"use strict";
	var generateUserFunctions = Backbone.Model.extend({

		defaults: {
			loginDisable: false,
			buttonTag: '',
			picture: null
		},

		makerandomEmail: function () {
			var text = "";
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 27; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		},

		//makerandom

		makeQRSecret: function () {
			var text = "";
			var possible = "QWE7DSAZXC6RTYHG2FVB3NOIU4JKLM5P";

			for (var i = 1; i < 30; i++){
				if(i % 5==0){
					text += '-';
				}else{
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				}

			}

			return text;
		},

		makeVerificationString: function (str) {
			var secrt = {};
			var str = app.transform.SHA256(app.transform.bin2hex(app.user.get("salt")) + str);
			secrt['base'] = str;
			secrt['hash'] = app.transform.SHA256(str);
			return secrt;
		},

		generatePairs: function (length,email,callback) {

			var deferred = $.Deferred();
			var pass=app.transform.to64bin(app.globalF.createEncryptionKey256()); //generating random key

			var options = {
				numBits: parseInt(length),
				userId: email,
				passphrase: pass
			};

			var PGPkeys = {
				'privateKey': '',
				'publicKey': ''
			};

			openpgp.generateKeyPair(options).then(function(keypair) {
				var privkey = keypair.privateKeyArmored;
				var pubkey = keypair.publicKeyArmored;

				var PGPkeys = {
					'privateKey': privkey,
					'publicKey': pubkey,
					'password':pass
				};

				callback(PGPkeys);

			}).catch(function(error) {
					app.notifications.systemMessage('fld2GeneratePgp');
					callback(PGPkeys);
			});
/*
			var step = function () {
				if (!app.user.get("inProcess")) {
					console.log('interrupted');
					callback(PGPkeys);
				}else if(PGPkeys['privateKey']==''){
					setTimeout(step, 1);
				}else {
					console.log(PGPkeys);
					console.log('executed');
					callback(PGPkeys);
				}

			};
			setTimeout(step);
			*/
		},

        generateUserObjects:function (email,pass,secret,folderKey,salt){
            var process=$.Deferred();

            /*need to create
             1. Profile Object
             2. FolderObj
             3. userObj
             4. contacts
             5.blackList

             */

            //1 Profile
            var prfObj={};
            var newProfObj={};

            prfObj['version']=2;
            prfObj['fontSize']="";
            prfObj['fontType']="";
            prfObj['lastSeed']=0;
            prfObj['mailPerPage']=25;
            prfObj['sessionExpiration']=-1;
            prfObj['displayName']="";
            prfObj['email']=app.transform.to64str(email);
            prfObj['rememberContacts']=true;

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
            prfObj['customDomains']={};
            prfObj['tags']={};

            newProfObj[0]={
                "data": app.transform.toAes64(folderKey, JSON.stringify(prfObj)),
                "hash":app.transform.SHA512(JSON.stringify(prfObj)),
                "index":0,
                "nonce":1
            };
            //=======================
            //2. folderObj

            //index --folder name


            var messagesObject={};
            messagesObject[0]={};
            messagesObject[0]['folders']={};

            messagesObject[1]={};
            messagesObject[1]['messages']={};

            var order={
                'Inbox':0,
                'Sent':1,
                'Draft':2,
                'Spam':3,
                'Trash':4
            };


            var spam=app.transform.SHA256('Spam').substring(0,10);

            messagesObject[0]['folders'][spam]={'name':app.transform.to64str('Spam'),'exp':-1,'isMain':true,'role':app.transform.to64str('Spam'),'order':order['Spam']};

            var inbox=app.transform.SHA256('Inbox').substring(0,10);
            messagesObject[0]['folders'][inbox]={'name':app.transform.to64str('Inbox'),'exp':-1,'isMain':true,'role':app.transform.to64str('Inbox'),'order':order['Inbox']};

            var sent=app.transform.SHA256('Sent').substring(0,10);
            messagesObject[0]['folders'][sent]={'name':app.transform.to64str('Sent'),'exp':-1,'isMain':true,'role':app.transform.to64str('Sent'),'order':order['Sent']};

            var draft=app.transform.SHA256('Draft').substring(0,10);
            messagesObject[0]['folders'][draft]={'name':app.transform.to64str('Draft'),'exp':-1,'isMain':true,'role':app.transform.to64str('Draft'),'order':order['Draft']};

            var trash=app.transform.SHA256('Trash').substring(0,10);
            messagesObject[0]['folders'][trash]={'name':app.transform.to64str('Trash'),'exp':-1,'isMain':true,'role':app.transform.to64str('Trash'),'order':order['Trash']};


            var encryptedMessageObj={};
            encryptedMessageObj[0]={};
            encryptedMessageObj[0]['data']=app.transform.toAes64(folderKey, JSON.stringify(messagesObject[0]['folders']));
            encryptedMessageObj[0]['nonce']=1;
            encryptedMessageObj[0]['index']=0;
            encryptedMessageObj[0]['hash']=app.transform.SHA512(JSON.stringify(messagesObject[0]['folders']));

            encryptedMessageObj[1]={};
            encryptedMessageObj[1]['data']=app.transform.toAes64(folderKey, JSON.stringify(messagesObject[1]['messages']));
            encryptedMessageObj[1]['nonce']=1;
            encryptedMessageObj[1]['index']=1;
            encryptedMessageObj[1]['hash']=app.transform.SHA512(JSON.stringify(messagesObject[1]['messages']));


            //================

            //4 contact

            var newContList={};
            var newContactObj={};

            newContactObj[0]={
                "data": app.transform.toAes64(folderKey, JSON.stringify(newContList)),
                "hash":app.transform.SHA512(JSON.stringify(newContList)),
                "nonce":1,
                "index":0
            };

            //===========

            //5. blacklist
            var newBlackList={};
            var newBlackListObj={}

            newBlackListObj[0]={
                "data": app.transform.toAes64(folderKey, JSON.stringify(newBlackList)),
                "hash":app.transform.SHA512(JSON.stringify(newBlackList)),
                "nonce":1,
                "index":0
            };


            //==========================

            //3. UserObj
            //email

            var PGPkeys={};

            var testObj=[];
            var updateKeys={};

            var emailData={
                'addrType':1,
                'isDefault': true,
                'description':"",
                'canSend':1,
                'name':'',
                'displayName':app.transform.to64str(email),
                'email':email,
                'includeSignature':true,
                'signature':'<div>Sent using Encrypted Email Service -&nbsp;<a href="https://cyberfear.com/index.html#createUser/'+app.user.get("userPlan")['coupon']+'" target="_blank">CyberFear.com</a></div>',
                'keyLength':2048,
                'keysModified':'',
                'isChanged':false

            };
            testObj.push(emailData);

            var eightStep=$.Deferred();

            function iterateKeys(testObj,cntr){
                var eachKey=$.Deferred();

                var emailData=testObj[cntr];

                PGPkeys[app.transform.to64str(emailData['email'])]=emailData;

                var pass=app.transform.to64bin(app.globalF.createEncryptionKey256()); //generating random key

                var options = {
                    numBits: emailData['keyLength'],
                    userId: emailData['email'],
                    passphrase: pass
                };

                openpgp.generateKeyPair(options).then(function(keypair) {
                    var privkey = keypair.privateKeyArmored;
                    var pubkey = keypair.publicKeyArmored;

                    PGPkeys[app.transform.to64str(emailData['email'])]={
                        'addrType':emailData['addrType'],
                        'isDefault':emailData['isDefault'],
                        'description':emailData['description'],
                        'canSend':emailData['canSend'],
                        'name':emailData['name'],
                        'displayName':emailData['displayName'],
                        'email':app.transform.to64str(emailData['email']),
                        'includeSignature':false,
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
                    app.notifications.systemMessage('tryAgain');
                });

                eachKey.done(function () {
                    eightStep.resolve();
                });

            }

            iterateKeys(testObj,0);


            eightStep.done(function () {

               var modKey= app.globalF.makeModKey();

                    var nUserObj={
                        modKey:modKey,
                        folderKey:app.transform.to64bin(app.transform.bin2hex(folderKey)),
                        keys:PGPkeys
                    };

                    //var folderKey=app.globalF.makeRandomBytes(32);

                    //var salt=app.globalF.makeRandomBytes(256);


                    var strUserObj=JSON.stringify(nUserObj);

                    // oldPass,newSecretPhrase
                    var newUserObj={};

                    newUserObj[0]={
                        "data": app.transform.prof2DbV2(strUserObj,secret,salt),
                        "hash":app.transform.SHA512(strUserObj),
                        "nonce":1,
                        "index":0

                    };




                    var updatingPost={};

                    updatingPost['userObject']=JSON.stringify(newUserObj);
                    updatingPost['contactObject']=JSON.stringify(newContactObj);
                    updatingPost['blackListObject']=JSON.stringify(newBlackListObj);
                    updatingPost['updateKeys']=JSON.stringify(updateKeys);

                    updatingPost['profileObject']=JSON.stringify(newProfObj);
                    updatingPost['folderObject']=JSON.stringify(encryptedMessageObj);
                    updatingPost['modKey']=modKey;
                    updatingPost['profileVersion']=2;


                    //var thisModule=this;





                var derivedKey = app.globalF.makeDerived(secret, salt);

                    app.generate.generateToken(derivedKey,function(tokenHash,tokenAes,tokenAesHash){

                        app.user.set({downloadToken:tokenAes});

                        updatingPost['email']=email;
                        updatingPost['tokenHash']=tokenHash;
                        updatingPost['tokenAesHash']=tokenAesHash;

                        process.resolve(updatingPost);

                    });


                });

            return process;
        },

        generateToken:function(derivedKey,callback){

            var Test = app.transform.bin2hex(derivedKey);
            var Part2 = Test.substr(64, 128);
            var keyA = app.transform.hex2bin(Part2);

            var token = app.globalF.makeRandomBytes(256);
            var tokenHash = app.transform.SHA512(token);
            var tokenAes = app.transform.toAesBin(keyA, token);
            var tokenAesHash = app.transform.SHA512(tokenAes);

            callback(tokenHash,tokenAes,tokenAesHash);
        },

		createUserObject: function (email, password) {





		/*

			email = email.toLowerCase().split('@')[0];

			var dfdmail = new $.Deferred();

			this.set({"loginDisable": true});
			var mailpair = '';
			var mod = this;
			//console.log(CreateUser.set({"buttonText": "Generating RSA Keys.."}));
			//CreateUser.prototype.method.set({"buttonText": "Generating RSA Keys.."});

			mod.set({"buttonText": "Generating RSA Keys.."});
			mod.set({"buttonTag": "fa fa-refresh fa-spin"});


			app.globalF.generatePairs(512).done(function (keyPair) { //todo change on 2048
				mailpair = keyPair;
				dfdmail.resolve();
			});

			dfdmail.done(function () {

				mod.set({"buttonText": "Generating User Object.."});
				var secret = password;

				mod.set({"buttonText": "Encrypting User Object.."});

				var DATA = app.globalF.generateUserObj(mailpair, secret, email, true);

				var derivedPass = app.globalF.makeDerivedFancy(secret, 'scrypTmail');

				//MainObj=DATA['MainObj'];
				//DATA['MainObj']['token']=$('#CreateUser_invitation').val().toLowerCase();

				var toFile = DATA['toFile'];
				DATA['MainObj']['password'] = app.transform.SHA512(derivedPass);

				mod.set({"buttonText": "Saving user.."});

				$.ajax({
					type: "POST",
					url: '/CreateUserDb',
					data: DATA['MainObj'],
					success: function (data, textStatus) {
						if (data.email == 'success') {
							mod.set({"buttonText": "User Created"});
							mod.set({"buttonTag": "fa fa-check"});

							//$('#reguser').prop('disabled', true);
							$("#createUser-form")[0].reset();
							$('#createAccount-modal').modal('hide');
							$('#yModal').modal("show");
							$('#reguser').prop('disabled', false);

						} else {
							mod.set({"buttonText": "Create"});
							mod.set({"buttonTag": ""});
							mod.set({"loginDisable": false});
							app.notifications.systemMessage('tryAgain');
						}


					},
					error: function (data, textStatus) {
						mod.set({"buttonText": "Create"});
						mod.set({"buttonTag": ""});
						mod.set({"loginDisable": false});
						app.notifications.systemMessage('tryAgain');
					},
					dataType: 'json'
				});

			});

			//return 'ggg';*/

		}

	});

	return generateUserFunctions;
});