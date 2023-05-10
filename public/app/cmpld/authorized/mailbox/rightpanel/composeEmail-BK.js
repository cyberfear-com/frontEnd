define(['react', 'app', 'summernote', 'select2'], function (React, app, summernote, select2) {
	return React.createClass({
		getInitialState: function () {
			//console.log(app.user.get('draftMessageView'));
			return {
				fromEmail: this.emailsender(),
				to: this.buildFieldsforSelect(app.user.get('draftMessageView')['meta']['to']),
				toCC: this.buildFieldsforSelect(app.user.get('draftMessageView')['meta']['toCC']),
				toBCC: this.buildFieldsforSelect(app.user.get('draftMessageView')['meta']['toBCC']),

				subject: app.user.get('draftMessageView')['meta']['subject'],
				body: app.globalF.filterXSSwhite(app.user.get('draftMessageView')['body']['html']),
				signature: app.globalF.filterXSSwhite(app.transform.from64str(this.fromField('sig'))),
				manualSignature: app.user.get('draftMessageView')['meta']['signatureOn'],
				emailAttachment: app.user.get('draftMessageView')['attachment'],
				fileObject: app.user.get('draftMessageView')['attachment'],

				showCC: "",
				showBCC: "",
				showAtt: "",
				showPin: "",
				fromOptions: this.fromField('from'),

				recipientLimit: app.user.get('userPlan')['planData']['recipPerMail'],
				planRcptLimit: app.user.get('userPlan')['planData']['recipPerMail'],
				contactArray: app.globalF.createContactFromSelect(),
				//fileObject:{},
				fileObjectNoData: {},
				prevFileObject: Object.keys(app.user.get('draftMessageView')['attachment']),
				fileSize: this.getFilesize(app.user.get('draftMessageView')['attachment']),
				emailProtected: -1,
				recipientList: [],

				enablePin: app.user.get('draftMessageView')['meta']['pinEnabled'],
				pinText: app.user.get('draftMessageView')['meta']['pin'],
				userPin: false,
				savingDraft: {},

				encryptionKey: "",
				//originalHash:this.getEmailHash(),
				changedHash: "",
				modKey: app.user.get('draftMessageView')['modKey'],
				messageId: app.user.get('draftMessageView')['messageId'],
				allEmails: {},
				uploadProgress: 0,
				uploadInterval: {},
				showUploadBar: "hidden",
				isMounted: app.globalF.generateStateRandomId(),
				sendingProgress: false,
				oldPublicKeys: {},
				oldPublicKeysHash: "",
				sizeBarText: ""

			};
		},
		emailsender: function () {
			var sender = app.user.get('draftMessageView')['meta']['from'];
			if (sender === "") {
				var keys = app.user.get("allKeys");
				$.each(keys, function (index, keyValue) {
					if (keyValue['isDefault']) {
						sender = index;
					}
				});
			}
			return sender;

			///  this.setState({
			//    from:sender
			//  });
		},
		//

		componentWillUnmount: function () {
			clearTimeout(this.state.savingDraft);
			app.globalF.resetDraftMessage();
			this.setState({ isMounted: '' });
			app.user.set({ 'emailReplyState': "" });
		},
		buildFieldsforSelect: function (data) {
			//console.log(data);
			var options = [];
			if (Object.keys(data).length > 0) {
				$.each(data, function (index, emailData) {
					options.push(index);
				});
			}
			//console.log(options);
			return options;
		},
		componentDidMount: function () {
			var thisComp = this;

			fileSelector = $("#ddd");

			$('#composeEmail').summernote({
				//minHeight: 400,
				airPopover: [['color', ['color']], ['font', ['bold', 'underline']], ['para', ['ul', 'paragraph']], ['table', ['table']]],
				toolbar: [
				//[groupname, [button list]]

				['style', ['bold', 'italic', 'underline', 'clear']], ['fontsize', ['fontsize']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['height', ['height']], ['view', ['codeview']]]

			});

			$('.note-editable').css('min-height', 300);

			thisComp.toSelect();
			thisComp.toCCSelect();
			thisComp.toBCCSelect();
			thisComp.attachFiles();

			$("#toRcpt").on("select2:selecting", function (e) {
				var limits = thisComp.countTotalRcpt();
				if (limits >= thisComp.state.planRcptLimit) {
					app.notifications.systemMessage('rcptLimit');
					e.preventDefault();
				}
			});
			$("#toRcpt").on("select2:select", function (e) {
				thisComp.checkRcpt();
				var element = e.params.data.element;
				var $element = $(element);

				$element.detach();
				$(this).append($element);
				$(this).trigger("change");
			});

			$("#toCCRcpt").on("select2:selecting", function (e) {
				var limits = thisComp.countTotalRcpt();
				if (limits >= thisComp.state.planRcptLimit) {
					app.notifications.systemMessage('rcptLimit');
					e.preventDefault();
				}
			});
			$("#toCCRcpt").on("select2:select", function (e) {
				thisComp.checkRcpt();
				var element = e.params.data.element;
				var $element = $(element);

				$element.detach();
				$(this).append($element);
				$(this).trigger("change");
			});

			$("#toBCCRcpt").on("select2:selecting", function (e) {
				var limits = thisComp.countTotalRcpt();
				if (limits >= thisComp.state.planRcptLimit) {
					app.notifications.systemMessage('rcptLimit');
					e.preventDefault();
				}
			});
			$("#toBCCRcpt").on("select2:select", function (e) {
				thisComp.checkRcpt();
				var element = e.params.data.element;
				var $element = $(element);

				$element.detach();
				$(this).append($element);
				$(this).trigger("change");
			});

			$("#atachFiles").on("select2:selecting", function (e) {
				e.preventDefault();
			});

			$("#atachFiles").on("select2:unselecting", function (e) {

				app.mixins.canNavigate(function (decision) {
					if (decision) {
						//thisComp.handleChange('fileWorkerRemove',e['params']['args']['data']['id']);
						thisComp.fileRemove(e['params']['args']['data']['id'], function () {});

						//thisComp.removingFiles(e);
						e.preventDefault();
					}
				});
			});

			$("#atachFiles").on("select2:select", function (e) {
				e.preventDefault();
				var element = e.params.data.element;
				var $element = $(element);

				$element.detach();
				$(this).append($element);
				$(this).trigger("change");
			});

			$('#toRcpt').on("select2:unselect", function (e) {

				// console.log('sdsdsd');
				thisComp.setState({
					recipientLimit: thisComp.state.recipientLimit <= thisComp.state.planRcptLimit ? thisComp.state.planRcptLimit : thisComp.state.recipientLimit + 1
				});

				thisComp.checkRcpt();
			});
			$('#toCCRcpt').on("select2:unselect", function (e) {

				thisComp.setState({
					recipientLimit: thisComp.state.recipientLimit <= thisComp.state.planRcptLimit ? thisComp.state.planRcptLimit : thisComp.state.recipientLimit + 1
				});
				thisComp.checkRcpt();
			});
			$('#toBCCRcpt').on("select2:unselect", function (e) {
				thisComp.setState({
					recipientLimit: thisComp.state.recipientLimit <= thisComp.state.planRcptLimit ? thisComp.state.planRcptLimit : thisComp.state.recipientLimit + 1
				});
				thisComp.checkRcpt();
			});

			//console.log(thisComp.state.to);
			//thisComp.emailsender();
			thisComp.setState({
				//from:"c2RnZGZnc2Rnc2RmZ2ZnQHNjcnlwdG1haWwuY29t",
				showCC: this.state.toCC.length == 0 ? "hidden" : "",
				showBCC: this.state.toBCC.length == 0 ? "hidden" : "",
				showAtt: Object.keys(this.state.emailAttachment).length == 0 ? "hidden" : "",
				showPin: !this.state.enablePin ? "hidden" : "",
				originalHash: thisComp.getEmailHash()
			});

			//clearInterval(this.state.savingDraft);

			//$('.note-editable').focus();
			//this.activateTooltips();
			//this.fromField();


			//console.log(this.state.to);
			$("#toRcpt").val(this.state.to).trigger('change');
			$("#toCCRcpt").val(this.state.toCC).trigger('change');
			$("#toBCCRcpt").val(this.state.toBCC).trigger('change');

			$("#atachFiles").val(Object.keys(thisComp.state.fileObject)).trigger('change');

			thisComp.fileTag();
			//console.log(this.getEmailHash());

			//console.log(this.state.manualSignature);

			//signature
			if (!this.state.manualSignature) {
				$('#composeEmail').code('<v class="emailbody"><br/><br/></div><div class="emailsignature"></div><br/></br>' + thisComp.state.body);
			} else {
				$('#composeEmail').code(thisComp.state.body);
			}
			//console.log(thisComp.state.signature);
			//console.log(thisComp.state.signature=="");
			if (thisComp.state.signature != "") {
				$('.emailsignature').html(thisComp.state.signature);
			} else {
				$('.emailsignature').html('<div>Sent using Encrypted Email Service -&nbsp;<a href="https://cyberfear.com/index.html#createUser/' + app.user.get("userPlan")['coupon'] + '" target="_blank">CyberFear.com</a></div>');
			}

			//
			this.setState({
				originalHash: this.getEmailHash()
				//body:this.state.signature
			});

			if (app.user.get('emailReplyState') == 'reply') {
				$(".note-editable").focus();
			} else if (app.user.get('emailReplyState') == 'forward') {
				$("#toRcpt").select2('open');
			} else if (app.user.get('emailReplyState') == '') {
				$("#toRcpt").select2('open');
			}

			thisComp.draftSaveInterval();
			// $("#toRcpt > input").focus();

			//$('[data-toggle="popover"]').popover({container: 'body'});

			//app.user.get('draftMessageView')['meta']['from']
			// console.log(app.user.get('draftMessageView'));
			app.layout.display('compose');
		},

		draftSaveInterval: function () {
			clearInterval(this.state.savingDraft);
			var thisComp = this;
			var setDraftSafe = setInterval(function () {
				thisComp.prepareToSafeDraft("", function () {});
			}, 5000);
			thisComp.setState({
				savingDraft: setDraftSafe
			});

			$('[data-toggle="popover-hover"]').on('shown.bs.popover', function () {
				var $pop = $(this);
				setTimeout(function () {
					$pop.popover('hide');
				}, 5000);
			});
		},

		toSelect: function () {
			var thisComp = this;
			$("#toRcpt").select2({
				debug: true,
				tags: true,
				data: thisComp.state.contactArray,
				placeholder: "Recipient can see each other emails. Maximum " + app.user.get('userPlan')['planData']['recipPerMail'] + " recipients per mail",
				tokenSeparators: [";"],
				selectOnClose: true,
				minimumInputLength: 2,
				maximumInputLength: 250,
				maximumSelectionLength: thisComp.state.recipientLimit,
				language: {
					maximumSelected: function () {
						return 'Your plan is limited to ' + app.user.get('userPlan')['planData']['recipPerMail'] + ' recipients per email. Please upgrade plan to raise limit.';
					},
					inputTooShort: function () {
						return '';
					}
				},
				templateSelection: app.globalF.emailSelection,
				escapeMarkup: function (markup) {
					return markup;
				}

			});
		},

		toCCSelect: function () {
			var thisComp = this;

			$("#toCCRcpt").select2({
				debug: true,
				tags: true,
				data: thisComp.state.contactArray,
				placeholder: "Recipient can see each other emails. Maximum " + app.user.get('userPlan')['planData']['recipPerMail'] + " recipients per mail",
				tokenSeparators: [";"],
				minimumInputLength: 2,
				maximumInputLength: 250,
				maximumSelectionLength: thisComp.state.recipientLimit,
				language: {
					maximumSelected: function () {
						return 'Your plan is limited to ' + app.user.get('userPlan')['planData']['recipPerMail'] + ' recipients per email. Please upgrade plan to raise limit.';
					},
					inputTooShort: function () {
						return '';
					}
				},
				templateSelection: app.globalF.emailSelection,
				escapeMarkup: function (m) {
					return m;
				}
			});
		},

		attachFiles: function () {
			var thisComp = this;

			$("#atachFiles").select2({
				tags: true,
				data: Object.keys(thisComp.state.fileObject),
				placeholder: "10 files max, not more than " + app.user.get('userPlan')['planData']['attSize'] + ' Mb total',
				tokenSeparators: ["/"],
				maximumSelectionLength: 10,
				formatSelectionTooBig: 'Max of 10 files allowed.',
				//formatSelection: app.globalF.fileSelection,
				language: {
					maximumSelected: function () {
						return 'Your plan is limited to 10 files per email.';
					},
					noResults: function () {
						return "Click on icon to select file";
					}
				},
				templateSelection: app.globalF.fileSelection,
				escapeMarkup: function (m) {
					return m;
				}
				//templateSelection: app.globalF.emailSelection,
				//escapeMarkup: function(m) {
				//	return m;
				//}
			});
		},

		toBCCSelect: function () {
			var thisComp = this;

			$("#toBCCRcpt").select2({
				debug: true,
				tags: true,
				data: thisComp.state.contactArray,
				placeholder: "Recipient can not see each other emails. Maximum " + app.user.get('userPlan')['planData']['recipPerMail'] + " recipients per mail",
				tokenSeparators: [";"],
				minimumInputLength: 2,
				maximumInputLength: 250,
				maximumSelectionLength: thisComp.state.recipientLimit,
				language: {
					maximumSelected: function () {
						return 'Your plan is limited to ' + app.user.get('userPlan')['planData']['recipPerMail'] + ' recipients per email. Please upgrade plan to raise limit.';
					}
				},
				templateSelection: app.globalF.emailSelection,
				escapeMarkup: function (m) {
					return m;
				}
			});
		},

		checkRcpt: function (callback) {

			var total = 0;

			var allList = {
				'to': {},
				'cc': {},
				'bcc': {},
				'noDups': {}
			};
			//var allListNoDups={};
			var requestHashes = [];
			var allListWHash = {};

			//var noDupsWithEmails=[];

			var AllRecipients = {};
			var AllRecipientsByEmail = {};

			var AllRecipientsNoBcc = {};
			var AllRecipientsonlyBcc = {};

			var thisComp = this;

			var contacts = app.user.get('contacts');

			var rcpt = $("#toRcpt").val();
			var ccRcpt = $("#toCCRcpt").val();
			var bccRcpt = $("#toBCCRcpt").val();

			if (rcpt == null) {
				rcpt = [];
			} else {
				total += rcpt.length;

				$.each(rcpt, function (index, value) {
					if (!app.transform.check64str(value)) {
						var parsed = app.globalF.parseEmail(value);
						var ind = app.transform.to64str(parsed['email']);

						allList['to'][ind] = { 'name': app.transform.to64str(parsed['name']), 'dest': 'to' };
						allList['noDups'][ind] = { 'name': app.transform.to64str(parsed['name']), 'dest': 'to' };
					} else {

						allList['to'][value] = { 'name': '', 'dest': 'to' };
						allList['noDups'][value] = { 'name': '', 'dest': 'to' };
					}
				});
			}

			if (ccRcpt == null) {
				ccRcpt = [];
			} else {
				total += ccRcpt.length;

				$.each(ccRcpt, function (index, value) {
					if (!app.transform.check64str(value)) {
						var parsed = app.globalF.parseEmail(value);
						var ind = app.transform.to64str(parsed['email']);

						allList['cc'][ind] = { 'name': app.transform.to64str(parsed['name']), 'dest': 'cc' };
						allList['noDups'][ind] = { 'name': app.transform.to64str(parsed['name']), 'dest': 'cc' };
					} else {

						allList['cc'][value] = { 'name': '', 'dest': 'cc' };
						allList['noDups'][value] = { 'name': '', 'dest': 'cc' };
					}
				});
			}

			if (bccRcpt == null) {
				bccRcpt = [];
			} else {
				total += bccRcpt.length;

				$.each(bccRcpt, function (index, value) {
					if (!app.transform.check64str(value)) {
						var parsed = app.globalF.parseEmail(value);
						var ind = app.transform.to64str(parsed['email']);

						allList['bcc'][ind] = { 'name': app.transform.to64str(parsed['name']), 'dest': 'bcc' };
						allList['noDups'][ind] = { 'name': app.transform.to64str(parsed['name']), 'dest': 'bcc' };
					} else {

						allList['bcc'][value] = { 'name': '', 'dest': 'bcc' };
						allList['noDups'][value] = { 'name': '', 'dest': 'bcc' };
					}
				});
			}

			var dataResult = {
				'total': total,
				'allList': allList
			};

			//console.log(dataResult);

			if (Object.keys(allList['noDups']).length > 0) {
				var pinEnabled = thisComp.state.enablePin;
				var pin = thisComp.state.pinText;

				$.each(allList['noDups'], function (email64, data) {

					if (contacts[email64] != undefined) {
						var ind = app.transform.SHA512(app.transform.from64str(email64));

						AllRecipients[ind] = {
							'email': email64,
							'name': contacts[email64]['n'],
							'destination': data['dest'],
							'internal': false,
							'pin': pinEnabled ? pin : "",
							'publicKey': contacts[email64]['pgpOn'] === true ? contacts[email64]['pgp'] : ""
						};
						AllRecipientsByEmail[email64] = AllRecipients[ind];

						requestHashes.push(ind);
					} else {
						//	console.log(email64);
						var newCont = app.transform.from64str(email64);

						AllRecipients[app.transform.SHA512(newCont)] = {
							'email': email64,
							'name': email64 != data['name'] ? data['name'] : "",
							'destination': data['dest'],
							'internal': false,
							'pin': pinEnabled ? pin : "",
							'publicKey': ""
						};
						AllRecipientsByEmail[email64] = AllRecipients[app.transform.SHA512(newCont)];
						requestHashes.push(app.transform.SHA512(newCont));
					}
				});
				var post = {
					'mails': JSON.stringify(requestHashes)
				};

				var newHash = app.transform.SHA256(JSON.stringify(requestHashes));
				// console.log(newHash)
				//     console.log(thisComp.state.oldPublicKeysHash)

				if (newHash != thisComp.state.oldPublicKeysHash) {
					// oldPublicKeys:{},
					//oldPublicKeysHash:""

					app.serverCall.ajaxRequest('retrievePublicKeys', post, function (result) {
						if (result['response'] == "success") {

							$.each(result['data'], function (index, emailData) {
								//allListWHash[index]['internal']=1;
								AllRecipients[index]['internal'] = true;
								AllRecipients[index]['v'] = emailData['v'];
								AllRecipients[index]['publicKey'] = emailData['mailKey'];

								AllRecipientsByEmail[AllRecipients[index]['email']] = AllRecipients[index];
							});

							thisComp.setState({
								//recipientList:allListWHash,
								oldPublicKeys: AllRecipientsByEmail,
								oldPublicKeysHash: newHash,
								allEmails: AllRecipientsByEmail
							}, function () {
								thisComp.verifyIfencrypted();
								if (typeof callback !== 'undefined') {
									callback(dataResult);
								}
							});
						}
					});
					thisComp.setState({
						oldPublicKeysHash: newHash
					});
				} else {
					AllRecipientsByEmail = thisComp.state.oldPublicKeys;
					if (typeof callback !== 'undefined') {
						thisComp.verifyIfencrypted();
						callback(dataResult);
					}
				}
			} else {
				thisComp.setState({
					//recipientList:allListWHash,
					oldPublicKeysHash: "",
					allEmails: {}
				}, function () {
					thisComp.verifyIfencrypted();
				});
			}

			return dataResult;
		},

		countTotalRcpt: function () {
			var total = 0;
			var thisComp = this;

			var rcpt = $("#toRcpt").val();
			var ccRcpt = $("#toCCRcpt").val();
			var bccRcpt = $("#toBCCRcpt").val();

			if (rcpt != null) {
				total += rcpt.length;
			}
			if (ccRcpt != null) {
				total += ccRcpt.length;
			}
			if (bccRcpt != null) {
				total += bccRcpt.length;
			}

			return total;
			/*
   	$.each(this.state.contactArray, function( index, contactData ) {
   	//console.log(contactData);
   	if(contactData!=undefined && $.inArray( contactData['id'], rcpt )!=-1){
   		thisComp.setState({
   			contactArray:app.globalF.arrayRemove(thisComp.state.contactArray,index)
   		});
   	}
   });
   */

			//console.log(this.state.contactArray)
		},

		getEmailHash: function () {

			var prehash = {
				from: this.state.fromEmail,
				to: this.checkRcpt()['allList'],
				subject: app.globalF.stripHTML(this.state.subject.substring(0, 150)),
				pin: this.state.pinText,
				pinEnabled: this.state.enablePin,
				body: $('#composeEmail').code(),
				attachment: this.state.fileObject
			};

			//console.log(prehash);
			return app.transform.SHA512(JSON.stringify(prehash));
		},
		prepareToSafeDraft: function (action, callback) {

			var thisComp = this;
			var changedHash = this.getEmailHash();
			clearInterval(this.state.savingDraft);

			if (this.state.originalHash != changedHash || action == 'force') {

				//console.log('changed');

				this.setState({
					originalHash: changedHash
					//messageUnsaved:""
				});

				var d = new Date();

				//todo get rid of global draftView
				//var draft=app.user.get('draftMessageView');
				var draft = {
					'meta': {},
					'attachment': {},
					'body': {}
				};

				draft['messageId'] = thisComp.state.messageId;

				draft['body'] = {
					'text': app.transform.to64str(app.globalF.stripHTML($('#composeEmail').code())),
					'html': app.transform.to64str(app.globalF.filterXSSwhite($('#composeEmail').code()))
				};
				draft['meta']['from'] = $('#fromSender').val();
				draft['meta']['to'] = this.checkRcpt()['allList']['to'];
				draft['meta']['toCC'] = this.checkRcpt()['allList']['cc'];
				draft['meta']['toBCC'] = this.checkRcpt()['allList']['bcc'];

				draft['meta']['attachment'] = Object.keys(this.state.fileObject).length > 0 ? 1 : 0;
				draft['meta']['body'] = app.transform.to64str(app.globalF.stripHTML($('#composeEmail').code()).substring(0, 50));
				//draft['meta']['from']=$('#fromSender').val();
				//draft['meta']['to']=this.checkRcpt()['noDupsWithEmails'];
				draft['meta']['opened'] = true;
				draft['meta']['pin'] = app.transform.to64str(thisComp.state.pinText);
				draft['meta']['pinEnabled'] = thisComp.state.enablePin;
				draft['meta']['status'] = "normal";
				draft['meta']['subject'] = app.transform.to64str(app.globalF.stripHTML(thisComp.state.subject.substring(0, 150)));
				draft['meta']['timeSent'] = Math.round(d.getTime() / 1000);
				draft['meta']['timeCreated'] = draft['messageId'] == "" ? Math.round(d.getTime() / 1000) : draft['meta']['timeCreated'];
				draft['meta']['timeUpdated'] = Math.round(d.getTime() / 1000);
				draft['meta']['signatureOn'] = true;

				draft['meta']['type'] = 3;
				draft['meta']['version'] = 2;

				draft['meta']['modKey'] = thisComp.state.modKey;

				draft['attachment'] = thisComp.getFileMeta(thisComp.state.fileObject);
				draft['size'] = JSON.stringify(draft['meta']).length + JSON.stringify(draft['body']).length + thisComp.getFilesize(this.state.fileObject);
				draft['modKey'] = thisComp.state.modKey;

				//console.log(draft);


				app.globalF.saveDraft(draft, thisComp.state.isMounted, function (result, uniqDraftId) {
					//console.log('saved');
					// console.log(thisComp.state.isMounted);
					// console.log(uniqDraftId);

					if (thisComp.state.isMounted === uniqDraftId) {
						thisComp.setState({
							messageId: result['messageId'],
							modKey: result['modKey']
						}, function () {
							// console.log(thisComp.state.messageId);
							//console.log(thisComp.state.modKey);

							app.globalF.syncUpdates();

							callback();
						});
					}

					//
				});

				thisComp.draftSaveInterval();
			} else {
				thisComp.draftSaveInterval();
				callback();
			}
		},

		getFileMeta: function (fileObject) {

			var tempObj = jQuery.extend(true, {}, this.state.fileObject);

			if (Object.keys(tempObj).length > 0) {

				$.each(tempObj, function (index, value) {
					delete tempObj[index]['data'];
				});
			}

			return tempObj;
		},

		getFilesize: function (fileObject) {
			var fSize = 0;
			if (Object.keys(fileObject).length > 0) {
				$.each(fileObject, function (index, value) {
					//	console.log(app.transform.from64str(value['size']));
					fSize += parseInt(app.transform.from64str(value['size']));
				});
			}

			return fSize;
		},

		fileTag: function () {
			if (Object.keys(this.state.fileObject).length > 0) {
				$.each(this.state.fileObject, function (index, value) {
					$('#file_' + app.transform.SHA1(index) + ' >i').removeClass();
					$('#file_' + app.transform.SHA1(index)).parent().addClass('file-uploaded');
				});
			}
		},

		readFile: function (event) {
			var thisComp = this;

			$.each($(event)[0].target.files, function (index, fileData) {

				var file = fileData;

				var fileObject = thisComp.state.fileObject;
				//	console.log(file);


				if (Object.keys(thisComp.state.fileObject).length <= 10 && thisComp.state.fileSize + file['size'] <= parseInt(app.user.get('userPlan')['planData']['attSize']) * 1024 * 1024 * 1.1) {
					if (file['size'] < parseInt(app.user.get('userPlan')['planData']['attSize']) * 1024 * 1024 * 1.1) {
						if (Object.keys(fileObject).indexOf(app.transform.to64str(file['name'])) == -1) {
							app.user.set({
								'uploadInProgress': true
							});

							var reader = new FileReader();

							reader.onload = function (e) {

								var binary_string = '';
								var bytes = new Uint8Array(reader.result);
								for (var i = 0; i < bytes.byteLength; i++) {
									binary_string += String.fromCharCode(bytes[i]);
								}

								//var binary_string = reader.result;

								// console.log(reader.result);

								//var fileSize= thisComp.state.fileSize;

								var fname = app.transform.to64str(file['name']);
								fileObject[fname] = {};

								fileObject[fname]['base64'] = true;
								fileObject[fname]['data'] = app.transform.to64bin(binary_string);
								fileObject[fname]['name'] = app.transform.to64str(file['name']);
								fileObject[fname]['key'] = app.transform.to64bin(app.globalF.createEncryptionKey256());

								fileObject[fname]['fileName'] = 'toBeDetermenedAfterFileSave';
								fileObject[fname]['size'] = app.transform.to64str(file['size']);
								fileObject[fname]['type'] = app.transform.to64str(file['type']);
								fileObject[fname]['modKey'] = app.globalF.makeModKey();
								fileObject[fname]['v'] = 2;

								var list = Object.keys(fileObject);

								selectedValues = [];

								$('#atachFiles').children().remove();

								if (list.length > 0) {
									$.each(list, function (index, value) {
										//	list[index]=forge.util.decode64(value);
										$("#atachFiles").append('<option value="' + value + '">' + app.transform.from64str(value) + '</option>');
										selectedValues.push(value);
									});
								}
								thisComp.handleClick('showAtt');

								$("#atachFiles").val(selectedValues).trigger('change');

								thisComp.fileUpload();
							};

							thisComp.setState({
								uploadProgress: 15,
								sizeBarText: "Encrypting File"

							}, function () {
								reader.readAsArrayBuffer(file);
							});

							//   reader.readAsDataURL(file);

						}
					} else {
						app.notifications.systemMessage('tooBig');
					}
				} else {
					app.notifications.systemMessage('MaxFiles');
				}
			});

			$('#ddd').val("");
		},

		fileUpload: function () {
			//console.log('uploading file')

			clearInterval(this.state.savingDraft);

			//thisComp.draftSaveInterval();
			var thisComp = this;

			var oldList = this.state.prevFileObject;
			var newList = this.state.fileObject;
			var fileList = {};

			$.each(newList, function (fName, fData) {
				if (oldList[fName] == undefined) {
					fileList = {
						'index': fName,
						'modKey': fData['modKey'],
						'key': fData['key']
					};
				}
			});

			//$('#file_'+app.transform.SHA1(fileList['index'])+' >i').addClass('fa fa-spin fa-refresh');
			//$('#file_'+app.transform.SHA1(fileList['index'])).parent().removeClass('file-uploaded');

			/*var upProgress=setInterval(function(){
   	thisComp.setState({
   		uploadProgress:app.serverCall.get("uploadProgress")
   	})
   },1000);*/

			// console.log(app.serverCall.get("uploadProgress"));

			thisComp.setState({
				prevFileObject: Object.keys(newList),
				//uploadInterval:upProgress,
				showUploadBar: ""
			});

			thisComp.prepareToSafeDraft('force', function () {

				thisComp.setState({
					uploadProgress: 50,
					sizeBarText: "Uploading File"

				});
				app.globalF.sendNewAttachment(newList, fileList, thisComp.state.messageId, thisComp.state.modKey, function (result) {
					clearInterval(thisComp.state.uploadInterval);

					if (result['response'] == "success") {

						newList[fileList['index']]['fileName'] = result['fileName'];
						delete newList[fileList['index']]['data'];

						//todo move into save draft part
						//$('#file_'+app.transform.SHA1(fileList['index'])+' >i').removeClass();
						//$('#file_'+app.transform.SHA1(fileList['index'])).parent().addClass('file-uploaded');

						thisComp.setState({
							uploadProgress: 100,
							sizeBarText: "File Successfully Uploaded",
							showUploadBar: "hidden"
						});
						app.user.set({
							'uploadInProgress': false
						});

						thisComp.addFileLink();

						//thisComp.draftSaveInterval();
						thisComp.prepareToSafeDraft("", function () {});
						//fileTag

						thisComp.setState({
							fileSize: thisComp.getFilesize(newList)
						});
					} else if (result['fileSize'] == "overLimit") {
						app.notifications.systemMessage('MaxFiles');
						app.user.set({
							'uploadInProgress': false
						});
					} else {
						app.user.set({
							'uploadInProgress': false
						});

						$('#file_' + app.transform.SHA1(fileList['index']) + ' >i').removeClass();
						$('#file_' + app.transform.SHA1(fileList['index'])).parent().addClass('file-upload-failed');
					}
				});
			});
		},

		addFileLink: function () {

			var time = new Date(new Date().setYear(new Date().getFullYear() + 1));

			if (this.state.emailProtected === 3 || this.state.emailProtected === 1) {
				$(".fileattach").remove();
			} else {
				$(".fileattach").remove();
				var linkbody = "<br/><div class='fileattach' style='background-color:#F2F2F2;'><span>Files will be available for download until " + time.toLocaleString() + "<br/><br/>";

				var fileObj = this.state.fileObject;
				//console.log(fileObj);
				var c = 1;
				$.each(fileObj, function (fName, fData) {

					linkbody += '<div style="clear:both; margin-top:5px;">' + app.transform.from64str(fName) + ' <a href="' + app.defaults.get('domain') + '/api/dFV2/' + fData['fileName'] + "1/p/" + app.transform.bin2hex(app.transform.from64bin(fData['key'])) + '" target="_blank">Click to download file</a></div>';
					c++;
				});

				linkbody += "</div>";

				if (Object.keys(fileObj).length > 0) {
					$(linkbody).insertBefore(".emailsignature");

					if ($('.emailsignature').length == 0) {
						$('.note-editable').append(linkbody);
					}
				}
			}
		},
		fileRemove: function (fileName64, callback) {

			//console.log('removing file');

			//console.log(fileName64);
			clearInterval(this.state.savingDraft);
			var thisComp = this;
			var fileObject = thisComp.state.fileObject;
			var fileSize = thisComp.state.fileSize;

			var fileList = {
				'fileName': fileObject[fileName64]['fileName'],
				'modKey': fileObject[fileName64]['modKey']
			};

			app.serverCall.ajaxRequest('removeFileFromDraft', fileList, function (result) {

				if (result['response'] == 'success') {

					delete fileObject[fileName64];

					thisComp.setState({
						fileSize: thisComp.getFilesize(fileObject),
						prevFileObject: Object.keys(fileObject)
					});

					$('#atachFiles').children().remove();

					selectedValues = [];

					$('#atachFiles').children().remove();

					if (Object.keys(fileObject).length > 0) {
						$.each(Object.keys(fileObject), function (index, value) {
							//	list[index]=forge.util.decode64(value);
							$("#atachFiles").append('<option value="' + value + '">' + app.transform.from64str(value) + '</option>');
							selectedValues.push(value);
						});
					} else {
						thisComp.setState({
							showAtt: "hidden"
						});
					}
					$("#atachFiles").val(selectedValues).trigger('change');
					thisComp.addFileLink();
					thisComp.fileTag();
					thisComp.prepareToSafeDraft("", function () {});
					callback();
				} else {
					app.notifications.systemMessage('tryAgain');
				}
			});
		},

		handleChange: function (i, event) {
			switch (i) {

				case "getFile":
					this.setState({
						uploadProgress: 15,
						sizeBarText: "Reading File"

					});

					this.readFile(event);
					break;
				case "toggleEnablePin":
					var thisComp = this;

					// console.log('dada');
					thisComp.setState({
						enablePin: !this.state.enablePin
					}, function () {
						thisComp.verifyIfencrypted();
					});

					break;
				case "fromSelecting":
					var thisComp = this;
					// console.log(event.target.value);
					thisComp.setState({
						fromEmail: event.target.value
					}, function () {
						//console.log('sigs');
						thisComp.setState({
							signature: app.globalF.filterXSSwhite(app.transform.from64str(this.fromField('sig')))
						}, function () {
							//	console.log(thisComp.state.fromEmail);
							//	console.log(thisComp.state.signature);
							$('.emailsignature').html(thisComp.state.signature);
						});
					});

					break;

				case "changeRcpt":
					//console.log(event);
					break;

				case "enterSubject":
					var thisComp = this;
					thisComp.setState({
						subject: event.target.value
					});
					break;

				case "enterPinText":
					var thisComp = this;
					thisComp.setState({
						pinText: event.target.value,
						userPin: false
					}, function () {
						thisComp.verifyIfencrypted();
					});
					break;

			}
		},

		handleClick: function (i) {
			switch (i) {

				case 'detectDirection':
					var arrow = $('.navArrow1');

					// if(arrow.hasClass('fa-long-arrow-left')){
					app.layout.display('left');
					// }else{
					//    app.layout.display('right');
					// }

					break;

				case 'email':
					$('#col1').toggleClass('hide');
					$('#view-mail-wrapper').toggleClass('visible-lg');

					break;
				case 'emailBig':
					$('#view-mail-wrapper').toggleClass('col-lg-6 auto');
					$('#col1').toggleClass('hide');
					$('.fa-chevron-left').toggleClass('fa-rotate-180');
					//$('#view-mail-wrapper').toggleClass('visible-lg');
					break;

				case 'showCC':

					this.setState({
						showCC: ""
					});
					break;
				case 'showBCC':

					this.setState({
						showBCC: ""
					});
					break;
				case 'showAtt':

					this.setState({
						showAtt: ""
					});
					break;
				case 'showPin':

					this.setState({
						showPin: ""
					});
					break;

				case 'attachFile':
					fileSelector.click();
					//this.setState({
					//	showPin:""
					//});
					break;

				case 'sendEmail':
					var thisComp = this;
					//preparation to send email
					/*
     1)stop draft saving
     2)gather all infor for email
     3)detect recipients protection level
     4)encrypt email
     5)send out
     6)close email
      */

					thisComp.setState({
						sendingProgress: true
					});

					var saveDraft = $.Deferred();

					thisComp.prepareToSafeDraft("force", function () {
						// console.log('resolved');
						saveDraft.resolve();
					});

					if (thisComp.checkRcpt()['total'] > 0) {
						saveDraft.done(function () {

							clearInterval(thisComp.state.savingDraft);

							var d = new Date();

							var draft = {
								'body': {},
								'meta': {}
							};

							draft['body'] = {
								'text': app.transform.to64str(app.globalF.stripHTML($('#composeEmail').code())),
								'html': app.transform.to64str(app.globalF.filterXSSwhite($('#composeEmail').code()))
							};

							draft['meta']['from'] = app.user.get('allKeys')[$('#fromSender').val()]['displayName'];
							draft['meta']['to'] = thisComp.checkRcpt()['allList']['to'];
							draft['meta']['toCC'] = thisComp.checkRcpt()['allList']['cc'];
							draft['meta']['toBCC'] = thisComp.checkRcpt()['allList']['bcc'];

							draft['meta']['attachment'] = 0;
							draft['meta']['body'] = app.transform.to64str(app.globalF.stripHTML($('#composeEmail').code()).substring(0, 50));
							//draft['meta']['from']=$('#fromSender').val();
							//draft['meta']['to']=thisComp.checkRcpt()['noDupsWithEmails'];
							draft['meta']['opened'] = true;
							draft['meta']['pin'] = app.transform.to64str(thisComp.state.pinText);
							draft['meta']['pinEnabled'] = thisComp.state.enablePin;
							draft['meta']['status'] = "normal";
							draft['meta']['subject'] = app.transform.to64str(app.globalF.stripHTML(thisComp.state.subject.substring(0, 150)));
							draft['meta']['timeSent'] = Math.round(d.getTime() / 1000);
							draft['meta']['timeCreated'] = draft['messageId'] == "" ? Math.round(d.getTime() / 1000) : draft['meta']['timeCreated'];
							draft['meta']['timeUpdated'] = Math.round(d.getTime() / 1000);
							draft['meta']['signatureOn'] = true;

							draft['meta']['type'] = 3;
							draft['meta']['version'] = 2;

							draft['attachment'] = jQuery.extend(true, {}, thisComp.state.fileObject);

							thisComp.checkRcpt(function (result) {

								app.globalF.prepareForSending(draft, thisComp.state.allEmails, result, thisComp.state.emailProtected, thisComp.state.messageId, thisComp.state.pinText).then(function (response) {

									app.globalF.syncUpdates();
									app.globalF.resetCurrentMessage();
									app.globalF.resetDraftMessage();

									Backbone.history.navigate("/mail/" + app.user.get("currentFolder"), {
										trigger: true
									});
									app.layout.display('viewBox');
									// console.log('good');
								}).fail(function (error) {
									//  console.log(error);
									var emailId = thisComp.state.messageId;
									var messages = app.user.get('emails')['messages'];
									var origFolder = app.user.get("systemFolders")['draftFolderId'];
									messages[emailId]['tp'] = 3;

									app.globalF.move2Folder(origFolder, [emailId], function () {
										if (error['data'] != "email2often") {
											app.notifications.systemMessage('tryAgain');
										} else if (error['data'] == "email2often") {
											app.notifications.systemMessage('email2often');
										} else if (error['data'] == 'attachmentError') {
											app.notifications.systemMessage('reuploadAttachm');
										}
									});

									thisComp.setState({
										sendingProgress: false
									});
								});
							});
						});
					} else {
						thisComp.setState({
							sendingProgress: false
						});
						app.notifications.systemMessage('noRecpnts');
					}

					break;

				case 'deleteDraft':

					if (this.state.messageId == "") {
						Backbone.history.navigate("/mail/" + app.user.get("currentFolder"), {
							trigger: true
						});
						$('#sdasdasd').addClass("hidden");
						$('#mMiddlePanelTop').removeClass(' hidden-xs hidden-sm hidden-md');
						$('#mRightPanel').addClass('hidden-xs hidden-sm hidden-md');
					} else {
						var thisComp = this;
						$('#dialogModHead').html("Delete Draft Email");
						$('#dialogModBody').html("Continue?");

						$('#dialogOk').on('click', function () {

							if (Object.keys(thisComp.state.fileObject).length > 0) {
								$.each(thisComp.state.fileObject, function (index, data) {
									thisComp.fileRemove(index, function () {
										var selected = [];
										selected.push(thisComp.state.messageId);
										// console.log(selected);

										if (selected.length > 0) {
											//delete email physically;
											app.globalF.resetCurrentMessage();
											app.globalF.resetDraftMessage();

											app.globalF.deleteEmailsFromFolder(selected, function (emails2Delete) {
												//console.log(emails2Delete);
												if (emails2Delete.length > 0) {
													app.userObjects.updateObjects('deleteEmail', emails2Delete, function (result) {
														app.globalF.syncUpdates();
														$('#dialogPop').modal('hide');
														Backbone.history.navigate("/mail/" + app.user.get("currentFolder"), {
															trigger: true
														});
													});
												}
											});
										}
									});
								});
							} else {
								var selected = [];
								selected.push(thisComp.state.messageId);
								//  console.log(selected);

								if (selected.length > 0) {
									//delete email physically;

									app.globalF.resetCurrentMessage();
									app.globalF.resetDraftMessage();

									app.globalF.deleteEmailsFromFolder(selected, function (emails2Delete) {
										//console.log(emails2Delete);
										if (emails2Delete.length > 0) {
											app.userObjects.updateObjects('deleteEmail', emails2Delete, function (result) {
												app.globalF.syncUpdates();

												$('#dialogPop').modal('hide');
												Backbone.history.navigate("/mail/" + app.user.get("currentFolder"), {
													trigger: true
												});
											});
										}
									});
								}
							}
						});

						$('#dialogPop').modal('show');

						//console.log(thisComp.state.fileObject);
						//this.fileRemove(fileName64);
					}

					break;

			}
		},

		componentWillUpdate: function (nextProps, nextState) {

			if (nextState.prevFileObject.length < Object.keys(this.state.fileObject).length) {}
			//this.fileUpload();

			//if(nextState.prevFileObject.length >Object.keys(this.state.fileObject).length){
			//	this.fileRemove(function(){});
			//}
			//this.verifyIfencrypted();
		},
		componentDidUpdate: function () {
			//this.verifyIfencrypted();
			//	this.activateTooltips();
			$('[data-toggle="popover"]').popover({ container: 'body' });

			$('[data-toggle="popover"]').on('shown.bs.popover', function () {
				var $pop = $(this);
				setTimeout(function () {
					$pop.popover('hide');
				}, 5000);
			});

			this.fileTag();
		},

		fromField: function (action) {
			var thisComp = this;
			var keys = app.user.get("allKeys");
			var options = [];
			var from = this.state == undefined ? app.user.get('draftMessageView')['meta']['from'] : this.state.fromEmail;

			//if( typeof someVar === 'string' ) {
			//	someVar = [ someVar ];
			//}

			var signature = "";
			var stateFrom = "";
			$.each(keys, function (index, keyValue) {

				//console.log();
				var emailRaw = app.transform.from64str(keyValue['name']) + " <" + app.transform.from64str(keyValue['email']) + ">";
				//console.log(emailRaw);
				var parsedEmail = app.globalF.parseEmail(emailRaw);
				//console.log(parsedEmail);

				if (keyValue['canSend']) {
					options.push(React.createElement(
						'option',
						{ key: index, value: index },
						parsedEmail['display']
					));
				}
				//console.log(thisComp.state.fromEmail)
				//console.log(this.state.fromEmail);

				//if(keyValue['isDefault'] && from==""){
				//	stateFrom=index;

				//thisComp.setState({
				//	from:index
				//	})

				//}


				//if from isset
				if (from != "" && from == index && keyValue['includeSignature']) {
					signature = keyValue['signature'];
					//thisComp.setState({
					//	signature:keyValue['signature'],
					//body:keyValue['signature']
					//})

					//console.log('signature');
					//console.log(keyValue['signature']);
				} else if (from == "" && keyValue['isDefault'] && keyValue['includeSignature']) {
					signature = keyValue['signature'];
					//thisComp.setState({
					//	signature:keyValue['signature'],
					//body:keyValue['signature']
					//})

					//console.log('signature2');
					//console.log(keyValue['signature']);
				}
			});

			//	console.log(options);
			if (action == 'from') {
				return options;
			}
			if (action == 'sig') {
				return signature;
			}
			//if(action=='fromState'){
			//	return stateFrom;
			//}

			//this.setState({
			//	fromOptions:options
			//})

		},

		render: function () {

			//var hide=app.user.get('currentMessageView')['id']==undefined?true:false;
			var rightClass = "RightRight col-lg-6 visible-lg";

			var size = this.state.fileSize;

			var size = size > 100000 ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';

			var protect = "";

			//if(this.state.emailProtected!=""){
			if (this.state.emailProtected == -1) {
				protect = "";
			} else if (this.state.emailProtected == 0) {
				protect = React.createElement(
					'button',
					{ className: 'btn btn-default btn-sm', 'data-placement': 'bottom', 'data-toggle': 'popover', 'data-trigger': 'focus', title: '', 'data-content': 'Email will be sent unencrypted. Third party can possibly read your message, attachments, recipients and sender.', 'data-original-title': 'Encryption Level: No Protection.' },
					React.createElement('i', { className: 'fa fa-eye fa-lg txt-color-red' }),
					' Clear Text'
				);
			} else if (this.state.emailProtected == 1) {
				protect = React.createElement(
					'button',
					{ className: 'btn btn-default btn-sm', 'data-placement': 'bottom', 'data-toggle': 'popover', 'data-trigger': 'focus', title: '', 'data-content': 'Email will be PIN encrypted and stored on our server. Recipient(s) need to know PIN to read email. Third party can not read email or attachment, but have access to subject and sender information.', 'data-original-title': 'Encryption Level: Medium' },
					React.createElement('i', { className: 'fa fa-eye-slash fa-lg txt-color-yellow' }),
					'PIN'
				);
			} else if (this.state.emailProtected == 2) {
				protect = React.createElement(
					'button',
					{ className: 'btn btn-default btn-sm', 'data-placement': 'bottom', 'data-toggle': 'popover', 'data-trigger': 'focus', title: '', 'data-content': 'Email will be sent PGP encrypted. Third party can not read email or attachments, but have access to metadata information (subject,recipients, sender)', 'data-original-title': 'Encryption Level: Medium' },
					React.createElement('i', { className: 'fa fa-eye-slash fa-lg txt-color-yellow' }),
					' PGP'
				);
			} else if (this.state.emailProtected == 3) {
				protect = React.createElement(
					'button',
					{ className: 'btn btn-default btn-sm', 'data-placement': 'bottom', 'data-toggle': 'popover', 'data-trigger': 'focus', title: '', 'data-content': 'Email will be sent within cyberfear system. All information is encrypted, including: subject, recipients and sender.', 'data-original-title': 'Encryption Level: High' },
					React.createElement('i', { className: 'fa fa-lock fa-lg txt-color-greenDark' })
				);
			}

			//}


			//var changedHash=this.getEmailHash();

			//if(this.state.originalHash!=changedHash){
			//var messageUnsaved="hidden";
			//}else{
			var messageUnsaved = "hidden";
			//console.log(this.state.fromEmail);
			//}
			var sizeBar = { width: this.state.uploadProgress + "%" };
			var sizeBarText = this.state.sizeBarText + " " + this.state.uploadProgress + "%";
			return React.createElement(
				'div',
				{ className: this.props.panel.rightPanel, id: 'mRightPanel' },
				React.createElement(
					'div',
					{ className: "emailNo " + (this.state.hideEmailRead ? "" : "hidden") },
					React.createElement(
						'h3',
						null,
						'Please Select Email'
					)
				),
				React.createElement(
					'div',
					{ className: "emailShow " + (this.state.hideEmailRead ? "hidden" : "") },
					React.createElement(
						'div',
						{ className: 'email-compose-icons col-xs-12' },
						React.createElement(
							'button',
							{ className: 'btn btn-default pull-left hidden-sm hidden-md hidden-lg', rel: 'tooltip', title: '', 'data-placement': 'bottom', 'data-original-title': 'Resize', type: 'button', onClick: this.handleClick.bind(this, 'detectDirection') },
							React.createElement('i', { className: 'navArrow1 fa fa-long-arrow-left fa-lg' })
						),
						React.createElement(
							'div',
							{ className: 'btn-group pull-left hidden' },
							React.createElement(
								'button',
								{ className: 'btn btn-default', id: 'reply1', rel: 'tooltip', title: '', 'data-toggle': 'dropdown', 'data-placement': 'top', 'data-original-title': 'Reply', type: 'button', onclick: '' },
								React.createElement('i', { className: 'fa fa-reply fa-lg' }),
								' ',
								React.createElement('i', { className: 'fa fa-angle-down fa-lg' })
							),
							React.createElement(
								'ul',
								{ id: 'reply', className: 'dropdown-menu' },
								React.createElement(
									'li',
									null,
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'addNewTag') },
										React.createElement('i', { className: 'ion ion-reply ion-lg' }),
										' Reply'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'addNewTag') },
										React.createElement('i', { className: 'ion ion-reply-all ion-lg' }),
										' Reply All'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'addNewTag') },
										React.createElement('i', { className: 'ion ion-forward ion-lg' }),
										' Forward'
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'btn-group boxEmailOption hidden' },
							React.createElement(
								'button',
								{ className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
								'More ',
								React.createElement('i', { className: 'fa fa-angle-down fa-lg' })
							),
							React.createElement(
								'ul',
								{ className: 'dropdown-menu pull-right' },
								React.createElement(
									'li',
									null,
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'togglePlainHTML') },
										'HTML / Plain'
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'pull-right email-status' },
							React.createElement(
								'span',
								{ className: 'ion ion-record ion-color-bad hidden' },
								'\xA0'
							),
							React.createElement(
								'span',
								{ className: 'ion ion-record ion-color-good hidden' },
								'\xA0'
							),
							React.createElement(
								'span',
								{ className: 'ion ion-record ion-color-info hidden' },
								'\xA0'
							),
							React.createElement(
								'span',
								{ className: 'ion ion-record ion-color-warning hidden' },
								'\xA0'
							),
							React.createElement(
								'span',
								{ className: messageUnsaved },
								'Message Saved in Draft'
							),
							protect,
							React.createElement(
								'button',
								{ className: 'btn btn-primary btn-sm', disabled: this.state.sendingProgress, onClick: this.handleClick.bind(this, 'sendEmail'), id: 'sendingEmail' },
								React.createElement('i', { className: this.state.sendingProgress === true ? 'fa fa-refresh fa-spin' : "" }),
								this.state.sendingProgress === true ? "Sending" : "Send"
							),
							React.createElement(
								'button',
								{ className: "btn btn-danger btn-sm ", 'data-placement': 'bottom', 'data-toggle': 'popover-hover', 'data-trigger': 'focus', title: '', 'data-content': 'Delete message', 'data-original-title': '', onClick: this.handleClick.bind(this, 'deleteDraft'), disabled: this.state.sendingProgress },
								React.createElement('i', { className: 'fa fa-trash fa-lg' })
							)
						)
					),
					React.createElement('div', { className: 'clearfix' }),
					React.createElement(
						'div',
						{ className: 'email-header-compose' },
						React.createElement(
							'header',
							null,
							React.createElement(
								'div',
								{ className: 'form-horizontal' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										{ className: 'col-xs-2 control-label' },
										'From'
									),
									React.createElement(
										'div',
										{ className: 'col-xs-10 no-padding col-sm-10 no-padding' },
										React.createElement(
											'select',
											{ className: 'form-control', id: 'fromSender', value: this.state.fromEmail, onChange: this.handleChange.bind(this, 'fromSelecting') },
											this.state.fromOptions
										)
									)
								)
							),
							React.createElement(
								'div',
								{ className: 'form-horizontal' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										{ htmlFor: 'toRcpt', className: 'col-xs-2 control-label' },
										'To'
									),
									React.createElement(
										'div',
										{ className: 'col-xs-10 no-padding col-sm-10 no-padding' },
										React.createElement('select', { className: 'form-control', id: 'toRcpt', multiple: 'multiple', style: { "width": "100%" } })
									)
								)
							),
							React.createElement(
								'div',
								{ className: "form-horizontal " + this.state.showCC },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										{ htmlFor: 'toCCRcpt', className: 'col-xs-2 control-label' },
										'CC'
									),
									React.createElement(
										'div',
										{ className: 'col-xs-10 no-padding col-sm-10' },
										React.createElement('select', { className: 'form-control', id: 'toCCRcpt', multiple: 'multiple', style: { "width": "100%" } })
									)
								)
							),
							React.createElement(
								'div',
								{ className: "form-horizontal " + this.state.showBCC },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										{ htmlFor: 'toBCCRcpt', className: 'col-xs-2 control-label' },
										'BCC'
									),
									React.createElement(
										'div',
										{ className: 'col-xs-10 no-padding col-sm-10' },
										React.createElement('select', { className: 'form-control', id: 'toBCCRcpt', multiple: 'multiple', style: { "width": "100%" } })
									)
								)
							),
							React.createElement(
								'div',
								{ className: 'form-horizontal' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement('label', { htmlFor: 'inputEmail3', className: 'col-xs-2 control-label' }),
									React.createElement(
										'div',
										{ className: 'col-xs-10 no-padding col-sm-10 no-padding' },
										React.createElement('input', { type: 'text', className: 'form-control', id: 'subject', placeholder: 'Subject', value: this.state.subject, onChange: this.handleChange.bind(this, 'enterSubject') })
									)
								)
							),
							React.createElement(
								'div',
								{ className: "form-horizontal " + this.state.showAtt },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										{ className: 'col-xs-2 control-label atchBut' },
										React.createElement(
											'button',
											{ className: 'btn btn-primary btn-sm', onClick: this.handleClick.bind(this, 'attachFile'), type: 'button' },
											React.createElement('i', { className: 'fa fa-paperclip fa-lg' })
										),
										React.createElement('br', null),
										' ',
										size
									),
									React.createElement(
										'div',
										{ className: 'col-xs-10 no-padding col-sm-10' },
										React.createElement('select', { className: 'form-control', id: 'atachFiles', multiple: 'multiple', style: { "width": "100%" } }),
										React.createElement('input', { type: 'file', id: 'ddd', name: 'files', className: 'hidden', onChange: this.handleChange.bind(this, 'getFile') })
									)
								)
							),
							React.createElement(
								'div',
								{ className: "modal-body " + this.state.showUploadBar },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'div',
										{ className: 'bs-example', 'data-example-id': 'progress-bar-with-label' },
										React.createElement(
											'div',
											{ className: 'progress' },
											React.createElement(
												'div',
												{ className: 'progress-bar', role: 'progressbar', 'aria-valuenow': '60', 'aria-valuemin': '0', 'aria-valuemax': '100',
													style: sizeBar },
												sizeBarText,
												' ',
												React.createElement('i', { className: 'fa fa-refresh fa-spin' })
											)
										)
									)
								)
							),
							React.createElement(
								'div',
								{ className: "form-horizontal " + this.state.showPin },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'label',
										{ htmlFor: 'Pin', className: 'col-xs-2 control-label' },
										React.createElement('i', { className: this.state.enablePin && this.state.pinText != "" ? "fa fa-lock fa-lg" : "fa fa-unlock fa-lg" })
									),
									React.createElement(
										'div',
										{ className: 'input-group col-xs-10 no-padding col-sm-10' },
										React.createElement(
											'span',
											{ className: 'input-group-addon' },
											React.createElement('input', { type: 'checkbox', className: '', id: 'enabPin', checked: this.state.enablePin, onChange: this.handleChange.bind(this, 'toggleEnablePin') })
										),
										React.createElement('input', { type: 'text', className: 'form-control', id: 'pin', placeholder: 'PIN', readOnly: !this.state.enablePin, value: this.state.pinText, onChange: this.handleChange.bind(this, 'enterPinText') })
									)
								)
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement(
								'div',
								{ className: 'ccbuts' },
								React.createElement(
									'a',
									{ className: "btn btn-default " + (this.state.showCC == "" ? "hidden" : ""), onClick: this.handleClick.bind(this, 'showCC'), type: 'button' },
									'CC'
								),
								React.createElement(
									'a',
									{ className: "btn btn-default " + (this.state.showBCC == "" ? "hidden" : ""), onClick: this.handleClick.bind(this, 'showBCC'), type: 'button' },
									'BCC'
								),
								React.createElement(
									'a',
									{ className: "btn btn-default " + (this.state.showAtt == "" ? "hidden" : ""), onClick: this.handleClick.bind(this, 'attachFile'), type: 'button' },
									React.createElement('i', { className: 'fa fa-paperclip fa-lg' })
								),
								React.createElement(
									'a',
									{ className: "btn btn-default hidden", onClick: this.handleClick.bind(this, 'attachFile'), type: 'button' },
									React.createElement('i', { className: 'fa fa-clock-o fa-lg' })
								),
								React.createElement(
									'a',
									{ className: "btn btn-default " + (this.state.showPin == "" ? "hidden" : ""), onClick: this.handleClick.bind(this, 'showPin'), type: 'button' },
									React.createElement('i', { className: 'fa fa-lock fa-lg' })
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'panel emailRead' },
						React.createElement('div', { className: '', id: 'composeEmail' })
					)
				)
			);
		},
		verifyIfencrypted: function () {

			//var recipients=this.state.recipientList;
			var thisComp = this;
			var AllRecipients = this.state.allEmails;
			var internals = {};
			var outsiders = {};
			var pin = this.state.pinText;
			var clearTexter = false;
			var pinProtected = false;
			var pgpProtected = false;
			var allRecip = $.Deferred();
			var protect = 0;

			//allEmails

			if (Object.keys(AllRecipients).length > 0) {
				$.each(AllRecipients, function (index, rcpt) {

					if (rcpt['internal'] === true) {
						internals[index] = rcpt;
					} else {
						outsiders[index] = rcpt;
					}
					if (rcpt['internal'] === false && rcpt['publicKey'] == "" && (thisComp.state.enablePin === false || thisComp.state.pinText == "")) {
						//console.log('clear');
						//console.log(rcpt);
						clearTexter = true;
					}

					if (rcpt['internal'] === false && rcpt['publicKey'] == "" && thisComp.state.enablePin === true && thisComp.state.pinText != "") {
						//console.log('pin')
						pinProtected = true;
					}

					if (rcpt['internal'] === false && rcpt['publicKey'] != "") {
						//console.log('pgp')
						pgpProtected = true;
					}
				});

				if (Object.keys(outsiders).length == 1 && this.state.enablePin === true && this.state.pinText == "" && !this.state.userPin) {
					var contacts = app.user.get('contacts');
					var index = Object.keys(outsiders)[0];
					//console.log(app.transform.from64str(index));

					//console.log(outsiders);
					//	var contId=outsiders[index]['contactId'];
					if (index != "") {
						//	console.log(index);
						//console.log(contacts[index]);
						if (contacts[index] !== undefined) {
							pin = app.transform.from64str(contacts[index]['p']);
						}

						thisComp.setState({
							pinText: pin,
							userPin: true
						}, function () {
							thisComp.verifyIfencrypted();
						});
					}
				}

				if (Object.keys(outsiders).length > 1 && this.state.pinText != "" && this.state.userPin) {
					pin = "";
					thisComp.setState({
						pinText: ""
					});
				}

				var cc = Object.keys(AllRecipients).length;
				var out = Object.keys(outsiders).length;

				$.each(AllRecipients, function (index, emailData) {
					var id = "." + app.transform.SHA256(app.transform.from64str(index));
					var classSpan = "";
					var classI = "";
					if (clearTexter) {
						classSpan = "email-unprotected";
						classI = "fa fa-unlock";
						protect = 0;

						//$(id).parent().removeClass('email-protect email-unprotected email-pinprotected email-pgpprotected').addClass('email-unprotected');
						//$(id+'>i').removeClass().addClass('fa fa-unlock');
					} else if (pinProtected) {
						classSpan = "email-pinprotected";
						classI = "fa fa-lock";
						protect = 1;
						//$(id).parent().removeClass('email-protect email-unprotected email-pinprotected email-pgpprotected').addClass('email-pinprotected');
						//$(id+'>i').removeClass().addClass('fa fa-lock');
					} else if (pgpProtected) {
						classSpan = "email-pgpprotected";
						classI = "fa fa-lock";
						protect = 2;
						//$(id).parent().removeClass('email-protect email-unprotected email-pinprotected email-pgpprotected').addClass('email-pgpprotected');
						//$(id+'>i').removeClass().addClass('fa fa-unlock');
					} else if (out == 0) {
						classSpan = "email-protected";
						classI = "fa fa-lock";
						protect = 3;
						//$(id).parent().removeClass('email-protect email-unprotected email-pinprotected email-pgpprotected').addClass('email-protect');
						//$(id+'>i').removeClass().addClass('fa fa-lock');
					}

					$(id).parent().removeClass('email-protect email-unprotected email-pinprotected email-pgpprotected').addClass(classSpan);
					$(id + '>i').removeClass().addClass(classI);

					cc--;
					if (cc === 0) {
						allRecip.resolve();
					}
				});
			} else {
				thisComp.setState({
					emailProtected: -1
				});
			}

			allRecip.done(function () {
				thisComp.setState({
					emailProtected: protect
				}, function () {
					thisComp.addFileLink();
				});
			});

			//console.log(AllRecipients);

		}

	});
});