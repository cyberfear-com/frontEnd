import { ReactComponent as AppleStoreIconSVG } from "@/assets/apple-store-icon.svg";
import { ReactComponent as GooglePlayIconSVG } from "@/assets/google-play-icon.svg";
import { ReactComponent as FDroidIconSVG } from "@/assets/f-droid-icon.svg";
import mailumUiImg from "@/assets/mailum-ui.webp";
import mailumUiMobileImg from "@/assets/mailum-ui-mobile.webp";
import classNames from "classnames";
import styles from "./HomeBanner.module.scss";

// TODO update links
const downloadLinks = [
  {
    iconClass: AppleStoreIconSVG,
    source: "Apple Store",
    url: "#",
  },
  {
    iconClass: GooglePlayIconSVG,
    source: "Google Play",
    url: "#",
  },
  {
    iconClass: FDroidIconSVG,
    source: "F-Droid",
    url: "#",
  },
];

export default function HomeBanner() {
  return (
    <div
      className={classNames(
        styles.root,
        "bg-primary text-bg-primary pt-5 text-center"
      )}
    >
      <div className="container overflow-hidden">
        <div className="row">
          <div className="col-lg-8 col-12 mx-auto">

            <h1 className='d-none d-md-inline'>
              {/*Make Email Security a&nbsp;Priority*/}
              Secure Email Service <br /> That Respects Your Privacy
            </h1>
            <h2 className='d-md-none'>
              Secure Email Service <br /> That Respects Your Privacy
            </h2>

            <p className="lead opacity-50 mt-3 mb-4">
              <span className="d-none d-md-inline">
                Protect confidential emails and information with open-source,
                most complete encryption that ensures your data
                is&nbsp;safeguarded from start to&nbsp;finish.
              </span>
              <span className="d-md-none">
                Protect confidential emails and information with open-source,
                most complete encryption that ensures your data
                is&nbsp;safeguarded from start to&nbsp;finish.
              </span>
            </p>

            <a
              href="/mailbox/#signup"
              className="btn btn-light wide fw-bold d-block d-md-inline"
            >
              Try for Free
            </a>

            <ul
              className={classNames(
                styles.downloadList,
                "list-unstyled d-flex flex-wrap justify-content-center my-4"
              )}
            >
              {downloadLinks.map((info, index) => (
                <li key={index}>
                  <a
                    href={info.url}
                    className="
                      btn bg-light bg-opacity-10
                      text-bg-primary text-decoration-none lh-1
                      d-flex align-items-center
                    "
                  >
                    <info.iconClass className="flex-shrink-0" />
                    <div className="flex-grow-1 ms-2 text-start">
                      <small className='opacity-50'>Download on the</small>
                      <strong>{info.source}</strong>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <picture>
            <source srcSet={mailumUiImg} media="(min-width: 768px)" />
            <source srcSet={mailumUiMobileImg} media="(max-width: 767px)" />
            <img src={mailumUiMobileImg} className={styles.uiImage} alt="Screenshot of the mail user interface" />
          </picture>
        </div>
      </div>
    </div>
  );
}
