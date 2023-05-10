define(["react", "app"], function (React, app) {
    return React.createClass({
        componentWillUnmount: function () {},
        componentDidMount: function () {
            //this.handleClick('SubmitPass');
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            //app.user.set({id:10});
            switch (action) {
                case "Ok":
                    $("#infoModal").modal("hide");
                    break;
            }
        },
        render: function () {
            return (
                <div className="modal fade app-smodal" id="infoModal">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4
                                    className="modal-title"
                                    id="infoModHead"
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
                            <div className="row">
                                <div className="modal-body">
                                    <div className="icon-wrapper">
                                        <div className="icon-background">
                                            <img
                                                src="/images/file-uploading-pop.png"
                                                alt="password icon"
                                            />
                                        </div>
                                    </div>
                                    <h2 id="infoModHeader">
                                        We're uploading your file...
                                    </h2>
                                    <p id="infoModBody"></p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="dark-btn w-100 py-2"
                                        onClick={this.handleClick.bind(
                                            this,
                                            "Ok"
                                        )}
                                    >
                                        GOT IT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});
