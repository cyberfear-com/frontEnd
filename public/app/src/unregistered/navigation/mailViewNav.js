define(['react','app','accounting'], function (React,app,accounting) {
	return React.createClass({
		getInitialState : function() {
			return {
				isHtml:true,
                navPage:this.props.page,
                canReply:false
			}
		},
		handleClick: function(i,event) {
			switch(i) {
                case 'togglePlainHTML':
                    this.props.updateHtmlState();
                    this.setState({
                        isHtml:!this.state.isHtml
                    });
                    break;

                case 'cancelCompose':
                    app.restartApp();
                    //Backbone.history.navigate("/retrieveEmailV2/"+app.user.get('draftMessageView')['messageId'], {
                    //    trigger : true
                    //});

                    break;
                case 'deleteEmail':


                    var messageId=app.user.get("currentMessageView")['id'];
                    var modKey=app.user.get("currentMessageView")['originalBody']['modKey'];

                    $('#dialogModHead').html("Delete Email");
                    $('#dialogModBody').html("Email will be deleted. Continue?");

                    $('#dialogPop').modal('show');

                    $('#dialogOk').on('click', function () {
                        $('#dialogPop').modal('hide');
                        app.unregF.deleteEmailsUnreg(messageId,modKey);
                    });

                    break;
                case 'reply':
                    // $('[data-toggle="popover-hover"]').popover('hide');
                    //$('#element').tooltip('hide')

                    app.unregF.reply('replyFull');

                    Backbone.history.navigate("/composeEmail/"+app.user.get("currentMessageView")['id'], {
                        trigger : true
                    });
                    break;
                case 'sendEmail':
                    this.props.sendMail();
                    $('#sendingMailUnreg').html('<i class="fa fa-refresh fa-spin"></i> Sending');
                    break;



			}
		},

		handleChange:function(i,event){
			switch(i) {

			}
		},
        componentWillReceiveProps: function(nextProps) {

            if(nextProps.page=='composeEmail'){
                this.setState({
                    navPage:'composeEmail'
                });
            }else{
                this.setState({
                    navPage:'readEmail'
                });
            }

            if(nextProps.canReply===true){
              this.setState({
                  canReply:true
              });
            }


        },

		componentWillUnmount: function () {

		},
		componentDidMount: function() {
			var thisComp=this;

		},

		render: function () {

			var st1={height:'25px',marginLeft:'4px',marginBottom:'2px'};
			var st2={marginTop:'3px'};
			var st3={width:'30px'};
		return (
			<div className="emailHeader">
                <div className="email-read-icons col-xs-12">

                    <div className={"btn-group m-r-sm pull-right unregIcons "+(this.state.navPage=='readEmail'?"":"hidden")}>
                        <button className={"btn btn-sm btn-default w-xxs w-auto-xs "+(this.state.canReply?"":"hidden")} data-placement="bottom" data-toggle="popover-hover" title="" data-content="Reply to Sender" onClick={this.handleClick.bind(this, 'reply')}><i className="fa fa-reply fa-lg"></i></button>

                        <button className="btn btn-sm btn-default w-xxs w-auto-xs" data-placement="bottom" data-toggle="popover-hover" title="" data-content="Toggle View" onClick={this.handleClick.bind(this, 'togglePlainHTML')}><span className={this.state.isHtml?"bold":""}>HTML</span> / <span className={!this.state.isHtml?"bold":""}>Plain</span></button>
                        <button className="btn btn-sm btn-default w-xxs w-auto-xs" data-placement="bottom" data-toggle="popover-hover" title="" data-content="Delete" onClick={this.handleClick.bind(this, 'deleteEmail')}><i className="fa fa-trash-o fa-lg"></i></button>
                    </div>

                    <div className={"btn-group m-r-sm pull-right unregIcons "+(this.state.navPage=='composeEmail'?"":"hidden")}>

                    <button id="sendingMailUnreg" className="btn btn-primary btn-sm" onClick={this.handleClick.bind(this, 'sendEmail')}>Send</button>
                    <button className="btn btn-danger btn-sm" onClick={this.handleClick.bind(this, 'cancelCompose')}>Cancel</button>
                    </div>

                </div>
            </div>
			);
		}

	});
});
