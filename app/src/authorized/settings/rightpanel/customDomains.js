define(['react','app','dataTable','dataTableBoot'], function (React,app,DataTable,dataTableBoot) {
    "use strict";
	return React.createClass({
        /**
         *
         * @returns {{
         * firstPanelClass: string,
         * secondPanelClass: string,
         * thirdPanelClass: string,
         * firstTab: string,
         * button1visible: string,
         * button2text: string,
         * dataSet: Array,
         * newdomain: string,
         * domainBase: string,
         * domainHash: string,
         * domainID: string
         * }}
         */
		getInitialState : function() {
			return {

				firstPanelClass:"panel-body",
				secondPanelClass:"panel-body hidden",
				thirdPanelClass:"panel-body hidden",

				firstTab:"active",

				button1visible:"",

				button2text:"Add Domain",

				dataSet:[],
				newdomain:'',
				domainBase:'', //todo blank in production
				domainHash:'',
				domainID:"",
                enableSub:false,
                subdomainList:[],
                subdomainListPlain:[],
                subdomain:"",
                tmpDom:""
			};
		},
		componentDidMount: function() {

			var thisComp=this;

			this.getCustomDomain(function(result){

				thisComp.setState({
					dataSet:result
				});


					});


				$('#table1').dataTable(
					{
						"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
						"data": [],

						"columns": [
							{ "data": "domain" },
							{ "data": "status" }
						],
						"columnDefs": [
							{ "sClass": 'col-xs-6 col-lg-10', "targets": 0},
							{ "sClass": 'col-xs-2 col-lg-2 text-align-center', "targets": [1]},
							{ 'bSortable': false, 'aTargets': [ 1 ] },
							{ "orderDataType": "data-sort", "targets": 0 }
						],
						"sPaginationType": "simple",

						"language": {
							"emptyTable": "No Domains",
							"sSearch":"",
							"paginate": {
								"sPrevious": "<i class='fa fa-chevron-left'></i>",
								"sNext": "<i class='fa fa-chevron-right'></i>"
							}
						}
					}
				);


			this.setState({aliasForm:$("#addNewAliasForm").validate({
				errorElement: "span",
				errorClass: "help-block",
				highlight: function(element) {
					$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
				},
				unhighlight: function(element) {
					$(element).closest('.form-group').removeClass('has-error').addClass('has-success');
				},
				errorPlacement: function (error, element) {
					if (element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				}
			})});



			$("#domainName").rules("add", {
				required: true,
				minlength: 3,
				maxlength: 90,
				remote: {
					url: app.defaults.get('apidomain')+"/checkDomainExistV2",
					type: "post",
					data:{
						domain:function(){
							return thisComp.state.newdomain;
						},

						'vrfString':function(){
							return thisComp.state.domainBase;
						},
						'userToken':app.user.get("userLoginToken")
					},
					dataFilter: function(data) {
						var json = JSON.parse(data);
						if(json['response']=='true') {
							return '"true"';
						}else if(json['response']=='false'){
							return "\"domain exist \"";
						}else if(json['domain']=='chkdomain'){
							return "\"check domain \"";
						}else if(json['vrfString']=='chckVrf'){
							return "\"check verification string \"";
						}

					}
				},
				messages: {
					remote: "already in use"
				}
			});

//this.handleClick('showThird');

		},

        /**
         *
         * @param callback
         */
		getCustomDomain:function(callback) {
			var alEm=[];

			app.serverCall.ajaxRequest('retrieveCustomDomainForUser', {}, function (result) {

					if (result['response'] == "success") {

						var domains=result['domains'];

						var sDomains=app.user.get("customDomains");
						$.each(sDomains, function( domain64, data ) {

							if(domains[domain64]!=undefined){
								var res=domains[domain64];

								sDomains[domain64]['alReg']=res['availableForAliasReg'];
								sDomains[domain64]['dkim']=res['dkimRec'];
								sDomains[domain64]['mxRec']=res['mxRec'];
								sDomains[domain64]['obsolete']=res['obsolete'];
								sDomains[domain64]['owner']=res['vrfRec'];
								sDomains[domain64]['pending']=res['pending'];

								sDomains[domain64]['spf']=res['spfRec'];
								sDomains[domain64]['suspended']=res['suspended'];



								var good='<i class="fa fa-check text-success fa-lg"></i>';

								var alert='<i class="fa fa-exclamation-triangle text-warning fa-lg"></i>';
								var danger='<i class="fa fa-exclamation-triangle text-danger fa-lg"></i>';

								var suspMessage='data-toggle="tooltip" data-placement="top" title="Account Pending"';
								var pendOwn=' data-toggle="popover" data-placement="bottom" title="Verification String" data-content="<span style=\'word-break:break-all;\'>'+app.transform.SHA256(data['sec'])+' </span>"';



								var inf=good;

								if(
									res['spfRec']!="1" ||
									res['dkimRec']!="1"
									){
									var inf=alert;
								}

								if(
									res['suspended']=="1" ||
										res['mxRec']!="1" ||
										res['vrfRec']!="1"
									){
									var inf=danger;
								}

								var el=
								{
									"DT_RowId": domain64,
									"domain":app.transform.from64str(domain64),
									"status": inf

								};
							}else{
								var el=
								{
									"DT_RowId": domain64,
									"domain":app.transform.from64str(domain64),
									"status": '<a class="deleteDomain">delete</a>'

								};
							}



							alEm.push(el);
						});


						//console.log(alEm);
						//return alEm;
					}

				callback(alEm);

			});


			//this.setState({dataSet:alEm});
			//console.log(alEm);
			//return alEm;
		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleClick: function(action,event) {
			switch(action) {
				case 'email':
				break;

                case 'addSubdomain':
                  //  subdomainList

                    var item=this.state.subdomainList;

                    if(this.state.subdomain!==""){
                        item.push(
                            <option key={app.transform.to64str(this.state.subdomain.toLowerCase())} value={this.state.subdomain.toLowerCase()}>{this.state.subdomain.toLowerCase()}</option>
                        );
                        this.setState({
                            subdomainList:item,
                            tmpDom:this.state.subdomain.toLowerCase(),
                            subdomain:""

                        });
                    }
                    break;

				case 'showFirst':

					this.setState(
						{
							firstPanelClass:"panel-body",
							secondPanelClass:"panel-body hidden",
							thirdPanelClass:"panel-body hidden",

							firstTab:"active",

							button1visible:'',

							domainID:"",
							newdomain:'',
							domainBase:'',
							domainHash:'',
                            enableSub:false,
                            subdomainList:[],
                            subdomainListPlain:[],
                            subdomain:"",
                            tmpDom:""

						}
					);



					$("#domainName").parents('div').removeClass("has-error");
					$("#domainName").parents('div').removeClass("has-success");

					var validator = $("#addNewAliasForm").validate();
					validator.resetForm();


					break;

				case 'addNewDomain':
                    var thisComp=this;
					app.globalF.checkPlanLimits('addDomain',Object.keys(app.user.get('customDomains')).length,function(result){
							if(result){
                                thisComp.setState(
									{
										firstPanelClass:"panel-body hidden",
										secondPanelClass:"panel-body",
										firstTab:"active",

										button1visible:'hidden'
									}
								);
							}else{
								//console.log(this.props.activePage);
								//this.props.activePage("Plan");
								thisComp.props.updateAct("Plan");
								//this.props.activeLink.plan

								Backbone.history.navigate("/settings/Plan", {
									trigger : true
								});
							}
					});


					break;

				case 'showThird':

					this.setState(
						{
							firstPanelClass:"panel-body hidden",
							secondPanelClass:"panel-body hidden",
							thirdPanelClass:"panel-body",

							firstTab:"active",

							button1visible:'hidden',

							newdomain:'',
							domainBase:'',
							domainHash:'',
                            enableSub:false

						}
					);

					var thisComp=this;

					var domains=app.user.get('customDomains');
					var id=event;

					console.log(domains[id]);
					var status="0";
					if(domains[id]['pending']=="1"){
						status="1";
					}else if(domains[id]['obsolete']=="1"){
						status="2";
					}else if(domains[id]['suspended']=="1"){
						status="3";
					}else if(
							domains[id]['spf']!="1" ||
							domains[id]['dkim']!="1" ||
							domains[id]['mxRec']!="1" ||
							domains[id]['owner']!="1"
						){
						status="4";
					}

                    var item=[];

                    if(domains[id]['subdomain']!==undefined && domains[id]['subdomain'].length>0){

                        $.each(domains[id]['subdomain'], function( ind, subdm64 ) {
                            item.push(
                                <option key={subdm64} value={app.transform.from64str(subdm64)}>{app.transform.from64str(subdm64)}</option>
                            );

                        });

                    }

                    
					thisComp.setState({
						domain:app.transform.from64str(id),
						verfString:app.transform.SHA256(domains[id]['sec']),
                        subdomainListPlain:[],
						spf:domains[id]['spf'],
						mx:domains[id]['mxRec'],
						owner:domains[id]['owner'],
						dkim:domains[id]['dkim'],
						status:status,
                        subdomain:"",
                        subdomainList:item

					});


					break;

                case 'updateDomain':
                    var thisComp=this;

                    if(this.state.domainID!=undefined){
                        var custDomain=app.user.get('customDomains')[this.state.domainID];
                        var subdomains=this.state.subdomainList;

                        var tmpArr=[];
                        if(subdomains.length>0){

                            $.each(subdomains, function( ind, objct ) {
                                tmpArr.push(objct['key']);
                            });
                            custDomain['subdomain']=tmpArr;
                        }else{
                            custDomain['subdomain']=[];
                        }

                        app.user.set({
                            newDomain:{
                                'id':this.state.domainID,
                                'domain':custDomain['domain'],
                                'subdomain':custDomain['subdomain'],
                                'vrfString':custDomain['vrfString'],
                                'sec':custDomain['sec'],
                                'spf':custDomain['spf'],
                                'mxRec':custDomain['mxRec'],
                                'owner':custDomain['owner'],
                                'dkim':custDomain['dkim'],
                                'alReg':custDomain['alReg'],
                                'pending':custDomain['pending'],
                                'suspended':custDomain['suspended'],
                                'obsolete':custDomain['obsolete'],
                            }
                        });


                        app.userObjects.updateObjects('updateDomain','',function(result){

                            if (result['response'] == "success") {
                                if(result['data']=='saved'){

                                    thisComp.getCustomDomain(function(result){
                                        thisComp.setState({
                                            dataSet:result
                                        });
                                    });

                                    thisComp.handleClick('showFirst');

                                }else if(result['data']=='newerFound'){
                                    //app.notifications.systemMessage('newerFnd');
                                    thisComp.handleClick('showFirst');
                                }

                            }
                        });


                    }


                    break;

			case 'saveNewDomain':
				var emfValidator = this.state.aliasForm;
				var thisComp=this;
				emfValidator.form();



				if (emfValidator.numberOfInvalids() == 0 ){

					app.user.set({
						newDomain:{
							'id':app.transform.to64str(thisComp.state.newdomain),
							'domain':this.state.newdomain,
                            'subdomain':'',
							'vrfString':thisComp.state.domainBase,
							'sec':thisComp.state.domainBase,
							'spf':false,
							'mxRec':false,
							'owner':false,
							'dkim':false,
							'alReg':false,
							'pending':true,
							'suspended':false,
							'obsolete':false
						}
					});

					console.log(app.user);

					app.userObjects.updateObjects('savePendingDomain','',function(result){

							if (result['response'] == "success") {
								if(result['data']=='saved'){

									thisComp.getCustomDomain(function(result){
										thisComp.setState({
											dataSet:result
										});
									});

									thisComp.handleClick('showFirst');

								}else if(result['data']=='newerFound'){
									//app.notifications.systemMessage('newerFnd');
									thisComp.handleClick('showFirst');
								}

							}
					});

				}


				break;

				case 'deleteDomain':

					var thisComp=this;

					var aliases=app.user.get('allKeys');
					var dom=app.transform.from64str(thisComp.state.domainID);
					var alias=false;
					$.each(aliases, function( id, email ) {
						var domain=app.globalF.getEmailDomain(app.transform.from64str(email['email']));
						//console.log(domain);
						if(dom==domain){
							alias=true;
						}
					//this.state.domainID
					});
					if(alias){

						$('#infoModHead').html("Alias Exist");
						$('#infoModBody').html("Please remove all aliases associated with this domain before deleting");
						$('#infoModal').modal('show');


					}else{
						$('#dialogModHead').html("Delete");
						$('#dialogModBody').html("If you deleting Custom Domain you won't be able to receive or send emails with it. Continue?");

						var id=this.state.domainID;
						$('#dialogOk').on('click', function () {

							//var domains=app.user.get('customDomains');
							//delete domains[id];

							app.user.set({
								newDomain:{
									'id':id
								}
							});

							$('#dialogPop').modal('hide');

							app.userObjects.updateObjects('deleteDomain','',function(result){

								if (result['response'] == "success") {
									if(result['data']=='saved'){

										thisComp.getCustomDomain(function(result){
											thisComp.setState({
												dataSet:result
											});
										});

										thisComp.handleClick('showFirst');

									}else if(result['data']=='newerFound'){
										//app.notifications.systemMessage('newerFnd');
										thisComp.handleClick('showFirst');
									}

								}
							});



							//thisComp.handleClick('showFirst');

						});

						$('#dialogPop').modal('show');
					}



					break;

				case 'refreshDNS':

					var thisComp=this;


					thisComp.setState({
						refreshIclass:"fa fa-refresh fa-spin"
					});


					thisComp.getCustomDomain(function(result){

						thisComp.setState({
							dataSet:result
						});

						app.user.set({"customDomainChanged":true});
						//app.userObjects.updateObjects();

						setTimeout(function(){
							thisComp.handleClick("showThird",thisComp.state.domainID);
							thisComp.setState({
								refreshIclass:""
							});
						},1000);

					});

					break;
				case 'selectRow':
					//domainID:""

					var id=$(event.target).parents('tr').attr('id');
					if(id!=undefined){
						this.setState({
							domainID:$(event.target).parents('tr').attr('id')
						});
						this.handleClick('showThird',$(event.target).parents('tr').attr('id'));
					}


					//$(event.target).parents('tr').toggleClass('highlight');
					//console.log($(event.target).parents('a').attr("class"));

					//console.log($(event.target).attr("class"));


					break;

			}

		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleChange: function(action,event){
			switch(action) {
				case 'typingDomain':
					var str=app.generate.makeVerificationString(event.target.value.toLowerCase());

					this.setState({
						newdomain:event.target.value.toLowerCase(),
						domainBase:str['base'],
						domainHash:str['hash']
					});

					break;
                case 'subdomain':
                    this.setState({
                        subdomain: event.target.value.toLowerCase(),
                    });
                    break;
                case 'enableSub':
                    this.setState({
                        enableSub: !this.state.enableSub,
                    });
                    break;



			}
		},

		componentWillUpdate: function(nextProps, nextState) {
			if(JSON.stringify(nextState.dataSet) !== JSON.stringify(this.state.dataSet)){

				var t = $('#table1').DataTable();
				t.clear();
				var dataAlias=nextState.dataSet;
				t.rows.add(dataAlias);
				t.draw(false);
			}


			//$("[data-toggle='tooltip']").tooltip();
			//$('[data-toggle="popover"]').popover({
			//	html : true
			//});

		},

		//function changingDomain() {
		//var str=makeVerificationString($('#newCustomDomain').val().toLowerCase());
		//$('#secretSTR').val(str['hash']);
	//}

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			var classFullSettSelect="form-group col-xs-12";

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">

				<div className="col-lg-7 col-xs-12 personal-info ">
					<div className="panel panel-default panel-setting">
						<div className="panel-heading">

							<button type="button" className={"btn btn-primary pull-right " +this.state.button1visible} onClick={this.handleClick.bind(this, 'addNewDomain')}> Add Domain</button>

							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className={this.state.firstTab}>
									<a onClick={this.handleClick.bind(this, 'showFirst')}>
										<h3 className={this.props.tabs.Header}>Custom Domain</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-at"></i></h3>
									</a>
								</li>
							</ul>
						</div>


						<div className={this.state.firstPanelClass}>
							<table className=" table table-hover table-striped datatable table-light rowSelectable clickable" id="table1" onClick={this.handleClick.bind(this, 'selectRow')}>
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th>&nbsp;</th>

									</tr>
								</thead>
							</table>
						</div>

						<div className={this.state.secondPanelClass}>
							<h3>
							Add Domain
							</h3>

							<form id="addNewAliasForm" className="">

								<div className={classFullSettSelect}>
									<div className="input-group">
										<div className="input-group-addon">@</div>
										<input id="domainName" name="domain" type="text" className="form-control" placeholder="enter domain" value={this.state.newdomain} onChange={this.handleChange.bind(this, 'typingDomain')}/>

									</div>

								</div>
							</form>

								<div className={classFullSettSelect}>
									<label>Verification String</label>
									<input type="text" className="form-control" placeholder="" value={this.state.domainHash} readOnly />
								</div>

							<div className="clearfix"></div>
							<div className="pull-right dialog_buttons">
								<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, 'saveNewDomain')}>Add Domain</button>
								<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'showFirst')}>Cancel</button>
							</div>
						</div>

						<div className={this.state.thirdPanelClass}>
							<h3>
							Info:
							</h3>

							<table className=" table table-hover table-striped datatable table-light">
									<tr>
										<td className="col-xs-3"><b>Domain:</b></td>
										<td className="col-xs-9">{this.state.domain}</td>
									</tr>


                                    <tr>
                                        <td className="col-xs-3"><b>Subdomain:</b></td>
                                        <td className="col-xs-9">

                                            <div className="col-xs-12 col-lg-6">
                                                <div className="form-group" style={{marginBottom: "0px"}}>
                                                    <select className="form-control"  value={this.state.tmpDom}>
                                                        <option value="0" disabled>Enter subdomain</option>
                                                        {this.state.subdomainList}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-lg-6">
                                                <div className="input-group">
                                                    <input type="email"  name="email" id="emNotInp" className="form-control"
                                                           placeholder="subdomain"
                                                           value={this.state.subdomain}
                                                           onChange={this.handleChange.bind(this, 'subdomain')}/>
      <span className="input-group-btn">
        <button className="btn btn-default btn-success" type="button" style={{padding: "7px 12px"}} onClick={this.handleClick.bind(this, 'addSubdomain')}><i className="fa fa-plus fa-lg"></i></button>
      </span>
                                                    </div>
                                                </div>


                                        </td>
                                    </tr>
                                    <tr>




										<td><b>Verification String:</b></td>
										<td>{this.state.verfString}</td>
								</tr>
								<tr>
										<td><b>SPF:</b></td>
										<td className={this.state.spf=='1'?"text-success bold":"text-danger bold"}>{this.state.spf=='1'?"verified":"failed"}</td>
								</tr>
								<tr>
										<td><b>MX:</b></td>
										<td className={this.state.mx=='1'?"text-success bold":"text-danger bold"}>{this.state.mx=='1'?"verified":"failed"}</td>
								</tr>
								<tr>
										<td><b>Owner:</b></td>
										<td className={this.state.owner=='1'?"text-success bold":"text-danger bold"}>{this.state.owner=='1'?"verified":"failed"}</td>
								</tr>
								<tr>
										<td><b>DKIM:</b></td>
										<td className={this.state.dkim=='1'?"text-success bold":"text-danger bold"}>{this.state.dkim=='1'?"verified":"failed"}</td>
								</tr>
								<tr>
										<td><b>Status:</b></td>
										<td className={this.state.status=='0'?"text-success bold":
											this.state.status=='1'?"text-warning bold":"text-danger bold"}>{
											this.state.status=="0"?"good":
											this.state.status=="1"?"pending":
											this.state.status=="2"?"obsolete":
											this.state.status=="3"?"suspended":
											this.state.status=="4"?"Some Error":""
											}</td>

									</tr>

							</table>
							<div className="clearfix"></div>
							<button type="button" className="btn btn-danger" onClick={this.handleClick.bind(this, 'deleteDomain')}>Delete</button>
							<div className="pull-right dialog_buttons">
                                <button type="button" className="btn btn-success" onClick={this.handleClick.bind(this, 'updateDomain')}><i className={this.state.updateDomainI}></i> Save Changes</button>

								<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'refreshDNS')}><i className={this.state.refreshIclass}></i> Refresh DNS</button>
								<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, 'showFirst')}>OK</button>
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
                                <b>Domain</b> - The domain name you own and want to setup with mail hosting at CyberFear.com.
                            </p>
                            <p>
                                <b>Verification String</b> - A randomly generated string that verifies ownership of your domain. Create a TXT record in your DNS zone file in the format  <code>@ IN TXT cyberfear=Verification String</code>
                            </p>

                            <p>
                                <b>SPF Record</b> - An SPF record is a TXT record in your DNS zone and used to signal that CyberFear is authorized to send email from your custom domain name. This record is important for passing spam checks at your contacts email hosting servers. Create the TXT record in your DNS zone file with the format <code>@ IN TXT v=spf1 include:cyberfear.com ~all</code>
                                <br/><ul><li> If you already have an SPF record, or need help creating a record that lets you send email from other servers too, please use this <a href="http://www.emailquestions.com/spf-wizard/" target="_blank">SPF wizard</a></li> </ul><br/>Note: Link will be opened to the third party website
                            </p>


                            <p>
                                <b>MX Record</b> - Create/replace a single MX record with priority 10 to hostname  <code>custom.cyberfear.com</code>
                            </p>

                            <p>
                                <b>Owner</b> - This will indicate If the system was able to verify your ownership over the domain.
                            </p>

                            <p className="break-all">
                                <b>DKIM</b> - DKIM is a digital signature that is sent along with email to verify that a server is authorized to send email on behalf of your domain. This is another step to comply and pass spam check. Please create the TXT record in your zone file:  <code>default._domainkey
                                v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTNXD2KoQUiAmAJcp05gt0dStpoiXf0xDsD6T4M/THCT461Ata4EyuYQhJHSbZ6IDvMMrkZymLYdhbgsue6YWX44UVoX1LSYKt64HaMG+H9TrEbksH6UpbYcCDKGc7cUYolrwwmUh4fxnC3x5REbpCT7FhsHj5I3D1wmid+Yj25wIDAQAB;</code>
                            </p>

                            <p>
                                <b>Status</b> - Our servers occasionally check your DNS records to verify that all information is correct, and it will warn you if there are any errors that need to be fixed.
                            </p>

							<p>
								<b>More information is available on our blog</b> - <a href="https://blog.cyberfear.com/adding-custom-domain/" target="_blank">https://blog.cyberfear.com/adding-custom-domain/</a>
							</p>

						</div>
					</div>
				</div>

			</div>
			);
		}

	});
});