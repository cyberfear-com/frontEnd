define(['react','app','dataTable','dataTableBoot'], function (React,app,DataTable,dataTableBoot) {
    "use strict";
	return React.createClass({
        /**
         *
         */

        getInitialState : function() {
			return {

				firstPanelClass:"panel-body",
				secondPanelClass:"panel-body hidden",
				firstTab:"active",

				secondPanelText:"New Contact",

				button1text:"Add Contact",
				button1visible:"",
				button1onClick:"addNewContact",

				button2text:"Save",
				button2onClick:"saveContact",

				button3enabled:true,
				button3visible:"",
				button3text:"Cancel",
				button3onClick:"showFirst",

				contactsSet:{},
                rememberContacts: app.user.get("rememberContacts"),

            contactId:'',
				nameField:'',
				emailField:'',
				pinField:'',
				pgpField:'',
				pgpOn:false,

				keyStrength:"",
				keyFingerprint:"",
				keyDate:"",
				pubCorrect:true,

				keyForm:{}
			};
		},

        /**
         *
         * @returns {Array}
         */
		getContacts:function() {
			var alEm=[];

            var ff=app.user.get("contacts");

            delete ff[""];
			$.each(app.user.get("contacts"), function( index, contactData ) {
				//console.log(emailData);

				var el=
				{
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


			this.setState({contactsSet:alEm});
			return alEm;
		},

		componentDidMount: function() {
			//var dtSet=this.state.contactsSet;
			var dtSet=this.getContacts();

			var thisComp=this;


			$('#table1').dataTable(
				{
					"dom": '<"pull-left"f><"pull-right"p>"irt<"#bottomPagination">',
					"data": dtSet,

					"columns": [
						{ "data": {
							_:    "email.display",
							sort: "email.display"
						}
						},
						{ "data": {
							_:    "name.display",
							sort: "name.display"
						}
						}
					],
					"columnDefs": [
						{ "sClass": 'col-xs-6', "targets": [0,1]},
						{ "orderDataType": "data-sort", "targets": 0 }
					],
					"order": [[0,"asc"]],
					"sPaginationType": "simple",
					"language": {
						"emptyTable": "No Contacts",
						"sSearch":"",
						"searchPlaceholder": "Search",
						"paginate": {
							"sPrevious": "<i class='fa fa-chevron-left'></i>",
							"sNext": "<i class='fa fa-chevron-right'></i>"
						}
					}
				}
			);


			this.setState({keyForm:$("#editPGPkey").validate()});

			$.validator.addMethod("pubCorrect", function(value, element) {

				return thisComp.state.pubCorrect;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Public Key format is unknown");


			$("#pgpField").rules("add", {
				//required: true,
				//minlength: 200,
				//maxlength: 900,
				pubCorrect:true,
			});


			$("#nameField").rules("add", {
				//required: true,
				minlength: 1,
				maxlength: 200
			});

			$("#emailField").rules("add", {
				required: true,
				email:true,
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

		checkKey:function() {

			var isSuccess = app.globalF.validatePublicKey(this.state.pgpField);
			return isSuccess;
		},


		componentWillUpdate: function(nextProps, nextState) {
			if(JSON.stringify(nextState.contactsSet) !== JSON.stringify(this.state.contactsSet)){

				var t = $('#table1').DataTable();
				t.clear();
				var contacts=nextState.contactsSet;
				t.rows.add(contacts);
				t.draw(false);
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

							button1visible:"",

							contactId:"",
							nameField:"",
							emailField:"",
							pinField:"",
							pgpField:"",

							pgpOn:false,

							keyStrength:"",
							keyFingerprint:"",
							keyDate:""
						}
					);

					var validator=this.state.keyForm;
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
					var thisComp=this;
					app.globalF.checkPlanLimits('contacts',Object.keys(app.user.get('contacts')).length,function(result){
							if(result){

								thisComp.setState(
									{
										firstPanelClass:"panel-body hidden",
										secondPanelClass:"panel-body",
										firstTab:"active",

										secondPanelText:"New Contact",

										button1visible:"hidden",

										button2onClick:"saveNewContact",

										button4visible:"hidden"
									}
								);
							}
					});

					break;
				case 'deleteContact':
					var thisComp=this;

					$('#dialogModHead').html("Delete Contact");
					$('#dialogModBody').html("Contact will be deleted. Continue?");

					$('#dialogOk').on('click', function () {

						var id=thisComp.state.contactId;

						//console.log('ddd '+id);
					//	console.log(app.user.get("contacts")[id]);

						var contacts=app.user.get("contacts");
						delete contacts[id];


                        app.user.set({contactsChanged: true});
						app.userObjects.updateObjects('saveContacts','',function(result){
							if(result=='saved'){
								thisComp.getContacts();

								thisComp.handleClick('showFirst');
								$('#dialogPop').modal('hide');

							}else if(result=='newerFound'){
								//app.notifications.systemMessage('newerFnd');
								$('#dialogPop').modal('hide');
							}



						});


					});

					$('#dialogPop').modal('show');




					break;



				case 'selectRow':

					var thisComp=this;

					var id=$(event.target).parents('tr').attr('id');

					//console.log(id);
					if(id!=undefined){
						thisComp.setState({
							contactId:id
						})
						thisComp.handleClick('editContact',id);
					}

					//console.log($(event.target).parents('a').attr("class"));

					//console.log($(event.target).parents('tr').attr('id'));

					break;

				case 'editContact':
					var contacts=app.user.get("contacts");
					var contact=contacts[event];
					var thisComp=this;

					app.globalF.getPublicKeyInfo(app.transform.from64str(contact['pgp']),function(result){
						//keyData=result;
						thisComp.setState({
							keyStrength:result['strength'],
							keyFingerprint:result['fingerprint'],
							keyDate:result['created']
						});
					});
					this.setState(
						{
							firstPanelClass:"panel-body hidden",
							secondPanelClass:"panel-body",
							firstTab:"active",

							secondPanelText:"Edit Contact",

							button1visible:"hidden",

							contactId:event,
							nameField:app.transform.from64str(contact['n']),
							emailField:app.transform.from64str(contact['e']),
							pinField:app.transform.from64str(contact['p']),
							pgpOn:contact['pgpOn'],
							pgpField:app.transform.from64str(contact['pgp']),

							button4visible:"",
							button2onClick:"saveExistingContact"

						});

					//console.log(this.state.contactId);


					//console.log(contact);

					break;


				case 'saveNewContact':

					var thisComp=this;

					var validator=this.state.keyForm;
					validator.form();


					if (validator.numberOfInvalids() == 0)
					{

						var contacts=app.user.get("contacts");


						var contId=app.transform.to64str(thisComp.state.emailField)

						//console.log(contId);

							contacts[contId]={
								'n':app.transform.to64str(thisComp.state.nameField),
								'p':app.transform.to64str(thisComp.state.pinField),
								'e':app.transform.to64str(thisComp.state.emailField),
								'pgp':app.transform.to64str(thisComp.state.pgpField),
								'pgpOn':(thisComp.state.pgpField==""?false:thisComp.state.pgpOn)
							};

							//app.user.set({"contactsChanged": true});
						//	app.userObjects.updateObjects();

                        app.user.set({contactsChanged: true});

						app.userObjects.updateObjects('saveContacts','',function(result){
							if(result=='saved'){
								thisComp.getContacts();

								thisComp.handleClick('showFirst');
								$('#dialogPop').modal('hide');

							}else if(result=='newerFound'){
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

					var thisComp=this;

					var validator=this.state.keyForm;
					validator.form();

//console.log(this.state.pgpOn);
					if (validator.numberOfInvalids() == 0)
					{

						var contacts=app.user.get("contacts");


						if(
							contacts[thisComp.state.contactId]['n']!=app.transform.to64str(thisComp.state.nameField) ||
							contacts[thisComp.state.contactId]['p']!=app.transform.to64str(thisComp.state.pinField) ||
							contacts[thisComp.state.contactId]['e']!=app.transform.to64str(thisComp.state.emailField) ||
							contacts[thisComp.state.contactId]['pgp']!=app.transform.to64str(thisComp.state.pgpField) ||
							contacts[thisComp.state.contactId]['pgpOn']!=app.transform.to64str(thisComp.state.pgpOn)
							){


							contacts[thisComp.state.contactId]={
								'n':app.transform.to64str(thisComp.state.nameField),
								'p':app.transform.to64str(thisComp.state.pinField),
								'e':app.transform.to64str(thisComp.state.emailField),
								'pgp':app.transform.to64str(thisComp.state.pgpField),
								'pgpOn':thisComp.state.pgpOn
							};

                            app.user.set({contactsChanged: true});
							app.userObjects.updateObjects('saveContacts','',function(result){
								if(result=='saved'){
									thisComp.getContacts();

									thisComp.handleClick('showFirst');
								//	$('#dialogPop').modal('hide');

								}else if(result=='newerFound'){
									//app.notifications.systemMessage('newerFnd');
									//$('#dialogPop').modal('hide');
								}



							});

							//app.user.set({"contactsChanged": true});
							//app.userObjects.updateObjects();

							//console.log(this.state.contactId);
						}else{
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
		handleChange: function(action,event){
			switch(action) {

                case 'remCont':
                    this.setState(
                        {
                            rememberContacts:!this.state.rememberContacts
                        }
                    );
                    app.user.set({"inProcess":true});
                    app.user.set({"rememberContacts":!this.state.rememberContacts});

                    app.userObjects.updateObjects('userProfile','',function(response){
                        //restore copy of the object if failed to save
                      //  console.log(response);
                        if(response==='saved'){
                            app.user.set({"inProcess":false});
                        }else if(response==='newerFound'){

                            app.user.set({"inProcess":false});
                        }else if(response==='nothingUpdt'){

                            app.user.set({"inProcess":false});
                        }

                    });

                    break;



                case 'enablePublic':
					this.setState(
						{
							pgpOn:!this.state.pgpOn
						}
					);

					//console.log(event.target.value);
					break;

				case 'changeName':

					this.setState(
						{
							nameField:event.target.value
						}
					);

					break;
				case 'changeEmail':

					this.setState(
						{
							emailField:event.target.value
						}
					);

					break;
				case 'changePin':

					this.setState(
						{
							pinField:event.target.value
						}
					);

					break;

				case 'changePGP':

					var thisComp=this;
				//	console.log('ddd');
					this.setState(
						{
							pgpField:event.target.value
						},function(){
							app.globalF.getPublicKeyInfo(thisComp.state.pgpField,function(result){
								//keyData=result;
								thisComp.setState({
									keyStrength:result['strength'],
									keyFingerprint:result['fingerprint'],
									keyDate:result['created']
								});
							});
							app.globalF.validateKeys(thisComp.state.pgpField,'','',function(result){
								thisComp.setState({

									pubCorrect:result['pubCorrect']

								});
							});


						}
					);

					break;



			}
		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {
			var classFullSettSelect="form-group col-xs-12";

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">
				<div className="col-lg-7 col-xs-12 personal-info">
					<div className="panel panel-default panel-setting">
						<div className="panel-heading">

							<button type="button" className={"btn btn-primary pull-right "+this.state.button1visible } onClick={this.handleClick.bind(this, this.state.button1onClick)}> {this.state.button1text}</button>

							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className={this.state.firstTab}>
									<a onClick={this.handleClick.bind(this, 'showFirst')}>

										<h3 className={this.props.tabs.Header}>Contacts</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-users"></i></h3>
									</a>
								</li>
							</ul>
						</div>


						<div className={this.state.firstPanelClass}>
                            <div className="col-xs-12 col-lg-6">
                                <div className="form-group">
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox"
                                                   checked={this.state.rememberContacts}
                                                   onChange={this.handleChange.bind(this, 'remCont')} />
                                            Remember Contacts
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <table className=" table table-hover table-striped datatable table-light rowSelectable clickable" id="table1" onClick={this.handleClick.bind(this, 'selectRow')}>
								<thead>
									<tr>
										<th>email</th>
										<th>name</th>
									</tr>
								</thead>
							</table>

						</div>


						<div className={this.state.secondPanelClass}>
							<h3>
							{this.state.secondPanelText}
							</h3>
							<div className={classFullSettSelect}>

								<form id="editPGPkey" className="">

							<div className="form-group">
								<input type="text" name="nameField" className="form-control" id="nameField" placeholder="name"
								value={this.state.nameField}
								onChange={this.handleChange.bind(this, 'changeName')}
								/>
							</div>

							<div className="form-group">
								<input type="text" name="emailField" readOnly={(this.state.contactId!=""?true:false)} className="form-control" id="emailField" placeholder="email"
								value={this.state.emailField}
								onChange={this.handleChange.bind(this, 'changeEmail')}
								/>

							</div>

								<div className="form-group">
									<input type="text" name="pinField" className="form-control" id="pinField" placeholder="pin"
									value={this.state.pinField}
									readOnly={this.state.pgpOn}
									onChange={this.handleChange.bind(this, 'changePin')}
									/>
								</div>



									<div className="clearfix"></div>
								<input className="pull-left" type="checkbox"
								onChange={this.handleChange.bind(this, 'enablePublic')}
								checked={this.state.pgpOn}
								/>&nbsp; <label>Contact Public Key</label>

									<div className={(!this.state.pgpOn?"hidden":"")}>
									<p>Strength: {this.state.keyStrength!=""?this.state.keyStrength+' bits':""}</p>
									<p>Fingerprint: {this.state.keyFingerprint}</p>
									<p>Created: {this.state.keyDate!=""?(new Date(this.state.keyDate).toLocaleString()):""}</p>
									</div>

									<textarea className="form-control" rows="8" id="pgpField" name="pgpField"
									readOnly={!this.state.pgpOn}
									value={this.state.pgpField}
									onChange={this.handleChange.bind(this, "changePGP")}
									placeholder="Public Key"
									></textarea>
								</form>
							</div>





							<div className="clearfix"></div>
							<button type="button" className={"btn btn-danger pull-left "+this.state.button4visible}onClick={this.handleClick.bind(this, "deleteContact")}>Delete</button>

							<div className="pull-right dialog_buttons">
								<button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this, this.state.button2onClick)}>{this.state.button2text}
								</button>

								<button type="button" className={"btn btn-default "+this.state.button3visible} disabled={!this.state.button3enabled} onClick={this.handleClick.bind(this, this.state.button3onClick)}>{this.state.button3text}</button>
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
                                <b>Remember Contacts</b> - When this option is checked, new contacts will be auto-saved upon sending email.
                            </p>
                            <p>
                                <b>Name</b> - Enter the contact's real name.
                            </p>
                            <p>
                                <b>Email</b> - Enter the contact's email address.
                            </p>
                            <p>
                                <b>Pin</b> - This is optional. This is a number that you choose which consists of at least four digits. You share it with your contact via some other form of communication. Anytime you send that contact an email, they need to know the pin number in order to read it. If you choose to use pin numbers, you should choose a different one for each contact.
                            </p>
							<p>
								<b>Public Key</b> -  If you know the public key for a contact with an email address hosted by another email service, paste it into this box to gain the ability to send that contact PGP encrypted emails.

							</p>




						</div>
					</div>
				</div>

			</div>
			);
		}

	});
});