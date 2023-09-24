define(["react", "app"], function (React, app) {
    return React.createClass({
        componentDidMount: function () {
            $("#askforPass").on("shown.bs.modal", function () {
                $("#askPasInput").focus();
                //$( "#askPasSub" ).trigger( "click" ); //todo remove for dev
            });
            $("#askPasInput").val(app.defaults.get("secondPassfield"));

            $("#askforPass").on("hide.bs.modal", function (event) {
                //console.log('off');
                $("#askPasSub").off("click");
                $("#passLabel").addClass("d-none");
                $("#passLabel").removeClass("invalid-feedback");
                $("#passLabel").html("");
                $("#askPasInput").val('');

            });
            //$('#askPasInput').focus();
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            //app.user.set({id:10});
            switch (action) {
                case "cancel":
                    $("#askforPass").modal("hide");
                    break;
                case "enterPass":
                    if (event.keyCode == 13) {
                        $("#askPasSub").trigger("click");
                    }

                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return (
                <div
                    className="modal fade app-smodal"
                    id="askforPass"
                    data-bs-backdrop="static"
                    onKeyDown={this.handleClick.bind(this, "enterPass")}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="dialogModHead">
                                    Provide Password
                                </h4>
                                <button
                                    type="button"
                                    id="askPassClose"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 1L11 11M11 1L1 11"
                                            stroke="black"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="icon-wrapper">
                                    <div className="icon-background">
                                        <img
                                            src="/images/password-pop.png"
                                            alt="password icon"
                                        />
                                    </div>
                                </div>
                                <h2 id="askPassHeader">Provide Password</h2>
                                <div id="infoPass">
                                </div>
                            </div>

                            <div className="modal-footer">
                                <div className="form-group">
                                    <input
                                        type="password"
                                        id="askPasInput"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter Password.."
                                    />
                                    <label
                                        id="passLabel"
                                        className="control-label pull-left d-none"

                                        htmlFor="password"
                                    >
                                    </label>
                                    <span className="input-icon">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.5">
                                                <path
                                                    d="M13.6868 7.8735V6.08424C13.6868 3.98996 11.9884 2.29154 9.89427 2.29154C7.8001 2.28237 6.0951 3.97246 6.08594 6.06757V6.08424V7.8735"
                                                    stroke="#415067"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M13.0666 17.7089H6.69906C4.95406 17.7089 3.53906 16.2947 3.53906 14.5487V10.9744C3.53906 9.22845 4.95406 7.81421 6.69906 7.81421H13.0666C14.8116 7.81421 16.2266 9.22845 16.2266 10.9744V14.5487C16.2266 16.2947 14.8116 17.7089 13.0666 17.7089Z"
                                                    stroke="#415067"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M9.88542 11.8362V13.6871"
                                                    stroke="#415067"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="dark-btn w-100"
                                    autoFocus
                                    id="askPasSub"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
