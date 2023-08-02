define(["react"], function (React) {
    return React.createClass({
        /**
         *
         * @param {string} action
         * @param {object} event
         */
        handleClick: function (action, event) {
            switch (action) {
                case "reportBug":
                    //requestInvitiation()
                    console.log("ffff");

                    break;
                case "enterReportBug":
                    if (event.keyCode == 13) {
                        //requestInvitiation();
                    }
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
                null,
                React.createElement(
                    "h1",
                    null,
                    "Contact us"
                ),
                React.createElement(
                    "p",
                    null,
                    "Please provide the email address so we can contact you"
                ),
                React.createElement(
                    "div",
                    { className: "form-section" },
                    React.createElement(
                        "form",
                        {
                            className: "registration-form smart-form",
                            id: "report-form",
                            action: "api/submitBug",
                            method: "POST",
                            target: "_blank"
                        },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-sm-12" },
                                React.createElement(
                                    "div",
                                    { className: "form-group" },
                                    React.createElement("input", {
                                        className: "hidden",
                                        type: "name",
                                        name: "name",
                                        placeholder: "name",
                                        id: "hname"
                                    }),
                                    React.createElement("input", {
                                        type: "email",
                                        name: "email",
                                        className: "form-control",
                                        placeholder: "Enter your email address"
                                    })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-sm-12" },
                                React.createElement(
                                    "div",
                                    { className: "form-group" },
                                    React.createElement("textarea", {
                                        className: "form-control",
                                        rows: "5",
                                        name: "comment",
                                        placeholder: "Let's talk..."
                                    }),
                                    React.createElement(
                                        "span",
                                        { className: "" },
                                        React.createElement(
                                            "span",
                                            { id: "character_count" },
                                            "800"
                                        ),
                                        " ",
                                        "Character left"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-sm-12" },
                                React.createElement(
                                    "button",
                                    {
                                        className: "btn-blue fixed-width",
                                        type: "submit"
                                    },
                                    "Send Message"
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});