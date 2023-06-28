import Banner from "./Banner";

export default function BecomePremium() {
  return (
    <Banner className="bg-primary text-bg-primary text-center">
      <h4 className="d-none d-md-block fw-medium">
        Become a&nbsp;Premium Member and Unlock so&nbsp;many secure feature
      </h4>
      <h3 className="d-md-none fw-medium">
        Become a&nbsp;Premium Member and Unlock so&nbsp;many secure feature
      </h3>
      <p className="opacity-50 mt-3 mb-4">
        Choose the best fitting plan, any upgrade plan is&nbsp;FREE for
        7&nbsp;DAYS!
      </p>

      <a href="#" className="btn btn-light wide fw-bold d-block d-md-inline">
        Upgrade Now
      </a>
    </Banner>
  );
}
