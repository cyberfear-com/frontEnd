import classNames from 'classnames'
import styles from './CardBanner.module.scss'

export default function CardBanner({ className, children, footer }) {
    return (
        <div className='container-fluid'>
            <div className={classNames('rounded-5', styles.banner, className)}>
                <div className='container'>
                    {children}
                </div>
                { footer }
            </div>
        </div>
    )
}