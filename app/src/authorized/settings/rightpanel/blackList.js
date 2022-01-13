define(['react','app'], function (React,app) {
    "use strict";
	return React.createClass({

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

				filterSet:{},
                currentFilter:{},
				ruleId:"",
				fieldMatch:"emailM",
				fieldText:"",
                destination:0,

				ruleForm:{}

			};

		},

        /**
         *
         * @returns {Array}
         */
		getFilter:function(callback) {
			var alEm=[];
            var thisComp=this;

            //apicall to get all records

            app.serverCall.ajaxRequest('getBlockedEmails', {}, function (result) {
                if (result['response'] == "success") {
                    thisComp.setState({"currentFilter":result['data']});
                    $.each(result['data'], function( index, fRule ) {

                        var match='<span>'+(fRule['mF']=="1"?"Email Matching":fRule['mF']=="2"?"Email Not matching":fRule['mF']=="3"?"Domain Matching":"Domain Not Matching")+'</span> ';

                        var text='<span>"<b>'+app.transform.escapeTags(app.transform.from64str(fRule['txt']))+'</b>"</span> ';
                        var to='<span><b>'+ (fRule['dest']===0?"Dropped":"Accepted")+'</b></span>';
                        var el=
                        {
                            "DT_RowId": index,
                            "text": {
                                "display":'Sender`s ' +match+text+'<span>will be </span> '+to,
                                "index":index
                            }
                        };


                        alEm.push(el);

                        //console.log(emailData);

                    });
                    if(callback) callback(alEm);

                }
            });




			//console.log(alEm);

			//this.setState({filterSet:alEm});

		},


		componentDidMount: function() {

            this.getFilter(function(dtSet){
               // console.log(dtSet);

             //   var dtSet=this.getFilter();


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

            });

		//	this.handleClick("addFilterRule");

				this.setState({ruleForm:$("#addRuleForm").validate()});

			$("#textField").rules("add", {
				required: true,
				minlength: 1,
				maxlength: 255
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

				case 'changeMatch':

					this.setState({fieldMatch:event.target.value});
					break;

				case 'changeText':

					this.setState({fieldText:event.target.value});
					break;
                case 'changeDestination':

                    this.setState({destination:event.target.value});
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
                            fieldMatch:"emailM",
                            fieldText:"",
                            destination:0,



						}
					);

					var validator=this.state.ruleForm;
					validator.form();

					$("#textField").removeClass("invalid");
					$("#textField").removeClass("valid");

					validator.resetForm();

					break;

                case 'clearFilterRules':
                    var thisComp=this;

                    app.serverCall.ajaxRequest('deleteAllBlockedEmails', {}, function (result) {
                        if (result['response'] == "success") {
                            thisComp.getFilter(function(filter){
                                thisComp.setState({filterSet:filter});
                                thisComp.handleClick("showFirst");
                            })
                            app.notifications.systemMessage('saved');

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
                            console.log('what we got');
                            console.log(thisComp.state.ruleId);
                            console.log(thisComp.state.fieldMatch);
                            console.log(thisComp.state.fieldText);
                            console.log(thisComp.state.destination);

                            var post={
                                'ruleId':  thisComp.state.ruleId,
                                'matchField':thisComp.state.fieldMatch,
                                'text':thisComp.state.fieldText,
                                'destination':thisComp.state.destination
                            };


                             app.serverCall.ajaxRequest('saveBlockedEmails', post, function (result) {
                             if (result['response'] == "success") {
                                 thisComp.getFilter(function(filter){
                                     thisComp.setState({filterSet:filter});
                                     thisComp.handleClick("showFirst");
                                 })
                                 app.notifications.systemMessage('saved');


                             }
                             });

						}


					break;

				case 'editRule':

					var id=event;

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
						fieldMatch:this.state.currentFilter[id]['mF']===1?"emailM":this.state.currentFilter[id]['mF']===3?"domainM":"domainNM",
						fieldText:app.transform.from64str(this.state.currentFilter[id]['txt']),
                        destination:this.state.currentFilter[id]['dest']


					});

					break;

				case 'deleteRule':
					var thisComp=this;


                    var post={
                        'ruleId':  thisComp.state.ruleId,
                    };


                    app.serverCall.ajaxRequest('deleteBlockedEmails', post, function (result) {
                        if (result['response'] == "success") {
                            thisComp.getFilter(function(filter){
                                thisComp.setState({filterSet:filter});
                                thisComp.handleClick("showFirst");
                            })
                            app.notifications.systemMessage('saved');

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

										<h3 className={this.props.tabs.Header}>Black / White List</h3>
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
									Sender will be sorted if:
								</div>
                            <form id="addRuleForm" className="">
								<div className={this.state.inputSelectClass}>
									<select className="form-control" id="matchField"
									onChange={this.handleChange.bind(this, 'changeMatch')}
									value={this.state.fieldMatch}>
										<option value="domainM">Domain Match</option>
                                        {//<option value="domainNM">Domain Not Matched</option>
                                        }
										<option value="emailM">Email Match</option>
                                        {//  <option value="emailNM">Email Not Matched</option>
                                        }

									</select>
								</div>


								<div className={this.state.inputSelectClass}>
									<input type="text" name="fromName" className="form-control" id="textField" placeholder="text"
									onChange={this.handleChange.bind(this, 'changeText')}
									value={this.state.fieldText}/>
								</div>

                                <div className={this.state.inputSelectClass}>
                                    <select className="form-control" id="destinationField"
                                            onChange={this.handleChange.bind(this, 'changeDestination')}
                                            value={this.state.destination}>
                                        <option value="0">Drop</option>
                                        <option value="1">Accept</option>

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
								<b>Black List</b> - Will be saved on server, any email coming from outside of our server will be screened before reaching your email box. You can choose either to accept or drop email based on sender's email address or domain.
<br/> <br/>Email address is always has higher priority, than domain, i.e if you create rule to drop any email originated from <b>yahoo.com</b>, but second rule will accept email from: <b>'IamNigerianPrince@yahoo.com'</b> - it will drop any emails originated from yahoo.com, except coming from <b>'IamNigerianPrince@yahoo.com'</b>.<br/><br/>
                                This is <b>unencrypted list</b> of rules accessible by our server, in order to prevent mass spam attack of your email address. This list will be scanned time to time and domains having very high spam rating will be added to our universal spam filter.

							</p>
                            <p>
                                <b>Note.</b> This filter is not applicable to emails originated from our server. Please use 'Email Filter' to screen those emails.
                            </p>
						</div>
					</div>
				</div>
			</div>
			);
		}

	});
});