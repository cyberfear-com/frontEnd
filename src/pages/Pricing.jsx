import { useState } from 'react'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import CardBanner from '@/components/CardBanner.jsx'
import Banner from '@/components/Banner.jsx'
import styles from './Pricing.module.scss'
import classNames from 'classnames'

import MailumMainViewImg from '@/assets/mailum-main-view.png'
import Testimonials from '../components/Testimonials'
import BestTimeBanner from '../components/BestTimeBanner'
import CustomerReviews from '../components/CustomerReviews'
import BecomePremium from '../components/BecomePremium'

export default function Pricing() {

    const [period, setPeriod] = useState('monthly')

    return <>
        <Header />

        <CardBanner className='text-center'>
            <h1>
                Get Started Now, <span class='text-primary'>Pick a&nbsp;Plan</span>
            </h1>
            <p className='lead opacity-50 mb-4'>
                Protect confidential emails and information
            </p>

            <div className={classNames(styles.periodSelector, 'btn-group')} role='group'>
                <button 
                    type='button' 
                    className={classNames(styles.monthly, 'btn', period === 'monthly' && styles.active)}
                    onClick={() => setPeriod('monthly')}
                >Monthly</button>
                <button
                    type='button' 
                    className={classNames(styles.oneYear, 'btn', period === '1year' && styles.active)}
                    onClick={() => setPeriod('1year')}
                >
                    1 Year
                    <span className='badge ms-2'>Save 30%</span>
                </button>
                <button 
                    type='button' 
                    className={classNames(styles.twoYear, 'btn', period === '2year' && styles.active)}
                    onClick={() => setPeriod('2year')}
                >
                    2 Years
                    <span className='badge ms-2'>Save 40%</span>
                </button>
            </div>
        </CardBanner>

        <div className={classNames(styles.planCardsContainer, 'container')}>
            <div className='grid g-3'>
            {period === 'monthly' &&
                <div className='g-col-12 g-col-md-6 g-col-lg-3'>
                    <div className={classNames(styles.planCard, 'card h-100')}>
                        <div className='card-body p-4 d-flex flex-column'>
                            <h4 className='opacity-75 mb-4'>Free</h4>

                            <h2 className='fw-medium lh-1'>
                                $0.00
                                <span className='fs-6 fw-medium opacity-50 text-nowrap'>&nbsp;/&nbsp;month</span>
                            </h2>

                            <hr className='text-body-tertiary' />

                            <p className='fs-7 opacity-50'>
                                For most businesses that want to&nbsp;optimize web queries
                            </p>

                            <ul className={classNames(styles.features, 'list-unstyled small mb-5')}>
                                <li>All Limited Links</li>
                                <li>Own Analytics Platform</li>
                                <li>Chat Support</li>
                            </ul>

                            <div className='flex-grow-1'></div>{/* spacer */}

                            <button className='btn fw-normal text-center w-100 btn-outline-primary'>Try for Free</button>
                        </div>
                    </div>
                </div>
            }
                <div 
                    className={classNames(
                        'g-col-12',
                        period === 'monthly' ? 'g-col-md-6 g-col-lg-3' : 'g-col-md-4'
                    )}
                >
                    <div className={classNames(styles.planCard, 'card h-100')}>
                        <div className='card-body p-4 d-flex flex-column'>
                            <h4 className='opacity-75 mb-4'>Basic</h4>

                            <h2 className='fw-medium'>
                                $2.00
                                <span className='fs-6 fw-medium opacity-50 text-nowrap'>&nbsp;/&nbsp;month</span>
                            </h2>

                            <hr className='text-body-tertiary' />

                            <p className='fs-7 opacity-50'>
                                For most businesses that want to&nbsp;optimize web queries
                            </p>

                            <ul className={classNames(styles.features, 'list-unstyled small mb-5')}>
                                <li>All Limited Links</li>
                                <li>Own Analytics Platform</li>
                                <li>Chat Support</li>
                                <li>Optimize Hashtags</li>
                            </ul>

                            <div className='flex-grow-1'></div>{/* spacer */}

                            <button className='btn fw-normal text-center w-100 btn-outline-primary'>Get Started</button>
                        </div>
                    </div>
                </div>
                <div 
                    className={classNames(
                        'g-col-12', 
                        period === 'monthly' ? 'g-col-md-6 g-col-lg-3' : 'g-col-md-4'
                    )}
                >
                    <div className={classNames(styles.planCard, styles.featured, 'card h-100 text-bg-primary')}>
                        <div className='card-body p-4'>
                            <div className='d-flex align-items-center justify-content-between mb-4'>
                                <h4 className='opacity-75 m-0'>
                                    Medium
                                </h4>
                                <span className='badge bg-primary'>POPULAR</span>
                            </div>

                            <h2 className='fw-medium'>
                                $6.00
                                <span className='fs-6 fw-medium opacity-50 text-nowrap'>&nbsp;/&nbsp;month</span>
                            </h2>

                            <hr className='text-body-tertiary' />

                            <p className='fs-7 opacity-50'>
                                For most businesses that want to&nbsp;optimize web queries
                            </p>

                            <ul className={classNames(styles.features, 'list-unstyled small mb-5')}>
                                <li>All Limited Links</li>
                                <li>Own Analytics Platform</li>
                                <li>Chat Support</li>
                                <li>Optimize Hashtags</li>
                                <li>Unlimited Users</li>
                            </ul>

                            <button className='btn fw-normal text-center w-100 btn-light'>Choose plan</button>
                        </div>
                    </div>
                </div>
                <div 
                    className={classNames(
                        'g-col-12', 
                        period === 'monthly' ? 'g-col-md-6 g-col-lg-3' : 'g-col-md-4'
                    )}
                >
                    <div className={classNames(styles.planCard, 'card h-100')}>
                        <div className='card-body p-4 d-flex flex-column'>
                            <h4 className='opacity-75 mb-4'>Pro</h4>

                            <h2 className='fw-medium'>
                                $12.00
                                <span className='fs-6 fw-medium opacity-50 text-nowrap'>&nbsp;/&nbsp;month</span>
                            </h2>

                            <hr className='text-body-tertiary' />

                            <p className='fs-7 opacity-50'>
                                For most businesses that want to&nbsp;optimize web queries
                            </p>

                            <ul className={classNames(styles.features, 'list-unstyled small mb-5')}>
                                <li>All Limited Links</li>
                                <li>Own Analytics Platform</li>
                                <li>Chat Support</li>
                                <li>Optimize Hashtags</li>
                                <li>Unlimited Users</li>
                            </ul>

                            <div className='flex-grow-1'></div>{/* spacer */}

                            <button className='btn fw-normal text-center w-100 btn-outline-primary'>Choose plan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CardBanner 
            className={classNames(styles.banner1, 'bg-primary text-bg-primary')}
            style={{
                border: 'solid 6px var(--bs-primary)'
            }}
        >
            <div className='row'>
                <div className='col-12 col-md-6 order-2 order-md-1'>
                    <h2 className='fw-medium'>
                        Private and<br />
                        Anonymous Email
                    </h2>

                    <p className='opacity-50'>
                        Our privacy is&nbsp;quickly becoming a&nbsp;thing of&nbsp;the past.<br />
                        Privacy enables you to&nbsp;control who can access information about your private life and activities.
                        Stand your ground and take it&nbsp;back. 
                    </p>
                    <p className='opacity-50 mb-0'>
                        Mailum is&nbsp;committed to&nbsp;keeping the Internet an&nbsp;anonymous space free from surveillance.
                    </p>
                </div>
                <div className='col-12 col-md-6 order-1 order-md-2' style={{position: 'relative'}}>
                    <img className={styles.bg} src={MailumMainViewImg} />
                </div>
            </div>
        </CardBanner>

        <Testimonials />

        <BestTimeBanner />

        <CustomerReviews />

        <BecomePremium />


        <Footer />
    </>
}