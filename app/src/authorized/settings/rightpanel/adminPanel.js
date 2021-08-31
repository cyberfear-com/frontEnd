define(['react','app','accounting'], function (React,app,accounting) {
    "use strict";
	return React.createClass({
        getInitialState: function () {
            return {
            	totalSignUps:0,
				SignUps24:0,
				SignUps7:0,
				SignUps30:0,
				totalPremium:0,
				Premium24:0,
				Premium7:0,
				Premium30:0,
				totalDomain:0,
				Domain24:0,
				Domain7:0,
				Domain30:0
        };
    },

        /**
         *
         * @param {string} action
         */
		handleClick: function(action) {
			switch(action) {
				case 'refresh':
					this.refresh();
				break;
			}


		},
		refresh:function(){
			var thisComp=this;
			app.serverCall.ajaxRequest('RetrieveAdminData', {}, function (result) {
				thisComp.setState({
					totalSignUps:result['data']['tsigns'],
					SignUps24:result['data']['sig24h'],
					SignUps7:result['data']['sig7d'],
					SignUps30:result['data']['sig30d'],
					totalPremium:result['data']['premtot'],
					Premium24:result['data']['prem24h'],
					Premium7:result['data']['prem7d'],
					Premium30:result['data']['prem30d'],
					totalDomain:result['data']['domtot'],
					Domain24:result['data']['dom24h'],
					Domain7:result['data']['dom7d'],
					Domain30:result['data']['dom30d']
				});
			})
		},
		componentDidMount: function () {
			//this.whatToShow();

			this.refresh();

		},

		render: function () {
			var rightClass="Right col-xs-10 sRight";

		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">
				<div className="col-md-6 col-sm-12 personal-info ">
					<div className="panel panel-default">
						<div className="panel-heading">
							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className="active">
									<a>
										<h3 className={this.props.tabs.Header}>Admin Panel</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="ion-trash-b"></i></h3>

									</a>
								</li>
							</ul>
						</div>
						<div className="panel-body">

							<div className="">
								<table className=" table table-hover table-striped datatable table-light margin-top-20">
									<tr key="1">
										<td className="col-md-6">
											<b>Total Sign Ups:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.totalSignUps,'',0)}</td>



									</tr>
									<tr key="2">
										<td className="col-md-6">
											<b>Sign Ups Last 24h:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.SignUps24,'',0)}</td>



									</tr>
									<tr key="3">
										<td className="col-md-6">
											<b>Sign Ups 7 days:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.SignUps7,'',0)}</td>



									</tr>
									<tr key="4">
										<td className="col-md-6">
											<b>Sign Ups 30 days:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.SignUps30,'',0)}</td>



									</tr>
									<tr key="4a">
										<td className="col-md-6">
											<b>Total Premium:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.totalPremium,'',0)}</td>



									</tr>
									<tr key="5">
										<td className="col-md-6">
											<b>Premium last 24h:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.Premium24,'',0)}</td>



									</tr>
									<tr key="6">
										<td className="col-md-6">
											<b>Premium 7 days:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.Premium7,'',0)}</td>



									</tr>
									<tr key="7">
										<td className="col-md-6">
											<b>Premium 30 days:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.Premium30,'',0)}</td>



									</tr>
									<tr key="8">
										<td className="col-md-6">
											<b>Total Domains:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.totalDomain,'',0)}</td>



									</tr>
									<tr key="9">
										<td className="col-md-6">
											<b>Domains Last 24h:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.Domain24,'',0)}</td>



									</tr>
									<tr key="10">
										<td className="col-md-6">
											<b>Domains 7 days:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.Domain7,'',0)}</td>



									</tr>
									<tr key="11">
										<td className="col-md-6">
											<b>Domains 30 days:</b>
										</td>
										<td colSpan="2">{accounting.formatMoney(this.state.Domain30,'',0)}</td>



									</tr>
								</table>
							</div>

							<div className="pull-right">
								<button type="button" className="btn btn-danger" onClick={this.handleClick.bind(this, 'refresh')}>Refresh</button>
							</div>
						</div>
					</div>
				</div>

			</div>
			);
		},

	});
});
