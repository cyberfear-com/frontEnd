import classNames from 'classnames'
import Header from '@/components/Header.jsx'
import HomeBanner from '@/components/HomeBanner.jsx'
import JournalistsBanner from '@/components/JournalistsBanner.jsx'
import { ReactComponent as BestTimeLogosSVG } from '@/assets/best-time-logos.svg'
import lockImg from '@/assets/private-and-anonymous-email.png'
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
import styles from './Home.module.scss'

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

export default function Home() {
    return (
        <>
            <Header variant="primary" />
            <HomeBanner />
            <JournalistsBanner />
            <div className={classNames('container', styles.bestTime)}>
                <div className={classNames('bg-dark text-bg-dark rounded-5 text-center', styles.frame)}>
                    <h3>The best time to improve your privacy was yesterday,</h3>
                    <h2>The Second Best Time is Now!</h2>
                    <BestTimeLogosSVG className='mt-5' />
                </div>
            </div>

            <div class="container">
                <section className={classNames(styles.features, 'bg-secondary-subtle mt-4 rounded-5 user-select-none')}>
                    <img src={lockImg} className={styles.lockImg} />
                    <div className='col-6'>
                        <h1>Private and anonymous email</h1>

                        <p className='lead opacity-50'>
                            Our privacy is quickly becoming a thing of the past. 
                            Privacy enables you to control who can access information about your private life  and activities. Stand your ground and take it back.
                        </p>
                        <p className='lead fw-bold opacity-50'>
                            Mailum is committed to keeping the Internet an anonymous space free from surveillance.
                        </p>
                    </div>

                    <ul className={classNames(styles.featureList, 'list-unstyled row row-cols-1 row-cols-md-2 row-cols-xl-5 text-center small fw-bold g-3')}>
                    {features.map(feature => (
                        <li>
                            <div className='card h-100 border-0'>
                                <div className='card-body'>
                                    <feature.image />
                                    <div className='mt-2'>{feature.title}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                </section>
            </div>

            <div className='container'>
                <section className={classNames(styles.airTight, 'bg-primary mt-4 rounded-5')}>
                    <div class="row">
                        <div class="col-4">
                            
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}