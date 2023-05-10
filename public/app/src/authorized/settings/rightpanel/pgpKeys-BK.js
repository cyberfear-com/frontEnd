define(['react','app','dataTable','dataTableBoot'], function (React,app,DataTable,dataTableBoot) {
    "use strict";
	return React.createClass({
        /**
         *
         * @returns {{
         * firstPanelClass: string,
         * secondPanelClass: string,
         * firstTab: string,
         * button1text: string,
         * button1enabled: boolean,
         * button1iClass: string,
         * button1onClick: string,
         * txtArea1readonly: boolean,
         * txtArea1value: string,
         * txtArea1onchange: string,
         * txtArea2readonly: boolean,
         * txtArea2value: string,
         * txtArea2onchange: string,
         * dataSet: Array,
         * keyEmail: string,
         * keyBit: string,
         * emailSince: string,
         * keyStrength: number,
         * inputSelectClass: string,
         * inputSelectDisabled: boolean,
         * keysForm: object,
         * pubCorrect: boolean,
         * pubBit2strong: boolean,
         * pubmatch: boolean,
         * privCorrect: boolean,
         * privPass: boolean,
         * privmatch: boolean,
         * privpassText: string,
         * privtextVisible: string,
         * privTextDisabled: boolean,
         * keyDate: string,
         * keyId: string
         * }}
         */
		getInitialState : function() {
			return {

				firstPanelClass:"panel-body",
				secondPanelClass:"panel-body hidden",
				firstTab:"active",

				button1text:"Add Domain",
				button1enabled:true,
				button1iClass:"",
				button1onClick:"addNewDomain",

				//button2text:"Save",
				//button2enabled:false,
				//button2iClass:"",
				//button2onClick:"saveKeys",

				txtArea1readonly:true,
				txtArea1value:"",
				txtArea1onchange:'checkPubKey',

				txtArea2readonly:true,
				txtArea2value:"",
				txtArea2onchange:'checkPrivKey',

				dataSet:[],
				keyEmail:"",
                keyName:"",
				keyBit:"",
				emailSince:"",
				keyStrength:0,
				inputSelectClass:"form-group pull-right col-xs-6 col-sm-5 col-lg-3",
				inputSelectDisabled:true,
				keysForm:{},
				//validationResult:true,


				pubCorrect:true,
				pubBit2strong:true,
				pubmatch:true,

				privCorrect:true,
				privPass:true,
				privmatch:true,
				privpassText:"",
				privtextVisible:'hidden',
				privTextDisabled:true,

				keyDate:"",
				keyId:""
			};
		},

		componentDidMount: function() {
			var dtSet=this.getKeys();
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
							{ "data": "bit" },
						],
						"columnDefs": [
							{ "sClass": 'col-xs-6 col-lg-10', "targets": 0},
							{ "sClass": 'col-xs-2 col-lg-2 text-align-center', "targets": [1]},
							{ "orderDataType": "data-sort", "targets": 0 }
						],
						"order": [[ 1, "asc" ],[0,"asc"]],
						"sPaginationType": "simple",
						"language": {
							"emptyTable": "No Keys",
							"sSearch":"",
							"searchPlaceholder": "Search",
							"paginate": {
								"sPrevious": "<i class='fa fa-chevron-left'></i>",
								"sNext": "<i class='fa fa-chevron-right'></i>"
							}
						}
					}
				);

			this.setState({keysForm:$("#editPGPkeys").validate()});

			$.validator.addMethod("pubCorrect", function(value, element) {

					return thisComp.state.pubCorrect;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Public Key format is unknown");

			$.validator.addMethod("pubBit2strong", function(value, element) {

				return thisComp.state.pubBit2strong;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Public key is too strong.");

			$.validator.addMethod("privPass", function(value, element) {

				return thisComp.state.privPass;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Private Key password is incorrect");

			$.validator.addMethod("pubmatch", function(value, element) {

				return thisComp.state.pubmatch;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Public Key not match with Private key");


			$.validator.addMethod("privCorrect", function(value, element) {

				return thisComp.state.privCorrect;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Private Key format is unknown");


			$.validator.addMethod("privmatch", function(value, element) {

				return thisComp.state.privmatch;

				//return this.optional(element) || (parseFloat(value) > 0);
			}, "Private Key not match with Public key");


			$("#privPass").rules("add", {
				//required: true,
				//minlength: 200,
				//maxlength: 900,
				//greaterThanZero:true
				privPass:true
				//pubBit2strong:true,
				//pubmatch:true
			});


			$("#pubK").rules("add", {
				required: true,
				//minlength: 200,
				//maxlength: 900,
				//greaterThanZero:true
				pubCorrect:true,
				pubBit2strong:true,
				pubmatch:true
			});

			$("#prK").rules("add", {
				required: true,
				//minlength: 200,
				//maxlength: 4000,
				//greaterThanZero:true
				privCorrect:true,
				privPass:true,
				privmatch:true,

			});

		//	this.handleClick('addNewDomain');

		},

        /**
         *
         * @returns {Array}
         */
		getKeys:function() {
			var alEm=[];

			$.each(app.user.get("allKeys"), function( email64, emailData ) {
				//console.log(emailData);
					var el=
					{
						"DT_RowId": email64,
						"email": {
							"display": app.transform.from64str(emailData['email'])
						},
						//"type": {
						//	"display": emailData['addrType']==2?"D":emailData['addrType']==1?"M":emailData['addrType']==3?"A":"",
						//	"typ":emailData['addrType']==2?3:emailData['addrType']==3?2:emailData['addrType']==1?1:4
						//},
						"bit":emailData['keyLength'],
						//"public":'<a class="viewKey"><i class="fa fa-eye-slash fa-lg viewKey"></i></a>',
						//"edit": '<a class="editKey"><i class="fa fa-pencil fa-lg txt-color-greenDark"></i></a>'

					};
					alEm.push(el);


			});


			//this.setState({dataDispisable:alEm});
			return alEm;
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

				case 'showFirst':

					if(!app.user.get("inProcess")){

						this.setState(
							{
								firstPanelClass:"panel-body",
								secondPanelClass:"panel-body hidden",
								firstTab:"active",

								txtArea1value:"",
								txtArea2value:"",
								keyEmail:"",
                                keyName:"",
								keyBit:"",
								button5class:"",

								keyId:"",
								keyDate:"",
								keyModified:"",
								keyFingerprint:"",
								privpassText:"",
								privTextDisabled:true,
							}
						);

					}else{

						//todo add modal to prevent navigation
						$('#infoModal').modal({
							backdrop: 'static',
							keyboard: false
						});

						$('#infoModHead').html("Active Process");
						$('#infoModBody').html("Please cancel or wait until process is finished before continue.");

						$('#infoModal').modal('show');
					}


					break;

				case 'editKey':

					var keys=app.user.get('allKeys');

					var id=this.state.keyId
					this.setState(
						{
							firstPanelClass:"panel-body hidden",
							secondPanelClass:"panel-body",
							firstTab:"active",

							inputSelectDisabled:false,
							txtArea1readonly:false,
							txtArea2readonly:false,
                            keyEmail:app.transform.from64str(keys[id]['email']),
                            keyName:app.transform.from64str(keys[id]['displayName']),

						//	keyBit:keys[id]['keyLength'],

							txtArea1value:app.transform.from64str(keys[id]['v2']['publicKey']),
							txtArea2value:app.transform.from64str(keys[id]['v2']['privateKey']),

							//button2enabled:false,
							button2enabled:true,
							button2text:"Save",
							button2onClick:"saveKeys",

							button3enabled:true,
							button3visible:"",
							button3text:"Cancel",
							button3onClick:"showFirst",
							privpassText:keys[id]['keyPass'],
							privTextDisabled:false,

							button4enabled:true,
							button4visible:"",
							button4iClass:"",
							button4text:"Generate New Keys",
							button4onClick:"generateNewKeys",
							button5class:"hidden",

							keyDate:keys[id]['date'],
							keyModified:keys[id]['keysModified'],
							//keyFingerprint:app.transform.keyFingerprint(keys[id]['publicKey'])
						}
					);


					break;


				case 'generateNewKeys':

					var thisComp=this;


					$('#dntModHead').html("Please Wait");
					$('#dntModBody').html("Sit tight while we working. It may take a minute, depend on your device. Or you can cancel");


						$('#dntInter').modal({
							backdrop: 'static',
							keyboard: false
						});

						app.user.set({"inProcess":true});
/*
						thisComp.setState(
							{
								txtArea1value:"",
								txtArea2value:""
							}
						);
*/
						//$('#dntInter').modal('show');


					app.generate.generatePairs(thisComp.state.keyBit,thisComp.state.keyName,function(PGPkeys){

						if(app.user.get("inProcess")){
							//console.log(thisComp.state.keyEmail);
						//	console.log(thisComp.state.keyBit);
							//console.log(PGPkeys);


							app.globalF.getPublicKeyInfo(PGPkeys['publicKey'],function(result){
								//keyData=result;
								thisComp.setState({
									keyStrength:result['strength'],
									keyFingerprint:result['fingerprint'],
									keyDate:result['created']
								});
							});

							thisComp.setState(
								{
									button4iClass:"",
									button4text:"Generate New Keys",
									button4enabled:true,

									txtArea1value:PGPkeys['publicKey'],
									txtArea2value:PGPkeys['privateKey'],

									button3onClick:"showFirst",
									button2enabled:true,
									privpassText:PGPkeys['password']
								}
							);


							$('#dntInter').modal('hide');

							app.user.set({"inProcess":false});


						}else{
							//console.log('canceled');
							app.user.set({"inProcess":false});
						}

					});




					$('#dntOk').on('click', function () {

						app.user.set({"inProcess":false});
						//thisComp.handleClick('showFirst');
						$('#dntInter').modal('hide');
					});





					break;


				case 'cancelGenerating':
					app.user.set({"inProcess":false});
					this.handleClick('showFirst');

					break;

				case 'saveKeys':

					var thisComp=this;

					this.validateBeforeSafe(function(result){

						if(result){

							app.globalF.checkSecondPass(function(){

								var key=app.user.get('allKeys');

							//	console.log();
								key[thisComp.state.keyId]['v2']['privateKey']=app.transform.to64str(thisComp.state.txtArea2value);
								key[thisComp.state.keyId]['v2']['publicKey']=app.transform.to64str(thisComp.state.txtArea1value);
								key[thisComp.state.keyId]['v2']['receiveHash']=app.transform.getReceiveHash(app.transform.from64str(key[thisComp.state.keyId]['email']));
								key[thisComp.state.keyId]['keyLength']=thisComp.state.keyBit;
								key[thisComp.state.keyId]['keyPass']=thisComp.state.privpassText;

								key[thisComp.state.keyId]['keysModified']=Math.round((new Date).getTime()/1000);

							//	console.log(app.transform.from64str(key[thisComp.state.keyId]['email']));

								var newKey=key[thisComp.state.keyId];

								app.user.set({"newPGPKey":newKey});

								app.userObjects.updateObjects('editPGPkeysBits','',function(result){
									if(result=='saved'){
										//console.log('sdfsdf');
										thisComp.setState({
											dataSet:thisComp.getKeys()
										});


										thisComp.handleClick('showFirst');

									}else if(result=='newerFound'){
										//app.notifications.systemMessage('newerFnd');
									}



								});
							});
							//console.log('saveKeys');


						}else{

							$('#infoModHead').html("PGP Key Pair Mismatch");
							$('#infoModBody').html("Please generate new keys or make sure you import correct format");

							$('#infoModal').modal('show');

						}

					});



				break;


				case 'viewKey':
					var thisComp=this;
					var keys=app.user.get('allKeys');
					//var keyData={};
						app.globalF.getPublicKeyInfo(app.transform.from64str(keys[event]['v2']['publicKey']),function(result){
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

							keyEmail:app.transform.from64str(keys[event]['email']),
                            keyName:app.transform.from64str(keys[event]['displayName']),
							keyBit:app.user.get('defaultPGPKeybit'),


							inputSelectDisabled:true,
							txtArea1readonly:true,
							txtArea2readonly:true,

							txtArea1value:app.transform.from64str(keys[event]['v2']['publicKey']),
							txtArea2value:app.transform.from64str(keys[event]['v2']['privateKey']),

							button2enabled:true,
							button2text:"OK",
							button2onClick:"showFirst",

							button4visible:"hidden",
							button5class:"",
							button3visible:"hidden",

							keyId:event,
							keyModified:keys[event]['keysModified'],
							emailSince:keys[event]['date']
						}
					);


					break;

				case 'selectRow':

					var thisComp=this;

					var id=$(event.target).parents('tr').attr('id');
					if(id!=undefined){
						thisComp.handleClick('viewKey',id);
					}

					break;
			}



		},
		componentWillUpdate: function(nextProps, nextState) {
			if(JSON.stringify(nextState.dataSet) !== JSON.stringify(this.state.dataSet)){

				var t = $('#table1').DataTable();
				t.clear();
				var contacts=nextState.dataSet;
				t.rows.add(contacts);
				t.draw(false);
			}

		},

        /**
         *
         * @param {boolean} callback
         */
		validateBeforeSafe:function(callback){

			var thisComp=this;
			var pass=this.state.privpassText;
			thisComp.checkKeys(function(result){

				if(thisComp.state.pubCorrect &&
					thisComp.state.pubBit2strong &&
					thisComp.state.pubmatch &&
					thisComp.state.privCorrect &&
					thisComp.state.privmatch &&
					thisComp.state.privPass){
					callback(true);
				}else{
					callback(false);
				}
			});
		},

        /**
         *
         * @param {null} callback
         */
		checkKeys:function(callback) {
			var thisComp=this;

			//console.log(thisComp.state.txtArea1value);

			app.globalF.getPublicKeyInfo(thisComp.state.txtArea1value,function(result){
				//keyData=result;
				thisComp.setState({
					keyStrength:result['strength'],
					keyFingerprint:result['fingerprint'],
					keyDate:result['created']
				});
			});

			var pass=this.state.privpassText;
			app.globalF.validateKeys(thisComp.state.txtArea1value,thisComp.state.txtArea2value,pass,function(result){
				thisComp.setState({

					pubCorrect:result['pubCorrect'],
					pubBit2strong:result['pubBit2strong'],
					pubmatch:result['pubmatch'],

					privCorrect:result['privCorrect'],
					privmatch:result['privmatch'],
					privPass:result['privPass']

				},function(){
					callback();
				});
			});


		},

        /**
         *
         * @param {string} action
         * @param {object} event
         */
		handleChange: function(action,event){
			switch(action) {
				case 'changePrivatePass':
					var thisComp=this;

					thisComp.setState(
						{
							privpassText:event.target.value
						},function(){

							thisComp.checkKeys(function(){

								var validator=thisComp.state.keysForm;
								validator.form();

								$("#pubK").removeClass("invalid");
								$("#prK").removeClass("valid");

								validator.resetForm();
							});
						}
					);



					break;
				case 'checkPubKey':
					var thisComp=this;
					//console.log(event.target.value);

					thisComp.setState(
						{
							txtArea1value:event.target.value,
							button2enabled:true
						},function(){
							thisComp.checkKeys(function(){

								var validator=thisComp.state.keysForm;
								validator.form();

								$("#pubK").removeClass("invalid");
								$("#prK").removeClass("valid");

								validator.resetForm();

							});
						}
					);

					break;
				case 'checkPrivKey':
					var thisComp=this;

					thisComp.setState(
						{
							txtArea2value:event.target.value,
							button2enabled:true
						},function(){
							thisComp.checkKeys(function(){
								var validator=thisComp.state.keysForm;
								validator.form();

								$("#pubK").removeClass("invalid");
								$("#prK").removeClass("valid");

								validator.resetForm();



							});
						}
					);

				break;

				case 'changeKeyBit':

					this.setState(
						{
							keyBit:event.target.value
						}
					);

					break;
			}
		},
		PGPbitList:function(){
			var options=[];

			for(var i=1024;i<=app.user.get('userPlan')['planData']['pgpStr'];i+=1024){
				options.push(
					<option key={i} value={i}>{i} bits

					</option>
				);
			}

			return options;
			//console.log(app.user.get('userPlan')['planData']['pgpStr']);
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

						<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className={this.state.firstTab}>
									<a onClick={this.handleClick.bind(this, 'showFirst')}>
										<h3 className={this.props.tabs.Header}>PGP Keys</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="ion-key"></i></h3>
									</a>
								</li>
							</ul>
						</div>


						<div className={this.state.firstPanelClass}>
							<table className=" table table-hover table-striped datatable table-light rowSelectable clickable" id="table1" onClick={this.handleClick.bind(this, 'selectRow')}>
								<thead>
									<tr>
										<th>address</th>

										<th>&nbsp;</th>


									</tr>
								</thead>
							</table>
						</div>

						<div className={this.state.secondPanelClass}>

							<form id="editPGPkeys" className="">

							<div className={this.state.inputSelectClass}>
								<select className="form-control" defaultValue="0" id="keyStr"
								value={this.state.keyBit}
								onChange={this.handleChange.bind(this, 'changeKeyBit')}
								disabled={this.state.inputSelectDisabled}>
									<option value="0" disabled>Key Strength</option>
									{this.PGPbitList()}
								</select>
							</div>

								<table className="table table-hover table-striped datatable table-light">
                                    <tr>
                                        <td className="col-xs-3"><b>Name:</b></td>
                                        <td className="col-xs-9">{this.state.keyName}</td>
                                    </tr>
									<tr>
										<td className="col-xs-3"><b>Email:</b></td>
										<td className="col-xs-9">{this.state.keyEmail}</td>
									</tr>
									<tr>
										<td className="col-xs-3"><b>Email Since:</b></td>
										<td className="col-xs-9">{new Date(this.state.emailSince*1000).toLocaleString()}</td>
									</tr>
									<tr>
										<td className="col-xs-3"><b>Keys Created:</b></td>
										<td className="col-xs-9">{new Date(this.state.keyDate).toLocaleString()}</td>
									</tr>
									<tr>
										<td className="col-xs-3"><b>Strength:</b></td>
										<td className="col-xs-9">{this.state.keyStrength} bits</td>
									</tr>
									<tr>
										<td className="col-xs-3"><b>Fingerprint:</b></td>
										<td className="col-xs-9">{this.state.keyFingerprint}</td>
									</tr>
									<tr>
										<td className="col-xs-3"><b>Private Key Password:</b></td>
										<td className="col-xs-9">
										<div className="form-group">
											<input type="text" name="privPass" className="form-control" id="privPass" placeholder="private key password"
											onChange={this.handleChange.bind(this, 'changePrivatePass')}
												disabled={this.state.privTextDisabled}
											value={this.state.privpassText}	/>
										</div>
										</td>
									</tr>



								</table>



									<div className={classFullSettSelect}>
											<label>Public Key</label>
											<textarea className="form-control" rows="8"
											id="pubK"
											name="publicKey"
											readOnly={this.state.txtArea1readonly}
											value={this.state.txtArea1value}
											onChange={this.handleChange.bind(this, this.state.txtArea1onchange)}
											spellCheck="false">
											</textarea>
									</div>


									<div className={classFullSettSelect}>
										<label>Private Key</label>
										<textarea className="form-control" rows="8"
										id="prK"
										name="prK"
										readOnly={this.state.txtArea2readonly}
										value={this.state.txtArea2value}
										onChange={this.handleChange.bind(this, this.state.txtArea2onchange)}
										spellCheck="false">
										</textarea>
									</div>

								</form>
							<div className="clearfix"></div>
							<button type="button" className={"btn btn-warning pull-left "+this.state.button4visible} disabled={!this.state.button4enabled} onClick={this.handleClick.bind(this, this.state.button4onClick)}><i className={this.state.button4iClass}></i> {this.state.button4text}</button>

							<div className="pull-right dialog_buttons">
								<button type="button" className={"btn btn-warning "+this.state.button5class } onClick={this.handleClick.bind(this, 'editKey')}>Edit</button>

								<button type="button" className="btn btn-primary" disabled={!this.state.button2enabled} onClick={this.handleClick.bind(this, this.state.button2onClick)}><i className={this.state.button2iClass}></i>{this.state.button2text}</button>

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
								<b>Key Strength</b> - The strength of your PGP keys is determined by the number of bits. Keys with more bits are harder to break, but also take longer to use when encrypting and decrypting email. At this time 2048 bit keys are the recommended value and is the default selection. Increasing your key strength to 4096 or higher may prevent you from needing to generate new keys in the near future. Lower strength 1024 bit keys are available for compatibility reasons, but they are not recommended.
							</p>
							<p>
								<b>Fingerprint</b> - The fingerprint for a PGP key is used for some key management tasks. Detailed information about PGP key fingerprints can be found at <a href="https://en.wikipedia.org/wiki/Public_key_fingerprint">https://en.wikipedia.org/wiki/Public_key_fingerprint</a>
							</p>

                            <p>
                                <b>The private key password</b> - The private key password is used to secure your key. The security of your private key is important because it is required to decrypt and read your email.
                            </p>



							<p>
								<b>What are PGP public and private keys?</b> -
                                 Your public and private keys are used to encrypt and decrypt PGP encrypted emails. More information about how PGP works can be found on <a href="https://en.wikipedia.org/wiki/Pretty_Good_Privacy">https://en.wikipedia.org/wiki/Pretty_Good_Privacy</a> and the <a href="http://www.pgpi.org/">PGP Home Page</a>

							</p>
						</div>
					</div>
				</div>

			</div>
			);
		}

	});
});