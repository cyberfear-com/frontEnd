import classNames from 'classnames'
import styles from './Banner.module.scss'

export default function Banner({ className, children }) {
    return (
        <div className={classNames(className, styles.banner)}>
            <div className='container'>
                {children}
            </div>
        </div>
    )
}