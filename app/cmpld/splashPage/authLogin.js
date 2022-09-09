define(['react'], function (React) {
	return React.createClass({

		render: function () {

			return React.createElement(
				"div",
				{ className: "container" },
				React.createElement(
					"div",
					{ className: "section-header" },
					React.createElement(
						"h4",
						{ className: "dark-text" },
						"This is login page."
					)
				)
			);
		}

	});
});