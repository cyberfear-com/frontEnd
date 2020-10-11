define(['react','app','cmpld/authorized/mailbox/leftpanel/folderList',
	'cmpld/authorized/mailbox/middlepanel/emailList',
	'cmpld/authorized/mailbox/rightpanel/emailRead',
	'cmpld/authorized/mailbox/navigation/mailViewNav',
	'cmpld/authorized/mailbox/rightpanel/composeEmail'

], function (React,app,FolderList,EmailList,EmailRead,MailViewNav,ComposeEmail) {

	return React.createClass({
        mixins: [app.mixins.touchMixins()],
		getInitialState : function() {
			var lft="Left hidden-xs col-sm-3 col-md-2 col-lg-2"; //col-md-cust
			var midl="Middle inbox col-xs-12 col-sm-9 col-md-10 col-lg-5";// col-sm-12 col-md-10 col-lg-5
			var rght="Right hidden-xs hidden-sm hidden-md  col-lg-6";//col-lg-6


			return {
				leftPanel: lft,
				middlePanel:midl,
				rightPanel:rght,
				folderId:''
			};
		},
        handleResize: function(){
           // console.log($(window).height());
            //console.log($('#mRightPanel').width());

            var height=$(window).height()-$('.authnavigation').height()-$('.emailHeader').height()-30;
        },
        componentDidMount: function() {

            window.addEventListener('resize', this.handleResize);
            this.handleResize();


        },
        componentWillUnmount: function () {
            app.mixins.off("change");
            window.removeEventListener('resize', this.handleResize);


        },

		updateValue:function(modifiedValue){
			this.setState(
				modifiedValue
			);

			//console.log(this.state.AccountResetOptions);
			//this.setState.AccountResetOptions=modifiedValue;
			//console.log(this.state.AccountResetOptions);
			//this.setState({
			//	AccountResetOptions:{'email':modifiedValue}
			//})
		},
		/*changeFodlerId:function(folderId){
			this.setState({
				folderId:folderId
			});
		},*/

		handleClick: function(i) {
			switch(i) {

				case 'canary':
					Backbone.history.navigate("/Canary", {
						trigger : true
					});
					break;
				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;

			}


		},

		onClick: function() {
		//	$('.hiddens').toggle();
		},
		render: function () {

			//var cx = React.addons.classSet;
			//var middleClass = cx({
			//	'message': true,
			//	'message-important': this.props.isImportant,
			//	'message-read': this.props.isRead
			//});
			//console.log(this.props);
			if(this.props.pp=="Compose"){
				var body=<ComposeEmail panel={this.state}/>;
			}else{
				//console.log('ddd');
				var body=<EmailRead panel={this.state} updateValue={this.updateValue} resetClasses={this.resetClases}/>;
			}
		return (
			<section className="mailbox_section" onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>

				<div className="Container">
					<FolderList activePage={this.props.activePage} changeFodlerId={this.props.changeFodlerId} panel={this.state} updateValue={this.updateValue} resetClasses={this.resetClases}/>
					<div className="Middle inbox col-xs-12 col-sm-9 col-md-10 col-lg-5 no-padding" id='mMiddlePanelTop'>
						<MailViewNav folderId={this.props.folderId}/>
						<EmailList folderId={this.props.folderId} panel={this.state} updateValue={this.updateValue} resetClasses={this.resetClases}/>
					</div>

				{body}
				</div>
			</section>
			);
		}

	});
});