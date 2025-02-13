define(['react','app'], function (React,app) {
	return React.createClass({

		componentDidMount: function () {
			var thisComp=this;
			app.user.on("change:onlineStatus",function() {
				thisComp.forceUpdate();
			});
		},

		handleClick: function(i) {
			$(".navbar-toggle").click();

			switch(i) {

				case 'restartQue':
					app.serverCall.restartQue();
					break;

				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;



				case 'login':
					$('#loginUser').modal('show');
					break;

				case 'signUp':
					$('#createAccount-modal').modal('show');
					break;

			}},
		//forceUpdate: function (){


		//}.

		componentDidUpdate: function (){

			$('[data-toggle="popover-hover"]').popover({ trigger: "hover" ,container: 'body',html : true});
		},


		render: function ()
		{
			//console.log(this);

			if(app.user.get("onlineStatus")=='offline'){
				var offlineClass="";
			}else{
				var offlineClass="hidden";
			}

			return (
					<nav className="navbar navbar-fixed-top navbar-default authnavigation" id="menus">
						<div className="navbar-header">
							<button className="navbar-toggle collapsed" type="button" data-toggle="collapse"
									data-target="#navbarResponsive1" aria-controls="navbarResponsive"
									aria-expanded="false" aria-label="Toggle navigation">
								MENU
							</button>


							<a className="navbar-brand" onClick={this.handleClick.bind(this, 'inbox')}><img className="logoname" src="/img/logo/logo.svg" alt=""/></a>

							<div className={"pull-right " +offlineClass} id="connectionError">
								<button className="btn btn-default button-noborder" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error" onClick={this.handleClick.bind(this, 'restartQue')}><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>


							</div>

						</div>

						<div className="collapse navbar-collapse" id="navbarResponsive1">
							<ul className="nav navbar-nav navbar-right menus">

								<li><a href="/features.html">Premium Features</a></li>
								<li>
									<a className="nav-link dark-btn-menu" href="/mailbox/#login">Login</a>
								</li>
								<li>
									<a className="nav-link white-btn-menu" href="/mailbox/#signup">Sign Up</a>
								</li>
							</ul>


							<div className={"pull-right " +offlineClass} id="connectionError">
								<button className="btn btn-default button-noborder" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error" onClick={this.handleClick.bind(this, 'restartQue')}><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>


							</div>

						</div>
					</nav>

				);

		}
	});
});
