import Banner from "./Banner";

export default function BecomePremium() {
  return (
    <Banner className="bg-primary text-bg-primary text-center">
      <h4 className="d-none d-md-block fw-medium">
        Get up&nbsp;and running right away
      </h4>
      <h3 className="d-md-none fw-medium">
        Get up&nbsp;and running right away
      </h3>
      <p className="opacity-50 mt-3 mb-4">
        Start free and upgrade if&nbsp;you need more features.
      </p>

      <a href="#" className="btn btn-light wide fw-bold d-block d-md-inline">
        Upgrade Now
      </a>
    </Banner>
  );
}
