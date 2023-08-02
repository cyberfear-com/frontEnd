define(["react", "app", "cmpld/authorized/settings/leftmenu/settingsList"], function (React, app, SettingsList) {
    return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState: function () {
            return {
                settings: {
                    profile: "active",
                    coupon: "",
                    layout: "",
                    password: "",
                    aliases: "",
                    disposable: "",
                    domain: "",
                    auth: "",
                    contacts: "",
                    webdiv: "",
                    pgp: "",
                    spam: "",
                    folders: "",
                    security: "",
                    plan: "",
                    delete: "",
                    blackList: "",
                    adminPanel: "",
                    sessionTimeout: ""
                },
                setTabs: {
                    Header: "panel-title personal-info-title d-none-xs",
                    HeaderXS: "panel-title personal-info-title settings-tab-xs d-block-xs"
                },
                classes: {
                    rightClass: "",
                    classActSettSelect: "col-xs-12 col-lg-6",
                    leftClass: "left-side left-setting no-cta"
                }
            };
        },
        resetActive: (thisComp, callback) => {
            thisComp.setState({
                settings: {
                    profile: "",
                    coupon: "",
                    layout: "",
                    password: "",
                    aliases: "",
                    disposable: "",
                    domain: "",
                    auth: "",
                    contacts: "",
                    webdiv: "",
                    pgp: "",
                    spam: "",
                    folders: "",
                    security: "",
                    plan: "",
                    delete: "",
                    blackList: "",
                    adminPanel: "",
                    sessionTimeout: ""
                }
            }, () => {
                callback();
            });
        },

        componentDidMount: function () {
            var thisComp = this;
            app.mixins.on("change", function () {
                if (app.mixins.get("slide") == "right") {
                    thisComp.setState({
                        classes: {
                            rightClass: "",
                            classActSettSelect: thisComp.state.classes.classActSettSelect,
                            leftClass: "left-side left-setting no-cta"
                        }
                    });
                }
            }.bind(this));
        },
        componentWillUnmount: function () {
            app.mixins.off("change");
        },

        setActive: (thisComp, page) => {
            thisComp.resetActive(thisComp, function () {
                thisComp.state.settings[page] = "active";
            });
        },
        updateActive: function (page) {
            var thisComp = this;

            app.mixins.set({
                slide: "",
                startPositionX: 0,
                lastPositionX: 0
            });

            switch (page) {
                case "Profile":
                    thisComp.setActive(thisComp, "profile");

                    break;
                case "Layout":
                    thisComp.setActive(thisComp, "layout");
                    break;

                case "Password":
                    thisComp.setActive(thisComp, "password");
                    break;
                case "Aliases":
                    thisComp.setActive(thisComp, "aliases");
                    break;
                case "Session-Timeout":
                    thisComp.setActive(thisComp, "sessionTimeout");
                    break;
                case "Disposable-Aliases":
                    thisComp.setActive(thisComp, "disposable");

                    break;
                case "Custom-Domain":
                    thisComp.setActive(thisComp, "domain");
                    break;
                case "2-Step":
                    thisComp.setActive(thisComp, "auth");
                    break;
                case "Contacts":
                    thisComp.setActive(thisComp, "contacts");
                    break;
                case "WebDiv":
                    thisComp.setActive(thisComp, "webdiv");
                    break;
                case "PGP-Keys":
                    thisComp.setActive(thisComp, "pgp");
                    break;

                case "Filter":
                    thisComp.setActive(thisComp, "spam");
                    break;
                case "BlackList":
                    thisComp.setActive(thisComp, "blackList");
                    break;
                case "AdminPanel":
                    thisComp.setActive(thisComp, "adminPanel");
                    break;

                case "Coupon":
                    thisComp.setActive(thisComp, "coupon");
                    break;

                case "Folders":
                    thisComp.setActive(thisComp, "folders");
                    break;

                case "Security-Log":
                    thisComp.setActive(thisComp, "security");

                    break;
                case "Plan":
                    thisComp.setActive(thisComp, "plan");
                    break;

                case "Delete-Account":
                    thisComp.setActive(thisComp, "delete");
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                {
                    className: "sContainer",
                    onTouchStart: this.handleTouchStart,
                    onTouchMove: this.handleTouchMove,
                    onTouchEnd: this.handleTouchEnd
                },
                React.createElement(SettingsList, {
                    activeLink: this.state.settings,
                    updateAct: this.updateActive,
                    classes: this.state.classes
                }),
                React.createElement(this.props.rightPanel, {
                    tabs: this.state.setTabs,
                    classes: this.state.classes,
                    updateAct: this.updateActive
                })
            );
        }
    });
});