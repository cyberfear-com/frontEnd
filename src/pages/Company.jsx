import { useRef } from "react";
import classNames from "classnames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import CardBanner from "@/components/CardBanner";
import BestTimeBanner from "@/components/BestTimeBanner";
import BecomePremium from "@/components/BecomePremium";
import MailumUI2Img from "@/assets/mailum-ui-2.png";
import MailumUI3Img from "@/assets/mailum-ui-3.png";
import MissionImg from "@/assets/mission.png";
import MissionMobileImg from "@/assets/mission-mobile.png";
import TechnologyImg from "@/assets/technology.png";
import ServerImg from "@/assets/server.png";
import styles from "./Company.module.scss";

export default function Company() {
  const tooltipsContainerRef = useRef(null);

  return (
    <>
      <Header />

      <Banner className="text-center">
        <h1 className="d-none d-md-block">
          <span className="text-primary">Without Privacy</span>
          <br />
          There&rsquo;s No&nbsp;Freedom
        </h1>
        <h3 className="d-md-none">
          <span className="text-primary">Without Privacy</span>
          <br />
          There&rsquo;s No&nbsp;Freedom
        </h3>

        <p className="lead opacity-50">
          Everyone has the right to&nbsp;be&nbsp;free from interference and intrusion.
          <br class="d-none d-lg-inline" /> While agreements and promises may break, cryptography has got your back.
        </p>
      </Banner>

      <CardBanner
        className={classNames(styles.storyBanner, "bg-primary text-bg-primary")}
      >
        <div className="row" ref={tooltipsContainerRef}>
          <div className="d-md-none col-12">
            <img
              className={classNames(styles.mobileBg, "mb-3")}
              src={MailumUI3Img}
            />
          </div>
          <div className='col-12 col-md-6'>
            <h3 className='d-none d-md-block fw-medium mb-3'>The Mailum Story</h3>
            <h1 className='d-md-none'>The Mailum Story</h1>

            <p>
              <span className="opacity-75">
                We&nbsp;wanted to&nbsp;have an&nbsp;absolute certainty that our
                emails remain private and inaccessible to&nbsp;third party.
                Unfortunately, every service we&nbsp;looked&nbsp;at, had some
                crucial{" "}
              </span>
              <a
                role="button"
                className="fw-medium"
                data-bs-toggle="tooltip"
                data-bs-placement="auto"
                data-bs-html="true"
                data-bs-title='<div class="fw-medium small opacity-60">DRAWBACKS /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
              >
                drawbacks
              </a>
              <span className="opacity-75">
                . It&nbsp;was either incomplete{" "}
              </span>
              <a
                role="button"
                className="fw-medium"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-html="true"
                data-bs-title='<div class="fw-medium small opacity-60">ENCRYPTION /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
              >
                encryption
              </a>
              <span className="opacity-75">, </span>
              <a
                role="button"
                className="fw-medium"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-html="true"
                data-bs-title='<div class="fw-medium small opacity-60">IP-LOGS /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
              >
                IP-logs
              </a>
              <span className="opacity-75">, </span>
              <a
                role="button"
                className="fw-medium"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-html="true"
                data-bs-title='<div class="fw-medium small opacity-60">CUSTODIAL KEYS /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
              >
                custodial keys
              </a>
              <span className="opacity-75">
                {" "}
                (service operators could decrypt user&rsquo;s emails)
                or&nbsp;were{" "}
              </span>
              <a
                role="button"
                className="fw-medium"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-html="true"
                data-bs-title='<div class="fw-medium small opacity-60">CLOSED-SOURCE /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
              >
                closed-source
              </a>
              <span className="opacity-75">.</span>
            </p>
            <p className="opacity-75 mb-0">
              Having a&nbsp;programming and security background, 
                we&nbsp;decided to&nbsp;build a&nbsp;mailbox with zero-access encryption, 
                which ensures that no&nbsp;one but you can access your data.
            </p>
          </div>
          <div className="col-md-6 d-none d-md-block">
            <img className={styles.bg} src={MailumUI2Img} />
          </div>
        </div>
      </CardBanner>

      <Banner className="text-center">
        <img
          src={MissionImg}
          className={classNames(styles.missionImg, "d-none d-md-inline")}
        />
        <img
          src={MissionMobileImg}
          className={classNames(styles.missionMobileImg, "d-md-none")}
        />

        <h4 className='d-none d-md-block mb-3 fw-medium'>
          Our Mission is&nbsp;to&nbsp;Make Emails Private again
        </h4>
        <h3 className='d-md-none fw-medium mb-3'>
          Our Mission is&nbsp;to&nbsp;Make Emails Private again
        </h3>

        <p className='opacity-50'>
          Privacy is under a lot of pressure. Many powerful entities, such as
          NSA, are focused on <span className="fw-medium">erasing privacy</span>{" "}
          worldwide.
        </p>

        <p className="opacity-50">
          The good news is, that just as many, if not more businesses,
          journalists, activists and computer specialists are
          <span className="fw-medium">
            committed to keeping the Internet a safe place
          </span>{" "}
          free from surveillance.
        </p>
      </Banner>

      <CardBanner className='bg-secondary-subtle text-center'>
        <h3 className='d-none d-md-block fw-medium'>
          Join our mission and&nbsp;
          <span className='text-primary'>
            keep<br />
            your data in&nbsp;your own hands.
          </span>
        </h3>
        <h2 className='d-md-none fw-medium'>
          Join our mission to&nbsp;
          <span className='text-primary'>
            keep<br />
            your data in&nbsp;your own hands.
          </span>
        </h2>

        <p className="opacity-50">
          &laquo;Having nothing to&nbsp;hide&raquo; does not work anymore.
          <wbr /> Your internet activity is&nbsp;an&nbsp;asset used to&nbsp;influence your purchases, attention and votes.
          <wbr /> Email service can see what and when you buy, who you talk&nbsp;to, which websites you sign up&nbsp;at.
          <wbr /> Encrypted email service cannot access any of&nbsp;those information.
        </p>

        <a className="btn btn-primary wide fw-medium mt-2">Create Encrypted Email</a>
      </CardBanner>

      <Banner className={styles.technologyBanner}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 order-2 order-md-1">
            <h4 className='d-none d-lg-block fw-medium'>Don&rsquo;t Trust Our Servers?<br />Host It&nbsp;Yourself</h4>
            <h3 className='d-lg-none fw-medium'>Don&rsquo;t Trust Our Servers? Host It&nbsp;Yourself</h3>

            <p className="opacity-50">
              Our top priority while building Mailum was to create an email
              service that is <b>not based on reliance</b>. We came up with a
              solution named <a href="">“Local&nbsp;Code”</a>.
            </p>

            <p className="opacity-50">
              We provide users with the ability to host the Mailum website on
              their computers locally. This allows users to have an{" "}
              <b>absolute certainty</b> that scripts loaded by their browsers
              have neither been maliciously modified nor been altered.
            </p>
            <p className="fw-medium">
              The idea of open-source code is located deeply in our hearts, you
              can explore our GitHub:
            </p>

            <a href="" className="btn btn-primary wide">
              Get Source on GitHub
            </a>
          </div>
          <div className="col-12 col-md-6 order-md-2">
            <img className={styles.bg} src={TechnologyImg} />
          </div>
        </div>
      </Banner>

      <BestTimeBanner />

      <Banner className="text-center">
        <img src={ServerImg} className={styles.serverImg} />
        <h2 className='d-none d-md-block fw-medium mt-4'>Mailum Servers&rsquo; Location</h2>
        <h3 className='d-md-none mt-4'>Mailum Servers&rsquo; Location</h3>
        <p className="opacity-50">
          Our servers are located <span className="fw-medium">outside of&nbsp;14-eyes surveillance network</span>, specifically in&nbsp;Poland.
          We&nbsp;pick our locations carefully with privacy laws in&nbsp;mind.
        </p>
      </Banner>

      <BecomePremium />

      <Footer />
    </>
  );
}
