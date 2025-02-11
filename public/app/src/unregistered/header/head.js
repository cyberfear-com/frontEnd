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
				<header className="header-frontend">
					<div className="container">
						<nav className="navbar navbar-expand-lg navbar-light bg-light">
							<a className="navbar-brand" href="https://mailum.com"
							><img src="/images/logo_black.svg" alt=""
							/></a>
							<button
								className="navbar-toggler collapsed"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#navbarSupportedContent"
								aria-controls="navbarSupportedContent"
								aria-expanded="false"
								aria-label="Toggle navigation"
							>
								<span className="icon-bar top-bar"></span>
								<span className="icon-bar middle-bar"></span>
								<span className="icon-bar bottom-bar"></span>
							</button>
							<div
								className="collapse navbar-collapse"
								id="navbarSupportedContent"
							>
								<ul className="navbar-nav mx-auto">
									<li className="nav-item">
										<a className="nav-link" href="/pricing"
										>Pricing</a
										>
									</li>
									<li className="nav-item">
										<a className="nav-link" href="/company"
										>Company</a
										>
									</li>
									<li className="nav-item">
										<a className="nav-link" href="https://github.com/cyberfear-com" rel="noreferrer"
										   target="_blank">GitHub</a>
									</li>
									<li className="nav-item d-none">
										<a
											className="nav-link"
											href="https://mailum.com/blog"
											target="_blank"
										>Blog</a
										>
									</li>
									<li className="nav-item">
										<a
											className="nav-link"
											href="/contact-us"
										>Contact</a
										>
									</li>
								</ul>
								<ul className="navbar-nav ms-auto header-cta-btn">
									<li className="nav-item">
										<a href="/mailbox/#login" className="btn-1"
										><span
											data-bs-toggle="collapse"
											data-bs-target="#navbarSupportedContent"
											aria-controls="navbarSupportedContent"
											aria-expanded="false"
											aria-label="Toggle navigation"
											className="
                                                d-block
                                                w-100
                                                h-100
                                                position-absolute
                                            "
										></span
										><span className="hover"></span
										><span className="children"
										>Sign In</span
										></a
										>
									</li>
									<li className="nav-item">
										<a href="/mailbox/#signup" className="btn-2"
										><span
											data-bs-toggle="collapse"
											data-bs-target="#navbarSupportedContent"
											aria-controls="navbarSupportedContent"
											aria-expanded="false"
											aria-label="Toggle navigation"
											className="
                                                d-block
                                                w-100
                                                h-100
                                                position-absolute
                                            "
										></span
										><span className="hover"></span
										><span className="children"
										>Sign Up</span
										></a
										>
									</li>
								</ul>
								<div className={"pull-right " +offlineClass} id="connectionError">
									<button className="btn btn-default button-noborder" data-placement="bottom" data-toggle="popover-hover" data-trigger="focus" title="" data-content="The system experienced a connection problem. Please reload the page. If the problem persists, please contact us." data-original-title="Connection Error" onClick={this.handleClick.bind(this, 'restartQue')}><i className="fa fa fa-exclamation-circle fa-lg fa-fw txt-color-red"></i></button>

								</div>
							</div>
						</nav>
					</div>
				</header>

				);

		}
	});
});
