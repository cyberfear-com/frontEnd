import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Banner from '@/components/Banner'
import CardBanner from '@/components/CardBanner'
import BestTimeBanner from '@/components/BestTimeBanner'
import BecomePremium from '@/components/BecomePremium'
import MailumUI2Img from '@/assets/mailum-ui-2.png'
import MailumUI3Img from '@/assets/mailum-ui-3.png'
import MissionImg from '@/assets/mission.png'
import MissionMobileImg from '@/assets/mission-mobile.png'
import TechnologyImg from '@/assets/technology.png'
import ServerImg from '@/assets/server.png'
import styles from './Company.module.scss'

import Tooltip from 'bootstrap/js/src/tooltip'

export default function Company() {
    const tooltipsContainerRef = useRef(null)

    return <>
        <Header />

        <Banner className='text-center'>
            <h1>
                <span className='text-primary'>Peace of&nbsp;Mind</span><br />
                Without Relying on&nbsp;Trust
            </h1>

            <p className='lead opacity-50'>
                Mailum is&nbsp;committed to&nbsp;keeping the Internet an&nbsp;anonymous space free from surveillance.
            </p>
        </Banner>

        <CardBanner className={classNames(styles.storyBanner, 'bg-primary text-bg-primary')}>
            <div className='row' ref={tooltipsContainerRef}>
                <div className='d-md-none col-12'>
                    <img className={classNames(styles.mobileBg, 'mb-3')} src={MailumUI3Img} />
                </div>
                <div className='col-12 col-md-6'>
                    <h1 className='mb-3'>
                        The Mailum Story
                    </h1>

                    <p>
                        <span className='opacity-75'>We&nbsp;wanted to&nbsp;have an&nbsp;absolute certainty that our emails remain private and inaccessible to&nbsp;third party. 
                        Unfortunately, every service we&nbsp;looked&nbsp;at, had some crucial </span> 
                        <a
                            role='button'
                            className='fw-medium'
                            data-bs-toggle='tooltip'
                            data-bs-placement='auto'
                            data-bs-html='true'
                            data-bs-title='<div class="fw-medium small opacity-60">DRAWBACKS /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
                        >drawbacks</a>
                        <span className='opacity-75'>. It&nbsp;was either incomplete </span>
                        <a 
                            role='button'
                            className='fw-medium'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            data-bs-html='true'
                            data-bs-title='<div class="fw-medium small opacity-60">ENCRYPTION /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>' 
                        >encryption</a>
                        <span className='opacity-75'>, </span> 
                        <a 
                            role='button'
                            className='fw-medium'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            data-bs-html='true'
                            data-bs-title='<div class="fw-medium small opacity-60">IP-LOGS /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
                        >IP-logs</a>
                        <span className='opacity-75'>, </span>
                        <a
                            role='button'
                            className='fw-medium'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            data-bs-html='true'
                            data-bs-title='<div class="fw-medium small opacity-60">CUSTODIAL KEYS /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
                        >custodial keys</a><span className='opacity-75'> (service operators could decrypt user&rsquo;s emails) or&nbsp;were </span>
                        <a
                            role='button'
                            className='fw-medium'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            data-bs-html='true'
                            data-bs-title='<div class="fw-medium small opacity-60">CLOSED-SOURCE /</div><div class="fw-medium">Quaerat sequi et cupiditate possimus unde doloribus quia voluptatibus magnam</div>'
                        >closed-source</a>
                        <span className='opacity-75'>.</span>
                    </p>
                    <p className='opacity-75 mb-0'>
                        Having a&nbsp;programming and security background, we&nbsp;decided to&nbsp;create Mailum&nbsp;&mdash; an&nbsp;open source secure email.
                    </p>
                </div>
                <div className='col-md-6 d-none d-md-block'>
                    <img className={styles.bg} src={MailumUI2Img} />
                </div>
            </div>
        </CardBanner>

        <Banner className='text-center'>
            <img src={MissionImg} className={classNames(styles.missionImg, 'd-none d-md-inline')} />
            <img src={MissionMobileImg} className={classNames(styles.missionMobileImg, 'd-md-none')} />

            <h1 className='mb-3'>
                Our Mission is&nbsp;to&nbsp;Make Emails Private again
            </h1>

            <p className='opacity-50'>
                Privacy is under a lot of pressure. 
                Many powerful entities, such as NSA, are focused on <span className='fw-medium'>erasing privacy</span> worldwide. 
            </p>

            <p className='opacity-50'>
                The good news is, that just as many, if not more businesses, journalists, activists and computer specialists are 
                <span className='fw-medium'>committed to keeping the Internet a safe place</span> free from surveillance.
            </p>
        </Banner>

        <CardBanner className='bg-secondary-subtle text-center'>
            <h2 className='fw-medium'>
                Join our mission to&nbsp;<span className='text-primary'>keeping the Internet<br />
                an&nbsp;anonymous space free from surveillance.</span>
            </h2>

            <p className='opacity-50'>
                Choose the best fitting plan, or create a forever-free account
            </p>

            <a className='btn btn-primary wide fw-medium'>Sign up Now</a>
        </CardBanner>

        <Banner className={styles.technologyBanner}>
            <div className='row g-3 align-items-center'>
                <div className='col-12 col-md-6 order-2 order-md-1'>
                    <h1>Mailum Technologies</h1>
                    <p className='opacity-50'>
                        Our top priority while building Mailum was to create an email service that is <b>not based on reliance</b>.
                        We came up with a solution named <a href="">“Local&nbsp;Code”</a>.
                    </p>

                    <p className='opacity-50'> 
                        We provide users with the ability to host the Mailum website on their computers locally. 
                        This allows users to have an <b>absolute certainty</b> that scripts loaded by their browsers have neither been maliciously modified nor been altered. 
                    </p>
                    <p className='fw-medium'> 
                        The idea of open-source code is located deeply in our hearts, you can explore our GitHub:
                    </p>

                    <a href="" className='btn btn-primary wide'>See Source on Github</a>
                </div>
                <div className='col-12 col-md-6 order-md-2'>
                    <img className={styles.bg} src={TechnologyImg} />
                </div>
            </div>
        </Banner>

        <BestTimeBanner />

        <Banner className='text-center'>
            <img src={ServerImg} className={styles.serverImg} />
            <h1 className='fw-medium mt-4'>Mailum Servers&rsquo; Location</h1>
            <p className='opacity-50'>
                Our servers are located <span className='fw-medium'>outside of 14-eyes surveillance network</span>, specifically in Hungary, Europe.
                We pick our locations carefully with privacy laws in mind.
            </p>
        </Banner>

        <BecomePremium />

        <Footer />
    </>
}