

export default function Loader() {
    return (
        <div
            className={`in-working popup`}
            id="settings-spinner"
            style={{padding: "50vh 50%"}}
        >
            <div className="wrapper">
                <div className="inner">
                    <div className="content">
                        <div className="t-animation">
                            <div className="loading-animation type-progress style-circle">
                                <div className="progress-circle medium">
                                    <div className="circle-bg">
                                        <img
                                            src="/dist/images/loading-circle.svg"
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
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
