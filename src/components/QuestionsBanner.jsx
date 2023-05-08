import classNames from 'classnames'
import styles from './QuestionsBanner.module.scss'

export default function QuestionBanner() {
    return (
        <div className={classNames(styles.banner, 'text-light rounded-5 text-center')}>
            <h1>You Have Different Questions?</h1>
            <p className="lead opacity-50 mt-3 mb-4">
                Our team will answer all your questions. get in touch if you need more help
            </p>

            <a href="mailto:Info@Mailum.com" className="btn btn-primary">Info@Mailum.com</a>
        </div>
    )
}