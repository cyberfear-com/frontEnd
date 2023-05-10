define([
    "react",
    "app",
    "accounting",
    "cmpld/authorized/settings/rightpanel/rightTop",
], function (React, app, accounting, RightTop) {
    "use strict";
    return React.createClass({
        getInitialState: function () {
            return {
                lockEmail: true,
            };
        },

        /**
         *
         * @param {string} action
         */
        handleClick: function (action) {
            switch (action) {
                case "deleteAccount":
                    var thisComp = this;
                    $("#dialogModHead").html("Delete");
                    $("#dialogModBody").html(
                        "This action is permanent. Do you want to continue?"
                    );
                    $("#dialogOk").on("click", function () {
                        $("#dialogPop").modal("hide");

                        $("#userSyncTitle").html("Deleting Account");
                        app.userObjects.set({ modalText: "Preparing" });
                        app.userObjects.set({ modalpercentage: 5 });

                        app.userObjects.deletingAccount(
                            thisComp.state.lockEmail,
                            function (result) {
                                $("#userObjSync").modal("hide");

                                if (result["response"] == "success") {
                                    app.userObjects.set({
                                        modalText: "Removed",
                                    });
                                    app.userObjects.set({
                                        modalpercentage: 100,
                                    });

                                    $("#dialogModBody").html(
                                        "Your Account has been marked for deletion. It may take up to 7 days to be removed from our system and backup. Good Bye."
                                    );
                                    $("#dialogOk").on("click", function () {
                                        setTimeout(function () {
                                            app.auth.logout();
                                        }, 500);
                                    });

                                    $("#dialogPop").modal("show");
                                } else {
                                    $("#dialogModBody").html(
                                        "We were unable to remove your account. Please contact us for further assistance"
                                    );
                                    $("#dialogOk").on("click", function () {
                                        $("#dialogPop").modal("hide");
                                        //$('#dialogPop').modal('hide');
                                        //$('#reportBug-modal').modal('show');
                                    });

                                    $("#dialogPop").modal("show");
                                }
                            }
                        );

                        $("#userObjSync").modal({
                            backdrop: "static",
                            keyboard: true,
                        });
                    });
                    $("#dialogPop").modal("show");
                    break;
            }
        },
        render: function () {
            var rightClass = "Right col-xs-10 sRight";

            return (
                <div id="rightSettingPanel">
                    <div className="setting-middle delete-account">
                        <div className="middle-top">
                            <h2>Profile</h2>
                        </div>
                        <div className="middle-content red-border">
                            <div className="middle-content-top with-stacked">
                                <h3>Delete Account</h3>
                                <p>
                                    All data including: emails, history of your
                                    account will be permanently destroyed. You
                                    will lose access and ability to receive new
                                    emails.
                                </p>
                                <p>
                                    Available balace will be lost, as any record
                                    regarding your account will be destroyed.
                                    All existing email addresses will be held
                                    for retention to protect your privacy and
                                    prevent someone registering same email and
                                    receiving emails that may be addressed to
                                    you.
                                </p>
                                <div className="btn-row">
                                    <button
                                        type="button"
                                        className="btn-red fixed-width-btn"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "deleteAccount"
                                        )}
                                    >
                                        Delete account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-right delete-account">
                        <RightTop />
                    </div>
                </div>
            );
        },
    });
});
