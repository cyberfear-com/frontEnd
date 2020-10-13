define(['react'], function (React) {
	return React.createClass({
		handleClick: function (i) {
			switch (i) {
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

			}
		},
		componentDidMount: function () {
			if (this.props.scrollTo == "donate") {
				var thisComp = this;
				setTimeout(function () {
					thisComp.handleClick('donate');
				}, 300);
			}
		},
		componentWillUnmount: function () {
			//	clearTimeout(this.interval);
		},
		onClick: function () {
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

			return React.createElement(
				'div',
				{ className: 'container-fluid' },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-lg-5 col-md-6 col-sm-6 col-xs-12 mobile-center', style: { height: "85vh" } },
						React.createElement(
							'div',
							null,
							React.createElement(
								'h3',
								{ className: 'visible-xs-block' },
								'ANONYMOUS EMAIL SERVICE'
							),
							React.createElement(
								'ul',
								{ className: 'features list-unstyled' },
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/cancel.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' No IP Logs'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/lock.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' End to End Email Encryption'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/identification.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' No one can read your emails - not even us'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/shield.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' MITM Protection'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/gps.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' Offshore Servers Location'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/unknown.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' Anonymous payment methods'
									)
								),
								React.createElement(
									'li',
									null,
									React.createElement('img', { src: 'img/tick.svg', className: 'filter-black', height: '22' }),
									React.createElement(
										'span',
										null,
										' No KYC, no phone verifications'
									)
								)
							),
							React.createElement(
								'a',
								{ onClick: this.handleClick.bind(this, 'signUp'), className: 'dark-btn d-mobile' },
								'Create Your Email'
							),
							React.createElement(
								'a',
								{ href: 'features.html', className: 'dark-btn d-desktop' },
								'VIEW ALL FEATURES ',
								React.createElement('img', { src: 'img/right-arrow.svg',
									height: '11',
									style: { marginTop: "-4px" } })
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'col-12' },
						React.createElement(
							'div',
							{ style: { position: "relative" } },
							React.createElement('img', { src: 'img/camera.svg', className: 'camera-img' })
						)
					),
					React.createElement(
						'div',
						{ className: 'col-lg-6 col-md-6 col-sm-6' },
						React.createElement('img', { src: 'img/people.svg', className: 'people-img' })
					),
					React.createElement(
						'div',
						{ className: 'col-xs-12 d-mobile text-center', style: { marginTop: "80px", marginBottom: "30px" } },
						React.createElement(
							'p',
							{ style: { fontWeight: 700 } },
							'Learn more about our service:'
						),
						React.createElement(
							'a',
							{ href: 'features.html', className: 'white-btn' },
							'View All Features'
						)
					)
				)
			);
		}

	});
});