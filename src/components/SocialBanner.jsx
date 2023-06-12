import classNames from 'classnames'
import { ReactComponent as TwitterIconSVG } from '@/assets/twitter-icon.svg'
import { ReactComponent as RedditIconSVG } from '@/assets/reddit-icon.svg'
import { ReactComponent as FacebookIconSVG } from '@/assets/facebook-icon.svg'
import styles from './SocialBanner.module.scss'

const links = [
    { title: 'Twitter', id: '@Mailum', icon: TwitterIconSVG },
    { title: 'Facebook', id: '@Mailum', icon: FacebookIconSVG },
    { title: 'Reddit', id: '@Mailum', icon: RedditIconSVG }
]

export default function SocialBanner() {
    return (
        <div className={classNames(styles.banner, 'bg-light rounded-5 p-3 p-md-5')}>
            <div className="m-4">
                <div className='small fw-medium opacity-40 text-center text-md-start'>
                    SOCIAL MEDIA
                </div>

                <h4 className='d-none d-md-block'>
                    Reach Us on Your Favorite <span className="text-primary">Social Media Platform</span>
                </h4>
                

                <h2 className='d-md-none text-center'>
                    
                    Reach Us on Your Favorite <span className="text-primary">Social Media Platform</span>
                </h2>

            {links.map(link => (
                <a class="d-inline-flex align-items-center text-decoration-none mt-4 mb-4 pe-3" href="">
                    <link.icon className="flex-shrink-0" />
                    <small className="flex-grow-1 ms-3 lh-sm">
                        <div className={classNames(styles.followUs, 'text-body-secondary')}>Follow Us on {link.title}</div>
                        <div className={classNames(styles.username, 'text-body mt-1')}><strong>{link.id}</strong></div>
                    </small>
                </a>
            ))}
            </div>
        </div>
    )
}
