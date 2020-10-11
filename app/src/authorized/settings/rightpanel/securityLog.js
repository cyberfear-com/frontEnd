define(['react'], function (React) {
	return React.createClass({
		getInitialState : function() {
			var suc='<i class="fa fa-check text-success fa-lg"></i>';
			var fail='<i class="fa fa-minus text-danger fa-lg"></i>';
			var dns='<a><i class="fa fa-refresh fa-lg"></i></a>';
			var del='fail';

			var dataSet = [
				['login','2015-04-18 07:44','127.0.0.1','fail'],
				['smth else','2015-04-18 07:44','127.0.0.1','OK']
			];
			return {
				firstPanel: "panel-body",
				firstTab:"active",
				buttonText:"Add Domain",
				enableClass:"btn btn-primary pull-right",
				dataSet:dataSet
			};
		},
		componentDidMount: function() {
			var dtSet=this.state.dataSet;
			require(['dataTable','dataTableBoot'], function(DataTable,dataTableBoot) {

				$('#table1').dataTable(
					{
						"dom": '<"top"if>rt<"#bottomPagination"p>',
						"data": dtSet,
						"columns": [
							{ "title": "action" },
							{ "title": "time" },
							{ "title": "ip" },
							{ "title": "response" }
						],
						"columnDefs": [
							{ "sClass": 'col-md-6 col-xs-6', "targets": 0},
							{ "sClass": 'col-md-2 col-xs-2 text-align-center', "targets": [1]},
							{ "sClass": 'col-md-2 col-xs-2 text-align-center', "targets": [2]},
							{ "sClass": 'col-md-2 col-xs-2 text-align-center', "targets": [3]},
							{ "orderDataType": "data-sort", "targets": 0 }
						],
						"language": {
							"emptyTable": "Empty",
							"paginate": {
								"sPrevious": "<i class='fa fa-chevron-left'></i>",
								"sNext": "<i class='fa fa-chevron-right'></i>"
							}
						}
					}
				);

				if(dtSet.length<10){
					$('#bottomPagination').addClass('hidden');
				}else{
					$('#bottomPagination').removeClass('hidden');
				}

			});
		},
		handleClick: function(i) {
			switch(i) {
				case 'email':
				break;
			}


		},
		render: function () {

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">
				<div className="col-lg-7 col-xs-12 personal-info ">
					<div className="panel panel-default panel-setting">
						<div className="panel-heading">

							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className={this.state.firstTab}>
									<a onClick={this.handleClick.bind(this, 'showFirst')}>

										<h3 className={this.props.tabs.Header}>Security</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-user-secret"></i></h3>
									</a>
								</li>
							</ul>
						</div>


						<div className={this.state.firstPanel}>
							<table className=" table table-hover table-striped datatable table-light" id="table1">
							</table>
						</div>
					</div>
				</div>


				<div className="col-lg-5 col-xs-12 personal-info ">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title personal-info-title">Help</h3>

						</div>

						<div className="panel-body">

							<p>
								<b>Display Name</b> -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates
							patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte
							vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.

							Possit menandri persequeris no has, cibo deleniti euripidis usu ei. Vel ea elit mentitum tacimates, ut omnis
							scribentur vis. Pri id dico consetetur repudiandae, vix no cibo quando offendit. At nam nibh deserunt, his at
							facer tantas, dicit quando mandamus his eu. Eros ocurreret has id, altera verterem molestiae ad eum. Ea saepe
							discere delicatissimi sea, ius ne dolor timeam epicuri, ne sea quod civibus convenire.
							</p>
							<p>
								<b>Signature</b> -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates
							patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte
							vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.
							</p>

							<p>
								<b>Signature</b> -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates
							patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte
							vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.
							</p>
						</div>
					</div>
				</div>

			</div>
			);
		}

	});
});