


define(["app", "forge", "CryptoJS", "twofish", 'openpgp'], function(app, forge, CryptoJS, TwoFish, openpgp){

	var EncodingDecodingFunctions = Backbone.Model.extend({
		//app.transform
		SHA512: function (data) {
			var md = forge.md.sha512.create();
			md.update(data, 'utf8');
			return md.digest().toHex();
		},
		SHA256:function (data) {
			var md = forge.md.sha256.create();
			md.update(data, 'utf8');
			return md.digest().toHex();
		},
		SHA1:function (data) {
			var md = forge.md.sha1.create();
			md.update(data, 'utf8');
			return md.digest().toHex();
		},
		escapeTags:function(html) {
		var escape = document.createElement('textarea');
		escape.innerHTML = html;
		return escape.innerHTML;
	},

		hex2bin:function (hex) {
			return forge.util.hexToBytes(hex)
		},
		bin2hex:function (bin) {
			return forge.util.bytesToHex(bin)
		},

		from64bin: function(data) {
			return forge.util.decode64(data);
		},
		from64oldBin:function(data){
			return forge.util.binary.base64.decode(data);
		},

		to64bin: function (data) {
			return forge.util.encode64(data);
		},
		check64str: function(data) {
			try{
				forge.util.text.utf8.decode(forge.util.binary.base64.decode(data));
				return true;
			} catch (err) {
				return false;
			}

		},
		from64str: function(data) {
			if(data=== undefined){
				return data;
			}
			try{
				if(typeof data['text'] != "undefined" && typeof data['html'] != "undefined"){
					return forge.util.text.utf8.decode(forge.util.binary.base64.decode(data['text']));

				}else{
					return forge.util.text.utf8.decode(forge.util.binary.base64.decode(data));
				}

			} catch (err) {
				return forge.util.hexToBytes(forge.util.bytesToHex(forge.util.binary.base64.decode(data)));
				//return 'FtD: '+data;
			}

		},
        from64strXss:function(data) {
            try{
                return filterXSS(forge.util.text.utf8.decode(forge.util.binary.base64.decode(data)));
            } catch (err) {
                return 'FtD: '+data;
            }

        },

		detectPGPkey:function(key){
			//key="c2VyZ2VpQHNjcnlwdG1haWwuY29t";
			var pki = forge.pki;
			var result =false;

			try{
				var publicKey = pki.publicKeyFromPem(app.transform.from64str(key));
				result='v1';
			} catch (err) {
				var publicKey = openpgp.key.readArmored(app.transform.from64str(key));
				if(publicKey['keys'].length>0){
					result='v2';
				}
			}
			return result;
		},


		sendWithinScryptOld: function (publicKey,draft){
			var pki = forge.pki;

			var messaged = {};
			var emailPreObj = {
				'to': '',
				'from': '',
				'subj': '',
				'meta': {},
				'body': {},
				'attachment': {},
				'modKey': '',
				'mailId': ''
			};

			var publicKey = pki.publicKeyFromPem(app.transform.from64str(publicKey));

			var key = app.globalF.createEncryptionKey256();

			console.log(draft);

			emailPreObj['attachment']=draft['attachment'];

			emailPreObj['meta']['attachment'] = (Object.keys(draft['attachment']).length>0? 1:0);

			emailPreObj['meta']['to'] =app.globalF.rcptObjToArr(draft['meta']['to']);
			emailPreObj['meta']['from'] = draft['meta']['from'];
			emailPreObj['meta']['subject'] =draft['meta']['subject'];
			emailPreObj['meta']['body'] = draft['meta']['body'];
			emailPreObj['meta']['fromExtra'] = '';

			emailPreObj['meta']['timeSent'] = draft['meta']['timeSent'];
			emailPreObj['meta']['pin'] = '';

			emailPreObj['meta']['modKey'] = app.globalF.makeModKey();
			emailPreObj['meta']['type'] = 1; //received
			emailPreObj['meta']['status'] ='';


			emailPreObj['to'] = app.globalF.rcptObjToArr(draft['meta']['to']);
			//console.log(app.transform.from64str(emailPreObj['to'][1]));
			emailPreObj['from'] =  draft['meta']['from'];
			emailPreObj['subj'] = draft['meta']['subject'];

			emailPreObj['body']=draft['body'];

			emailPreObj['modKey'] = emailPreObj['meta']['modKey'];

			emailPreObj['badRcpt'] = '';
			emailPreObj['senderMod'] = '';
			emailPreObj['meta']['signature'] = "";

			var meta = JSON.stringify(emailPreObj['meta']);
			var body = JSON.stringify(emailPreObj);

			console.log(emailPreObj);

			var rcp=app.transform.SHA512(pki.publicKeyToPem(publicKey));

			messaged['mail'] = app.transform.toAes64(key, body);
			messaged['meta'] = app.transform.toAes64(key, meta);
			messaged['modKey'] =emailPreObj['modKey'];

			messaged['key'] = app.transform.to64bin(publicKey.encrypt(key, 'RSA-OAEP'));
			//messaged['seedRcpnt']=app.globalF.rcptObjToArr(draft['meta']['to'])[0];

            console.log(messaged);

			//console.log(messaged);
			return messaged;

		},

		from64strA: function(data) {
			var newArr=[];
			if(data.length>0){
				$.each(data, function( index, str64 ) {
					newArr.push(forge.util.decodeUtf8(forge.util.decode64(str64)));
				})
			}

			return newArr;
		},

		to64str: function (data) {
			return forge.util.encode64(forge.util.encodeUtf8(String(data)));
		},
		keyFingerprint: function(publicKey){

			return forge.ssh.getPublicKeyFingerprint(app.transform.publicPem2prime(app.transform.from64str(publicKey)),{encoding: 'hex', delimiter: ':'});

		},

		toAes64: function (key, text) {

			var vector = forge.random.getBytesSync(16);

			var cipher = forge.cipher.createCipher('AES-CBC', key);
			cipher.start({iv: vector});

			var usUtf8 = forge.util.encodeUtf8(text);
			cipher.update(forge.util.createBuffer(usUtf8));
			cipher.finish();

			return app.transform.to64bin(vector)+';' + app.transform.to64bin(cipher.output.data);

		},

		toAesBin: function (key, text) {

			//console.log(key);
			//console.log(forge.random.getBytesSync(32));
			//console.log(text);
		//console.log(key);
		var vector = forge.random.getBytesSync(16);

		var cipher = forge.cipher.createCipher('AES-CBC', key);
		cipher.start({iv: vector});

		cipher.update(forge.util.createBuffer(text));
		cipher.finish();

		return app.transform.to64bin(vector)+';' + app.transform.to64bin(cipher.output.getBytes());

		},

		fromAesBin: function (key, text) {

			var textData = text.split(';');

			var vector = app.transform.from64bin(textData[0]);
			var encrypted = app.transform.from64bin(textData[1]);

			var fAes = forge.cipher.createDecipher('AES-CBC', key);
			fAes.start({iv: vector});
			fAes.update(forge.util.createBuffer(encrypted));
			fAes.finish();

			return fAes.output.getBytes();
	},

		toFish64: function (keyT, text) {

			var vector = CryptoJS.lib.WordArray.random(16);
			var cipher = CryptoJS.TwoFish.encrypt(text, keyT, { iv: vector });

			//console.log(keyT.toString());

			return vector.toString() +';' + cipher.toString();

		},
		fromFish64: function (keyT, text) {
			var textData = text.split(';');

			var vector = CryptoJS.enc.Hex.parse(textData[0]);
			var encrypted = textData[1];

			var cipher = CryptoJS.TwoFish.decrypt(encrypted, keyT, { iv: vector });

			return cipher.toString(CryptoJS.enc.Latin1);
		},


		fromAes64: function (key, text) {

				var textData = text.split(';');

				var vector = app.transform.from64bin(textData[0]);
				var encrypted = app.transform.from64bin(textData[1]);

				var cipher = forge.cipher.createDecipher('AES-CBC', key);
				var new_buffer = forge.util.createBuffer(encrypted);

				cipher.start({iv: vector});
				cipher.update(new_buffer);
				cipher.finish();
				//return forge.util.decodeUtf8(cipher.output.toString());
				return cipher.output.toString();
			},

        PGPmessageDecrypt: function(PemPrivateKey,keyPass,encryptedText,callback){

            var privateKey=openpgp.key.readArmored(PemPrivateKey).keys[0];
            privateKey.decrypt(keyPass);

            try{
                var pgpMessage=openpgp.message.readArmored(encryptedText);

                openpgp.decryptMessage(privateKey, pgpMessage).then(function (plaintext) {
                    callback(plaintext);
                }).catch(function (error) {
                    callback(false);
                });

            } catch (err) {
                callback(false);
            }



        },
		db2profV2: function(encryptedText, secret,salt) {

			//var derivedKey =app.globalF.makeDerived(secret, salt);
			//console.log(secret);
			var derivedKey=secret;

			var Test = forge.util.bytesToHex(derivedKey);
			//console.log(Test);

			var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
			var keyA = forge.util.hexToBytes(Test.substr(64, 128));

			//console.log(1);
			var FisDecrypted = app.transform.fromFish64(keyT, encryptedText);
			//console.log(FisDecrypted);
			var DecryptedText = app.transform.fromAes64(keyA, FisDecrypted);
			//console.log(3);
			return DecryptedText;


		},

		prof2DbV2: function (decryptedObject,secret,salt) {

			var derivedKey=secret;
			//var derivedKey = app.globalF.makeDerived(secret, salt);
			var Test = forge.util.bytesToHex(derivedKey);

			var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
			var keyA = forge.util.hexToBytes(Test.substr(64, 128));

			var encryptedAes = app.transform.toAes64(keyA, decryptedObject);
			var encryptedObj = app.transform.toFish64(keyT, encryptedAes);


			return encryptedObj;

		},
		publicPem2prime: function(publicKey){
			var pki = forge.pki;

			return pki.publicKeyFromPem(publicKey);
		},
		publicPrime2pem: function(publicKey){
			var pki = forge.pki;

			return pki.publicKeyToPem(publicKey);

		},

		privatePrime2pem: function(privateKey){
			var pki = forge.pki;

			return  pki.privateKeyToPem(privateKey);

		},

		getReceiveHash:function(email){

			//console.log(email);
			//publicKey='sfdsdfdf';
			//var key= openpgp.key.readArmored(publicKey);
			//var pgp=key.toPublic();
			//if(key['err']!=undefined){
			//	return 'failed';
			//}else if(key['keys'].length>0){
				return app.transform.SHA512(email).substring(0,10);
				//var hash=key['keys'][0]
			//}
			//console.log(key);
			//console.log(key['err']);
			//console.log(key['keys'].length);
			//var prime=app.transform.publicPem2prime(publicKey);
			//var pem=app.transform.publicPrime2pem(prime)
			//return app.transform.SHA512(pem).substring(0,10);
		},
		privatePem2prime: function(privateKey){
			var pki = forge.pki;

			return pki.privateKeyFromPem(privateKey);
		},

		encryptDraftMessage:function(message,key){

			var body = JSON.stringify(message);

			var encryptedMessage={
				'mail':app.transform.toAes64(key, body),
				'meta':app.transform.toAes64(key,JSON.stringify(message['meta'])),
				'modKey': message['modKey']
			};

			return encryptedMessage;

		}

	});

	return EncodingDecodingFunctions;
});
