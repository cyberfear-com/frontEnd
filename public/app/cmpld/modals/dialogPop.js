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
            return React.createElement(
                "div",
                { className: "modal fade app-smodal", id: "dialogPop" },
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
                                id: "dialogModHead"
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
                            { className: "modal-body" },
                            React.createElement(
                                "div",
                                { className: "icon-wrapper" },
                                React.createElement(
                                    "div",
                                    { className: "icon-background" },
                                    React.createElement("img", {
                                        src: "/images/delete-pop.png",
                                        alt: "delete icon"
                                    })
                                )
                            ),
                            React.createElement("h2", { id: "dialogModBodyHeading" }),
                            React.createElement("p", { id: "dialogModBody" })
                        ),
                        React.createElement(
                            "div",
                            { className: "modal-footer", id: "popBut" },
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "dark-btn",
                                    id: "dialogOk"
                                },
                                "Yes, Delete"
                            ),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "white-btn",
                                    id: "dialogCancel",
                                    onClick: this.handleClick.bind(this, "cancel")
                                },
                                "Cancel"
                            )
                        )
                    )
                )
            );
        }
    });
});