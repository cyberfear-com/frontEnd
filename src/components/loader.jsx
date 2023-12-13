import loadinC from "@/assets/loading-circle.svg";

export default function Loader() {
    return (
        <div
            className={`in-working popup`}
            id="settings-spinner"
            style={{padding: "50vh 50%"}}
        >
            <div className="wrapper" style={{boxSizing:"border-box",color:"#000",display:"block",fontSize:"16px",fontWeight:"400",lineHeigt:"24px",textAlign:"start",textSizeAdjust:"100%",fontFamily:"Plus Jakarta Display"}}>
                <div className="inner">
                    <div className="content">
                        <div className="t-animation">
                            <div className="loading-animation type-progress style-circle">
                                <div className="progress-circle medium">
                                    <div className="circle-bg">
                                        <svg height="91" width="91" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#2277f6" > <g fill="none" fill-rule="evenodd" > <g transform="translate(1 1)" stroke-width="1" > <circle stroke-opacity=".1" cx="18" cy="18" r="18"/> <path d="M36 18c0-9.94-8.06-18-18-18" > <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/> </path> </g> </g> </svg>
                                    </div>
                                    <div className="circle-content">
                                        <div className="loading-spinner">
                                            <div className="the-spinner" style={{ width: "54px",height: "54px",display: "inline-block"}}>
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
                        <div className="t-text" style={{fontWeight:"400",fontFamily:"Plus Jakarta Display",fontSize:"40px",lineHeight:"52px"}}>
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
