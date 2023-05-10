define(["react", "app"], function (React, app) {
    return React.createClass({
        componentWillUnmount: function () {},
        componentDidMount: function () {
            app.userObjects.on("change", function () {
                this.forceUpdate();
            }.bind(this));
        },

        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {},

        /**
         *
         * @returns {JSX}
         */
        render: function () {
            return React.createElement(
                "div",
                {
                    className: "modal fade",
                    id: "userObjSync",
                    "data-bs-backdrop": "static",
                    "data-bs-keyboard": "false",
                    tabindex: "-1",
                    "aria-labelledby": "staticBackdropLabel",
                    "aria-hidden": "true"
                },
                React.createElement(
                    "div",
                    { className: "modal-dialog modal-dialog-centered" },
                    React.createElement(
                        "div",
                        { className: "modal-content" },
                        React.createElement("div", { className: "modal-header p-4" }),
                        React.createElement(
                            "div",
                            { className: "modal-body p-4" },
                            React.createElement(
                                "div",
                                { className: "loading-animation type-progress style-circle" },
                                React.createElement(
                                    "div",
                                    { className: "progress-circle" },
                                    React.createElement(
                                        "div",
                                        { className: "circle-bg" },
                                        React.createElement(
                                            "svg",
                                            {
                                                role: "progressbar",
                                                width: "140",
                                                height: "140",
                                                viewBox: "0 0 100 100",
                                                "aria-valuemin": "0",
                                                "aria-valuemax": "100",
                                                "aria-valuenow": "50"
                                            },
                                            React.createElement("circle", {
                                                cx: "50%",
                                                cy: "50%",
                                                r: "42",
                                                shapeRendering: "geometricPrecision",
                                                fill: "none",
                                                stroke: "#E1E4EC",
                                                strokeWidth: "1"
                                            }),
                                            React.createElement("circle", {
                                                id: "the_circle_progress",
                                                cx: "50%",
                                                cy: "50%",
                                                r: "42",
                                                shapeRendering: "geometricPrecision",
                                                fill: "none",
                                                strokeWidth: "1",
                                                strokeLinecap: "",
                                                stroke: "#2277f6",
                                                dataAngel: "50",
                                                style: {
                                                    strokeDasharray: "264",
                                                    strokeDashoffset: `${ 264 - parseInt(264 * app.userObjects.get("modalpercentage") / 100) }`
                                                }
                                            })
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "circle-content" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "32",
                                                height: "33",
                                                viewBox: "0 0 32 33",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", {
                                                d: "M16.2745 0.64386C7.30038 0.64386 0.714844 5.06401 0.714844 5.06401C0.714844 13.7095 4.91569 20.6867 8.95191 25.3956C10.6883 24.0862 12.1842 22.7672 13.4672 21.4719C10.716 18.2537 7.88883 13.8246 6.98332 8.54008C9.18794 7.62106 12.4711 6.61458 16.2738 6.61458C20.0521 6.61458 23.3436 7.62556 25.563 8.54972C24.3861 15.4002 19.9814 20.8134 16.7009 24.0103C15.2931 25.4637 13.6615 26.9371 11.772 28.3887C14.3065 30.8409 16.2738 32.1644 16.2738 32.1644C16.2738 32.1644 31.8334 21.7021 31.8334 5.06337C31.8341 5.06402 25.2486 0.64386 16.2745 0.64386Z",
                                                fill: "white"
                                            })
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "div",
                                    {
                                        className: "bs-example text-center",
                                        "data-example-id": "progress-bar-with-label"
                                    },
                                    React.createElement(
                                        "h4",
                                        {
                                            className: "modal-title",
                                            id: "userSyncTitle"
                                        },
                                        "We're setting up your mailbox..."
                                    ),
                                    React.createElement(
                                        "div",
                                        null,
                                        app.userObjects.get("modalpercentage"),
                                        "%"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});