
import classNames from 'classnames'
import specularImg from '@/assets/specular.png'
import searchIcon from '@/assets/search-icon.svg'
import { ReactComponent as RarrIconSVG } from '@/assets/rarr-icon.svg'
import styles from './HeroBanner.module.scss'

export default function HeroBanner() {
    return (
        <div className={classNames(styles.banner, 'col-12 bg-primary text-light rounded-5 text-center')}>
            <img src={specularImg} className={classNames(styles.specular, styles.left)} />
            <img src={specularImg} className={classNames(styles.specular, styles.right)} />

            <h1>How Can We Help You?</h1>
            <p className="lead opacity-50 mt-3 mb-4">
                Below you’ll find answers to the questions we<br />
                get asked the most about the Mailum.
            </p>

            <div className={classNames(styles.search, 'mx-auto')}>
                <input type="text" class="form-control bg-primary text-bg-primary" placeholder="What can we help you with?" />
                
                <RarrIconSVG className={styles.submit} role="button" onClick={() => console.log('hello')} />
            </div>
        </div>
    )
}