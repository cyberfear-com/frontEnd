/**
 * @desc        stores the POST state and response state of authentication for user
 */
define(["app", "forge", "openpgp"], function (app, forge, openpgp) {
    "use strict";
    var GlobalFunctions = Backbone.Model.extend({
        //app.globalF

        IsEmail: function (email) {
            var regex =
                /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])\.?$/i;

            return regex.test(email);
        },

        parseEmail: function (emailText, personalize, callback) {
            //console.log(emailText);
            /*
			 parse text email w/o name and return object
			 var testEmail=[];

			 testEmail.push('Serg1 Test<sergyk@test.com>');
			 testEmail.push('"Serg2 Test"<ergyk@test.com>');

			 testEmail.push('"Serg3 Test"<sergyk.test@test.com>');
			 testEmail.push('"Serg4 Test"<sergyk.test@test.com.ch>');
			 testEmail.push('""<sergyk@test.com>');
			 testEmail.push("'Serg5 Test'<sergyk@test.com>");
			 testEmail.push("''<sergyk@test.com>");
			 testEmail.push("<sergyk@test.com>");
			 testEmail.push("'Serg6 Test<script> alert('ddd');>'<sergyk@test.com>");

			 testEmail.push("'Serg7 Test<script> alert('ddd');</script>'<sergyk@test.com>");
			 testEmail.push("'Serg8 Test<script alert('ddd');'<sergyk@test.com>");
			 testEmail.push("Serg9 Test<script alert('ddd')<sergyk@test.com>");
			 testEmail.push("Serg10 Test<script alert('ddd')<sergyk.test@test.com.ch>");

			 testEmail.push('niceandsimple@example.com');
			 testEmail.push('very.common@example.com');
			 testEmail.push('a.little.lengthy.but.fine@dept.example.com');
			 testEmail.push('disposable.style.email.with+symbol@example.com');
			 testEmail.push('other.email-with-dash@example.com');
			 testEmail.push('"much.more unusual"@example.com');
			 testEmail.push('"very.unusual.@.unusual.com"@example.com');
			 testEmail.push('"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com');
			 testEmail.push('admin@mailserver1');
			 testEmail.push("#!$%&'*+-/=?^_`{}|~@example.org");
			 testEmail.push('"()<>[]:,;@\\\"!#$%&\'*+-/=?^_`{}| ~.a"@example.org');
			 testEmail.push('" "@example.org');
			 testEmail.push('üñîçøðé@example.com');
			 testEmail.push('üñîçøðé@üñîçøðé.com');

			 testEmail.push('incorrect');

			 testEmail.push('Abc.example.com');
			 testEmail.push('A@b@c@example.com');
			 testEmail.push('a"b(c)d,e:f;g<h>i[j\k]l@example.com');
			 testEmail.push('ust"not"right@example.com');
			 testEmail.push('this is"not\allowed@example.com');
			 testEmail.push('this\ still\"not\\allowed@example.com');
			 testEmail.push('john..doe@example.com');
			 testEmail.push('john.doe@example..com');
			 testEmail.push(' sergyk17@yahoo.com');
			 testEmail.push('sergyk17@yahoo.com ');
			 testEmail.push('abc');


			 $.each(testEmail, function( index, folderData ) {

			 var h=app.globalF.getEmailsFromString(folderData)
			 console.log(folderData);
			 console.log(h);
			 console.log(app.globalF.parseEmail(folderData));
			 console.log('');
			 //destination=tg;
			 });
			 */
            emailText = emailText;

            var email = app.globalF.getEmailsFromString(
                emailText.toLowerCase()
            );

            //	console.log(app.globalF.IsEmail(email));

            if (app.globalF.IsEmail(email)) {
                if (emailText.indexOf("<") != -1) {
                    var name = app.globalF.stripHTML(
                        emailText.substring(0, emailText.indexOf("<"))
                    );
                } else if (emailText.indexOf("&lt;") != -1) {
                    var name = app.globalF.stripHTML(
                        emailText.substring(0, emailText.indexOf("&lt;"))
                    );
                } else {
                    var name = "";
                }

                name =
                    name.indexOf('"') === 0
                        ? name.substr(1, name.length - 1)
                        : name;
                name =
                    name.lastIndexOf('"') === name.length - 1
                        ? name.substr(0, name.length - 1)
                        : name;

                name =
                    name.indexOf("'") === 0
                        ? name.substr(1, name.length - 1)
                        : name;
                name =
                    name.lastIndexOf("'") === name.length - 1
                        ? name.substr(0, name.length - 1)
                        : name;

                var myMails = [];
                $.each(app.user.get("allKeys"), function (index, folderData) {
                    myMails.push(app.transform.from64str(folderData["email"]));
                });

                if ($.inArray(email, myMails) != -1 && personalize) {
                    name = "Me";
                }

                name = name.trim();

                if (name != "") {
                    var display = name + " <" + email + ">";
                    var htmlFdisplay = name + " &lt;" + email + "&gt;";
                } else {
                    var display = email;
                    var htmlFdisplay = email;
                }

                var result = {
                    name: name == "" ? email : name,
                    email: email,
                    display: display,
                    htmlFdisplay: htmlFdisplay,
                    correctEmail: app.globalF.IsEmail(email),
                };
            } else {
                var result = {
                    name: "",
                    email: app.transform.escapeTags(emailText),
                    display: app.transform.escapeTags(emailText),
                    htmlFdisplay: app.transform.escapeTags(emailText),
                    correctEmail: app.globalF.IsEmail(
                        app.transform.escapeTags(emailText)
                    ),
                };
            }

            if (callback) callback(result);
            else return result;
        },

        exctractOwnEmail: function (email64Array, callback) {
            var keys = app.user.get("allKeys");
            var resEmail = false;

            $.each(email64Array, function (index, email64) {
                var origEmail64 = app.transform.to64str(
                    app.globalF.getEmailsFromString(
                        app.transform.from64str(email64)
                    )
                );

                //console.log(origEmail64);

                if (keys[origEmail64] != undefined && resEmail === false) {
                    resEmail = origEmail64;
                }
            });

            return resEmail;
        },

        stripHTML: function (html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = filterXSS(html);
            return tmp.textContent || tmp.innerText || "";
        },

        getEmailsFromString: function (input) {
            var ret = [];
            input = input.toLowerCase();
            //var email = /\<([^\>]+)\>/g;
            var email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

            var match;
            if (input.indexOf("<") != -1 || input.indexOf("&lt;") != -1) {
                while ((match = email.exec(input)))
                    if (app.globalF.IsEmail(match[1])) {
                        ret = match[1];
                    } else {
                        ret = input;
                        //ret=input;
                    }
                return $.trim(ret);
            } else return $.trim(input);
        },
        getEmailDomain: function (email) {
            if (app.globalF.IsEmail(email)) {
                var domain = email.split("@");

                return domain[1];
            }
            return "";
        },

        createContactFromSelect: function () {
            var contacts = app.user.get("contacts");
            var to = app.user.get("draftMessageView")["meta"]["to"];
            var toCC = app.user.get("draftMessageView")["meta"]["toCC"];
            var toBCC = app.user.get("draftMessageView")["meta"]["toBCC"];

            var allList = {};

            allList = jQuery.extend(true, {}, to);
            allList = jQuery.extend(true, allList, toCC);
            allList = jQuery.extend(true, allList, toBCC);

            //allList=allList.concat(to);
            //allList=allList.concat(toCC);
            //allList=allList.concat(toBCC);

            //console.log(allList);

            //var allListNoDups=app.globalF.arrayNoDups(allList);

            var list = [];

            $.each(app.user.get("contacts"), function (index, contactData) {
                //list.push(app.transform.from64str(contactData['e']));
                if (contactData["n"] != "") {
                    list.push({
                        id: index,
                        name: app.transform.from64str(contactData["n"]),
                        email: app.transform.from64str(contactData["e"]),
                        text:
                            app.transform.from64str(contactData["n"]) +
                            " &lt;" +
                            app.transform.from64str(contactData["e"]) +
                            "&gt;",
                        title: "",
                    });
                } else {
                    list.push({
                        id: index,
                        name: app.transform.from64str(contactData["e"]),
                        email: app.transform.from64str(contactData["e"]),
                        text: app.transform.from64str(contactData["e"]),
                        title: "",
                    });
                }
                //list.push(contactData['e']);
            });

            //select2 trick with adding new emails from to field not existing in contact list
            if (Object.keys(allList).length > 0) {
                $.each(allList, function (index, emailData) {
                    if (contacts[index] == undefined) {
                        //console.log(index);
                        //console.log(emailData);
                        var email = app.transform.from64str(index);
                        var name = app.transform.from64str(emailData["name"]);
                        var ind = app.transform.to64str(email);

                        //console.log(pasingNewEmail);
                        if (name != email && name != "") {
                            list.push({
                                id: ind,
                                name: name,
                                email: email,
                                text: name + " &lt;" + email + "&gt;",
                                title: "",
                            });
                        } else {
                            list.push({
                                id: ind,
                                name: email,
                                email: email,
                                text: email,
                                title: "",
                            });
                        }

                        /*
						 if(app.transform.check64str(index)){
						 var pasingNewEmail=app.globalF.parseEmail(app.transform.from64str(index));

						 }else{
						 var pasingNewEmail=app.globalF.parseEmail(index);
						 }
						 //console.log(pasingNewEmail);
						 if(pasingNewEmail['name']!=pasingNewEmail['email'] && pasingNewEmail['name']!=""){
						 list.push({ id: email, name:pasingNewEmail['name'],email:pasingNewEmail['email'],text: pasingNewEmail['name']+" &lt;"+pasingNewEmail['email']+"&gt;",title:''});
						 }else{
						 list.push({ id: email, name:pasingNewEmail['email'],email:pasingNewEmail['email'],text:pasingNewEmail['email'],title:''});
						 }
						 */
                    }
                });
            }
            //console.log(list);

            return list;
        },
        fileSelection: function (item) {
            //console.log(item);
            //functionTracer='fileSelection';
            //container.parent().addClass("label-success");
            //return object.text;
            var markup =
                "<span id='file_" +
                app.transform.SHA1(item.id) +
                "'> <i class='fa fa-refresh fa-spin'></i> " +
                app.transform.from64str(item.id) +
                "</span>";
            return markup;
        },

        emailSelection: function (item) {
            //console.log(item);
            var contacts = app.user.get("contacts");

            //console.log(item);
            //console.log(app.user.get("recipientList"));

            if (contacts[item.id] !== undefined) {
                item["email"] = app.transform.from64str(contacts[item.id]["e"]);
                item["name"] = app.transform.from64str(contacts[item.id]["n"]);
                if (item["name"] != "") {
                    var markup =
                        "<span class='" +
                        app.transform.SHA256(item.email) +
                        "' title='" +
                        item.email +
                        "'> <i class='fa fa-refresh fa-spin'></i> " +
                        item.name +
                        "</span>";
                } else {
                    var markup =
                        "<span class='" +
                        app.transform.SHA256(item.email) +
                        "' title='" +
                        item.email +
                        "'> <i class='fa fa-refresh fa-spin'></i> " +
                        item.email +
                        "</span>";
                }
            } else {
                if (app.transform.check64str(item.text)) {
                    var pasingNewEmail = app.globalF.parseEmail(
                        app.transform.from64str(item.text)
                    );
                } else {
                    var pasingNewEmail = app.globalF.parseEmail(item.text);
                }
                //console.log(pasingNewEmail);

                //var id=app.transform.to64str(pasingNewEmail['email']);
                var id = app.transform.SHA256(pasingNewEmail["email"]);
                if (app.globalF.IsEmail(pasingNewEmail["email"])) {
                    if (pasingNewEmail["name"] != "") {
                        var markup =
                            "<span class='" +
                            id +
                            "' title='" +
                            pasingNewEmail["email"] +
                            "'> <i class='fa fa-refresh fa-spin'></i> " +
                            pasingNewEmail["name"] +
                            "</span>";
                    } else {
                        var markup =
                            "<span class='" +
                            id +
                            "' title='" +
                            pasingNewEmail["email"] +
                            "'> <i class='fa fa-refresh fa-spin'></i> " +
                            pasingNewEmail["email"] +
                            "</span>";
                    }
                } else {
                    var markup =
                        "<span  class='txt-color-red' id='" +
                        id +
                        "' title='Wrong Email'>" +
                        pasingNewEmail["email"] +
                        "</span>";
                }
            }

            return markup;
        },
        createEncryptionKey256: function () {
            var key = forge.random.getBytesSync(32);
            var newKey = forge.pkcs5.pbkdf2(
                key, // secret
                app.user.get("salt"), // salt
                4096, // iterations
                32 // length (bytes) 32bytes = 256bits
            );
            return newKey;
        },

        makeDerived: function (secret, salt) {
            // console.log(secret)
            //console.log(forge.pkcs5.pbkdf2(secret, salt, 4096, 64));
            return forge.pkcs5.pbkdf2(secret, salt, 4096, 64);
        },
        generatePinKey: function (pin) {
            return forge.pkcs5.pbkdf2(pin, "", 256, 32);
        },
        makeDerivedFancy: function (secret, salt) {
            //console.log(arguments.callee.caller);
            return forge.pkcs5.pbkdf2(secret, salt, secret.charCodeAt(0), 64);
        },
        makeRandomBytes: function (length) {
            return forge.random.getBytesSync(length);
        },

        createFolderIndex: function () {
            var randomBytes = app.globalF.makeRandomBytes(20);
            return app.transform.SHA256(randomBytes).substring(0, 10);
        },
        validatePublicKey: function (publicKey) {
            var pki = forge.pki;
            try {
                var mpublicKey = pki.publicKeyFromPem(publicKey);
                var mencrypted = mpublicKey.encrypt("test", "RSA-OAEP");
                return true;
            } catch (err) {
                return false;
            }
        },
        createDownloadLink: function (str, type, fileName) {
            if (window.navigator.msSaveOrOpenBlob) {
                var fileData = [str];
                var blobObject = new Blob(fileData);

                var a = document.createElement("a");
                a.id = "clickme";
                a.innerHTML = "Click to download file";

                var mydiv = document.getElementById("infoModBody");
                mydiv.appendChild(a);

                $("#clickme").click(function () {
                    window.navigator.msSaveOrOpenBlob(blobObject, fileName);
                });

                $("#infoModal").modal("show");
            } else {
                var oMyBlob = new Blob([str], { type: type });
                var a = document.createElement("a");

                a.href = window.URL.createObjectURL(oMyBlob);
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
            }
        },

        getBitLength: function (publicKeyPacket) {
            var size = -1;
            if (publicKeyPacket.mpi.length > 0) {
                size = publicKeyPacket.mpi[0].byteLength() * 8;
            }
            return size;
        },

        getPublicKeyInfo: function (publicKeyArmored, callback) {
            var result = {
                strength: 0,
                fingerprint: "",
                expiration: "",
                created: "",
            };
            var publicKey = openpgp.key.readArmored(publicKeyArmored);
            if (publicKey.keys[0] != undefined) {
                var publicKeyPacket = publicKey.keys[0].primaryKey;

                result["strength"] = app.globalF.getBitLength(publicKeyPacket);
                result["fingerprint"] = publicKeyPacket["fingerprint"].replace(
                    /(\S{2})/g,
                    "$1:"
                );
                result["fingerprint"] = result["fingerprint"].substring(
                    0,
                    result["fingerprint"].length - 1
                );
                result["created"] = publicKeyPacket["created"];
                //publicKeyPacket['fingerprint'].Replace(publicKeyPacket['fingerprint'], ".{2}", "$0:");
                //console.log(publicKey);
                //console.log(result);
                //console.log(result);
            }

            callback(result);
        },

        validateKeys: function (
            publicKeyArmored,
            privateKeyArmored,
            pass,
            callback
        ) {
            //verifying if public and private key correct format and bits, also if match
            //console.log(privateKeyArmored);

            //console.log(privateKey);
            var result = {
                pubCorrect: false,
                pubBit2strong: false,
                pubmatch: false,

                privCorrect: false,
                privmatch: false,
                privPass: false,
            };

            var privateKeyPacket = "";
            var pubReady = $.Deferred();
            //var privReady = $.Deferred();

            var publicKey = openpgp.key.readArmored(publicKeyArmored);
            var privateKey = openpgp.key.readArmored(privateKeyArmored);

            //if correct format
            if (
                privateKey.keys.length > 0 &&
                privateKey.keys[0].primaryKey !== null
            ) {
                //if can decrypt
                privateKeyPacket = privateKey.keys[0];
                privateKeyPacket.decrypt(pass);
                if (privateKeyPacket["primaryKey"]["isDecrypted"]) {
                    result["privPass"] = true;
                }
                result["privCorrect"] = true;
                //console.log(privateKeyPacket);
            }

            //if key is correct format
            if (
                publicKey.keys.length > 0 &&
                publicKey.keys[0].primaryKey !== null
            ) {
                var publicKeyPacket = publicKey.keys[0].primaryKey;

                var strength = app.globalF.getBitLength(publicKeyPacket);
                var planStrength =
                    app.user.get("userPlan")["planData"]["pgpStr"];
                //if key strengtht allowed by plan
                if (strength <= planStrength) {
                    //if keys are match

                    var mes = "Hello, World!";
                    openpgp
                        .encryptMessage(publicKey.keys, mes)
                        .then(function (pgpMessageEnc) {
                            //privReady.done(function () {
                            //console.log(privateKeyPacket['primaryKey']['isDecrypted']);

                            if (result["privPass"]) {
                                var pgpMessage =
                                    openpgp.message.readArmored(pgpMessageEnc);

                                openpgp
                                    .decryptMessage(
                                        privateKeyPacket,
                                        pgpMessage
                                    )
                                    .then(function (plaintext) {
                                        // success
                                        if (mes == plaintext) {
                                            result["pubmatch"] = true;
                                            result["privmatch"] = true;
                                        } else {
                                            result["pubmatch"] = false;
                                            result["privmatch"] = false;
                                        }

                                        pubReady.resolve();
                                    })
                                    .catch(function (error) {
                                        pubReady.resolve();
                                    });
                            } else {
                                pubReady.resolve();
                            }
                            //	});

                            result["pubCorrect"] = true;
                        })
                        .catch(function (error) {
                            //result['pubCorrect']=false;
                            pubReady.resolve();
                        });
                    result["pubBit2strong"] = true;
                } else {
                    //result['pubBit2strong']=false;
                    pubReady.resolve();
                }
                //console.log(strength);
                result["pubCorrect"] = true;
            } else {
                //result['pubCorrect']=false;
                pubReady.resolve();
            }

            pubReady.done(function () {
                //console.log(result);
                callback(result);
            });
        },

        makerandom: function () {
            var text = "";
            var possible =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < Math.floor(Math.random() * 15) + 1; i++)
                text += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

            return text;
        },
        tryDecrypt: function (secret) {
            //console.log(secret);
            if (secret != "") {
                //if(app.user.get('oneStep')){
                //	secret=app.globalF.makeDerived(secret, app.user.get('salt'));
                //}else{
                //secret=app.transform.SHA512(secret);
                //secret=app.globalF.makeDerived(secret, app.user.get('salt'));

                //}

                try {
                    var encObj = app.userObjects.get("EncryptedUserObject")[0][
                        "data"
                    ];
                    var userObj = app.transform.db2profV2(
                        encObj,
                        secret,
                        app.user.get("salt")
                    );
                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return false;
            }
        },
        tryDecryptOld: function (secret) {
            //console.log(secret);
            if (secret != "") {
                //if(app.user.get('oneStep')){
                //	secret=app.globalF.makeDerived(secret, app.user.get('salt'));
                //}else{
                //secret=app.transform.SHA512(secret);
                //secret=app.globalF.makeDerived(secret, app.user.get('salt'));

                //}

                try {
                    var encObj = app.userObjects.get("EncryptedUserObject")[0][
                        "data"
                    ];
                    //console.log(app.user.get("salt"));
                    var userObj = JSON.parse(
                        app.v1transform.dbToProfile(
                            app.userObjects.get("EncryptedUserObject"),
                            secret,
                            app.user.get("salt")
                        )
                    );
                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return false;
            }
        },

        tryDecryptDerived: function (secret) {
            //if secret already saved
            if (secret != "") {
                // console.log(secret);
                //secret=app.globalF.makeDerived(secret, app.user.get('salt'));

                try {
                    var encObj = app.userObjects.get("EncryptedUserObject")[0][
                        "data"
                    ];
                    var userObj = app.transform.db2profV2(
                        encObj,
                        secret,
                        app.user.get("salt")
                    );
                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return false;
            }
        },
        arrayRemove: function (array, from, to) {
            //filter=app.globalF.arrayRemove(filter,this.state.ruleId); from/to -index

            var rest = array.slice((to || from) + 1 || array.length);
            array.length = from < 0 ? array.length + from : from;
            var dd = Array.prototype.push.apply(array, rest);

            return array;
        },

        bySortedValue: function (obj, callback, context) {
            var tuples = [];

            for (var key in obj) {
                tuples.push([obj[key]["name"], obj[key], key]);
            }
            tuples.sort(function (a, b) {
                return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0;
            });

            var length = tuples.length;
            while (length--)
                callback.call(context, tuples[length][2], tuples[length][1]);
        },
        SortByName: function (a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();
            return aName < bName ? -1 : aName > bName ? 1 : 0;
        },

        getCustomFolderList: function () {
            var folderList = [];

            $.each(app.user.get("folders"), function (index, folderData) {
                if (!folderData["isMain"]) {
                    var fold = {};
                    fold = jQuery.extend(true, {}, folderData);
                    fold["name"] = app.transform.from64str(folderData["name"]);
                    fold["index"] = index;
                    fold["color"] =
                        folderData["color"] !== undefined
                            ? folderData["color"]
                            : "#c9d0da";
                    folderList.push(fold);
                }
            });

            folderList.sort(app.globalF.SortByName);

            return folderList;
        },

        getCustomLabelList: function () {
            var customLabelList = [];
            $.each(app.user.get("tags"), function (label64, data64) {
                var item = {};
                item["name"] = app.transform.escapeTags(
                    app.transform.from64str(label64)
                );
                item["color"] = data64.color;
                customLabelList.push(item);
            });
            // console.log(customLabelList);
            return customLabelList;
        },

        getInboxFolderId: function (callback) {
            $.each(app.user.get("folders"), function (index, folderData) {
                if (folderData["isMain"]) {
                    if (
                        app.transform.from64str(folderData["role"]) == "Inbox"
                    ) {
                        callback(index);
                    }
                }
            });
        },
        getMainFolderList: function () {
            var mainFolderList = {};

            $.each(app.user.get("folders"), function (index, folderData) {
                if (folderData["isMain"]) {
                    mainFolderList[folderData["order"]] = jQuery.extend(
                        true,
                        {},
                        folderData
                    );
                    mainFolderList[folderData["order"]]["name"] =
                        app.transform.from64str(folderData["name"]);
                    mainFolderList[folderData["order"]]["role"] =
                        app.transform.from64str(folderData["role"]);
                    mainFolderList[folderData["order"]]["index"] = index;
                }
            });

            return mainFolderList;
        },

        syncUpdates: function (forceRefresh) {
             //  console.log('syncUpdates');


            app.globalF.countEmailsSize();

            let len=Object.keys(app.user.get("emails")["folders"]).length;

            app.user.set({
                //needRefresh:(app.user.get("emailsCount")!=len ||forceRefresh==true),
                needRefresh:!app.user.get("emailListRefresh"),
                emailListRefresh: !app.user.get("emailListRefresh"),
                emailsCount:len

            });
            // console.log(app.user.get('emailListRefresh'));
        },
        countUnopened: function (unopened) {
            var unop = 0;
            $.each(unopened, function (folder, unopenMail) {
                if (
                    folder != "94a9eac404" &&
                    folder != "c560122ac4" &&
                    folder != "c16bc82bf1" &&
                    folder != "ebf12ef47c"
                ) {
                    unop += unopenMail;
                }
            });
            return unop;
        },
        /**
         * Mailbox Size and new email Count
         */
        countEmailsSize: function () {
            var size = 0;
            var folders = app.user.get("emails")["folders"];
            // var unopened=app.user.get('unopenedEmails');
            var unopened = {};
            //console.log(folders);

            $.each(folders, function (index, emails) {
                var folderUnopened = 0;
                if (Object.keys(emails).length > 0) {
                    $.each(emails, function (index, emailData) {
                        if (!isNaN(emailData["sz"]) && emailData["sz"] != "") {
                            size += emailData["sz"];
                        }

                        if (emailData["st"] == 0) {
                            folderUnopened++;
                        }
                    });
                }

                if (folderUnopened == 0) {
                    unopened[index] = 0;
                } else {
                    unopened[index] = folderUnopened;
                }
            });

            var inbox = app.globalF.countUnopened(unopened);
            if (inbox > 0) {
                document.title =
                    "(" +
                    inbox +
                    " unread) - " +
                    app.user.get("email") +
                    " - " +
                    app.defaults.get("domainMail").toLowerCase();
            } else {
                document.title =
                    app.user.get("email") +
                    " - " +
                    app.defaults.get("domainMail");
            }

            //console.log(size);
            app.user.set({
                mailboxSize: size,
                unopenedEmails: unopened,
            });
        },
        generateStateRandomId: function () {
            var bytes = forge.random.getBytesSync(8);
            return forge.util.bytesToHex(bytes);
        },

        renderEmail: function (emailId) {
            var message = app.user.get("emails")["messages"][emailId];
           // console.log('message');
           // console.log(message);
            if (message === undefined) {
                $("#infoModHead").html("Message Corrupted");
                $("#infoModBody").html(
                    "It's a shame, but your message is corrupted and I can not open it."
                );
                $("#infoModal").modal("show");
            } else {
                app.globalF.renderEmailAfter(emailId);
            }
        },
        renderEmailAfter: function (emailId) {
            var message = app.user.get("emails")["messages"][emailId];
            var modKey = message["mK"];
            var key = app.transform.from64bin(message["p"]);
            var version = message["vr"];

            //console.log(emailId);
            //console.log(key);

            var folderKey = app.transform.from64bin(
                app.user.get("emails")["messages"][emailId]["p"]
            );
            //console.log(folderKey);

            /*
			console.log(message);
			 $.each(message, function( index, emailData ) {
			 console.log(index);
			 console.log(emailData);
			 });
			 */

            var post = {
                messageId: emailId,
                modKey: modKey,
            };

            if (app.user.get("currentMessageView")["id"] != emailId) {
                app.serverCall.ajaxRequest(
                    "retrieveMessage",
                    post,
                    function (result) {
                        if (result["response"] == "success") {
                            if (result["data"].length > 0) {
                                if (message["tp"] == 1) {
                                    if (message["vr"] === 1) {
                                        var emailEncrypted = JSON.parse(
                                            result["data"]
                                        );

                                        var emailDecrypted = {
                                            body: app.transform.fromAes64(
                                                key,
                                                emailEncrypted["body"]
                                            ),
                                            meta: app.transform.fromAes64(
                                                key,
                                                emailEncrypted["meta"]
                                            ),
                                        };

                                        var body = JSON.parse(
                                            emailDecrypted["body"]
                                        );

                                        if (
                                            body["meta"]["version"] !==
                                            undefined
                                        ) {
                                            version = body["meta"]["version"];
                                        }

                                        var meta = JSON.parse(
                                            emailDecrypted["meta"]
                                        );
                                        body["meta"]["from"] = body["from"];
                                        body["meta"]["pinTop"] = message["pt"];

                                        //fix old emails where recipient to field is not an object
                                        if (
                                            typeof body["meta"]["to"] ===
                                            "string"
                                        ) {
                                            var to = body["meta"]["to"];
                                            body["meta"]["to"] = [];
                                            //	app.globalF.parseEmail(
                                            //body['meta']['to'][to]={'name':''}
                                            body["meta"]["to"].push(to);
                                        }

                                        app.user.set({
                                            currentMessageView: {
                                                id: emailId,
                                                meta: body["meta"],
                                                body: body["body"],
                                                attachment:
                                                    body["attachment"] ==
                                                    undefined
                                                        ? {}
                                                        : body["attachment"],
                                                version: version,
                                                originalBody: body,
                                            },
                                        });
                                    } else if (message["vr"] === 2) {
                                        var emailEncrypted = JSON.parse(
                                            result["data"]
                                        );

                                        var emailDecrypted = {
                                            body: app.transform.fromAes64(
                                                key,
                                                emailEncrypted["body"]
                                            ),
                                            // meta: app.transform.fromAes64(key, emailEncrypted['meta'])
                                        };

                                        var body = JSON.parse(
                                            emailDecrypted["body"]
                                        );

                                        //fix old emails where recipient to field is not an object
                                        if (
                                            typeof body["meta"]["to"] ===
                                            "string"
                                        ) {
                                            var to = body["meta"]["to"];
                                            body["meta"]["to"] = [];
                                            //	app.globalF.parseEmail(
                                            //body['meta']['to'][to]={'name':''}
                                            body["meta"]["to"].push(to);
                                        }

                                        var pgpMessage = app.globalF.stripHTML(
                                            app.transform.from64str(
                                                body["body"]["html"] == ""
                                                    ? body["body"]["text"]
                                                    : body["body"]["html"]
                                            )
                                        );

                                        body["meta"]["pinTop"] = message["pt"];

                                        var pgpInlineMatch =
                                            /^-{5}BEGIN PGP MESSAGE-{5}[\s\S]*-{5}END PGP MESSAGE-{5}$/im.exec(
                                                pgpMessage
                                            );

                                        if (pgpInlineMatch !== null) {
                                            var pgpMessageRead = true;
                                        } else {
                                            var pgpMessageRead = false;
                                        }

                                        app.user.set({
                                            currentMessageView: {
                                                id: emailId,
                                                meta: body["meta"],
                                                body: body["body"],
                                                pgpEncrypted: pgpMessageRead,
                                                attachment:
                                                    body["attachment"] ==
                                                    undefined
                                                        ? {}
                                                        : body["attachment"],
                                                version: version,
                                                originalBody: body,
                                            },
                                        });
                                    }
                                } else if (message["tp"] == 2) {
                                    var emailEncrypted = JSON.parse(
                                        result["data"]
                                    );

                                    var emailDecrypted = {
                                        body: app.transform.fromAes64(
                                            key,
                                            emailEncrypted["body"]
                                        ),
                                        meta: app.transform.fromAes64(
                                            key,
                                            emailEncrypted["meta"]
                                        ),
                                    };

                                    var body = JSON.parse(
                                        emailDecrypted["body"]
                                    );
                                    var meta = JSON.parse(
                                        emailDecrypted["meta"]
                                    );

                                    body["meta"]["pinTop"] = message["pt"];

                                    if (version == 1) {
                                        //old style sent message

                                        body["meta"]["from"] = body["from"];

                                        //fix old emails where recipient to field is not an object
                                        if (
                                            typeof body["meta"]["to"] ===
                                            "string"
                                        ) {
                                            var to = body["meta"]["to"];
                                            body["meta"]["to"] = [];
                                            //	app.globalF.parseEmail(
                                            //body['meta']['to'][to]={'name':''}
                                            body["meta"]["to"].push(to);
                                        }
                                        body["meta"]["toCC"] = [];
                                        body["meta"]["toBCC"] = [];
                                    } else if (version == 2) {
                                        //new style sent message

                                        //convert recipient object into array (sending email need object to properly work with unknown emails)
                                        body["meta"]["to"] =
                                            app.globalF.rcptObjToArr(
                                                body["meta"]["to"]
                                            );
                                        body["meta"]["toCC"] =
                                            app.globalF.rcptObjToArr(
                                                body["meta"]["toCC"]
                                            );
                                        body["meta"]["toBCC"] =
                                            app.globalF.rcptObjToArr(
                                                body["meta"]["toBCC"]
                                            );
                                    }
                                    //console.log(body);
                                    //console.log(meta);

                                    app.user.set({
                                        currentMessageView: {
                                            id: emailId,
                                            meta: body["meta"],
                                            body: body["body"],
                                            attachment:
                                                body["attachment"] == undefined
                                                    ? {}
                                                    : body["attachment"],
                                            version: version,
                                            originalBody: body,
                                        },
                                    });
                                    //console.log(app.user.get('currentMessageView'));
                                } else if (message["tp"] == 3) {
                                    //console.log('1');

                                    var draft =
                                        app.user.get("draftMessageView");

                                    var emailEncrypted = JSON.parse(
                                        result["data"]
                                    );
                                    //console.log(emailEncrypted);

                                    var emailDecrypted = {
                                        body: app.transform.fromAes64(
                                            key,
                                            emailEncrypted["body"]
                                        ),
                                        meta: app.transform.fromAes64(
                                            key,
                                            emailEncrypted["meta"]
                                        ),
                                    };

                                    var body = JSON.parse(
                                        emailDecrypted["body"]
                                    );

                                    var meta = JSON.parse(
                                        emailDecrypted["meta"]
                                    );
                                    //body['meta']['from']=body['from'];

                                    //console.log(body);

                                    draft["messageId"] = emailId;
                                    draft["body"]["html"] =
                                        app.transform.from64str(
                                            body["body"]["html"]
                                        );
                                    draft["body"]["text"] =
                                        app.transform.from64str(
                                            body["body"]["text"]
                                        );
                                    draft["modKey"] = body["modKey"];

                                    draft["meta"]["to"] = body["meta"]["to"];
                                    draft["meta"]["pinTop"] =
                                        body["meta"]["pinTop"];

                                    draft["attachment"] = body["attachment"];

                                    //console.log(body);

                                    if (body["meta"]["version"] == "") {
                                        draft["meta"]["from"] = body["from"];
                                        draft["meta"]["subj"] =
                                            app.transform.from64str(
                                                body["subj"]
                                            );
                                        //console.log(body['to']);
                                        //console.log(app.transform.from64strA(body['to']));
                                        draft["meta"]["pin"] =
                                            body["meta"]["pin"] == false
                                                ? ""
                                                : app.transform.from64str(
                                                      body["meta"]["pin"]
                                                  );
                                        draft["meta"]["pinEnabled"] =
                                            body["meta"]["pin"] == false
                                                ? false
                                                : true;
                                        draft["meta"]["toCC"] = [];
                                        draft["meta"]["toBCC"] = [];

                                        draft["meta"]["version"] = 1;
                                    } else if (body["meta"]["version"] == 2) {
                                        draft["meta"]["from"] =
                                            body["meta"]["from"];
                                        body["meta"]["pinTop"] = message["pt"];

                                        //console.log(body['to']);
                                        //console.log(app.transform.from64strA(body['to']));
                                        draft["meta"]["pin"] =
                                            app.transform.from64str(
                                                body["meta"]["pin"]
                                            );
                                        draft["meta"]["pinEnabled"] =
                                            body["meta"]["pinEnabled"];

                                        draft["meta"]["toCC"] =
                                            body["meta"]["toCC"] == undefined
                                                ? {}
                                                : body["meta"]["toCC"];
                                        draft["meta"]["toBCC"] =
                                            body["meta"]["toBCC"] == undefined
                                                ? {}
                                                : body["meta"]["toBCC"];
                                        draft["meta"]["signatureOn"] =
                                            body["meta"]["signatureOn"];

                                        draft["meta"]["version"] =
                                            body["meta"]["version"];
                                    }

                                    draft["meta"]["attachment"] =
                                        body["meta"]["attachment"];
                                    draft["meta"]["body"] =
                                        app.transform.from64str(
                                            body["meta"]["body"]
                                        );
                                    draft["meta"]["from"] =
                                        body["meta"]["from"];

                                    draft["meta"]["opened"] =
                                        body["meta"]["opened"];

                                    draft["meta"]["status"] =
                                        body["meta"]["status"];
                                    draft["meta"]["subject"] =
                                        app.transform.from64str(
                                            body["meta"]["subject"]
                                        );
                                    draft["meta"]["timeSent"] =
                                        body["meta"]["timeSent"];
                                    draft["meta"]["type"] =
                                        body["meta"]["type"];

                                    // If draft message is clicked make sure to run compose functionality
                                    app.user.set({
                                        isDecryptingEmail: false,
                                    });
                                    app.user.set({ isComposingEmail: true });
                                    app.user.set({ composeOriginate: 'draft' });
                                    app.user.set({ isDraftOpened: true });
                                    $("body").addClass("draft-opened");
                                    Backbone.history.loadUrl(
                                        Backbone.history.fragment
                                    );

                                    // Backbone.history.navigate("/mail/Compose", {
                                    //     trigger: true,
                                    // });

                                    //console.log(body);
                                    //console.log(meta);
                                    //console.log(draft);
                                }
                            } else {
                                app.notifications.systemMessage("mesgNotFound");
                            }
                        }
                    }
                );
            }
        },
        addToContact: function (emailObj, pin) {
            var contact = app.user.get("contacts");
            var changed = false;

            $.each(emailObj, function (email64, emptyStr) {
                var emObj = app.globalF.parseEmail(
                    app.transform.from64str(email64)
                );

                if (emObj["correctEmail"]) {
                    if (
                        contact[app.transform.to64str(emObj["email"])] ===
                        undefined
                    ) {
                        contact[app.transform.to64str(emObj["email"])] = {
                            e: app.transform.to64str(emObj["email"]),
                            n: app.transform.to64str(emObj["name"]),
                            p: app.transform.to64str(pin),
                            pgp: "",
                            pgpOn: false,
                        };
                        changed = true;
                    } else {
                        if (Object.keys(emailObj).length === 1) {
                            if (
                                contact[app.transform.to64str(emObj["email"])][
                                    "p"
                                ] != app.transform.to64str(pin)
                            ) {
                                contact[app.transform.to64str(emObj["email"])][
                                    "p"
                                ] = app.transform.to64str(pin);
                                changed = true;
                            }
                        }
                    }
                }
            });

            app.user.set({ contactsChanged: changed });
        },

        prepareForSending: function (
            draft,
            emailsWithMeta,
            emailsLists,
            encryptionLevel,
            refId,
            pin
        ) {
            /*
			 fetch all recipients and sort it out by encryption level pgp, local,pin,clear
			 and group them by encryption type
			 0-clear,1-pin,2-pgp,3-local

			 app.globalF.prepareForSending(draft,      thisComp.state.allEmails,       result,     thisComp.state.emailProtected);

			 */

            if (app.user.get("rememberContacts")) {
                app.globalF.addToContact(emailsLists["allList"]["noDups"], pin);
            }

            var recipients = {
                to: {},
                cc: {},
                bcc: {},
            };

            var deff = $.Deferred();

            $.each(
                emailsLists["allList"]["noDups"],
                function (email64, emptyStr) {
                    if (emailsLists["allList"]["to"][email64] != undefined) {
                        recipients["to"][email64] = emailsWithMeta[email64];
                    }
                    if (emailsLists["allList"]["cc"][email64] != undefined) {
                        recipients["cc"][email64] = emailsWithMeta[email64];
                    }
                    if (emailsLists["allList"]["bcc"][email64] != undefined) {
                        recipients["bcc"][email64] = emailsWithMeta[email64];
                    }
                }
            );

            var emailPreObj = {
                meta: {},
                body: {},
                attachments: {},
                modKey: "",
            };

            //var draft=app.user.get('draftMessageView');
            //var sender=app.user.get('allKeys')[draft['meta']['from']]['displayName'];

            //cleartext
            if (encryptionLevel == 0) {
                console.log("LEVEL 0");
                var emailArray = {};
                if (
                    Object.keys(recipients["to"]).length > 0 ||
                    Object.keys(recipients["cc"]).length > 0 ||
                    Object.keys(recipients["bcc"]).length > 0
                ) {
                    var attach = {};
                    var newAttach = {};
                    var gt = 0;

                    if (Object.keys(draft["attachment"]).length > 0) {
                        $.each(draft["attachment"], function (index, data) {
                            var newFileName =
                                draft["attachment"][index]["fileName"] + "1";
                            attach[newFileName] = data["modKey"];
                            draft["attachment"][index]["fileName"] =
                                newFileName;
                            newAttach[gt] = jQuery.extend(
                                true,
                                {},
                                draft["attachment"][index]
                            );
                            var key = app.transform.from64bin(
                                newAttach[gt]["key"]
                            );
                            newAttach[gt]["name"] = app.transform.toAes64(
                                key,
                                newAttach[gt]["name"]
                            );
                            newAttach[gt]["type"] = app.transform.toAes64(
                                key,
                                newAttach[gt]["type"]
                            );
                            delete newAttach[gt]["key"];
                            gt++;
                        });
                    }

                    emailPreObj["meta"]["to"] = app.globalF.rcptObjToArr(
                        recipients["to"]
                    );
                    emailPreObj["meta"]["cc"] = app.globalF.rcptObjToArr(
                        recipients["cc"]
                    );
                    emailPreObj["meta"]["bcc"] = app.globalF.rcptObjToArr(
                        recipients["bcc"]
                    );

                    emailPreObj["attachments"] = newAttach;
                    emailPreObj["meta"]["from"] = draft["meta"]["from"];
                    emailPreObj["body"] = draft["body"];
                    emailPreObj["meta"]["subj"] = draft["meta"]["subject"];
                    emailPreObj["modKey"] = app.globalF.makeModKey();

                    //var key = app.globalF.createEncryptionKey256();

                    //var encryptedTemp = app.transform.toAesBin(key, JSON.stringify(emailPreObj));

                    var clearTextEmails = {
                        mailData: emailPreObj,
                        //'mailKey': app.transform.to64bin(key),
                        modKey: app.transform.SHA512(emailPreObj["modKey"]),
                        //'attachments':draft['attachment'], //send attachment object to store in db for reference to download, password will be dropped, but email is cleartext anyway
                        refId: refId,
                    };

                    var destFolderId =
                        app.user.get("systemFolders")["sentFolderId"];
                    var mesId = refId;
                    var emails = app.user.get("emails")["messages"];
                    emails[mesId]["tp"] = 2;
                    var origFolder =
                        app.user.get("systemFolders")["draftFolderId"];
                    emails[mesId]["fr"] = draft["meta"]["from"];

                    app.globalF.move2Folder(destFolderId, [mesId], function () {
                        app.userObjects.updateObjects(
                            "sendEmailClearText",
                            clearTextEmails,
                            function (result) {
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        deff.resolve(result);
                                    } else {
                                        deff.reject(result);
                                    }
                                } else {
                                    if (result["response"] == "fail") {
                                        deff.reject(result);
                                    }
                                }
                            }
                        );
                    });
                }
            } else if (encryptionLevel == 1) {
                console.log("LEVEL 1");
                //pin protected
                var emailArray = {};

                var attach = {};
                if (Object.keys(draft["attachment"]).length > 0) {
                    $.each(draft["attachment"], function (index, data) {
                        var newFileName =
                            draft["attachment"][index]["fileName"] + "1";
                        attach[newFileName] = data["modKey"];
                        draft["attachment"][index]["fileName"] = newFileName;
                    });
                }
                var modKey = app.globalF.makeModKey();
                var pinTextEmails = {
                    toCCrcpt: { recipients: [], email: "" },
                    bccRcpt: {},
                    modKey: app.transform.SHA512(modKey),
                    attachments: attach,
                    pKeyHash: "",
                    refId: refId,
                    sender: draft["meta"]["from"],
                    subject: draft["meta"]["subject"],
                };

                var key = app.globalF.generatePinKey(pin);

                if (
                    Object.keys(recipients["to"]).length > 0 ||
                    Object.keys(recipients["cc"]).length > 0
                ) {
                    emailPreObj["meta"]["to"] = app.globalF.rcptObjToArr(
                        recipients["to"]
                    );
                    emailPreObj["meta"]["cc"] = app.globalF.rcptObjToArr(
                        recipients["cc"]
                    );
                    emailPreObj["meta"]["subject"] = draft["meta"]["subject"];

                    emailPreObj["meta"]["timeSent"] = draft["meta"]["timeSent"];
                    emailPreObj["attachments"] = draft["attachment"];
                    emailPreObj["meta"]["from"] = draft["meta"]["from"];
                    emailPreObj["body"] = draft["body"];
                    emailPreObj["modKey"] = modKey;

                    pinTextEmails["toCCrcpt"]["email"] = app.transform.toAes64(
                        key,
                        JSON.stringify(emailPreObj)
                    );
                    pinTextEmails["toCCrcpt"]["recipients"] =
                        app.globalF.rcptObjToArr(
                            jQuery.extend(
                                true,
                                recipients["to"],
                                recipients["cc"]
                            )
                        );
                    //   app.globalF.rcptObjToArr(recipients['to']).concat(app.globalF.rcptObjToArr(recipients['cc']));
                }
                if (Object.keys(recipients["bcc"]).length > 0) {
                    $.each(recipients["bcc"], function (index, data) {
                        var emailPreObjBCC = {
                            meta: {},
                            body: {},
                            attachments: {},
                            modKey: "",
                        };
                        var obj = {};
                        obj[index] = data;

                        emailPreObjBCC["meta"]["to"] =
                            app.globalF.rcptObjToArr(obj);
                        emailPreObjBCC["meta"]["timeSent"] =
                            draft["meta"]["timeSent"];
                        emailPreObjBCC["attachments"] = draft["attachment"];
                        emailPreObjBCC["meta"]["from"] = draft["meta"]["from"];
                        emailPreObjBCC["body"] = draft["body"];
                        emailPreObjBCC["meta"]["subj"] =
                            draft["meta"]["subject"];
                        emailPreObjBCC["modKey"] = modKey;

                        // console.log(emailPreObj);

                        pinTextEmails["bccRcpt"][
                            app.globalF.rcptObjToArr(obj)[0]
                        ] = app.transform.toAesBin(
                            key,
                            JSON.stringify(emailPreObjBCC)
                        );
                    });
                }

                pinTextEmails["pKeyHash"] = app.transform.SHA256(
                    app.globalF.makeDerivedFancy(key, "ScRypTmAilSaltForPiN")
                );

                if (
                    Object.keys(recipients["to"]).length > 0 ||
                    Object.keys(recipients["cc"]).length > 0 ||
                    Object.keys(recipients["bcc"]).length > 0
                ) {
                    //console.log(pinTextEmails);

                    var destFolderId =
                        app.user.get("systemFolders")["sentFolderId"];
                    var mesId = refId;
                    var emails = app.user.get("emails")["messages"];
                    emails[mesId]["tp"] = 2;
                    var origFolder =
                        app.user.get("systemFolders")["draftFolderId"];
                    emails[mesId]["fr"] = draft["meta"]["from"];

                    app.globalF.move2Folder(destFolderId, [mesId], function () {
                        app.userObjects.updateObjects(
                            "sendEmailWithPin",
                            pinTextEmails,
                            function (result) {
                                if (result["response"] == "success") {
                                    if (result["data"] == "saved") {
                                        app.globalF.syncUpdates();
                                        //app.user.set({"currentMessageView":{}});
                                        app.globalF.resetCurrentMessage();
                                        app.globalF.resetDraftMessage();

                                        //console.log(app.user.get("currentFolder"));
                                        Backbone.history.navigate(
                                            "/mail/" +
                                                app.user.get("currentFolder"),
                                            {
                                                trigger: true,
                                            }
                                        );

                                        deff.resolve();
                                    } else {
                                        app.globalF.move2Folder(
                                            origFolder,
                                            [mesId],
                                            function () {
                                                deff.reject("error");
                                            }
                                        );
                                        app.notifications.systemMessage(
                                            "tryAgain"
                                        );
                                    }
                                } else {
                                    app.globalF.move2Folder(
                                        origFolder,
                                        [mesId],
                                        function () {
                                            deff.reject("error");
                                        }
                                    );
                                    //app.notifications.systemMessage('tryAgain');
                                }

                                //	console.log(result);
                            }
                        );
                    });
                }
            } else if (encryptionLevel == 2) {
                console.log("LEVEL 2");
                //pgp protected
                if (
                    Object.keys(recipients["to"]).length > 0 ||
                    Object.keys(recipients["cc"]).length > 0 ||
                    Object.keys(recipients["bcc"]).length > 0
                ) {
                    var keys = "";
                    var keyArr = { keys: [] };
                    //var publicKey={};

                    var emailpromises = [];

                    //var allRcpt = emailsLists['allList']['noDups'];
                    var toCCkeys = { keys: [] };
                    var encryptedPGPmessage = {};
                    var toCCrcpt = {};

                    var attach = {};
                    var newAttach = {};
                    var gt = 0;
                    if (Object.keys(draft["attachment"]).length > 0) {
                        $.each(draft["attachment"], function (index, data) {
                            var newFileName =
                                draft["attachment"][index]["fileName"] + "1";
                            attach[newFileName] = data["modKey"];
                            draft["attachment"][index]["fileName"] =
                                newFileName;
                            newAttach[gt] = jQuery.extend(
                                true,
                                {},
                                draft["attachment"][index]
                            );
                            var key = app.transform.from64bin(
                                newAttach[gt]["key"]
                            );
                            newAttach[gt]["name"] = app.transform.toAes64(
                                key,
                                newAttach[gt]["name"]
                            );
                            newAttach[gt]["type"] = app.transform.toAes64(
                                key,
                                newAttach[gt]["type"]
                            );
                            delete newAttach[gt]["key"];
                            gt++;
                        });
                    }

                    //part to encrypt PGP for to and cc

                    var modKey = app.globalF.makeModKey();

                    var pgpTextEmails = {
                        toCCrcpt: { recipients: [], email: "" },
                        toCCrcptV1: [],
                        bccRcptV1: [],
                        bccRcpt: {},

                        modKey: app.transform.SHA512(modKey),
                        attachments: newAttach,
                        refId: refId,
                        sender: draft["meta"]["from"],
                        subject: draft["meta"]["subject"],
                        //'body':draft['meta']['body']
                    };

                    emailPreObj["meta"]["to"] = app.globalF.rcptObjToArr(
                        recipients["to"]
                    );
                    emailPreObj["meta"]["cc"] = app.globalF.rcptObjToArr(
                        recipients["cc"]
                    );

                    emailPreObj["attachments"] = draft["attachment"];
                    emailPreObj["meta"]["from"] = draft["meta"]["from"];
                    emailPreObj["body"] = draft["body"];
                    emailPreObj["meta"]["subj"] = draft["meta"]["subject"];
                    emailPreObj["modKey"] = modKey;

                    $.each(emailsWithMeta, function (index, emailData) {
                        if (
                            emailData["publicKey"] != "" &&
                            (emailData["destination"] == "cc" ||
                                emailData["destination"] == "to")
                        ) {
                            //keys+=(app.transform.from64str(emailData['publicKey']));
                            var pbK = app.transform.detectPGPkey(
                                emailData["publicKey"]
                            );
                            var obj = {};
                            obj[index] = emailData;

                            if (pbK == "v2") {
                                var publicKey = openpgp.key.readArmored(
                                    app.transform.from64str(
                                        emailData["publicKey"]
                                    )
                                );
                                //console.log(publicKey);
                                toCCkeys["keys"].push(publicKey["keys"][0]);
                                toCCrcpt[index] = emailData;
                            } else if (pbK == "v1") {
                                //console.log('WARNING');
                                //console.log(obj);
                                //console.log(draft['meta']['to']);
                                var v1email = app.transform.sendWithinScryptOld(
                                    emailData["publicKey"],
                                    draft
                                );
                                v1email["seedRcpnt"] =
                                    app.globalF.rcptObjToArr(obj)[0];
                                //draft['meta']['to'] = app.globalF.rcptObjToArr(obj);

                                //version 1 pg only for internal old email
                                pgpTextEmails["toCCrcptV1"].push(v1email);
                            }
                        }
                    });

                    if (toCCkeys.keys.length > 0) {
                        //version 2 openPGP standart send same email to internal and outside
                        var toCCPromise = $.Deferred();
                        openpgp
                            .encryptMessage(
                                toCCkeys.keys,
                                app.transform.from64str(draft["body"]["html"])
                            )
                            .then(function (pgpMessage) {
                                //console.log(pgpMessage);
                                pgpTextEmails["toCCrcpt"]["recipients"] =
                                    app.globalF.rcptObjToArr(toCCrcpt);
                                pgpTextEmails["toCCrcpt"]["email"] =
                                    app.transform.to64str(pgpMessage);
                                toCCPromise.resolve();
                            })
                            .catch(function (error) {});
                        emailpromises.push(toCCPromise);
                    }
                    // END part to encrypt PGP for to and cc

                    //part for BCC

                    if (Object.keys(recipients["bcc"]).length > 0) {
                        $.each(recipients["bcc"], function (index, emailData) {
                            var pbK = app.transform.detectPGPkey(
                                emailData["publicKey"]
                            );
                            var obj = {};
                            obj[index] = emailData;

                            if (pbK == "v2") {
                                var BCCPromise = $.Deferred();

                                var publicKey = openpgp.key.readArmored(
                                    app.transform.from64str(
                                        emailData["publicKey"]
                                    )
                                );
                                openpgp
                                    .encryptMessage(
                                        publicKey.keys,
                                        app.transform.from64str(
                                            draft["body"]["html"]
                                        )
                                    )
                                    .then(function (pgpMessage) {
                                        //console.log(index);

                                        pgpTextEmails["bccRcpt"][
                                            app.globalF.rcptObjToArr(obj)[0]
                                        ] = app.transform.to64str(pgpMessage);
                                        BCCPromise.resolve();
                                    })
                                    .catch(function (error) {
                                        // failure
                                    });
                                emailpromises.push(BCCPromise);
                            } else if (pbK == "v1") {
                                var emailPreObj = {
                                    meta: {},
                                    body: {},
                                    attachments: {},
                                    modKey: "",
                                };

                                var v1email = app.transform.sendWithinScryptOld(
                                    emailData["publicKey"],
                                    draft
                                );
                                v1email["seedRcpnt"] =
                                    app.globalF.rcptObjToArr(obj)[0];
                                //draft['meta']['to'] = app.globalF.rcptObjToArr(obj);

                                //version 1 pg only for internal old email

                                pgpTextEmails["bccRcptV1"].push(v1email);
                            }
                        });
                    }

                    Promise.all(emailpromises).then(function (values) {
                        //console.log('All done');
                        //console.log(pgpTextEmails);

                        var destFolderId =
                            app.user.get("systemFolders")["sentFolderId"];
                        var mesId = refId;
                        var emails = app.user.get("emails")["messages"];
                        emails[mesId]["tp"] = 2;
                        var origFolder =
                            app.user.get("systemFolders")["draftFolderId"];
                        emails[mesId]["fr"] = draft["meta"]["from"];

                        app.globalF.move2Folder(
                            destFolderId,
                            [mesId],
                            function () {
                                app.userObjects.updateObjects(
                                    "sendEmailPGP",
                                    pgpTextEmails,
                                    function (result) {
                                        if (result["response"] == "success") {
                                            if (result["data"] == "saved") {
                                                app.globalF.syncUpdates();
                                                //app.user.set({"currentMessageView":{}});
                                                app.globalF.resetCurrentMessage();
                                                app.globalF.resetDraftMessage();

                                                //console.log(app.user.get("currentFolder"));
                                                Backbone.history.navigate(
                                                    "/mail/" +
                                                        app.user.get(
                                                            "currentFolder"
                                                        ),
                                                    {
                                                        trigger: true,
                                                    }
                                                );
                                                deff.resolve();
                                            } else {
                                                app.globalF.move2Folder(
                                                    origFolder,
                                                    [mesId],
                                                    function () {
                                                        deff.reject("error");
                                                    }
                                                );
                                                app.notifications.systemMessage(
                                                    "tryAgain"
                                                );
                                            }
                                        } else {
                                            app.globalF.move2Folder(
                                                origFolder,
                                                [mesId],
                                                function () {
                                                    deff.reject("error");
                                                }
                                            );
                                            //app.notifications.systemMessage('tryAgain');
                                        }

                                        //console.log(result);
                                    }
                                );
                            }
                        );
                    });
                }
            } else if (encryptionLevel == 3) {
                console.log("LEVEL 3");
                //internal
                if (
                    Object.keys(recipients["to"]).length > 0 ||
                    Object.keys(recipients["cc"]).length > 0 ||
                    Object.keys(recipients["bcc"]).length > 0
                ) {
                    var keys = "";
                    var keyArr = { keys: [] };
                    //var publicKey={};

                    var emailpromises = [];

                    var toCCkeys = { keys: [] };

                    var encryptedPGPmessage = {};

                    var toCCrcpt = {};

                    var modKey = app.globalF.makeModKey();

                    var attach = {};

                    if (Object.keys(draft["attachment"]).length > 0) {
                        $.each(draft["attachment"], function (index, data) {
                            var newFileName =
                                draft["attachment"][index]["fileName"] + "1";
                            // console.log(newFileName);
                            attach[newFileName] = data["modKey"];
                            draft["attachment"][index]["fileName"] =
                                newFileName;
                        });
                    }

                    var inTextEmails = {
                        toCCrcpt: {},
                        toCCrcptV1: [],
                        bccRcptV1: [],
                        bccRcpt: {},

                        attachments: attach,
                        modKey: app.transform.SHA512(modKey),
                        refId: refId,
                        sender: draft["meta"]["from"],
                    };

                    $.each(emailsWithMeta, function (index, emailData) {
                        if (
                            emailData["publicKey"] != "" &&
                            (emailData["destination"] === "cc" ||
                                emailData["destination"] === "to")
                        ) {
                            //keys+=(app.transform.from64str(emailData['publicKey']));
                            var pbK = app.transform.detectPGPkey(
                                emailData["publicKey"]
                            );
                            var obj = {};
                            obj[index] = emailData;
                            if (pbK == "v2") {
                                var publicKey = openpgp.key.readArmored(
                                    app.transform.from64str(
                                        emailData["publicKey"]
                                    )
                                );
                                toCCkeys["keys"].push(publicKey["keys"][0]);
                                toCCrcpt[index] = emailData;
                            } else if (pbK == "v1") {
                                var v1email = app.transform.sendWithinScryptOld(
                                    emailData["publicKey"],
                                    draft
                                );
                                v1email["seedRcpnt"] =
                                    app.globalF.rcptObjToArr(obj)[0];
                                inTextEmails["toCCrcptV1"].push(v1email);
                            }
                        }
                    });

                    if (toCCkeys.keys.length > 0) {
                        emailPreObj["meta"]["to"] = app.globalF.rcptObjToArr(
                            recipients["to"]
                        );
                        emailPreObj["meta"]["toCC"] = app.globalF.rcptObjToArr(
                            recipients["cc"]
                        );
                        emailPreObj["meta"]["subject"] =
                            draft["meta"]["subject"];

                        emailPreObj["meta"]["timeSent"] =
                            draft["meta"]["timeSent"];
                        emailPreObj["attachment"] = draft["attachment"];
                        emailPreObj["meta"]["from"] = draft["meta"]["from"];
                        emailPreObj["body"] = draft["body"];
                        emailPreObj["modKey"] = modKey;

                        var key = app.globalF.createEncryptionKey256();
                        var toCCmeta = {
                            attachment:
                                Object.keys(draft["attachment"]).length > 0
                                    ? 1
                                    : 0,
                            to: app.globalF.rcptObjToArr(draft["meta"]["to"]),
                            toCC: app.globalF.rcptObjToArr(
                                draft["meta"]["toCC"]
                            ),
                            from: draft["meta"]["from"],
                            subject: draft["meta"]["subject"],
                            body: draft["meta"]["body"],
                            fromExtra: "",

                            timeSent: draft["meta"]["timeSent"],
                            pin: "",

                            en: 1, //encrypted
                            modKey: modKey,
                            type: 1, //received
                            status: "",
                            emailHash: app.transform.SHA512(
                                JSON.stringify(emailPreObj)
                            ),
                            emailKey: app.transform.to64bin(key),
                        };
                        //inTextEmails['modKey']=app.transform.SHA512(toCCmeta['modKey']);
                        //inTextEmails['attachments']=app.globalF.getFileNamesForSend(draft['attachment']);

                        // console.log(toCCmeta);

                        var toCCPromise = $.Deferred();
                        openpgp
                            .encryptMessage(
                                toCCkeys.keys,
                                app.transform.to64str(JSON.stringify(toCCmeta))
                            )
                            .then(function (pgpMessage) {
                                //console.log(pgpMessage);
                                inTextEmails["toCCrcpt"]["recipients"] =
                                    app.globalF.rcptObjToArr(toCCrcpt);
                                inTextEmails["toCCrcpt"]["email"] =
                                    app.transform.toAes64(
                                        key,
                                        JSON.stringify(emailPreObj)
                                    );
                                inTextEmails["toCCrcpt"]["meta"] =
                                    app.transform.to64str(pgpMessage);
                                toCCPromise.resolve();
                            })
                            .catch(function (error) {});
                        emailpromises.push(toCCPromise);
                    }

                    if (Object.keys(recipients["bcc"]).length > 0) {
                        $.each(recipients["bcc"], function (index, emailData) {
                            var emailPreObjBCC = {
                                meta: {},
                                body: {},
                                attachments: {},
                                modKey: "",
                            };

                            var obj = {};
                            obj[index] = emailData;

                            emailPreObjBCC["meta"]["to"] =
                                app.globalF.rcptObjToArr(obj);
                            emailPreObjBCC["meta"]["timeSent"] =
                                draft["meta"]["timeSent"];
                            emailPreObjBCC["attachment"] = draft["attachment"];
                            emailPreObjBCC["meta"]["from"] =
                                draft["meta"]["from"];
                            emailPreObjBCC["body"] = draft["body"];
                            emailPreObjBCC["meta"]["subj"] =
                                draft["meta"]["subject"];
                            emailPreObjBCC["modKey"] = modKey;

                            var emailArray = app.globalF.rcptObjToArr(obj);

                            var key = app.globalF.createEncryptionKey256();

                            var toBCCmeta = {
                                attachment:
                                    Object.keys(draft["attachment"]).length > 0
                                        ? 1
                                        : 0,
                                to: emailArray,
                                toCC: [],
                                from: draft["meta"]["from"],
                                subject: draft["meta"]["subject"],
                                body: draft["meta"]["body"],
                                fromExtra: "",

                                timeSent: draft["meta"]["timeSent"],
                                pin: "",

                                en: 1, //encrypted
                                modKey: modKey,
                                type: 1, //received
                                status: "",
                                emailHash: app.transform.SHA512(
                                    JSON.stringify(emailPreObjBCC)
                                ),
                                emailKey: app.transform.to64bin(key),
                            };

                            var pbK = app.transform.detectPGPkey(
                                emailData["publicKey"]
                            );

                            if (pbK == "v2") {
                                var BCCPromise = $.Deferred();

                                var publicKey = openpgp.key.readArmored(
                                    app.transform.from64str(
                                        emailData["publicKey"]
                                    )
                                );

                                openpgp
                                    .encryptMessage(
                                        publicKey.keys,
                                        app.transform.to64str(
                                            JSON.stringify(toBCCmeta)
                                        )
                                    )
                                    .then(function (pgpMessage) {
                                        //console.log(index);
                                        inTextEmails["bccRcpt"][emailArray[0]] =
                                            {
                                                email: app.transform.toAes64(
                                                    key,
                                                    JSON.stringify(
                                                        emailPreObjBCC
                                                    )
                                                ),
                                                meta: app.transform.to64str(
                                                    pgpMessage
                                                ),
                                            };

                                        BCCPromise.resolve();
                                    })
                                    .catch(function (error) {
                                        // failure
                                    });
                                emailpromises.push(BCCPromise);
                            } else if (pbK == "v1") {
                                //  console.log(draft);
                                var v1email = app.transform.sendWithinScryptOld(
                                    emailData["publicKey"],
                                    draft
                                );
                                v1email["seedRcpnt"] =
                                    app.globalF.rcptObjToArr(obj)[0];
                                inTextEmails["bccRcptV1"].push(v1email);
                            }

                            //console.log(publicKey);
                        });
                    }
                    // console.log(toBCCmeta);

                    Promise.all(emailpromises).then(function (values) {
                        //console.log('All done');
                        //console.log(pgpTextEmails);

                        var destFolderId =
                            app.user.get("systemFolders")["sentFolderId"];
                        var mesId = refId;
                        var emails = app.user.get("emails")["messages"];
                        emails[mesId]["tp"] = 2;
                        var origFolder =
                            app.user.get("systemFolders")["draftFolderId"];
                        emails[mesId]["fr"] = draft["meta"]["from"];

                        app.globalF.move2Folder(
                            destFolderId,
                            [mesId],
                            function () {
                                app.userObjects.updateObjects(
                                    "sendEmailInt",
                                    inTextEmails,
                                    function (result) {
                                        if (result["response"] == "success") {
                                            if (result["data"] == "saved") {
                                                app.globalF.syncUpdates();
                                                //app.user.set({"currentMessageView":{}});
                                                app.globalF.resetCurrentMessage();
                                                app.globalF.resetDraftMessage();

                                                //console.log(app.user.get("currentFolder"));
                                                Backbone.history.navigate(
                                                    "/mail/" +
                                                        app.user.get(
                                                            "currentFolder"
                                                        ),
                                                    {
                                                        trigger: true,
                                                    }
                                                );
                                                deff.resolve();
                                            } else {
                                                app.globalF.move2Folder(
                                                    origFolder,
                                                    [mesId],
                                                    function () {
                                                        deff.reject("error");
                                                    }
                                                );
                                                app.notifications.systemMessage(
                                                    "tryAgain"
                                                );
                                            }
                                        } else {
                                            app.globalF.move2Folder(
                                                origFolder,
                                                [mesId],
                                                function () {
                                                    deff.reject(result);
                                                }
                                            );
                                            // app.notifications.systemMessage('tryAgain');
                                        }
                                    }
                                );
                            }
                        );
                    });
                }
            }
            return deff;
        },
        getFileNamesForSend: function (attachmentObject) {
            var arrayNames = [];
            $.each(attachmentObject, function (index, data) {
                arrayNames.push(data["fileName"]);
            });
            return arrayNames;
        },

        base64ToArrayBuffer: function (binary_string) {
            //var binary_string =  window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },

        downloadFile: function (fileName, modKey, version, callback) {
            var post = {
                fileName: fileName,
                modKey: modKey,
                version: version,
            };
            app.serverCall.ajaxRequest("downloadFile", post, function (result) {
                if (result["response"] == "success") {
                    callback(result["data"]);
                } else if (result["response"] == "fail") {
                    app.notifications.systemMessage("fileNotFound");
                    callback(false);
                } else {
                    app.notifications.systemMessage("tryAgain");
                    callback(false);
                }
                //console.log(result);
            });
        },
        rcptObjToArr: function (obj) {
            var rcpArr = [];
            var contact = app.user.get("contacts");

            if (Object.keys(obj).length > 0) {
                //console.log(obj);
                $.each(obj, function (email64, emailData) {
                    if (emailData["name"] != "") {
                        var data =
                            app.transform.from64str(emailData["name"]) +
                            " <" +
                            app.transform.from64str(email64) +
                            ">";
                    } else {
                        var data = app.transform.from64str(email64);
                    }

                    if (contact[email64] != undefined) {
                        if (contact[email64]["n"] != "") {
                            var data =
                                app.transform.from64str(emailData["name"]) +
                                " <" +
                                app.transform.from64str(email64) +
                                ">";
                        } else {
                            var data = app.transform.from64str(email64);
                        }
                    }
                    rcpArr.push(app.transform.to64str(data));
                });
            }
            return rcpArr;
        },
        parsePGPemail: function (text, encText) {
            // console.log('dfdf')
            //console.log(text);

            var decryptedMessage = {
                text: "",
                html: "",
                attachments: [],
            };
            var ready = $.Deferred();

            app.mailParser.readEmail(text, function (parsedBody) {
                //console.log(parsedBody);

                if (parsedBody !== false) {
                    $.each(parsedBody["contents"], function (index, data) {
                        if (data["contentDisposition"] != undefined) {
                            decryptedMessage["attachments"].push(data);
                        } else {
                            if (
                                data["contentType"].indexOf("text/html") != -1
                            ) {
                                decryptedMessage["html"] = data["contents"];
                            } else {
                                decryptedMessage["text"] = data["contents"];
                            }
                        }
                    });
                } else {
                    decryptedMessage["html"] = text;
                }

                ready.resolve(decryptedMessage);
            });

            return ready.promise();
        },

        decryptPGPMessage: function (text, email) {
            var pgpMessageRead = false;

            var pgpInlineMatch =
                /-{5}BEGIN PGP MESSAGE-{5}[\s\S]*-{5}END PGP MESSAGE-{5}/im.exec(
                    text
                );
            var encryptedPGP = "";
            var ready = $.Deferred();
            var readyFail = $.Deferred();
            var emailpromises = [];

            // var readyFail = $.Deferred();

            try {
                encryptedPGP = openpgp.message.readArmored(pgpInlineMatch[0]);
                pgpMessageRead = true;
            } catch (err) {}

            // console.log(encryptedPGP);

            if (pgpMessageRead) {
                // console.log(keys[email]);
                var keys = app.user.get("allKeys");
                var key = app.transform.from64str(
                    keys[email]["v2"]["privateKey"]
                );
                var privateKey = openpgp.key.readArmored(key).keys[0];
                privateKey.decrypt(keys[email]["keyPass"]);

                //recipient email decode
                openpgp
                    .decryptMessage(privateKey, encryptedPGP)
                    .then(function (plaintext) {
                        app.globalF.parsePGPemail(plaintext, text).then(
                            function (decrypted) {
                                // console.log('ddd1');
                                ready.resolve(email, decrypted);
                            },
                            function (err) {
                                // console.log('ddd2');
                                readyFail.resolve();
                            }
                        );
                    })
                    .catch(function (error) {
                        console.log(error);
                        readyFail.resolve();
                    });

                readyFail.done(function () {
                    //console.log('ggg3');
                    $.each(keys, function (index, data) {
                        var decPromise = $.Deferred();
                        var key = app.transform.from64str(
                            data["v2"]["privateKey"]
                        );
                        var privateKey = openpgp.key.readArmored(key).keys[0];
                        privateKey.decrypt(data["keyPass"]);

                        openpgp
                            .decryptMessage(privateKey, encryptedPGP)
                            .then(function (plaintext) {
                                app.globalF.parsePGPemail(plaintext, text).then(
                                    function (decrypted) {
                                        //     console.log('ddd3');
                                        ready.resolve(email, decrypted);
                                        decPromise.resolve(true);
                                    },
                                    function (err) {
                                        //    console.log('ddd4');
                                    }
                                );
                            })
                            .catch(function (error) {
                                // console.log('ddd5');
                                // failure
                                decPromise.resolve(false);
                            });
                        emailpromises.push(decPromise);
                    });

                    Promise.all(emailpromises).then(function (values) {
                        if (values.indexOf(true) == -1) {
                            //   console.log(values);
                            alert("Unable to decrypt Message");
                        }
                    });
                });
            }
            //todo if decryption failed, future request private key

            return ready.promise();
        },

        parseKeys: function (pubKey) {
            var publicKey = openpgp.key.readArmored(pubKey);
        },

        verifySignature: function (senderPK, version) {
            var message = app.user.get("currentMessageView");
            var folderMessage =
                app.user.get("emails")["messages"][message["id"]];

            //console.log(privateKey);

            //console.log(app.user.get('currentMessageView'));
            //console.log(senderKey);
            //console.log(folderMessage);

            //if(parseInt(message['version'])==1){

            if (parseInt(version) == 1) {
                /*
				 var senderKey=app.transform.publicPem2prime(app.transform.from64str(senderPK));

				 var verificationText=JSON.stringify(message['originalBody']);

				 var md = forge.md.sha256.create();
				 md.update(verificationText, 'utf8');

				 var sign=app.transform.hex2bin(folderMessage['sg']);
				 console.log(senderKey.verify(md.digest().bytes(),sign));
				 //return senderKey.verify(md.digest().bytes(),sign);
				 */
                return "old";
            } else if (parseInt(version) == 2) {
            }

            /*
			 console.log('origBody');
			 console.log(message['originalBody']);


			 var md = forge.md.sha256.create();
			 md.update(verificationText, 'utf8');
			 var origSig = app.transform.bin2hex(privateKey.sign(md));
			 console.log('origSignature');
			 console.log(origSig);
			 */
            //var md = forge.md.sha256.create();
            //md.update(verificationText, 'utf8');
            //var signature=app.transform.bin2hex(sign.sign(md));

            //var sign=app.transform.hex2bin(folderMessage['sg']);

            //console.log(sign);

            //var verified = senderKey.verify(md.digest().bytes(),sign);
            //console.log(verified);
            //}
            /*
			 var body={
			 'meta':{
			 'to':recipient,
			 'from':sender,
			 'subject':message['meta']['subject'],
			 'body':message['meta']['body'],
			 'fromExtra':fromExtra,
			 'timeSent':message['meta']['timeSent'],
			 'opened':false,
			 'pin':'',
			 'modKey':message['meta']['modKey'],
			 'type':'received',
			 'status':''
			 },
			 'to':recipient,
			 'from':sender,
			 'subj':subject,

			 'body':{
			 'text':bodyText,
			 'html':bodyHTML
			 },
			 'modKey':modKey,

			 'badRcpt':bdRcpt,
			 'senderMod':sndrMod
			 };

			 }
			 */
            //
        },

        reply: function (action) {
            //console.log(action);
            //console.log(app.user.get('currentMessageView'));
            //console.log(app.user.get('draftMessageView'));

            var currentMessage = app.user.get("currentMessageView");
            var draft = app.user.get("draftMessageView");
            var keys = app.user.get("allKeys");
            var d = new Date();

            draft["messageId"] = "";

            if (
                currentMessage["meta"]["to"] != undefined &&
                currentMessage["meta"]["toCC"] != undefined
            ) {
                // console.log(currentMessage['meta']);
                var fromIn = [];
                var to = [];
                var toCC = [];

                if (
                    Array.isArray(currentMessage["meta"]["to"]) &&
                    Array.isArray(currentMessage["meta"]["toCC"])
                ) {
                    fromIn = currentMessage["meta"]["to"].concat(
                        currentMessage["meta"]["toCC"]
                    );
                } else if (
                    !Array.isArray(currentMessage["meta"]["to"]) &&
                    Array.isArray(currentMessage["meta"]["toCC"])
                ) {
                    $.each(
                        currentMessage["meta"]["to"],
                        function (index, fromValue) {
                            to.push(fromValue);
                        }
                    );

                    fromIn = to.concat(currentMessage["meta"]["toCC"]);
                } else if (
                    Array.isArray(currentMessage["meta"]["to"]) &&
                    !Array.isArray(currentMessage["meta"]["toCC"])
                ) {
                    $.each(
                        currentMessage["meta"]["toCC"],
                        function (index, fromValue) {
                            toCC.push(fromValue);
                        }
                    );
                    fromIn = currentMessage["meta"]["to"].concat(toCC);
                }
            } else if (
                currentMessage["meta"]["to"] != undefined &&
                currentMessage["meta"]["toCC"] == undefined
            ) {
                var fromIn = currentMessage["meta"]["to"];
            } else if (
                currentMessage["meta"]["to"] == undefined &&
                currentMessage["meta"]["toCC"] != undefined
            ) {
                var fromIn = currentMessage["meta"]["toCC"];
            }

            if (currentMessage["meta"]["to"] != undefined) {
                var sendTo = currentMessage["meta"]["to"];
            }

            var from = "";
            var fromAll = {};
            var fromCC = {};

            //console.log(from instanceof Array
            if (fromIn instanceof Array) {
                //console.log(fromIn);
                //find credent. for FROM field
                $.each(fromIn, function (index, fromValue) {
                    var fr = app.globalF.getEmailsFromString(
                        app.transform.from64str(fromValue)
                    );
                    if (
                        keys[app.transform.to64str(fr)] != undefined &&
                        from == ""
                    ) {
                        from = app.transform.to64str(fr);
                    }
                });

                //create array to propagate TO field
                if (currentMessage["meta"]["to"] != undefined) {
                    $.each(sendTo, function (index, fromValue) {
                        var fr = app.globalF.getEmailsFromString(
                            app.transform.from64str(fromValue)
                        );
                        if (
                            keys[app.transform.to64str(fr)] != undefined &&
                            from == ""
                        ) {
                        } else {
                            var clearEmName =
                                app.transform.from64str(fromValue);
                            var emailObj = app.globalF.parseEmail(clearEmName);
                            var emailCl = emailObj["email"];
                            var emName = emailObj["name"];

                            fromAll[app.transform.to64str(emailCl)] = {
                                dest: "to",
                                name: app.transform.to64str(emName),
                            };

                            //fromAll[app.transform.to64str(app.globalF.getEmailsFromString(app.transform.from64str(fromValue)))]={};
                            // fromAll.push(app.transform.from64str(fromValue));
                        }
                    });
                }
            } else {
                from = fromIn;
            }

            if (
                currentMessage["meta"]["toCC"] != undefined &&
                currentMessage["meta"]["toCC"] instanceof Array
            ) {
                $.each(
                    currentMessage["meta"]["toCC"],
                    function (index, fromValue) {
                        var clearEmName = app.transform.from64str(fromValue);
                        var emailObj = app.globalF.parseEmail(clearEmName);
                        var emailCl = emailObj["email"];
                        var emName = emailObj["name"];

                        fromCC[app.transform.to64str(emailCl)] = {
                            dest: "to",
                            name: app.transform.to64str(emName),
                        };
                        // fromCC[app.transform.to64str(app.globalF.getEmailsFromString(app.transform.from64str(fromValue)))]={};
                        //fromCC.push(app.transform.from64str(fromValue));
                    }
                );
            }
            //console.log(fromAll);
            //fromAll=fromAll.concat(currentMessage['meta']['cc']);

            //console.log(fromIn);
            //console.log(fromAll);

            if (action == "replyStrict" || action == "replyFull") {
                var frt = {};
                var clearEmName = app.transform.from64str(
                    currentMessage["meta"]["from"]
                );
                var emailObj = app.globalF.parseEmail(clearEmName);
                var emailCl = emailObj["email"];
                var emName = emailObj["name"];

                frt[app.transform.to64str(emailCl)] = {
                    dest: "to",
                    name: app.transform.to64str(emName),
                };

                draft["meta"]["to"] = frt;
                draft["meta"]["toCC"] = {};
            } else if (action == "replyAStrict" || action == "replyAFull") {
                draft["meta"]["to"] = fromAll;
                draft["meta"]["toCC"] = fromCC;
            } else if (action == "forwardStrict" || action == "forwardFull") {
                draft["meta"]["to"] = {};
                draft["meta"]["toCC"] = {};
            }
            //draft['to']=body['to'];

            //console.log(app.transform.from64str(currentMessage['meta']['to'][0]));

            draft["meta"]["from"] = from; //reverse back to sender

            draft["meta"]["toBCC"] = {};

            draft["meta"]["signatureOn"] = false;

            draft["meta"]["version"] = 2;

            draft["meta"]["attachment"] = "";

            draft["meta"]["body"] = app.transform.from64str(
                currentMessage["meta"]["body"]
            );

            draft["meta"]["pinEnabled"] = false;
            draft["meta"]["opened"] = true;
            draft["meta"]["pin"] = "";
            draft["meta"]["status"] = "normal";

            draft["meta"]["timeSent"] = Math.round(d.getTime() / 1000);
            draft["meta"]["timeCreated"] = Math.round(d.getTime() / 1000);

            draft["meta"]["subject"] = app.transform.from64str(
                currentMessage["meta"]["subject"]
            );
            draft["meta"]["type"] = 3;

            var options = {};
            //options.timeZone = 'UTC';
            options.timeZoneName = "short";
            var fromMail = app.globalF.parseEmail(
                app.transform.from64str(currentMessage["meta"]["from"])
            );
            //console.log(draft);
            //if(action=='replyStrict' || action=='replyFull'){

            if (
                action == "replyStrict" ||
                action == "replyFull" ||
                action == "replyAStrict" ||
                action == "replyAFull"
            ) {
                app.user.set({ emailReplyState: "reply" });
                var preReplyText =
                    "<br/><br/>--------------------------------------------<br/><br/>" +
                    "On " +
                    new Date(
                        currentMessage["meta"]["timeSent"] * 1000
                    ).toDateString(options) +
                    " at " +
                    new Date(
                        currentMessage["meta"]["timeSent"] * 1000
                    ).toLocaleTimeString() +
                    ", " +
                    fromMail["htmlFdisplay"] +
                    " wrote: <br/>";

                draft["body"]["html"] =
                    preReplyText +
                    '<pre class="reply-indentation" spellcheck="false">' +
                    $("#virtualization").contents().find("html").html() +
                    "</pre>";
            } else if (action == "forwardStrict" || action == "forwardFull") {
                app.user.set({ emailReplyState: "forward" });
                draft["body"]["html"] = $("#virtualization")
                    .contents()
                    .find("html")
                    .html();
            }

            //}
            //draft['body']['html']="";
            //draft['body']['text']=app.transform.from64str(body['body']['text']);
            draft["modKey"] = "";
        },

        passScore: function (pass) {
            var score = 0;
            if (!pass) return score;

            // award every unique letter until 5 repetitions
            var letters = new Object();
            for (var i = 0; i < pass.length; i++) {
                letters[pass[i]] = (letters[pass[i]] || 0) + 1;
                score += 5.0 / letters[pass[i]];
            }

            // bonus points for mixing it up
            var variations = {
                digits: /\d/.test(pass),
                lower: /[a-z]/.test(pass),
                upper: /[A-Z]/.test(pass),
                nonWords: /\W/.test(pass),
            };

            var variationCount = 0;
            for (var check in variations) {
                variationCount += variations[check] == true ? 1 : 0;
            }
            score += (variationCount - 1) * 10;

            return parseInt(score);
        },
        sanitizeCss: function (html) {
            var html1 = html.replace(/<style[\s\S]*?\/style>/gi, "");

            return html1;
        },
        deleteEmailsFromFolder: function (emailsArray, callback) {
            var removed = [];
            if (emailsArray.length > 0) {
                var messages = app.user.get("emails")["messages"];
                var folders = app.user.get("emails")["folders"];
                var foldersDecrypted = app.user.get("DecryptedFolderObject");

                //console.log(emailsArray);

                $.each(emailsArray, function (index, emailId) {
                    // console.log(messages[emailId]);
                    if (messages[emailId] !== undefined) {
                        removed.push({
                            id: emailId,
                            modKey:
                                messages[emailId]["mK"] != undefined
                                    ? messages[emailId]["mK"]
                                    : "",
                            v: messages[emailId]["vr"],
                        });
                    }

                    //if emails get corrupted
                    try {
                        delete foldersDecrypted[
                            messages[emailId]["b"]
                        ]["data"][emailId];
                    } catch (err) {}
                    try {
                        delete folders[messages[emailId]["f"]][emailId];
                    } catch (err) {}
                    try {
                        delete messages[emailId];
                    } catch (err) {}
                });
            }
            callback(removed);
        },

        move2Folder: function (destFolderId, data, callback) {
            if (data.length > 0) {
                var messages = app.user.get("emails")["messages"];
                var folders = app.user.get("emails")["folders"];

                $.each(data, function (index, emailId) {
                    delete folders[messages[emailId]["f"]][emailId];
                    messages[emailId]["f"] = destFolderId;
                    folders[destFolderId][emailId] = messages[emailId];
                });
            }
            callback();
        },
        createFilterRule: function (id, from, match, folder, text, callback) {
            var filter = app.user.get("filter");

            if (id === "") {
            } else {
                delete filter[id];
            }

            var spamEl = {
                field: from,
                match: match,
                to: folder,
                text: app.transform.to64str(text),
            };

            filter[app.transform.SHA256(JSON.stringify(spamEl))] = spamEl;

            callback();
        },

        filterXSSwhite: function (html) {
            if (html != "") {
                var messageDisplayedBody = filterXSS(html, {
                    whiteList: {
                        a: ["target", "href", "title", "class", "style"],
                        abbr: ["title"],
                        address: [],
                        article: ["class", "style"],
                        aside: [],
                        b: [],
                        bdi: ["dir"],
                        bdo: ["dir"],
                        big: [],
                        blockquote: ["cite"],
                        br: [],
                        body: ["class", "style"],
                        caption: [],
                        center: [],
                        cite: [],
                        code: [],
                        col: ["align", "valign", "span", "width"],
                        colgroup: ["align", "valign", "span", "width"],
                        dd: [],
                        del: ["datetime"],
                        details: ["open"],
                        div: ["class", "style"],
                        dl: [],
                        dt: [],
                        em: [],
                        font: ["color", "size", "face"],
                        footer: ["class", "style"],
                        h1: ["class", "style"],
                        h2: ["class", "style"],
                        h3: ["class", "style"],
                        h4: ["class", "style"],
                        h5: ["class", "style"],
                        h6: ["class", "style"],
                        header: ["class", "style"],
                        hr: [],
                        i: [],
                        img: [
                            "src",
                            "alt",
                            "title",
                            "width",
                            "height",
                            "class",
                            "style",
                        ],
                        ins: ["datetime"],
                        li: ["class", "style"],
                        mark: [],
                        nav: [],
                        ol: [],
                        p: ["class", "style"],
                        pre: [],
                        s: [],
                        section: [],
                        small: [],
                        span: ["class", "style"],
                        sub: [],
                        sup: [],
                        strong: [],
                        style: [],
                        table: ["width", "border", "align", "valign", "style"],
                        tbody: ["align", "valign"],
                        td: ["width", "colspan", "align", "valign", "style"],
                        tfoot: ["align", "valign"],
                        th: ["width", "colspan", "align", "valign"],
                        thead: ["align", "valign"],
                        tr: ["rowspan", "align", "valign", "style"],
                        tt: [],
                        u: [],
                        ul: ["style"],
                    },
                });

                return messageDisplayedBody;
            }
            return html;
        },

        renderBodyFull: function (html, text, callback) {
            if (html != "") {
                var messageDisplayedBody = filterXSS(html, {
                    whiteList: {
                        a: ["target", "href", "title", "class", "style"],
                        abbr: ["title"],
                        address: [],
                        article: ["class", "style"],
                        aside: [],
                        b: [],
                        bdi: ["dir"],
                        bdo: ["dir"],
                        big: [],
                        blockquote: ["cite"],
                        br: [],
                        body: ["class", "style"],
                        caption: [],
                        center: [],
                        cite: [],
                        code: [],
                        col: ["align", "valign", "span", "width"],
                        colgroup: ["align", "valign", "span", "width"],
                        dd: [],
                        del: ["datetime"],
                        details: ["open"],
                        div: ["class", "style"],
                        dl: [],
                        dt: [],
                        em: [],
                        font: ["color", "size", "face"],
                        footer: ["class", "style"],
                        h1: ["class", "style"],
                        h2: ["class", "style"],
                        h3: ["class", "style"],
                        h4: ["class", "style"],
                        h5: ["class", "style"],
                        h6: ["class", "style"],
                        header: ["class", "style"],
                        hr: [],
                        i: [],
                        img: [
                            "src",
                            "alt",
                            "title",
                            "width",
                            "height",
                            "class",
                            "style",
                        ],
                        ins: ["datetime"],
                        li: ["class", "style"],
                        mark: [],
                        nav: [],
                        ol: [],
                        p: ["class", "style"],
                        pre: [],
                        s: [],
                        section: [],
                        small: [],
                        span: ["class", "style"],
                        sub: [],
                        sup: [],
                        strong: [],
                        style: [],
                        table: ["width", "border", "align", "valign", "style"],
                        tbody: ["align", "valign"],
                        td: ["width", "colspan", "align", "valign", "style"],
                        tfoot: ["align", "valign"],
                        th: ["width", "colspan", "align", "valign"],
                        thead: ["align", "valign"],
                        tr: ["rowspan", "align", "valign", "style"],
                        tt: [],
                        u: [],
                        ul: ["style"],
                    },
                    onTagAttr: function (tag, name, value, isWhiteAttr) {
                        if (tag == "a" && name == "href")
                            return name + "=" + value + ' target="_blank"';
                    },
                    onTag: function (tag, html, options) {
                        if (
                            tag == "img" &&
                            html.indexOf("http:") == -1 &&
                            html.indexOf("https:") == -1
                        ) {
                            return " ";
                        }
                    },
                });
            } else {
                var messageDisplayedBody =
                    '<style>.showMessage{white-space: pre-line;}</style><div class="showMessage">' +
                    app.globalF.stripHTML(text) +
                    "</div>";
            }

            callback(messageDisplayedBody);
        },

        renderBodyNoImages: function (html, text, callback) {
            //console.log(html.length);
            //console.log(text.length);

            if (html.trim() != "") {
                html = app.globalF.sanitizeCss(html);

                var messageDisplayedBody = filterXSS(html, {
                    whiteList: {
                        a: ["target", "href", "title", "class"],
                        abbr: ["title"],
                        address: [],
                        article: ["class"],
                        aside: [],
                        b: [],
                        bdi: ["dir"],
                        bdo: ["dir"],
                        big: [],
                        blockquote: ["cite"],
                        br: [],
                        body: ["class"],
                        caption: [],
                        center: [],
                        cite: [],
                        code: [],
                        col: ["align", "valign", "span", "width"],
                        colgroup: ["align", "valign", "span", "width"],
                        dd: [],
                        del: ["datetime"],
                        details: ["open"],
                        div: ["class", "style"],
                        dl: [],
                        dt: [],
                        em: [],
                        font: ["color", "size", "face"],
                        footer: ["class"],
                        h1: ["class"],
                        h2: ["class"],
                        h3: ["class"],
                        h4: ["class"],
                        h5: ["class"],
                        h6: ["class"],
                        header: ["class"],
                        hr: [],
                        i: [],
                        img: ["alt", "title", "width", "height", "class"],
                        ins: ["datetime"],
                        li: ["class"],
                        mark: [],
                        nav: [],
                        ol: [],
                        p: ["class"],
                        pre: [],
                        s: [],
                        section: [],
                        small: [],
                        span: ["class"],
                        sub: [],
                        sup: [],
                        strong: [],
                        table: ["width", "border", "align", "valign"],
                        tbody: ["align", "valign"],
                        td: ["width", "colspan", "align", "valign"],
                        tfoot: ["align", "valign"],
                        th: ["width", "colspan", "align", "valign"],
                        thead: ["align", "valign"],
                        tr: ["rowspan", "align", "valign"],
                        tt: [],
                        u: [],
                        ul: [],
                    },
                    onTagAttr: function (tag, name, value, isWhiteAttr) {
                        if (tag == "a" && name == "href")
                            return name + "=" + value + ' target="_blank"';
                        if (name == "style" && value.indexOf("http") != -1)
                            return tag;
                    }, // empty, means filter out all tags
                    stripIgnoreTag: true, // filter out all HTML not in the whilelist
                    stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
                    // to filter out its content
                });
            } else if (text.trim() != "") {
                var messageDisplayedBody =
                    '<style>.showMessage{white-space: pre-line;}</style><div class="showMessage">' +
                    app.globalF.stripHTML(text) +
                    "</div>";
            } else {
                var messageDisplayedBody =
                    '<style>.showMessage{white-space: pre-line;}.text-center {text-align: center!important;}</style><div class="showMessage text-center">Email don\'t have any text.</div>';
            }

            callback(messageDisplayedBody);
        },
        arrayUnique: function (OriginalArray, lesserArray) {
            //returning unique element not found in second array

            var uniqArr = [];
            $.each(OriginalArray, function (index, value) {
                //if(obj['value']==undefined){
                //obj['value']='';

                if ($.inArray(value, lesserArray) == -1) {
                    uniqArr.push(value);
                }
                //}
            });
            return uniqArr;
        },
        resetCurrentMessage: function () {
            app.user.set({
                currentMessageView: {
                    id: "",
                    version: "",
                    attachment: {},
                    body: {
                        html: "",
                        text: "",
                    },
                    meta: {
                        attachment: "",
                        body: "",
                        from: "",
                        modKey: "",
                        opened: "",
                        pin: "",
                        status: "",
                        subject: "",
                        timeSent: "",
                    },
                },
            });
        },
        resetDraftMessage: function () {
            app.user.set({
                draftMessageView: {
                    messageId: "",
                    meta: {
                        to: {}, //["de17952f10164fc0864d0075994d40292e1dccd0","b9f2ef3ee4f874ce8f9bdea362be21f43c6453d6",'22332'],
                        toCC: {}, //["de17952f10164fc0864d0075994d40292e1dccd0",'22332'],
                        toBCC: {}, //["de17952f10164fc0864d0075994d40292e1dccd0","b9f2ef3ee4f874ce8f9bdea362be21f43c6453d6"],
                        from: "",
                        attachment: "",

                        subject: "",
                        body: "",
                        opened: "",
                        pin: "",
                        pinEnabled: "",
                        status: "",

                        timeSent: "",
                        type: "",
                        version: "",
                        signatureOn: false,
                    },
                    body: {
                        html: "",
                        text: "",
                    },
                    attachment: {},
                    modKey: "",
                },
            });
        },
        arrayNoDups: function (array) {
            //removing duplicates from array

            var obj = array.reduce(function (o, v, i) {
                o[v] = v;
                return o;
            }, {});

            var result = $.map(obj, function (value, index) {
                return [value];
            });

            return result;
        },

        //mailman incoming emails
        addNewMessageToFolder: function (newMessages, folder, callback) {
            var messages = app.user.get("emails")["messages"];
            var folders = app.user.get("emails")["folders"];
            var folderBlock = app.user.get("DecryptedFolderObject");
            var maxEmail = app.user.get("emailsPerBlock");
            //  console.log(newMessages);

            $.each(newMessages, function (messageId, data) {
                var minBlock = {
                    bId: "",
                    number: app.user.get("emailsPerBlock"),
                };

                $.each(folderBlock, function (index, value) {
                    //looking for least email block
                    if (index > 0) {
                        var len = Object.keys(value["data"]).length;
                        if (len < minBlock["number"]) {
                            minBlock["number"] = len;
                            minBlock["bId"] = index;
                        }
                    }
                });

                //if most minimum block bigger than allowed, create new block
                if (minBlock["number"] >= maxEmail) {
                    var ind = Object.keys(folderBlock).length;
                    folderBlock[ind] = {
                        data: {},
                        hash: "",
                        index: ind,
                        nonce: 0,
                    };
                    minBlock["bId"] = ind;
                }

                newMessages[messageId]["b"] = parseInt(minBlock["bId"]);

                folderBlock[data["b"]]["data"][messageId] = data;
                folders[data["f"]][messageId] = data;
                messages[messageId] = data;
            });

            callback();

            // console.log(app.user);
        },

        //saving draft
        addUpdateMessageToFolder: function (newMessage, folder, callback) {
            /*
			 message['id'] /id
			 message['fr'] //from
			 message['to'] //to
			 message['sb'] //subject
			 message['bd'] //body
			 message['at'] //attachment 1/0
			 message['pn'] //pin

			 message['p'] //password
			 message['tc'] //created
			 message['tr'] //received
			 message['mk'] //modKey
			 message['sg'] //encrypted signature
			 message['tg'] //tags


			 message['st'] //status 1-replied,2-forwarder,3-opened,0-unopened
			 message['tp'] //type 1-received,2 sent,3draft
			 message['en'] //encrypted 1-local internal,0-clear
			 message['f'] //folder
			 message['b'] //block
			 message['sz'] //size
			 message['vr'] //version

			 var emailToFolder={
			 'id':"",
			 'fr':"",
			 'to':"",
			 'sb':"",
			 'bd':"",
			 'at':"",
			 'pn':"",
			 'p':"",
			 'tc':"",
			 'tr':"",
			 'mk':"",
			 'sg':"",
			 'tg':"",
			 'st':"",
			 'tp':"",
			 'en':"",
			 'f':"",
			 'b':"",
			 'sz':"",
			 'vr':"2"
			 };


			 */

            var messages = app.user.get("emails")["messages"];
            var folders = app.user.get("emails")["folders"];
            var minBlock = {
                bId: 0,
                number: app.user.get("emailsPerBlock"),
            };

            if (
                messages[newMessage["messageId"]] !== undefined &&
                messages[newMessage["messageId"]]["b"] !== undefined
            ) {
                minBlock["bId"] = messages[newMessage["messageId"]]["b"];
            }

            //console.log();
            var folderBlock = app.user.get("DecryptedFolderObject");
            if (minBlock["bId"] === 0) {
                $.each(folderBlock, function (index, value) {
                    if (index > 0) {
                        var len = Object.keys(value["data"]).length;
                        //console.log(len);
                        if (len < minBlock["number"]) {
                            minBlock["number"] = len;
                            minBlock["bId"] = index;
                        }
                    }
                });

                var maxEmail = app.user.get("emailsPerBlock");

                if (minBlock["number"] >= maxEmail) {
                    var ind = Object.keys(folderBlock).length;
                    folderBlock[ind] = {
                        data: {},
                        hash: "",
                        index: ind,
                        nonce: 0,
                    };
                    minBlock["bId"] = ind;
                }
            }

            if (messages[newMessage["messageId"]] == undefined) {
                var pass = app.transform.to64bin(
                    app.globalF.createEncryptionKey256()
                );
            } else {
                var pass = messages[newMessage["messageId"]]["p"];
            }

            var emailToFolder = {
                fr: newMessage["meta"]["from"],
                to: newMessage["meta"]["to"],
                cc: newMessage["meta"]["toCC"],
                bcc: newMessage["meta"]["toBCC"],
                sb: newMessage["meta"]["subject"],
                bd: newMessage["meta"]["body"],
                at: newMessage["meta"]["attachment"],
                pn: app.transform.to64str(newMessage["meta"]["pin"]),
                p: pass,
                tc: newMessage["meta"]["timeCreated"],
                tr: newMessage["meta"]["timeUpdated"],
                mK: newMessage["modKey"],
                sg: "",
                sgM: true,
                tg: [],
                st: 3,
                tp: newMessage["meta"]["type"],
                en: 1,
                f: folder,
                b: parseInt(minBlock["bId"]),
                sz: newMessage["size"],
                vr: newMessage["meta"]["version"],
                pt: newMessage["meta"]["pinTop"],
                prn: newMessage["meta"]["pinRow"],
                son: newMessage["meta"]["sortRow"],
            };

            folderBlock[emailToFolder["b"]]["data"][newMessage["messageId"]] =
                emailToFolder;
            messages[newMessage["messageId"]] = emailToFolder;

            //folders[folder][newMessage['messageId']]={};
            //folders[folder][newMessage['messageId']]=emailToFolder;

            //app.userObjects.saveMailBox('emailsToFolder',{});

            //console.log(newMessage['messageId']);
            //console.log(app.user.get('emails')['messages'][newMessage['messageId']]);
            //console.log(app.user);

            callback();
        },
        sendNewAttachment: function (
            fileObject,
            modifiedList,
            messageId,
            messageModKey,
            callback
        ) {
            var key = app.transform.from64bin(
                fileObject[modifiedList["index"]]["key"]
            );

            var encryptedFile = {
                file: app.transform.toAesBin(
                    key,
                    fileObject[modifiedList["index"]]["data"]
                ),
                emailId: messageId,
                emailModKey: messageModKey,
                modKey: modifiedList["modKey"],
            };
            app.serverCall.ajaxRequest(
                "saveNewAttachment",
                encryptedFile,
                function (result) {
                    callback(result);
                }
            );

            //	console.log(fileObject);
            //	console.log(modifiedList);
        },

        saveDraft: function (draft, uniqDraftId, callback) {
            //getting message id,

            //var draft = app.user.get('draftMessageView');
            var ready = $.Deferred();

            if (draft["messageId"] == "") {
                var modK = app.globalF.makeModKey();
                //console.log('createMesId, ModKey and Save');

                var post = {
                    modKey: modK,
                };

                app.serverCall.ajaxRequest(
                    "getDraftMessageId",
                    post,
                    function (result) {
                        if (result["response"] == "success") {
                            draft["messageId"] = result["data"]["messageId"];
                            draft["modKey"] = modK;
                            draft["meta"]["modKey"] = modK;
                            //	console.log(result['data']['messageId']);
                            ready.resolve();
                        }
                    }
                );

                //console.log(draft);
            } else {
                ready.resolve();
                //console.log('Just Update Folders and draft Message');
            }

            ready.done(function () {
                //console.log(uniqDraftId);
                var folder = app.user.get("systemFolders")["draftFolderId"];

                app.globalF.addUpdateMessageToFolder(
                    draft,
                    folder,
                    function () {
                        //console.log(app.user.get('emails')['messages'][draft['messageId']]);

                        app.userObjects.updateObjects(
                            "draftEmail",
                            draft,
                            function (result) {
                                callback(draft, uniqDraftId);
                            }
                        );
                    }
                );

                //
            });
        },

        encryptMessage: function (draft) {
            //encrypting message

            //var d1 = new $.Deferred();

            //var draft=app.user.get('draftMessageView');
            var folderKey = app.transform.from64bin(
                app.user.get("emails")["messages"][draft["messageId"]]["p"]
            );
            //console.log(folderKey);

            var body = JSON.stringify(draft);
            var meta = JSON.stringify(draft["meta"]);

            var encryptedEmail = {};
            encryptedEmail["mail"] = app.transform.toAes64(folderKey, body);
            encryptedEmail["mailId"] = draft["messageId"];
            encryptedEmail["meta"] = app.transform.toAes64(folderKey, meta);
            encryptedEmail["modKey"] = draft["modKey"];

            app.user.set({ encryptedMessageView: encryptedEmail });
        },

        makeModKey: function () {
            return forge.util.bytesToHex(
                forge.pkcs5.pbkdf2(
                    app.globalF.createEncryptionKey256(),
                    app.user.get("salt"),
                    16,
                    16
                )
            );
        },

        checkSecondPassOld: function (callback) {
            //checking sec pass during account upgrade todo remove after Nov
            var key = app.user.get("secondPassword");
            console.log("key is here");
            //console.log(key);

            var oneStep = app.user.get("oneStep");

            if (app.globalF.tryDecryptOld(key)) {
                callback();
            } else {
                if (oneStep) {
                    $("#secPassText").html("Provide Password");
                } else {
                    $("#secPassText").html("Provide Second Password");
                }

                //$('#askPasInput').val(app.defaults.get('secondPassfield'));

                $("#secondPass").modal({
                    backdrop: "static",
                    keyboard: true,
                });

                $("#submitSecPass").on("click", function () {
                    var secret = $("#second_passField").val();
                    console.log("secret is Here");
                    //console.log(secret);
                    //	console.log(app.user.get('salt'));

                    secret = app.globalF.makeDerived(
                        secret,
                        app.user.get("salt")
                    );

                    //console.log(secret);

                    if (app.globalF.tryDecryptOld(secret)) {
                        app.user.set({ secondPassword: secret });

                        $("#secondPass").modal("hide");
                        $("#second_passField").val("");
                        callback();
                    } else {
                        app.notifications.systemMessage("wrngPass");
                    }
                });
            }
        },
        checkSecondPassLogin: function (callback) {
            var key = app.user.get("secondPassword");
            //	console.log(key);
            var oneStep = app.user.get("oneStep");

            if (app.globalF.tryDecryptDerived(key)) {
                callback();
            } else {
                if (oneStep) {
                    $("#askPassHeader").html("Provide Password");
                } else {
                    $("#askPassHeader").html("Provide Second Password");
                }

                $("#askPassClose").on("click", function () {
                    app.auth.logout();
                });


                $("#askforPass").modal("show");

               /* $("#secondPass").modal({
                    backdrop: "static",
                    keyboard: true,
                });*/

                $("#askPasSub").on("click", function () {
                    var secret = $("#askPasInput").val();

                    secret = app.globalF.makeDerived(
                        secret,
                        app.user.get("salt")
                    );

                    //console.log(secret);
                    if (app.globalF.tryDecrypt(secret)) {
                        //if(oneStep){
                        app.user.set({ secondPassword: secret });
                        //}else{
                        //				app.user.set({'secondPassword':app.transform.SHA512(secret)});
                        //}

                        $("#askforPass").modal("hide");
                        $("#askPasInput").val("");

                        $("#askPasSub").off("click");
                        $("#passLabel").addClass("d-none");
                        $("#passLabel").removeClass("invalid-feedback");
                        $("#passLabel").html("");
                        $("#askPasInput").val('');
                        callback();
                    } else {
                        $("#passLabel").removeClass("d-none");
                        $("#passLabel").addClass("invalid-feedback");
                        $("#passLabel").html("Wrong Password");

                       // app.notifications.systemMessage("wrngPass");
                    }
                });
            }
        },

        checkSecondPass: function (callback) {
            var key = app.user.get("secondPassword");
            //console.log(key);
            var oneStep = app.user.get("oneStep");

            if (app.globalF.tryDecryptDerived(key)) {
                callback();
            } else {
                if (oneStep) {
                    $("#askPassHeader").html("Provide Password");
                } else {
                    $("#askPassHeader").html("Provide Second Password");
                }

                $("#askPasInput").val(app.defaults.get("secondPassfield"));

                $("#askforPass").modal("show");
                $("#askPasInput").focus();
                $("#askPasSub").on("click", function () {
                    var secret = $("#askPasInput").val();
                    secret = app.globalF.makeDerived(
                        secret,
                        app.user.get("salt")
                    );

                    //console.log(secret);
                    if (app.globalF.tryDecrypt(secret)) {
                        //if(oneStep){
                        app.user.set({ secondPassword: secret });
                        //}else{
                        //				app.user.set({'secondPassword':app.transform.SHA512(secret)});
                        //}

                        $("#askforPass").modal("hide");
                        $("#askPasInput").val("");
                        callback();
                    } else {
                        app.notifications.systemMessage("wrngPass");
                    }
                });
            }
        },
        getAliasDisposableCount:function (){
            var data={
                "aliases":0,
                "disposable":0
            };

            $.each(app.user.get("allKeys"), function (email64, emailData) {
                if (emailData["addrType"] == 3 || emailData["addrType"] == 1) {
                    data['aliases']++;
                }else{
                    data['disposable']++;
                }
                /**
                 * { data: "checkbox" },
                 { data: "email" },
                 { data: "name" },
                 { data: "edit" },
                 { data: "delete" },
                 { data: "options" },
                 */
            });
            return data;
        },
        checkPlanLimits: function (action, count, callback) {
            var userPlan = app.user.get("userPlan");
            //console.log(userPlan['planData']['alias']);
            //console.log(count);
            $("#infoModHead").html("Plan Limits");

            if (parseInt(userPlan["pastDue"]) == 0) {
                switch (action) {
                    case "disposable":
                        if (userPlan["planData"]["dispos"] <= count) {
                            $("#infoModHeader").html(
                                "Please upgrade your plan."
                            );
                            $("#infoModBody").html(
                                "You've reached your plan limit. Please upgrade plan."
                            );
                            $("#infoModal").modal("show");
                            callback(false);
                        } else {
                            callback(true);
                        }

                        break;

                    case "alias":
                        if (userPlan["planData"]["alias"] <= count) {
                            $("#infoModHeader").html(
                                "Please upgrade your plan."
                            );
                            $("#infoModBody").html(
                                "You've reached your plan limit. Please upgrade plan."
                            );
                            $("#infoModal").modal("show");
                            callback(false);
                        } else {
                            callback(true);
                        }

                        break;

                    case "addDomain":
                        if (userPlan["planData"]["cDomain"] <= count) {

                            $("#infoModHeader").html(
                                "Please upgrade your plan."
                            );

                            $("#infoModBody").html(
                                "You've reached your plan limit. Please upgrade plan."
                            );
                            $("#infoModal").modal("show");
                            callback(false);
                        } else {
                            callback(true);
                        }

                        break;

                    case "folderExpiration":
                        if (userPlan["planData"]["folderExpire"] == 0) {
                            $("#infoModBody").html(
                                "Please enable this function in your plan before selecting."
                            );
                            $("#infoModal").modal("show");
                            callback(false);
                        } else {
                            callback(true);
                        }

                        break;
                    case "contacts":
                        if (userPlan["planData"]["contactList"] <= count) {
                            $("#infoModBody").html(
                                "You've reached your plan limit. Please upgrade plan."
                            );
                            $("#infoModal").modal("show");
                            callback(false);
                        } else {
                            callback(true);
                        }

                        break;

                    case "filter":
                        if (userPlan["planData"]["filter"] <= count) {
                            $("#infoModBody").html(
                                "You've reached your plan limit. Please upgrade plan."
                            );
                            $("#infoModal").modal("show");
                            callback(false);
                        } else {
                            callback(true);
                        }

                        break;
                }
            } else {
                $("#infoModBody").html(
                    "Your plan is past due. Please refill your balance or remove unnecessary features."
                );
                $("#infoModal").modal("show");
                callback(false);
            }
        },
        //when user forgot decryption phrase, we have to delete all his previous data and recreate new user

        /* resetSecondPass:function(email,oldPass,newSecretPhrase,oldTokenAesHash){

            /!*need to create
                1. Profile Object
                2. FolderObj
                3. userObj
                4. contacts
                5.blackList

            *!/

            //1 Profile
            var fodlerKey=app.globalF.makeRandomBytes(32);

            var salt=app.globalF.makeRandomBytes(256);

            var prfObj={};
            var newProfObj={};

            prfObj['version']=2;
            prfObj['fontSize']="";
            prfObj['fontType']="";
            prfObj['lastSeed']=0;
            prfObj['mailPerPage']=25;
            prfObj['sessionExpiration']=300;
            prfObj['displayName']="";
            prfObj['showDisplayName']=true;
            prfObj['includeSignature']=true;
            prfObj['rememberContacts']=true;
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
                "data": app.transform.toAes64(fodlerKey, JSON.stringify(prfObj)),
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
            encryptedMessageObj[0]['data']=app.transform.toAes64(fodlerKey, JSON.stringify(messagesObject[0]['folders']));
            encryptedMessageObj[0]['nonce']=1;
            encryptedMessageObj[0]['index']=0;
            encryptedMessageObj[0]['hash']=app.transform.SHA512(JSON.stringify(messagesObject[0]['folders']));

            encryptedMessageObj[1]={};
            encryptedMessageObj[1]['data']=app.transform.toAes64(fodlerKey, JSON.stringify(messagesObject[1]['messages']));
            encryptedMessageObj[1]['nonce']=1;
            encryptedMessageObj[1]['index']=1;
            encryptedMessageObj[1]['hash']=app.transform.SHA512(JSON.stringify(messagesObject[1]['messages']));


            //================

            //4 contact

            var newContList={};
            var newContactObj={};

            newContactObj[0]={
                "data": app.transform.toAes64(fodlerKey, JSON.stringify(newContList)),
                "hash":app.transform.SHA512(JSON.stringify(newContList)),
                "nonce":1,
                "index":0
            };

            //===========

            //5. blacklist
            var newBlackList={};
            var newBlackListObj={}

            newBlackListObj[0]={
                "data": app.transform.toAes64(fodlerKey, JSON.stringify(newBlackList)),
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
                'includeSignature':false,
                'signature':'',
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



                var nUserObj={
                    folderKey:app.transform.to64bin(fodlerKey),
                    keys:PGPkeys
                };

                //var fodlerKey=app.globalF.makeRandomBytes(32);

                //var salt=app.globalF.makeRandomBytes(256);


                var strUserObj=JSON.stringify(nUserObj);

                var secret = app.globalF.makeDerived(newSecretPhrase, salt);

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
                updatingPost['modKey']=app.globalF.makeModKey();
                updatingPost['profileVersion']=2;


                //var thisModule=this;

                var secretnew = secret;

                var derivedKey = app.globalF.makeDerived(secretnew, salt);
                var Test = app.transform.bin2hex(derivedKey);
                var Part2 = Test.substr(64, 128);
                var keyA = app.transform.hex2bin(Part2);
                var token = app.globalF.makeRandomBytes(256);
                var tokenHash = app.transform.SHA512(token);
                var tokenAes = app.transform.toAesBin(keyA, token);
                var tokenAesHash = app.transform.SHA512(tokenAes);

                app.user.set({downloadToken:tokenAes});

                updatingPost['email']=email;
                updatingPost['oldTokenAesHash']=oldTokenAesHash;
                updatingPost['oldPass']=oldPass;

                updatingPost['tokenHash']=tokenHash;
                updatingPost['tokenAesHash']=tokenAesHash;


                console.log(updatingPost);

                $.ajax({
                    method: "POST",
                    url: "api/resetUserObjectV2",
                    data: updatingPost,
                    dataType: "json"
                })
                    .done(function( msg ) {
                        if(msg['response']="notFound"){
                            alert('User Not Found');
                        }else if(msg['response']=="wrongPass"){
                            alert('Wrong Password');
                        }else if(msg['response']==""){

                        }

                    });


                console.log('close');
            });



        }*/
    });

    return GlobalFunctions;
});
