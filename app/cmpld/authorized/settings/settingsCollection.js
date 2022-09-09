define(['react', 'app', 'cmpld/authorized/settings/leftmenu/settingsList'], function (React, app, SettingsList) {
	return React.createClass({
		mixins: [app.mixins.touchMixins()],
		getInitialState: function () {
			return {
				settings: {
					profile: 'active',
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
					blackList: '',
					adminPanel: ''
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
		resetActive: (thisComp, callback) => {
			thisComp.setState({
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
					blackList: '',
					adminPanel: ''
				}
			}, () => {
				callback();
			});
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

		setActive: (thisComp, page) => {
			thisComp.resetActive(thisComp, function () {
				thisComp.state.settings[page] = 'active';
			});
		},
		updateActive: function (page) {
			var thisComp = this;
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
					thisComp.setActive(thisComp, 'profile');

					break;
				case 'Layout':
					thisComp.setActive(thisComp, 'layout');
					break;

				case 'Password':
					thisComp.setActive(thisComp, 'password');
					break;
				case 'Disposable-Aliases':
					thisComp.setActive(thisComp, 'disposable');

					break;
				case 'Custom-Domain':
					thisComp.setActive(thisComp, 'domain');
					break;
				case '2-Step':
					thisComp.setActive(thisComp, 'auth');
					break;
				case 'Contacts':
					thisComp.setActive(thisComp, 'contacts');
					break;
				case 'WebDiv':
					thisComp.setActive(thisComp, 'webdiv');
					break;
				case 'PGP-Keys':
					thisComp.setActive(thisComp, 'pgp');
					break;

				case 'Filter':
					thisComp.setActive(thisComp, 'spam');
					break;
				case 'BlackList':
					thisComp.setActive(thisComp, 'blackList');
					break;
				case 'AdminPanel':
					thisComp.setActive(thisComp, 'adminPanel');
					break;

				case 'Coupon':
					thisComp.setActive(thisComp, 'coupon');
					break;

				case 'Folders':
					thisComp.setActive(thisComp, 'folders');
					break;

				case 'Security-Log':
					thisComp.setActive(thisComp, 'security');

					break;
				case 'Plan':
					thisComp.setActive(thisComp, 'plan');
					break;

				case 'Delete-Account':
					thisComp.setActive(thisComp, 'delete');
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