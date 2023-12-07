/**
 * @desc		stores the POST state and response state of authentication for user
 */
define(["app", "ajaxQueue"], function (app, ajaxQueue) {
    var ApiCall = Backbone.Model.extend({
        initialize: function () {
            //app.serverCall
            /*
			 app.serverCall.ajaxRequest('loginUser',post,function(result){
			 },function(){});
			 */
            $.ajaxQueue.run();
            this.set("uploadProgress", 0);
            this.set("downloadProgress", 0);
        },
        restartQue: function () {
            console.log("restart");
            $.ajaxQueue.run();
        },

        //ajaxRemoveFromQueue:function(queueName,callback){
        //	$.ajaxQueue.removeFromQueue(queueName)
        //	callback();
        //},

        //todo use promise so we can abort / rewrite all callbacks
        ajaxRequest: function (callName, postData, callback) {
            postData["userToken"] = app.user.get("userLoginToken");

            switch (callName) {
                case "loginUser":
                    var url = "/loginUserV2";
                    delete postData["userToken"];
                    break;
                case "loginOut":
                    delete postData["userToken"];
                    var url = "/logoutV2";
                    break;

                case "getRawUserData":
                    var url = "/getRawUserDataV2";

                    break;
                case "updateUserData":
                    var url = "/updateUserDataV2";
                    break;

                case "getUserObjCheckSum":
                    var url = "/getUserObjCheckSumV2";
                    break;
                case "getObjByIndex":
                    var url = "/getObjByIndexV2";

                    break;
                case "updateObjects": //obsolete, new savingUserObjects
                    var url = "/updateObjectsV2";

                    break;

                case "checkEmailExist":
                    var url = "/checkEmailExistV2";

                    break;

                case "checkPass":
                    var url = "/checkIfPasswordOkV2";
                    postData["modKey"] = app.user.get("modKey");
                    break;
                case "setup2Fac":
                    var url = "/setup2FacV2";
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "retrieveCustomDomainForUser":
                    var url = "/retCustomDomainUserV2";
                    break;

                case "checkKeyUnique":
                    var url = "/checkKeyUniqueV2";
                    break;

                case "retrievePlanPricing":
                    var url = "/retrievePlanPricingV2";
                    break;

                case "createOrderBitcoin":
                    var url = "/createOrderBitcoinV2";
                    break;

                case "createOrderPayPal":
                    var url = "/createOrderPayPalV2";
                    break;

                case "calculatePrice":
                    var url = "/calculatePriceV2";
                    break;

                case "retrieveUserPlan":
                    var url = "/retrieveUserPlanV3";
                    break;

                case "savePlan":
                    var url = "/savePlanV3";
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "retrieveFoldersMeta":
                    var url = "/retrieveFoldersMetaTempV2";
                    break;

                case "retrieveMessage":
                    var url = "/retrieveMessageV2";
                    break;

                case "getTrustedSenders":
                    var url = "/getTrustedSendersV2";
                    break;

                case "getBlockedEmails":
                    var url = "/getBlockedEmailsV2";
                    break;
                case "saveBlockedEmails":
                    var url = "/saveBlockedEmailsV2";
                    break;

                case "deleteBlockedEmails":
                    var url = "/deleteBlockedEmailsV2";
                    break;

                case "deleteAllBlockedEmails":
                    var url = "/deleteAllBlockedEmailsV2";
                    break;
                case "RetrieveAdminData":
                    var url = "/AdminDataV2";
                    break;

                /*case 'getPublicKeys':
					//get public key of emails
					var url='/getPublicKeysV2';
					break;*/

                /*case 'emailsOwnerships':
					//verify if emails served by us
					var url='/emailsOwnershipsV2';
					break;*/

                case "getDraftMessageId":
                    var url = "/getDraftMessageIdV2";
                    break;

                case "savingUserObjects":
                    var url = "/savingUserObjectsV2";
                    postData["modKey"] = app.user.get("modKey");

                    break;
                case "savingUserObjWnewPGP":
                    var url = "/savingUserObjWnewPGPV3";
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "savePendingDomain":
                    var url = "/savePendingDomainV2";
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "savingUserObjWdeletePGP":
                    var url = "/savingUserObjWdeletePGPV2";
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "changePass":
                    var url = "/changePassV2";
                    postData["modKey"] = app.user.get("modKey");

                    break;
                case "changePassOneStep":
                    var url = "/changePassOneStepV2";
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "changeSecondPass":
                    var url = "/changeSecondPassV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "saveGoogleAuth":
                    var url = "/saveGoogleAuthV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "check2fac":
                    var url = "/check2facV2";
                    delete postData["userToken"];
                    break;

                case "availableDomainsForAlias":
                    var url = "/availableDomainsForAliasV3";
                    break;

                case "claimFree":
                    var url = "/claimFreeV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "deleteDomain":
                    var url = "/deleteDomainV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "folderSettings":
                    var url = "/folderSettingsV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "savingUserObjWnewPGPkeys":
                    var url = "/savingUserObjWnewPGPkeysV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "deleteUser":
                    var url = "/deleteUserV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;
                case "updateSecretToken":
                    var url = "/updateSecretTokenV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "updateDomain":
                    var url = "/updateDomainV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "saveDraftEmail":
                    var url = "/saveDraftEmailV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");

                    break;

                case "retrievePublicKeys":
                    var url = "/retrievePublicKeysV2";
                    //	console.log('savings5');
                    //postData['modKey']=app.user.get('modKey');
                    break;

                case "sendEmailClearText":
                    var url = "/sendEmailClearTextV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "sendEmailWithPin":
                    var url = "/sendEmailWithPinV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "sendEmailPGP":
                    var url = "/sendEmailPGPV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "sendEmailInt":
                    var url = "/sendEmailIntV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "saveNewAttachment":
                    var url = "/saveNewAttachmentV2";
                    //	console.log('savings5');
                    //var anchor=postData['modKey'];
                    //postData['modKey']=app.user.get('modKey');
                    break;

                case "removeFileFromDraft":
                    var url = "/removeFileFromDraftV2";
                    //	console.log('savings5');
                    //var anchor=postData['modKey'];
                    //postData['modKey']=app.user.get('modKey');
                    break;

                case "downloadFile":
                    var url = "/downloadFileV2";
                    //	console.log('savings5');
                    //var anchor=postData['modKey'];
                    //postData['modKey']=app.user.get('modKey');

                    break;

                case "downloadFileUnreg":
                    var url = "/downloadFileUnregV2";
                    //	console.log('savings5');
                    //var anchor=postData['modKey'];
                    //postData['modKey']=app.user.get('modKey');
                    delete postData["userToken"];
                    break;

                case "getNewSeeds":
                    //fetching seeds for new emails v1/2
                    var url = "/getNewSeedsV2";
                    break;

                case "getNewMeta":
                    //fetching meta for new emails v1
                    var url = "/getNewMetaV2";
                    break;

                case "saveNewEmailV2old":
                    var url = "/saveNewEmailOldV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "saveNewEmailV2":
                    var url = "/saveNewEmailV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "deleteEmail":
                    var url = "/deleteEmailV2";
                    //	console.log('savings5');
                    postData["modKey"] = app.user.get("modKey");
                    break;

                case "deleteEmailUnreg":
                    var url = "/deleteEmailUnregV2";
                    delete postData["userToken"];
                    break;

                case "retrieveUnregEmailV2":
                    var url = "/retrieveUnregEmailV2";
                    delete postData["userToken"];

                    break;

                case "RetrieveCoupData":
                    var url = "/RetrieveCoupDataV2";

                    break;

                case "retrievePublicKeyUnreg":
                    var url = "/retrievePublicKeyUnregV2";
                    delete postData["userToken"];

                    break;

                case "sendEmailUnreg":
                    var url = "/sendEmailUnregV2";
                    delete postData["userToken"];

                    break;

                case "CheckStatusV2":
                    var url = "/CheckStatusV2";
                    delete postData["userToken"];

                    break;
            }

            $.ajaxQueue.addRequest({
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    //	xhr['testVariable']=anchor;
                    //console.log()
                    xhr.upload.addEventListener(
                        "progress",
                        function (evt) {
                            //show total file size
                            //console.log(evt.loaded);

                            if (evt.lengthComputable) {
                                app.serverCall.set({ totalSize: evt.total });
                            }
                        },
                        false
                    );

                    xhr.addEventListener(
                        "progress",
                        function (evt) {
                            //show actual size uploaded
                            //	console.log(evt.loaded);

                            //if(anchor!=undefined && app.user.get('cancelUpload')==anchor){
                            //console.log('aborting: '+anchor);
                            //	xhr.abort();
                            //}

                            var percentComplete =
                                evt.loaded / app.serverCall.get("totalSize");
                            if (evt.loaded > app.serverCall.get("totalSize")) {
                                app.serverCall.set({ uploadProgress: 0 });
                            } else {
                                app.serverCall.set({
                                    uploadProgress: Math.round(
                                        percentComplete * 106.38
                                    ),
                                });
                            }
                        },
                        false
                    );

                    //xhr.withCredentials = true;

                    //console.log(xhr);

                    return xhr;
                },

                type: "POST",
                url: app.defaults.get("apidomain") + url,
                data: postData,
                xhrFields: {
                    withCredentials: true,
                },
                success: function (data, textStatus) {
                    //console.log(document.referrer);
                    //console.log(textStatus);
                    app.user.set({
                        onlineStatus: "online",
                    });

                    //console.log(data['response']);

                    if (data["response"] == "success") {
                    } else if (data["response"] == "fail") {
                        if (data["data"] == "limitIsReached") {
                            app.notifications.systemMessage("limitIsReached");
                        } else {
                            if (data["data"] == "pastDue") {
                                app.notifications.systemMessage("pastDue");
                            }
                            if (data["data"] == "tryAgain") {
                                app.notifications.systemMessage("tryAgain");
                            }
                            if (data["data"] == "upgradePlan") {
                                app.notifications.systemMessage("upgradePlan");
                            }
                            if (data["data"] == "failedToChangePlan") {
                                app.notifications.systemMessage("failedToChangePlan");
                            }
                            //if(data['data']=='email2often'){
                            //	app.notifications.systemMessage('email2often');
                            //}
                        }

                        //app.notifications.systemMessage('wrngUsrOrPass');
                    } else {
                        $.each(data, function (index, value) {
                            $.each(value, function (index1, value1) {
                                if (value1 === "incToken") {
                                    app.restartApp();
                                }
                                app.notifications.systemMessage(value1);
                            });
                        });
                    }
                    callback(data);
                },
                error: function (data, textStatus) {
                    console.log(data);
                    console.log(textStatus);

                    // The following isn't getting the text instead HTML, so we moved app.restartApp() out of the condition as Auto logout wasn't getting detected.
                    if (data["responseText"] === "Login Required") {
                        app.restartApp();
                    }

                    var res = { response: "offline" };
                    callback(res);
                    app.notifications.systemMessage("tryAgain");
                    app.user.set({
                        onlineStatus: "offline",
                    });
                },

                dataType: "json",
            });
        },
    });

    return ApiCall;
});
