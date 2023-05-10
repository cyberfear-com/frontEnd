define(['react'], function (React) {
	return React.createClass({
		handleClick: function (i) {
			switch (i) {
				case 'reportBug':
					$('#reportBug-modal').modal('show');
					break;

				//default:
				//default code block
			}
		},
		render: function () {

			return React.createElement(
				'footer',
				null,
				React.createElement(
					'div',
					{ className: 'text-center' },
					React.createElement(
						'p',
						null,
						React.createElement(
							'a',
							{ style: { color: "white", fontWeight: "1" }, href: 'privacy.html' },
							'Privacy Policy | '
						),
						React.createElement(
							'a',
							{ style: { color: "white", fontWeight: "1" }, href: 'terms.html' },
							'Terms & Conditions | '
						),
						React.createElement(
							'a',
							{ style: { color: "white", fontWeight: "1" }, href: 'https://blog.cyberfear.com' },
							'Blog'
						)
					)
				)
			);
		}

	});
});