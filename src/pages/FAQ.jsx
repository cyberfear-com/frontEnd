import { useRef, useState, useEffect, useMemo, useId } from "react";
import classNames from "classnames";
import Header from "@/components/Header.jsx";
import CardBanner from "@/components/CardBanner.jsx";
import lunr from "lunr";

import QuestionsBanner from "@/components/QuestionsBanner.jsx";
import NeedMoreHelpForm from "@/components/NeedMoreHelpForm.jsx";
import Footer from "@/components/Footer.jsx";
import SocialBanner from "@/components/SocialBanner.jsx";
import styles from "./FAQ.module.scss";

import faqGroups from "./faq.json";

import { ReactComponent as Icon1SVG } from "@/assets/faq-1.svg";
import { ReactComponent as Icon2SVG } from "@/assets/faq-2.svg";
import { ReactComponent as Icon3SVG } from "@/assets/faq-3.svg";
import { ReactComponent as Icon4SVG } from "@/assets/faq-4.svg";
import { ReactComponent as Icon5SVG } from "@/assets/faq-5.svg";

import specularImg from "@/assets/specular.png";
import { ReactComponent as RarrIconSVG } from "@/assets/rarr-icon.svg";
import { ReactComponent as CrossIconSVG } from "@/assets/cross-icon.svg";

const icons = [Icon1SVG, Icon2SVG, Icon3SVG, Icon4SVG, Icon5SVG];

let idGenerator = 1;
const faqMap = {};
const index = lunr(function () {
  this.field("question");
  this.field("answer");
  this.ref("id");

  for (const [groupAt, group] of faqGroups.entries()) {
    group.index = groupAt;
    for (const [questionAt, question] of group.questions.entries()) {
      question.id = idGenerator++;
      question.group = group;
      question.index = questionAt;
      faqMap[question.id] = question;
      this.add(question);
    }
  }
});

export default function FAQ() {
  const modalRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [groupAt, setGroupAt] = useState(null);
  const [questionAt, setQuestionAt] = useState(null);

  const otherQuestions =
    useMemo(
      () =>
        faqGroups[groupAt]?.questions.filter(
          (item, index) => index !== questionAt
        ),
      [groupAt, questionAt]
    ) || [];

  const CurrentGroupIcon = icons[groupAt] || icons[0];

  useEffect(() => {
    initModal();

    async function initModal() {
      await import("bootstrap/js/src/collapse");
      const Modal = (await import("bootstrap/js/src/modal")).default;
      const modal = new Modal(modalRef.current, {
        keyboard: true,
      });
      setModal(modal);
    }
  }, []);

  const [isActive, setIsActive] = useState(false); // TODO remove placeholder
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  function isSearchActive() {
    return query.length >= 3;
  }

  const suggestionsRef = useRef(null);

  function triggerSearch() {
    if (!isSearchActive()) return;

    const matches = index.search(query).splice(0, 10);
    setSearchResults(matches.map(({ ref }) => faqMap[ref]));
  }

  useEffect(() => {
    triggerSearch();
  }, [query]);

  return (
    <>
      <Header />

      <CardBanner
        className={classNames(
          styles.banner,
          "bg-primary text-light rounded-5 text-center"
        )}
        containerClassName={classNames(
          styles.bannerWrapper,
          (isActive || isSearchActive()) && styles.active
        )}
      >
        <div className={styles.collapse}>
          <div className={classNames(styles.bg, "rounded-5 user-select-none")}>
            <img
              src={specularImg}
              className={classNames(styles.specular, styles.left)}
            />
            <img
              src={specularImg}
              className={classNames(styles.specular, styles.right)}
            />
          </div>

          <h1 className='d-none d-md-block'>How Can We&nbsp;Help You?</h1>
          <h1 className='d-md-none fw-medium'>How Can We&nbsp;Help You?</h1>

          <p className="lead opacity-50 mt-3 mb-4">
            Below you’ll find answers to the questions we
            <br />
            get asked the most about the Mailum.
          </p>
        </div>

        <div
          ref={suggestionsRef}
          className={classNames(
            styles.search,
            "mx-auto",
            (isActive || isSearchActive()) && styles.active
          )}
        >
          <input
            type='text'
            className='form-control bg-primary text-bg-primary'
            placeholder='What can we help you with?'
            onFocus={(e) => {
              setIsActive(true);
              triggerSearch();
            }}
            onBlur={() => {
              setTimeout(() => setIsActive(false), 100);
            }}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <CrossIconSVG
            className={styles.reset}
            role="button"
            onClick={() => {
              setQuery("");
            }}
          />

          {searchResults && (
            <div
              className={classNames(
                styles.suggestions,
                "card position-absolute text-start",
                !isSearchActive() && styles.hidden
              )}
            >
              <div className="card-body">
                {searchResults.length > 0 ? (
                  <ul className={classNames(styles.items, "list-unstyled m-0")}>
                    {searchResults.map((question, index) => (
                      <li
                        key={question.id}
                        className={classNames(
                          "small py-3",
                          index > 0 && "border-top"
                        )}
                        role="button"
                        onClick={() => {
                          setGroupAt(question.group.index);
                          setQuestionAt(question.index);
                          modal.show();
                        }}
                      >
                        <p className="text-truncate m-0">
                          <span className="badge">{question.group.title}</span>
                          <span className="content ms-2">
                            {question.question}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="small opacity-50 my-3">No results.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardBanner>

      <div className={classNames("container mt-3 mb-2 mb-md-4", styles.groups)}>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {faqGroups.map((group, index) => {
            const Icon = icons[index];
            return (
              <div className="col mt-2 mt-md-4">
                <div className="card h-100">
                  <div className="card-body text-left">
                    <div
                      data-bs-toggle="collapse"
                      data-bs-target={`#g${index}`}
                      role="button"
                      className={classNames(styles.header, "collapsed")}
                    >
                      <Icon className={styles.icon} />
                      <h5
                        className={classNames(
                          styles.title,
                          'fw-medium card-title mt-md-3 mb-0 ms-2 ms-md-0 flex-grow-1'
                        )}
                      >
                        {group.title}
                        <sup className='h6 text-body-tertiary ms-2 fw-medium d-none d-md-inline'>
                          ({group.questions.length})
                        </sup>
                      </h5>
                    </div>
                    <ul
                      id={`g${index}`}
                      className={classNames(
                        styles.questions,
                        "card-text list-unstyled mt-4 collapse"
                      )}
                    >
                      {group.questions.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          role="button"
                          onClick={() => {
                            setGroupAt(index);
                            setQuestionAt(itemIndex);
                            modal.show();
                          }}
                          className="opacity-50"
                        >
                          <span>{item.question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuestionsBanner />

      <div className="container my-4 my-md-5">
        <div className="row row-cols-1 row-cols-lg-2 mx-lg-5 my-5 my-lg-6 align-items-center">
          <div className="col">
            <div className="mx-3 mx-md-4 mx-lg-0">
              <NeedMoreHelpForm />
            </div>
          </div>
          <div className="col mt-5 mt-lg-0 p-lg-5">
            <SocialBanner />
          </div>
        </div>
      </div>

      <div className='bg-primary text-light'>
        <div className="container text-center py-5">
          <div className="m-4">

            <h4 className='d-none d-md-block fw-medium'>
              Become a&nbsp;Premium Member and
              <br />
              Unlock All Premium Features
            </h4>
            <h3 className='fw-medium d-md-none'>
              Become a&nbsp;Premium Member and Unlock so&nbsp;many secure
              feature
            </h3>

            <p className='opacity-50 mt-3 mb-4 pb-2'>
              <span className='d-none d-md-inline'>
                Choose the best fitting plan, or&nbsp;create a&nbsp;forever-free
                account!
              </span>
              <span className='d-md-none'>
                Choose the best fitting plan, any upgrade plan is&nbsp;FREE for
                7&nbsp;DAYS!
              </span>
            </p>

            <a href='' className='btn btn-light small fw-bold'>
              <span className='d-none d-md-inline'>Sign up Now</span>
              <span className='d-md-none'>Upgrade Now</span>
            </a>
          </div>
        </div>
      </div>
      <div className="modal" ref={modalRef} tabIndex={-1}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-body p-3 p-md-5">
              {groupAt !== null ? (
                <>
                  <header className="d-flex">
                    <CurrentGroupIcon className="flex-shrink-0" />
                    <div className="flex-grow-1 ms-2 ms-md-4 fw-medium">
                      <div className="small opacity-40">FAQ /</div>
                      <div>{faqGroups[groupAt].title}</div>
                    </div>

                    <button
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                      onClick={() => modal.hide()}
                    />
                  </header>

                  <div className="card mt-3 mt-md-4">
                    <div className="card-body">
                      <h4 className="card-title">
                        {faqGroups[groupAt].questions[questionAt].question}
                      </h4>
                      <p className="mb-0">
                        {faqGroups[groupAt].questions[questionAt].answer}
                      </p>
                    </div>
                  </div>

                  {otherQuestions.map((question, index) => (
                    <div className="card mt-2" key={index}>
                      <div className="card-body py-4">
                        <h6
                          className={classNames(
                            styles.cardToggle,
                            "card-title mb-0 collapsed"
                          )}
                          data-bs-toggle="collapse"
                          data-bs-target={`#q${index}`}
                          role="button"
                        >
                          {question.question}
                        </h6>
                        <p className="collapse mt-2 mb-0" id={`q${index}`}>
                          {question.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
