define(['react', 'app', 'accounting'], function (React, app, accounting) {
	"use strict";

	return React.createClass({
		getInitialState: function () {
			return {
				totalSignUps: 0,
				SignUps24: 0,
				SignUps7: 0,
				SignUps30: 0,
				totalPremium: 0,
				Premium24: 0,
				Premium7: 0,
				Premium30: 0,
				totalDomain: 0,
				Domain24: 0,
				Domain7: 0,
				Domain30: 0
			};
		},

		/**
   *
   * @param {string} action
   */
		handleClick: function (action) {
			switch (action) {
				case 'refresh':
					this.refresh();
					break;
			}
		},
		refresh: function () {
			var thisComp = this;
			app.serverCall.ajaxRequest('RetrieveAdminData', {}, function (result) {
				thisComp.setState({
					totalSignUps: result['data']['tsigns'],
					SignUps24: result['data']['sig24h'],
					SignUps7: result['data']['sig7d'],
					SignUps30: result['data']['sig30d'],
					totalPremium: result['data']['premtot'],
					Premium24: result['data']['prem24h'],
					Premium7: result['data']['prem7d'],
					Premium30: result['data']['prem30d'],
					totalDomain: result['data']['domtot'],
					Domain24: result['data']['dom24h'],
					Domain7: result['data']['dom7d'],
					Domain30: result['data']['dom30d']
				});
			});
		},
		componentDidMount: function () {
			//this.whatToShow();

			this.refresh();
		},

		render: function () {
			var rightClass = "Right col-xs-10 sRight";

			return React.createElement(
				'div',
				{ className: this.props.classes.rightClass, id: 'rightSettingPanel' },
				React.createElement(
					'div',
					{ className: 'col-md-6 col-sm-12 personal-info ' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'ul',
								{ className: 'nav nav-tabs tabbed-nav' },
								React.createElement(
									'li',
									{ role: 'presentation', className: 'active' },
									React.createElement(
										'a',
										null,
										React.createElement(
											'h3',
											{ className: this.props.tabs.Header },
											'Admin Panel'
										),
										React.createElement(
											'h3',
											{ className: this.props.tabs.HeaderXS },
											React.createElement('i', { className: 'ion-trash-b' })
										)
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-body' },
							React.createElement(
								'div',
								{ className: '' },
								React.createElement(
									'table',
									{ className: ' table table-hover table-striped datatable table-light margin-top-20' },
									React.createElement(
										'tr',
										{ key: '1' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Total Sign Ups:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.totalSignUps, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '2' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Sign Ups Last 24h:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.SignUps24, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '3' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Sign Ups 7 days:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.SignUps7, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '4' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Sign Ups 30 days:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.SignUps30, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '4a' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Total Premium:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.totalPremium, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '5' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Premium last 24h:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.Premium24, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '6' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Premium 7 days:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.Premium7, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '7' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Premium 30 days:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.Premium30, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '8' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Total Domains:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.totalDomain, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '9' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Domains Last 24h:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.Domain24, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '10' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Domains 7 days:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.Domain7, '', 0)
										)
									),
									React.createElement(
										'tr',
										{ key: '11' },
										React.createElement(
											'td',
											{ className: 'col-md-6' },
											React.createElement(
												'b',
												null,
												'Domains 30 days:'
											)
										),
										React.createElement(
											'td',
											{ colSpan: '2' },
											accounting.formatMoney(this.state.Domain30, '', 0)
										)
									)
								)
							),
							React.createElement(
								'div',
								{ className: 'pull-right' },
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-danger', onClick: this.handleClick.bind(this, 'refresh') },
									'Refresh'
								)
							)
						)
					)
				)
			);
		}

	});
});