define(['react', 'app'], function (React, app) {
	"use strict";

	return React.createClass({
		/**
   *
   * @returns {{
   * firstPanelClass: string,
   * secondPanelClass: string,
   * firstTab: string,
   * secondTab: string,
   * secondPanelText: string,
   * button1class: string,
   * inputNameClass: string,
   * inputNameChange: string,
   * inputSelectClass: string,
   * inputSelectChange: string,
   * filterSet: {},
   * ruleId: string,
   * fieldFrom: string,
   * fieldMatch: string,
   * fieldText: string,
   * fieldFolder: string,
   * ruleForm: {}
   * }}
   */
		getInitialState: function () {
			return {

				firstPanelClass: "panel-body",
				secondPanelClass: "panel-body hidden",
				firstTab: "active",
				secondTab: "",
				secondPanelText: "Add New Rule",

				button1class: 'btn btn-primary pull-right',
				button2class: 'btn btn-warning pull-right margin-right-30',

				inputNameClass: "form-group col-xs-12 col-sm-6 col-lg-7",
				inputNameChange: "changeFolderName",

				inputSelectClass: "form-group col-xs-12 col-sm-6 col-lg-6",

				inputSelectChange: "changeFolderExpiration",

				filterSet: {},

				ruleId: "",
				fieldFrom: "sender",
				fieldMatch: "strict",
				fieldText: "",
				fieldFolder: "1",

				ruleForm: {}

			};
		},

		/**
   *
   * @returns {Array}
   */
		getFilter: function () {
			var alEm = [];

			$.each(app.user.get("filter"), function (index, fRule) {

				var folder = app.user.get("folders")[fRule['to']];

				//console.log(folder!=undefined);
				var folderName = folder != undefined ? app.transform.from64str(folder['name']) : 'Inbox';
				//var folderName='Inbox';
				var from = '<span><b>' + (fRule['field'] == "rcpt" ? "recipient" : fRule['field'] == "sender" ? "sender" : fRule['field'] == "subject" ? "subject" : "") + '</b></span> ';
				var match = '<span>' + (fRule['match'] == "strict" ? "match" : fRule['match'] == "relaxed" ? "contains" : "not contain") + '</span> ';
				var text = '<span>"<b>' + app.transform.escapeTags(app.transform.from64str(fRule['text'])) + '</b>"</span> ';
				var to = '<span><b>' + app.transform.escapeTags(folderName) + '</b></span>';
				var el = {
					"DT_RowId": index,
					"text": {
						"display": from + match + text + '<span>will be moved to </span> ' + to,
						"index": index
					}
				};

				alEm.push(el);

				//console.log(emailData);
			});

			//console.log(alEm);

			//this.setState({filterSet:alEm});
			//	console.log(alEm);
			return alEm;
		},

		/**
   *
   * @returns {Array}
   */
		getFolders: function () {

			var folder = app.user.get('folders');
			var options = [];
			$.each(folder, function (index, folder) {
				options.push(React.createElement(
					'option',
					{ key: index, value: index },
					app.transform.from64str(folder['name'])
				));
			});
			return options;
		},

		componentDidMount: function () {
			var dtSet = this.getFilter();

			require(['dataTable', 'dataTableBoot'], function (DataTable, dataTableBoot) {

				$('#table1').dataTable({
					"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
					"data": dtSet,
					"columns": [{ "data": {
							_: "text.display",
							sort: "text.index"
						} }],
					"columnDefs": [{ "sClass": 'col-xs-12', "targets": [0] }, { "orderDataType": "data-sort", "targets": 0 }],
					"order": [[0, "asc"]],
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
			});
			//	this.handleClick("addFilterRule");

			this.setState({ ruleForm: $("#addRuleForm").validate() });

			$("#textField").rules("add", {
				required: true,
				minlength: 3,
				maxlength: 90
			});

			$("#destinationField").rules("add", {
				required: true
			});

			//
			//
		},

		/**
   *
   * @param {string} action
   * @param {object} event
   */
		handleChange: function (action, event) {
			switch (action) {
				case 'changeFrom':

					this.setState({ fieldFrom: event.target.value });
					break;

				case 'changeMatch':

					this.setState({ fieldMatch: event.target.value });
					break;

				case 'changeText':

					this.setState({ fieldText: event.target.value });
					break;

				case 'changeDestination':

					this.setState({ fieldFolder: event.target.value });
					break;

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
						secondTab: "",

						button1class: 'btn btn-primary pull-right',
						button2class: 'btn btn-warning pull-right margin-right-30',

						secondPanelText: "Add New Rule",

						ruleId: "",
						fieldFrom: "sender",
						fieldMatch: "strict",
						fieldText: "",
						fieldFolder: "1"

					});

					var validator = this.state.ruleForm;
					validator.form();

					$("#textField").removeClass("invalid");
					$("#textField").removeClass("valid");

					$("#destinationField").removeClass("invalid");
					$("#destinationField").removeClass("valid");

					validator.resetForm();

					break;

				case 'clearFilterRules':
					app.user.set({ "filter": {} });
					var thisComp = this;

					app.userObjects.updateObjects('saveFilter', '', function (result) {
						if (result == 'saved') {
							thisComp.setState({ filterSet: thisComp.getFilter() });
							thisComp.handleClick("showFirst");
							app.notifications.systemMessage('saved');
						} else if (result == 'newerFound') {
							app.notifications.systemMessage('newerFnd');
						} else if (result == 'nothingUpdt') {
							app.notifications.systemMessage('nthTochngORexst');
						}
					});

					break;
				case 'addFilterRule':
					var thisComp = this;
					app.globalF.checkPlanLimits('filter', Object.keys(app.user.get('filter')).length, function (result) {
						if (result) {
							thisComp.setState({

								firstPanelClass: "panel-body hidden",
								secondPanelClass: "panel-body ",
								firstTab: "active",
								secondTab: "",

								secondPanelText: "Add New Rule",

								deleteButtonClass: "hidden",
								saveButtonText: "Add",

								button1class: 'hidden',
								button2class: 'hidden'

							});
						}
					});

					break;
				case 'saveRule':

					var validator = this.state.ruleForm;

					validator.form();
					var thisComp = this;

					if (validator.numberOfInvalids() == 0) {

						var id = thisComp.state.ruleId;
						var from = thisComp.state.fieldFrom;
						var match = thisComp.state.fieldMatch;
						var folder = thisComp.state.fieldFolder;
						var text = thisComp.state.fieldText;

						app.globalF.createFilterRule(id, from, match, folder, text, function () {

							app.userObjects.updateObjects('saveFilter', '', function (result) {
								if (result == 'saved') {
									thisComp.setState({ filterSet: thisComp.getFilter() });
									thisComp.handleClick("showFirst");
									app.notifications.systemMessage('saved');
								} else if (result == 'newerFound') {
									app.notifications.systemMessage('newerFnd');
								} else if (result == 'nothingUpdt') {
									app.notifications.systemMessage('nthTochngORexst');
								}
							});

							//thisComp.setState({filterSet:thisComp.getFilter()});
							//thisComp.handleClick("showFirst");
						});
					}

					break;

				case 'editRule':

					var filter = app.user.get("filter");
					var id = event;

					console.log(id);
					this.setState({
						firstPanelClass: "panel-body hidden",
						secondPanelClass: "panel-body ",
						firstTab: "active",
						secondTab: "",

						secondPanelText: "Edit Rule",

						button1class: 'hidden',
						button2class: 'hidden',
						deleteButtonClass: "",
						saveButtonText: "Save",

						ruleId: id,
						fieldFrom: filter[id]['field'],
						fieldMatch: filter[id]['match'],
						fieldText: app.transform.from64str(filter[id]['text']),
						fieldFolder: filter[id]['to']

					});

					break;

				case 'deleteRule':
					var thisComp = this;
					var filter = app.user.get("filter");

					//filter=app.globalF.arrayRemove(filter,this.state.ruleId);
					console.log(filter);

					delete filter[this.state.ruleId];

					//pp.user.set({"filterChanged":true});
					//app.userObjects.updateObjects();

					app.userObjects.updateObjects('saveFilter', '', function (result) {
						if (result == 'saved') {
							thisComp.setState({ filterSet: thisComp.getFilter() });
							thisComp.handleClick("showFirst");
						} else if (result == 'newerFound') {
							//app.notifications.systemMessage('newerFnd');
						}
					});

					break;

				case 'selectRow':

					var id = $(event.target).parents('tr').attr('id');
					if (id != undefined) {
						this.handleClick('editRule', id);
					}

					break;

			}
		},

		componentWillUpdate: function (nextProps, nextState) {
			if (JSON.stringify(nextState.filterSet) !== JSON.stringify(this.state.filterSet)) {

				var t = $('#table1').DataTable();
				t.clear();
				var folders = nextState.filterSet;
				t.rows.add(folders);
				t.draw(false);
			}
		},

		/**
   *
   * @returns {JSX}
   */
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
								{ type: 'button', className: this.state.button1class, onClick: this.handleClick.bind(this, 'addFilterRule') },
								' Add Rule'
							),
							React.createElement(
								'button',
								{ type: 'button', className: this.state.button2class, onClick: this.handleClick.bind(this, 'clearFilterRules') },
								' Remove All Rules'
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
											'Filter'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'ion-funnel' })
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
								'div',
								{ className: this.state.inputSelectClass },
								React.createElement(
									'select',
									{ className: 'form-control', id: 'fromField',
										onChange: this.handleChange.bind(this, 'changeFrom'),
										value: this.state.fieldFrom },
									React.createElement(
										'option',
										{ value: 'sender' },
										'From'
									),
									React.createElement(
										'option',
										{ value: 'rcpt' },
										'To'
									),
									React.createElement(
										'option',
										{ value: 'subject' },
										'Subject'
									)
								)
							),
							React.createElement(
								'div',
								{ className: this.state.inputSelectClass },
								React.createElement(
									'select',
									{ className: 'form-control', id: 'matchField',
										onChange: this.handleChange.bind(this, 'changeMatch'),
										value: this.state.fieldMatch },
									React.createElement(
										'option',
										{ value: 'relaxed' },
										'Contains'
									),
									React.createElement(
										'option',
										{ value: 'negative' },
										'Does not Contain'
									),
									React.createElement(
										'option',
										{ value: 'strict' },
										'match'
									)
								)
							),
							React.createElement(
								'form',
								{ id: 'addRuleForm', className: '' },
								React.createElement(
									'div',
									{ className: this.state.inputSelectClass },
									React.createElement('input', { type: 'text', name: 'fromName', className: 'form-control', id: 'textField', placeholder: 'text',
										onChange: this.handleChange.bind(this, 'changeText'),
										value: this.state.fieldText })
								),
								React.createElement(
									'div',
									{ className: this.state.inputSelectClass },
									React.createElement(
										'select',
										{ className: 'form-control', defaultValue: '0', id: 'destinationField',
											onChange: this.handleChange.bind(this, 'changeDestination'),
											value: this.state.fieldFolder },
										React.createElement(
											'option',
											{ value: '0', disabled: true },
											'Move To'
										),
										this.getFolders()
									)
								)
							),
							React.createElement('div', { className: 'clearfix' }),
							React.createElement(
								'button',
								{ type: 'button', className: "btn btn-danger " + this.state.deleteButtonClass, onClick: this.handleClick.bind(this, 'deleteRule') },
								'Delete'
							),
							React.createElement(
								'div',
								{ className: 'pull-right dialog_buttons' },
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-primary', onClick: this.handleClick.bind(this, 'saveRule') },
									this.state.saveButtonText
								),
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-default', onClick: this.handleClick.bind(this, 'showFirst') },
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
									'Email Filter'
								),
								' - Creating an email filter requires 4 pieces of information:',
								React.createElement('br', null),
								React.createElement(
									'ol',
									null,
									React.createElement(
										'li',
										null,
										' The From: To: or Subject: to match'
									),
									React.createElement(
										'li',
										null,
										' Select if the rule applies when the text in the next box is matched, not matched, or is an exact match.'
									),
									React.createElement(
										'li',
										null,
										' The text being matched'
									),
									React.createElement(
										'li',
										null,
										' Select where the email should be delivered (inbox or a folder)'
									)
								),
								'If you like Once you are done, click the Add button to create the email filter.'
							)
						)
					)
				)
			);
		}

	});
});