define(["react", "app"], function (React, app) {
    return React.createClass({
        getInitialState: function () {
            return {
                active: true
            };
        },
        componentDidMount: function () {
            const timer = setTimeout(() => {
                this.setState({
                    active: false
                });
            }, 1500);
        },
        render: function () {
            return React.createElement(
                "div",
                {
                    className: `in-working popup d-none`,
                    id: "settings-spinner"
                },
                React.createElement(
                    "div",
                    { className: "wrapper" },
                    React.createElement(
                        "div",
                        { className: "inner" },
                        React.createElement(
                            "div",
                            { className: "content" },
                            React.createElement(
                                "div",
                                { className: "t-animation" },
                                React.createElement(
                                    "div",
                                    { className: "loading-animation type-progress style-circle" },
                                    React.createElement(
                                        "div",
                                        { className: "progress-circle medium" },
                                        React.createElement(
                                            "div",
                                            { className: "circle-bg" },
                                            React.createElement("img", {
                                                src: "/images/loading-circle.svg",
                                                alt: "loading-circle",
                                                style: {
                                                    width: "91px",
                                                    height: "91px"
                                                }
                                            })
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "circle-content" },
                                            React.createElement(
                                                "div",
                                                { className: "loading-spinner" },
                                                React.createElement(
                                                    "div",
                                                    { className: "the-spinner" },
                                                    React.createElement("div", { className: "_bar1" }),
                                                    React.createElement("div", { className: "_bar2" }),
                                                    React.createElement("div", { className: "_bar3" }),
                                                    React.createElement("div", { className: "_bar4" }),
                                                    React.createElement("div", { className: "_bar5" }),
                                                    React.createElement("div", { className: "_bar6" }),
                                                    React.createElement("div", { className: "_bar7" }),
                                                    React.createElement("div", { className: "_bar8" })
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "t-text" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Processing..."
                                ),
                                React.createElement(
                                    "h6",
                                    null,
                                    "Please wait while we set things up for you."
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});