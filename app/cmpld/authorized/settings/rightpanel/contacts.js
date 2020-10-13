define(['react', 'app', 'dataTable', 'dataTableBoot'], function (React, app, DataTable, dataTableBoot) {
	"use strict";

	return React.createClass({
		/**
   *
   */

		getInitialState: function () {
			return {

				firstPanelClass: "panel-body",
				secondPanelClass: "panel-body hidden",
				firstTab: "active",

				secondPanelText: "New Contact",

				button1text: "Add Contact",
				button1visible: "",
				button1onClick: "addNewContact",

				button2text: "Save",
				button2onClick: "saveContact",

				button3enabled: true,
				button3visible: "",
				button3text: "Cancel",
				button3onClick: "showFirst",

				contactsSet: {},
				rememberContacts: app.user.get("rememberContacts"),

				contactId: '',
				nameField: '',
				emailField: '',
				pinField: '',
				pgpField: '',
				pgpOn: false,

				keyStrength: "",
				keyFingerprint: "",
				keyDate: "",
				pubCorrect: true,

				keyForm: {}
			};
		},

		/**
   *
   * @returns {Array}
   */
		getContacts: function () {
			var alEm = [];

			var ff = app.user.get("contacts");

			delete ff[""];
			$.each(app.user.get("contacts"), function (index, contactData) {
				//console.log(emailData);

				var el = {
					"DT_RowId": index,
					"email": {
						"display": app.transform.escapeTags(app.transform.from64str(contactData['e']))
					},
					"name": {
						"display": app.transform.escapeTags(app.transform.from64str(contactData['n']))
					}

				};
				alEm.push(el);
			});

			this.setState({ contactsSet: alEm });
			return alEm;
		},

		componentDidMount: function () {
			//var dtSet=this.state.contactsSet;
			var dtSet = this.getContacts();

			var thisComp = this;

			$('#table1').dataTable({
				"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
				"data": dtSet,

				"columns": [{ "data": {
						_: "email.display",
						sort: "email.display"
					}
				}, { "data": {
						_: "name.display",
						sort: "name.display"
					}
				}],
				"columnDefs": [{ "sClass": 'col-xs-6', "targets": [0, 1] }, { "orderDataType": "data-sort", "targets": 0 }],
				"order": [[0, "asc"]],
				"sPaginationType": "simple",
				"language": {
					"emptyTable": "No Contacts",
					"sSearch": "",
					"searchPlaceholder": "Search",
					"paginate": {
						"sPrevious": "<i class='fa fa-chevron-left'></i>",
						"sNext": "<i class='fa fa-chevron-right'></i>"
					}
				}
			});

			this.setState({ keyForm: $("#editPGPkey").validate() });

			$.validator.addMethod("pubCorrect", function (value, element) {

				return thisComp.state.pubCorrect;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Public Key format is unknown");

			$("#pgpField").rules("add", {
				//required: true,
				//minlength: 200,
				//maxlength: 900,
				pubCorrect: true
			});

			$("#nameField").rules("add", {
				//required: true,
				minlength: 1,
				maxlength: 200
			});

			$("#emailField").rules("add", {
				required: true,
				email: true,
				minlength: 5,
				maxlength: 220
			});

			$("#pinField").rules("add", {
				//required: true,
				minlength: 3,
				maxlength: 100
			});

			//	this.handleClick('addNewContact');
		},

		/**
   *
   * @returns {boolean}
   */

		checkKey: function () {

			var isSuccess = app.globalF.validatePublicKey(this.state.pgpField);
			return isSuccess;
		},

		componentWillUpdate: function (nextProps, nextState) {
			if (JSON.stringify(nextState.contactsSet) !== JSON.stringify(this.state.contactsSet)) {

				var t = $('#table1').DataTable();
				t.clear();
				var contacts = nextState.contactsSet;
				t.rows.add(contacts);
				t.draw(false);
			}
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleClick: function (action, event) {
			switch (action) {
				case 'showFirst':

					this.setState({
						firstPanelClass: "panel-body",
						secondPanelClass: "panel-body hidden",
						firstTab: "active",

						button1visible: "",

						contactId: "",
						nameField: "",
						emailField: "",
						pinField: "",
						pgpField: "",

						pgpOn: false,

						keyStrength: "",
						keyFingerprint: "",
						keyDate: ""
					});

					var validator = this.state.keyForm;
					validator.form();

					$("#nameField").removeClass("invalid");
					$("#nameField").removeClass("valid");

					$("#emailField").removeClass("invalid");
					$("#emailField").removeClass("valid");

					$("#pinField").removeClass("invalid");
					$("#pinField").removeClass("valid");

					$("#pgpField").removeClass("invalid");
					$("#pgpField").removeClass("valid");

					validator.resetForm();

					break;

				case 'addNewContact':
					var thisComp = this;
					app.globalF.checkPlanLimits('contacts', Object.keys(app.user.get('contacts')).length, function (result) {
						if (result) {

							thisComp.setState({
								firstPanelClass: "panel-body hidden",
								secondPanelClass: "panel-body",
								firstTab: "active",

								secondPanelText: "New Contact",

								button1visible: "hidden",

								button2onClick: "saveNewContact",

								button4visible: "hidden"
							});
						}
					});

					break;
				case 'deleteContact':
					var thisComp = this;

					$('#dialogModHead').html("Delete Contact");
					$('#dialogModBody').html("Contact will be deleted. Continue?");

					$('#dialogOk').on('click', function () {

						var id = thisComp.state.contactId;

						//console.log('ddd '+id);
						//	console.log(app.user.get("contacts")[id]);

						var contacts = app.user.get("contacts");
						delete contacts[id];

						app.user.set({ contactsChanged: true });
						app.userObjects.updateObjects('saveContacts', '', function (result) {
							if (result == 'saved') {
								thisComp.getContacts();

								thisComp.handleClick('showFirst');
								$('#dialogPop').modal('hide');
							} else if (result == 'newerFound') {
								//app.notifications.systemMessage('newerFnd');
								$('#dialogPop').modal('hide');
							}
						});
					});

					$('#dialogPop').modal('show');

					break;

				case 'selectRow':

					var thisComp = this;

					var id = $(event.target).parents('tr').attr('id');

					//console.log(id);
					if (id != undefined) {
						thisComp.setState({
							contactId: id
						});
						thisComp.handleClick('editContact', id);
					}

					//console.log($(event.target).parents('a').attr("class"));

					//console.log($(event.target).parents('tr').attr('id'));

					break;

				case 'editContact':
					var contacts = app.user.get("contacts");
					var contact = contacts[event];
					var thisComp = this;

					app.globalF.getPublicKeyInfo(app.transform.from64str(contact['pgp']), function (result) {
						//keyData=result;
						thisComp.setState({
							keyStrength: result['strength'],
							keyFingerprint: result['fingerprint'],
							keyDate: result['created']
						});
					});
					this.setState({
						firstPanelClass: "panel-body hidden",
						secondPanelClass: "panel-body",
						firstTab: "active",

						secondPanelText: "Edit Contact",

						button1visible: "hidden",

						contactId: event,
						nameField: app.transform.from64str(contact['n']),
						emailField: app.transform.from64str(contact['e']),
						pinField: app.transform.from64str(contact['p']),
						pgpOn: contact['pgpOn'],
						pgpField: app.transform.from64str(contact['pgp']),

						button4visible: "",
						button2onClick: "saveExistingContact"

					});

					//console.log(this.state.contactId);


					//console.log(contact);

					break;

				case 'saveNewContact':

					var thisComp = this;

					var validator = this.state.keyForm;
					validator.form();

					if (validator.numberOfInvalids() == 0) {

						var contacts = app.user.get("contacts");

						var contId = app.transform.to64str(thisComp.state.emailField);

						//console.log(contId);

						contacts[contId] = {
							'n': app.transform.to64str(thisComp.state.nameField),
							'p': app.transform.to64str(thisComp.state.pinField),
							'e': app.transform.to64str(thisComp.state.emailField),
							'pgp': app.transform.to64str(thisComp.state.pgpField),
							'pgpOn': thisComp.state.pgpField == "" ? false : thisComp.state.pgpOn
						};

						//app.user.set({"contactsChanged": true});
						//	app.userObjects.updateObjects();

						app.user.set({ contactsChanged: true });

						app.userObjects.updateObjects('saveContacts', '', function (result) {
							if (result == 'saved') {
								thisComp.getContacts();

								thisComp.handleClick('showFirst');
								$('#dialogPop').modal('hide');
							} else if (result == 'newerFound') {
								//app.notifications.systemMessage('newerFnd');
								$('#dialogPop').modal('hide');
							}
						});

						//console.log(this.state.contactId);
						thisComp.getContacts();
						thisComp.handleClick('showFirst');
					}

					break;

				case 'saveExistingContact':

					var thisComp = this;

					var validator = this.state.keyForm;
					validator.form();

					//console.log(this.state.pgpOn);
					if (validator.numberOfInvalids() == 0) {

						var contacts = app.user.get("contacts");

						if (contacts[thisComp.state.contactId]['n'] != app.transform.to64str(thisComp.state.nameField) || contacts[thisComp.state.contactId]['p'] != app.transform.to64str(thisComp.state.pinField) || contacts[thisComp.state.contactId]['e'] != app.transform.to64str(thisComp.state.emailField) || contacts[thisComp.state.contactId]['pgp'] != app.transform.to64str(thisComp.state.pgpField) || contacts[thisComp.state.contactId]['pgpOn'] != app.transform.to64str(thisComp.state.pgpOn)) {

							contacts[thisComp.state.contactId] = {
								'n': app.transform.to64str(thisComp.state.nameField),
								'p': app.transform.to64str(thisComp.state.pinField),
								'e': app.transform.to64str(thisComp.state.emailField),
								'pgp': app.transform.to64str(thisComp.state.pgpField),
								'pgpOn': thisComp.state.pgpOn
							};

							app.user.set({ contactsChanged: true });
							app.userObjects.updateObjects('saveContacts', '', function (result) {
								if (result == 'saved') {
									thisComp.getContacts();

									thisComp.handleClick('showFirst');
									//	$('#dialogPop').modal('hide');
								} else if (result == 'newerFound') {
									//app.notifications.systemMessage('newerFnd');
									//$('#dialogPop').modal('hide');
								}
							});

							//app.user.set({"contactsChanged": true});
							//app.userObjects.updateObjects();

							//console.log(this.state.contactId);
						} else {
							app.notifications.systemMessage('nthTochng');
						}

						//thisComp.getContacts();
						//thisComp.handleClick('showFirst');
					}

					break;
			}
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleChange: function (action, event) {
			switch (action) {

				case 'remCont':
					this.setState({
						rememberContacts: !this.state.rememberContacts
					});
					app.user.set({ "inProcess": true });
					app.user.set({ "rememberContacts": !this.state.rememberContacts });

					app.userObjects.updateObjects('userProfile', '', function (response) {
						//restore copy of the object if failed to save
						//  console.log(response);
						if (response === 'saved') {
							app.user.set({ "inProcess": false });
						} else if (response === 'newerFound') {

							app.user.set({ "inProcess": false });
						} else if (response === 'nothingUpdt') {

							app.user.set({ "inProcess": false });
						}
					});

					break;

				case 'enablePublic':
					this.setState({
						pgpOn: !this.state.pgpOn
					});

					//console.log(event.target.value);
					break;

				case 'changeName':

					this.setState({
						nameField: event.target.value
					});

					break;
				case 'changeEmail':

					this.setState({
						emailField: event.target.value
					});

					break;
				case 'changePin':

					this.setState({
						pinField: event.target.value
					});

					break;

				case 'changePGP':

					var thisComp = this;
					//	console.log('ddd');
					this.setState({
						pgpField: event.target.value
					}, function () {
						app.globalF.getPublicKeyInfo(thisComp.state.pgpField, function (result) {
							//keyData=result;
							thisComp.setState({
								keyStrength: result['strength'],
								keyFingerprint: result['fingerprint'],
								keyDate: result['created']
							});
						});
						app.globalF.validateKeys(thisComp.state.pgpField, '', '', function (result) {
							thisComp.setState({

								pubCorrect: result['pubCorrect']

							});
						});
					});

					break;

			}
		},

		/**
   *
   * @returns {JSX}
   */
		render: function () {
			var classFullSettSelect = "form-group col-xs-12";

			return React.createElement(
				'div',
				{ className: this.props.classes.rightClass, id: 'rightSettingPanel' },
				React.createElement(
					'div',
					{ className: 'col-lg-7 col-xs-12 personal-info' },
					React.createElement(
						'div',
						{ className: 'panel panel-default panel-setting' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'button',
								{ type: 'button', className: "btn btn-primary pull-right " + this.state.button1visible, onClick: this.handleClick.bind(this, this.state.button1onClick) },
								' ',
								this.state.button1text
							),
							React.createElement(
								'ul',
								{ className: 'nav nav-tabs tabbed-nav' },
								React.createElement(
									'li',
									{ role: 'presentation', className: this.state.firstTab },
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'showFirst') },
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Contacts'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'fa fa-users' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.firstPanelClass },
							React.createElement(
								'div',
								{ className: 'col-xs-12 col-lg-6' },
								React.createElement(
									'div',
									{ className: 'form-group' },
									React.createElement(
										'div',
										{ className: 'checkbox' },
										React.createElement(
											'label',
											null,
											React.createElement('input', { type: 'checkbox',
												checked: this.state.rememberContacts,
												onChange: this.handleChange.bind(this, 'remCont') }),
											'Remember Contacts'
										)
									)
								)
							),
							React.createElement(
								'table',
								{ className: ' table table-hover table-striped datatable table-light rowSelectable clickable', id: 'table1', onClick: this.handleClick.bind(this, 'selectRow') },
								React.createElement(
									'thead',
									null,
									React.createElement(
										'tr',
										null,
										React.createElement(
											'th',
											null,
											'email'
										),
										React.createElement(
											'th',
											null,
											'name'
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.secondPanelClass },
							React.createElement(
								'h3',
								null,
								this.state.secondPanelText
							),
							React.createElement(
								'div',
								{ className: classFullSettSelect },
								React.createElement(
									'form',
									{ id: 'editPGPkey', className: '' },
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement('input', { type: 'text', name: 'nameField', className: 'form-control', id: 'nameField', placeholder: 'name',
											value: this.state.nameField,
											onChange: this.handleChange.bind(this, 'changeName')
										})
									),
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement('input', { type: 'text', name: 'emailField', readOnly: this.state.contactId != "" ? true : false, className: 'form-control', id: 'emailField', placeholder: 'email',
											value: this.state.emailField,
											onChange: this.handleChange.bind(this, 'changeEmail')
										})
									),
									React.createElement(
										'div',
										{ className: 'form-group' },
										React.createElement('input', { type: 'text', name: 'pinField', className: 'form-control', id: 'pinField', placeholder: 'pin',
											value: this.state.pinField,
											readOnly: this.state.pgpOn,
											onChange: this.handleChange.bind(this, 'changePin')
										})
									),
									React.createElement('div', { className: 'clearfix' }),
									React.createElement('input', { className: 'pull-left', type: 'checkbox',
										onChange: this.handleChange.bind(this, 'enablePublic'),
										checked: this.state.pgpOn
									}),
									'\xA0 ',
									React.createElement(
										'label',
										null,
										'Contact Public Key'
									),
									React.createElement(
										'div',
										{ className: !this.state.pgpOn ? "hidden" : "" },
										React.createElement(
											'p',
											null,
											'Strength: ',
											this.state.keyStrength != "" ? this.state.keyStrength + ' bits' : ""
										),
										React.createElement(
											'p',
											null,
											'Fingerprint: ',
											this.state.keyFingerprint
										),
										React.createElement(
											'p',
											null,
											'Created: ',
											this.state.keyDate != "" ? new Date(this.state.keyDate).toLocaleString() : ""
										)
									),
									React.createElement('textarea', { className: 'form-control', rows: '8', id: 'pgpField', name: 'pgpField',
										readOnly: !this.state.pgpOn,
										value: this.state.pgpField,
										onChange: this.handleChange.bind(this, "changePGP"),
										placeholder: 'Public Key'
									})
								)
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement(
								'button',
								{ type: 'button', className: "btn btn-danger pull-left " + this.state.button4visible, onClick: this.handleClick.bind(this, "deleteContact") },
								'Delete'
							),
							React.createElement(
								'div',
								{ className: 'pull-right dialog_buttons' },
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-primary', onClick: this.handleClick.bind(this, this.state.button2onClick) },
									this.state.button2text
								),
								React.createElement(
									'button',
									{ type: 'button', className: "btn btn-default " + this.state.button3visible, disabled: !this.state.button3enabled, onClick: this.handleClick.bind(this, this.state.button3onClick) },
									this.state.button3text
								)
							)
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'col-lg-5 col-xs-12 personal-info ' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'h3',
								{ className: 'panel-title personal-info-title' },
								'Help'
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-body' },
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Remember Contacts'
								),
								' - When this option is checked, new contacts will be auto-saved upon sending email.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Name'
								),
								' - Enter the contact\'s real name.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Email'
								),
								' - Enter the contact\'s email address.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Pin'
								),
								' - This is optional. This is a number that you choose which consists of at least four digits. You share it with your contact via some other form of communication. Anytime you send that contact an email, they need to know the pin number in order to read it. If you choose to use pin numbers, you should choose a different one for each contact.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Public Key'
								),
								' -  If you know the public key for a contact with an email address hosted by another email service, paste it into this box to gain the ability to send that contact PGP encrypted emails.'
							)
						)
					)
				)
			);
		}

	});
});