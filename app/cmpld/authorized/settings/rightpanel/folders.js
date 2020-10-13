define(['react', 'app', 'dataTable', 'dataTableBoot'], function (React, app, DataTable, dataTableBoot) {
	"use strict";

	return React.createClass({
		getInitialState: function () {
			return {

				firstPanelClass: "panel-body",
				secondPanelClass: "panel-body hidden",
				thirdPanelClass: "panel-body hidden",

				secondPanelText: "Add Folder",

				firstTab: "active",
				secondTab: "",

				button1Click: "addFolder",
				button1enabled: true,
				button1text: "Add Folder",
				button1visible: '',

				button3Click: "addLabel",
				button3enabled: true,
				button3text: "Add Label",
				button3visible: 'hidden',

				folderSet: {},
				tagsSet: {},

				inputSelectClass: "form-group col-xs-12 col-sm-6 col-lg-5",
				inputSelectOnchange: "changeFolderExpiration",
				nameField: '',
				expireFolder: '',
				labelField: '',

				nameForm: {},
				folderId: ''

			};
		},
		/**
   *
   * @returns {Array}
   */
		getFolders: function () {

			var alEm = [];
			var dates = {
				'-1': "Never",
				'1': "1 day",
				'7': "1 week",
				'30': "1 month",
				'180': "6 months",
				'365': '1 year'
			};

			$.each(app.user.get("folders"), function (index, data) {
				//console.log(emailData);
				var el = {
					"DT_RowId": index,
					"folder": {
						"display": data['isMain'] ? "<b>" + app.transform.escapeTags(app.transform.from64str(data['name'])) + "</b>" : app.transform.escapeTags(app.transform.from64str(data['name']))
					},
					"isMain": data['isMain'] ? "1" : "0",
					"expire": dates[data['exp']]

				};
				alEm.push(el);
			});
			this.setState({ folderSet: alEm });
			//	console.log(alEm);
			return alEm;
		},

		/**
   *
   * @returns {Array}
   */
		getTags: function () {

			var alEm = [];

			$.each(app.user.get("tags"), function (label64, data64) {
				//console.log(emailData);

				var el = {
					"DT_RowId": label64,
					"label": app.transform.escapeTags(app.transform.from64str(label64)),
					"delete": '<a class="deleteLabel"><i class="fa fa-times fa-lg txt-color-red"></i></a>'

				};
				alEm.push(el);
			});
			this.setState({ tagsSet: alEm });
			//	console.log(alEm);
			return alEm;
		},

		componentDidMount: function () {
			var folderSet = this.getFolders();
			//console.log(folderSet);
			var tagSet = this.getTags();

			var thisComp = this;

			$('#table1').dataTable({
				"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
				"data": folderSet,
				"columns": [{ "data": {
						_: "folder.display",
						sort: "folder.display"
					}
				}, { "data": "isMain" }, { "data": "expire" }],
				"columnDefs": [{ "sClass": 'col-xs-6 col-lg-10', "targets": 0 }, { "sClass": 'hidden', "targets": [1] }, { "sClass": 'col-xs-2 col-lg-2 text-align-center', "targets": [2] }, { 'bSortable': false, 'aTargets': [1, 2] }, { "orderDataType": "data-sort", "targets": 0 }],
				"order": [[1, "desc"], [0, "asc"]],
				"sPaginationType": "simple",
				"language": {
					"emptyTable": "Empty",
					"sSearch": "",
					"searchPlaceholder": "Search",
					"paginate": {
						"sPrevious": "<i class='fa fa-chevron-left'></i>",
						"sNext": "<i class='fa fa-chevron-right'></i>"
					}
				}
			});

			$('#table2').dataTable({
				"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
				"data": tagSet,
				"columns": [{ data: "label" }, { data: "delete" }],
				"columnDefs": [{ "sClass": 'col-xs-11', "targets": 0 }, { "sClass": 'col-xs-1 text-align-center', "targets": [1] }, { 'bSortable': false, 'aTargets': [1] }, { "orderDataType": "data-sort", "targets": 0 }],
				"order": [[0, "desc"]],
				"sPaginationType": "simple",
				"language": {
					"emptyTable": "Empty",
					"sSearch": "",
					"searchPlaceholder": "Search",
					"paginate": {
						"sPrevious": "<i class='fa fa-chevron-left'></i>",
						"sNext": "<i class='fa fa-chevron-right'></i>"
					}
				}
			});

			this.setState({ nameForm: $("#addNewFolderForm").validate() });

			$.validator.addMethod("uniqueFolderName", function (value, element) {

				console.log(thisComp.state.secondPanelText);

				var isSuccess = true;

				var folders = app.user.get('folders');

				if (thisComp.state.secondPanelText == "Add Folder") {
					var seed = app.transform.to64str(thisComp.state.nameField);

					$.each(folders, function (fldIndex, fldData) {
						//console.log(fldData['name']);
						//console.log(fldData['name']==seed);

						if (fldData['name'] == seed) {
							isSuccess = false;
						}
					});
				}

				if (isSuccess) {
					return true;
				} else {
					return false;
				}

				//return true;

			}, "Folder Already Exist");

			$.validator.addMethod("uniqueLabelName", function (value, element) {

				var isSuccess = true;

				var tags = app.user.get('tags');

				var seed = app.transform.to64str(thisComp.state.labelField);
				console.log(seed);

				$.each(tags, function (tagIndex, tagData) {

					//	console.log(fldData['name']);
					//	console.log(fldData['name']==seed);

					if (tagIndex == seed) {
						isSuccess = false;
					}
				});

				if (isSuccess) {
					return true;
				} else {
					return false;
				}

				//return true;

			}, "Label Already Exist");

			$("#folderName").rules("add", {
				required: true,
				minlength: 3,
				maxlength: 90,
				uniqueFolderName: true
			});

			$("#labelName").rules("add", {
				required: true,
				minlength: 3,
				maxlength: 90,
				uniqueLabelName: true
			});

			$("#expireFold").rules("add", {
				required: true
			});

			//this.handleClick('addFolder');
		},

		componentWillUpdate: function (nextProps, nextState) {
			if (JSON.stringify(nextState.folderSet) !== JSON.stringify(this.state.folderSet)) {

				var t = $('#table1').DataTable();
				t.clear();
				var folders = nextState.folderSet;
				t.rows.add(folders);
				t.draw(false);
			}

			if (JSON.stringify(nextState.tagsSet) !== JSON.stringify(this.state.tagsSet)) {
				var t = $('#table2').DataTable();
				t.clear();
				var tags = nextState.tagsSet;
				t.rows.add(tags);
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
						thirdPanelClass: "panel-body hidden",

						firstTab: "active",
						secondTab: "",

						button1Click: "addFolder",
						button1enabled: true,
						button1text: "Add Folder",
						button1visible: '',

						button3Click: "addDisposable",
						button3enabled: true,
						button3text: "Add Disposable",
						button3visible: 'hidden',

						folderId: "",
						nameField: '',
						expireFolder: 0,

						deleteFolderClass: "hidden"
					});

					var validator = this.state.nameForm;
					validator.form();

					$("#folderName").removeClass("invalid");
					$("#folderName").removeClass("valid");

					$("#expireFold").removeClass("invalid");
					$("#expireFold").removeClass("valid");

					validator.resetForm();

					break;

				case 'showSecond':
					this.setState({
						firstPanelClass: "panel-body hidden",
						secondPanelClass: "panel-body hidden",
						thirdPanelClass: "panel-body",

						firstTab: "",
						secondTab: "active",

						button1Click: "addFolder",
						button1enabled: true,
						button1text: "Add Folder",
						button1visible: 'hidden',

						button3Click: "addLabel",
						button3enabled: true,
						button3text: "Add Label",
						button3visible: '',

						labelField: ''

					});

					var validator = this.state.nameForm;
					validator.form();

					$("#labelName").removeClass("invalid");
					$("#labelName").removeClass("valid");

					validator.resetForm();

					break;

				case 'addFolder':
					this.setState({
						firstPanelClass: "panel-body hidden",
						secondPanelClass: "panel-body",
						thirdPanelClass: "panel-body hidden",

						firstTab: "active",
						secondTab: "",

						secondPanelText: "Add Folder",

						inputNameClass: "form-group col-xs-12 col-sm-6 col-lg-7",
						inputNameOnchange: "changeFolderName",
						inputSelectClass: "form-group col-xs-12 col-sm-6 col-lg-5",
						inputSelectOnchange: "changeFolderExpiration",

						inputLabelClass: "hidden",

						button1text: "Add Folder",
						button1enabled: true,
						button1onClick: "addFolder",
						button1class: 'btn btn-primary pull-right hidden',
						button1visible: 'hidden',

						button4Click: 'showFirst',

						button5Click: 'saveNewFolder',
						button5text: 'Add',

						nameField: '',
						expireFolder: '-1',
						deleteFolderClass: "hidden"

						//button1:{text:"Add Label",enabled:true,iClass:"",onClick:"addLabel"},
						//dataSet:this.state.labelSet
					});
					break;

				case 'addLabel':
					this.setState({
						firstPanelClass: "panel-body hidden",
						secondPanelClass: "panel-body",
						thirdPanelClass: "panel-body hidden",

						firstTab: "",
						secondTab: "active",
						secondPanelText: "Add Label",

						inputNameClass: "hidden",
						inputNameOnchange: "changeLabelName",

						inputLabelClass: "form-group col-xs-12",

						inputSelectClass: "hidden",
						inputSelectOnchange: "",
						button4Click: 'showSecond',

						button5Click: 'saveNewLabel',
						button5text: 'Add',
						deleteFolderClass: "hidden"

						//button1:{text:"Add Label",enabled:false,iClass:"",onClick:"addLabel", class:'btn btn-primary pull-right hidden'},


						//button1:{text:"Add Label",enabled:true,iClass:"",onClick:"addLabel"},
						//dataSet:this.state.labelSet
					});
					break;

				case 'saveEditFolder':
					//button5text

					var validator = this.state.nameForm;

					validator.form();
					var thisComp = this;

					if (validator.numberOfInvalids() == 0) {
						var folders = app.user.get("folders");
						var fId = thisComp.state.folderId;
						folders[fId]['name'] = app.transform.to64str(this.state.nameField);
						folders[fId]['exp'] = this.state.expireFolder;

						app.userObjects.updateObjects('folderSettings', '', function (result) {

							if (result['response'] == "success") {
								if (result['data'] == 'saved') {

									thisComp.setState({ folderSet: thisComp.getFolders() });
									thisComp.handleClick('showFirst');
								} else if (result['data'] == 'newerFound') {
									//app.notifications.systemMessage('newerFnd');
									thisComp.handleClick('showFirst');
								}
							}
						});
					}

					break;

				case 'saveNewFolder':

					var validator = this.state.nameForm;

					validator.form();
					var thisComp = this;

					if (validator.numberOfInvalids() == 0) {
						var folderId = app.globalF.createFolderIndex();
						var folders = app.user.get("folders");
						folders[folderId] = { 'name': app.transform.to64str(this.state.nameField), 'exp': this.state.expireFolder, 'isMain': false };

						var emails = app.user.get("emails")['folders'];
						emails[folderId] = {};

						app.userObjects.updateObjects('folderSettings', '', function (result) {

							if (result['response'] == "success") {
								if (result['data'] == 'saved') {

									thisComp.setState({ folderSet: thisComp.getFolders() });
									thisComp.handleClick('showFirst');
								} else if (result['data'] == 'newerFound') {
									//app.notifications.systemMessage('newerFnd');
									thisComp.handleClick('showFirst');
								}
							}
						});
					}

					break;

				case 'saveNewLabel':

					var validator = this.state.nameForm;

					validator.form();

					var thisComp = this;

					var tags = app.user.get("tags");

					if (validator.numberOfInvalids() == 0) {
						tags[app.transform.to64str(this.state.labelField)] = { 'color': '' };

						app.userObjects.updateObjects('labelSettings', '', function (result) {

							if (result == 'saved') {

								thisComp.setState({ getTags: thisComp.getTags() });
								thisComp.handleClick('showSecond');
							} else if (result == 'newerFound') {
								//app.notifications.systemMessage('newerFnd');
								thisComp.handleClick('showFirst');
							}
						});
					}

					break;

				case 'selectRowTab1':

					var id = $(event.target).parents('tr').attr('id');
					if (id != undefined) {
						this.handleClick('editFolder', id);
					}

					break;

				case 'deleteLabel':

					app.userObjects.updateObjects('labelSettings', '', function (result) {

						if (result == 'saved') {

							thisComp.setState({ getTags: thisComp.getTags() });
							thisComp.handleClick('showSecond');
						} else if (result == 'newerFound') {
							//app.notifications.systemMessage('newerFnd');
							thisComp.handleClick('showFirst');
						}
					});

					break;

				case 'selectRowTab2':

					//$(event.target).parents('tr').toggleClass('highlight');

					var thisComp = this;
					var tags = app.user.get('tags');

					if ($(event.target).parents('a').attr("class") == 'deleteLabel') {
						delete tags[$(event.target).parents('tr').attr('id')];

						app.userObjects.updateObjects('labelSettings', '', function (result) {

							if (result == 'saved') {

								thisComp.setState({ getTags: thisComp.getTags() });
							} else if (result == 'newerFound') {
								//app.notifications.systemMessage('newerFnd');
								thisComp.handleClick('showFirst');
							}
						});
					}

					break;

				case 'deleteFolder':

					var thisComp = this;
					var id = this.state.folderId;
					var trash = app.user.get('systemFolders')['trashFolderId'];
					var filter = app.user.get('filter');

					var folders = app.user.get('folders');
					var emails = app.user.get('emails')['folders'];

					if (folders[id]['isMain']) {
						$('#infoModHead').html("Delete Folder");
						$('#infoModBody').html("You can not delete system folder");

						$('#infoModal').modal('show');
					} else {

						$('#dialogModHead').html("Delete Folder");
						$('#dialogModBody').html("All messages and filter rules for this folder will be deleted. Do you want to continue?");

						$('#dialogOk').on('click', function () {

							if (Object.keys(emails[id]).length > 0) {

								$.each(emails[id], function (index, email) {
									email['f'] = trash;
								});

								emails[trash] = $.extend({}, emails[trash], emails[id]);
							}

							$.each(filter, function (filterIndex, filterData) {
								if (filterData['to'] == id) {
									delete filter[filterIndex];
									//filter=app.globalF.arrayRemove(filter,filterIndex);
								}
							});

							//console.log(object);
							//console.log(id);

							delete emails[id]; //removing from mails storage
							delete folders[id]; //removing folder reference

							$('#dialogPop').modal('hide');

							app.userObjects.updateObjects('folderSettings', '', function (result) {

								if (result['response'] == "success") {
									if (result['data'] == 'saved') {

										thisComp.setState({ folderSet: thisComp.getFolders() });
										thisComp.handleClick('showFirst');
									} else if (result['data'] == 'newerFound') {
										//app.notifications.systemMessage('newerFnd');
										thisComp.handleClick('showFirst');
									}
								}
							});
						});

						$('#dialogPop').modal('show');
					}

					break;

				case 'editFolder':

					var folders = app.user.get('folders');
					//console.log(folders[e]['name']);

					this.setState({
						firstPanelClass: "panel-body hidden",
						secondPanelClass: "panel-body",
						thirdPanelClass: "panel-body hidden",

						secondPanelText: "Edit Folder",

						inputNameClass: "form-group col-xs-12 col-sm-6 col-lg-7",
						inputNameOnchange: "changeFolderName",
						inputSelectClass: "form-group col-xs-12 col-sm-6 col-lg-5",
						inputSelectOnchange: "changeFolderExpiration",

						inputLabelClass: "hidden",

						button1visible: 'hidden',

						button4Click: 'showFirst',

						button5Click: 'saveEditFolder',
						button5text: 'Save',

						nameField: app.transform.from64str(folders[event]['name']),
						expireFolder: folders[event]['exp'],
						folderId: event,

						deleteFolderClass: folders[event]['isMain'] ? "hidden" : "btn btn-danger"

						//button1:{text:"Add Label",enabled:true,iClass:"",onClick:"addLabel"},
						//dataSet:this.state.labelSet
					});

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

				case 'changeNameField':
					this.setState({
						nameField: event.target.value
					});

					break;

				case 'changeExpiration':
					var thisComp = this;
					app.globalF.checkPlanLimits('folderExpiration', event.target.value, function (result) {
						if (result) {
							thisComp.setState({
								expireFolder: event.target.value
							});
						}
					});

					break;

				case 'changeLabelField':
					this.setState({
						labelField: event.target.value
					});

					break;

			}
		},
		render: function () {

			return React.createElement(
				'div',
				{ className: this.props.classes.rightClass, id: 'rightSettingPanel' },
				React.createElement(
					'div',
					{ className: 'col-lg-7 col-xs-12 personal-info ' },
					React.createElement(
						'div',
						{ className: 'panel panel-default panel-setting' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'button',
								{ type: 'button', className: "btn btn-primary pull-right " + this.state.button1visible,
									onClick: this.handleClick.bind(this, this.state.button1Click),
									disabled: !this.state.button1enabled },
								this.state.button1text
							),
							React.createElement(
								'button',
								{ type: 'button', className: "btn btn-primary pull-right " + this.state.button3visible,
									onClick: this.handleClick.bind(this, this.state.button3Click),
									disabled: !this.state.button3enabled },
								this.state.button3text
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
											'Folders'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'fa fa-folder-open-o' })
										)
									)
								),
								React.createElement(
									'li',
									{ role: 'presentation', className: this.state.secondTab },
									React.createElement(
										'a',
										{ onClick: this.handleClick.bind(this, 'showSecond') },
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Labels'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'fa fa-tags' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.firstPanelClass },
							React.createElement(
								'table',
								{ className: 'table table-hover table-striped datatable table-light rowSelectable clickable', id: 'table1', onClick: this.handleClick.bind(this, 'selectRowTab1') },
								React.createElement(
									'thead',
									null,
									React.createElement(
										'tr',
										null,
										React.createElement(
											'th',
											null,
											'\xA0'
										),
										React.createElement(
											'th',
											null,
											'\xA0'
										),
										React.createElement(
											'th',
											null,
											'expire'
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.thirdPanelClass },
							React.createElement(
								'table',
								{ className: ' table table-hover table-striped datatable table-light', id: 'table2', onClick: this.handleClick.bind(this, 'selectRowTab2') },
								React.createElement(
									'thead',
									null,
									React.createElement(
										'tr',
										null,
										React.createElement(
											'th',
											null,
											'\xA0'
										),
										React.createElement(
											'th',
											null,
											'\xA0'
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
								'form',
								{ id: 'addNewFolderForm', className: '' },
								React.createElement(
									'div',
									{ className: this.state.inputLabelClass },
									React.createElement('input', { type: 'text', name: 'labelName', className: 'form-control', id: 'labelName', placeholder: 'name', value: this.state.labelField,
										onChange: this.handleChange.bind(this, 'changeLabelField') })
								),
								React.createElement(
									'div',
									{ className: this.state.inputNameClass },
									React.createElement('input', { type: 'text', name: 'fromName', className: 'form-control', id: 'folderName', placeholder: 'name', value: this.state.nameField,
										onChange: this.handleChange.bind(this, 'changeNameField') })
								),
								React.createElement(
									'div',
									{ className: this.state.inputSelectClass },
									React.createElement(
										'select',
										{ className: 'form-control', defaultValue: '0', id: 'expireFold', value: this.state.expireFolder, onChange: this.handleChange.bind(this, 'changeExpiration') },
										React.createElement(
											'option',
											{ value: '0', disabled: true },
											'Message Will Expire'
										),
										React.createElement(
											'option',
											{ value: '-1' },
											'Never'
										),
										React.createElement(
											'option',
											{ value: '1' },
											'1 day'
										),
										React.createElement(
											'option',
											{ value: '7' },
											'7 days'
										),
										React.createElement(
											'option',
											{ value: '30' },
											'30 days'
										),
										React.createElement(
											'option',
											{ value: '180' },
											'6 month'
										),
										React.createElement(
											'option',
											{ value: '365' },
											'1 year'
										)
									)
								)
							),
							React.createElement(
								'button',
								{ type: 'button', className: this.state.deleteFolderClass, onClick: this.handleClick.bind(this, 'deleteFolder') },
								'Delete Folder'
							),
							React.createElement(
								'div',
								{ className: 'pull-right dialog_buttons' },
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-primary', onClick: this.handleClick.bind(this, this.state.button5Click) },
									' ',
									this.state.button5text
								),
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-default', onClick: this.handleClick.bind(this, this.state.button4Click) },
									'Cancel'
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
									'Folders'
								),
								' - can be used to archive email and help keep your inbox clean. An email can be placed in only one folder.',
								React.createElement('br', null),
								'In an upcoming version we will be introducing a message expiration that will allow you to set an expiration date, per folder, that will allow email in a folder to be automatically deleted after a specified number of days.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Labels'
								),
								' - are an additional way to help keep your email organized. An email can have one label applied to it. If you have an email that has an important topic in it, you can use the key word as a label. For example, if you discuss stocks often with people, you can put a "stocks" label on them and find all of them at once with a search. Think of them as tags for emails with same topics that might exist across your inbox and folder(s).'
							)
						)
					)
				)
			);
		}

	});
});