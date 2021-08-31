define(['react','app'], function (React,app) {
	return React.createClass({
		//getInitialState : function() {
			//return {
			//	setings:{profile:'active'}
			//};
		//},
		handleClick: function(i) {
			if(!app.user.get("inProcess")){
			this.props.updateAct(i);

				switch(i) {
					case 'Profile':
						Backbone.history.navigate("/settings/Profile", {
							trigger : true
						});
						break;
					case 'Layout':
						Backbone.history.navigate("/settings/Layout", {
							trigger : true
						});
						break;

					case 'Password':
						Backbone.history.navigate("/settings/Password", {
							trigger : true
						});
						break;
					case 'Disposable-Aliases':
						Backbone.history.navigate("/settings/Disposable-Aliases", {
							trigger : true
						});
						break;
					case 'Custom-Domain':
						Backbone.history.navigate("/settings/Custom-Domain", {
							trigger : true
						});
						break;
					case '2-Step':
						Backbone.history.navigate("/settings/2-Step", {
							trigger : true
						});
						break;
					case 'Contacts':
						Backbone.history.navigate("/settings/Contacts", {
							trigger : true
						});
						break;
					case 'WebDiv':
						Backbone.history.navigate("/settings/WebDiv", {
							trigger : true
						});
						break;
					case 'PGP-Keys':
						Backbone.history.navigate("/settings/PGP-Keys", {
							trigger : true
						});
						break;

					case 'AdminPanel':
						Backbone.history.navigate("/settings/AdminPanel", {
							trigger : true
						});
						break;

					case 'Filter':
						Backbone.history.navigate("/settings/Filter", {
							trigger : true
						});
						break;
                    case 'BlackList':
                        Backbone.history.navigate("/settings/Black-List", {
                            trigger : true
                        });
                        break;
					case 'Folders':
						Backbone.history.navigate("/settings/Folders", {
							trigger : true
						});
						break;

					case 'Security-Log':
						Backbone.history.navigate("/settings/Security-Log", {
							trigger : true
						});
						break;
					case 'Coupon':
						Backbone.history.navigate("/settings/Coupons", {
							trigger : true
						});
						break;

					case 'Plan':
						Backbone.history.navigate("/settings/Plan", {
							trigger : true
						});
						break;

					case 'Delete-Account':
						Backbone.history.navigate("/settings/Delete-Account", {
							trigger : true
						});
						break;

				}
			}else{

				$('#infoModHead').html("Active Process");
				$('#infoModBody').html("Please cancel or wait until process is finished before go to the next page.");
				$('#infoModal').modal('show');

				//todo add cancel button
				//console.log('no');
			}
		},
		render: function () {
			//console.log(this.props.activeLink);
			//console.log(this.props.classes.leftClass);
			if(app.transform.SHA512(app.user.get('loginEmail'))=="eff5ce297f6dbec57ea9b44cea193bd1f053ebd207efbecc751c11307a1ea1ef3f1f2ddc64d744685e69e842b50a88228cd50aa2d3d411bdbfd448e72448b98d" || app.transform.SHA512(app.user.get('loginEmail'))=="30742f1d394011fdaaa1842001d5b9a7332356b60004e48f3141c7e0c3de4e35430ebe4fabdd646454d397c0f8dfb5674a4891e0e7b53fe79695d0d098216689"){
				var admin='';
			}else{
				var admin='hidden';
			}
		return (
			<div className={this.props.classes.leftClass} id="leftSettingPanel">

				<ul className="nav-settings">
					<li className={this.props.activeLink.profile}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Profile')}>Profile <i className="fa fa-chevron-right"></i>
						</a>
					</li>
					<li className={this.props.activeLink.layout +" hidden"}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Layout')}>Layout <i className="fa fa-chevron-right"></i>
						</a>
					</li>

					<li className={this.props.activeLink.password}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Password')}>Password <i className="fa fa-chevron-right"></i></a></li>
					<li className={this.props.activeLink.auth}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, '2-Step')}>Google Auth / Yubikey <i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.disposable}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Disposable-Aliases')}>Aliases / Disposable Emails <i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.domain}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Custom-Domain')}>Custom Domain <i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.folders}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Folders')}>Folders / Labels <i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.pgp}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'PGP-Keys')}>PGP Keys <i className="fa fa-chevron-right"></i></a></li>


					<li className={this.props.activeLink.contacts}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Contacts')}>Contacts <i className="fa fa-chevron-right"></i></a></li>

				{/*<li className={this.props.activeLink.webdiv}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'WebDiv')}>WebDiv <i className="fa fa-chevron-right"></i></a></li>*/}

					<li className={this.props.activeLink.spam}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Filter')}>Email Filter <i className="fa fa-chevron-right"></i></a></li>
                    <li className={this.props.activeLink.blackList}>
                        <a className="list-link js-nav" onClick={this.handleClick.bind(this, 'BlackList')}>Black / White List <i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.adminPanel+""+ admin}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'AdminPanel')}>Admin Panel <i className="fa fa-chevron-right"></i></a></li>

					{/*<li className={this.props.activeLink.security}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Security-Log')}>Security Log<i className="fa fa-chevron-right"></i></a></li>*/}
					<li className={this.props.activeLink.coupon}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Coupon')}>Coupons<i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.plan}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Plan')}>Paid Plan Features<i className="fa fa-chevron-right"></i></a></li>

					<li className={this.props.activeLink.delete}>
						<a className="list-link js-nav" onClick={this.handleClick.bind(this, 'Delete-Account')}>Delete Account <i className="fa fa-chevron-right"></i></a></li>

				</ul>
			</div>
			);
		}

	});
});
