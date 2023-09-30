define(["react", "app"], function (React, app) {
    return React.createClass({
        getInitialState: function () {
            return {
                active: true,
            };
        },
        componentDidMount: function () {
            const timer = setTimeout(() => {
                this.setState({
                    active: false,
                });
            }, 1500);
        },
        render: function () {
            return (
                <div
                    className={`in-working popup d-none`}
                    id="settings-spinner"
                >
                    <div className="wrapper">
                        <div className="inner">
                            <div className="content">
                                <div className="t-animation">
                                    <div className="loading-animation type-progress style-circle">
                                        <div className="progress-circle medium">
                                            <div className="circle-bg">
                                                <img
                                                    src="/images/loading-circle.svg"
                                                    alt="loading-circle"
                                                    style={{
                                                        width: "91px",
                                                        height: "91px",
                                                    }}
                                                />
                                            </div>
                                            <div className="circle-content">
                                                <div className="loading-spinner">
                                                    <div className="the-spinner">
                                                        <div className="_bar1"></div>
                                                        <div className="_bar2"></div>
                                                        <div className="_bar3"></div>
                                                        <div className="_bar4"></div>
                                                        <div className="_bar5"></div>
                                                        <div className="_bar6"></div>
                                                        <div className="_bar7"></div>
                                                        <div className="_bar8"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="t-text">
                                    <h2>Processing...</h2>
                                    <h6>
                                        Please wait while we set things up for
                                        you.
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
});


