define(['react'], function (React) {
	return React.createClass({
		getInitialState: function () {
			var suc = '<i class="fa fa-check text-success fa-lg"></i>';
			var fail = '<i class="fa fa-minus text-danger fa-lg"></i>';
			var dns = '<a><i class="fa fa-refresh fa-lg"></i></a>';
			var del = '<a class="delete" href="javascript:void(0);"><i class="fa fa-times fa-lg txt-color-red"></i></a>';

			var dataSet = [['scsdfsdfsdfsdfsdfdfgfgdfgdfgdfgdfgdfgdfgdfgsdfsdfsdfrail.com', '2015-05-18 07:44', '2015-05-18 07:44', del], ['dfdmail.com', '2015-04-18 07:44', '2015-01-18 07:44', del]];
			return {
				firstPanel: "panel-body",
				firstTab: "active",
				buttonText: "Add Domain",
				enableClass: "btn btn-primary pull-right",
				dataSet: dataSet
			};
		},

		componentDidMount: function () {
			var dtSet = this.state.dataSet;
			require(['dataTable', 'dataTableBoot'], function (DataTable, dataTableBoot) {

				$('#table1').dataTable({
					"dom": '<"top"i>rt<"#bottomPagination"p>',
					"data": dtSet,
					"columns": [{ "title": "filename" }, { "title": "modified" }, { "title": "created" }, { "title": "delete" }],
					"columnDefs": [{ "sClass": 'col-md-5 col-xs-4', "targets": 0 }, { "sClass": 'col-md-2 col-xs-2 text-align-center hidden-xs', "targets": [1] }, { "sClass": 'col-md-2 col-xs-2 text-align-center', "targets": [2] }, { "sClass": 'col-md-1 col-xs-2 text-align-center', "targets": [3] }, { 'bSortable': false, 'aTargets': [3] }, { "orderDataType": "data-sort", "targets": 0 }],
					"language": {
						"emptyTable": "No Files",
						"paginate": {
							"sPrevious": "<i class='fa fa-chevron-left'></i>",
							"sNext": "<i class='fa fa-chevron-right'></i>"
						}
					}
				});

				if (dtSet.length < 10) {
					$('#bottomPagination').addClass('hidden');
				} else {
					$('#bottomPagination').removeClass('hidden');
				}
			});
		},
		handleClick: function (i) {
			switch (i) {
				case 'email':
					break;
			}
		},
		render: function () {
			var rightClass = "Right col-xs-10 sRight";

			return React.createElement(
				'div',
				{ className: rightClass },
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
											{ className: 'panel-title personal-info-title' },
											'WebDiv Files'
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: this.state.firstPanel },
							React.createElement('table', { className: ' table table-hover table-striped datatable table-light', id: 'table1' })
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
									'Display Name'
								),
								' -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda. Possit menandri persequeris no has, cibo deleniti euripidis usu ei. Vel ea elit mentitum tacimates, ut omnis scribentur vis. Pri id dico consetetur repudiandae, vix no cibo quando offendit. At nam nibh deserunt, his at facer tantas, dicit quando mandamus his eu. Eros ocurreret has id, altera verterem molestiae ad eum. Ea saepe discere delicatissimi sea, ius ne dolor timeam epicuri, ne sea quod civibus convenire.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Signature'
								),
								' -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.'
							),
							React.createElement(
								'p',
								null,
								React.createElement(
									'b',
									null,
									'Signature'
								),
								' -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.'
							)
						)
					)
				)
			);
		}

	});
});