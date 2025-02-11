define(['react','app','xss','jsui','cmpld/unregistered/header/head',
	'cmpld/unregistered/footer/footer',
	'cmpld/modals/infoPop',
	'cmpld/modals/dialogPop',
	'cmpld/modals/dontInterrupt',
    'cmpld/modals/askForPass',
    'cmpld/unregistered/emailReadCollection'



],
	function (React,app,xss,jsui,Header,Footer,InfoPop,DialogPop,DontInterrupt,AskForPass,EmailReadCollection) {

	return React.createClass({
		getInitialState : function() {
			console.log('!!!!')
			return {
				dfd: ""
			};
		},
		componentDidMount: function() {
			//console.log(app.user.get("secondPassword"));
			//logout if refresh
			var thisMod=this;

            //remove unecessary stuff
            $( ".preloader" ).remove();
            $('link[rel=stylesheet][href="/css/splash.css"]').remove();
            $('link[rel=stylesheet][href="/css/animate.min.css"]').remove();
            $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/css/main.css') );

		},
		handleClick: function(i) {
			switch(i) {

				//case 'resetTimer':
				//	app.user.startTimer();
				//	break;
			}
		},

		componentWillUnmount : function() {
		},

		render: function () {

			var page=this.props.page;

				return (
					<div className="mailBody">
						<div className="Top"><Header /></div>
                        <EmailReadCollection emailId={this.props.emailId} activePage={this.props.page}/>
						<InfoPop />
						<AskForPass />
						<DialogPop />
						<DontInterrupt />

					</div>
					);
			}
	});
});
