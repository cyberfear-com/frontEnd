import classNames from 'classnames'
import styles from './CardBanner.module.scss'

export default function CardBanner({ className, style, containerClassName, children, footer }) {
    return (
        <div className={classNames('container-fluid', containerClassName)}>
            <div className={classNames('rounded-5', styles.banner, className)} style={style}>
                <div className='container'>
                    {children}
                </div>
                { footer }
            </div>
        </div>
    )
}