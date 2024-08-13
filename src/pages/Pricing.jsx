import { useState } from "react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import CardBanner from "@/components/CardBanner.jsx";
import Banner from "@/components/Banner.jsx";
import styles from "./Pricing.module.scss";
import classNames from "classnames";

import MailumMainViewImg from "@/assets/mailum-main-view.png";
import Testimonials from "../components/Testimonials";
import BestTimeBanner from "../components/BestTimeBanner";
import CustomerReviews from "../components/CustomerReviews";
import BecomePremium from "../components/BecomePremium";

export default function Pricing() {
  const [period, setPeriod] = useState("monthly");

  return (
    <>
      <Header />

      <CardBanner className='text-center'>
        <h3>
          Get Started Now, <span className='text-primary'>Pick a&nbsp;Plan</span>
        </h3>
        <p className='lead opacity-50 mb-4'>
          Protect confidential emails and information
        </p>

        <div
          className={classNames(styles.periodSelector, "btn-group")}
          role="group"
        >
          <button
            type="button"
            className={classNames(
              styles.monthly,
              "btn",
              period === "monthly" && styles.active
            )}
            onClick={() => setPeriod("monthly")}
          >
            Monthly (cancel anytime)
          </button>
          <button
            type="button"
            className={classNames(
              styles.oneYear,
              "btn",
              period === "1year" && styles.active
            )}
            onClick={() => setPeriod("1year")}
          >
            1 Year commitment
            <span className="badge ms-2">Save 30%</span>
          </button>
          <button
            type="button"
            className={classNames(
              styles.twoYear,
              "btn",
              period === "2year" && styles.active
            )}
            onClick={() => setPeriod("2year")}
          >
            2 Years commitment
            <span className="badge ms-2">Save 40%</span>
          </button>
        </div>
      </CardBanner>

      <div className={classNames(styles.planCardsContainer, "container")}>
        <div className="grid g-3">
            <div className="g-col-12 g-col-md-6 g-col-lg-3"
            >
              <div className={classNames(styles.planCard, "card h-100")}>
                <div className="card-body p-4 d-flex flex-column">
                  <h5 className="opacity-75 mb-4 fw-medium">Free</h5>

                  <h3 className="fw-medium lh-1">
                    $0.00
                    <span className="fs-6 fw-medium opacity-50 text-nowrap">
                      &nbsp;/&nbsp;month
                    </span>
                  </h3>

                  <hr className="text-body-tertiary" />

                  <p className="fs-7 opacity-50">
                    Try us
                  </p>

                  <ul
                    className={classNames(
                      styles.features,
                      "list-unstyled small mb-5"
                    )}
                  >
                    <li>Full Encryption</li>
                    <li>Space: 0.05GB</li>
                    <li>Email Address: 1</li>
                    <li>Receiving: Unlimited</li>
                    <li>Sending: 2 emails/hour</li>
                    <li>Own Domain: 0</li>
                  </ul>

                  <div className="flex-grow-1"></div>
                  {/* spacer */}

                  <button className={classNames(styles.planbut, "btn fw-normal text-center w-100 border border-primary border-1")}>
                    <a className="text-decoration-none"  href="/mailbox/#signup">Try for Free</a>
                  </button>
                </div>
              </div>
            </div>
          <div
            className={classNames(
              "g-col-12",
            "g-col-md-6 g-col-lg-3"
            )}
          >
            <div className={classNames(styles.planCard, "card h-100")}>
              <div className='card-body p-4 d-flex flex-column'>
                <h5 className='opacity-75 mb-4 fw-medium'>Basic</h5>

                <h3 className='fw-medium'>
                  {period === "monthly" && (
                      <span>$2.00
                        <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                  </span>
                        </span>
                    )}
                  {period === "1year" && (
                      <span>${Math.round((24-24*0.3)*100/12)/100} (<strike className="small">${Math.round(24*100/12)/100}</strike>)
                    <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                    </span>
                        </span>
                    )}
                  {period === "2year" && (
                      <span>${Math.round((48-48*0.4)*100/24)/100} (<strike className="small">${Math.round(48*100/24)/100}</strike>)
                    <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                    </span>
                        </span>
                  )}
                </h3>

                <hr className="text-body-tertiary" />

                <p className="fs-7 opacity-50">
                  For users&nbsp; emailing occasionally
                </p>

                <ul
                  className={classNames(
                    styles.features,
                    "list-unstyled small mb-5"
                  )}
                >
                  <li>Full Encryption</li>
                  <li>Space: 2GB</li>
                  <li>Email Address: 2</li>
                  <li>Receiving: Unlimited</li>
                  <li>Sending: 60 emails/hour</li>
                  <li>Own Domain: 2</li>
                </ul>

                <div className="flex-grow-1"></div>
                {/* spacer */}

                {/*<button className={classNames(styles.planbut, "btn fw-normal text-center w-100 border border-primary border-1")}>
                  <a className="text-decoration-none" href="/mailbox/#signup">Get Started</a>
                </button>*/}
                <a className={classNames(styles.planbut, "btn fw-normal text-center w-100 border border-primary border-1 text-decoration-none")} href="/mailbox/#signup">
                  Get Started
                </a>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              "g-col-12",
              "g-col-md-6 g-col-lg-3"
            )}
          >

            <div
              className={classNames(
                styles.planCard, styles.featured+" card h-100 text-bg-primary",
              )}
            >
              <div className='card-body p-4'>
                <div className='d-flex align-items-center justify-content-between mb-4'>
                  <h5 className='opacity-75 mb-2 fw-medium'>Medium</h5>
                      <span className='badge bg-primary'>POPULAR</span>
                </div>

                <h3 className="fw-medium">
                  {period === "monthly" && (
                      <span>$6.00
                        <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                  </span>
                        </span>
                  )}
                  {period === "1year" && (
                      <span>${Math.round((72.00-72.00*0.3)*100/12)/100} (<strike className="small">${Math.round(72.00*100/12)/100}</strike>)
                    <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                    </span>
                        </span>
                  )}
                  {period === "2year" && (
                      <span>${Math.round((144-144*0.4)*100/24)/100} (<strike className="small">${Math.round(144*100/24)/100}</strike>)
                    <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                    </span>
                        </span>
                  )}
                </h3>

                <hr className="text-body-tertiary" />

                <p className="fs-7 opacity-50">
                  Users using email daily
                </p>

                <ul
                  className={classNames(
                    styles.features,
                    "list-unstyled small mb-5"
                  )}
                >
                  <li>Full Encryption</li>
                  <li>Space: 10GB</li>
                  <li>Email Address: 10</li>
                  <li>Receiving: Unlimited</li>
                  <li>Sending: Unlimited</li>
                  <li>Own Domain: 10</li>
                </ul>

                {/*<button className="btn fw-normal text-center w-100" style={{background:"#fff"}}>
                  <a className="text-decoration-none text-black" href="/mailbox/#signup">Get Started</a>
                </button>*/}
                <a className={classNames("btn fw-normal text-center w-100 text-decoration-none text-black")} style={{background:"#fff"}} href="/mailbox/#signup">
                  Get Started
                </a>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              "g-col-12",
              "g-col-md-6 g-col-lg-3"
            )}
          >
            <div className={classNames(styles.planCard, "card h-100")}>
              <div className="card-body p-4 d-flex flex-column">
                <h5 className='opacity-75 mb-4 fw-medium'>Pro</h5>

                <h3 className="fw-medium">
                  {period === "monthly" && (
                      <span>$12.00
                        <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                  </span>
                        </span>
                  )}
                  {period === "1year" && (
                      <span>${Math.round((144-144*0.3)*100/12)/100} (<strike className="small">${Math.round(144*100/12)/100}</strike>)
                    <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                    </span>
                        </span>
                  )}
                  {period === "2year" && (
                      <span>${Math.round((288-288*0.4)*100/24)/100} (<strike className="small">${Math.round(288*100/24)/100}</strike>)
                    <span className='fs-6 fw-medium opacity-50 text-nowrap'>
                    &nbsp;/&nbsp;month
                    </span>
                        </span>
                  )}
                </h3>

                <hr className="text-body-tertiary" />

                <p className="fs-7 opacity-50">
                  Best in class
                </p>

                <ul
                  className={classNames(
                    styles.features,
                    "list-unstyled small mb-5"
                  )}
                >
                  <li>Full Encryption</li>
                  <li>Space: 100GB</li>
                  <li>Email Address: 100</li>
                  <li>Receiving: Unlimited</li>
                  <li>Sending: Unlimited</li>
                  <li>Own Domain: 100</li>
                </ul>

                <div className="flex-grow-1"></div>
                {/* spacer */}

                {/*<button className={classNames(styles.planbut, "btn fw-normal text-center w-100 border border-primary border-1")}>
                  <a className="text-decoration-none" href="/mailbox/#signup">Get Started</a>
                </button>*/}
                <a className={classNames(styles.planbut, "btn fw-normal text-center w-100 border border-primary border-1 text-decoration-none")} href="/mailbox/#signup">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardBanner
        className={classNames(styles.banner1, "bg-primary text-bg-primary")}
        style={{
          border: "solid 6px var(--bs-primary)",
        }}
      >
        <div className="row">
          <div className="col-12 col-md-6 order-2 order-md-1">
            <h3 className="fw-medium d-none d-md-block">
              Private and<br />
              Anonymous Email
            </h3>
            <h1 className="d-md-none">
              Private and<br />
              Anonymous Email
            </h1>

            <p className="opacity-50">
              Our privacy is&nbsp;quickly becoming a&nbsp;thing of&nbsp;the
              past.
              <br />
              Privacy enables you to&nbsp;control who can access information
              about your private life and activities. Stand your ground and take
              it&nbsp;back.
            </p>
            <p className="opacity-50 mb-0">
              Mailum is&nbsp;committed to&nbsp;keeping the Internet
              an&nbsp;anonymous space free from surveillance.
            </p>
          </div>
          <div
            className="col-12 col-md-6 order-1 order-md-2"
            style={{ position: "relative" }}
          >
            <img className={styles.bg} src={MailumMainViewImg} />
          </div>
        </div>
      </CardBanner>

      <Testimonials
        titleDesktop="Trusted by&nbsp;Security Experts"
      />

      <BestTimeBanner />

      <CustomerReviews />

      <BecomePremium />

      <Footer />
    </>
  );
}
