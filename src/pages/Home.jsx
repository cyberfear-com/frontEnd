import classNames from "classnames";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";

import Header from "@/components/Header.jsx";
import HomeBanner from "@/components/HomeBanner.jsx";
import Banner from "@/components/Banner.jsx";

import CustomerReviews from "@/components/CustomerReviews.jsx";
import lockImg from "@/assets/private-and-anonymous-email.png";

import { ReactComponent as Feature1SVG } from "@/assets/feature-1.svg";
import { ReactComponent as Feature2SVG } from "@/assets/feature-2.svg";
import { ReactComponent as Feature3SVG } from "@/assets/feature-3.svg";
import { ReactComponent as Feature4SVG } from "@/assets/feature-4.svg";
import { ReactComponent as Feature5SVG } from "@/assets/feature-5.svg";
import { ReactComponent as Feature6SVG } from "@/assets/feature-6.svg";
import { ReactComponent as Feature7SVG } from "@/assets/feature-7.svg";
import { ReactComponent as Feature8SVG } from "@/assets/feature-8.svg";
import { ReactComponent as Feature9SVG } from "@/assets/feature-9.svg";
import { ReactComponent as Feature10SVG } from "@/assets/feature-10.svg";
import { ReactComponent as TwitterLogoSVG } from "@/assets/twitter-logo.svg";
import { ReactComponent as FacebookLogoSVG } from "@/assets/facebook-logo.svg";
import { ReactComponent as RedditLogoSVG } from "@/assets/reddit-logo.svg";
import sliderImage1 from "@/assets/slider-image-1.png";
import sliderImage2 from "@/assets/slider-image-2.png";
import sliderImage3 from "@/assets/slider-image-3.png";
import safeImg from "@/assets/safe.png";
import styles from "./Home.module.scss";
import CardBanner from "../components/CardBanner";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import BestTimeBanner from "../components/BestTimeBanner";

const features = [
  { title: "Zero-knowledge E2EE", image: Feature1SVG },
  { title: "PGP support", image: Feature2SVG },
  { title: "TOR support", image: Feature3SVG },
  { title: "No ads", image: Feature4SVG },
  { title: "No external trackers", image: Feature5SVG },
  { title: "No IP-logs", image: Feature6SVG },
  { title: "Offshore servers location", image: Feature7SVG },
  { title: "Anonymous payment methods", image: Feature8SVG },
  { title: "No KYC, no phone verifications", image: Feature9SVG },
  { title: "Open-source code", image: Feature10SVG },
];

const socialLinks = [
  { title: "Twitter", id: "@Mailum", icon: TwitterLogoSVG },
  { title: "Facebook", id: "@Mailum", icon: FacebookLogoSVG },
  { title: "Reddit", id: "@Mailum", icon: RedditLogoSVG },
];

const slides = [
  {
    header: `The Most Air-Tight Encryption Available`,
    content: `
            Mailum is&nbsp;the only email service encrypting all 4&nbsp;elements of&nbsp;an&nbsp;email and its metadata.
            While other services only encrypt the email body, we&nbsp;encrypt body, subject, sender, recipient, and timestamp to&nbsp;protect your online privacy from unauthorized access.
            `,
    image: sliderImage1,
  },
  {
    header: "Get Up&nbsp;and Running Right Away",
    content: `
            Designed to&nbsp;safeguard both personal
            and business information we&rsquo;ve made
            it&nbsp;easy to&nbsp;get started in&nbsp;minutes.
            Simply sign up&nbsp;using a&nbsp;username and
            password and start sending and
            receiving secure emails without
            making it&nbsp;complicated.
            `,
    image: sliderImage2,
  },
  {
    header: "User-Friendly and Hassle-Free",
    content: `
            The idea of&nbsp;Encryption is&nbsp;not
            complicated as&nbsp;it&nbsp;sounds. Having a
            user-friendly and simple interface,
            Mailum is&nbsp;an&nbsp;ideal choice as&nbsp;your
            daily, hassle-free mailbox.<br />
            It&nbsp;is&nbsp;just as&nbsp;easy and intuitive as
            Gmail, (minus the spying element.)
            `,
    image: sliderImage3,
  },
];

export default function Home() {
  const sliderRef = useRef(null);

  return (
    <>
      <Header variant="primary" />
      <HomeBanner />
      <Testimonials />
      <BestTimeBanner />

      <CardBanner
        className={classNames(
          styles.features,
          "bg-secondary-subtle mt-md-4 user-select-none"
        )}
      >
        <div className="row">
          <div className="col-12 col-md-7 col-lg-6 order-2 order-md-1">
            <h1>Private and anonymous email</h1>

            <p className="lead opacity-50">
              Our privacy is quickly becoming a thing of the past. Privacy
              enables you to control who can access information about your
              private life and activities. Stand your ground and take it back.
            </p>
            <p className="lead fw-bold opacity-50">
              Mailum is committed to keeping the Internet an anonymous space
              free from surveillance.
            </p>
          </div>

          <div
            className={classNames(
              styles.lockImgRow,
              "col-12 col-md-5 col-lg-6 order-1",
              "mb-3 mb-md-0",
              "d-flex align-items-start justify-content-center justify-content-md-end"
            )}
          >
            <img src={lockImg} className={styles.lockImg} />
          </div>
        </div>

        <ul
          className={classNames(
            styles.featureList,
            "list-unstyled mt-5 mb-n4 mb-sm-0 text-lg-center small fw-bold",
            "row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-2 g-sm-3 g-xl-4"
          )}
        >
          {features.map((feature) => (
            <li>
              <div className="card h-100 border-0">
                <div className="card-body d-flex d-lg-block align-items-center">
                  <feature.image />
                  <div className="mt-lg-2 ms-3 ms-lg-0">{feature.title}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBanner>

      <Slider
        ref={sliderRef}
        className={styles.slider}
        infinite={true}
        slidesToShow={1}
        slidesToScroll={1}
        arrows={false}
        speed={200}
        dots={true}
      >
        {slides.map((item, index) => (
          <CardBanner
            className={classNames(
              styles.bottomSlider,
              "bg-primary text-bg-primary"
            )}
          >
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-md-end">
                <img
                  src={item.image}
                  width="300"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              <div className="col-12 col-md-8 col-lg-6">
                <h1 dangerouslySetInnerHTML={{ __html: item.header }} />
                <p
                  className="lead opacity-50"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
              <div className="col-1 d-none d-lg-block"></div>
            </div>
          </CardBanner>
        ))}
      </Slider>

      <div className={classNames(styles.peaceOfMind, "container my-5")}>
        <div className="row">
          <div className="col-12 col-md-7 col-lg-8 order-2 order-md-1 mt-3 mt-md-0">
            <h1>
              <span className="text-primary">Peace of Mind</span><br />
              Without Relying on Trust!
            </h1>

            <p className="lead">
              <span className="opacity-50">
                Our top priority while building Mailum was to&nbsp;create
                an&nbsp;email service that is&nbsp;not based on&nbsp;reliance.
                We&nbsp;came up&nbsp;with a&nbsp;solution named &laquo;
              </span>
              <a
                role="button"
                className="fw-medium"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-custom-class="dark"
                data-bs-html="true"
                data-bs-trigger="click"
                data-bs-title='<div class="fw-medium small opacity-60">CLOSED-SOURCE /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
              >
                Local Code
              </a>
              <span className="opacity-50">&raquo;.</span>
            </p>
            <p className="lead opacity-50">
              We&nbsp;provide users with the ability to&nbsp;host the Mailum
              website on&nbsp;their computers locally. This allows users
              to&nbsp;have an&nbsp;absolute certainty that scripts loaded
              by&nbsp;their browsers have neither been maliciously modified nor
              been altered.
            </p>
          </div>
          <div className="col-12 col-md-5 col-lg-4 d-flex justify-content-center align-items-center order-1">
            <img src={safeImg} style={{ maxWidth: "100%" }} />
          </div>
        </div>
      </div>

      <CardBanner
        className={classNames(
          styles.social,
          "bg-dark text-bg-dark text-center my-5"
        )}
      >
        <h4 className="fw-medium d-none d-md-block">
          Join Us&nbsp;on&nbsp;Social Media
          <br />
          We&rsquo;d love to&nbsp;have you here!
        </h4>
        <h3 className="fw-medium d-md-none">
          Join&nbsp;us on&nbsp;social media, we&rsquo;d love to&nbsp;have you
          there!
        </h3>

        <ul className="list-unstyled d-inline-flex flex-wrap mt-4 justify-content-center">
          {socialLinks.map((link) => (
            <li className="mt-3">
              <a
                href=""
                className={classNames(
                  styles.link,
                  "btn p-3 d-inline-flex align-items-center justify-content-center"
                )}
                role="button"
              >
                <link.icon />

                <div className="text-start mx-3 flex-grow-1">
                  <span
                    className={classNames(
                      styles.followUs,
                      "fw-normal  opacity-50"
                    )}
                  >
                    Follow Us on {link.title}
                  </span>
                  <br />
                  <span className={styles.username}>{link.id}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </CardBanner>

      <CustomerReviews />

      <Banner className='bg-primary text-bg-primary text-center'>
        <h4 className='fw-medium d-none d-md-block'>
          Take action, Sign up&nbsp;Now<br />
          to&nbsp;protect your online presence
        </h4>
        <h3 className='d-md-none fw-medium'>
          Become a&nbsp;Premium Member and Unlock so&nbsp;many secure feature
        </h3>
        <p className='opacity-50 mt-3 mb-4'>
          Choose the best fitting plan, any upgrade plan is&nbsp;FREE for
          7&nbsp;DAYS!
        </p>

        <a href="#" className='btn btn-light wide fw-bold d-block d-md-inline'>
          Get Encrypted Email
        </a>
      </Banner>

      <Footer />
    </>
  );
}
