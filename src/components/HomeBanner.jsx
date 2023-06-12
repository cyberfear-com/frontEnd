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
              Make Email Security a&nbsp;Priority
            </h1>
            <h3 className='d-md-none'>
              Peace of&nbsp;Mind<br />
              Without Relying on&nbsp;Trust
            </h3>

            <p className="lead opacity-50 mt-3 mb-4">
              <span className="d-none d-md-inline">
                Protect confidential emails and information with open-source,
                most complete encryption that ensures your data
                is&nbsp;safeguarded from start to&nbsp;finish.
              </span>
              <span className="d-md-none">
                Mailum is&nbsp;committed to&nbsp;keeping the Internet
                an&nbsp;anonymous space free from surveillance.
              </span>
            </p>

            <a
              href="#"
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
              {downloadLinks.map((info) => (
                <li>
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
                      <small class="opacity-50">Download on the</small>
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
            <img src={mailumUiMobileImg} className={styles.uiImage} />
          </picture>
        </div>
      </div>
    </div>
  );
}
