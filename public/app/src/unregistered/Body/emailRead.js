define(['react','app'], function (React,app) {
	return React.createClass({
		getInitialState : function() {
			return {
				from:'',
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
				//emailHasPin

			}
		},
		componentWillUnmount: function () {
			//console.log('unmounted');
			app.user.off("change:currentMessageView");
			//var thisComp=this;

			//app.globalF.resetCurrentMessage();

		},
		componentDidMount: function () {
			var thisComp=this;
			app.user.on("change:currentMessageView",function() {
					thisComp.setState({
						from:'',
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
						rawHeadVisible:""
					});


				this.renderEmail();
              //  console.log(app.user.get("currentMessageView"));
			},this);

		},


		renderEmail:function(){

			//console.log(app.user.get('currentMessageView'));

			if(app.user.get('currentMessageView')['id']!==undefined && app.user.get('currentMessageView')['id']!=""){

				clearTimeout(this.state.emailOpenTimeOut);

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

				var to=[];
				var cc=[];
				var bcc=[];
				//console.log(email);
				var emailsTo=email['meta']['to'];
				var emailsCC=email['meta']['cc']!=undefined?email['meta']['cc']:[];
				var emailsBCC=email['meta']['toBCC']!=undefined?email['meta']['toBCC']:[];


                emailAddress= app.globalF.exctractOwnEmail(emailsTo);

                if(emailAddress===false){
                    emailAddress= app.globalF.exctractOwnEmail(emailsCC);
                }


				//console.log(email);

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

						if(pins[app.globalF.parseEmail(folderData)['email']]!=undefined){
							var lock=<i className="fa fa-lock"></i>;
							var title='<i class="fa fa-lock"></i> '+app.transform.from64str(pins[app.globalF.parseEmail(folderData)['email']]['pin']);
						}else{
							var lock='';
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email'];
						}

					}else{

						if(pins[app.globalF.parseEmail(folderData)['email']]!=undefined){
							var lock=<i className="fa fa-lock"></i>;
							var title='<i class="fa fa-envelope-o"></i> '+app.globalF.parseEmail(folderData)['email']+'<br/>'+'<i class="fa fa-lock"></i> '+app.transform.from64str(pins[app.globalF.parseEmail(folderData)['email']]['pin']);
						}else{
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
              //  console.log(emailsCC);
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
                var subject="";
                if(email['meta']['subject']!==undefined){
                    subject=app.transform.from64str(email['meta']['subject'])
                }else if(email['meta']['subj']!==undefined){
                    subject=app.transform.from64str(email['meta']['subj'])
                }




				this.setState({
                    emailAddress:emailAddress,
					from:from2,
					to:to,
					cc:cc,
					bcc:bcc,
					pin:pin,
					//to:app.transform.from64str(email['meta']['to']),
					subject:subject,
					dmarc:'',
					header:'',
					timeSent: new Date(parseInt(email['meta']['timeSent']+'000')).toLocaleString(),
					type:'',
					emailBody:app.transform.from64str(email['body']['html']),
					emailBodyTXT:app.transform.from64str(email['body']['text']),
					attachment:email['attachment'],
					rawHeadVisible:(email['body']['rawHeader']==undefined?"hidden":""),
					toggleHTMLtext:'html'
				});
				//console.log(Object.keys(email['attachment']));
//console.log(app.user.get('emails')['messages'][email['id']]['tg'][0]['name']);

				$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: '.view-mail-header',html : true});


					//this.renderStrictBody();
                this.renderFull();

				thisComp.setState({
					hideEmailRead:false
				});

			}

			//$("[data-toggle='tooltip']").tooltip();
			//$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: 'div'});
		},
		displayAttachments:function(){
			var attachments=[];
			var files=[];
			var thisComp=this;

            if(Object.keys(this.state.attachment).length>0){

                    var size=0;
                    $.each(this.state.attachment, function( index, attData ) {
                        size+=parseInt(app.transform.from64str(attData['size']));

                            files.push(
                                <span className="clearfix" key={"a"+index}>
							<br/>
							<span className="attchments" key={"as"+index}>{app.transform.from64str(attData['name'])}</span>
							<button  key={"ab"+index} id={index} className="btn btn-sm btn-primary pull-right" onClick={thisComp.handleClick.bind(thisComp, 'downloadFile')}>Download</button>
						</span>
                            );
                    });

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


			}
		},
        componentWillReceiveProps: function(nextProps) {
            if(nextProps.isHtml !== this.props.isHtml){
                this.handleClick('toggleMailHtmlText');
            }
        },

		handleClick: function(i,event) {
			switch(i) {
                case 'toggleMailHtmlText':
                    if(this.props.isHtml){
                        this.setState({
                            toggleHTMLtext:'text'
                        });
						var ifPGP=false;
                        app.globalF.renderBodyNoImages('',this.state.emailBodyTXT,ifPGP,function(prerenderedBody){
                            $("#virtualization").height(0);

                            setTimeout(function(){

                                $('#virtualization').contents().find("html").html(prerenderedBody);

                                $("#virtualization").height($("#virtualization").contents().find("html").height());
                            },100);
                        });

                    }else if(!this.props.isHtml){
                        this.setState({
                            toggleHTMLtext:'html'
                        });

                        app.globalF.renderBodyFull(this.state.emailBody,'',ifPGP,function(prerenderedBody){
                            $("#virtualization").height(0);

                            setTimeout(function(){

                                $('#virtualization').contents().find("html").html(prerenderedBody);

                                $("#virtualization").height($("#virtualization").contents().find("html").height());
                            },100);
                        });
                    }

                    break;

                case 'downloadFile':

					var fileButton=$(event.target);
                    var email=app.user.get('currentMessageView');
					var emailAttachments=email['attachment'];
                    var fileBId=fileButton.attr('id');

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

                        var key =this.props.emailPin;

                    }

					var type=app.transform.from64str(emailAttachments[fileBId]['type']);
					var size=app.transform.from64str(emailAttachments[fileBId]['size']);
					var name=app.transform.from64str(emailAttachments[fileBId]['name']);

					fileButton.html('<i class="fa fa-spin fa-refresh"></i> Downloading');

					app.unregF.downloadFileUnreg(fileName,modKey,version,function(result){

						fileButton.html('Download');
						var decryptedFile64 = app.transform.fromAesBin(key, result);

					var decryptedFile=app.transform.from64bin(decryptedFile64);

						var arbuf=app.globalF.base64ToArrayBuffer(decryptedFile);

                        app.globalF.createDownloadLink(arbuf,type, name);

					});

					break;

				case 'email':
					$('#col1').toggleClass('hide');
					$('#view-mail-wrapper').toggleClass('visible-lg');
					break;




			}

		},

		componentDidUpdate:function(){
                   			//console.log('finish loading');
		},
		renderFull:function(){
			var ifPGP=false;
			app.globalF.renderBodyFull(this.state.emailBody,this.state.emailBodyTXT,ifPGP,function(prerenderedBody){

				$("#virtualization").height(0);
				setTimeout(function(){

					$('#virtualization').contents().find("html").html(prerenderedBody);
					$("#virtualization").height($("#virtualization").contents().find("html").height()+100);
				},100);


			});
			this.setState({
				renderFull:true
			})

		},

		renderStrictBody: function(){

			app.globalF.renderBodyNoImages(this.state.emailBody,this.state.emailBodyTXT,ifPGP,function(prerenderedBody){
				$("#virtualization").height(0);

					setTimeout(function(){

							$('#virtualization').contents().find("html").html(prerenderedBody);

							$("#virtualization").height($("#virtualization").contents().find("html").height());
					},100);
			});

		},
		render: function () {

//console.log(this.state.cc);
			//var hide=app.user.get('currentMessageView')['id']==undefined?true:false;

		return (
			<div className={this.props.panel.rightPanel} id="mRightPanel">

				<div className={"emailShow "+(this.state.hideEmailRead?"":"")}>


				<div className="clearfix"></div>
				<div className="email-header">
					<header>
                        <h2 className="ellipsisText hidden-xs">{this.state.subject}</h2>

						<h4 className="ellipsisText visible-xs">{this.state.subject}</h4>
						<p className="pull-right">{this.state.timeSent}</p>
					</header>

					<div className="row view-mail-header">

						<div className="col-sm-9" id="rcptHeader">
						From: {this.state.from}
							<div className="clearfix"></div>
						To: {this.state.to}
							<div className="clearfix"></div>
						{this.state.cc.length!=0?"CC: ":""}{this.state.cc}
							<div className="clearfix"></div>
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
