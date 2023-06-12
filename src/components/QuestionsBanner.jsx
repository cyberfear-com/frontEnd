import classNames from 'classnames'
import CardBanner from './CardBanner'
import styles from './QuestionsBanner.module.scss'

export default function QuestionBanner() {
    return (
        <CardBanner className={classNames(styles.banner, 'text-light rounded-5 text-center')}>
            <h3 className='d-none d-md-block fw-medium'>You Have Different Questions?</h3>
            <h2 className='d-md-none'>You Have Different Questions?</h2>

            <p className="opacity-50 mt-3 mb-4">
                Our team will answer all your questions. get in touch if you need more help
            </p>

            <a href="mailto:info@mailum.com" className="btn btn-primary">info@mailum.com</a>
        </CardBanner>
    )
}