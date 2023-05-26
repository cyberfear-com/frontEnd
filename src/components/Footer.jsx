import classNames from 'classnames'
import mailumLarge from '@/assets/mailum-large.svg'
import paymentMethods from '@/assets/payment-methods.svg'
import twitterSmallIcon from '@/assets/twitter-small-icon.svg'
import facebookSmallIcon from '@/assets/facebook-small-icon.svg'
import redditSmallIcon from '@/assets/reddit-small-icon.svg'
import styles from './Footer.module.scss'

export default function Footer() {
    return (
        <div className={classNames('text-light', styles.footer)}>
            <div className='container py-5  '>
                <div className="row justify-content-between">
                    <div className="col-12 col-lg-5 d-flex"> 
                        <img src={mailumLarge} width="80" height="71" className="mt-2" />
                        <p className="opacity-50 ms-5 small mt-1 mt-lg-0">
                            Protect confidential emails and information with open-source,  most complete encryption that ensures your data  is safeguarded from start to finish.
                        </p>
                    </div>
                    <div className="col-12 col-lg-7 mt-5 mt-lg-0">
                        <div className="d-flex row g-3 text-nowrap">
                            <div className="col flex-shrink-0">
                                <h6 className='small fw-medium'>Resources</h6>
                                <ul className={classNames(styles.links, 'list-unstyled small opacity-50')}>
                                    <li><a href="">Help Center</a></li>
                                    <li className='mt-2'><a href="">FAQ</a></li>
                                    <li className='mt-2'><a href="">Blog</a></li>
                                </ul>
                            </div>
                            <div className="col flex-shrink-0">
                                <h6 className='small fw-medium'>About</h6>
                                <ul class={classNames(styles.links, 'list-unstyled small opacity-50')}>
                                    <li><a href="">Help Center</a></li>
                                    <li className='mt-2'><a href="">FAQ</a></li>
                                </ul>
                            </div>
                            <div className="col flex-grow-1">
                                <h6 className='small fw-medium'>Payment Methods</h6>
                                <img src={paymentMethods} style={{maxWidth: '100%', minWidth: '200px'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-top border-light border-opacity-10">
                <div className="container pb-4">
                    <div className='d-flex flex-wrap justify-content-between small mx-n2'>
                        <div className='mt-4 px-2'>
                            <small className="opacity-50">© 2020-2022, Cyberfear. All rights reserved.</small>
                        </div>
                        <div className='mt-4 px-2'>
                            <ul className="d-flex list-unstyled opacity-50 m-0">
                                <li><a href=""><img src={twitterSmallIcon} /></a></li>
                                <li className="ms-4"><a href=""><img src={facebookSmallIcon} /></a></li>
                                <li className="ms-4"><a href=""><img src={redditSmallIcon} /></a></li>
                            </ul>
                        </div>
                        <div className='mt-4 px-2'>
                            <ul className="d-flex list-unstyled small opacity-50 m-0">
                                <li className='me-3'><a href="">GitHub</a></li>
                                <li className='me-3'><a href="">Blog</a></li>
                                <li className='me-3'><a href="">Privacy Policy</a></li>
                                <li><a href="">Terms & Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}