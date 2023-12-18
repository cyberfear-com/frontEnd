//import loadinC from "@/assets/loading-circle.svg";

export default function Loader() {
    return (
        <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100vh' }}>
            <img src="images/loading-circle.svg" alt="Loading Animation" height="91" width="91" />
            <p style={{ marginTop: '16px', fontFamily: "sans-serif"}}>Loading..</p>
        </div>
    );
}
