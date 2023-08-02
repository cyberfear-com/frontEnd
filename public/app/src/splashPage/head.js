define(["react"], function (React) {
    return React.createClass({
        handleClick: function (i) {
            switch (i) {
                case "login":
                    $("#loginUser").modal("show");
                    break;

                case "reportBug":
                    $("#reportBug-modal").modal("show");
                    break;
                case "requestInvitation":
                    $("#reqInvite").modal("show");
                    break;
                case "signUp":
                    $("#createAccount-modal").modal("show");
                    break;
                case "donate":
                    $("html, body").animate(
                        {
                            scrollTop: $("#donateUs").offset().top,
                        },
                        1000
                    );

                    break;
            }
        },
        render: function () {
            //console.log(this);

            return (
                <nav className="navbar" id="menu">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button
                                className="navbar-toggle collapsed"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarResponsive"
                                aria-controls="navbarResponsive"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                MENU
                            </button>
                            <a className="navbar-brand" href="/">
                                <img src="img/logo.svg" className="logo" />
                            </a>
                        </div>

                        <div
                            className="collapse navbar-collapse"
                            id="navbarResponsive"
                        >
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="features.html">About</a>
                                </li>
                                <li>
                                    <a
                                        onClick={this.handleClick.bind(
                                            this,
                                            "reportBug"
                                        )}
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="pricing.html">Pricing</a>
                                </li>
                                <li>
                                    <a
                                        className="nav-link dark-btn-menu"
                                        href="mailbox/#login"
                                    >
                                        Login
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="nav-link white-btn-menu"
                                        href="mailbox/#signup"
                                    >
                                        Sign Up
                                    </a>
                                </li>
                                <li className="visible-xs-block">
                                    <button
                                        className="navbar-toggle collapsed"
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#navbarResponsive"
                                        aria-controls="navbarResponsive"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        X
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            );
        },
    });
});
