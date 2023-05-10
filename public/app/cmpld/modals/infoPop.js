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
            return React.createElement(
                "div",
                { className: "modal fade app-smodal", id: "infoModal" },
                React.createElement(
                    "div",
                    { className: "modal-dialog modal-dialog-centered" },
                    React.createElement(
                        "div",
                        { className: "modal-content" },
                        React.createElement(
                            "div",
                            { className: "modal-header" },
                            React.createElement("h4", {
                                className: "modal-title",
                                id: "infoModHead"
                            }),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "btn-close",
                                    "data-bs-dismiss": "modal",
                                    "aria-label": "Close"
                                },
                                React.createElement(
                                    "svg",
                                    {
                                        width: "12",
                                        height: "12",
                                        viewBox: "0 0 12 12",
                                        fill: "none",
                                        xmlns: "http://www.w3.org/2000/svg"
                                    },
                                    React.createElement("path", {
                                        d: "M1 1L11 11M11 1L1 11",
                                        stroke: "black",
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round"
                                    })
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "modal-body" },
                                React.createElement(
                                    "div",
                                    { className: "icon-wrapper" },
                                    React.createElement(
                                        "div",
                                        { className: "icon-background" },
                                        React.createElement("img", {
                                            src: "/images/file-uploading-pop.png",
                                            alt: "password icon"
                                        })
                                    )
                                ),
                                React.createElement(
                                    "h2",
                                    { id: "infoModHeader" },
                                    "We're uploading your file..."
                                ),
                                React.createElement("p", { id: "infoModBody" })
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "dark-btn w-100 py-2",
                                        onClick: this.handleClick.bind(this, "Ok")
                                    },
                                    "GOT IT"
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});