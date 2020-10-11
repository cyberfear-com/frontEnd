/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app","ajaxQueue"
], function(app,ajaxQueue){

	var ApiCall = Backbone.Model.extend({

		initialize: function(){
			//app.serverCall
			/*
			 app.serverCall.ajaxRequest('loginUser',post,function(result){
			 },function(){});
			 */
			$.ajaxQueue.run();
			this.set("uploadProgress", 0);
			this.set("downloadProgress", 0);

		},
		restartQue:function(){
			console.log('restart')
			$.ajaxQueue.run();
		},

		//ajaxRemoveFromQueue:function(queueName,callback){
		//	$.ajaxQueue.removeFromQueue(queueName)
		//	callback();
		//},

        //todo use promise so we can abort / rewrite all callbacks
		ajaxRequest: function(callName,postData,callback) {
			postData['userToken']=app.user.get("userLoginToken");

			switch(callName) {

				case 'loginUser':
					var url='/loginUserV2';
					delete postData['userToken']
					break;
				case 'loginOut':
					delete postData['userToken']
					var url='/logoutV2';
					break;

				case 'getRawUserData':
					var url='/getRawUserDataV2';

					break;
				case 'updateUserData':
					var url='/updateUserDataV2';
					break;

				case 'getUserObjCheckSum':
					var url='/getUserObjCheckSumV2';
					break;
				case 'getObjByIndex':
					var url='/getObjByIndexV2';


					break;
				case 'updateObjects': //obsolete, new savingUserObjects
					var url='/updateObjectsV2';

					break;

				case 'checkEmailExist':
					var url='/checkEmailExistV2';

					break;

				case 'checkPass':
					var url='/checkIfPasswordOkV2';
                    postData['modKey']=app.user.get('modKey');
					break;
				case 'setup2Fac':
					var url='/setup2FacV2';
                    postData['modKey']=app.user.get('modKey');
					break;

				case 'retrieveCustomDomainForUser':
					var url='/retCustomDomainUserV2';
					break;

				case 'checkKeyUnique':
					var url='/checkKeyUniqueV2';
					break;

				case 'retrievePlanPricing':
					var url='/retrievePlanPricingV2';
					break;

				case 'createOrderBitcoin':
					var url='/createOrderBitcoinV2';
					break;

				case 'createOrderPayPal':
					var url='/createOrderPayPalV2';
					break;


				case 'calculatePrice':
					var url='/calculatePriceV2';
					break;

				case 'retrieveUserPlan':
					var url='/retrieveUserPlanV2';
					break;

				case 'savePlan':
					var url='/savePlanV2';
                    postData['modKey']=app.user.get('modKey');
					break;

				case 'retrieveFoldersMeta':
					var url='/retrieveFoldersMetaTempV2';
					break;

				case 'retrieveMessage':
					var url='/retrieveMessageV2';
					break;

				case 'getTrustedSenders':
					var url='/getTrustedSendersV2';
					break;

                case 'getBlockedEmails':
                    var url='/getBlockedEmailsV2';
                    break;
                case 'saveBlockedEmails':
                    var url='/saveBlockedEmailsV2';
                    break;

                case 'deleteBlockedEmails':
                    var url='/deleteBlockedEmailsV2';
                    break;

                case 'deleteAllBlockedEmails':
                    var url='/deleteAllBlockedEmailsV2';
                    break;





				/*case 'getPublicKeys':
					//get public key of emails
					var url='/getPublicKeysV2';
					break;*/

				/*case 'emailsOwnerships':
					//verify if emails served by us
					var url='/emailsOwnershipsV2';
					break;*/

				case 'getDraftMessageId':

					var url='/getDraftMessageIdV2';
					break;

				case 'savingUserObjects':

					var url='/savingUserObjectsV2';
					postData['modKey']=app.user.get('modKey');

					break;
				case 'savingUserObjWnewPGP':

					var url='/savingUserObjWnewPGPV2';
					postData['modKey']=app.user.get('modKey');

					break;

				case 'savePendingDomain':
					var url='/savePendingDomainV2';
					postData['modKey']=app.user.get('modKey');
					break;

				case 'savingUserObjWdeletePGP':

					var url='/savingUserObjWdeletePGPV2';
					postData['modKey']=app.user.get('modKey');

					break;




				case 'changePass':

					var url='/changePassV2';
					postData['modKey']=app.user.get('modKey');

					break;
                case 'changePassOneStep':

                    var url='/changePassOneStepV2';
                    postData['modKey']=app.user.get('modKey');

                    break;



				case 'changeSecondPass':

					var url='/changeSecondPassV2';
				//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;

				case 'saveGoogleAuth':

					var url='/saveGoogleAuthV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;

				case 'check2fac':

					var url='/check2facV2';
					delete postData['userToken']
					break;

				case 'availableDomainsForAlias':

					var url='/availableDomainsForAliasV2';
					break;


                case 'claimFree':

                    var url='/claimFreeV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');
                    break;


				case 'deleteDomain':

					var url='/deleteDomainV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;

				case 'folderSettings':

					var url='/folderSettingsV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;

				case 'savingUserObjWnewPGPkeys':

					var url='/savingUserObjWnewPGPkeysV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;

				case 'deleteUser':

					var url='/deleteUserV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;
                case 'updateSecretToken':

                    var url='/updateSecretTokenV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');

                    break;


                case 'updateDomain':

                    var url='/updateDomainV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');

                    break;




				case 'saveDraftEmail':

					var url='/saveDraftEmailV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');

					break;

				case 'retrievePublicKeys':

					var url='/retrievePublicKeysV2';
					//	console.log('savings5');
					//postData['modKey']=app.user.get('modKey');
					break;

				case 'sendEmailClearText':

					var url='/sendEmailClearTextV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');
					break;

				case 'sendEmailWithPin':

					var url='/sendEmailWithPinV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');
					break;

				case 'sendEmailPGP':

					var url='/sendEmailPGPV2';
					//	console.log('savings5');
					postData['modKey']=app.user.get('modKey');
					break;

                case 'sendEmailInt':

                    var url='/sendEmailIntV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');
                    break;




				case 'saveNewAttachment':

					var url='/saveNewAttachmentV2';
					//	console.log('savings5');
					//var anchor=postData['modKey'];
					//postData['modKey']=app.user.get('modKey');
					break;

				case 'removeFileFromDraft':

					var url='/removeFileFromDraftV2';
					//	console.log('savings5');
					//var anchor=postData['modKey'];
					//postData['modKey']=app.user.get('modKey');
					break;


				case 'downloadFile':

					var url='/downloadFileV2';
					//	console.log('savings5');
					//var anchor=postData['modKey'];
					//postData['modKey']=app.user.get('modKey');

					break;

                case 'downloadFileUnreg':

                    var url='/downloadFileUnregV2';
                    //	console.log('savings5');
                    //var anchor=postData['modKey'];
                    //postData['modKey']=app.user.get('modKey');
                    delete postData['userToken'];
                    break;




                case 'getNewSeeds':
                    //fetching seeds for new emails v1/2
                    var url='/getNewSeedsV2';
                    break;

                case 'getNewMeta':
                    //fetching meta for new emails v1
                    var url='/getNewMetaV2';
                    break;

                case 'saveNewEmailV2old':

                    var url='/saveNewEmailOldV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');
                    break;

                case 'saveNewEmailV2':

                    var url='/saveNewEmailV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');
                    break;

                case 'deleteEmail':

                    var url='/deleteEmailV2';
                    //	console.log('savings5');
                    postData['modKey']=app.user.get('modKey');
                    break;


                case 'deleteEmailUnreg':

                    var url='/deleteEmailUnregV2';
                    delete postData['userToken'];
                    break;

                case 'retrieveUnregEmailV2':

                    var url='/retrieveUnregEmailV2';
                    delete postData['userToken'];

                    break;
                case 'retrievePublicKeyUnreg':

                    var url='/retrievePublicKeyUnregV2';
                    delete postData['userToken'];

                    break;

                case 'sendEmailUnreg':

                    var url='/sendEmailUnregV2';
                    delete postData['userToken'];

                    break;

                case 'CheckStatusV2':

                    var url='/CheckStatusV2';
                    delete postData['userToken'];

                    break;






			}

			if(!app.defaults.get('dev')){

				$.ajaxQueue.addRequest({
					xhr: function () {
						var xhr = new window.XMLHttpRequest();
						xhr.withCredentials = true;
						//	xhr['testVariable']=anchor;
						//console.log()
						xhr.upload.addEventListener("progress", function(evt) {
							//show total file size
							//console.log(evt.loaded);

							if (evt.lengthComputable) {
								app.serverCall.set({"totalSize":evt.total});
							}
						}, false);

						xhr.addEventListener("progress", function(evt) {
							//show actual size uploaded
							//	console.log(evt.loaded);

							//if(anchor!=undefined && app.user.get('cancelUpload')==anchor){
							//console.log('aborting: '+anchor);
							//	xhr.abort();
							//}


							var percentComplete = evt.loaded / app.serverCall.get("totalSize");
							if(evt.loaded>app.serverCall.get("totalSize")){
								app.serverCall.set({"uploadProgress":0});
							}else{
								app.serverCall.set({"uploadProgress":Math.round(percentComplete * 106.38)});
							}

						}, false);

						//xhr.withCredentials = true;

						//console.log(xhr);

						return xhr;
					},

					type: "POST",
					url: app.defaults.get('apidomain')+url,
					data:postData ,
					success: function (data, textStatus) {

						//console.log(document.referrer);
						//console.log(textStatus);
						app.user.set({
							'onlineStatus':'online'
						});

						if (data['response']=='success'){

						}else if (data['response']=='fail'){

							if(data['data']=="limitIsReached"){
								app.notifications.systemMessage('limitIsReached');
							}else{
								if(data['data']=="pastDue"){
									app.notifications.systemMessage('pastDue');
								}
							}

							//app.notifications.systemMessage('wrngUsrOrPass');
						}else
						{
							$.each(data, function (index, value) {
								$.each(value, function (index1, value1) {

									if(value1==="incToken"){
										app.restartApp();
									}
									app.notifications.systemMessage(value1);
								});
							});
						}
						callback(data);
					},
					error: function (data, textStatus) {
						console.log(data['responseText']);

						if(data['responseText']==="Login Required"){
							app.restartApp();
						}

						var res={'response':"offline"};
						callback(res);
						app.notifications.systemMessage('tryAgain');
						app.user.set({
							'onlineStatus':'offline'
						});
					},

					dataType: 'json'
				});
			}else{

				var data="";
				switch(callName) {

					case 'loginUser':
						data={"response":"success","data":{"status":"welcome","userId":"5ea749187f8b9a260d8b4c83","firstTime":false,"userObjectVersion":2,"salt":"73b2c8864c12bea062aadd4418a8f762bb47b63c49a1480c8b1d1350890704bed0656ed5dd12e408210f6f32d6df46900bb4c8e1587dca1a52db7e4b5b713615d25375f75a8a0154a37b3b48b5e935e8f0462ca994b99871b85c41c76a3e44fda83dba34e2a164d4635815b9075d545c538cc5547b06d88de2f3318a5ea52433c60315d7f07f7271be1eb379fe2cbc93522792e70c125fa5dfefc8ce8375709cb5fb77de909e4f1ae612c103c7bb47a923be5a3e904077fd71511a722ef29cc2e73daf56e11fb5e07135981b0ea2dc1e68a6b77e0921dbb2cd6d3278228cbe9a9d705311189c0821afadbb094464b3f4d757d38fd689e0e34d0f73afdb9b2f68","token":"e28ceb9722ed13487a9ee7c9526b7eed7aa22b4904f734d0defc8e1b85c0aca9","oneStep":true}};
						break;
					case 'loginOut':
						delete postData['userToken']
						var url='/logoutV2';
						break;

					case 'getRawUserData':
						var url='/getRawUserDataV2';

						break;
					case 'updateUserData':
						var url='/updateUserDataV2';
						break;

					case 'getUserObjCheckSum':
					if(postData['obj']=="userObj")
						data={"response":"success","data":[{"hash":"32c83f198409e51d11a731b42a89046369281ccdbbce171ea9799ee01bd837dca0b67d734a0d04a1833ae3edd3670d0025a661217167b9e88aca66e8c5cb2265","index":0,"nonce":7}]};

					if(postData['obj']=="profObj")
							data={"response":"success","data":[{"hash":"fd8af4f281dbf9f0cd05dbe24fb53d3aa779b25013befaed304fa8d8db252787bcc79f902b9b05434004b7404657c47b3c60d4edbafb670988475f3654111814","index":0,"nonce":6}]};

					if(postData['obj']=="contObj")
							data={"response":"success","data":[{"hash":"27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd","nonce":1,"index":0}]};

					if(postData['obj']=="foldObj")
							data={"response":"success","data":[{"nonce":1,"index":0,"hash":"3e382620a8b5591ec77f99bd0328c15181609fc032379a37b2d04a64080c6280070be50c7e8957f4bfb68d762e961907f84081aa967eaecd859b17afd8a4631a"},{"nonce":1,"index":1,"hash":"27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd"}]};

					if(postData['obj']=="spamObj")
							data={"response":"success","data":[{"hash":"27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd","nonce":1,"index":0}]};
						break;


					case 'getObjByIndex':

						if(postData['obj']=="spamObj" && postData['objIndex']==0)
							data={"response":"success","data":{"data":"RrSbuN4T8ZpEZGHWgBUBkA==;bin049vzywlvVqddQQfAnQ==","hash":"27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd","nonce":1,"index":0}};

						if(postData['obj']=="foldObj" && postData['objIndex']==1)
							data={"response":"success","data":{"data":"bGTZxK4b2fbkmC+kbrgUDg==;jTC650ClY7L4ojsDMOpBEeLR4n8KKoAcgla97oKtsI7hE36iSbgAmJbGr4Vpx+mzXlvbvpneN5xg5u5Sab63BDZgi7mu5tTb1hrETjELb8fFi6A5cQxVCB2mZW7dCTD0cc9QGjMtKbAfwswxKgJQ8zf2u3XaF0OUU+kO4iE8e5chXPDRLWQVARP8P9hNl8GzVOZUXmcyncpQSvqWBj0bZIWVgsV9ZWAcWaFj89ecFGVjQmHYGdwwD1jD4La1NBwHKywXSEEV2NhAutjla\/DK5uX8R4OUiWqC+IlVfJwY7gDYOI8rdCNcXuOdT9IlXAXNfRiGrLgpGq3fxea2knAP8JbOxct2a7zEWP+yksZMe+Zh6EtQZw46uTgifpQqZ3wGl7R01hnC5AWHbiph6McEDAIvBLZSuqf08Tb4NHbcdC7UXDM4S2DGBJOybq+fmXCPlcONqAmsmWmEs\/orrRPNp0b5yEtoyp7gerVP+9R0eE7XadHRVQdyAUrr75d1fehMyFQibyb4gJj3MRmw7Csz6OwD8MOgA4gGC2eLDCWh4UU=","index":1,"hash":"79b5e7267542b008be27ad4ef21440f50e82e300b028fddba4fc71dada849df5e0286b48b4d72b04c9f41c603e7a88c7647500bf986b2a300e57f9b125347961","nonce":7}};

						if(postData['obj']=="foldObj" && postData['objIndex']==0)
							data={"response":"success","data":{"data":"Monr6oZVGzHzLA7V8lnFpw==;O5n0ufzPc1pjnKpWPzH73VXltbomC6EIyZPnpmBit2qLkj2akuZ03heKxO4FV+PAooyfTj5Z0Ale0Pn5oNlSU0OTAkdkt1SKEH5VhkTs7VIWI35PIdTsfr9kxIXcb4i8VjLX1YGJlKy+DxsbzG3ArpzZ0+hh2bDqZUzE3xyHCbagW5\/2WhVZm8pECGEGOE+SHZXATzTWgENZp+sChnShWUtc3eWjh0TgFm2ohjPEYjjrCUKa9RvNIpJjpkD\/Ld4iWN23mymjksXhW8Q+hCm7pPFy4gW6tQJl3bTBrPnA6NYYWmylDveRIMqf01+ncbAT7Osmt2XdYQq8TAQqY8LT5wdOZ0NzIbAwtjHIP9NHpMoJbEnyqgMuQSjbP7XUGf4eErc21zk9p\/ull5OjG1PO6TAnFYpmQrS1hsN95kfbO1N6KCrrD+I0V95hOaKcsirUnv4DJLlRTA00ER+599dhy2YDgWJxL5n6iYDBYvufFvztl8hbknAVYIiDER22mO+\/ZPtzXCxoMOYwiVKGCpMcL2T+s6LZ9sFUP94TX6wiesKdYaokXQSOUrJnWZE6Og1y","nonce":1,"index":0,"hash":"3e382620a8b5591ec77f99bd0328c15181609fc032379a37b2d04a64080c6280070be50c7e8957f4bfb68d762e961907f84081aa967eaecd859b17afd8a4631a"}};
						if(postData['obj']=="contObj" && postData['objIndex']==0)
							data={"response":"success","data":{"data":"c1PXeLgp6lNQT6F86oJGpw==;Xbh6rrWAJ6hv0S6WIvnx8g==","hash":"27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd","nonce":1,"index":0}};
						if(postData['obj']=="profObj" && postData['objIndex']==0)
							data={"response":"success","data":{"data":"eT9MSjusx6OMC8QMc+DZWQ==;tt2jhclpP6ChilGhIQwW2MYedcsgQvu33zRmajFqJ36DXD7TeALCbC\/JEXbaP0SZgjBTbfyREHtILe6oEOj8nNUiZ+Lt+8I132hV9RnhlWHbojx3FjZiryMryxNX7oaoRhKIGJSBPK734MxBgVYx4aokIgcj\/JjWh387M9QdcDVzZ2LJwTiDmQsndxlHEx9Gg+kY5KEen71sqlpcT\/1GskDDdI35fWVZvQmL61+aOkcWsx9m7RwfrbpdrIp3rv3CeDEK8qON8lxl\/FkcMuPSvnKvsn9FiOp5n4qRw3dp\/mBTtLiolucU4ZVi18Cfgp3PFhk2brGfLXD+SKRQoLXiLOPnqBbB4GklybcVrVsfW1vhgdAbHien7OW3jR8Sm4fU1TCS9h+I1l6Cs\/itVXEh2nvVBDpzFCIdZfwVH2J1N3SUF6PLMj4Zs3aej6Fz51cuSkIuqava+eomjU+qdaCYlsJ+P03NAGu6HpJx1ZYvUb\/0XIoEiN6TCn5hrqcIUXZvJXxsgkyxmCrg28L9\/dErPRNipto4br5IHx2xOcFIjB1PMnyd5+CwitFgTml1zyMf77Et8PUn5C2pIKQLschHspaDeqOfp7cyKA0k6kc9Yv78hX2xTewHpsK\/QBlJYnERDwdDXQuhfgYdW6wvczg2ZsE3gwE5ASYgsAgekSwZ2vU=","hash":"fd8af4f281dbf9f0cd05dbe24fb53d3aa779b25013befaed304fa8d8db252787bcc79f902b9b05434004b7404657c47b3c60d4edbafb670988475f3654111814","index":0,"nonce":6}};

						if(postData['obj']=="userObj" && postData['objIndex']==0)
							data={"response":"success","data":{"data":"d861871a3e428e41b171e2ae1823e12e;8d5g9tJDeCUveUgnhSHuh07zFDjyTqMJQwPN0xh2lk3h05YOUTdB3I0bbq+LmeCuJNZqt0PKxuKm4a5Iu1gOb0TZB1VL8N\/ga09fuzX8icJQs+VIwOtHxE8gjh8US7xe8rsqXspNVHMDRQHN19p9YfZqUS5vD8UM\/s57P0j1XcQ+9sD5SuCEKW73c6LtwGP+hwlT\/iDI4H1oJhT8oWss2vlBIWnWsl601ZGVnQkuCETmsG69VhHq+NuNLxi7F9RLdtPcSKjiPQ8cfUhdJO2IqqHIquzQGGur25GcWU4\/1rCORwxltWr5keJ0ZV12CLSsU+ryXCoqznk6LVPlnHwbyCPbshZwX\/hZcc1\/7aIix0GlqK\/w6KOgsXSE43kyMxJ2GEsPUyVslzrpRX5b5KV+1fz0cC\/LMpTKLoJ5V\/uaro2ZoP0IwF5ThRH1IJdy0HQBbHQ\/Wt6fpt+H+lwHpOgB55F1DElxmFnBGOvEqmFHi4p\/58yEWSjDJiHwUs0JdBFyElb\/GvpitEJKLP40xyEQOGPtsH19\/XdRX5GiEgYv\/AqXlc+l175I74gyfCnhTHdfOFDIU6Pk94dFvYunylWFwlkwR2\/zwSukX2LLZptMWwj9KWkJwzCx2Qh1wRcQuTP++DgLNzSWfjp4WIbkEOIvC0FYm4QvlaeXCsizjl5rqdyw4wXutU2rchOTBzTi5FCp8OaZldEWJzvt6325yyIEpG0U+jpqrb4TfIqDoSkLRun7OELghoxJaqx4UPwLErozoFEtqi7jiasAocu7HKkduidJHvkQ5vvXL9pNeBDPeBFEpWGYdKjpFgBO3rHnfgf0b68UaRbruh4KyIq1opS2QMl1JYVdqGPVNOktOGM2UG9+YYNCq\/1OUZyshphBgAl9NAbtsCKl4ESNlAWBTC3C3n5sMQeZ3CiTPToyVvL0Kt3FMIpUI9T2gHPITog+glGHD1TOX1ZYQ\/0kTbXY1UHQq+07pEdb0jPfK6AOFeHb4bQxLWbPbmXeJDuc8raJlJAVVlEsdxN7U3bicF+jgzITBoIeO4TL52KKr\/zznT2NQ4KnPlKSJm78dyqHY0V7cMKZDHvzpbw\/mtO1GFPPCkR\/u87W\/ji99HMD6IwqnAhYMCbe96m9\/TnUveRrD62wATI+50RnQHF5k6B3cC3P\/8xtDt4mw2CwqsBTM6L5y9p1GaqNp2Ysng3iU0Q22w4ocYDQBuerBEeSFLlCAHzM3iCJKuIAgsDA299DPhKNwa1oBr1EQzcRayvXqB9giwwMJkMjV2EWNBgyTy3+rFy8vNnyOPCpUaMki8OnjAvCw\/kSZRrMK0enYl4pXkZq+jkOf+alB9jl2neBIoX5mcxh3o3ciCJSQKj5CzzgDAUyDRjIuNku4Z0TPK8NTj2f0ivHJ8XwTs5M+zv\/ACFQqlTIyscrXSWvULC\/qK\/mYn6dB7cSUePhf69mp1I7qfeV4ylR5bdq3KPSit7bBo2XauRg\/KU5cp9CHRLPamJKqzKZZzHTNIkHVZOODg442XXmPqvjIi27ZrEQljKoNUqaePMEPra9pFwHIUxmr68k0khMkRF+J8Q4FJ99669m901jisuOhb9a+CNAAYnvenVH2ae6fbENKDvrKWtIphPB5ntP49zoptIxVb4V8ogE0leSdR4PkNOVBi+f6STE+qnqEk8LkCWOmGt73Aq1GphV+JC1AG0HOqQiHIdijOHDngZWQGUzgEEPcONLfCFILJ5HvGuyJEKovixJOdudD25lcwEay8bi973PRb6RymDjK\/E\/HBJzHso9sPgQOo34mHFuswHNwAEVqrWXcoFg1Ve+40Tg84iWG\/fW57K4BDcFxXdiLWd56HOkIWLDFcE7y3i8QgzHne4nEn9C8WD0IugKPMe02DxChJfI2SYA9kDY5Apx0u1xLp4Ho1jQLhdgIzErDFg8hK62vmtBdmoqxqJKQSdHXgVMwKug0oBfrqj\/0X2A60HWoU7YnKidOLEuGtG4MSscN+sD8JfQShw8UBAAlEwwyVdKGPdVKxhno3ZPaQr6CkGf6SzxPEwk\/mAN0PXVbAjMlxT4RhugHo8wQaIOLP9LGcQiv1XAu\/VtiwgNUjHRmPJrFXKmgkAVhF6QLUZcBY3BJmroTcb2fp63prPJYabzC1hW8pmG3KJWBFK7IzzZJAbu0tJEe5sFssu\/OuOrcNvFQEIVlKp1RvW6aXRxuNVu\/S7YDVRUN\/qPGl+db0uqjpbCWJp8lXALSxBztyrDdYEa1vV8N3HFujy7Ns34eMA1a0ab41ZwatAnXkmFiSJL9E0p\/IL9Zb4ryLvWQNmPSD2ijCt3HbliozRt90kU6c3GLYA\/JhHOF7bmfPAlA5M2ydIWL9Ui696Mot9v8DeSAKzU5x9PFteHh7g8StOlOrUiWB2QGmFwvtkJYRdk\/tK9iX4tIGWBE3FspSEFUlj8A5BzO3EbogYTA0UQ40f22XC+B0hcMNjG0ayowZVUKya2JTLQhJYsG+AZGt4M7rghH5N\/cAb2t+YprffouBOPPG1WqNjFk0R\/TrjDD3FvbdHNCp0qDGg\/amGnv45zk9O9v4OKw\/9S\/3s1\/df8SULS7YxMspOoEmGUMpZhot8Yae2na7CbX07BnfwM00lCTVp9dDscrrjJLbNLRGqEP69R6SotEYYDVpPTKqGq0ynVD69vibzvHVBeDJiXzBtEW1gVBqqykyy65NwKzHf0lv+Ew2miGB6GraKDKjylqxKBpZZVSWALHo3rF8Hrj7DaCIviJzhJU97Jk0iV4zjl7pCdxSJrYv+a3WD0pEfhDMy+MIjvmLUxlob0kgmIIEod\/vPrK90xbA9E4C4Nf70EPX00kZxVSm1+vyUYhOMZIzG7PxO350UFLl6WigXs2zW0Y7kk1qFKfqiagTetXumLxKQDDsVUT9H7v9G3wFR9+jNDO2\/SPeUwIhRRSkO2\/uqgXd2tXECgma9BDQRcFKNuzuiCyip\/2vYGWw5tsESp1Z0\/U93RQRVnpru+zmfXrTtOoBjqOEvRq1v6nA8yaN\/LDoEDlUekME3HQA\/ONxsMJyyK0DSX26jswDvO\/\/W0I2TkbV7nhwGu9A5BK6QiIuJznp0nK8PVcTQTEQRMz0Ue7P0ptfuOiTy0rfd4DSI2d1tyk0BBZKhW0stOjUJS1+KdVt\/o3RA7UZ7IPl4vfgjiRqMD8OL\/t3dhlrWG1FCvD5n\/XqwUOR2ji9T5ihvwUjV8\/fX7J\/0+PyIhF1T9bhVy6sSY\/9xDsoI2bMfD5KOM3B5tUCOzikLpwmweyE42cobOefjrTSNLv\/+r7K0NDEaM25QmDZ8aOwSQarDywTDQ6PQpkGzaM5LnmbdE\/aqlfQXEr6GB4zBNsK\/+JC3BaCvTH8Tksna7qCtRzf4XAMI1o4NAdkXEf5KHMYOADT8GFG43PoXHnd94AVJqEmfpzxqzCS9g9N37iwmn88bV\/4j7LIpPu2kl4Unz4XlSLcTGuKRV68yWkLz63+I6TBMzzCLc20Lkiy61RxiQKFvPNbKxHeL78CDWescl83UZ0HyKug97oVIGnQqYMy46DC7kSlL0A3fpZcsMtdWE6ucLUFLIaIWTQZwP7hp8yic3xmg86TNrindU0ifhCIsFEYt\/3ZquKvXgu6gg98GSZnek9ngQzBmSHNS6TVFLgc6RLUETye+He8ExOxZKFI+2wwe\/7ozBzsoFgP48TT0pYENcbfVcJMfpiUUEpfflikcaTw4ejDiSlVmK+40dzDoorDxJ5UdmH+dTX5qJT0ZJnShwVNKKbOZn\/ya6Z2Ekkj2j3XiJES1oFUJ8XaiZySj\/MwrlE7J4ci5vYJOekwnYydUoLUu+bP\/R16MUJ7lpFj9\/u5RoafR6QWCyq\/llBF0PFtE4L7YIrbsR7vH3gxicoQZFsi\/bwxCZ51rjt7lRdbqhDx8YrS912PmqS5t0onpOWsUkx8bj9pwXp5EZkOZyP0tYK1+iWRyO7pv8QjoolhsWMo3RmvGO\/xFhKpOaSVSQ9dIVn8u0XDYOZ19FU1zTw7zqNCCrmvEFuis2Zvkx9GMpvSlJ4nkA1Yswthcj5nkpc24ILxZvn3+hvIskwy6n\/K\/+jLkYJ1ZQ+wF3xJVbtQhpZVZXLAYwJRfDXkNVpGT9y0cGFVxBv4lvBTBTc88bJxNXQXR4E3zgfJKg2\/kjandP7yQmLIc+9jq8iG5\/U1H9Rsd5R0hWwPk5zwo0pFVhUvCNsO+fZMyHpT2yPmKpbNdKKU3QZoDsLI402M8QvxP6tXMlUflp7yZF3CqYLkMcQhTlB3UuNZqVaJFRMJB6NnQED0blJsSVejx4so2l13ZCR9gDGw0m7yD1ajyCht9WuoSb5MDO4HLKYR6lyiCFTi\/02CXPU5v1J\/cwMKupV\/GLdROh3pylAorbtiejwDG6ES3GnmqR1KPEr3I9DrIpe4lfbEYdWBrOTTP4SXwYCvYBSzv+f4B5oiNEFsS\/3DUiLhymy7FOQ9Fr+OMFgmFjT4TPK187K52PJy+cHmKB8RgN6HeBE4wanGj7KeTbGtiUqzf0p2P+MF18e+QgnJCc3nSRyAUSV446y2wGQrJ+oIFK6nq8k9JvuNc9OuYNSt\/pE7E1gKEj1ppdlTwakus0vKg\/3rjUBJBQWVSf3wZ2tIvzqKs38AqVk9aIrwldwp7x47yppbKf3M4jWRayAxcVam5xjvnd3ppb6CqQt1FOk9+7BSw2kRssidtCPyLhOxU3Q8KcZ\/H1gEDRmxuhy03t6cSNVby4bWM8sPLKlQ03ovHI3mSw\/uHfHsCzK4yH7srXlKNTYTyXO31QKjtLvYIDEA2CLdstQMYVAS0SEcfmeF+bivG8HP6DOILe9At3pHFbfaBB7AFILgGcSBBGD8y0CKtuENd4DuWmEvn9kKcQYPNLsjw2zcaDRm5pts\/BFNmvyFrJ1wcRx0\/8dxDWBAyesRnweNaygKyVfSDuhBKYPMEYXlyJbYOuMX+ZctslQlqFgF+G\/Uc9ieCJHS75wJj6G1JezimCiUdNM8dEUBNVSIeYJyVbPoHmzfYVyHYirSzhJrlfvIUqwosinRHzDVO06cQUpHFuRWg2W9WjWftratFJnC63qbm7v2S3mNxuwkIe\/ui1CU0Vx\/lQ0tRYA4sKkCy6khMxkMFWekK\/mjP\/Ki6TKB9bh4AD6smmHYb3kJoXvFaUeEEFvO65jAE982tHropEbQX0tTXYKfoRKiLQLzDju8HjPaepf5lh8RR5eAS76pVN7G2QxOiRMx37BjSGoQUw+o7Fkgvhy09ruISf8SNFn94PKxzuoqRtog+3Vf2XfcF5xL1NCQQeN9TPpzPGnZpKO3WNGlehyxoUjcxencxSET406QB6ce7fWq9Kp7Wm\/ltzudqunkePBbF\/Wqiz8pQJKVzsqHux8B3XSZ2WqZpCkXWKnWCYqZs20MbB69G7yqpo6Z47NX7rsmBaF6BXnAC3PicMqiNRfLJhx+EgDk6ZZNQgGwfBY2p+4qK6laCOJ546B70aFuE+5NrIMzGqHp\/y7hnfpt6AIv82rg8iRex8CYf3RfrqbdcOIQRdJ0TRTgHVG8LdkXKkebpe0XRqNZ0e3xaIrV7ywLAXPhhOYM+GK8B2Prg0rEl6cQuVH8KzZXPPgdi4et3vGuZxd9r2ZT0aC+zBoedn4k7I9ankT4ZwNmouBIQAGmkHqwnboSpwp5epS9Y7CYRZz9TKiCICeBgfW0fhZ\/zz6rTcuHiz7PmhymsK94eHPfbXFHqoxArmHGiG96nr7FiE0xeZIsPTuLOe2NuGIuSZ9RvQExQ67G8ovgOCchWxIle3Zrd5dXk3Lpm4cUwuP+CIM+RlSETpLrc+t\/12cBZrFm4uOvg7hD9M2LHP1JP7B\/bieYQugcBEr9UZfKkilerIYjB4E0O9uyFUkdGfMECwSyZT\/U1JvGbqgHoANPwE49AXkplk8QgKgMWYPmpz8LJL3sPtCoWOUGHZMZZ7CYfSHeAjsdUdqzYoh3imovXSSu\/RhgPatK\/MvpmrUqwjUHV3fE1WkXV18r2rvLLM9kDSgEhwZETgCSDkLEZiwXj30wdferrGW4UnxZCv+INp\/HakeXJ6dSRJAc\/S4bso7a0SctzzTIChpdPEB2ybvh8bdgH0LwJZIoFvLQlxhaFkhkP6rUB9dLQb7ubqABt6FOYsV5YCRE92HtKUCU6XfZkg8mx5YULdn9cDKApXaitHAPgm\/xyq25DO21eDNaXTpuuxzxfEAHM+vWfO3vyzSqQsNJWsO9oIYWRkIIDMRAPld4y2T\/7Xvh+xOyw0jW6+8\/+oclE8pXMLHRhM0AXbMYdeAPxuQ6hwL2OG7XiTmPxo8J6U79xApuh1CmlBl6v6lEkjmMPZY6fK2aU8bKc8\/EJp+EgzdzJrcBk96p2pBOwU\/Tpc\/iI9V14NXpO9h2Ndg82TvOnLosZ2WWTsTysRQgKTEz1Tj5nq5Gq87ozVOOLcOlQP\/R9nF1SIGNFCp38MISU1BjUQhcxW2lkQONRM4qwiYZWDr9pfHrhgpfyxiq34nb54GBthFyC7Ny+fxotP8N+rDmLUgpOb+v9x8cczuYqW3g3kkMfrF5QUWIKFZnmQqcYmWacAPxoPE78XUMThXow+av\/y1SFzwuQY3J8H94uKBkSZH6v7uXhH1yMrCVa8hXgdxkupD6Z3HKVo6N+TUB+3uP4eN3FzQ6o93OQE0BsY9cbO2sVk+Cv0yjUIzGnJOdyn+znyvVMGtuN1op3F07cSFT3SoFub2FAHMJn9hmICjC4mshj804FhMOiTvFBgD9G+x5YeXiZQBzXh2Led6SnHjlmHthzRoSWueTEr52ue3xfU3JdM3jEM50YU3pw2ZLNzEVNMGXQpgwViANAnv17HdgMGmXA2yU1dgifMVSaMxoBbwnJ4\/Bucv6KSfjvkfDSPlGnAGTmWEnQ8cNwIEfMt23Zn19VsvyNSGdHDldM8zrcrQOexJtakPH7IRBBWu0Va4DU2gII4FP+\/dVQYh7S\/zfUdQuEr\/E64e9yExQsn5QAm0CNjVWBte9WNd828nzZCka3yxswW48m1TJlrwPwuFH1fiaOQIQe4Y9dxtRq4NYWG8upX3TgiXsP\/QL70IUrL4A8qF3Dsl6dkNfx7xAEKxqG5\/MhmXjiiqbO2X++bZSRjoy7g5bxRzWlR+ykpACnhTXoDQFN2uTYUj+v4r3jdI1MeoWtcxngZVi2hDe+h4cdDTcKhb\/Tfuev+8aIDE34haRteGo3BUPU5WBACOEUC7xriKuql3ydksmzPRYE\/lsAKpgbtAvU1OwWzDyhtcXUVSIyUPwd5f5tYY5OZjIxwZ\/MhTPtqu9urn+1jMN1ns0XXxqxPPRsO\/6iG4GZWzG6BXsLigEUbRPHXqWUoPfzjXBRfOQ\/O3k3nn+6Cxw55QDO9A8Bh6GlboNqS3PpK8U2qU48aetzPZYCu27vgx0ESf81MNwzahqxQQL6c5XnCxV3BXHtAYF38q+gqjXtLdDNduTQngW4NNS6Upf3q8mW4JTwmz+rWsmuYeTfSyc5mgw\/bj718BWquklXFv\/S8+sdXA3NapGYn4ejWfv8V+pwqyTd2JtBLLzriBik0Aj4IXwFCtYveyP+UqugSdwZGuEvvSp5SuKFU47GGsfAfICfU9VcUSIK1MahyTioYRwt4IU1xK6iTLmI3aAOLBs97F8gc1lDWhJK1YhvlPXY525\/pg9tyvEh9Xxv94NCi4\/rN2uyaHjuWKzxa5n\/hUlCQ8bwnfx\/OvAVKb00LBVxw4C7oIeoU+GUbsm01q38Qj8US7WuQcWLjovouAB6ZmY+Ar48UnuN27ZR6r33neWyQg5DH9g8oi3PywhLQ69HnWpu80xgFQhLSSZSeXSeeN\/7JnUUVsVwDydpecoEslQ6UZoIxhquB4I0aSLBN5iIxD6pg8WzJtj+Ocjk+7rpdP17031sjDpB7O2uqyEZFi6UCrWZ1ThmKPT5bz8mISr1n597Ib1kyGuXajeUUXflmVIdPGViyg\/VNih8MUPB6GhlrZn1bVZUDS0rkENcnAszagf2\/DKdEJn0UDe9PuoQb8I2Y6KknRnZbyphcZK8qVavNpTGOT9UKvKMga3sjiwjoiquSb3YqII5PDDNyzUNUvLbJu38FTGVoe9eGuuPf+exadQokuFlTyfxPoDzgpmMHMpXWEVM5fL44kXkJ3Th796rxeRNGEsiK\/WYRf4QQF9ETuEwvGqVme+nqXXEfERShZ7Rwdx1jpSwtdystmDyI5jU6\/7JMi4G7ZN+OIpqG1JCvzmcnmz0f7EcrJaJ90kuNbvYIsBf24IddU7CbtjUTJjubuz7t2eoCt3RUixqnblef3i9mICUV\/lPRs57ULlTyU\/91ZsG1dAaSzuQgBIEcHAT7Quu5RSQjBvlitruMy8a46hNbf4+bpBZWnoDXOGUHNY6Y2VRp0vJB2zwt4vfrn1pTRB2IEpqaPgTpucQWOslFTc0uLIc+UWJG3XuXNr2DkpXSFnr7uP74X3jdk8A8UNyiZi9EFZlxXwBe59jjpK3MUdGIeGWABr7FtywSddqzm0ufGrOCHxKQdw+jinnD+BCTIChbvYUcTpXDkP1sC0S2Ul51BQsMjJAmKRuw8I9Xz8RqeiqX+EUfPD5EkeGAHsSq1aO\/yySHhero6+PlQzri1GnU6iE81LkwCbS6cOyqi3mNsJT\/Z2YMOIBQlope0cmSc8l3PVDfNuiTKUZ1\/QzykoerL2r9UlJpp95vM7PJPWXiYALaifvZzH7F7C9rHXtWaqax3AHCtdsLwndXvYYRa55eDx10L3NYoynr\/BHysjGfKsWkluc6UqeqJmGM1O+IFNzdT0DRWBYtRbYw7iId1TOqS94lC4FJYpsZxqwp3MXoBHsoAiEDJD6uqQZ4YMPLipmQi956TU\/8FdWtKM7fYYNgxJv1zUt4iG6Mpb99Fh0NnL18W9m43h0DDSNuCBQMRJM77Wr5rq03Hc2lKdx2b99Bm7PSeJ1fTUAdemTOwTYHoPzFyXkpLERKe5sGOpGv\/eFAGCUMqDpE2lqdXDuPHbdPJr+jKdnKQVzi\/l2CgFNPco4UXIWzooo8up1Zih2KtIxtyGn2OF92GOJWk3WzcLukeMz+Dkaj2c4Xn6QahoIGHRqdbeYVD0IpspRurpC9kBLWozsO4ta3SJyUkvFPygs2GmQUEf7mq4lYkV2fs0qcnga5d7\/PGh2QL9eHtlIa9h8UqaG3RzY8Ehesjt1N2GzEBMr6\/1dmx4uF5DSlL4TgvGdEX\/MojXMKikxcCII2T6vn+66DIX5iVj7qqrBDJSg\/QH6mtjSJ3ruKTfjDzaaAqTivzfROqyMxjForPbB5d6oek+my9+uEMAF9QQpduSpdDGREwEqX6NS1dYO\/mHyLVCJTdyKLdonPyI05D74rHO0le5UAowZ3ut\/\/Wz+z4zhUS7d5gxB0xSzv+jfgDaX6fmKgN1xfafI6uAxzgggkZ4qDhuCW0u3H0xyonmcPkMSJCx1TohVEo\/JqfoNO5S5vhAgPW4W4ajkQ\/dtkJVP21A3IomQFCQeL3sGK\/JbcTzOoZsWSjsNcuYyRMZjV4nvRuwz6AKJ\/3aOVYCdlTQ4240HHZgqGx7ZdWtN3NRdwUz0\/Y1QL\/RZGlBXH2\/UKkuep\/1p+3u+TTMh4WFz4j2IIA\/lnKXi\/qlO+vl7135da8kf8HfTus3h3\/urcjuLq0zLkGXpGte9pwLSKuoR1jEAOBrWs2JdNwm7XFfI3mENCDnOAFfTN8yBuYuqUXqkMs9l10d91S422ZMrAYAep9HDkbKEdkQGfq45QpnDevgTwzUh42ltLM+Vhc6rfwaDx6Fj6CaTt58BzSUiTiRSl9hjaBSmfNfjI4bC46G+9Wiy8A+clFu81BALeqiOSZTZPjRFkByZ3I87UaWoZ+XBoQD\/yVSc9RYsX5i5aF7w5EUDXakCCvDKEzj8tSRfKsyazWbArlRmi1piHoXHrjmLS9jjAczwQgjG3ZoNaaDX\/H7IAk8D2g9NtrszTWTahEO2wi0t3QdPuT5ILvIVo+cne8+gHb+EJzTWEBVhqOTzYaj1Sn3HZZLmnxYcxflNklzzx5pjNGyJVAmEcxDGToGce72AApm+BrzG+f5zQAUipfBHHmszFgucki8m5liy8XLVS\/2STZ1XpySZ6qwzwA\/NQaS0TKic80aAM+\/3Fn6LuM4GRb8WIKsJjemxPZcvrBeU88xzjYSO0vABE8Rz5vfwV7TBOETCRnOdedTlTZL4gRkm9E1pwT32sCKT56rCkMobrX9HAk6WAXy4ENSXtQGBN0SH+PlaAaw\/CFD9yFAi3bc\/f8ZS9CPPEJaPSWITc\/jAxqqm7Sb7g+a1k9hLi+zE9VXn+tyr1MN9mNNDI65KGJgr8lpRoVC5Jo22HRDJDediChjwFQuhp\/gbwyZcMRz20kSc80EykKkwMwPOni9PZWO488YmJ9u+g3FFM3C35pYKry3s109t32ZJxwoyh5MSXLAujUiLWcgeoJcIukRBAtPqJ7+1W5CqdzokFw81sEsTv1yeR93LBzdRUMg59QHmZpflk3jKOPnR0a1ny1N9C1giTYaEC0ri0mjmjfir15Ywa8MfvzKGZY6X\/xjedgcoxYuC3xQxqa8DTkoNdYde\/6xm3auRDdbkuQckIcituDSLnsVsCONG5RA9WxXs\/CsSbKcyRDeLgQIID\/bsQfeIoamwVga+s30MkbP1AVzm78DYt9acl2UP4mwVLv117Ugme4qe28i8p7DX9wumWy9rYS5dym2XiPmgxQ\/lBEMtE\/UWGjfX6xShJINW3ZSaxhDQDbj7bGf8u6FKOxvHvIQHk4ovU6LescIeBx+FxZs0XtQXcMlZLh92WmIPlj4nbHOZRvAzHygECyNpeW7AOnERNnGL9a6yTXY\/ftNf14gS+nx+rzsk\/bpK338XPIv9jaNURAjj3IqmNY5WBE77g6nNtJ5nvKk+SsZJTLm2qqY3W4QS\/FH0QlzotH1q3m1TAns6gj651xO1QkJ8etfn\/FdmWZHv5492cFP2DesixiAwVVc++osUAKaD7HLrLg+VBcBowdort5sRmY\/yOe\/K7OUdiHImrPThnvfJ1PYkTWLs2WMgx0xqcYq3SwreZst+KbfFbm3ugwjgeYEIgMlAmSRUzd1CSVlYNEqu0fEW7dY0vNkrMM22mBTrQut7HhFcrXNLSiwbVx+UzPhfbySBFVsBuENJZ4UuMhvxsN\/iM4S9Pn1wM19zBe9sVRvauyzt2syeQpYCoCU7zHSd06S7g3bsHLjf6PVDqszjS2CzW5qSw6\/UZXVG4gMl4RhJgOpXY2QofdAHy5PFSqNONypq8sBokHib5E0XxHTz4qr6ENjnKWnrsARnAwi3r\/s7wrmb1UT0OjCicza\/RGhdk9ovTO00llbF0NiOkFZJ7TQjGZEndZ+pF8osFbZXW1Q+7xE6xLawAELh7sS0P8LxYMlGh1SY5bTCCWETn4QE8uT3wT3bfFuV+rKJ+Ef\/HysXTLVJon7U+gYdFAahw7JgzqnRtGSwkj38BQam6dA2b2VdjcmnEver91KaIAtIR3FRZcKWEYV1KY+fE52lfoi6ScIUfNzENiiVH\/2GTW6S5Acx8il4d+PWxGkofNuZhxLQjTmzMd3oQSWy0onRsGxJ7h3YVvWPPhG50yiJUuZWhwAI5vKsMe5Mw2d+I5F1ZOoPy1RpnkSs39t+3z\/WUucU\/n5N5Mrb3CgyAJAD5qHKKuUpYRjSZ7naNPRG5UX+Uj1on7UW05XziBllCAk9j8Aza90hR4oJWy+RVit3Jb7elo2xcUd9li8OkWHtR8hxoIdxD6J9+Cn9V1ETU\/9gFa5WY\/Qmbhcrjly6uud1qsAGvK17ZIc11AqiqTAUwO1J6q1az+tD69wGkV0aff9m5rJhEhvDKAoZiuV9wvrDH7lLlRpz\/MUzd1YJPiggPo8qG2PCBrLnLNDt95YjZwKZg5uZQgUD9BGPTU7NVQjnYrZJRxoJWwKbjNsBSriAsdhBKVds1w2MO+9Hgp3R7ZqEzBdd\/X866RARmsiLecBSXf1eZBdBYB\/BAcpP8SfMYhXto\/muEedXvAvewodiCLx5Cb9hY2eo6Oo+\/d81ekKDz7cP\/eRjaPKkFq\/MLeu\/gFIXA5glN91dqmX6jrR7tIhPmDaNIKStei59QiDPSUwfyla6tgIAZ9gHWDYh9BGc8t0\/EF7xwupIVXTVF+XQDHzYTftorvpn0tEkukgZJu2b0yj2IDDlc3\/LGAhqeT1rQIabT\/8o1Dy5EHzhIP8k+B+NgU119WrE\/oJLjwnSCemuffqWhy2hnTZgt7LFbaWVGBrKyNNzD7N\/CYqKsvJTefzlnmTsQFfJblJtsQedoUG8NruHKFjSHeKXpoqdlLKgzQ3oIRje16YPWARNxhNURvVnHW2mRkntCMtNaGoK5768HnZu0Zim0q22YSH3OVTcE\/vSUbYPsL00\/a2BVXHE8yvCiJ0TF56HnIxkbivZOEjYpEuTnHY0SGFTiZqX7\/y3KBc4mIVbmv2hK2DC5hJMu4jY1ftZ3WFncfoM6jbYhtba4dSuExozEX+i\/fGU7QNdnzuAiMzn9PG2FDNWlBtiVJArtpr88FX5VRRww7WoGVZQQpKHLfy9mPE9cHM4VR4Nfg90oXpNkWP1d6eZv7Xe+\/InFDHiyPC5BtumH0IrAndqOWp29JgcvdONF+k13ERdjyqzNgfJ4BvgWsZsbzehdFqK0zd\/INQxs8zY52b1khwoZtegZj6rJpYmHXELvGzYz9NQW7kC3z44Kj670ec5Pl6AYbnpjB+Hn5v42n7xOtn+ZXZxVmg16scnHm42d1gGg+ZB2qdgr8FjBvwl3+Mgj+7ueVzPdXXW30m9+fcwupsIOtk0MWGnMLptzhQyw9KmCvtxQaw30fteT2T2rlqDYl2\/HMQI+N4Bu+xkmfYNAKPSq0sKkig2khU5\/QR0Kr07wi+Pog+l25+vVcfS9as6bf5QUFVEVeddHC\/R8eGdPhzW0d595wttP7Yv5BdwmTMgqXkLUVSDQG5\/or5LECoMh1BJzzm9QdLNWXbP6c\/+JOkaXbaq70jzqowWx++CaPK44ZHxBKfd1tqwLTDkadj2ibQ2tiur3CZcly5p\/LUgIDdBOAjI\/1i3kknkgeviFjhpKwsFuRwFVj0S+NnupUIPKn98ZUps1p2z+dWHzfLfmVqI\/d\/ZRzZemRcqVxKpLztiC7VWqTUItYRfyqNTvJOWogM4x9AeX7Z0Qpfw88zCF+DQqYtpdzvb8gCyUqXYCYnygD864iWg\/tSooCkaHZta9hCTdeDqmwqPyZNMBqrx5xjGQ88Jwe+S0Er3NxULGIrXz6LtPlr6YvteBNw+iTM5YNWlJAVLVu3rf83WS+P3Rrzg8Or+TAhswBCt8cmmDFLW0kl\/B1LoQuU2+wPYzXYwnwqAEDF0jK+L52SNi7j\/gmfrx0+U4TglUndDA5trZNQiY2h9DUso40J04hRK+9jk97EHj81EHKAD17JScMkX\/tPdAZTIRbQWrHNv9V5KpkxGthA9NQ4sMAD59czpuWzEsWaKnCz8ev6IUmYvMLAromlNtQ3+d6PzgkNdtZ+2qLj6eek+wpOn9tROZ+0OrI57KgPsbfO767bDCczAO8KIwPIop6vhjBO\/xHSlp7Gyke1smpi3ng01ec58+a8ia7BxaYhesJfHCf5VU+SLEpJV5uSxH2p9IX5MXW6q95ZY=","hash":"32c83f198409e51d11a731b42a89046369281ccdbbce171ea9799ee01bd837dca0b67d734a0d04a1833ae3edd3670d0025a661217167b9e88aca66e8c5cb2265","index":0,"nonce":7}};

						break;
					case 'updateObjects': //obsolete, new savingUserObjects
						var url='/updateObjectsV2';

						break;

					case 'checkEmailExist':
						var url='/checkEmailExistV2';

						break;

					case 'checkPass':
						var url='/checkIfPasswordOkV2';
						postData['modKey']=app.user.get('modKey');
						break;
					case 'setup2Fac':
						var url='/setup2FacV2';
						postData['modKey']=app.user.get('modKey');
						break;

					case 'retrieveCustomDomainForUser':
						var url='/retCustomDomainUserV2';
						break;

					case 'checkKeyUnique':
						var url='/checkKeyUniqueV2';
						break;

					case 'retrievePlanPricing':
						var url='/retrievePlanPricingV2';
						break;

					case 'createOrderBitcoin':
						var url='/createOrderBitcoinV2';
						break;

					case 'createOrderPayPal':
						var url='/createOrderPayPalV2';
						break;


					case 'calculatePrice':
						var url='/calculatePriceV2';
						break;

					case 'retrieveUserPlan':
						data={"response":"success","data":{"planData":{"bSize":"5000","cDomain":"2","alias":"0","pgpStr":8192,"attSize":30,"dispos":20,"pgpImport":1,"contactList":4000,"delaySend":0,"sendLimits":60,"folderExpire":1,"recipPerMail":50,"secLog":1,"filter":5000,"blackList":10000,"price":180},"pastDue":0,"newUser":false,"cycleStart":1588021528,"cycleEnd":1619643928,"created":1588021528,"creditUsed":false,"balance":0,"alrdPaid":9.8,"monthlyCharge":8.8,"currentPlanBalance":1.31,"paymentVersion":2,"planSelected":1}};
						break;

					case 'savePlan':
						var url='/savePlanV2';
						postData['modKey']=app.user.get('modKey');
						break;

					case 'retrieveFoldersMeta':
						var url='/retrieveFoldersMetaTempV2';
						break;

					case 'retrieveMessage':
						data={"response":"success","data":"{\"messageHash\":\"5ebcdf717f8b9ae9078b484e\",\"meta\":\"mq4cVntzJjUjNdV15curPg==;Ho4bLiKS7ChhEJ60Kyi+PjKgQIWeU2U7JuUQmU+xbQJwc7EAgiX4gZaOc+qmkMEbx0xP09+n5o4yR7EIHSvHSHPTpxVD2X427ZizOO328u7c09joWM0nn\\\/W1DE6MdOO8Zl6G1PVENmUa6fSq06UTaYziLDyslYMr\\\/CBw+JoKscrut\\\/oqX1KfKboFxnCUlA\\\/ak7+DsX8sP8UYWu21SR8fvlDGCuoTRKDNjrineIA2i6Lf+bEk2M845FI+j2\\\/vkazseW\\\/vsHb0h3+\\\/Gn5jIM4VXXrr5FjC9PNs8IDfLay4PFm8ja93cuG\\\/PCAktalSpsQo1QrHLxnqpZFMY2IgND0GSjzcaVIx+qVFW58E\\\/eJ9I3TUPmZoBF9bGMZavMfkkK5xbJ6CIBwliqQpkP3\\\/+F798pHQ34xi\\\/mqlH7U6vmOHIX+ptXjfh2ZNDlrSjWCZ0L5JShH6GYusC31aKvy70lTdA5vgmNTXZdmle5rpPc2nPlQ76H8xp797uBHTqP+jVrOoMKHAwzfnbyheFZJUn4pXJQ==\",\"body\":\"zBJ4Ry9624m+HqTtHnbwMw==;GJUy6wIyJkBqPsROE7K+cdPqa\\\/ZjMqlMqjvJRreqisPwNwx0hpRFGAsPpyqzpb0W7URTHJrscyaxBCnMJxRzhgPwzF0YckARBXGZnos0oDDVc2Ys2OnVtShCBW2rgGVD2Dnanvh5SmxCkJBv3Md5B0SizHDjUN9gxzzWSHciroFM95BFo4wC7dU0FQ2xTwW3Ebz9VpwJvzDE0GfpwPUv8hyw4oL96UaDYehLmTyu\\\/mQwMi3q+5eHDK1eutoyoY3deiSn7TLkztM3VfraIVhYUHVgVgWf\\\/yjKi4p\\\/+R5ZF++XUTndi50cGKWqL1jMfw3hl36nBQJqhF0RMuobxS\\\/z2k1C\\\/WLLx\\\/Lt\\\/1Y4Zfl1YDcBcrDQYZ6ucjyWo1nMCsJ\\\/PZJVT0PRacQPB5eBsP6lt9MM0cKluZ2nbx3kscIcumrKYh5WYeMh85zoXmVL+Fira+PwXzkI6RLCyGSizE79XYmeRbv55KuWP0NbpWJfWrUnyidJ71bgvLr76rITG0LWb4QFY9rL8seoifjW8oqyde\\\/cP6AE56qyg1z1lZL+ntbWqb4k1uqbh5ngrPwfDuz+QZp5okNyJ\\\/2+AowaG+C4vMR1TD1VYWHTkxg7wiwtLqx3IfZhRgo3MoVwWmiOhNQVx9qL4PuhycWPQd+JJdsOD3lNEHpV9GyJeAK6O01aXhQjlYpDUp2XRLRzio94Cb76FN6guJEUl852ROjAcWz7v\\\/AWRxSZpnZqCupdpb2fLCt80klWia1ShqTLCukehRJCzEi2eS811AnQGO+ZB16vkSkuDoBqvXy\\\/uJ16q3ZlFcEN8e4NtxWrRLYG3l\\\/8GOmA1jtN+kSEuGrtO4ZeEO\\\/e2Q==\"}"};
						break;

					case 'getTrustedSenders':
						data={"response":"success","data":{"senders":["2f6ae5a7e8535594bff34ed194a9e9762c4f7a9e8b4c24e335a506bb4f490806","0aa7e0c52b197a7daacf4b01f8e58aadedd5e2eb9e8e985c2b9dc14be85584b9"]}};
						break;

					case 'getBlockedEmails':
						var url='/getBlockedEmailsV2';
						break;
					case 'saveBlockedEmails':
						var url='/saveBlockedEmailsV2';
						break;

					case 'deleteBlockedEmails':
						var url='/deleteBlockedEmailsV2';
						break;

					case 'deleteAllBlockedEmails':
						var url='/deleteAllBlockedEmailsV2';
						break;





					/*case 'getPublicKeys':
                        //get public key of emails
                        var url='/getPublicKeysV2';
                        break;*/

					/*case 'emailsOwnerships':
                        //verify if emails served by us
                        var url='/emailsOwnershipsV2';
                        break;*/

					case 'getDraftMessageId':

						var url='/getDraftMessageIdV2';
						break;

					case 'savingUserObjects':

						var url='/savingUserObjectsV2';
						postData['modKey']=app.user.get('modKey');

						break;
					case 'savingUserObjWnewPGP':

						var url='/savingUserObjWnewPGPV2';
						postData['modKey']=app.user.get('modKey');

						break;

					case 'savePendingDomain':
						var url='/savePendingDomainV2';
						postData['modKey']=app.user.get('modKey');
						break;

					case 'savingUserObjWdeletePGP':

						var url='/savingUserObjWdeletePGPV2';
						postData['modKey']=app.user.get('modKey');

						break;




					case 'changePass':

						var url='/changePassV2';
						postData['modKey']=app.user.get('modKey');

						break;
					case 'changePassOneStep':

						var url='/changePassOneStepV2';
						postData['modKey']=app.user.get('modKey');

						break;



					case 'changeSecondPass':

						var url='/changeSecondPassV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;

					case 'saveGoogleAuth':

						var url='/saveGoogleAuthV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;

					case 'check2fac':

						var url='/check2facV2';
						delete postData['userToken']
						break;

					case 'availableDomainsForAlias':

						var url='/availableDomainsForAliasV2';
						break;


					case 'claimFree':

						var url='/claimFreeV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;


					case 'deleteDomain':

						var url='/deleteDomainV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;

					case 'folderSettings':

						var url='/folderSettingsV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;

					case 'savingUserObjWnewPGPkeys':

						var url='/savingUserObjWnewPGPkeysV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;

					case 'deleteUser':

						var url='/deleteUserV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;
					case 'updateSecretToken':

						var url='/updateSecretTokenV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;


					case 'updateDomain':

						var url='/updateDomainV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;




					case 'saveDraftEmail':

						var url='/saveDraftEmailV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');

						break;

					case 'retrievePublicKeys':

						var url='/retrievePublicKeysV2';
						//	console.log('savings5');
						//postData['modKey']=app.user.get('modKey');
						break;

					case 'sendEmailClearText':

						var url='/sendEmailClearTextV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;

					case 'sendEmailWithPin':

						var url='/sendEmailWithPinV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;

					case 'sendEmailPGP':

						var url='/sendEmailPGPV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;

					case 'sendEmailInt':

						var url='/sendEmailIntV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;




					case 'saveNewAttachment':

						var url='/saveNewAttachmentV2';
						//	console.log('savings5');
						//var anchor=postData['modKey'];
						//postData['modKey']=app.user.get('modKey');
						break;

					case 'removeFileFromDraft':

						var url='/removeFileFromDraftV2';
						//	console.log('savings5');
						//var anchor=postData['modKey'];
						//postData['modKey']=app.user.get('modKey');
						break;


					case 'downloadFile':

						var url='/downloadFileV2';
						//	console.log('savings5');
						//var anchor=postData['modKey'];
						//postData['modKey']=app.user.get('modKey');

						break;

					case 'downloadFileUnreg':

						var url='/downloadFileUnregV2';
						//	console.log('savings5');
						//var anchor=postData['modKey'];
						//postData['modKey']=app.user.get('modKey');
						delete postData['userToken'];
						break;




					case 'getNewSeeds':
						//fetching seeds for new emails v1/2
						data={"response":"success"};
						break;

					case 'getNewMeta':
						//fetching meta for new emails v1
						var url='/getNewMetaV2';
						break;

					case 'saveNewEmailV2old':

						var url='/saveNewEmailOldV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;

					case 'saveNewEmailV2':

						var url='/saveNewEmailV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;

					case 'deleteEmail':

						var url='/deleteEmailV2';
						//	console.log('savings5');
						postData['modKey']=app.user.get('modKey');
						break;


					case 'deleteEmailUnreg':

						var url='/deleteEmailUnregV2';
						delete postData['userToken'];
						break;

					case 'retrieveUnregEmailV2':

						var url='/retrieveUnregEmailV2';
						delete postData['userToken'];

						break;
					case 'retrievePublicKeyUnreg':

						var url='/retrievePublicKeyUnregV2';
						delete postData['userToken'];

						break;

					case 'sendEmailUnreg':

						var url='/sendEmailUnregV2';
						delete postData['userToken'];

						break;

					case 'CheckStatusV2':

						var url='/CheckStatusV2';
						delete postData['userToken'];

						break;


				}
				callback(data);

			}


		},

	});

	return ApiCall;
});