import { useRef, useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import Header from '@/components/Header.jsx'
import HeroBanner from '@/components/HeroBanner.jsx'
import QuestionsBanner from '@/components/QuestionsBanner.jsx'
import NeedMoreHelpForm from '@/components/NeedMoreHelpForm.jsx'
import Footer from '@/components/Footer.jsx'
import SocialBanner from '@/components/SocialBanner.jsx'
import styles from './FAQ.module.scss'

import faqGroups from './faq.json'

import { ReactComponent as Icon1SVG } from '@/assets/faq-1.svg'
import { ReactComponent as Icon2SVG } from '@/assets/faq-2.svg'
import { ReactComponent as Icon3SVG } from '@/assets/faq-3.svg'
import { ReactComponent as Icon4SVG } from '@/assets/faq-4.svg'
import { ReactComponent as Icon5SVG } from '@/assets/faq-5.svg'

const icons = [
    Icon1SVG,
    Icon2SVG,
    Icon3SVG,
    Icon4SVG,
    Icon5SVG
]

export default function FAQ() {
    const modalRef = useRef(null)
    const [modal, setModal] = useState(null)
    const [groupAt, setGroupAt] = useState(null)
    const [questionAt, setQuestionAt] = useState(null)

    const otherQuestions = useMemo(() => faqGroups[groupAt]?.questions.filter((item, index) => index !== questionAt) , [groupAt, questionAt]) || []

    const CurrentGroupIcon = icons[groupAt] || icons[0]

    console.log('FAQ')

    useEffect(() => {
        console.log('useEffect')
        initModal()

        async function initModal() {
            console.warn('initModal')
            await import('bootstrap/js/src/collapse')
            const Modal = (await import('bootstrap/js/src/modal')).default
            console.warn('initModal', Modal, modalRef.current)
            const modal = new Modal(modalRef.current, {
                keyboard: true
            })
            setModal(modal)
        }
    }, [])

    return (
        <>
            <div className='modal' ref={modalRef} tabIndex={-1}>
                <div className='modal-dialog modal-xl'>
                    <div className='modal-content'>
                        <div className='modal-body p-5'>
                        {groupAt !== null ? 
                        <>
                            <header className='d-flex'>
                                <CurrentGroupIcon className='flex-shrink-0' />
                                <div className='flex-grow-1 ms-4 fw-medium'>
                                    <div className='small opacity-40'>FAQ /</div>
                                    <div>{faqGroups[groupAt].title}</div>
                                </div>

                                <button 
                                    type='button' 
                                    class='btn-close' 
                                    aria-label='Close'
                                    onClick={() => modal.hide()}
                                />
                            </header>

                            <div className='card mt-4'>
                                <div className='card-body'>
                                    <h4 className='card-title'>{faqGroups[groupAt].questions[questionAt].question}</h4>
                                    <p>{faqGroups[groupAt].questions[questionAt].answer}</p>
                                </div>
                            </div>

                        {otherQuestions.map((question, index) => (
                            <div className='card mt-2' key={index}>
                                <div className='card-body py-4'>
                                    <h6
                                        className={classNames(styles.cardToggle, 'card-title mb-0 collapsed')}
                                        data-bs-toggle='collapse'
                                        data-bs-target={`#q${index}`}
                                        role='button'

                                    >{question.question}</h6>
                                    <p
                                        className='collapse mt-2'
                                        id={`q${index}`}
                                    >{question.answer}</p>
                                </div>
                            </div>
                        ))}
                        </>
                        : null}
                        </div>
                    </div>
                </div>
            </div>

            <Header />
            <div className="py-3" />
            <main class="container">
                <HeroBanner />

                <div class="py-4"></div>

                <div className={classNames('container', styles.groups)}>
                    <div className="row row-cols-3 mx-5">
                        {faqGroups.map((group, index) => {
                            const Icon = icons[index]
                            return (
                                <div className="col mt-4">
                                    <div className='card h-100'>
                                        <div className="card-body text-left">
                                            <Icon />
                                            <h4 className="card-title mt-3">
                                                {group.title}
                                                <sup className="text-body-tertiary ms-2 fw-medium">({group.questions.length})</sup>
                                            </h4>
                                            <ul className={classNames(styles.questions, 'card-text list-unstyled mt-4')}>
                                                {group.questions.map((item, itemIndex) => (
                                                    <li 
                                                        key={itemIndex} 
                                                        role='button'
                                                        onClick={() => {
                                                            setGroupAt(index)
                                                            setQuestionAt(itemIndex)
                                                            modal.show()
                                                        }} 
                                                        className='opacity-60'>
                                                        <span>{item.question}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="py-4"></div>

                <QuestionsBanner />

                <div className="row col-cols-2 mx-5 my-5 pt-5 align-items-center">
                    <div className="col">
                        <NeedMoreHelpForm />
                    </div>
                    <div className="col">
                        <SocialBanner />
                    </div>
                </div>
            </main>

            <div className={classNames(styles.becomeAPremium, 'bg-primary text-light')}>
                <div className="container text-center p-5">
                    <div className="m-4">
                        <h1>
                            Become a Premium Member and<br />
                            Unlock All Premium Features
                        </h1>

                        <p className="lead opacity-50 mt-3 mb-4 pb-2">Choose the best fitting plan, or create a forever-free account!</p>

                        <a href="" className="btn btn-lg btn-light small"><strong>Sign up Now</strong></a>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}