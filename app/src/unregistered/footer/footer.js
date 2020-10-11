define(['react'], function (React) {
	return React.createClass({
			handleClick: function(i) {
				switch(i) {
					case 'terms':
						Backbone.history.navigate("/TermsAndConditions", {
									trigger : true
								});
						break;
					case 'privacy':
						Backbone.history.navigate("/PrivacyPolicy", {
							trigger : true
						});
						break;
					case 'canary':
						Backbone.history.navigate("/Canary", {
							trigger : true
						});
						break;
					case 'reportBug':
						$('#reportBug-modal').modal('show');
						break;

					//default:
					//default code block
				}
			},
		render: function () {

			return	(
				<footer>
					<div className="text-center">
						<p>
							<a style={{color:"white",fontWeight:"1"}} href="privacy.html">Privacy Policy | </a>
							<a style={{color:"white",fontWeight:"1"}} href="terms.html">Terms & Conditions | </a>
							<a style={{color:"white",fontWeight:"1"}} href="https://blog.cyberfear.com">Blog</a>
						</p>
					</div>
				</footer>
				);

		}

	});
});