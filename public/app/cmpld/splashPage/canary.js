define(['react'], function (React) {
	return React.createClass({

		getInitialState: function () {
			return {
				year: new Date().getFullYear(),
				month: new Date().toLocaleString('en-us', { month: "short" }),
				day: new Date().getDay()
			};
		},

		onClick: function () {
			$('.hiddens').toggle();
		},
		render: function () {

			return React.createElement(
				'section',
				{ className: 'services grey-bg', id: 'section1' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'div',
						{ className: 'section-header' },
						React.createElement(
							'h2',
							{ className: 'dark-text' },
							'Transparency report'
						),
						React.createElement('div', { className: 'colored-line' }),
						this.state.noRequestTime,
						React.createElement('br', null),
						'Updated May 03, 2017'
					),
					'A ',
					React.createElement(
						'a',
						{ href: 'https://en.wikipedia.org/wiki/Warrant_canary', target: '_blank' },
						'warrant canary'
					),
					' is a method by which a communications service provider informs its users that the provider has not been served with a secret subpoena.',
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						React.createElement(
							'p',
							null,
							'We have had contact with law enforcement agency, but we have never released user data.'
						),
						React.createElement(
							'p',
							null,
							'SCRYPTmail has received a total of',
							React.createElement(
								'ul',
								null,
								React.createElement(
									'li',
									null,
									'5 request to access user data'
								),
								React.createElement(
									'li',
									null,
									'0 requests were granted'
								),
								React.createElement(
									'li',
									null,
									'We had 8 request from law enforcement agencies to access log file for the specific time for certain users'
								),
								React.createElement(
									'li',
									null,
									'8 requests for access time and IP were granted'
								)
							)
						),
						React.createElement('br', null),
						React.createElement('br', null)
					)
				)
			);
		}

	});
});