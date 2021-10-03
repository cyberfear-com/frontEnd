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
				<div className="footer">
						<div className="text-align-center">
							<span className="txt-color-white">CyberFear © 2021 - </span>

							<a href="/terms.html" target="_blank"><span className="txt-color-black">ToS</span></a>

							<a href="privacy.html" target="_blank"><span className="txt-color-black">Privacy Policy</span></a>

						</div>

				</div>

				);

		}

	});
});
