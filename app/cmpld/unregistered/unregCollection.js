define(['react', 'app', 'xss', 'jsui', 'cmpld/unregistered/header/head', 'cmpld/unregistered/footer/footer', 'cmpld/modals/infoPop', 'cmpld/modals/dialogPop', 'cmpld/modals/dontInterrupt', 'cmpld/modals/askForPass', 'cmpld/unregistered/emailReadCollection'], function (React, app, xss, jsui, Header, Footer, InfoPop, DialogPop, DontInterrupt, AskForPass, EmailReadCollection) {

	return React.createClass({
		getInitialState: function () {
			return {
				dfd: ""
			};
		},
		componentDidMount: function () {
			//console.log(app.user.get("secondPassword"));
			//logout if refresh
			var thisMod = this;

			//remove unecessary stuff
			$(".preloader").remove();
			$('link[rel=stylesheet][href="/css/splash.css"]').remove();
			$('link[rel=stylesheet][href="/css/animate.min.css"]').remove();
			$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/css/main.css'));
		},
		handleClick: function (i) {
			switch (i) {}
		},

		componentWillUnmount: function () {},

		render: function () {

			var page = this.props.page;

			return React.createElement(
				'div',
				{ className: 'mailBody' },
				React.createElement(
					'div',
					{ className: 'Top' },
					React.createElement(Header, null)
				),
				React.createElement(EmailReadCollection, { emailId: this.props.emailId, activePage: this.props.page }),
				React.createElement(Footer, null),
				React.createElement(InfoPop, null),
				React.createElement(AskForPass, null),
				React.createElement(DialogPop, null),
				React.createElement(DontInterrupt, null)
			);
		}
	});
});