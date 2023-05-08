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
            <div className="container p-5">
                <div className="row justify-content-between">
                    <div className="col-4 d-flex">
                        <img src={mailumLarge} width="150" height="63" className="mt-3" />
                        <p className="lead opacity-50 ms-5">
                            Protect confidential emails and information with open-source,  most complete encryption that ensures your data  is safeguarded from start to finish.
                        </p>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-3">
                                <h6>Resources</h6>
                                <ul class="list-unstyled small opacity-50">
                                    <li><a href="">Help Center</a></li>
                                    <li><a href="">FAQ</a></li>
                                    <li><a href="">Blog</a></li>
                                </ul>
                            </div>
                            <div className="col-3">
                                <h6>Resources</h6>
                                <ul class="list-unstyled small opacity-50">
                                    <li><a href="">Help Center</a></li>
                                    <li><a href="">FAQ</a></li>
                                </ul>
                            </div>
                            <div className="col-6">
                                <h6>Payment Methods</h6>
                                <img src={paymentMethods} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-top">
                <div className="container py-4 px-5">
                    <div className="d-flex justify-content-between small">
                        <div>
                            <small className="opacity-50">© 2020-2022, Cyberfear. All rights reserved.</small>
                        </div>
                        <div>
                            <ul className="d-flex list-unstyled opacity-50 m-0">
                                <li><a href=""><img src={twitterSmallIcon} /></a></li>
                                <li className="ms-4"><a href=""><img src={facebookSmallIcon} /></a></li>
                                <li className="ms-4"><a href=""><img src={redditSmallIcon} /></a></li>
                            </ul>
                        </div>
                        <div>
                            <ul className="d-flex list-unstyled small opacity-50 m-0">
                                <li><a href="">GitHub</a></li>
                                <li className="ms-4"><a href="">Blog</a></li>
                                <li className="ms-4"><a href="">Privacy Policy</a></li>
                                <li className="ms-4"><a href="">Terms & Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}