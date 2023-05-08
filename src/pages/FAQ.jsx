import classNames from 'classnames'
import Header from '@/components/Header.jsx'
import HeroBanner from '@/components/HeroBanner.jsx'
import QuestionsBanner from '@/components/QuestionsBanner.jsx'
import NeedMoreHelpForm from '@/components/NeedMoreHelpForm.jsx'
import Footer from '@/components/Footer.jsx'
import SocialBanner from '@/components/SocialBanner.jsx'
import faqIcon from '@/assets/faq-icon.svg'
import styles from './FAQ.module.scss'

import faqGroups from './faq.json'

export default function FAQ() {
    return (
        <>
            <Header /> 
            <div className="py-5"/>
            <main class="container">    
                <HeroBanner />

                <div class="py-4"></div>

                <div className={classNames('container', styles.groups)}>
                    <div className="row row-cols-3 mx-5">
                    {faqGroups.map(group => (
                        <div className="col mt-4">
                            <div className="card">
                                <div className="card-body text-left">
                                    <img src={faqIcon} class="mb-2" />
                                    <h5 className="card-title">
                                        {group.title}
                                        <sup className="text-body-tertiary ms-2">({group.questions.length})</sup>
                                    </h5>
                                    <ul className={classNames("card-text list-unstyled", styles.questions)}>
                                    {group.questions.map((item, index) => (
                                        <li key={index} onClick={() => console.log('expand')} role="button">{item.question}</li>
                                    ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="py-4"></div>

                <QuestionsBanner />

                <div className="row col-cols-2 mx-5 my-5">
                    <div className="col">
                        <NeedMoreHelpForm />
                    </div>
                    <div className="col">
                        <SocialBanner />
                    </div>
                </div>
            </main>
            <div className="bg-primary text-light">
                <div className="container text-center p-5">
                    <div className="m-4">
                        <h1>
                            Become a Premium Member and<br />
                            Unlock All Premium Features
                        </h1>
                        
                        <p className="lead opacity-50 mt-3 mb-4">Choose the best fitting plan, or create a forever-free account!</p>

                        <a href="" className="btn btn-lg btn-light"><strong>Sign up Now</strong></a>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}