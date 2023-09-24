/**
 * @desc        stores the POST state and response state of authentication for user
 */
define(["app"], function (app) {
    var UserLogin = Backbone.Model.extend({
        // Initialize with negative/empty defaults
        // These will be overriden after the initial checkAuth
        defaults: {
            //logged_in: false,
            //user_id: ''
        },
        initialize: function () {
            //app.userObjects
            this.set({ EncryptedProfileObject: {} });
            this.set({ EncryptedUserObject: {} });
            this.set({ EncryptedFolderObject: {} });
            this.set({ EncryptedContactsObject: {} });
            this.set({ EncryptedBlackListObject: {} });

            this.set({ modalText: "loading folder object" });
            this.set({ modalpercentage: "20" });
        },

        startSession: function (callback) {
            if (app.user.get("profileVersion") == 1) {
                this.updAcc1(function () {
                    callback();
                });
            } else if (app.user.get("profileVersion") == 2) {
                //console.log('updated');
                this.initialSync(function () {
                    callback();
                });
            } else {
                alert("Please relogin");
            }
        },

/*        updAcc1: function (callback) {
            //updating account to new version

            app.serverCall.ajaxRequest(
                "getRawUserData",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        //setting userObject
                        app.userObjects.set({
                            EncryptedProfileObject:
                                result["data"]["profileObj"],
                        });
                        app.userObjects.set({
                            EncryptedUserObject: result["data"]["userObj"],
                        });
                        app.userObjects.set({
                            EncryptedFolderObject: result["data"]["folderObj"],
                        });
                        app.userObjects.set({
                            EncryptedContactsObject:
                                result["data"]["contactObj"],
                        });
                        app.userObjects.set({
                            EncryptedBlackListObject:
                                result["data"]["blackObj"],
                        });

                        app.userObjects.set({ modalpercentage: 60 });
                        app.userObjects.set({
                            modalText: "decoding Objects..",
                        });

                        //defining user data
                        app.user.set({
                            salt: app.transform.hex2bin(result["data"]["salt"]),
                        });

                        //decrypting User Objects
                        //console.log('ifOldUserAfterDataLoaded');

                        app.globalF.checkSecondPassOld(function () {
                            app.userObjects.set({
                                modalText: "Decoding User Object",
                            });
                            var userObj = JSON.parse(
                                app.v1transform.dbToProfile(
                                    app.userObjects.get("EncryptedUserObject"),
                                    app.user.get("secondPassword"),
                                    app.user.get("salt")
                                )
                            );
                            app.user.set({ DecryptedUserObject: userObj });

                            app.user.set({
                                modKey: app.user.get("DecryptedUserObject")
                                    .modKey,
                            });

                            app.userObjects.set({
                                modalText: "Extracting Key",
                            });
                            var folderKey = app.transform.hex2bin(
                                app.v1transform.from64(
                                    app.user.get("DecryptedUserObject")
                                        .folderKey
                                )
                            );
                            app.user.set({ folderKey: folderKey });

                            app.userObjects.set({
                                modalText: "Decoding Folder Object",
                            });
                            //console.log(app.userObjects.get("EncryptedFolderObject"));
                            try {
                                var folderObj = JSON.parse(
                                    app.transform.fromAes64(
                                        app.user.get("folderKey"),
                                        app.userObjects.get(
                                            "EncryptedFolderObject"
                                        )
                                    )
                                );
                            } catch (err) {
                                var folderObj = JSON.parse(
                                    app.v1transform.fromAes(
                                        app.user.get("folderKey"),
                                        app.userObjects.get(
                                            "EncryptedFolderObject"
                                        )
                                    )
                                );
                            }

                            app.user.set({ DecryptedFolderObject: folderObj });

                            app.userObjects.set({
                                modalText: "Extracting Folder Key",
                            });
                            var profObj = JSON.parse(
                                app.v1transform.fromAes(
                                    app.user.get("folderKey"),
                                    app.userObjects.get(
                                        "EncryptedProfileObject"
                                    )
                                )
                            );
                            app.user.set({ DecryptedProfileObject: profObj });

                            app.userObjects.set({
                                modalText: "Decoding Email",
                            });
                            app.user.set({
                                email: app.v1transform.from64(profObj["email"]),
                            });

                            app.userObjects.set({ modalText: "Decoding Name" });
                            app.user.set({
                                displayName: app.v1transform.from64(
                                    profObj["name"]
                                ),
                            });

                            app.userObjects.set({
                                modalText: "Decoding Last Seed",
                            });
                            app.user.set({
                                lastSeed: app.v1transform.from64(
                                    profObj["lastSeed"]
                                ),
                            });

                            //app.userObjects.set({"modalText": "Decoding Font Type"});
                            //app.user.set({"fontSize": app.v1transform.from64(profObj['fontSize'])});

                            //app.userObjects.set({"modalText": "Decoding Font Size"});
                            //app.user.set({"fontType": app.v1transform.from64(profObj['fontType'])});

                            app.userObjects.set({
                                modalText: "Decoding Mail Per Page",
                            });
                            if (profObj["mailPerPage"] == undefined) {
                                app.user.set({ mailPerPage: 25 });
                            } else {
                                app.user.set({
                                    mailPerPage: app.v1transform.from64(
                                        profObj["mailPerPage"]
                                    ),
                                });
                            }

                            app.userObjects.set({
                                modalText: "Decoding Session Expiration",
                            });
                            //console.log(profObj['sessionExpiration'])
                            if (profObj["sessionExpiration"] === undefined) {
                                app.user.set({ sessionExpiration: "-1" });
                            } else {
                                app.user.set({
                                    sessionExpiration: app.v1transform.from64(
                                        profObj["sessionExpiration"]
                                    ),
                                });
                            }

                            app.userObjects.set({
                                modalText: "Decoding Contacts Object",
                            });
                            var contObj = app.v1transform.fromAes(
                                app.user.get("folderKey"),
                                app.userObjects.get("EncryptedContactsObject")
                            );

                            app.userObjects.set({
                                modalText: "Decoding Blacklist Object",
                            });
                            var blackObj = app.v1transform.fromAes(
                                app.user.get("folderKey"),
                                app.userObjects.get("EncryptedBlackListObject")
                            );

                            app.userObjects.set({
                                modalText: "Parsing Contact Object",
                            });
                            try {
                                app.user.set({
                                    DecryptedContactsObject:
                                        JSON.parse(contObj),
                                });
                            } catch (err) {
                                app.user.set({
                                    DecryptedContactsObject: JSON.parse("{}"),
                                });
                            }

                            app.userObjects.set({
                                modalText: "Parsing Filter Object",
                            });
                            try {
                                app.user.set({
                                    DecryptedBlackListObject:
                                        JSON.parse(blackObj),
                                });
                            } catch (err) {
                                app.user.set({
                                    DecryptedBlackListObject: JSON.parse("{}"),
                                });
                            }

                            app.userObjects.set({
                                modalText: "OldPlan Object",
                            });
                            app.user.set({
                                oldPlan: result["data"]["oldPlan"],
                            });

                            //jQuery.extend(true, {}, folderObj)

                            app.userObjects.set({ modalpercentage: 100 });
                            app.userObjects.set({
                                modalText: "Updating Folder Object..",
                            });

                            callback();
                        });
                    }
                },
                function () {}
            );
        },*/

        initialSync: function (callback) {
            //console.log(app.user.get("secondPassword"));

            /*Check if we can user IndexedDB and if it has user object
             * if yes, check object hashes and compare with server
             * if server get newer retrieve data from server
             * if not return true
             * */
            //if(app.indexedDBWorker.get("allowedToUse") && app.indexedDBWorker.get("indexedDB_supported") && app.indexedDBWorker.get("handler")!={})
            //{

            //Initial go through userObjects and read from indexedDB

            var dfd_arr = [
                $.Deferred(),
                $.Deferred(),
                $.Deferred(),
                $.Deferred(),
                $.Deferred(),
                $.Deferred(),
                $.Deferred(),
            ]; //before proceed will wait all object to sync

            var firstStep = $.Deferred();
            var secondStep = $.Deferred();
            var thirdStep = $.Deferred();
            var fourthStep = $.Deferred();
            var fifthStep = $.Deferred();
            var sixStep = $.Deferred();
            var sevenStep = $.Deferred();
            var eightStep = $.Deferred();
            var nineStep = $.Deferred();

            var thisComp = this;
            firstStep.resolve();
            var perc = 20;

            firstStep.done(function () {
                app.userObjects.set({ modalpercentage: 20 });
                app.userObjects.set({ modalText: "Loading User PGP Keys" });

                var keyName = "userObj_" + app.user.get("cacheEmId");
                thisComp.readIndexed(keyName, function (userIndexedObj) {
                    app.userObjects.set({
                        EncryptedUserObject: userIndexedObj,
                    });
                    app.userObjects.syncUserObj(
                        "userObj",
                        "EncryptedUserObject",
                        function (primises) {
                            // console.log(primises);
                            $.when.apply(undefined, primises).then(function () {
                                perc += 10;
                                app.userObjects.set({ modalpercentage: perc });
                                app.userObjects.set({
                                    modalText: "User PGP Keys Loaded",
                                });

                                // dfd_arr[0].resolve();
                                secondStep.resolve();
                            }); // inner when
                        }
                    );
                });
            });

            secondStep.done(function () {
                app.userObjects.set({ modalText: "Loading User Profile" });

                var keyName = "profObj_" + app.user.get("cacheEmId");
                thisComp.readIndexed(keyName, function (userIndexedObj) {
                    app.userObjects.set({
                        EncryptedProfileObject: userIndexedObj,
                    });
                    app.userObjects.syncUserObj(
                        "profObj",
                        "EncryptedProfileObject",
                        function (primises) {
                            $.when.apply(undefined, primises).then(function () {
                                perc += 10;
                                app.userObjects.set({ modalpercentage: perc });
                                app.userObjects.set({
                                    modalText: "User Profile Loaded",
                                });
                                //dfd_arr[1].resolve();
                                thirdStep.resolve();
                            }); // inner when
                        }
                    );
                });
            });

            thirdStep.done(function () {
                app.userObjects.set({ modalText: "Loading Contacts" });
                var keyName = "contObj_" + app.user.get("cacheEmId");
                thisComp.readIndexed(keyName, function (userIndexedObj) {
                    app.userObjects.set({
                        EncryptedContactsObject: userIndexedObj,
                    });
                    app.userObjects.syncUserObj(
                        "contObj",
                        "EncryptedContactsObject",
                        function (primises) {
                            $.when.apply(undefined, primises).then(function () {
                                perc += 10;
                                app.userObjects.set({ modalpercentage: perc });
                                app.userObjects.set({
                                    modalText: "Contacts Loaded",
                                });
                                //dfd_arr[2].resolve();
                                fourthStep.resolve();
                            }); // inner when
                        }
                    );
                });
            });

            fourthStep.done(function () {
                app.userObjects.set({ modalText: "Loading Email List" });
                var keyName = "foldObj_" + app.user.get("cacheEmId");
                thisComp.readIndexed(keyName, function (userIndexedObj) {
                    app.userObjects.set({
                        EncryptedFolderObject: userIndexedObj,
                    });
                    app.userObjects.syncUserObj(
                        "foldObj",
                        "EncryptedFolderObject",
                        function (primises) {
                            $.when.apply(undefined, primises).then(function () {
                                perc += 10;
                                app.userObjects.set({ modalpercentage: perc });
                                app.userObjects.set({
                                    modalText: "Email List Loaded",
                                });
                                //dfd_arr[3].resolve();
                                fifthStep.resolve();
                            }); // inner when
                        }
                    );
                });
            });
            fifthStep.done(function () {
                app.userObjects.set({ modalText: "Loading Spam Filter" });
                var keyName = "spamObj_" + app.user.get("cacheEmId");
                thisComp.readIndexed(keyName, function (userIndexedObj) {
                    app.userObjects.set({
                        EncryptedBlackListObject: userIndexedObj,
                    });
                    app.userObjects.syncUserObj(
                        "spamObj",
                        "EncryptedBlackListObject",
                        function (primises) {
                            $.when.apply(undefined, primises).then(function () {
                                perc += 10;
                                app.userObjects.set({ modalpercentage: perc });
                                app.userObjects.set({
                                    modalText: "Spam Filter Loaded",
                                });
                                //dfd_arr[4].resolve();
                                sixStep.resolve();
                            }); // inner when
                        }
                    );
                });
            });
            sixStep.done(function () {
                app.userObjects.set({ modalText: "Loading User Plan" });

                app.userObjects.loadUserPlan(function () {
                    perc += 10;
                    app.userObjects.set({ modalpercentage: perc });
                    app.userObjects.set({ modalText: "User Plan Loaded" });
                    //dfd_arr[5].resolve();
                    sevenStep.resolve();
                });
            });
            sevenStep.done(function () {
                var checkPlan = setInterval(function () {
                    if (!app.user.get("getPlan")) {
                        app.user.set({ getPlan: true });

                        app.userObjects.loadUserPlan(function () {
                            app.user.set({ getPlan: false });
                        });
                    }
                }, 30000); //todo change to 10 sec on production

                app.userObjects.set({ modalText: "Loading System Variables" });

                app.userObjects.loadUserVariables(function () {
                    perc += 10;
                    app.userObjects.set({ modalpercentage: perc });
                    app.userObjects.set({
                        modalText: "System Variables Loaded",
                    });
                    // dfd_arr[6].resolve();
                    console.log('dddd22');
                    eightStep.resolve();

                });
            });
            eightStep.done(function () {
                app.userObjects.set({ modalText: "Decrypting PGP Keys.." });

                app.globalF.checkSecondPassLogin(function () {
                    var userObj = app.user.get("DecryptedUserObject");

                    $.each(
                        app.userObjects.get("EncryptedUserObject"),
                        function (index, value) {
                            userObj[index] = {};
                            userObj[index]["data"] = JSON.parse(
                                app.transform.db2profV2(
                                    value["data"],
                                    app.user.get("secondPassword"),
                                    app.user.get("salt")
                                )
                            );
                            userObj[index]["hash"] = value["hash"];
                            userObj[index]["index"] = value["index"];
                            userObj[index]["nonce"] = value["nonce"];
                        }
                    );
                    app.user.set({
                        modKey: app.user.get("DecryptedUserObject")[0]["data"]
                            .modKey,
                    });

                    var folderKey = app.transform.hex2bin(
                        app.transform.from64bin(
                            app.user.get("DecryptedUserObject")[0]["data"]
                                .folderKey
                        )
                    );
                    app.user.set({ folderKey: folderKey });
                    //todo parse PGP keys

                    app.userObjects.set({ modalText: "Decrypting Profile.." });
                    var userObj = app.user.get("DecryptedProfileObject");
                    $.each(
                        app.userObjects.get("EncryptedProfileObject"),
                        function (index, value) {
                            userObj[index] = {};
                            userObj[index]["data"] = JSON.parse(
                                app.transform.fromAes64(
                                    app.user.get("folderKey"),
                                    value["data"]
                                )
                            );
                            userObj[index]["hash"] = value["hash"];
                            userObj[index]["index"] = value["index"];
                            userObj[index]["nonce"] = value["nonce"];
                        }
                    );

                    app.userObjects.set({
                        modalText: "Decrypting Email List..",
                    });
                    var userObj = app.user.get("DecryptedFolderObject");
                    $.each(
                        app.userObjects.get("EncryptedFolderObject"),
                        function (index, value) {
                            userObj[index] = {};
                            userObj[index]["data"] = JSON.parse(
                                app.transform.fromAes64(
                                    app.user.get("folderKey"),
                                    value["data"]
                                )
                            );
                            userObj[index]["hash"] = value["hash"];
                            userObj[index]["index"] = value["index"];
                            userObj[index]["nonce"] = value["nonce"];
                        }
                    );

                    app.userObjects.set({ modalText: "Decrypting Conatcs.." });
                    var userObj = app.user.get("DecryptedContactsObject");
                    $.each(
                        app.userObjects.get("EncryptedContactsObject"),
                        function (index, value) {
                            userObj[index] = {};
                            userObj[index]["data"] = JSON.parse(
                                app.transform.fromAes64(
                                    app.user.get("folderKey"),
                                    value["data"]
                                )
                            );
                            userObj[index]["hash"] = value["hash"];
                            userObj[index]["index"] = value["index"];
                            userObj[index]["nonce"] = value["nonce"];
                        }
                    );

                    app.userObjects.set({ modalText: "Decrypting Filter.." });
                    var userObj = app.user.get("DecryptedBlackListObject");
                    $.each(
                        app.userObjects.get("EncryptedBlackListObject"),
                        function (index, value) {
                            userObj[index] = {};
                            try {
                                userObj[index]["data"] = JSON.parse(
                                    app.transform.fromAes64(
                                        app.user.get("folderKey"),
                                        value["data"]
                                    )
                                );
                            } catch (err) {
                                userObj[index]["data"] = {};
                            }

                            userObj[index]["hash"] = value["hash"];
                            userObj[index]["index"] = value["index"];
                            userObj[index]["nonce"] = value["nonce"];
                        }
                    );

                    perc += 3;
                    app.userObjects.set({ modalpercentage: perc });
                    app.userObjects.set({
                        modalText: "Initializing Session Variables..",
                    });

                    app.user.assignUservariables(function () {
                        nineStep.resolve();
                    });

                    //var userObj = JSON.parse(app.v1transform.dbToProfile(app.userObjects.get("EncryptedUserObject"), app.user.get("secondPassword"), app.user.get("Salt")));
                    //app.user.set({"DecryptedUserObject": userObj});

                    //alert('All syced');
                    //console.log(app.userObjects.get("EncryptedUserObject"));
                    //console.log('inner when callback');
                    //console.log( app.user.get("DecryptedUserObject"));
                    //console.log( app.user.attributes);
                });

                //secondStep.resolve();
            });

            nineStep.done(function () {
                var allkeys = {};

                $.each(app.user.get("allKeys"), function (index, value) {
                    var shamail = app.transform.SHA512(
                        app.transform.from64str(index)
                    );
                    allkeys[shamail] = value["addrType"];
                });

                if (
                    parseInt(
                        app.user.get("userPlan")["planData"]["folderExpire"]
                    ) === 1
                ) {
                    perc += 3;

                    app.userObjects.set({ modalText: "Purging old emails.." });

                    thisComp.deleteOldEmails(function () {
                        app.userObjects.set({ modalpercentage: 100 });
                        app.userObjects.set({
                            modalText: "Finished. Starting app",
                        });

                        //starting initial email functions
                        setTimeout(function () {
                            app.globalF.syncUpdates();
                            app.mailMan.startShift();

                            //console.log(app.user);
                            callback();
                        }, 500);
                    });
                } else {
                    app.userObjects.set({ modalpercentage: 100 });
                    app.userObjects.set({
                        modalText: "Finished. Starting app",
                    });

                    //starting initial email functions
                    setTimeout(function () {
                        app.globalF.syncUpdates();
                        app.mailMan.startShift();

                        //console.log(app.user);
                        callback();
                    }, 500);
                }

                /*        cosloe.log('sdfsd');



*/
            });

            //setInterval(function(){
            //	app.userObjects.loadUserPlan(function(){});
            //},5000);

            //$.when.apply(undefined, dfd_arr).then(function () {

            //}); // inner when

            //$.when.apply($, promises).then(function(){ doSomething()});

            //var fd=jQuery.extend(true, {}, app.userObjects.get("EncryptedUserObject"));

            //setTimeout(function(){
            //	console.log(fd);

            //	 }, 3000);
        },

        deleteOldEmails: function (callback) {
            var folders = app.user.get("folders");
            var emailF = app.user.get("emails")["folders"];
            var today = Math.round(new Date().getTime() / 1000);

            var emailToDelete = [];

            $.each(folders, function (index, fold) {
                if (fold["exp"] > 0) {
                    var foldeExpire = fold["exp"] * 3600 * 24;
                    $.each(emailF[index], function (indexM, dataMail) {
                        var dateReceived = 0;
                        if (
                            dataMail["tc"] !== undefined &&
                            dataMail["tc"] !== ""
                        ) {
                            dateReceived = dataMail["tc"];
                        } else if (
                            dataMail["tr"] !== undefined &&
                            dataMail["tr"] !== ""
                        ) {
                            dateReceived = dataMail["tr"];
                        }

                        if (today - dateReceived > foldeExpire) {
                            emailToDelete.push(indexM);
                        }
                    });
                }
            });

            if (emailToDelete.length > 0) {
                app.globalF.deleteEmailsFromFolder(
                    emailToDelete,
                    function (emails2Delete) {
                        if (emails2Delete.length > 0) {
                            app.userObjects.updateObjects(
                                "deleteEmail",
                                emails2Delete,
                                function (result) {
                                    callback();
                                }
                            );
                        }
                    }
                );
            } else {
                callback();
            }
        },

        loadUserVariables: function (callback) {
            app.serverCall.ajaxRequest(
                "getTrustedSenders",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        //var decodedPlan
                        //console.log(result['data']['senders']);
                        //var senders=result['data']['senders'];
                        app.user.set({
                            trustedSenders: result["data"]["senders"],
                        });
                        callback();
                    }
                }
            );
        },

        loadUserPlan: function (callback) {
            app.serverCall.ajaxRequest(
                "retrieveUserPlan",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        //var decodedPlan
                        //result['data']['planData']=JSON.parse(result['data']['planData']);
                        app.user.set({
                            userPlan: result["data"],
                            pastDue:
                                parseInt(result["data"]["pastDue"]) === 0
                                    ? false
                                    : true,
                        });

                        //console.log(app.user.get("userPlan")['alrdPaid']);
                        //console.log(app.user.get("userPlan"));

                        /* if(app.user.get("userPlan")['alrdPaid']!=app.user.get("userPlan")['monthlyCharge'] || app.user.get("userPlan")['alrdPaid']==0){
                        Backbone.history.navigate("settings/Plan", {
                            trigger : true
                        });
                    }
*/
                        var today = Math.floor(Date.now() / 1000);

                        if (result["data"]["planSelected"] == 1) {
                            var due = 2592000;
                        } else {
                            var due = 604800;
                        }

                        //warning one week before plan
                        if (
                            parseInt(result["data"]["cycleEnd"]) - today <
                                due &&
                            result["data"]["monthlyCharge"] >
                                result["data"]["currentPlanBalance"]
                        ) {
                            app.user.set({
                                balanceShort: true,
                            });
                        } else {
                            app.user.set({
                                balanceShort: false,
                            });
                        }

                        if (parseInt(result["data"]["priceFullProrated"]) > 0) {
                            app.user.set({
                                needRefill: true,
                            });
                        } else {
                            app.user.set({
                                needRefill: false,
                            });
                        }

                        //console.log();

                        if (
                            result["data"]["currentVersion"] >
                            app.user.get("currentVersion")
                        ) {
                            app.user.set({ pleaseUpdate: true });
                        }
                        // app.user.set({currentVersion:result['data']['currentVersion']});

                        callback();
                    }
                }
            );
        },

        saveChanges_obsolete: function (newData, actions, callback) {
            //todo clone object do update and if correct replace original
            //maybe obsolete and delete

            //console.log(app.user);
            //	console.log(newData);

            //app.sessionData..set({"dataInSync"$.Deferred()

            //If profileUser Changed Current: Profile Setting, Account Setting
            var locProfObject = jQuery.extend(
                true,
                {},
                app.user.get("DecryptedProfileObject")
            );

            if (newData["showDisplayName"] != undefined)
                locProfObject[0]["data"]["showDisplayName"] =
                    newData["showDisplayName"];
            if (newData["displayName"] != undefined)
                locProfObject[0]["data"]["displayName"] = app.transform.to64str(
                    newData["displayName"]
                );
            if (newData["includeSignature"] != undefined)
                locProfObject[0]["data"]["includeSignature"] =
                    newData["includeSignature"];
            if (newData["signature"] != undefined)
                locProfObject[0]["data"]["signature"] = app.transform.to64str(
                    newData["signature"]
                );

            if (newData["enableForwarding"] != undefined)
                locProfObject[0]["data"]["enableForwarding"] =
                    newData["enableForwarding"];
            if (newData["enableNotification"] != undefined)
                locProfObject[0]["data"]["enableNotification"] =
                    newData["enableNotification"];
            if (newData["mailPerPage"] != undefined)
                locProfObject[0]["data"]["mailPerPage"] =
                    newData["mailPerPage"];
            if (newData["notificationSound"] != undefined)
                locProfObject[0]["data"]["notificationSound"] =
                    newData["notificationSound"];
            if (newData["remeberPassword"] != undefined)
                locProfObject[0]["data"]["remeberPassword"] =
                    newData["remeberPassword"];
            if (newData["sessionExpiration"] != undefined)
                locProfObject[0]["data"]["sessionExpiration"] =
                    newData["sessionExpiration"];

            if (newData["forwardingAddress"] != undefined)
                locProfObject[0]["data"]["forwardingAddress"] =
                    app.transform.to64str(newData["forwardingAddress"]);
            if (newData["notificationAddress"] != undefined)
                locProfObject[0]["data"]["notificationAddress"] =
                    app.transform.to64str(newData["notificationAddress"]);

            if (newData["displayName"] != undefined)
                locProfObject[0]["data"]["displayName"] = app.transform.to64str(
                    newData["displayName"]
                );

            //locProfObject[0]['data']['fontSize']=newData['test'];

            switch (actions) {
                case "saveProfileSettings":
                    break;

                case "saveAccountSettings":
                    break;
            }

            //console.log(locProfObject[0]['data']);

            //console.log(app.user.get("DecryptedProfileObject"));

            var newProfHash = app.transform.SHA512(
                JSON.stringify(locProfObject[0]["data"])
            );
            var oldProfHash = app.userObjects.get("EncryptedProfileObject")[0]
                .hash;

            var objectToSend = {};
            if (newProfHash != oldProfHash) {
                var newProfObj = {};
                newProfObj[0] = {
                    data: app.transform.toAes64(
                        app.user.get("folderKey"),
                        JSON.stringify(locProfObject[0]["data"])
                    ),
                    hash: newProfHash,
                    index: newData["test"],
                    nonce:
                        app.userObjects.get("EncryptedProfileObject")[0].nonce +
                        1,
                };
                objectToSend["profileObject"] = JSON.stringify(newProfObj);
            }

            var postData = {};
            postData["objects"] = objectToSend;

            app.serverCall.ajaxRequest(
                "updateObjects",
                postData,
                function (result) {
                    //console.log(result);
                    if (result["response"] == "success") {
                        app.notifications.systemMessage("saved");
                        app.user.set({ DecryptedProfileObject: locProfObject });

                        app.user.assignVariablesFromProfileObject();
                        app.user.assignVariablesFromUserObject();
                        //console.log(app.user);
                    }
                    callback(result);
                    //console.log(app.user);
                }
            );

            //console.log(app.user);
            //locProfObject[0]['data']=newData;

            //console.log(locProfObject);

            //app.user.set({"displayName":dispName});
        },
        saveToIndexed: function (object) {},
        readIndexed: function (objName, callback) {
            if (
                app.indexedDBWorker.get("allowedToUse") &&
                app.indexedDBWorker.get("indexedDB_supported") &&
                app.indexedDBWorker.get("handler") != {}
            ) {
                app.indexedDBWorker.showRecord(
                    objName,
                    function (result) {
                        if (result == undefined) {
                            callback({
                                0: { data: "", hash: "", nonce: 0, index: 0 },
                            }); //give fake data comply with check function
                        } else {
                            callback(result); //return object stored
                        }
                    },
                    function () {
                        callback({
                            0: { data: "", hash: "", nonce: 0, index: 0 },
                        }); //give fake data will be overwritten
                    }
                );
            } else callback({ 0: { data: "", hash: "", nonce: 0, index: 0 } }); //give fake data will be overwritten
        },

        syncUserObj: function (objName, objCacheName, callback) {
            var dfd_arr = []; // array of deferred objects

            app.serverCall.ajaxRequest(
                "getUserObjCheckSum",
                { obj: objName },
                function (result) {
                    if (result["response"] == "success") {
                        var userServerObj = {};
                        var userMemoryObj = {};
                        userServerObj[objName] = result["data"];
                        userMemoryObj[objName] =
                            app.userObjects.get(objCacheName);

                        var servKeyLength = Object.keys(
                            userServerObj[objName]
                        ).length;
                        var memKeyLength = Object.keys(
                            userMemoryObj[objName]
                        ).length;

                        if (servKeyLength >= memKeyLength) {
                            //if local obj smaller remote
                            $.each(
                                userServerObj[objName],
                                function (index, value) {
                                    var dfd1 = {};
                                    dfd1[objName] = {};
                                    dfd1[objName][index] = $.Deferred();

                                    var dtIndex = parseInt(value["index"]);
                                    if (
                                        userMemoryObj[objName][dtIndex] ==
                                            undefined ||
                                        userMemoryObj[objName][dtIndex][
                                            "nonce"
                                        ] < value["nonce"]
                                    ) {
                                        app.serverCall.ajaxRequest(
                                            "getObjByIndex",
                                            { obj: objName, objIndex: dtIndex },
                                            function (result) {
                                                if (
                                                    result["response"] ==
                                                    "success"
                                                ) {
                                                    userMemoryObj[objName][
                                                        dtIndex
                                                    ] = result["data"];
                                                    dfd1[objName][
                                                        index
                                                    ].resolve();
                                                }
                                            }
                                        );

                                        //console.log('from serv');
                                        //retrieve this index from server
                                    } else if (
                                        userMemoryObj[index]["nonce"] >
                                        value["nonce"]
                                    ) {
                                        //console.log('to serv');
                                        //send this index to server
                                    }
                                    //console.log(index);
                                    //console.log(value['nonce']);
                                    dfd_arr.push(dfd1[objName][index]);
                                }
                            );
                            callback(dfd_arr);
                        } else {
                            //if local obj bigger remote
                            $.each(userMemoryObj, function (index, value) {
                                if (
                                    userServerObj[index] == undefined ||
                                    userServerObj[index]["nonce"] >
                                        value["nonce"]
                                ) {
                                    //	console.log('from serv');
                                    //retrieve this index from server
                                } else if (
                                    userMemoryObj[index]["nonce"] <
                                    value["nonce"]
                                ) {
                                    //	console.log('to serv');
                                    //send this index to server
                                }

                                //console.log(index);
                                //console.log(value['nonce']);
                            });
                        }
                    }
                }
            );
        },

        saveMailBox: function (action, data) {
            switch (action) {
                case "emailOpen":
                    //updateObjects
                    //	console.log('saveOpen');
                    //todo save folder Object
                    break;

                case "emailMove":
                    //console.log('emailMove');
                    //todo save folder Object
                    break;

                case "emailsRead":
                    //console.log('emailsRead');
                    //todo save folder Object
                    break;
                case "addTag":
                    //console.log('addTag');
                    //todo save folder Object
                    break;
                case "emailsToFolder":
                    //console.log('emailsToFolder');
                    //todo save folder Object with check new emails without block
                    break;
            }
        },

        updateObjects: function (action, payLoad, callback) {
            //saving all changes done by user into user objects

            switch (action) {
                case "userProfile":
                    //	console.log('userProfile');

                    var encryptedObj = app.userObjects.get(
                        "EncryptedProfileObject"
                    );

                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    profile[0]["data"]["sessionExpiration"] = parseInt(
                        app.user.get("sessionExpiration")
                    );
                    profile[0]["data"]["mailPerPage"] = parseInt(
                        app.user.get("mailPerPage")
                    );
                    profile[0]["data"]["remeberPassword"] =
                        app.user.get("remeberPassword");
                    profile[0]["data"]["defaultPGPKeybit"] =
                        app.user.get("defaultPGPKeybit");
                    profile[0]["data"]["rememberContacts"] =
                        app.user.get("rememberContacts");

                    profile[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(profile[0]["data"])
                    );
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };

                    //console.log(profile);
                    //console.log(newProfObj);
                    app.userObjects.savingObjects(
                        "profile",
                        newProfObj,
                        function (response) {
                            if (response == "saved") {
                                app.user.set({
                                    DecryptedProfileObject: profile,
                                });
                                app.userObjects.set({
                                    EncryptedProfileObject: newProfObj,
                                });
                                app.notifications.systemMessage("saved");
                            } else if (response == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (response == "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(response);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "userLayout":
                    //console.log('userLayout');

                    var encryptedObj = app.userObjects.get(
                        "EncryptedProfileObject"
                    );

                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    profile[0]["data"]["inboxLayout"] = app.transform.to64str(
                        app.user.get("inboxLayout")
                    );
                    //profile[0]['data']['mailPerPage']=parseInt(app.user.get('mailPerPage'));
                    //profile[0]['data']['remeberPassword']=app.user.get('remeberPassword');
                    profile[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(profile[0]["data"])
                    );
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };

                    //console.log(profile);
                    //console.log(newProfObj);
                    app.userObjects.savingObjects(
                        "profile",
                        newProfObj,
                        function (response) {
                            if (response == "saved") {
                                app.user.set({
                                    DecryptedProfileObject: profile,
                                });
                                app.userObjects.set({
                                    EncryptedProfileObject: newProfObj,
                                });
                                app.notifications.systemMessage("saved");
                            } else if (response == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (response == "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(response);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "changePass":
                    console.log("change Passes");

                    if (app.user.get("oneStep")) {
                        //send pass to save and reencode userObj
                        //console.log('onestep pass');
                        var userObj = app.user.get("DecryptedUserObject");
                        userObj[0]["nonce"] += 1;

                        var newUserObj = {};
                        newUserObj[0] = {
                            data: app.transform.prof2DbV2(
                                JSON.stringify(userObj[0]["data"]),
                                app.user.get("newSecondPassword")
                            ),
                            hash: userObj[0]["hash"],
                            index: 0,
                            nonce: userObj[0]["nonce"],
                        };

                        var post = {
                            oldPass: app.user.get("password"),
                            newPass: app.user.get("newPassword"),
                            userObj: JSON.stringify(newUserObj),
                            oneStep: true,
                        };
                        app.serverCall.ajaxRequest(
                            "changePassOneStep",
                            post,
                            function (result) {
                                if (result["response"] == "success") {
                                    app.userObjects.set({
                                        EncryptedUserObject: newUserObj,
                                    });
                                    app.notifications.systemMessage("saved");
                                } else {
                                    app.notifications.systemMessage("tryAgain");
                                }
                                callback(result);
                            }
                        );
                    } else {
                        //just send pass to save
                        console.log("two step pass");
                        var post = {
                            oldPass: app.user.get("password"),
                            newPass: app.user.get("newPassword"),
                        };
                        app.serverCall.ajaxRequest(
                            "changePass",
                            post,
                            function (result) {
                                if (result["response"] == "success") {
                                    app.notifications.systemMessage("saved");
                                } else {
                                    app.notifications.systemMessage("tryAgain");
                                }
                                callback(result);
                            }
                        );
                    }
                    break;
                case "changeSecondPass":
                    //reencrypt UserObject

                    var userObj = app.user.get("DecryptedUserObject");
                    userObj[0]["nonce"] += 1;
                    //userObj[0]['hash']=app.transform.SHA512(JSON.stringify(userObj[0]['data']));
                    //userObj[0]['data']=app.transform.prof2DbV2(JSON.stringify(userObj[0]['data']),app.user.get("newSecondPassword"));

                    //console.log(app.user.get("password"));
                    //console.log(app.user.get("newSecondPassword"));

                    var newUserObj = {};
                    newUserObj[0] = {
                        data: app.transform.prof2DbV2(
                            JSON.stringify(userObj[0]["data"]),
                            app.user.get("newSecondPassword")
                        ),
                        hash: userObj[0]["hash"],
                        index: 0,
                        nonce: userObj[0]["nonce"],
                    };

                    if (payLoad == "disableSecond") {
                        var post = {
                            oldPass: app.user.get("password"),
                            newPass: app.user.get("newPassword"),
                            userObj: JSON.stringify(newUserObj),
                            oneStep: 1,
                        };
                    } else if (payLoad == "enableSecond") {
                        var post = {
                            oldPass: app.user.get("password"),
                            newPass: app.user.get("newPassword"),
                            userObj: JSON.stringify(newUserObj),
                            oneStep: 0,
                        };
                    } else {
                        var post = {
                            userObj: JSON.stringify(newUserObj),
                            oneStep: 0,
                        };
                    }

                    //console.log('savings');
                    app.serverCall.ajaxRequest(
                        "changeSecondPass",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    //app.user.set({"DecryptedUserObject":userObj})
                                    app.userObjects.set({
                                        EncryptedUserObject: newUserObj,
                                    });

                                    app.notifications.systemMessage("saved");
                                } else if (result["data"] == "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                }

                                callback(result);
                            }
                        }
                    );

                    break;

                case "saveGoogleAuth":
                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    profile[0]["data"]["Factor2"] = app.user.get("Factor2");

                    profile[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(profile[0]["data"])
                    );
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };
                    var post = {
                        profObj: JSON.stringify(newProfObj),
                        secret: app.user.get("Factor2")["secret"],
                        type: app.user.get("Factor2")["type"],
                        verificationCode: payLoad,
                    };

                    //console.log(profile);
                    //console.log(app.user);
                    //console.log(newProfObj);

                    app.serverCall.ajaxRequest(
                        "saveGoogleAuth",
                        post,
                        function (result) {
                            if (result["data"] == "saved") {
                                app.user.set({
                                    DecryptedProfileObject: profile,
                                });
                                app.userObjects.set({
                                    EncryptedProfileObject: newProfObj,
                                });
                                app.notifications.systemMessage("saved");
                            } else if (result["data"] === "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (result["data"] === "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(result);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;
                case "editPGPKeys":
                    var originalUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );
                    var changedUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );
                    changedUserObj[0]["data"]["keys"] = app.user.get("allKeys");
                    changedUserObj[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(changedUserObj[0]["data"])
                    );
                    changedUserObj[0]["nonce"] += 1;

                    var newUserObj = {};
                    newUserObj[0] = {
                        data: app.transform.prof2DbV2(
                            JSON.stringify(changedUserObj[0]["data"]),
                            app.user.get("secondPassword")
                        ),
                        hash: changedUserObj[0]["hash"],
                        index: 0,
                        nonce: changedUserObj[0]["nonce"],
                    };

                    //var post={
                    //	'userObj':JSON.stringify(newUserObj)
                    //}

                    //	console.log(app.user.get("secondPassword"));

                    //console.log('savings');
                    app.userObjects.savingObjects(
                        "userObj",
                        newUserObj,
                        function (result) {
                            if (result == "saved") {
                                app.user.set({
                                    DecryptedUserObject: changedUserObj,
                                });
                                app.userObjects.set({
                                    EncryptedUserObject: newUserObj,
                                });

                                //console.log('saved');
                                //console.log(userObj[0]['data']);
                                //console.log(app.user.get("DecryptedUserObject"));
                                //console.log(app.userObjects.get("EncryptedUserObject"));

                                //	app.user.set({"DecryptedProfileObject":profile});
                                //	app.userObjects.set({"EncryptedProfileObject":newProfObj});
                                app.notifications.systemMessage("saved");
                            } else if (result == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (result === "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(result);
                        }
                    );

                    //console.log(originalUserObj);
                    //console.log(changedUserObj);
                    break;

                case "addPGPKey":
                    var originalUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );
                    var changedUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );

                    var newKey = app.user.get("newPGPKey");

                    //console.log(newKey);
                    //changedUserObj[0]['data']['keys']=app.user.get("allKeys");

                    if (newKey["isDefault"]) {
                        var keysAll = changedUserObj[0]["data"]["keys"];

                        $.each(keysAll, function (email64, emailData) {
                            keysAll[email64]["isDefault"] = false;
                        });
                    }
                    changedUserObj[0]["data"]["keys"][newKey["email"]] = newKey;
                    changedUserObj[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(changedUserObj[0]["data"])
                    );
                    changedUserObj[0]["nonce"] += 1;

                    var newUserObj = {};
                    newUserObj[0] = {
                        data: app.transform.prof2DbV2(
                            JSON.stringify(changedUserObj[0]["data"]),
                            app.user.get("secondPassword")
                        ),
                        hash: changedUserObj[0]["hash"],
                        index: 0,
                        nonce: changedUserObj[0]["nonce"],
                    };

                    var post = {
                        type: newKey["addrType"],
                        objectName: "userObj",
                        objectData: JSON.stringify(newUserObj),
                        email: app.transform.from64str(newKey["email"]),
                        publicKey: newKey["v2"]["publicKey"],
                    };

                    //	console.log(post);

                    //console.log('savings');
                    app.userObjects.savingObjects(
                        "userObjWnewPGP",
                        post,
                        function (result) {
                            if (result == "saved") {
                                app.user.set({
                                    DecryptedUserObject: changedUserObj,
                                });
                                app.userObjects.set({
                                    EncryptedUserObject: newUserObj,
                                });
                                app.user.set({
                                    allKeys: changedUserObj[0]["data"]["keys"],
                                });
                                //console.log('saved');
                                //console.log(userObj[0]['data']);
                                //console.log(app.user.get("DecryptedUserObject"));
                                //console.log(app.userObjects.get("EncryptedUserObject"));

                                //	app.user.set({"DecryptedProfileObject":profile});
                                //	app.userObjects.set({"EncryptedProfileObject":newProfObj});
                                app.notifications.systemMessage("saved");
                            } else if (result == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (result === "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(result);
                        }
                    );

                    //console.log(originalUserObj);
                    //console.log(changedUserObj);
                    break;

                case "editPGPkeysBits":
                    var originalUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );
                    var changedUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );

                    changedUserObj[0]["data"]["keys"] = app.user.get("allKeys");
                    changedUserObj[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(changedUserObj[0]["data"])
                    );
                    changedUserObj[0]["nonce"] += 1;

                    var newUserObj = {};
                    newUserObj[0] = {
                        data: app.transform.prof2DbV2(
                            JSON.stringify(changedUserObj[0]["data"]),
                            app.user.get("secondPassword")
                        ),
                        hash: changedUserObj[0]["hash"],
                        index: 0,
                        nonce: changedUserObj[0]["nonce"],
                    };

                    var newKey = app.user.get("newPGPKey");

                    var post = {
                        objectData: JSON.stringify(newUserObj),
                        email: app.transform.from64str(newKey["email"]),
                        publicKey: newKey["v2"]["publicKey"],
                    };

                    //	console.log(post);

                    //console.log('savings');
                    app.userObjects.savingObjects(
                        "userObjWnewPGPkeys",
                        post,
                        function (result) {
                            if (result == "saved") {
                                app.user.set({
                                    DecryptedUserObject: changedUserObj,
                                });
                                app.userObjects.set({
                                    EncryptedUserObject: newUserObj,
                                });
                                app.notifications.systemMessage("saved");
                            } else if (result == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (result === "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(result);
                        }
                    );

                    //console.log(originalUserObj);
                    //console.log(changedUserObj);
                    break;

                case "deletePGPKeys":
                    var originalUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );
                    var changedUserObj = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedUserObject")
                    );
                    changedUserObj[0]["data"]["keys"] = app.user.get("allKeys");
                    changedUserObj[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(changedUserObj[0]["data"])
                    );
                    changedUserObj[0]["nonce"] += 1;

                    var newUserObj = {};
                    newUserObj[0] = {
                        data: app.transform.prof2DbV2(
                            JSON.stringify(changedUserObj[0]["data"]),
                            app.user.get("secondPassword")
                        ),
                        hash: changedUserObj[0]["hash"],
                        index: 0,
                        nonce: changedUserObj[0]["nonce"],
                    };

                    var newKey = app.user.get("newPGPKey");

                    var post = {
                        objectName: "userObj",
                        objectData: JSON.stringify(newUserObj),
                        email: app.transform.SHA512(
                            app.transform.from64str(newKey["email"])
                        ),
                    };

                    //	console.log(post);

                    //console.log('savings');
                    app.userObjects.savingObjects(
                        "userObjWdeletePGP",
                        post,
                        function (result) {
                            if (result == "saved") {
                                app.user.set({
                                    DecryptedUserObject: changedUserObj,
                                });
                                app.userObjects.set({
                                    EncryptedUserObject: newUserObj,
                                });

                                app.notifications.systemMessage("saved");
                            } else if (result == "newerFound") {
                                app.user.set({
                                    allKeys: app.user.get(
                                        "DecryptedUserObject"
                                    )[0]["data"]["keys"],
                                });
                                app.notifications.systemMessage("newerFnd");
                            } else if (result === "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            } else if (result === "error") {
                                app.user.set({
                                    allKeys: app.user.get(
                                        "DecryptedUserObject"
                                    )[0]["data"]["keys"],
                                });
                            }

                            callback(result);
                        }
                    );

                    //console.log(originalUserObj);
                    //console.log(changedUserObj);

                    break;

                case "updateDomain":
                    console.log("updateDomain111");

                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    //profile[0]['data']['customDomains']=app.user.get("customDomains");

                    console.log(app.user.get("newDomain"));
                    profile[0]["data"]["customDomains"][app.user.get("newDomain")["id"]] = app.user.get("newDomain");

                    profile[0]["hash"] = app.transform.SHA512(JSON.stringify(profile[0]["data"]));
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };
                    var post = {
                        objectData: JSON.stringify(newProfObj),
                        domain: app.user.get("newDomain")["domain"],
                        vrfString: app.user.get("newDomain")["vrfString"],
                    };

                    //console.log(profile);
                    //console.log(app.user);
                    //console.log(newProfObj);

                    app.serverCall.ajaxRequest(
                        "updateDomain",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    app.user.set({
                                        DecryptedProfileObject: profile,
                                    });
                                    app.userObjects.set({
                                        EncryptedProfileObject: newProfObj,
                                    });

                                    app.user.set({
                                        customDomains:
                                            profile[0]["data"]["customDomains"],
                                    });
                                    app.notifications.systemMessage("saved");
                                } else if (result["data"] === "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                } else if (result["data"] === "nothingUpdt") {
                                    app.notifications.systemMessage(
                                        "nthTochng"
                                    );
                                }
                            }

                            callback(result);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "savePendingDomain":
                    console.log("savePend Domain");

                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    //profile[0]['data']['customDomains']=app.user.get("customDomains");

                    profile[0]["data"]["customDomains"][
                        app.user.get("newDomain")["id"]
                    ] = app.user.get("newDomain");

                    profile[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(profile[0]["data"])
                    );
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };
                    var post = {
                        objectData: JSON.stringify(newProfObj),
                        domain: app.user.get("newDomain")["domain"],
                        vrfString: app.user.get("newDomain")["vrfString"],
                        dkimPrivateKey:
                            app.user.get("newDomain")["dkimPrivateKey"],
                        dkimDNSRecord:
                            app.user.get("newDomain")["dkimDNSRecord"],
                    };

                    //console.log(profile);
                    //console.log(app.user);
                    //console.log(newProfObj);

                    app.serverCall.ajaxRequest(
                        "savePendingDomain",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    app.user.set({
                                        DecryptedProfileObject: profile,
                                    });
                                    app.userObjects.set({
                                        EncryptedProfileObject: newProfObj,
                                    });

                                    app.user.set({
                                        customDomains:
                                            profile[0]["data"]["customDomains"],
                                    });
                                    app.notifications.systemMessage("saved");
                                } else if (result["data"] === "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                } else if (result["data"] === "nothingUpdt") {
                                    app.notifications.systemMessage(
                                        "nthTochng"
                                    );
                                }
                            }

                            callback(result);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "deleteDomain":
                    console.log("delete Domain");

                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    //profile[0]['data']['customDomains']=app.user.get("customDomains");

                    delete profile[0]["data"]["customDomains"][
                        app.user.get("newDomain")["id"]
                    ];

                    profile[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(profile[0]["data"])
                    );
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };
                    var post = {
                        objectData: JSON.stringify(newProfObj),
                        domain: app.transform.from64str(
                            app.user.get("newDomain")["id"]
                        ),
                        //'vrfString':app.user.get('newDomain')['vrfString']
                    };

                    //console.log(profile);
                    //console.log(app.user);
                    //console.log(newProfObj);

                    app.serverCall.ajaxRequest(
                        "deleteDomain",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    app.user.set({
                                        DecryptedProfileObject: profile,
                                    });
                                    app.userObjects.set({
                                        EncryptedProfileObject: newProfObj,
                                    });

                                    app.user.set({
                                        customDomains:
                                            profile[0]["data"]["customDomains"],
                                    });

                                    app.notifications.systemMessage("saved");
                                } else if (result["data"] === "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                } else if (result["data"] === "nothingUpdt") {
                                    app.notifications.systemMessage(
                                        "nthTochng"
                                    );
                                }
                            }
                            callback(result);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "folderSettings":
                    //save folder object index 0, and check rest of objects whats is changed
                    console.log("Folder settings");

                    //save filter if changed
                    var filter = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedBlackListObject")
                    );

                    filter[0]["data"] = app.user.get("filter");
                    filter[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(filter[0]["data"])
                    );
                    filter[0]["nonce"] = parseInt(filter[0]["nonce"]) + 1;

                    var newFilterObj = {};
                    newFilterObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(filter[0]["data"])
                        ),
                        hash: filter[0]["hash"],
                        index: 0,
                        nonce: filter[0]["nonce"],
                    };

                    //console.log(app.user.get("DecryptedBlackListObject"));
                    //console.log(filter);

                    //console.log(app.userObjects.get("EncryptedFolderObject"));
                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    if (
                        filter[0]["hash"] !=
                        app.user.get("DecryptedBlackListObject")[0]["hash"]
                    ) {
                        var post = {
                            filterData: JSON.stringify(newFilterObj),
                        };
                    }
                    post["folderData"] = JSON.stringify(newFolderObj);

                    app.serverCall.ajaxRequest(
                        "folderSettings",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    if (
                                        filter[0]["hash"] !=
                                        app.user.get(
                                            "DecryptedBlackListObject"
                                        )[0]["hash"]
                                    ) {
                                        app.user.set({
                                            DecryptedBlackListObject: filter,
                                        });
                                        app.userObjects.set({
                                            EncryptedBlackListObject:
                                                newFilterObj,
                                        });
                                    }

                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );

                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    app.notifications.systemMessage("saved");
                                } else if (result["data"] === "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                } else if (result["data"] === "nothingUpdt") {
                                    app.notifications.systemMessage(
                                        "nthTochng"
                                    );
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "saveNewEmailV2":
                    console.log("New Mail V2 save");
                    // console.log(data);

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    var folders = app.user.get("DecryptedFolderObject");

                    var changedFolders = {};

                    $.each(folders, function (index, foldData) {
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                        }
                    });

                    var newFolderObj = {};

                    $.each(changedFolders, function (index, foldData) {
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);

                    post["seedEmails"] = JSON.stringify(payLoad);

                    console.log(post);

                    app.serverCall.ajaxRequest(
                        "saveNewEmailV2",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    //app.user.set({"DecryptedFolderObject":folders});
                                    app.user.assignVariablesFromFolderObject();

                                    //console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            } //else{
                            // app.notifications.systemMessage('tryAgain');
                            //}
                            callback(result);
                        }
                    );

                    break;

                case "saveNewEmailV1":
                    console.log("New Mail V1 save");
                    // console.log(data);

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    var folders = app.user.get("DecryptedFolderObject");

                    var changedFolders = {};

                    $.each(folders, function (index, foldData) {
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                        }
                    });

                    var newFolderObj = {};

                    $.each(changedFolders, function (index, foldData) {
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);

                    post["seedEmails"] = JSON.stringify(payLoad);

                    //console.log(post);

                    app.serverCall.ajaxRequest(
                        "saveNewEmailV2old",
                        post,
                        function (result) {
                            console.log(result);

                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    //app.user.set({"DecryptedFolderObject":folders});
                                    app.user.assignVariablesFromFolderObject();

                                    //console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "draftEmail":
                    //me['mail']
                    //me['meta']
                    //me['mod']
                    //console.log('DraftMail save');

                    var draft = payLoad;
                    app.globalF.encryptMessage(draft);

                    //console.log(app.user.get('draftMessageView'));
                    //console.log(app.user.get('encryptedMessageView'));

                    //save folder object index 0, and check rest of objects whats is changed

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    var folders = app.user.get("DecryptedFolderObject");

                    //console.log(app.user.get("DecryptedFolderObject"));

                    //folders[0]['data']=app.u

                    var changedFolders = {};

                    $.each(folders, function (index, foldData) {
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                        }
                    });

                    var newFolderObj = {};
                    //console.log(changedFolders);
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);
                    post["emailData"] = JSON.stringify(
                        app.user.get("encryptedMessageView")
                    );

                    //console.log(post);

                    app.serverCall.ajaxRequest(
                        "saveDraftEmail",
                        post,
                        function (result) {
                            //console.log(result);
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    //app.user.set({"DecryptedFolderObject":folders});
                                    app.user.assignVariablesFromFolderObject();

                                    //console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "deleteEmail":
                    //save folder object index 0, and check rest of objects whats is changed
                    //  console.log('update Folder');

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    //console.log(jQuery.extend(true, {}, app.userObjects.get("EncryptedFolderObject")));
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    //   console.log(app.user.get("DecryptedFolderObject"));

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        //if(index>0){
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }

                        //	}
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);
                    post["emailToDelete"] = JSON.stringify(payLoad);

                    //   console.log(payLoad);

                    app.serverCall.ajaxRequest(
                        "deleteEmail",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    // console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "folderUpdate":
                    //save folder object index 0, and check rest of objects whats is changed
                    //console.log('update Folder');

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    //console.log(jQuery.extend(true, {}, app.userObjects.get("EncryptedFolderObject")));
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    //console.log(app.user.get("DecryptedFolderObject"));

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        //if(index>0){
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }

                        //	}
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);

                    app.serverCall.ajaxRequest(
                        "folderSettings",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    //console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "labelSettings":
                    //console.log('labelSettings');

                    var encryptedObj = app.userObjects.get(
                        "EncryptedProfileObject"
                    );

                    var profile = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedProfileObject")
                    );

                    profile[0]["data"]["tags"] = app.user.get("tags");
                    profile[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(profile[0]["data"])
                    );
                    profile[0]["nonce"] = parseInt(profile[0]["nonce"]) + 1;
                    //console.log(encryptedObj);

                    var newProfObj = {};
                    newProfObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(profile[0]["data"])
                        ),
                        hash: profile[0]["hash"],
                        index: 0,
                        nonce: profile[0]["nonce"],
                    };

                    //console.log(profile);
                    //console.log(newProfObj);
                    app.userObjects.savingObjects(
                        "profile",
                        newProfObj,
                        function (response) {
                            if (response == "saved") {
                                app.user.set({
                                    DecryptedProfileObject: profile,
                                });
                                app.userObjects.set({
                                    EncryptedProfileObject: newProfObj,
                                });
                                app.notifications.systemMessage("saved");
                            } else if (response == "newerFound") {
                                app.notifications.systemMessage("newerFnd");
                            } else if (response == "nothingUpdt") {
                                app.notifications.systemMessage("nthTochng");
                            }

                            callback(response);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "saveContacts":
                    //	console.log('saveContacts');

                    var changed = app.user.get("contactsChanged");

                    if (changed) {
                        var encryptedObj = app.userObjects.get(
                            "EncryptedContactsObject"
                        );

                        var contacts = jQuery.extend(
                            true,
                            {},
                            app.user.get("DecryptedContactsObject")
                        );

                        contacts[0]["data"] = app.user.get("contacts");
                        contacts[0]["hash"] = app.transform.SHA512(
                            JSON.stringify(contacts[0]["data"])
                        );
                        contacts[0]["nonce"] =
                            parseInt(contacts[0]["nonce"]) + 1;

                        var newContactsObj = {};
                        newContactsObj[0] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(contacts[0]["data"])
                            ),
                            hash: app.transform.SHA512(
                                JSON.stringify(contacts[0]["data"])
                            ),
                            index: 0,
                            nonce: parseInt(contacts[0]["nonce"]) + 1,
                        };

                        //console.log(profile);
                        //console.log(newProfObj);
                        app.userObjects.savingObjects(
                            "contacts",
                            newContactsObj,
                            function (response) {
                                if (response == "saved") {
                                    app.user.set({
                                        DecryptedContactsObject: contacts,
                                    });
                                    app.userObjects.set({
                                        EncryptedContactsObject: newContactsObj,
                                    });
                                    app.notifications.systemMessage("saved");
                                } else if (response == "newerFound") {
                                    app.notifications.systemMessage("newerFnd");
                                } else if (response == "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }

                                app.user.set({ contactsChanged: false });

                                callback(response);
                            }
                        );
                    }

                    //app.userObjects.uptdUserObj()

                    break;

                case "saveFilter":
                    //	console.log('saveFilter');

                    var encryptedObj = app.userObjects.get(
                        "EncryptedBlackListObject"
                    );

                    var filter = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedBlackListObject")
                    );

                    filter[0]["data"] = app.user.get("filter");
                    filter[0]["hash"] = app.transform.SHA512(
                        JSON.stringify(filter[0]["data"])
                    );
                    filter[0]["nonce"] = parseInt(filter[0]["nonce"]) + 1;

                    var newFilterObj = {};
                    newFilterObj[0] = {
                        data: app.transform.toAes64(
                            app.user.get("folderKey"),
                            JSON.stringify(filter[0]["data"])
                        ),
                        hash: filter[0]["hash"],
                        index: 0,
                        nonce: filter[0]["nonce"],
                    };

                    //	console.log(newFilterObj);
                    //console.log(newProfObj);
                    app.userObjects.savingObjects(
                        "filter",
                        newFilterObj,
                        function (response) {
                            if (response == "saved") {
                                app.user.set({
                                    DecryptedBlackListObject: filter,
                                });
                                app.userObjects.set({
                                    EncryptedBlackListObject: newFilterObj,
                                });
                                //app.notifications.systemMessage('saved');
                            } else if (response == "newerFound") {
                                //app.notifications.systemMessage('newerFnd');
                            } else if (response == "nothingUpdt") {
                                //app.notifications.systemMessage('nthTochng');
                            }

                            callback(response);
                        }
                    );

                    //app.userObjects.uptdUserObj()

                    break;

                case "sendEmailClearText":
                    //save folder object index 0, and check rest of objects whats is changed
                    //console.log('Sending Clear Text Email');

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    //console.log(jQuery.extend(true, {}, app.userObjects.get("EncryptedFolderObject")));
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    //console.log(app.user.get("DecryptedFolderObject"));

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        //if(index>0){
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }

                        //	}
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);
                    post["emailData"] = JSON.stringify(payLoad);

                    app.serverCall.ajaxRequest(
                        "sendEmailClearText",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                            }
                            callback(result);

                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );

                                    //saving contact
                                    app.userObjects.updateObjects(
                                        "saveContacts",
                                        "",
                                        function (result) {}
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    //console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "sendEmailWithPin":
                    //save folder object index 0, and check rest of objects whats is changed
                    //console.log('Sending Pin Text Email');

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    //console.log(jQuery.extend(true, {}, app.userObjects.get("EncryptedFolderObject")));
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    //console.log(app.user.get("DecryptedFolderObject"));

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        //if(index>0){
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }

                        //	}
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);
                    post["emailData"] = JSON.stringify(payLoad);

                    app.serverCall.ajaxRequest(
                        "sendEmailWithPin",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                            }
                            callback(result);

                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //saving contact
                                    app.userObjects.updateObjects(
                                        "saveContacts",
                                        "",
                                        function (result) {}
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    // console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "sendEmailPGP":
                    //save folder object index 0, and check rest of objects whats is changed
                    //	console.log('Sending pGP Text Email');

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    //console.log(jQuery.extend(true, {}, app.userObjects.get("EncryptedFolderObject")));
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    //console.log(app.user.get("DecryptedFolderObject"));

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        //if(index>0){
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }

                        //	}
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);
                    post["emailData"] = JSON.stringify(payLoad);

                    app.serverCall.ajaxRequest(
                        "sendEmailPGP",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );
                                    //saving contact
                                    app.userObjects.updateObjects(
                                        "saveContacts",
                                        "",
                                        function (result) {}
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    //	 console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;

                case "sendEmailInt":
                    //save folder object index 0, and check rest of objects whats is changed
                    //    console.log('Sending Internal Email');

                    var oldEncryptedFolder = app.userObjects.get(
                        "EncryptedFolderObject"
                    );
                    //console.log(jQuery.extend(true, {}, app.userObjects.get("EncryptedFolderObject")));
                    var folders = jQuery.extend(
                        true,
                        {},
                        app.user.get("DecryptedFolderObject")
                    );

                    //console.log(app.user.get("DecryptedFolderObject"));

                    folders[0]["data"] = app.user.get("folders");
                    //folders[0]['hash']=app.transform.SHA512(JSON.stringify(folders[0]['data']));
                    //folders[0]['nonce']=parseInt(folders[0]['nonce'])+1;

                    var changedFolders = {};
                    //changedFolders[0]=folders[0];
                    $.each(folders, function (index, foldData) {
                        //if(index>0){
                        foldData["hash"] = app.transform.SHA512(
                            JSON.stringify(foldData["data"])
                        );

                        if (oldEncryptedFolder[index] == undefined) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        } else if (
                            foldData["hash"] !=
                            oldEncryptedFolder[index]["hash"]
                        ) {
                            folders[index]["hash"] = app.transform.SHA512(
                                JSON.stringify(folders[index]["data"])
                            );
                            folders[index]["nonce"] =
                                parseInt(folders[index]["nonce"]) + 1;
                            changedFolders[index] = folders[index];
                            //changedFolders.push(folders[index]);
                        }

                        //	}
                    });

                    //	console.log(changedFolders);

                    var newFolderObj = {};
                    $.each(changedFolders, function (index, foldData) {
                        //console.log(foldData);
                        newFolderObj[index] = {
                            data: app.transform.toAes64(
                                app.user.get("folderKey"),
                                JSON.stringify(foldData["data"])
                            ),
                            hash: foldData["hash"],
                            index: index,
                            nonce: foldData["nonce"],
                        };
                    });

                    var post = {};

                    post["folderData"] = JSON.stringify(newFolderObj);
                    post["emailData"] = JSON.stringify(payLoad);

                    app.serverCall.ajaxRequest(
                        "sendEmailInt",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                //todo create way to keep folderobj for all sending
                                //just update all object regardless of success, if never version present app should logout anyway
                                //later may be sync
                            }
                            callback(result);

                            if (result["response"] == "success") {
                                if (result["data"] == "saved") {
                                    $.each(
                                        newFolderObj,
                                        function (index, foldData) {
                                            oldEncryptedFolder[index] =
                                                foldData;
                                        }
                                    );

                                    //saving contact
                                    app.userObjects.updateObjects(
                                        "saveContacts",
                                        "",
                                        function (result) {}
                                    );
                                    //app.user.set({"EncryptedFolderObject":newFolderObj});

                                    //todo filter as object index is rule hash
                                    app.user.set({
                                        DecryptedFolderObject: folders,
                                    });
                                    app.user.assignVariablesFromFolderObject();

                                    //  console.log(app.user.get("DecryptedFolderObject"));
                                } else if (result["data"] === "newerFound") {
                                    //app.notifications.systemMessage('newerFnd');
                                } else if (result["data"] === "nothingUpdt") {
                                    //app.notifications.systemMessage('nthTochng');
                                }
                            }
                            callback(result);
                        }
                    );

                    break;
            }

            //if passes changed check onestep and update either server or user obj
            //this.set({"firstPassChanged": false}); //todo generate new folder key and re-encrypt all objects if single pass
            //this.set({"secondPassChanged": false}); reencrypt user object or create new folder keys
            //app.user.set({"Fac2Changed":true}); //find out of auth was added or deleted and update
            //app.user.set({"pgpKeysChanged":true}); //update what keys has been changed and update/delete -related to disposable/alias add what keys was changed too, make sure verify if it was custom domain or not

            if (app.user.get("remeberPassword") === false) {
                app.user.set({ secondPassword: "" });
            }

            //$.ajaxQueue.startNextRequest('tryAgain');
            //console.log(app.user);
        },

        savingObjects: function (objectName, objectData, callback) {
            switch (objectName) {
                case "profile":
                    var post = {
                        objectName: "profObj",
                        objectData: JSON.stringify(objectData),
                    };

                    app.serverCall.ajaxRequest(
                        "savingUserObjects",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                callback(result["data"]);
                            } else {
                                app.notifications.systemMessage("tryAgain");
                            }
                        }
                    );

                    break;
                case "userObj":
                    var post = {
                        objectName: "userObj",
                        objectData: JSON.stringify(objectData),
                    };

                    app.serverCall.ajaxRequest(
                        "savingUserObjects",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                callback(result["data"]);
                            }
                        }
                    );
                    break;

                case "userObjWnewPGP":
                    app.serverCall.ajaxRequest(
                        "savingUserObjWnewPGP",
                        objectData,
                        function (result) {
                            callback(result["data"]);
                        }
                    );
                    break;

                case "userObjWnewPGPkeys":
                    app.serverCall.ajaxRequest(
                        "savingUserObjWnewPGPkeys",
                        objectData,
                        function (result) {
                            callback(result["data"]);
                        }
                    );
                    break;

                case "userObjWdeletePGP":
                    app.serverCall.ajaxRequest(
                        "savingUserObjWdeletePGP",
                        objectData,
                        function (result) {
                            if (result["response"] == "success") {
                                callback(result["data"]);
                            } else {
                                app.notifications.systemMessage("tryAgain");
                                callback("error");
                            }
                        }
                    );
                    break;

                case "contacts":
                    var post = {
                        objectName: "contObj",
                        objectData: JSON.stringify(objectData),
                    };

                    app.serverCall.ajaxRequest(
                        "savingUserObjects",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                callback(result["data"]);
                            }
                        }
                    );

                    break;

                case "filter":
                    var post = {
                        objectName: "filterObj",
                        objectData: JSON.stringify(objectData),
                    };

                    app.serverCall.ajaxRequest(
                        "savingUserObjects",
                        post,
                        function (result) {
                            if (result["response"] == "success") {
                                callback(result["data"]);
                            }
                        }
                    );

                    break;
            }
        },

        uptdUserObj: function () {
            var userCacheId = app.user.get("cacheEmId");
            var thisModel = this;
            var keyName = "userObj_" + userCacheId;

            app.serverCall.ajaxRequest(
                "getUserObjCheckSum",
                {},
                function (result) {
                    if (result["response"] == "success") {
                        var userServerObj = result["data"];
                        //var userMemoryObj=app.userObjects.get("EncryptedUserObject");

                        thisModel.showIndexed(
                            keyName,
                            function (userIndexedObj) {
                                var servKeyLength =
                                    Object.keys(userServerObj).length;
                                //var memKeyLength=Object.keys(userMemoryObj).length;
                                var indexKeyLength =
                                    Object.keys(userIndexedObj).length;

                                if (servKeyLength >= indexKeyLength) {
                                    $.each(
                                        userServerObj,
                                        function (index, value) {
                                            //	console.log(index);
                                            //	console.log(value['nonce']);
                                        }
                                    );
                                } else {
                                }

                                //console.log(userServerObj);
                                //console.log(userMemoryObj);
                                //	console.log(userIndexedObj);

                                //	console.log(Object.keys(userServerObj).length);
                                //	console.log(Object.keys(userMemoryObj).length);
                                //	console.log(Object.keys(userIndexedObj).length);
                            }
                        );

                        /*
					 3 ifs, if index empty and indexed supported, then fetch
					 */
                    }
                }
            );
            //console.log('usrobj');
        },
        uptdProfObj: function () {
            //console.log('uptdProfObj');
        },
        uptdContObj: function () {
            //console.log('uptdContObj');
        },
        uptdFldObj: function () {
            //console.log('uptdFldObj');
        },
        uptdSpmObj: function () {
            //console.log('uptdSpmObj');
        },
        deletingAccount: function (lockEmail, callback) {
            //console.log('deleting acc');
            /*
			0) check if positive balance, if positive ask for forfeit if negative addresses can be recycled faster?
			1) delete All emails
			2) delete all aliases/dispos
			3) delete plan record
			4) delete all user objects
			 */
            //var allEmails=app.user.get('emails')['messages'];
            var parsedEmails = {};

            app.userObjects.set({
                modalText:
                    "Deleting emails and user objects. It may take few minutes",
            });
            app.userObjects.set({ modalpercentage: 50 });

            /*		if(Object.keys(allEmails).length>0){
				$.each(allEmails, function (index, value) {
					//console.log(index);
					//console.log(value);
					parsedEmails[index]=value['mK'];

				});
			}*/
            var post = {
                lockEmail: lockEmail ? 1 : 0,
                //'emails':JSON.stringify(parsedEmails)
            };

            app.serverCall.ajaxRequest("deleteUser", post, function (result) {
                console.log(result);
                //if (result['response'] == "success") {
                callback(result);
                //}
            });

            //console.log(parsedEmails);
        },
    });

    return UserLogin;
});
