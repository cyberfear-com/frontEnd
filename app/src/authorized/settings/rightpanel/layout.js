define(['react','app'], function (React,app) {
	"use strict";
	return React.createClass({
        /**
         *
         * @returns {{
         * panel: {
         *  firstPanelClass: string,
         *  secondPanelClass: string,
         *  firstTab: string,
         *  secondTab: string
         *  },
         * firstRadio: boolean,
         * secondRadio: boolean,
         * thirdRadio: boolean,
         * inboxLayout: string
         * }}
         */
		getInitialState : function() {
			return {
				panel: {
					firstPanelClass: "panel-body",
					secondPanelClass: "panel-body hidden",
					firstTab: "active",
					secondTab: ""
				},
				firstRadio:app.user.get("inboxLayout")=="3cols"?true:false,
				secondRadio:app.user.get("inboxLayout")=="2col2hor"?true:false,
				thirdRadio:app.user.get("inboxLayout")=="2col"?true:false,

				inboxLayout:app.user.get("inboxLayout")
			};
		},

		componentDidMount: function() {
		},

        /**
         *
         * @param {string} action
         */
		handleClick: function(action) {
			switch(action) {
				case 'showFirst':
					this.setState(
						{
							panel: {
								firstPanelClass: "panel-body",
								secondPanelClass: "panel-body hidden",
								firstTab: "active",
								secondTab: ""
							}
						}
					);

					break;
				case 'showSecond':
					this.setState(
						{
							panel: {
							firstPanelClass: "panel-body hidden",
							secondPanelClass: "panel-body",
							firstTab: "",
							secondTab: "active"
						}
						}
					);
					break;

				case 'firstRadio':
					this.setState(
						{
							firstRadio:true,
							secondRadio:false,
							thirdRadio:false,
							inboxLayout:"3cols"
						});
					break;
				case 'secondRadio':
					this.setState(
						{

								firstRadio:false,
								secondRadio:true,
								thirdRadio:false,

							inboxLayout:"2col2hor"

						});
					break;
				case 'thirdRadio':
					this.setState(
						{

								firstRadio:false,
								secondRadio:false,
								thirdRadio:true,

							inboxLayout:"2col"

						});
					break;

				case 'resetLayout':
					this.setState(
						{

								firstRadio:false,
								secondRadio:false,
								thirdRadio:false,

							inboxLayout:app.user.get("inboxLayout")
						});
					break;

				case 'safeLayout':

					app.user.set({"inboxLayout":this.state.inboxLayout});

					app.userObjects.updateObjects('userLayout','',function(response){
						//restore copy of the object if failed to save
						if(response=='success'){
							//app.user.set({"DecryptedProfileObject":profile});
							//app.userObjects.set({"EncryptedProfileObject":newProfObj});
							//console.log('ura');
						}else if(response=='failed'){

						}else if(response=='nothing'){

						}

					});


					break;
			}


		},

        /**
         *
         * @returns {JSX}
         */
		render: function () {

			var classLaySelct="col-xs-12";


		return (
			<div className={this.props.classes.rightClass} id="rightSettingPanel">
				<div className="col-lg-7 col-xs-12 personal-info ">
					<div className="panel panel-default">
						<div className="panel-heading">
							<ul className="nav nav-tabs tabbed-nav">
								<li role="presentation" className={this.state.panel.firstTab}>
									<a onClick={this.handleClick.bind(this, 'showFirst')}>
										<h3 className={this.props.tabs.Header}>Layout</h3>
										<h3 className={this.props.tabs.HeaderXS}><i className="fa fa-desktop"></i></h3>
									</a>
								</li>
							</ul>
						</div>

							<div className={this.state.panel.firstPanelClass}>
								<div className={classLaySelct}>

										<label className="col-xs-6 col-sm-4">
											<input type="radio" name="inlineRadioOptions" checked={this.state.firstRadio}
											onChange={this.handleClick.bind(this, 'firstRadio')}/>
											<img src="/img/layouts/3col.jpg" className="layimage img-thumbnail img-responsive row-centered"/>
										</label>

										<label className="col-xs-6 col-sm-4">
											<input type="radio" name="inlineRadioOptions" checked={this.state.secondRadio}
											onChange={this.handleClick.bind(this, 'secondRadio')}/>
											<img src="/img/layouts/2col2hor.jpg" className="layimage img-thumbnail img-responsive row-centered"/>
										</label>
										<label className="col-xs-6 col-sm-4">
											<input type="radio" name="inlineRadioOptions" checked={this.state.thirdRadio}
											onChange={this.handleClick.bind(this, 'thirdRadio')}/>
											<img src="/img/layouts/2col.jpg" className="layimage img-thumbnail img-responsive row-centered"/>
										</label>

								</div>

								<div className="clearfix"></div>
								<div className="col-xs-12 paddin-top-10 text-right">
									<div className="form-group">
										<div className="">
											<button type="button" className="btn btn-primary"
											onClick={this.handleClick.bind(this, 'safeLayout')}
											disabled={this.state.inboxLayout==app.user.get("inboxLayout")}
											>Save</button>
											<button type="button" className="btn btn-default" onClick={this.handleClick.bind(this, 'resetLayout')}>Cancel</button>
										</div>
									</div>
								</div>


							</div>

							<div className={this.state.panel.secondPanelClass}>


								<div className="alert alert-warning" role="alert">
								Allbe able to receive any more emails.  Do you want to continue
								</div>

								<div className="pull-right">
									<button type="button" className="btn btn-primary">Save</button>
									<button type="button" className="btn btn-default">Cancel</button>
								</div>
							</div>
					</div>
				</div>

				<div className="col-lg-5 col-xs-12 personal-info ">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title personal-info-title">Help</h3>

						</div>

						<div className="panel-body">

							<p>
								<b>Display Name</b> -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates
							patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte
							vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.

							Possit menandri persequeris no has, cibo deleniti euripidis usu ei. Vel ea elit mentitum tacimates, ut omnis
							scribentur vis. Pri id dico consetetur repudiandae, vix no cibo quando offendit. At nam nibh deserunt, his at
							facer tantas, dicit quando mandamus his eu. Eros ocurreret has id, altera verterem molestiae ad eum. Ea saepe
							discere delicatissimi sea, ius ne dolor timeam epicuri, ne sea quod civibus convenire.
							</p>
							<p>
								<b>Signature</b> -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates
							patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte
							vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.
							</p>

							<p>
								<b>Signature</b> -Lorem ipsum dolor sit amet, graece ridens insolens ne has. Per et vide equidem, sed tacimates
							patrioque suscipiantur no. No sea delectus percipit vituperata. Ad vim fierent vulputate honestatis. At utamur malorum incorrupte
							vel, pri recteque iudicabit cu. Id nonumy veritus nominati eos, ut mea oratio impetus expetenda.
							</p>
						</div>
					</div>
				</div>

			</div>
			);
		}

	});
});