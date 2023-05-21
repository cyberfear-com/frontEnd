import classNames from 'classnames'
import Header from '@/components/Header.jsx'
import HomeBanner from '@/components/HomeBanner.jsx'
import JournalistsBanner from '@/components/JournalistsBanner.jsx'
import bestTimeLogosImg from '@/assets/best-time-logos.png'
import bestTimeLogosMobileImg from '@/assets/best-time-logos-mobile.png'
import lockImg from '@/assets/private-and-anonymous-email.png'
import { ReactComponent as BigCircleSVG } from '@/assets/big-circle.svg'
import { ReactComponent as Feature1SVG } from '@/assets/feature-1.svg'
import { ReactComponent as Feature2SVG } from '@/assets/feature-2.svg'
import { ReactComponent as Feature3SVG } from '@/assets/feature-3.svg'
import { ReactComponent as Feature4SVG } from '@/assets/feature-4.svg'
import { ReactComponent as Feature5SVG } from '@/assets/feature-5.svg'
import { ReactComponent as Feature6SVG } from '@/assets/feature-6.svg'
import { ReactComponent as Feature7SVG } from '@/assets/feature-7.svg'
import { ReactComponent as Feature8SVG } from '@/assets/feature-8.svg'
import { ReactComponent as Feature9SVG } from '@/assets/feature-9.svg'
import { ReactComponent as Feature10SVG } from '@/assets/feature-10.svg'
import { ReactComponent as TwitterLogoSVG } from '@/assets/twitter-logo.svg'
import { ReactComponent as FacebookLogoSVG } from '@/assets/facebook-logo.svg'
import { ReactComponent as RedditLogoSVG } from '@/assets/reddit-logo.svg'
import puzzleImg from '@/assets/puzzle.png'
import safeImg from '@/assets/safe.png'
import styles from './Home.module.scss'
import CardBanner from '../components/CardBanner'
import Footer from '../components/Footer';

const features = [
    { title: 'Zero-knowledge E2EE', image: Feature1SVG },
    { title: 'PGP support', image: Feature2SVG },
    { title: 'TOR support', image: Feature3SVG },
    { title: 'No ads', image: Feature4SVG },
    { title: 'No external trackers', image: Feature5SVG },
    { title: 'No IP-logs', image: Feature6SVG },
    { title: 'Offshore servers location', image: Feature7SVG },
    { title: 'Anonymous payment methods', image: Feature8SVG },
    { title: 'No KYC, no phone verifications', image: Feature9SVG },
    { title: 'Open-source code', image: Feature10SVG },
]

const socialLinks = [
    { title: 'Twitter', id: '@Mailum', icon: TwitterLogoSVG },
    { title: 'Facebook', id: '@Mailum', icon: FacebookLogoSVG },
    { title: 'Reddit', id: '@Mailum', icon: RedditLogoSVG }
]

export default function Home() {
    return (
        <>
            <Header variant="primary" />
            <HomeBanner />
            <JournalistsBanner />

            <CardBanner 
                className={classNames(styles.bestTime, 'bg-dark text-bg-dark')}
                footer={<img src={bestTimeLogosMobileImg} className='w-100 mt-4 d-md-none' />}
            >
                <div className='text-center'>
                    <h3>The best time to improve your privacy was yesterday,</h3>
                    <h2>The Second Best Time is Now!</h2>
                </div>

                <img src={bestTimeLogosImg} className='w-100 d-none d-md-block mt-5' />
            </CardBanner>

            <CardBanner className={classNames(styles.features, 'bg-secondary-subtle mt-md-4 user-select-none')}>
                {/* <img src={lockImg} className={styles.lockImg} /> */}

                {/* <div className={styles.circle} /> */}

                <div className='row'>
                    <div className='col-12 col-md-7 col-lg-6 order-2 order-md-1'>
                        <h1>Private and anonymous email</h1>

                        <p className='lead opacity-50'>
                            Our privacy is quickly becoming a thing of the past. 
                            Privacy enables you to control who can access information about your private life  and activities. Stand your ground and take it back.
                        </p>
                        <p className='lead fw-bold opacity-50'>
                            Mailum is committed to keeping the Internet an anonymous space free from surveillance.
                        </p>
                    </div>

                    <div className={classNames(
                        styles.lockImgRow,
                        'col-12 col-md-5 col-lg-6 order-1 d-flex align-items-start justify-content-center justify-content-md-end'
                    )}>
                        <img src={lockImg} className={styles.lockImg} />
                    </div>
                </div>

                <ul className={classNames(
                    styles.featureList, 
                    'list-unstyled mt-5 mb-n4 mb-sm-0 text-lg-center small fw-bold',
                    'row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-2 g-sm-3 g-xl-4'
                )}>
                {features.map(feature => (
                    <li>
                        <div className='card h-100 border-0'>
                            <div className='card-body d-flex d-lg-block align-items-center'>
                                <feature.image />
                                <div className='mt-lg-2 ms-3 ms-lg-0'>{feature.title}</div>
                            </div>
                        </div>
                    </li>
                ))}
                </ul>
            </CardBanner>

            <CardBanner className={classNames(styles.bottomSlider, 'bg-primary text-bg-primary')}>
                <div className='row justify-content-center'>
                    <div className='col-12 col-md-4 col-lg-3 d-flex align-items-center justify-content-center justify-content-md-end'>
                        <img src={puzzleImg} width='300' style={{maxWidth: '100%', height: 'auto'}} />
                    </div>
                    <div className='col-12 col-md-8 col-lg-6'>
                        <h1>The Most Air-Tight Encryption Available</h1>
                        <p className='lead opacity-50'>
                            Mailum is&nbsp;the only email service encrypting all 4&nbsp;elements of&nbsp;an&nbsp;email and its metadata.
                            While other services only encrypt the email body, we&nbsp;encrypt body, subject, sender, recipient, and timestamp to&nbsp;protect your online privacy from unauthorized access.
                        </p>
                    </div>
                </div>
            </CardBanner>

            <div className={classNames(styles.peaceOfMind, 'container my-5')}>
                <div className='row'>
                    <div className='col-12 col-md-7 col-lg-8 order-2 order-md-1 mt-3 mt-md-0'>
                        <h1>
                            <span className='text-primary'>Peace of Mind</span><br />
                            Without Relying on Trust!
                        </h1>

                        <p>
                            Our top priority while building Mailum was to&nbsp;create an&nbsp;email service that is&nbsp;not based on&nbsp;reliance. We&nbsp;came up&nbsp;with a&nbsp;solution named &laquo;Local Code&raquo;.
                        </p>
                        <p>
                            We&nbsp;provide users with the ability to&nbsp;host the Mailum website on&nbsp;their computers locally.
                            This allows users to&nbsp;have an&nbsp;absolute certainty that scripts loaded by&nbsp;their browsers have neither been maliciously modified nor been altered.
                        </p>
                    </div>
                    <div className='col-12 col-md-5 col-lg-4 d-flex justify-content-center align-items-center order-1'>
                        <img src={safeImg} style={{maxWidth:'100%'}} />
                    </div>
                </div>
            </div>

            <CardBanner className={classNames(styles.social, 'bg-dark text-bg-dark text-center my-5')}>
                <h1>
                    Join Us&nbsp;on&nbsp;Social Media<br />
                    We&rsquo;d love to&nbsp;have you here!
                </h1>

                <ul className='list-unstyled d-inline-flex flex-wrap justify-content-center mt-5'>
                {socialLinks.map(link => (
                    <li>
                        <a href='' className='btn p-3 d-inline-flex align-items-center justify-content-center' role='button'>
                            <link.icon />

                            <div className='text-start mx-3'>
                                <span>Follow Us on {link.title}</span><br />
                                <span className='strong'>{link.id}</span>
                            </div>
                        </a>
                    </li>
                ))}
                </ul>
            </CardBanner>
            

            <Footer />
        </>
    )
}