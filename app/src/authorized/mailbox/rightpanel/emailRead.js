define(['react','app'], function (React,app) {
	return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState : function() {
			return {
				from:'',
                fromExtra:'',
				to:'',
				cc:'',
				bcc:'',
				pin:'',
				subject:'',
				dmarc:'',
				header:'',
				timeSent:'',
				type:'',
				attachment:{},
				hideEmailRead:true,
				renderButtonClass:"",
				rawHeadVisible:"",
				toggleHTMLtext:'html',
				renderFull:false,
                pgpEncrypted:false,
                decryptedEmail:false,
				//emailHasPin

			}
		},
		componentWillUnmount: function () {
			//console.log('unmounted');
			app.user.off("change:currentMessageView");
			//var thisComp=this;
			app.globalF.resetCurrentMessage();
            clearTimeout(app.user.get('emailOpenTimeOut'));

            $('[data-toggle="popover-hover"]').popover('hide');


		},
		componentDidMount: function () {
			var thisComp=this;
			$('#sdasdasd').addClass("hidden");
			app.user.on("change:currentMessageView",function() {
					thisComp.setState({
                        from:'',
                        fromExtra:'',
                        to:'',
                        cc:'',
                        bcc:'',
                        pin:'',
                        subject:'',
                        dmarc:'',
                        header:'',
                        timeSent:'',
                        type:'',
                        attachment:{},
                        hideEmailRead:true,
                        renderButtonClass:"",
                        rawHeadVisible:"",
                        toggleHTMLtext:'html',
                        renderFull:false,
                        pgpEncrypted:false,
                        decryptedEmail:false,
					});

				this.renderEmail();
               // console.log(app.user.get("currentMessageView"));
			},this);



		},
		getTagsList:function(){
			var labels=[];

			var thisComp=this;
			$.each(app.user.get('tags'), function( index, labelData ) {
				labels.push(
					<li key={index}>
						<a  id={index+'3'} onClick={thisComp.handleChange.bind(thisComp, 'assignLabel')} value={index}>{app.transform.from64str(index)}</a>
					</li>

				);
			});
			return labels;

		},

		verifySignature:function(){

			//console.log()
			var thisComp=this;
			var from=app.transform.from64str(app.user.get('currentMessageView')['meta']['from']);
			var fromEmail=app.globalF.getEmailsFromString(from);
			//console.log(fromEmail);

			var post={
				'mails':JSON.stringify([app.transform.SHA512(fromEmail)])
			};

			var options=[];

			var trusted=app.user.get("trustedSenders");

			if(trusted.indexOf(app.transform.SHA256(app.globalF.parseEmail(fromEmail)['email']))!==-1){
				thisComp.setState({
					signatureHeader:[]
				});
			}else{
				app.serverCall.ajaxRequest('retrievePublicKeys', post, function (result) {
					if(result['response']=="success"){
						//console.log(result['data']);
						if(Object.keys(result['data']).length>0){
							var senderPK=result['data'][app.transform.SHA512(fromEmail)]['mailKey'];
							var emailVersion=app.user.get('currentMessageView')['version'];

							//console.log(app.user.get('currentMessageView'));
							if(app.globalF.verifySignature(senderPK,emailVersion)===true){
								//console.log('correct');
								options.push(
									<div key="sig1" className="alert alert-success pgpsignature-success"><i className="fa-fw fa fa-check"></i>	<strong>Signature verified</strong> To learn more about <strong><a href="https://blog.cyberfear.com/signatures" target="_blank">signatures</a></strong>. Link will be open in new tab</div>
								);
								thisComp.setState({
									signatureHeader:options
								});


							}else if(app.globalF.verifySignature(senderPK,emailVersion)===false){
							//	console.log('smthg wrong');
								options.push(
									<div key="sig1" className="alert alert-danger pgpsignature-danger"><i className="fa-fw fa fa-times"></i>	<strong>Signature mismatch</strong> To learn more about <strong><a href="https://blog.cyberfear.com/signatures" target="_blank">signatures</a></strong>. Link will be open in new tab</div>
								);
								thisComp.setState({
									signatureHeader:options
								});
							}else if(app.globalF.verifySignature(senderPK,emailVersion)=='old'){

							}
							//var senderPubKey=pki.publicKeyFromPem(from64(dataBack[sender[0]]['mailKey']));

						}else{
							options.push(
								<div key="sig1" className="alert alert-warning pgpsignature-warning"><i className="fa-fw fa fa-warning"></i>	<strong>Signature can not be verified</strong> To learn more about <strong><a href="https://blog.cyberfear.com/email-signatures" target="_blank">signatures</a></strong>. Link will be open in new tab</div>
							);
							thisComp.setState({
								signatureHeader:options
							});
						}
					}
				});
			}


		},
		renderEmail:function(){


			//console.log(app.user.get('currentMessageView'));

			if(app.user.get('currentMessageView')['id']!==undefined && app.user.get('currentMessageView')['id']!=""){

                //console.log(app.user.get('emails')['messages'][app.user.get('currentMessageView')['id']]);

                clearTimeout(app.user.get('emailOpenTimeOut'));

				var email=app.user.get('currentMessageView');

				var thisComp=this;
				var from2 = [];
				var from=app.transform.from64str(email['meta']['from']);

				//(app.globalF.parseEmail(from)['name']!=app.globalF.parseEmail(from))?<b>+app.globalF.parseEmail(from)['name']+</b>+' <'+app.globalF.parseEmail(from)['email']+'>':email
                var emailAddress="";

				if(app.globalF.parseEmail(from)['name']!=app.globalF.parseEmail(from)['email']){
					from2.push(
						<span key='ab'>
							<b key='bc'>
						{app.globalF.parseEmail(from)['name']}
							</b>
					{'<'+app.globalF.parseEmail(from)['email']+'>'}
						</span>

					);
                   // emailAddress=app.globalF.parseEmail(from)['email'];
				}else{
					from2.push(
						<span key='ab'>
						{app.globalF.parseEmail(from)['email']}
						</span>

					);
                 //   emailAddress=app.globalF.parseEmail(from)['email'];
				}

                var fromExtra="";

                if(email['meta']['fromExtra']!=''){

               // console.log(email);
                   if(app.transform.check64str(email['meta']['fromExtra'])){
                       fromExtra=filterXSS(app.transform.from64str(email['meta']['fromExtra']));
                   }else{
                       fromExtra=filterXSS(email['meta']['fromExtra']);
                   }

                }


				var to=[];
				var cc=[];
				var bcc=[];
				//console.log(email);
				var emailsTo=email['meta']['to'];
				var emailsCC=email['meta']['toCC']!=undefined?email['meta']['toCC']:[];
				var emailsBCC=email['meta']['toBCC']!=undefined?email['meta']['toBCC']:[];


                emailAddress= app.globalF.exctractOwnEmail(emailsTo);

             //   console.log(emailAddress);
             //   console.log(emailsCC);

                if(emailAddress===false){
                    emailAddress= app.globalF.exctractOwnEmail(emailsCC);
                }


			//	console.log(emailAddress);

				var pins="";
				var pin=[];
				//console.log(email['meta']);
				if(email['meta']['version']==2 && email['meta']['pin']!=""){

					pin.push(
						<span className="pinHeader email-head" key="pin2">
							PIN: <span className="label label-success" key="pinLabel2">{app.transform.from64str(email['meta']['pin'])}</span>
						</span>
					);
				}else if(email['meta']['pin']!=undefined && email['meta']['pin']!=''){

						pins=JSON.parse(email['meta']['pin']);

				}

				//console.log(pins);
				$.each(emailsTo, function( index, folderData ) {

					folderData=app.transform.from64str(folderData);
					//console.log(folderData);

					if(emailsTo.length<=3){

						console.log('inside PIN <3');
						console.log(pins);

						if(pins[app.globalF.parseEmail(folderData)['email']]!=undefined){
							console.log('!=undefined');
							var lock=<i className="fa fa-lock"></i>;
							var title='<i class="fa fa-lock"></i> '+app.transform.from64str(pins[app.globalF.parseEmail(folderData)['email']]['pin']);
						}else{
							console.log('==undefined');
							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];
						}

					}else{
						console.log('inside PIN >3');
						if(pins[app.globalF.parseEmail(folderData)['email']]!=undefined){
							console.log('!=undefined');
							var lock=<i className="fa fa-lock"></i>;
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email']+'<br/>'+'<i class="fa fa-lock"></i> '+app.transform.from64str(pins[app.globalF.parseEmail(folderData)['email']]['pin']);
						}else{
							console.log('==undefined');
							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];
						}

					}

					if(app.globalF.parseEmail(folderData)['name']!=app.globalF.parseEmail(folderData)['email']){


						to.push(
							<span key={index} className="badge light email-head" data-placement="bottom" data-toggle="popover-hover" title="" data-content={title}>
							{lock} <b key={index+'b'}>
						{app.globalF.parseEmail(folderData)['name']}
								</b>

					{emailsTo.length<=3?' <'+app.globalF.parseEmail(folderData)['email']+'>':""}
							</span>

						);
					}else{
						to.push(
							<span key={index} className="badge light email-head" data-placement="bottom" data-toggle="popover-hover" title="" data-content={title}>
						{lock} {app.globalF.parseEmail(folderData)['email']}
							</span>

						);
					}

				});

				if(emailsCC.length>0){

				$.each(emailsCC, function( index, folderData ) {

					folderData=app.transform.from64str(folderData);
					//console.log(folderData);

					if(emailsCC.length<=1){

							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];


					}else{

							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];


					}

					if(app.globalF.parseEmail(folderData)['name']!=app.globalF.parseEmail(folderData)['email']){


						cc.push(
							<span key={index} className="badge light email-head" data-placement="bottom" data-toggle="popover-hover" title="" data-content={title}>
							{lock} <b key={index+'b'}>
						{app.globalF.parseEmail(folderData)['name']}
							</b>

					{emailsCC.length<=1?' <'+app.globalF.parseEmail(folderData)['email']+'>':""}
							</span>

						);
					}else{
						cc.push(
							<span key={index} className="badge light email-head" data-placement="bottom" data-toggle="popover-hover" title="" data-content={title}>
						{lock} {app.globalF.parseEmail(folderData)['email']}
							</span>

						);
					}

				});

			}

				if(emailsBCC.length>0){

					$.each(emailsBCC, function( index, folderData ) {

						folderData=app.transform.from64str(folderData);
						//console.log(folderData);

						if(emailsCC.length<=3){

							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];


						}else{

							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];


						}

						if(app.globalF.parseEmail(folderData)['name']!=app.globalF.parseEmail(folderData)['email']){


							bcc.push(
								<span key={index} className="badge light email-head" data-placement="bottom" data-toggle="popover-hover" title="" data-content={title}>
							{lock} <b key={index+'b'}>
						{app.globalF.parseEmail(folderData)['name']}
								</b>

					{emailsCC.length<=3?' <'+app.globalF.parseEmail(folderData)['email']+'>':""}
								</span>

							);
						}else{
							bcc.push(
								<span key={index} className="badge light email-head" data-placement="bottom" data-toggle="popover-hover" title="" data-content={title}>
						{lock} {app.globalF.parseEmail(folderData)['email']}
								</span>

							);
						}

					});

				}

				//console.log(bcc);






				var message=app.user.get('emails')['messages'][email['id']];
				//message['st']=message['st']==0?3:message['st'];

				//console.log(message['st']);
				//var from =;

				if(message['st']==0){
					var setOpen=setTimeout(function(){

						message['st']=message['st']==0?3:message['st'];


						//app.userObjects.saveMailBox('emailOpen',{});
						app.userObjects.updateObjects('folderUpdate','',function(result){
                            app.globalF.syncUpdates();
						});


						},500);

				}else{
					var setOpen={};
				}

                //console.log(email);



				this.setState({
                    emailAddress:emailAddress,
                    fromExtra:fromExtra,
					from:from2,
					to:to,
					cc:cc,
					bcc:bcc,
					pin:pin,
					//to:app.transform.from64str(email['meta']['to']),
					subject:app.transform.from64str(email['meta']['subject']),
					dmarc:'',
					header:'',
					timeSent: new Date(parseInt(email['meta']['timeSent']+'000')).toLocaleString(),
					type:'',
					tag:app.user.get('emails')['messages'][email['id']]['tg'].length>0?app.transform.from64str(app.user.get('emails')['messages'][email['id']]['tg'][0]['name']):"",
					emailBody:app.transform.from64str(email['body']['html']),
					emailBodyTXT:app.transform.from64str(email['body']['text']),
					attachment:email['attachment'],
					rawHeadVisible:(email['originalBody']['rawHeader']==undefined?"hidden":""),
					toggleHTMLtext:'html',
                    pgpEncrypted:email['pgpEncrypted']
				});
				//console.log(Object.keys(email['attachment']));
//console.log(app.user.get('emails')['messages'][email['id']]['tg'][0]['name']);

				$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: '.view-mail-header',html : true});

				if(message['tp']==2){
					this.renderFull();
					this.setState({

						renderButtonClass:"hidden"
					});

				}else{
					this.renderStrictBody();
				}





				thisComp.setState({
					hideEmailRead:false
				});
				this.verifySignature();
			}

			//$("[data-toggle='tooltip']").tooltip();
			//$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: 'div'});
            app.layout.display('readEmail');

            $('[data-toggle="popover-hover"]').on('shown.bs.popover', function () {
                var $pop = $(this);
                setTimeout(function () {
                    $pop.popover('hide');
                }, 5000);
            });

		},
		displayAttachments:function(){
			var attachments=[];
			var files=[];
			var thisComp=this;

            if(Object.keys(this.state.attachment).length>0){

                //console.log(this.state.decryptedEmail);
            if(this.state.decryptedEmail){

                    var size=0;
                    $.each(this.state.attachment, function( index, attData ) {
                        size+=attData['contents'].length;

                        files.push(
                            <span className="clearfix" key={"a"+index}>
							<br/>
							<span className="attchments" key={"as"+index}>{attData['fileName']}</span>
							<button  key={"ab"+index} id={index} className="btn btn-sm btn-primary pull-right" onClick={thisComp.handleClick.bind(thisComp, 'downloadFileDecrypted')}>Download</button>
						</span>
                        );

                    });

            }else{

                    var size=0;
                    $.each(this.state.attachment, function( index, attData ) {
                        size+=parseInt(app.transform.from64str(attData['size']));

                        if(attData['isPgp']){
                            files.push(

                                <span className="clearfix" key={"a"+index}>
							<br/>
							<span className="attchments" key={"as"+index}>{app.transform.from64str(attData['name'])}</span>

                            <div className="btn-group pull-right" key={"abc"+index}>
                                <button type="button" id={index} className="btn btn-primary" key={"abcd"+index} onClick={thisComp.handleClick.bind(thisComp, 'downloadFile')}>Download</button>
                                <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="caret"></span>
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li onClick={thisComp.handleClick.bind(thisComp, 'downloadFilePGP')}><a href="javascript:void(0);">Decrypt & Display</a></li>
                                    <li onClick={thisComp.handleClick.bind(thisComp, 'downloadFilePGP')}><a href="javascript:void(0);">Decrypt & Download</a></li>
                                    <li role="separator" className="divider"></li>
                                    <li onClick={thisComp.handleClick.bind(thisComp, 'downloadFile')}><a href="javascript:void(0);">Download</a></li>
                                </ul>
                            </div>

						</span>
                            );

                        }else{
                            files.push(
                                <span className="clearfix" key={"a"+index}>
							<br/>
							<span className="attchments" key={"as"+index}>{app.transform.from64str(attData['name'])}</span>
							<button  key={"ab"+index} id={index} className="btn btn-sm btn-primary pull-right" onClick={thisComp.handleClick.bind(thisComp, 'downloadFile')}>Download</button>
						</span>
                            );

                        }



                    });




            }

            size=(size > 1000000) ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';


            attachments.push(
                <div className="panel-footer" key='1'>
                    <h5>Attchments ({Object.keys(this.state.attachment).length} file(s), {size})</h5>
                    <div className="alert alert-warning text-left"  key='2'>Please use <b>EXTREME</b> caution when downloading files. We strongly recommend scanning them for viruses/malware after downloading.</div><div className="inbox-download"></div>


                    {files}
                </div>

            );

            }


			return attachments;
		},

		handleChange:function(i,event){
			switch(i) {
				case 'removeTag':
					var emailId=app.user.get('currentMessageView')['id'];
					var message=app.user.get('emails')['messages'][emailId];
					message['tg']=[];
                    var thisComp=this;


                    app.userObjects.updateObjects('folderUpdate','',function(result) {
                        app.globalF.syncUpdates();
                        thisComp.setState({
                            tag:''
                        });
                    });

					//app.userObjects.saveMailBox('addTag',{});




					break;

				case 'assignLabel':
					//this.removeClassesActive();
					//$(event.target).parents('li').addClass('active');
					//console.log($(event.target).attr('value'));
					//console.log(app.user.get('currentMessageView')['id']);
                    var thisComp=this;
					var emailId=app.user.get('currentMessageView')['id'];
					var message=app.user.get('emails')['messages'][emailId];

					message['tg']=[];

					message['tg'].push({'name':$(event.target).attr('value')});

                    var name=$(event.target).attr('value');
                    app.userObjects.updateObjects('folderUpdate','',function(result){
                        app.globalF.syncUpdates();

                        thisComp.setState({
                            tag:app.transform.from64str(name)
                        });
                    });

                   // app.globalF.syncUpdates();

					//app.userObjects.saveMailBox('addTag',{});



					break;
			}
		},

		handleClick: function(i,event) {
			switch(i) {

                case 'downloadFilePGP':
                    var fileButton=$(event.target);
                    var email=app.user.get('currentMessageView');
                    var emailAttachments=email['attachment'];
                    var fileBId=fileButton.parent().parent().parent().children().attr('id');

                    var thisComp=this;

                    //console.log(fileButton.parent().parent().parent().children().attr('id'));

                    if(email['version']===15){
                        var fileName=app.transform.SHA512(emailAttachments[fileBId]['fileName']+app.user.get('userId'));
                        var modKey='none';
                        var version=15;
                        var key=app.transform.from64bin(emailAttachments[fileBId]['key']);

                    }else if(email['version']===2){
                        var fileName=emailAttachments[fileBId]['fileName'];
                        var modKey=emailAttachments[fileBId]['modKey'];
                        var key=app.transform.from64bin(emailAttachments[fileBId]['key']);
                        var version=2;
                    }


                    var type=app.transform.from64str(emailAttachments[fileBId]['type']);
                    var size=app.transform.from64str(emailAttachments[fileBId]['size']);
                    var name=app.transform.from64str(emailAttachments[fileBId]['name']);


                    fileButton.parent().parent().parent().children(':first').html('<i class="fa fa-spin fa-refresh"></i> Downloading');

                    app.globalF.downloadFile(fileName,modKey,version,function(result){

                        fileButton.parent().parent().parent().children(':first').html('Download');
                        var decryptedFile64 = app.transform.fromAesBin(key, result);
                        var decryptedFile=app.transform.from64bin(decryptedFile64);

                        thisComp.readPGP(decryptedFile);

                    });


                    break;

                case 'detectDirection':
                    var arrow=$('.navArrow1');

                 //   if(arrow.hasClass('fa-long-arrow-left')){
                        app.layout.display('left');
                 //   }else{
                    //    app.layout.display('right');
                   // }

                    break;

                case 'downloadFileDecrypted':

                    var fileButton=$(event.target);
                    //$(event.target).attr('id')
                    //var email=app.user.get('currentMessageView');

                    var emailAttachments=this.state.attachment;
                    var fileBId=fileButton.attr('id');

                    //console.log(app.user.get('currentMessageView'));
                    //console.log(emailAttachments[fileBId]);
                    var file=emailAttachments[fileBId];

                    var content=(file['encoding']==="base64"?app.transform.from64bin(file['contents']):file['contents']);

                    var arbuf=app.globalF.base64ToArrayBuffer(content);

                    var type=file['contentType'];
                    var size=(file['encoding']==="base64"?app.transform.from64bin(file['contents']).length:file['contents'].length);
                    var name=file['fileName'];

                    app.globalF.createDownloadLink(arbuf,type, name);

                    break;

				case 'downloadFile':


					var fileButton=$(event.target);
					//$(event.target).attr('id')
                    var email=app.user.get('currentMessageView');
					var emailAttachments=email['attachment'];
                    var fileBId=fileButton.attr('id');

                   // console.log(app.user.get('currentMessageView'));
                   // console.log(emailAttachments[fileBId]);

                    if(email['version']===15){
                        var fileName=app.transform.SHA512(emailAttachments[fileBId]['fileName']+app.user.get('userId'));
                       // console.log(emailAttachments[fileBId]['filename']);
                        var modKey='none';
                        var version=15;
                        var key=app.transform.from64bin(emailAttachments[fileBId]['key']);

                    }else if(email['version']===2){
                        var fileName=emailAttachments[fileBId]['fileName'];
                        var modKey=emailAttachments[fileBId]['modKey'];
                        var key=app.transform.from64bin(emailAttachments[fileBId]['key']);
                        var version=2;
                    }else if(email['version']==undefined || email['version']===1){
                        var fileName=app.transform.from64str(emailAttachments[fileBId]['filename']);
                        var version=1;
                        var modKey='none';

                        var message = app.user.get('emails')['messages'][app.user.get('currentMessageView')['id']];
                       // var modKey = message['mK'];
                        var key = app.transform.from64bin(message['p']);
                      //  console.log(app.user.get('emails')['messages'][app.user.get('currentMessageView')['id']]);
                    }



					var type=app.transform.from64str(emailAttachments[fileBId]['type']);
					var size=app.transform.from64str(emailAttachments[fileBId]['size']);
					var name=app.transform.from64str(emailAttachments[fileBId]['name']);


                   // console.log(fileName);
                   // console.log(modKey);

					fileButton.html('<i class="fa fa-spin fa-refresh"></i> Downloading');

                    var thisComp=this;

					app.globalF.downloadFile(fileName,modKey,version,function(result){

                    if(result===false){
                        fileButton.html('Download');
                    }else{

                        fileButton.html('Download');


                        var decryptedFile64 = app.transform.fromAesBin(key, result);
                        var decryptedFile=app.transform.from64bin(decryptedFile64);

                        var arbuf=app.globalF.base64ToArrayBuffer(decryptedFile);
                        app.globalF.createDownloadLink(arbuf,type, name);

                    }




					});

					break;

				case 'email':
					$('#col1').toggleClass('hide');
					$('#view-mail-wrapper').toggleClass('visible-lg');


					break;
				case 'emailBig':
					$('#view-mail-wrapper').toggleClass('col-lg-6 auto');
					$('#col1').toggleClass('hide');
					$('.fa-chevron-left').toggleClass('fa-rotate-180');
					//$('#view-mail-wrapper').toggleClass('visible-lg');
					break;

				case 'addNewTag':

					Backbone.history.navigate("/settings/Folders", {
							trigger : true
					});
					break;

				case 'reply':
					//$('#element').tooltip('hide')

					if(this.state.renderFull){
						app.globalF.reply('replyFull');
					}else{
						app.globalF.reply('replyStrict');
					}


					Backbone.history.navigate("/mail/Compose", {
						trigger : true
					});
					break;

				case 'replyAll':
					//$('#element').tooltip('hide')

					if(this.state.renderFull){
						app.globalF.reply('replyAFull');
					}else{
						app.globalF.reply('replyAStrict');
					}


					Backbone.history.navigate("/mail/Compose", {
						trigger : true
					});
					break;
				case 'forward':
					//$('#element').tooltip('hide')

					if(this.state.renderFull){
						app.globalF.reply('forwardFull');
					}else{
						app.globalF.reply('forwardStrict');
					}


					Backbone.history.navigate("/mail/Compose", {
						trigger : true
					});
					break;

				case 'renderImages':
					this.renderFull();
					this.setState({

						renderButtonClass:"hidden"
					});

					break;


                case 'decryptPGP':
                    //console.log(this.state.from);
                    var thisComp=this;
                    if(this.state.emailBody.length==0){
                       thisComp.readPGP(this.state.emailBodyTXT);
                    }else{
                        thisComp.readPGP(this.state.emailBody);
                    }

                    //

                    /*
                    app.globalF.decryptPGPMessage(this.state.emailBody,this.state.emailAddress,function(email64,decryptedText){


                        if(email64!==false){

                        thisComp.setState({
                            pgpEncrypted:false,
                            emailBody:decryptedText,
                            decryptedEmail:app.transform.from64str(email64)
                        });

                            thisComp.renderStrictBody();
                        }


                   // console.log(email64);
                   //     console.log(decryptedText);


                    });
                    */
                    //this.renderFull();
                   // this.setState({

                      //  renderButtonClass:"hidden"
                  //  });

                    break;



				case 'showHeader':
              //      console.log(app.user.get('currentMessageView'));
					var w = window.open();
					var html ='<pre ' +
						'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">'+app.transform.escapeTags(app.transform.from64str(app.user.get('currentMessageView')['originalBody']['rawHeader']))+'<pre>';
                    html +='------ HTML ---------' +
                        '<br /><pre ' +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">'+app.transform.escapeTags(app.transform.from64str(app.user.get('currentMessageView')['originalBody']['body']['html']))+'<pre><br />------END HTML ---------<br /><br />';
                    html +='------ TEXT ---------' +
                        '<br /><pre ' +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">'+app.transform.escapeTags(app.transform.from64str(app.user.get('currentMessageView')['originalBody']['body']['text']))+'<pre><br />------ END TEXT ---------';
					$(w.document.body).html(html);
					break;

				case 'togglePlainHTML':
					if(this.state.toggleHTMLtext=='html'){
						this.setState({
							toggleHTMLtext:'text'
						});

						app.globalF.renderBodyNoImages('',this.state.emailBodyTXT,function(prerenderedBody){
							$("#virtualization").height(0);

							setTimeout(function(){

								$('#virtualization').contents().find("html").html(prerenderedBody);

								$("#virtualization").height($("#virtualization").contents().find("html").height());
							},100);
						});

					}else if(this.state.toggleHTMLtext=='text'){
						this.setState({
							toggleHTMLtext:'html'
						});

						app.globalF.renderBodyNoImages(this.state.emailBody,'',function(prerenderedBody){
							$("#virtualization").height(0);

							setTimeout(function(){

								$('#virtualization').contents().find("html").html(prerenderedBody);

								$("#virtualization").height($("#virtualization").contents().find("html").height());
							},100);
						});
					}

					break;
			}

		},

        readPGP:function(PGPtext){

            var thisComp=this;

            app.globalF.decryptPGPMessage(PGPtext,thisComp.state.emailAddress)
                .then(function(email64,decryptedText){

                   // console.log(decryptedText);

                        thisComp.setState({
                            emailBody: decryptedText['html'],
                            emailBodyTXT: decryptedText['text'],
                            attachment: decryptedText['attachments'],
                            decryptedEmail:app.transform.from64str(email64),
                            pgpEncrypted:false
                        });

                    thisComp.renderStrictBody();
               //     console.log(email64);
               //     console.log(decryptedText);

                });


        },

		showDMARC:function(){

			var options=[];

			options.push(<div className="dmark-header">
				<span className="label label-default">DMARC:</span> <span className="txt-color-green">SPF</span> <span className="txt-color-green">DKIM</span> <span className="txt-color-red">PGP Signature</span> <span className="txt-color-green">Encrypted</span>
			</div>);


		},
		componentDidUpdate:function(){
			//console.log('finish loading');
		},
		renderFull:function(){

			app.globalF.renderBodyFull(this.state.emailBody,this.state.emailBodyTXT,function(prerenderedBody){

				$("#virtualization").height(0);
				setTimeout(function(){

					$('#virtualization').contents().find("html").html(prerenderedBody);
					$("#virtualization").height($("#virtualization").contents().find("html").height()+50);
				},300);


			});
			this.setState({
				renderFull:true
			})

		},

		renderStrictBody: function(){

            var thisComp=this;
			app.globalF.renderBodyNoImages(this.state.emailBody,this.state.emailBodyTXT,function(prerenderedBody){
				$("#virtualization").height(0);

              //  console.log(thisComp.state.pgpEncrypted);
             //   console.log(thisComp.state.decryptedEmail);


                    if(thisComp.state.pgpEncrypted && !thisComp.state.decryptedEmail){
                        prerenderedBody="<div style='white-space: pre-line;'>"+prerenderedBody+"</div>";
                    }


					setTimeout(function(){

                        $('#virtualization').contents().find("html").html(prerenderedBody);


                        $("#virtualization").height($("#virtualization").contents().find("html").height()+50);


                        var tt=app.mixins.touchMixins();

                        $( "#virtualization" ).contents().bind( "touchstart", function() {
                     //       console.log('fff');
                            {tt.handleTouchStart}
                        });
                        $( "#virtualization" ).contents().bind( "touchmove", function() {
                     //       console.log('fff2');

                            {tt.handleTouchMove}
                        });
                        $( "#virtualization" ).contents().bind( "touchend", function() {
                     //       console.log('fff3');

                            {tt.handleTouchEnd}
                        });

					},300);
			});

		},
		render: function () {

			//var hide=app.user.get('currentMessageView')['id']==undefined?true:false;
			var rightClass="RightRight col-lg-6 visible-lg";

		return (
			<div className={this.props.panel.rightPanel} id="mRightPanel">

				<div className={"emailNo "+(this.state.hideEmailRead?"":"hidden")}>
					<h3>Please Select Email</h3>

                    <b><a href="https://blog.cyberfear.com/" target="_blank">Our Blog: blog.cyberfear.com</a></b>
                <br/><br/>
                    Comments or question?<br/>Please contact us at <b>cyberfear@cyberfear.com</b>
                    <br/>
                    <br/>
                    <br/>



                </div>
				<div className={"emailShow "+(this.state.hideEmailRead?"hidden":"")}>
				<div className="email-read-icons col-xs-12">

					<button className="btn btn-default pull-left hidden-sm hidden-md hidden-lg" rel="tooltip" title="" data-placement="bottom" data-original-title="Resize" type="button" onClick={this.handleClick.bind(this, 'detectDirection')}>
						<i className="navArrow1 fa fa-long-arrow-left fa-2x"></i>
					</button>

					<div className="btn-group pull-left visible-xs">
						<button className="btn btn-default" id="reply1" rel="tooltip" title="" data-toggle="dropdown" data-placement="top" data-original-title="Reply" type="button" onclick="">
							<i className="fa fa-reply fa-lg"></i> <i className="fa fa-angle-down fa-lg"></i>
						</button>




						<ul id="reply" className="dropdown-menu">
							<li><a onClick={this.handleClick.bind(this, 'reply')}><i className="ion ion-reply ion-lg"></i> Reply</a></li>
							<li><a onClick={this.handleClick.bind(this, 'replyAll')}><i className="ion ion-reply-all ion-lg"></i> Reply All</a></li>
							<li><a onClick={this.handleClick.bind(this, 'forward')}><i className="ion ion-forward ion-lg"></i> Forward</a></li>
						</ul>

					</div>



					<div className="btn-group m-r-sm hidden-xs">
						<button className="btn btn-sm btn-default w-xxs w-auto-xs" data-placement="bottom" data-toggle="popover-hover" title="" data-content="Reply" onClick={this.handleClick.bind(this, 'reply')}><i className="ion ion-reply ion-lg"></i></button>
						<button className="btn btn-sm btn-default w-xxs w-auto-xs" data-placement="bottom" data-toggle="popover-hover" title="" data-content="Reply All" onClick={this.handleClick.bind(this, 'replyAll')}><i className="ion ion-reply-all ion-lg"></i></button>
						<button className="btn btn-sm btn-default w-xxs w-auto-xs" data-placement="bottom" data-toggle="popover-hover" title="" data-content="Forward" onClick={this.handleClick.bind(this, 'forward')}><i className="ion ion-forward ion-lg"></i></button>
					</div>



					<div className="btn-group">
						<button className="btn btn-default" id="label1" rel="tooltip" title="" data-toggle="dropdown" data-placement="top" data-original-title="Move to Folder" type="button" onclick="">
							<i className="ion ion-ios-pricetags-outline"></i> <i className="fa fa-angle-down fa-lg"></i>
						</button>




						<ul id="label" className="dropdown-menu scrollable-menu" role="menu">
										{this.getTagsList()}
							<li className="divider"></li>
											<li><a onClick={this.handleClick.bind(this, 'addNewTag')}>Add New Label</a></li>
						</ul>

					</div>



					<div className="btn-group boxEmailOption" >
						<button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
						More <i className="fa fa-angle-down fa-lg"></i>
						</button>
						<ul className="dropdown-menu pull-right">
							<li className={this.state.rawHeadVisible}>
								<a onClick={this.handleClick.bind(this, 'showHeader')}>Show Raw Header</a>
							</li>
							<li>
								<a onClick={this.handleClick.bind(this, 'togglePlainHTML')}>HTML / Plain</a>
							</li>

						</ul>
					</div>


					<div className="btn-group m-r-sm pull-right hidden">
						<button className="btn btn-sm btn-default w-xxs w-auto-xs" tooltip="Archive"><i className="ion ion-chevron-up"></i></button>
						<button className="btn btn-sm btn-default w-xxs w-auto-xs" tooltip="Report"><i className="ion ion-chevron-down"></i></button>
					</div>

					<div className="pull-right email-status">
						<span className="ion ion-record ion-color-bad hidden">&nbsp;</span>
						<span className="ion ion-record ion-color-good hidden">&nbsp;</span>
						<span className="ion ion-record ion-color-info hidden">&nbsp;</span>
						<span className="ion ion-record ion-color-warning hidden">&nbsp;</span>
						<i className="fa fa-lock fa-lg hidden"></i>
						<i className="fa fa-unlock fa-lg hidden"></i>
					</div>
				</div>

				<div className="clearfix"></div>
				<div className="email-header">
					<div className="row">

						<div className={"ellipsisText col-xs-7 visible-xs "+(this.state.tag==""?"hidden":"")}>
							<i className="pull-left fa fa-tags fa-lg"></i> <span className="label label-success">{this.state.tag}</span><a onClick={this.handleChange.bind(this, 'removeTag')} title="Remove Tag"> X</a>
						</div>

						<div className={"ellipsisText col-xs-12 "+(this.state.tag==""?"hidden":" hidden-xs")}>
							<i className="pull-left fa fa-tags fa-lg"></i> <span className="label label-success">{this.state.tag}</span><a onClick={this.handleChange.bind(this, 'removeTag')} title="Remove Tag"> X</a>
						</div>

						<p className="pull-right visible-xs">{this.state.timeSent}</p>

					</div>
					<div className="clearfix"></div>
					<header>
					{this.state.signatureHeader}
						<h2 className="ellipsisText hidden-xs">{this.state.subject}</h2>

						<h4 className="ellipsisText visible-xs">{this.state.subject}</h4>
						<p className="pull-right hidden-xs">{this.state.timeSent}</p>
					</header>

					<div className="row view-mail-header">

						<div className="col-sm-9" id="rcptHeader">
						From: {this.state.from} {this.state.fromExtra}
							<div className="clearfix"></div>
						To: {this.state.to}
							<div className="clearfix"></div>
						{this.state.cc.length!=0?"CC: ":""}{this.state.cc}
							<div className="clearfix"></div>
						{this.state.bcc.length!=0?"BCC: ":""}{this.state.bcc}
							<div className="clearfix"></div>
						{this.state.pin}
						</div>

                        <div className={"col-xs-12 "+(this.state.decryptedEmail!=""?"":"hidden")}>

                            <div className="image-disabled">

                                Message was decrypted using <b>{this.state.decryptedEmail}</b> private key
                            </div>
                        </div>

                        <div className={"col-xs-12 "+(this.state.pgpEncrypted?"":"hidden")}>


                            <div className="image-disabled">

                                We've detected PGP encoded message. <button className="btn btn-primary btn-xs" onClick={this.handleClick.bind(this, 'decryptPGP')}>Try to decrypt</button>
                            </div>
                        </div>

						<div className={"col-xs-12 "+this.state.renderButtonClass}>

							<div className="image-disabled">

							To protect you from tracking, images are disabled. <button className="btn btn-default btn-xs" onClick={this.handleClick.bind(this, 'renderImages')}>Render Images</button>
							</div>
						</div>

					</div>
				</div>
				<div className="panel emailRead">
					<div className="panel-body">

						<div className="row">

								<div className="" id="test123">
									<iframe id="virtualization" scrolling="no" frameBorder="0" width="100%">
										
									</iframe>


								{this.displayAttachments()}


								</div>


						</div>
					</div>
				</div>


				</div>

			</div>
			);
		}

	});
});
