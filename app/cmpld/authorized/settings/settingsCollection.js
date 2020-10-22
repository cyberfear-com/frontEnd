define(['react', 'app', 'cmpld/authorized/settings/leftmenu/settingsList'], function (React, app, SettingsList) {
	return React.createClass({
		mixins: [app.mixins.touchMixins()],
		getInitialState: function () {
			return {
				settings: {
					profile: '',
					coupon: '',
					layout: '',
					password: '',
					disposable: '',
					domain: '',
					auth: '',
					contacts: '',
					webdiv: '',
					pgp: '',
					spam: '',
					folders: '',
					security: '',
					plan: '',
					delete: '',
					blackList: ''
				},
				setTabs: {
					Header: "panel-title personal-info-title hidden-xs",
					HeaderXS: "panel-title personal-info-title settings-tab-xs visible-xs"
				},
				classes: {
					rightClass: "Right col-xs-12 sRight",
					classActSettSelect: "col-xs-12 col-lg-6",
					leftClass: "Middle col-xs-2 no-padding sMiddle hidden-xs"
				}

			};
		},
		componentDidMount: function () {

			var thisComp = this;
			app.mixins.on('change', function () {
				//console.log(app.mixins.get("slide"));
				//console.log(app.mixins.get("slide"));
				if (app.mixins.get("slide") == "right" && !$('#leftSettingPanel').is(":visible")) {
					thisComp.setState({
						classes: {
							rightClass: "Right col-xs-12 sRight hidden",
							classActSettSelect: thisComp.state.classes.classActSettSelect,
							leftClass: "Middle col-xs-12 no-padding sMiddle"
						}
					});
					//this.shouldComponentUpdate();
				}
				/*
    if(app.mixins.get("slide")=="left"){
    	thisComp.setState({
    		classes:{
    			rightClass:"Right col-xs-12 sRight",
    			classActSettSelect:thisComp.state.classes.classActSettSelect,
    			leftClass:"Middle col-xs-2 no-padding sMiddle hidden-xs"
    		}
    	});
    	//this.shouldComponentUpdate();
    }
    */
			}.bind(this));
		},
		componentWillUnmount: function () {
			app.mixins.off("change");
		},

		updateActive: function (page) {
			if ($('#leftSettingPanel').is(":visible") && !$('#rightSettingPanel').is(":visible")) {

				this.setState({
					classes: {
						rightClass: "Right col-xs-12 sRight",
						classActSettSelect: this.state.classes.classActSettSelect,
						leftClass: "Middle col-xs-12 no-padding sMiddle hidden"
					}
				});
			}

			app.mixins.set({
				"slide": "",
				"startPositionX": 0,
				"lastPositionX": 0
			});

			switch (page) {
				case 'Profile':
					this.setState({ settings: { profile: 'active' } });
					break;
				case 'Layout':
					this.setState({ settings: { layout: 'active' } });
					break;

				case 'Password':
					this.setState({ settings: { password: 'active' } });
					break;
				case 'Disposable-Aliases':
					this.setState({ settings: { disposable: 'active' } });
					break;
				case 'Custom-Domain':
					this.setState({ settings: { domain: 'active' } });
					break;
				case '2-Step':
					this.setState({ settings: { auth: 'active' } });
					break;
				case 'Contacts':
					this.setState({ settings: { contacts: 'active' } });
					break;
				case 'WebDiv':
					this.setState({ settings: { webdiv: 'active' } });
					break;
				case 'PGP-Keys':
					this.setState({ settings: { pgp: 'active' } });
					break;

				case 'Filter':
					this.setState({ settings: { spam: 'active' } });
					break;
				case 'BlackList':
					this.setState({ settings: { blackList: 'active' } });
					break;
				case 'Coupons':
					this.setState({ settings: { coupon: 'active' } });
					break;

				case 'Folders':
					this.setState({ settings: { folders: 'active' } });
					break;

				case 'Security-Log':
					this.setState({ settings: { security: 'active' } });

					break;
				case 'Plan':
					this.setState({ settings: { plan: 'active' } });
					break;

				case 'Delete-Account':
					this.setState({ settings: { delete: 'active' } });
					break;

			}
		},
		render: function () {
			//console.log(app.test);
			//	app.test=1;
			//console.log('settC '+ this.props.rightPanel);

			return React.createElement(
				'div',
				{ className: 'sContainer', onTouchStart: this.handleTouchStart, onTouchMove: this.handleTouchMove, onTouchEnd: this.handleTouchEnd },
				React.createElement(SettingsList, { activeLink: this.state.settings, updateAct: this.updateActive, classes: this.state.classes }),
				React.createElement(this.props.rightPanel, { tabs: this.state.setTabs, classes: this.state.classes, updateAct: this.updateActive })
			);
		}

	});
});