define(["react", "app"], function (React, app) {
    return React.createClass({
        render: function () {
            return React.createElement(
                "div",
                { className: `app-notification type-1 active` },
                React.createElement(
                    "div",
                    { className: "_inside" },
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "_header d-flex justify-content-between" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "h5",
                                    { className: "_title" },
                                    `Notifications`
                                )
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "button",
                                    {
                                        type: "button",
                                        className: "_highlight"
                                    },
                                    React.createElement(
                                        "span",
                                        { className: "_icon" },
                                        React.createElement(
                                            "svg",
                                            {
                                                width: "9",
                                                height: "8",
                                                viewBox: "0 0 9 8",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg"
                                            },
                                            React.createElement("path", {
                                                d: "M1 3.99995L3.37117 6.37295L8.11153 1.62695",
                                                stroke: "#2277F6",
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            })
                                        )
                                    ),
                                    `Mark all as read`
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "_filter_wrap" },
                            React.createElement(
                                "div",
                                { className: "_filter" },
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        { className: "_active" },
                                        React.createElement(
                                            "button",
                                            { type: "button" },
                                            `All`,
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "_count" },
                                                "32"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "button",
                                            { type: "button" },
                                            `System`,
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "_count" },
                                                "5"
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "button",
                                            { type: "button" },
                                            `Starred`,
                                            " ",
                                            React.createElement(
                                                "span",
                                                { className: "_count" },
                                                "1"
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "button",
                                    null,
                                    React.createElement(
                                        "svg",
                                        {
                                            width: "24",
                                            height: "24",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg"
                                        },
                                        React.createElement(
                                            "g",
                                            { opacity: "0.8" },
                                            React.createElement("path", {
                                                d: "M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z",
                                                stroke: "#415067",
                                                strokeWidth: "1.5",
                                                strokeMiterlimit: "10",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }),
                                            React.createElement("path", {
                                                d: "M3.66675 12.7334V11.2667C3.66675 10.4 4.37508 9.68336 5.25008 9.68336C6.75841 9.68336 7.37508 8.6167 6.61675 7.30836C6.18341 6.55836 6.44175 5.58336 7.20008 5.15003L8.64175 4.32503C9.30008 3.93336 10.1501 4.1667 10.5417 4.82503L10.6334 4.98336C11.3834 6.2917 12.6167 6.2917 13.3751 4.98336L13.4667 4.82503C13.8584 4.1667 14.7084 3.93336 15.3667 4.32503L16.8084 5.15003C17.5667 5.58336 17.8251 6.55836 17.3917 7.30836C16.6334 8.6167 17.2501 9.68336 18.7584 9.68336C19.6251 9.68336 20.3417 10.3917 20.3417 11.2667V12.7334C20.3417 13.6 19.6334 14.3167 18.7584 14.3167C17.2501 14.3167 16.6334 15.3834 17.3917 16.6917C17.8251 17.45 17.5667 18.4167 16.8084 18.85L15.3667 19.675C14.7084 20.0667 13.8584 19.8334 13.4667 19.175L13.3751 19.0167C12.6251 17.7084 11.3917 17.7084 10.6334 19.0167L10.5417 19.175C10.1501 19.8334 9.30008 20.0667 8.64175 19.675L7.20008 18.85C6.44175 18.4167 6.18341 17.4417 6.61675 16.6917C7.37508 15.3834 6.75841 14.3167 5.25008 14.3167C4.37508 14.3167 3.66675 13.6 3.66675 12.7334Z",
                                                stroke: "#415067",
                                                strokeWidth: "1.5",
                                                strokeMiterlimit: "10",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            })
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "_content" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "_enable_notification" },
                                    React.createElement(
                                        "p",
                                        null,
                                        React.createElement(
                                            "span",
                                            { className: "_icon" },
                                            React.createElement(
                                                "svg",
                                                {
                                                    width: "22",
                                                    height: "22",
                                                    viewBox: "0 0 22 22",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg"
                                                },
                                                React.createElement("path", {
                                                    fillRule: "evenodd",
                                                    clipRule: "evenodd",
                                                    d: "M11 2.0625C7.51115 2.0625 4.56831 4.66039 4.13558 8.12226L3.22907 15.3743C3.04788 16.8238 4.17813 18.1042 5.63893 18.1042H6.88651L6.93449 18.2121C7.64855 19.8188 9.2418 20.8542 11 20.8542C12.7581 20.8542 14.3514 19.8188 15.0654 18.2121L15.1134 18.1042H16.361C17.8218 18.1042 18.952 16.8238 18.7709 15.3743L17.8643 8.12225C17.4316 4.66039 14.4888 2.0625 11 2.0625ZM14.6823 16.7292C14.6721 16.7289 14.6619 16.7289 14.6517 16.7292H7.34823C7.33804 16.7289 7.32783 16.7289 7.31761 16.7292H5.63893C5.00518 16.7292 4.51485 16.1737 4.59345 15.5449L5.49996 8.29281C5.84669 5.51903 8.2046 3.4375 11 3.4375C13.7953 3.4375 16.1532 5.51902 16.5 8.2928L17.4065 15.5449C17.4851 16.1737 16.9947 16.7292 16.361 16.7292H14.6823ZM8.43807 18.1042H13.5619C12.9989 18.9535 12.0413 19.4792 11 19.4792C9.95866 19.4792 9.00107 18.9535 8.43807 18.1042Z",
                                                    fill: "#2277F6"
                                                })
                                            )
                                        ),
                                        `Push Notifications`
                                    ),
                                    React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                            "button",
                                            { type: "button" },
                                            React.createElement(
                                                "svg",
                                                {
                                                    width: "40",
                                                    height: "20",
                                                    viewBox: "0 0 40 20",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg"
                                                },
                                                React.createElement("rect", {
                                                    width: "40",
                                                    height: "20",
                                                    rx: "10",
                                                    fill: "#2277F6"
                                                }),
                                                React.createElement("rect", {
                                                    x: "38",
                                                    y: "2",
                                                    width: "16",
                                                    height: "16",
                                                    rx: "8",
                                                    transform: "rotate(90 38 2)",
                                                    fill: "white"
                                                })
                                            )
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "_items_wrapper" },
                                React.createElement(
                                    "div",
                                    { className: "_items" },
                                    React.createElement(
                                        "div",
                                        { className: "_item" },
                                        React.createElement(
                                            "div",
                                            { className: "_c_inner" },
                                            React.createElement(
                                                "div",
                                                { className: "_icon _system" },
                                                React.createElement(
                                                    "svg",
                                                    {
                                                        width: "24",
                                                        height: "24",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg"
                                                    },
                                                    React.createElement("path", {
                                                        d: "M20.1 9.21994C18.29 9.21994 17.55 7.93994 18.45 6.36994C18.97 5.45994 18.66 4.29994 17.75 3.77994L16.02 2.78994C15.23 2.31994 14.21 2.59994 13.74 3.38994L13.63 3.57994C12.73 5.14994 11.25 5.14994 10.34 3.57994L10.23 3.38994C9.78 2.59994 8.76 2.31994 7.97 2.78994L6.24 3.77994C5.33 4.29994 5.02 5.46994 5.54 6.37994C6.45 7.93994 5.71 9.21994 3.9 9.21994C2.86 9.21994 2 10.0699 2 11.1199V12.8799C2 13.9199 2.85 14.7799 3.9 14.7799C5.71 14.7799 6.45 16.0599 5.54 17.6299C5.02 18.5399 5.33 19.6999 6.24 20.2199L7.97 21.2099C8.76 21.6799 9.78 21.3999 10.25 20.6099L10.36 20.4199C11.26 18.8499 12.74 18.8499 13.65 20.4199L13.76 20.6099C14.23 21.3999 15.25 21.6799 16.04 21.2099L17.77 20.2199C18.68 19.6999 18.99 18.5299 18.47 17.6299C17.56 16.0599 18.3 14.7799 20.11 14.7799C21.15 14.7799 22.01 13.9299 22.01 12.8799V11.1199C22 10.0799 21.15 9.21994 20.1 9.21994ZM12 15.2499C10.21 15.2499 8.75 13.7899 8.75 11.9999C8.75 10.2099 10.21 8.74994 12 8.74994C13.79 8.74994 15.25 10.2099 15.25 11.9999C15.25 13.7899 13.79 15.2499 12 15.2499Z",
                                                        fill: "white"
                                                    })
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_details" },
                                                React.createElement(
                                                    "h6",
                                                    { className: "_title" },
                                                    `Your password has been successfully changed.`
                                                ),
                                                React.createElement(
                                                    "p",
                                                    { className: "_desc" },
                                                    `for more details, please check`,
                                                    " ",
                                                    React.createElement(
                                                        "a",
                                                        { href: "#" },
                                                        "here"
                                                    ),
                                                    "."
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_meta" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `23 mins ago`
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_close" },
                                                React.createElement(
                                                    "button",
                                                    { type: "button" },
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            width: "16",
                                                            height: "16",
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement(
                                                            "g",
                                                            { opacity: "0.5" },
                                                            React.createElement("path", {
                                                                d: "M4 4L12 12M12 4L4 12",
                                                                stroke: "#677385",
                                                                strokeLinecap: "round"
                                                            })
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "_item" },
                                        React.createElement(
                                            "div",
                                            { className: "_c_inner" },
                                            React.createElement(
                                                "div",
                                                { className: "_icon _w_initial _w_star" },
                                                React.createElement(
                                                    "span",
                                                    { className: "_initials" },
                                                    "SG"
                                                ),
                                                React.createElement(
                                                    "span",
                                                    { className: "_starred" },
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
                                                            d: "M6.60789 3.00258L7.22476 4.23633C7.30789 4.40695 7.53101 4.56883 7.71914 4.60383L8.83476 4.78758C9.54789 4.9057 9.71414 5.42195 9.20226 5.9382L8.33164 6.80883C8.18726 6.9532 8.10414 7.23758 8.15226 7.4432L8.40164 8.51945C8.59851 9.3682 8.14351 9.7007 7.39539 9.25445L6.34976 8.6332C6.16164 8.51945 5.84664 8.51945 5.65851 8.6332L4.61289 9.25445C3.86476 9.69633 3.40976 9.3682 3.60664 8.51945L3.85601 7.4432C3.89539 7.2332 3.81226 6.94883 3.66789 6.80445L2.79726 5.93383C2.28539 5.42195 2.45164 4.9057 3.16476 4.7832L4.28039 4.59945C4.46851 4.56883 4.69164 4.40258 4.77476 4.23195L5.39164 2.9982C5.72851 2.3332 6.27101 2.3332 6.60789 3.00258Z",
                                                            fill: "#FFB13D"
                                                        })
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_details" },
                                                React.createElement(
                                                    "h6",
                                                    { className: "_title" },
                                                    `Jhosef Jones`,
                                                    " ",
                                                    React.createElement(
                                                        "span",
                                                        { "class": "_ins" },
                                                        `Assigned you on the call with Ada and Sarra.`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_meta" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `23 mins ago`
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `3 attachments`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_attachments _type_files" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "span",
                                                            { className: "_icon" },
                                                            React.createElement(
                                                                "svg",
                                                                {
                                                                    width: "20",
                                                                    height: "20",
                                                                    viewBox: "0 0 20 20",
                                                                    fill: "none",
                                                                    xmlns: "http://www.w3.org/2000/svg"
                                                                },
                                                                React.createElement("path", {
                                                                    fillRule: "evenodd",
                                                                    clipRule: "evenodd",
                                                                    d: "M6.66675 9.98879C6.66675 9.02985 7.44415 8.25248 8.40318 8.25248H10.1396V11.7253H8.40318C7.44417 11.7253 6.66675 10.9478 6.66675 9.98879ZM8.40318 7.63962H10.1396V4.16675H8.40318C7.44418 4.16675 6.66675 4.94418 6.66675 5.90318C6.66675 6.86219 7.44417 7.63962 8.40318 7.63962ZM14.2253 5.90318C14.2253 6.86219 13.4479 7.63962 12.4889 7.63962H10.7525V4.16675H12.4889C13.4479 4.16675 14.2253 4.94418 14.2253 5.90318ZM10.7525 9.98879C10.7525 9.02985 11.5299 8.25248 12.4889 8.25248C13.4479 8.25248 14.2253 9.02985 14.2253 9.98879C14.2253 10.9478 13.4479 11.7253 12.4889 11.7253C11.5299 11.7253 10.7525 10.9478 10.7525 9.98879ZM8.40318 12.3381H10.1396V14.0747C10.1396 15.0337 9.36219 15.8112 8.40318 15.8112C7.44418 15.8112 6.66675 15.0337 6.66675 14.0747C6.66675 13.1157 7.44422 12.3381 8.40318 12.3381Z",
                                                                    fill: "#415067"
                                                                })
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "span",
                                                            { className: "_label" },
                                                            "FinalFinal_app.fig"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "span",
                                                            { className: "_icon" },
                                                            React.createElement(
                                                                "svg",
                                                                {
                                                                    width: "20",
                                                                    height: "20",
                                                                    viewBox: "0 0 20 20",
                                                                    fill: "none",
                                                                    xmlns: "http://www.w3.org/2000/svg"
                                                                },
                                                                React.createElement("path", {
                                                                    d: "M9.54638 7.79638C9.61119 7.79638 9.61119 7.79638 9.54638 7.79638C9.61119 7.53712 9.67601 7.40749 9.67601 7.21304V7.08341C9.74082 6.75934 9.74082 6.50008 9.67601 6.43527C9.67601 6.43527 9.67601 6.43527 9.67601 6.37045L9.61119 6.30564C9.61119 6.30564 9.61119 6.37045 9.54638 6.37045C9.41675 6.75934 9.41675 7.21304 9.54638 7.79638ZM7.60193 12.2686C7.4723 12.3334 7.34267 12.3982 7.27786 12.463C6.82416 12.8519 6.50008 13.3056 6.43527 13.5001C6.82416 13.4353 7.21304 13.0464 7.60193 12.2686C7.66675 12.2686 7.66675 12.2686 7.60193 12.2686C7.66675 12.2686 7.60193 12.2686 7.60193 12.2686ZM13.5649 11.2964C13.5001 11.2316 13.2408 11.0371 12.3334 11.0371C12.2686 11.0371 12.2686 11.0371 12.2038 11.0371C12.2038 11.0371 12.2038 11.0371 12.2038 11.1019C12.6575 11.2964 13.1112 11.426 13.4353 11.426C13.5001 11.426 13.5001 11.426 13.5649 11.426H13.6297C13.6297 11.426 13.6297 11.426 13.6297 11.3612C13.6297 11.3612 13.5649 11.3612 13.5649 11.2964ZM14.5371 4.16675H5.46304C4.75008 4.16675 4.16675 4.75008 4.16675 5.46304V14.5371C4.16675 15.2501 4.75008 15.8334 5.46304 15.8334H14.5371C15.2501 15.8334 15.8334 15.2501 15.8334 14.5371V5.46304C15.8334 4.75008 15.2501 4.16675 14.5371 4.16675ZM13.8242 11.8149C13.6945 11.8797 13.5001 11.9445 13.2408 11.9445C12.7223 11.9445 11.9445 11.8149 11.2964 11.4908C10.1945 11.6205 9.35193 11.7501 8.70378 12.0093C8.63897 12.0093 8.63897 12.0093 8.57416 12.0741C7.79638 13.4353 7.14823 14.0834 6.62971 14.0834C6.50008 14.0834 6.43527 14.0834 6.37045 14.0186L6.04638 13.8242V13.7593C5.98156 13.6297 5.98156 13.5649 5.98156 13.4353C6.04638 13.1112 6.43527 12.5279 7.21304 12.0741C7.34267 12.0093 7.53712 11.8797 7.79638 11.7501C7.99082 11.426 8.18527 11.0371 8.44453 10.5834C8.7686 9.93527 8.96304 9.28712 9.15749 8.70378C8.89823 7.92601 8.7686 7.4723 9.02786 6.5649C9.09267 6.30564 9.28712 6.04638 9.54638 6.04638H9.67601C9.80564 6.04638 9.93527 6.11119 10.0649 6.17601C10.5186 6.62971 10.3242 7.66675 10.0649 8.50934C10.0649 8.57416 10.0649 8.57416 10.0649 8.57416C10.3242 9.28712 10.713 9.87045 11.1019 10.2593C11.2964 10.389 11.426 10.5186 11.6853 10.6482C12.0093 10.6482 12.2686 10.5834 12.5279 10.5834C13.3056 10.5834 13.8242 10.713 14.0186 11.0371C14.0834 11.1668 14.0834 11.2964 14.0834 11.426C14.0186 11.4908 13.9538 11.6853 13.8242 11.8149ZM9.61119 9.28712C9.48156 9.74082 9.2223 10.2593 8.96304 10.8427C8.83341 11.1019 8.70378 11.2964 8.57416 11.5556H8.63897H8.70378C9.54638 11.2316 10.3242 11.0371 10.8427 10.9723C10.713 10.9075 10.6482 10.8427 10.5834 10.7779C10.2593 10.389 9.87045 9.87045 9.61119 9.28712Z",
                                                                    fill: "#415067"
                                                                })
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "span",
                                                            { className: "_label" },
                                                            "FinalPresent.ppt"
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_attachments _type_files" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "span",
                                                            { className: "_icon" },
                                                            React.createElement(
                                                                "svg",
                                                                {
                                                                    width: "20",
                                                                    height: "20",
                                                                    viewBox: "0 0 20 20",
                                                                    fill: "none",
                                                                    xmlns: "http://www.w3.org/2000/svg"
                                                                },
                                                                React.createElement("path", {
                                                                    d: "M16.224 5.10468H10.4687V3.77656C10.4687 3.64463 10.4103 3.51979 10.3085 3.43567C10.2076 3.35156 10.0721 3.31525 9.94458 3.34182L2.86125 4.66994C2.65141 4.7089 2.5 4.8913 2.5 5.10468V14.8443C2.5 15.0568 2.65141 15.24 2.86125 15.279L9.94458 16.6071C9.97115 16.6124 9.99859 16.6151 10.026 16.6151C10.1287 16.6151 10.2288 16.5797 10.3085 16.5133C10.4103 16.4292 10.4687 16.3034 10.4687 16.1724V14.8443H16.224C16.4683 14.8443 16.6667 14.6459 16.6667 14.4016V5.54739C16.6667 5.30302 16.4683 5.10468 16.224 5.10468ZM8.69526 8.25234L8.25255 12.2376C8.22953 12.4404 8.07016 12.6024 7.8674 12.6272C7.8488 12.6298 7.83109 12.6307 7.8125 12.6307C7.6301 12.6307 7.46365 12.5174 7.39812 12.3438L6.48437 9.90718L5.57062 12.3438C5.49979 12.5333 5.31385 12.6493 5.10844 12.6281C4.90745 12.6068 4.7463 12.451 4.71797 12.25L4.27526 9.15104C4.24073 8.90932 4.40896 8.68531 4.65068 8.65078C4.89328 8.61536 5.11729 8.78447 5.15182 9.02619L5.34927 10.411L6.06911 8.49052C6.19839 8.1452 6.76859 8.1452 6.89875 8.49052L7.57698 10.2985L7.81516 8.15406C7.8426 7.91145 8.0675 7.73791 8.30391 7.76359C8.5474 7.79104 8.72182 8.00973 8.69526 8.25234ZM15.7812 13.9588H10.4687V13.0734H14.4531C14.6975 13.0734 14.8958 12.8751 14.8958 12.6307C14.8958 12.3863 14.6975 12.188 14.4531 12.188H10.4687V11.3026H14.4531C14.6975 11.3026 14.8958 11.1043 14.8958 10.8599C14.8958 10.6155 14.6975 10.4172 14.4531 10.4172H10.4687V9.53177H14.4531C14.6975 9.53177 14.8958 9.33343 14.8958 9.08906C14.8958 8.84468 14.6975 8.64635 14.4531 8.64635H10.4687V7.76093H14.4531C14.6975 7.76093 14.8958 7.5626 14.8958 7.31822C14.8958 7.07385 14.6975 6.87552 14.4531 6.87552H10.4687V5.9901H15.7812V13.9588Z",
                                                                    fill: "#415067"
                                                                })
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "span",
                                                            { className: "_label" },
                                                            "FinalFinalFinalFinal.doc"
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_close" },
                                                React.createElement(
                                                    "button",
                                                    { type: "button" },
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            width: "16",
                                                            height: "16",
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement(
                                                            "g",
                                                            { opacity: "0.5" },
                                                            React.createElement("path", {
                                                                d: "M4 4L12 12M12 4L4 12",
                                                                stroke: "#677385",
                                                                strokeLinecap: "round"
                                                            })
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "_item" },
                                        React.createElement(
                                            "div",
                                            { className: "_c_inner" },
                                            React.createElement(
                                                "div",
                                                { className: "_icon _w_image" },
                                                React.createElement("img", {
                                                    src: "/images/notification-user.png",
                                                    alt: ""
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_details" },
                                                React.createElement(
                                                    "h6",
                                                    { className: "_title" },
                                                    `Jhosef Jones`,
                                                    " ",
                                                    React.createElement(
                                                        "span",
                                                        { "class": "_ins" },
                                                        `Assigned you on the call with Ada and Sarra.`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_meta" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `2 hours ago`
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `15 attachments`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_attachments _type_images" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement("img", {
                                                            src: "/images/notification-image-1.png",
                                                            alt: "notification"
                                                        })
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement("img", {
                                                            src: "/images/notification-image-2.png",
                                                            alt: "notification"
                                                        })
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement("img", {
                                                            src: "/images/notification-image-3.png",
                                                            alt: "notification"
                                                        })
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        { className: "_action" },
                                                        React.createElement(
                                                            "button",
                                                            null,
                                                            "+12"
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_close" },
                                                React.createElement(
                                                    "button",
                                                    { type: "button" },
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            width: "16",
                                                            height: "16",
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement(
                                                            "g",
                                                            { opacity: "0.5" },
                                                            React.createElement("path", {
                                                                d: "M4 4L12 12M12 4L4 12",
                                                                stroke: "#677385",
                                                                strokeLinecap: "round"
                                                            })
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "_item" },
                                        React.createElement(
                                            "div",
                                            { className: "_c_inner" },
                                            React.createElement(
                                                "div",
                                                { className: "_icon _w_initial _w_star" },
                                                React.createElement("img", {
                                                    src: "/images/notification-user.png",
                                                    alt: ""
                                                }),
                                                React.createElement(
                                                    "span",
                                                    { className: "_starred" },
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
                                                            d: "M6.60789 3.00258L7.22476 4.23633C7.30789 4.40695 7.53101 4.56883 7.71914 4.60383L8.83476 4.78758C9.54789 4.9057 9.71414 5.42195 9.20226 5.9382L8.33164 6.80883C8.18726 6.9532 8.10414 7.23758 8.15226 7.4432L8.40164 8.51945C8.59851 9.3682 8.14351 9.7007 7.39539 9.25445L6.34976 8.6332C6.16164 8.51945 5.84664 8.51945 5.65851 8.6332L4.61289 9.25445C3.86476 9.69633 3.40976 9.3682 3.60664 8.51945L3.85601 7.4432C3.89539 7.2332 3.81226 6.94883 3.66789 6.80445L2.79726 5.93383C2.28539 5.42195 2.45164 4.9057 3.16476 4.7832L4.28039 4.59945C4.46851 4.56883 4.69164 4.40258 4.77476 4.23195L5.39164 2.9982C5.72851 2.3332 6.27101 2.3332 6.60789 3.00258Z",
                                                            fill: "#FFB13D"
                                                        })
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_details" },
                                                React.createElement(
                                                    "h6",
                                                    { className: "_title" },
                                                    `Jhosef Jones`,
                                                    " ",
                                                    React.createElement(
                                                        "span",
                                                        { "class": "_ins" },
                                                        `Assigned you on the call with Ada and Sarra.`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_meta" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `2 hours ago`
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `15 attachments`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_attachments _type_images" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement("img", {
                                                            src: "/images/notification-image-1.png",
                                                            alt: "notification"
                                                        })
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement("img", {
                                                            src: "/images/notification-image-2.png",
                                                            alt: "notification"
                                                        })
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement("img", {
                                                            src: "/images/notification-image-3.png",
                                                            alt: "notification"
                                                        })
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        { className: "_action" },
                                                        React.createElement(
                                                            "button",
                                                            null,
                                                            "+12"
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_close" },
                                                React.createElement(
                                                    "button",
                                                    { type: "button" },
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            width: "16",
                                                            height: "16",
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement(
                                                            "g",
                                                            { opacity: "0.5" },
                                                            React.createElement("path", {
                                                                d: "M4 4L12 12M12 4L4 12",
                                                                stroke: "#677385",
                                                                strokeLinecap: "round"
                                                            })
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "_item" },
                                        React.createElement(
                                            "div",
                                            { className: "_c_inner" },
                                            React.createElement(
                                                "div",
                                                { className: "_icon _w_initial _w_star" },
                                                React.createElement(
                                                    "span",
                                                    { className: "_initials" },
                                                    "SG"
                                                ),
                                                React.createElement(
                                                    "span",
                                                    { className: "_starred" },
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
                                                            d: "M6.60789 3.00258L7.22476 4.23633C7.30789 4.40695 7.53101 4.56883 7.71914 4.60383L8.83476 4.78758C9.54789 4.9057 9.71414 5.42195 9.20226 5.9382L8.33164 6.80883C8.18726 6.9532 8.10414 7.23758 8.15226 7.4432L8.40164 8.51945C8.59851 9.3682 8.14351 9.7007 7.39539 9.25445L6.34976 8.6332C6.16164 8.51945 5.84664 8.51945 5.65851 8.6332L4.61289 9.25445C3.86476 9.69633 3.40976 9.3682 3.60664 8.51945L3.85601 7.4432C3.89539 7.2332 3.81226 6.94883 3.66789 6.80445L2.79726 5.93383C2.28539 5.42195 2.45164 4.9057 3.16476 4.7832L4.28039 4.59945C4.46851 4.56883 4.69164 4.40258 4.77476 4.23195L5.39164 2.9982C5.72851 2.3332 6.27101 2.3332 6.60789 3.00258Z",
                                                            fill: "#FFB13D"
                                                        })
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_details" },
                                                React.createElement(
                                                    "h6",
                                                    { className: "_title" },
                                                    `Jhosef Jones`,
                                                    " ",
                                                    React.createElement(
                                                        "span",
                                                        { "class": "_ins" },
                                                        `Assigned you on the call with Ada and Sarra.`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_meta" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `23 mins ago`
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        `3 attachments`
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_attachments _type_files" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "span",
                                                            { className: "_icon" },
                                                            React.createElement(
                                                                "svg",
                                                                {
                                                                    width: "20",
                                                                    height: "20",
                                                                    viewBox: "0 0 20 20",
                                                                    fill: "none",
                                                                    xmlns: "http://www.w3.org/2000/svg"
                                                                },
                                                                React.createElement("path", {
                                                                    fillRule: "evenodd",
                                                                    clipRule: "evenodd",
                                                                    d: "M6.66675 9.98879C6.66675 9.02985 7.44415 8.25248 8.40318 8.25248H10.1396V11.7253H8.40318C7.44417 11.7253 6.66675 10.9478 6.66675 9.98879ZM8.40318 7.63962H10.1396V4.16675H8.40318C7.44418 4.16675 6.66675 4.94418 6.66675 5.90318C6.66675 6.86219 7.44417 7.63962 8.40318 7.63962ZM14.2253 5.90318C14.2253 6.86219 13.4479 7.63962 12.4889 7.63962H10.7525V4.16675H12.4889C13.4479 4.16675 14.2253 4.94418 14.2253 5.90318ZM10.7525 9.98879C10.7525 9.02985 11.5299 8.25248 12.4889 8.25248C13.4479 8.25248 14.2253 9.02985 14.2253 9.98879C14.2253 10.9478 13.4479 11.7253 12.4889 11.7253C11.5299 11.7253 10.7525 10.9478 10.7525 9.98879ZM8.40318 12.3381H10.1396V14.0747C10.1396 15.0337 9.36219 15.8112 8.40318 15.8112C7.44418 15.8112 6.66675 15.0337 6.66675 14.0747C6.66675 13.1157 7.44422 12.3381 8.40318 12.3381Z",
                                                                    fill: "#415067"
                                                                })
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "span",
                                                            { className: "_label" },
                                                            "FinalFinal_app.fig"
                                                        )
                                                    ),
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "span",
                                                            { className: "_icon" },
                                                            React.createElement(
                                                                "svg",
                                                                {
                                                                    width: "20",
                                                                    height: "20",
                                                                    viewBox: "0 0 20 20",
                                                                    fill: "none",
                                                                    xmlns: "http://www.w3.org/2000/svg"
                                                                },
                                                                React.createElement("path", {
                                                                    d: "M9.54638 7.79638C9.61119 7.79638 9.61119 7.79638 9.54638 7.79638C9.61119 7.53712 9.67601 7.40749 9.67601 7.21304V7.08341C9.74082 6.75934 9.74082 6.50008 9.67601 6.43527C9.67601 6.43527 9.67601 6.43527 9.67601 6.37045L9.61119 6.30564C9.61119 6.30564 9.61119 6.37045 9.54638 6.37045C9.41675 6.75934 9.41675 7.21304 9.54638 7.79638ZM7.60193 12.2686C7.4723 12.3334 7.34267 12.3982 7.27786 12.463C6.82416 12.8519 6.50008 13.3056 6.43527 13.5001C6.82416 13.4353 7.21304 13.0464 7.60193 12.2686C7.66675 12.2686 7.66675 12.2686 7.60193 12.2686C7.66675 12.2686 7.60193 12.2686 7.60193 12.2686ZM13.5649 11.2964C13.5001 11.2316 13.2408 11.0371 12.3334 11.0371C12.2686 11.0371 12.2686 11.0371 12.2038 11.0371C12.2038 11.0371 12.2038 11.0371 12.2038 11.1019C12.6575 11.2964 13.1112 11.426 13.4353 11.426C13.5001 11.426 13.5001 11.426 13.5649 11.426H13.6297C13.6297 11.426 13.6297 11.426 13.6297 11.3612C13.6297 11.3612 13.5649 11.3612 13.5649 11.2964ZM14.5371 4.16675H5.46304C4.75008 4.16675 4.16675 4.75008 4.16675 5.46304V14.5371C4.16675 15.2501 4.75008 15.8334 5.46304 15.8334H14.5371C15.2501 15.8334 15.8334 15.2501 15.8334 14.5371V5.46304C15.8334 4.75008 15.2501 4.16675 14.5371 4.16675ZM13.8242 11.8149C13.6945 11.8797 13.5001 11.9445 13.2408 11.9445C12.7223 11.9445 11.9445 11.8149 11.2964 11.4908C10.1945 11.6205 9.35193 11.7501 8.70378 12.0093C8.63897 12.0093 8.63897 12.0093 8.57416 12.0741C7.79638 13.4353 7.14823 14.0834 6.62971 14.0834C6.50008 14.0834 6.43527 14.0834 6.37045 14.0186L6.04638 13.8242V13.7593C5.98156 13.6297 5.98156 13.5649 5.98156 13.4353C6.04638 13.1112 6.43527 12.5279 7.21304 12.0741C7.34267 12.0093 7.53712 11.8797 7.79638 11.7501C7.99082 11.426 8.18527 11.0371 8.44453 10.5834C8.7686 9.93527 8.96304 9.28712 9.15749 8.70378C8.89823 7.92601 8.7686 7.4723 9.02786 6.5649C9.09267 6.30564 9.28712 6.04638 9.54638 6.04638H9.67601C9.80564 6.04638 9.93527 6.11119 10.0649 6.17601C10.5186 6.62971 10.3242 7.66675 10.0649 8.50934C10.0649 8.57416 10.0649 8.57416 10.0649 8.57416C10.3242 9.28712 10.713 9.87045 11.1019 10.2593C11.2964 10.389 11.426 10.5186 11.6853 10.6482C12.0093 10.6482 12.2686 10.5834 12.5279 10.5834C13.3056 10.5834 13.8242 10.713 14.0186 11.0371C14.0834 11.1668 14.0834 11.2964 14.0834 11.426C14.0186 11.4908 13.9538 11.6853 13.8242 11.8149ZM9.61119 9.28712C9.48156 9.74082 9.2223 10.2593 8.96304 10.8427C8.83341 11.1019 8.70378 11.2964 8.57416 11.5556H8.63897H8.70378C9.54638 11.2316 10.3242 11.0371 10.8427 10.9723C10.713 10.9075 10.6482 10.8427 10.5834 10.7779C10.2593 10.389 9.87045 9.87045 9.61119 9.28712Z",
                                                                    fill: "#415067"
                                                                })
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "span",
                                                            { className: "_label" },
                                                            "FinalPresent.ppt"
                                                        )
                                                    )
                                                ),
                                                React.createElement(
                                                    "ul",
                                                    { className: "_attachments _type_files" },
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "span",
                                                            { className: "_icon" },
                                                            React.createElement(
                                                                "svg",
                                                                {
                                                                    width: "20",
                                                                    height: "20",
                                                                    viewBox: "0 0 20 20",
                                                                    fill: "none",
                                                                    xmlns: "http://www.w3.org/2000/svg"
                                                                },
                                                                React.createElement("path", {
                                                                    d: "M16.224 5.10468H10.4687V3.77656C10.4687 3.64463 10.4103 3.51979 10.3085 3.43567C10.2076 3.35156 10.0721 3.31525 9.94458 3.34182L2.86125 4.66994C2.65141 4.7089 2.5 4.8913 2.5 5.10468V14.8443C2.5 15.0568 2.65141 15.24 2.86125 15.279L9.94458 16.6071C9.97115 16.6124 9.99859 16.6151 10.026 16.6151C10.1287 16.6151 10.2288 16.5797 10.3085 16.5133C10.4103 16.4292 10.4687 16.3034 10.4687 16.1724V14.8443H16.224C16.4683 14.8443 16.6667 14.6459 16.6667 14.4016V5.54739C16.6667 5.30302 16.4683 5.10468 16.224 5.10468ZM8.69526 8.25234L8.25255 12.2376C8.22953 12.4404 8.07016 12.6024 7.8674 12.6272C7.8488 12.6298 7.83109 12.6307 7.8125 12.6307C7.6301 12.6307 7.46365 12.5174 7.39812 12.3438L6.48437 9.90718L5.57062 12.3438C5.49979 12.5333 5.31385 12.6493 5.10844 12.6281C4.90745 12.6068 4.7463 12.451 4.71797 12.25L4.27526 9.15104C4.24073 8.90932 4.40896 8.68531 4.65068 8.65078C4.89328 8.61536 5.11729 8.78447 5.15182 9.02619L5.34927 10.411L6.06911 8.49052C6.19839 8.1452 6.76859 8.1452 6.89875 8.49052L7.57698 10.2985L7.81516 8.15406C7.8426 7.91145 8.0675 7.73791 8.30391 7.76359C8.5474 7.79104 8.72182 8.00973 8.69526 8.25234ZM15.7812 13.9588H10.4687V13.0734H14.4531C14.6975 13.0734 14.8958 12.8751 14.8958 12.6307C14.8958 12.3863 14.6975 12.188 14.4531 12.188H10.4687V11.3026H14.4531C14.6975 11.3026 14.8958 11.1043 14.8958 10.8599C14.8958 10.6155 14.6975 10.4172 14.4531 10.4172H10.4687V9.53177H14.4531C14.6975 9.53177 14.8958 9.33343 14.8958 9.08906C14.8958 8.84468 14.6975 8.64635 14.4531 8.64635H10.4687V7.76093H14.4531C14.6975 7.76093 14.8958 7.5626 14.8958 7.31822C14.8958 7.07385 14.6975 6.87552 14.4531 6.87552H10.4687V5.9901H15.7812V13.9588Z",
                                                                    fill: "#415067"
                                                                })
                                                            )
                                                        ),
                                                        React.createElement(
                                                            "span",
                                                            { className: "_label" },
                                                            "FinalFinalFinalFinal.doc"
                                                        )
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "_close" },
                                                React.createElement(
                                                    "button",
                                                    { type: "button" },
                                                    React.createElement(
                                                        "svg",
                                                        {
                                                            width: "16",
                                                            height: "16",
                                                            viewBox: "0 0 16 16",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg"
                                                        },
                                                        React.createElement(
                                                            "g",
                                                            { opacity: "0.5" },
                                                            React.createElement("path", {
                                                                d: "M4 4L12 12M12 4L4 12",
                                                                stroke: "#677385",
                                                                strokeLinecap: "round"
                                                            })
                                                        )
                                                    )
                                                )
                                            )
                                        )
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