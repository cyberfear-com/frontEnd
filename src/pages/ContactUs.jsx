import classNames from 'classnames'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Banner from '@/components/Banner'
import styles from './ContactUs.module.scss'
import PhoneImg from '@/assets/phone.png'

export default function ContactUs() {
    return <div className={classNames('d-flex flex-column', styles.layout)}>
        <Header />

        <Banner className={classNames(styles.bgMobile, 'd-md-none text-bg-primary')}>
            <img src={PhoneImg} className={styles.phone} />
            <h4 className='lh-base'>
                If&nbsp;you need any help,<br />
                we&rsquo;re here to&nbsp;make<br />
                an&nbsp;amazing experience for you.
            </h4>
        </Banner>
        <Banner className='flex-grow-1 d-flex align-items-center'>
            <div className='row'>
                <div className='col-12 col-md-6'>
                    <h2 className='mb-3'>Contact Us</h2>
                    <p className='lead text-secondary'>
                        Please provide the email address so&nbsp;we&nbsp;can contact you
                    </p>

                    <form className='mt-5'>
                        <div className={classNames(styles.iconField, styles.email, 'form-floating mb-3')}>
                            <input type="email" className="form-control" id="email" placeholder="Enter your name" />
                            <label for="email">Enter your email address</label>
                        </div>
                        <div className={classNames(styles.question, 'mb-3')}>
                            <textarea className='form-control' id='question' rows='6' placeholder="Let's talk" />
                            <small className={classNames(styles.charLeft, 'opacity-40')}>800 characters left</small>
                        </div>
                        
                        <div className="d-grid mt-4">
                            <button type="submit" class="btn btn-primary btn-block">Send Message</button>
                        </div>
                    </form>
                </div>
                <div className={classNames(styles.bg, 'col-12 col-md-6 text-bg-primary d-none d-md-block')}>
                    <div className={classNames(styles.phoneWithText, 'text-center')}>
                        <img src={PhoneImg} className={styles.phone} />
                        <h4 className='mt-5'>If&nbsp;you need any help, we&rsquo;re here to&nbsp;make an&nbsp;amazing experience for you.</h4>
                    </div>
                </div>
            </div>
        </Banner>

        <Footer />
    </div>
}