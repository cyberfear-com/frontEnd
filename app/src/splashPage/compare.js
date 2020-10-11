define(['react'], function (React) {
	return React.createClass({
		handleClick: function(i) {
			switch(i) {
				case 'requestInvitation':
					$('#reqInvite').modal('show');
					break;
				case 'signUp':
					$('#createAccount-modal').modal('show');
					break;
                case "donate":
                    $('html, body').animate({
                        scrollTop: $("#donateUs").offset().top
                    }, 1000);
                    break;


			}},
		componentDidMount: function() {
            if(this.props.scrollTo=="donate"){
              var thisComp=this;
               setTimeout(function(){
                   thisComp.handleClick('donate');
               },300);

            }
		},
		componentWillUnmount : function() {
		//	clearTimeout(this.interval);
		},
		onClick: function() {
			$('.hiddens').toggle();
		},
		render: function () {

			var styleYes = {
				color: '#006600'
			};
			var styleNA = {
				color: '#aaaa00'
			};

			var overflow = {
				overflow: 'hidden'
			};

		return 	(
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-5 col-md-6 col-sm-6 col-xs-12 mobile-center" style={{height:"85vh"}}>
						<div>
							<h3 className="visible-xs-block">ANONYMOUS EMAIL SERVICE</h3>
							<ul className="features list-unstyled">
								<li>
									<img src="img/cancel.svg" className="filter-black" height="22"/>
										<span> No IP Logs</span>
								</li>
								<li>
									<img src="img/lock.svg" className="filter-black" height="22"/>
										<span> End to End Email Encryption</span>
								</li>
								<li>
									<img src="img/identification.svg" className="filter-black" height="22"/>
										<span> No one can read your emails - not even us</span>
								</li>
								<li>
									<img src="img/shield.svg" className="filter-black" height="22"/>
										<span> MITM Protection</span>
								</li>
								<li>
									<img src="img/gps.svg" className="filter-black" height="22"/>
										<span> Offshore Servers Location</span>
								</li>
								<li>
									<img src="img/unknown.svg" className="filter-black" height="22"/>
										<span> Anonymous payment methods</span>
								</li>
								<li>
									<img src="img/tick.svg" className="filter-black" height="22"/>
										<span> No KYC, no phone verifications</span>
								</li>
							</ul>
							<a onClick={this.handleClick.bind(this, 'signUp')} className="dark-btn d-mobile">Create Your Email</a>
							<a href="features.html" className="dark-btn d-desktop">VIEW ALL FEATURES <img src="img/right-arrow.svg"
																							  height="11"
																							  style={{marginTop: "-4px"}}/></a>
						</div>
					</div>
					<div className="col-12">
						<div style={{position: "relative"}}>
							<img src="img/camera.svg" className="camera-img"/>
						</div>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6">
						<img src="img/people.svg" className="people-img"/>
					</div>
					<div className="col-xs-12 d-mobile text-center" style={{marginTop: "80px",marginBottom: "30px"}}>
						<p style={{fontWeight: 700}}>Learn more about our service:</p>
						<a href="features.html" className="white-btn">View All Features</a>
					</div>
				</div>
			</div>
			);
		}

	});
});