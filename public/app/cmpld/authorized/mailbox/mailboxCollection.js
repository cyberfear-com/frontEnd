define(["react", "app", "cmpld/authorized/mailbox/leftpanel/folderList", "cmpld/authorized/mailbox/middlepanel/emailList", "cmpld/authorized/mailbox/rightpanel/emailRead", "cmpld/authorized/header/head", "cmpld/authorized/canvas/canvasCollection", "cmpld/authorized/mailbox/rightpanel/composeEmail"], function (React, app, FolderList, EmailList, EmailRead, Header, Canvas, ComposeEmail) {
    return React.createClass({
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(Canvas, null),
                React.createElement(Header, { changeFodlerId: this.changeFodlerId }),
                React.createElement(FolderList, {
                    activePage: this.props.activePage,
                    changeFodlerId: this.props.changeFodlerId,
                    panel: this.state,
                    updateValue: this.updateValue,
                    resetClasses: this.resetClases
                }),
                React.createElement(EmailList, {
                    folderId: this.props.folderId,
                    panel: this.state,
                    updateValue: this.updateValue,
                    resetClasses: this.resetClases
                }),
                app.user.get("isComposingEmail") ? React.createElement(ComposeEmail, { panel: this.state }) : null,
                React.createElement(EmailRead, {
                    panel: this.state,
                    updateValue: this.updateValue,
                    resetClasses: this.resetClases
                })
            );
        }
    });
});