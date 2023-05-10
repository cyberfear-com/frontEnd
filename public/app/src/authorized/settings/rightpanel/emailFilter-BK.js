define(['react','app'], function (React,app) {
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
		getInitialState : function() {
			return {

				firstPanelClass:"panel-body",
				secondPanelClass:"panel-body hidden",
				firstTab:"active",
				secondTab:"",
				secondPanelText:"Add New Rule",

				button1class:'btn btn-primary pull-right',
                button2class:'btn btn-warning pull-right margin-right-30',


				inputNameClass:"form-group col-xs-12 col-sm-6 col-lg-7",
				inputNameChange:"changeFolderName",

				inputSelectClass:"form-group col-xs-12 col-sm-6 col-lg-6",

				inputSelectChange:"changeFolderExpiration",

				filterSet:{},

				ruleId:"",
				fieldFrom:"sender",
				fieldMatch:"strict",
				fieldText:"",
				fieldFolder:"1",

				ruleForm:{}

			};

		},

        /**
         *
         * @returns {Array}
         */
		getFilter:function() {
			var alEm=[];


			$.each(app.user.get("filter"), function( index, fRule ) {

					var folder=app.user.get("folders")[fRule['to']];

					//console.log(folder!=undefined);
					var folderName=(folder!=undefined)?app.transform.from64str(folder['name']):'Inbox';
					//var folderName='Inbox';
					var from='<span><b>'+(fRule['field']=="rcpt"?"recipient":fRule['field']=="sender"?"sender":fRule['field']=="subject"?"subject":"")+'</b></span> ';
					var match='<span>'+(fRule['match']=="strict"?"match":fRule['match']=="relaxed"?"contains":"not contain")+'</span> ';
					var text='<span>"<b>'+app.transform.escapeTags(app.transform.from64str(fRule['text']))+'</b>"</span> ';
					var to='<span><b>'+ app.transform.escapeTags(folderName)+'</b></span>';
				var el=
					{
						"DT_RowId": index,
						"text": {
							"display":from+match+text+'<span>will be moved to </span> '+to,
							"index":index
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
		getFolders:function() {

			var folder=app.user.get('folders');
			var options=[];
			$.each(folder, function( index, folder ) {
				options.push(<option key={index} value={index}>{app.transform.from64str(folder['name'])}</option>)
			});
			return options;
		},

		componentDidMount: function() {
			var dtSet=this.getFilter();

			require(['dataTable','dataTableBoot'], function(DataTable,dataTableBoot) {

				$('#table1').dataTable(
					{
						"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
						"data": dtSet,
						"columns": [
							{ "data": {
								_:    "text.display",
								sort: "text.index"
							}}

						],
						"columnDefs": [
							{ "sClass": 'col-xs-12', "targets": [0]},
							{ "orderDataType": "data-sort", "targets": 0 }
						],
						"order": [[0,"asc"]],
						"sPaginationType": "simple",
						"language": {
							"emptyTable": "Empty",
							"sSearch":"",
							"searchPlaceholder": "Search",
							"paginate": {
								"sPrevious": "<i class='fa fa-chevron-left'></i>",
								"sNext": "<i class='fa fa-chevron-right'></i>"
							}
						}
					}
				);

			});
		//	this.handleClick("addFilterRule");

				this.setState({ruleForm:$("#addRuleForm").validate()});

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
		handleChange: function(action,event){
			switch(action) {
				case 'changeFrom':

					this.setState({fieldFrom:event.target.value});
					break;

				case 'changeMatch':

					this.setState({fieldMatch:event.target.value});
					break;

				case 'changeText':

					this.setState({fieldText:event.target.value});
					break;

				case 'changeDestination':

					this.setState({fieldFolder:event.target.value});
					break;

			}
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'showFirst':
					this.setState(
						{

							firstPanelClass:"panel-body",
							secondPanelClass:"panel-body hidden",

							firstTab:"active",
							secondTab:"",

							button1class:'btn btn-primary pull-right',
                            button2class:'btn btn-warning pull-right margin-right-30',

							secondPanelText:"Add New Rule",



                            ruleId:"",
                            fieldFrom:"sender",
                            fieldMatch:"strict",
                            fieldText:"",
                            fieldFolder:"1",

						}
					);

					var validator=this.state.ruleForm;
					validator.form();

					$("#textField").removeClass("invalid");
					$("#textField").removeClass("valid");

					$("#destinationField").removeClass("invalid");
					$("#destinationField").removeClass("valid");

					validator.resetForm();

					break;

                case 'clearFilterRules':
                    app.user.set({"filter":{}});
                    var thisComp=this;

                    app.userObjects.updateObjects('saveFilter','',function(result){
                        if(result=='saved'){
                            thisComp.setState({filterSet:thisComp.getFilter()});
                            thisComp.handleClick("showFirst");
                            app.notifications.systemMessage('saved');

                        }else if(result=='newerFound'){
                            app.notifications.systemMessage('newerFnd');
                        }else if(result=='nothingUpdt'){
                            app.notifications.systemMessage('nthTochngORexst');
                        }


                    });

                    break;
				case 'addFilterRule':
					var thisComp=this;
					app.globalF.checkPlanLimits('filter',Object.keys(app.user.get('filter')).length,function(result){
							if(result){
								thisComp.setState({

									firstPanelClass:"panel-body hidden",
									secondPanelClass:"panel-body ",
									firstTab:"active",
									secondTab:"",

									secondPanelText:"Add New Rule",

									deleteButtonClass:"hidden",
									saveButtonText:"Add",

									button1class:'hidden',
                                    button2class:'hidden',

								});
							}
					});

				break;
				case 'saveRule':

					var validator=this.state.ruleForm;

					validator.form();
					var thisComp=this;

						if (validator.numberOfInvalids() == 0)
						{

							var id=thisComp.state.ruleId;
							var from=thisComp.state.fieldFrom;
							var match=thisComp.state.fieldMatch;
							var folder=thisComp.state.fieldFolder;
							var text=thisComp.state.fieldText;

							app.globalF.createFilterRule(id,from,match,folder,text,function(){

								app.userObjects.updateObjects('saveFilter','',function(result){
									if(result=='saved'){
										thisComp.setState({filterSet:thisComp.getFilter()});
										thisComp.handleClick("showFirst");
										app.notifications.systemMessage('saved');

									}else if(result=='newerFound'){
										app.notifications.systemMessage('newerFnd');
									}else if(result=='nothingUpdt'){
										app.notifications.systemMessage('nthTochngORexst');
									}


								});

								//thisComp.setState({filterSet:thisComp.getFilter()});
								//thisComp.handleClick("showFirst");

							});

						}


					break;

				case 'editRule':

					var filter=app.user.get("filter");
					var id=event;


					console.log(id);
					this.setState({
						firstPanelClass:"panel-body hidden",
						secondPanelClass:"panel-body ",
						firstTab:"active",
						secondTab:"",

						secondPanelText:"Edit Rule",

						button1class:'hidden',
                        button2class:'hidden',
						deleteButtonClass:"",
						saveButtonText:"Save",

						ruleId:id,
						fieldFrom:filter[id]['field'],
						fieldMatch:filter[id]['match'],
						fieldText:app.transform.from64str(filter[id]['text']),
						fieldFolder:filter[id]['to']


					});

					break;

				case 'deleteRule':
					var thisComp=this;
					var filter=app.user.get("filter");

					//filter=app.globalF.arrayRemove(filter,this.state.ruleId);
					console.log(filter);

					delete filter[this.state.ruleId];

						//pp.user.set({"filterChanged":true});
					//app.userObjects.updateObjects();

					app.userObjects.updateObjects('saveFilter','',function(result){
						if(result=='saved'){
							thisComp.setState({filterSet:thisComp.getFilter()});
							thisComp.handleClick("showFirst");

						}else if(result=='newerFound'){
							//app.notifications.systemMessage('newerFnd');
						}

					});


					break;

				case 'selectRow':

					var id=$(event.target).parents('tr').attr('id');
					if(id!=undefined){
						this.handleClick('editRule',id);
					}


					break;

			}


		},

		componentWillUpdate: function(nextProps, nextState) {
			if(JSON.stringify(nextState.filterSet) !== JSON.stringify(this.state.filterSet)){

				var t = $('#table1').DataTable();
				t.clear();
				var folders=nextState.filterSet;
				t.rows.add(folders);
				t.draw(false);
			}
		},


        /**
         *
         * @returns {JSX}
         */
		render: function () {

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">

				<div className="col-lg-7 col-xs-12 personal-info ">
					<div className="panel panel-default panel-setting">
						<div className="panel-heading">

							<button type="button" className={this.state.button1class} onClick={this.handleClick.bind(this, 'addFilterRule')}> Add Rule</button>
                            <button type="button" className={this.state.button2class} onClick={this.handleClick.bind(this, 'clearFilterRules')}> Remove All Rules</button>

							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className={this.state.firstTab}>
									<a onClick={this.handleClick.bind(this, 'showFirst')}>

										<h3 className={this.props.tabs.Header}>Filter</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="ion-funnel"></i></h3>
									</a>
								</li>
							</ul>
						</div>


						<div className={this.state.firstPanelClass}>
							<table className=" table table-hover table-striped datatable table-light rowSelectable clickable" id="table1" onClick={this.handleClick.bind(this, 'selectRow')}>
								<thead>
									<tr>
										<th>&nbsp;</th>
									</tr>
								</thead>
							</table>
						</div>

						<div className={this.state.secondPanelClass}>
							<h3>
							{this.state.secondPanelText}
							</h3>


								<div className={this.state.inputSelectClass}>
									<select className="form-control" id="fromField"
									onChange={this.handleChange.bind(this, 'changeFrom')}
									value={this.state.fieldFrom}>
										<option value="sender">From</option>
										<option value="rcpt">To</option>
										<option value="subject">Subject</option>

									</select>
								</div>
								<div className={this.state.inputSelectClass}>
									<select className="form-control" id="matchField"
									onChange={this.handleChange.bind(this, 'changeMatch')}
									value={this.state.fieldMatch}>
										<option value="relaxed">Contains</option>
										<option value="negative">Does not Contain</option>
										<option value="strict">match</option>

									</select>
								</div>
							<form id="addRuleForm" className="">

								<div className={this.state.inputSelectClass}>
									<input type="text" name="fromName" className="form-control" id="textField" placeholder="text"
									onChange={this.handleChange.bind(this, 'changeText')}
									value={this.state.fieldText}/>
								</div>

								<div className={this.state.inputSelectClass}>
									<select className="form-control" defaultValue="0" id="destinationField"
									onChange={this.handleChange.bind(this, 'changeDestination')}
									value={this.state.fieldFolder}>
										<option value="0" disabled>Move To</option>

										{this.getFolders()}

									</select>
								</div>


							</form>

							<div className="clearfix">
								</div>
							<button type="button" className={"btn btn-danger "+this.state.deleteButtonClass} onClick={this.handleClick.bind(this, 'deleteRule')}>Delete</button>

							<div className="pull-right dialog_buttons">

								<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, 'saveRule')}>{this.state.saveButtonText}</button>
								<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'showFirst')}>Cancel</button>
							</div>

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
								<b>Email Filter</b> - Creating an email filter requires 4 pieces of information:
<br/><ol>
                                <li> The From: To: or Subject: to match</li>
                                <li> Select if the rule applies when the text in the next box is matched, not matched, or is an exact match.</li>
                                <li> The text being matched</li>
                                <li> Select where the email should be delivered (inbox or a folder)</li>
</ol>
                                If you like
                                Once you are done, click the Add button to create the email filter.
							</p>

						</div>
					</div>
				</div>
			</div>
			);
		}

	});
});