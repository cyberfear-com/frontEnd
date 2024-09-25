import classNames from 'classnames'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Banner from '@/components/Banner'
import styles from './ContactUs.module.scss'
import PhoneImg from '@/assets/phone.png'

export default function Signup() {

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
                    <h3 className='mb-3'>SignUp  for Newsletter</h3>
                    <p className='lead opacity-50'>
                        Please provide the email for newsletter
                    </p>

                    <form className='mt-5' action="api/submitNewsletter" method="POST">
                        <div className={classNames(styles.iconField, styles.email, 'mb-3')}>
                            <input
                                type='email'
                                className='form-control'
                                id='email'
                                name="email"
                                placeholder='Enter your email address'
                            />
                        </div>

                        <div className='d-grid mt-4'>
                            <button disabled={false} type='submit' className='btn btn-primary btn-block'>Submit</button>
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
