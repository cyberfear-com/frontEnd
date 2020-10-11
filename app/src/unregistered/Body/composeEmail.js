define(['react','app', 'summernote','select2'], function (React,app,summernote,select2) {
	return React.createClass({
		getInitialState : function() {
            //console.log(app.user.get('draftMessageView'));
			return {
                fromEmail:app.transform.from64str(app.user.get('draftMessageView')['meta']['from'])+' via SCRYPTmail',
                //fromEmail:'sergyk17@yaho.com via SCRYPTmail',

				toEmail:app.transform.from64str(Object.keys(app.user.get('draftMessageView')['meta']['to'])[0]),
                //toEmail:'sdfsdff <sergei@cyberfear.com>',

                subject:'Re: '+app.user.get('draftMessageView')['meta']['subject'],
                body:app.user.get('draftMessageView')['body']['html'],
				encryptionKey:"",
				//originalHash:this.getEmailHash(),

				modKey:app.user.get('draftMessageView')['modKey'],
                messageId:app.user.get('draftMessageView')['messageId'],

			}
		},

		componentWillUnmount: function () {
            app.globalF.resetDraftMessage();

		},

		componentDidMount: function () {
            console.log(this.state.toEmail)
			var thisComp=this;
			//app.user.on("change:currentMessageView",function() {
			//		thisComp.setState({

			//		});


			//this.renderEmail();
			//},this);

			fileSelector = $("#ddd");

			$('#composeEmail').summernote({
				//minHeight: 400,
				airPopover: [
					['color', ['color']],
					['font', ['bold', 'underline']],
					['para', ['ul', 'paragraph']],
					['table', ['table']]
				],
				toolbar: [
					//[groupname, [button list]]

					['style', ['bold', 'italic', 'underline', 'clear']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['insert', ['link']] // no insert buttons
				]

			});

			$('.note-editable').css('min-height', 300);

            $('#composeEmail').code(thisComp.state.body);

            $('.note-editable').focus();
		},


		handleChange:function(i,event){
			switch(i) {


				case "enterSubject":
					var thisComp=this;
					thisComp.setState({
						subject:event.target.value
					});
					break;

			}
		},

		handleClick: function(i) {
			switch(i) {

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

				case 'toggleListSm':
					$('#mMiddlePanel').toggleClass('hidden-xs col-xs-12');
					$('#mRightPanel').toggleClass('col-xs-12 hidden-xs');

					$('#mMiddlePanel').toggleClass('hidden-sm col-sm-12');
					$('#mRightPanel').toggleClass('col-sm-12 hidden-sm');

					$('#mLeftPanel').toggleClass('col-md-2 hidden-md');
					$('#mMiddlePanel').toggleClass('hidden-md col-md-10');
					$('#mRightPanel').toggleClass('col-md-12 hidden-md');


					$('#mMiddlePanel').toggleClass('hidden-lg col-lg-5');
					$('#mRightPanel').toggleClass('col-lg-6 col-lg-12');

					break;


				case 'toggleList':

					$('.Middle').toggleClass('hidden-xs col-xs-12');
					$('.Right').toggleClass('col-xs-12 hidden-xs');


					//$('.Left').toggleClass('hidden-xs col-xs-12');
					//$('.Middle').toggleClass('col-xs-12 hidden-xs');

					//$('.Left').toggleClass('hidden-sm col-sm-4');
					//$('.Middle').toggleClass('col-sm-12 col-sm-8');

					//$('.Left').toggleClass('col-md-cust hidden-md');
					//$('.Middle').toggleClass('col-md-10 col-md-12');

					//$('.Left').toggleClass('col-md-cust hidden-lg');
					//$('.Middle').toggleClass('col-lg-5 col-lg-6');

					break;


				case 'sendEmail':
					var thisComp=this;
					//preparation to send email
					/*
					1)stop draft saving
					2)gather all infor for email
					3)detect recipients protection level
					4)encrypt email
					5)send out
					6)close email
					 */
                    var saveDraft = $.Deferred();


                    thisComp.prepareToSafeDraft(function(){
                        saveDraft.resolve();
                    });



			}

		},
        sendEmail:function(){
            console.log('saving');

            var d = new Date();

            var draft={
                'body':{},
                'meta':{}
            };

            draft['body']={
                'text':app.transform.to64str(app.globalF.stripHTML($('#composeEmail').code())),
                'html':app.transform.to64str(app.globalF.filterXSSwhite($('#composeEmail').code()))
            };


            //console.log($('#fromSender').val());
            //console.log(app.user.get('allKeys')[$('#fromSender').val()]);
            //console.log(app.user.get('allKeys')[$('#fromSender').val()]['displayName']);

            draft['meta']['from']=app.user.get('draftMessageView')['meta']['from'];


            draft['meta']['to']=[app.transform.to64str(this.state.toEmail)];


            draft['meta']['toCC']={};
            draft['meta']['toBCC']={};
            draft['meta']['fromExtra']='via SCRYPTmail';
            draft['meta']['attachment']=0;
            draft['meta']['subject']=app.transform.to64str(app.globalF.stripHTML(this.state.subject.substring(0, 150)));
            draft['meta']['body']=app.transform.to64str(app.globalF.stripHTML($('#composeEmail').code()).substring(0, 50));


            draft['meta']['opened']=false;
            draft['meta']['pin']="";
            draft['meta']['pinEnabled']=false;
            draft['meta']['status']="normal";

            draft['meta']['timeSent']=Math.round(d.getTime() / 1000);
            draft['meta']['timeCreated']=Math.round(d.getTime() / 1000);

            draft['meta']['signatureOn']=false;

            draft['meta']['type']=1;
            draft['meta']['version']=2;

            //draft['modKey']=draft['meta']['modKey'];
            draft['attachment']={};


            console.log('mod keys');

            console.log(this.state.modKey);

            console.log(draft);

            var clearEmail=app.globalF.getEmailsFromString(this.state.toEmail);
            this.checkRcpt(clearEmail,function(recipient){

               // console.log(mailKey);
                app.unregF.sendMail(draft,clearEmail,recipient);
                // console.log(thisComp.state.messageId);
            //    app.globalF.prepareForSending(draft,thisComp.state.allEmails,result,thisComp.state.emailProtected,thisComp.state.messageId,thisComp.state.pinText);

                //app.globalF.prepareForSending(thisComp.state.allEmails,result,thisComp.state.emailProtected);
                //console.log(thisComp.state.allEmails);
           // });


        });

          $('#sendingMailUnreg').html('<i class="fa fa-check"></i> Sent');
        },

        checkRcpt:function(recipient,callback){

                var post={
                    'emailHash':app.transform.SHA512(recipient),
                    'test':recipient
                };

                app.serverCall.ajaxRequest('retrievePublicKeyUnreg', post, function (result) {

                    if(result['response']=="success"){

                       var recipient ={
                            'email':app.transform.to64str(recipient),
                            'name': '',
                            'internal':true,
                            'pin':"",
                            'publicKey':result['data']
                        };

                        callback(recipient);
                    }else{
                        app.notifications.systemMessage('recpNotFound');
                    }
                });


        },



        componentWillReceiveProps: function(nextProps) {
            if(nextProps.sendMail===true){
                this.sendEmail();
            }
        },

		componentWillUpdate:function(nextProps, nextState){

		},

		componentDidUpdate:function(){
			//this.verifyIfencrypted();
		//	this.activateTooltips();
		//	$('[data-toggle="popover"]').popover({container: 'body'});
		},

		render: function () {

			//var hide=app.user.get('currentMessageView')['id']==undefined?true:false;
			var rightClass="RightRight col-lg-6 visible-lg";

		return (
			<div className={this.props.panel.rightPanel} id="mRightPanel">

				<div className={"emailNo "+(this.state.hideEmailRead?"":"hidden")}>
					<h3>Please Select Email</h3>
					</div>
				<div className={"emailShow "+(this.state.hideEmailRead?"hidden":"")}>


				<div className="clearfix"></div>
				<div className="email-header-compose">

                        <dl className="dl-horizontal">
                            <dt>From</dt>
                            <dd>{this.state.fromEmail}</dd>
                        </dl>
                        <dl className="dl-horizontal">
                            <dt>To</dt>
                            <dd>{this.state.toEmail}</dd>
                        </dl>

                        <dl className="dl-horizontal">
                            <dt>Subject</dt>
                            <dd>{this.state.subject}</dd>
                        </dl>



				</div>
				<div className="panel emailRead">


								<div className="" id="composeEmail">


								</div>

				</div>


				</div>

			</div>
			);

		},


	});
});