define(["react", "app"], function (React, app) {
    return React.createClass({
        componentDidMount: function () {
            $("#dialogPop").on("hide.bs.modal", function (event) {
                $("#dialogOk").off("click");
            });
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "cancel":
                    $("#dialogPop").modal("hide");
                    break;
            }
        },

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return (
                <div className="modal fade app-smodal" id="dialogPop">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    className="modal-title"
                                    id="dialogModHead"
                                ></h4>
                                <button
                                    type="button"
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
                                            src="/images/delete-pop.png"
                                            alt="delete icon"
                                        />
                                    </div>
                                </div>
                                <h2 id="dialogModBodyHeading"></h2>
                                <p id="dialogModBody"></p>
                            </div>
                            <div className="modal-footer" id="popBut">
                                <button
                                    type="button"
                                    className="dark-btn"
                                    id="dialogOk"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    type="button"
                                    className="white-btn"
                                    id="dialogCancel"
                                    onClick={this.handleClick.bind(
                                        this,
                                        "cancel"
                                    )}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
